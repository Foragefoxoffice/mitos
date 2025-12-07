// src/utils/api.js
import axios from "axios";

/** =======================
 *  AXIOS INSTANCE + CONFIG
 *  ======================= */
const API = axios.create({
  baseURL: "https://mitoslearning.in/api",
});
const REFRESH_URL = "/auth/refresh";

/** =======================
 *  STORAGE HELPERS (safe)
 *  ======================= */
const storage = {
  get accessToken() {
    try { return localStorage.getItem("token"); }
    catch { return null; }
  },
  set accessToken(v) {
    try { v ? localStorage.setItem("token", v) : localStorage.removeItem("token"); }
    catch { }
  },

  get refreshToken() {
    try { return localStorage.getItem("refreshToken"); }
    catch { return null; }
  },
  set refreshToken(v) {
    try { v ? localStorage.setItem("refreshToken", v) : localStorage.removeItem("refreshToken"); }
    catch { }
  },

  get userId() {
    try { return localStorage.getItem("userId"); }
    catch { return null; }
  },
  set userId(v) {
    try { v ? localStorage.setItem("userId", v) : localStorage.removeItem("userId"); }
    catch { }
  },

  get role() {
    try { return localStorage.getItem("role"); }
    catch { return null; }
  },
  set role(v) {
    try { v ? localStorage.setItem("role", v) : localStorage.removeItem("role"); }
    catch { }
  },

  get user() {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  },
  set user(v) {
    try { v ? localStorage.setItem("user", JSON.stringify(v)) : localStorage.removeItem("user"); }
    catch { }
  },
};

function setAuthHeader(token) {
  if (token) API.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete API.defaults.headers.common.Authorization;
}

/** =======================
 *  JWT HELPERS
 *  ======================= */
function parseJwt(token) {
  try {
    const base64 = token.split(".")[1]?.replace(/-/g, "+").replace(/_/g, "/") || "";
    return JSON.parse(decodeURIComponent(escape(atob(base64))));
  } catch {
    return null;
  }
}
function isExpired(token) {
  const p = parseJwt(token);
  if (!p?.exp) return true;
  return Date.now() >= p.exp * 1000;
}

/** =======================
 *  PROACTIVE REFRESH TIMER
 *  ======================= */
let refreshTimer = null;
function clearRefreshTimer() {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}
function scheduleProactiveRefresh(accessToken) {
  clearRefreshTimer();
  const payload = parseJwt(accessToken);
  if (!payload?.exp) return;

  const delay = Math.max(payload.exp * 1000 - Date.now() - 60_000, 1000);

  refreshTimer = setTimeout(() => {
    refreshAccessToken().catch(() => logout());
  }, delay);
}

/** =======================
 *  PUBLIC TOKEN APIS
 *  ======================= */
export function setTokens(accessToken, refreshToken, extra = {}) {
  storage.accessToken = accessToken || null;
  storage.refreshToken = refreshToken || null;

  if (extra.userId !== undefined) storage.userId = extra.userId;
  if (extra.role !== undefined) storage.role = extra.role;
  if (extra.user !== undefined) storage.user = extra.user;

  setAuthHeader(accessToken);
  if (accessToken) scheduleProactiveRefresh(accessToken);
}

export function logout() {
  clearRefreshTimer();
  storage.accessToken = null;
  storage.refreshToken = null;
  storage.userId = null;
  storage.role = null;
  storage.user = null;
  setAuthHeader(null);

  try { window.location.assign("/login"); } catch { }
}

/** =======================
 *  REFRESH TOKEN (single-flight)
 *  ======================= */
let refreshing = null;

async function callRefresh() {
  const rt = storage.refreshToken;
  if (!rt) throw new Error("No refresh token");

  const res = await axios.post(`${API.defaults.baseURL}${REFRESH_URL}`, { refreshToken: rt });

  const newAT = res?.data?.accessToken;
  const newRT = res?.data?.refreshToken || rt;

  if (!newAT) throw new Error("Refresh failed: no accessToken in response");

  setTokens(newAT, newRT);
  return newAT;
}

function refreshAccessToken() {
  if (!refreshing) {
    refreshing = callRefresh()
      .catch((e) => { logout(); throw e; })
      .finally(() => { refreshing = null; });
  }
  return refreshing;
}

/** =======================
 *  INTERCEPTORS
 *  ======================= */
API.interceptors.request.use(
  (config) => {
    const t = storage.accessToken;
    if (t) config.headers.Authorization = `Bearer ${t}`;
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error;

    if (!response) return Promise.reject(error);
    if (config.__isRetry) return Promise.reject(error);

    if (response.status === 401 || response.status === 403) {
      try {
        const newToken = await refreshAccessToken();
        config.__isRetry = true;
        config.headers.Authorization = `Bearer ${newToken}`;
        return API(config);
      } catch (e) {
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

/** =======================
 *  LOAD AUTH ON BOOT
 *  ======================= */
export async function ensureAuthOnLoad() {
  const at = storage.accessToken;
  const rt = storage.refreshToken;

  if (at) setAuthHeader(at);

  if (!at && rt) {
    try { await refreshAccessToken(); } catch { }
    return;
  }

  if (at && isExpired(at)) {
    if (rt) {
      try { await refreshAccessToken(); } catch { }
    } else {
      logout();
    }
  } else if (at) {
    scheduleProactiveRefresh(at);
  }
}

/* ======================================================
   ✅ PHONE NORMALIZER (null-safe)
====================================================== */
function normalizePhone(phoneNumber) {
  if (!phoneNumber) return "";
  phoneNumber = String(phoneNumber).replace(/\s+/g, "");
  if (!phoneNumber.startsWith("+")) phoneNumber = "+91" + phoneNumber;
  return phoneNumber;
}

/* ======================================================
   ✅ WHATSAPP OTP (phoneNumber + login/register)
====================================================== */
export const sendWhatsappOtp = async (phoneNumber) => {
  phoneNumber = normalizePhone(phoneNumber);
  const { data } = await API.post("/auth/whatsapp/send-otp", { phoneNumber });
  return data;
};

export const verifyWhatsappOtp = async (
  phoneNumber,
  otp,
  registrationFields = null
) => {
  phoneNumber = normalizePhone(phoneNumber);

  const payload = {
    phoneNumber,
    otp,
    ...(registrationFields || {}), // { name, email, className } for new users
  };

  const { data } = await API.post("/auth/whatsapp/verify-otp", payload);

  // If backend says user must register, just bubble this up (no tokens yet)
  if (data?.requiresRegistration) return data;

  // Otherwise we got tokens → log the user in
  setTokens(data.accessToken, data.refreshToken, {
    userId: data?.user?.id,
    role: data?.role,
    user: data?.user,
  });

  return data;
};

/* ======================================================
   ✅ EMAIL OTP (email + login/register)
====================================================== */
export const sendEmailOtp = async (email) => {
  const { data } = await API.post("/auth/email/send-otp", { email });
  return data;
};

export const verifyEmailOtp = async (email, otp, registrationFields = null) => {
  const payload = {
    email,
    otp,
    ...(registrationFields || {}), // { name, phoneNumber, className }
  };

  const { data } = await API.post("/auth/email/verify-otp", payload);

  if (data?.requiresRegistration) return data;

  setTokens(data.accessToken, data.refreshToken, {
    userId: data?.user?.id,
    role: data?.role,
    user: data?.user,
  });

  return data;
};

/* ======================================================
   ✅ SIMPLE LOGIN CHECK
====================================================== */
export const isLoggedIn = () => !!storage.accessToken;
export const getCurrentUser = () => storage.user;

/* ======================================================
   📚 SUBJECTS / PORTIONS
====================================================== */
export const fetchSubjects = async () => (await API.get("/subjects")).data;
export const fetchPortions = async () => (await API.get("/portions")).data;
export const fetchSubjectsByPortions = async (portionId) =>
  (await API.get(`/subjects/subject/${portionId}`)).data;

/* ======================================================
   📘 CHAPTERS / TOPICS
====================================================== */
export const fetchChaptersBySubject = async (subjectId) =>
  (await API.get(`/chapters/chapter/${subjectId}`)).data;

export const fetchChapter = async (chapterId) =>
  (await API.get(`/chapters/chapter/${chapterId}`)).data;

export const fetchChapterTopics = async (chapterId) =>
  (await API.get(`/topics/chapter/${chapterId}`)).data;

export const fetchTopicsWithPDF = (chapterId) =>
  API.get(`/pdf/chapters/${chapterId}/topics-with-topic-pdfs`);

export const fetchTopics = (chapterId) =>
  API.get(`/topics/topic/${chapterId}`);

export const fetchQuestionType = () => API.get("/question-types");

/* ======================================================
   ❓ QUESTIONS
====================================================== */
export const fetchQuestionBychapter = (chapterId) =>
  API.get(`/questions/chapter/${chapterId}`);

export const fetchQuestionByTopic = (topicId) =>
  API.get(`/questions/topic/${topicId}`);

export const fetchQuestionByType = (typeId) =>
  API.get(`/questions/topic/${typeId}`);

export const fetchQuestion = (topicId) =>
  API.get(`/questions?topicId=${topicId}`);

export const fetchQuestions = (topics) => {
  const topicIds = topics.join(",");
  return API.get(`/questions/topics?topicIds=${topicIds}`);
};

export const fetchQuestionsByTypes = (selectedTypes, chapterId) => {
  const typeIds = selectedTypes.join(",");
  return API.get(`/questions/questiontype?questionTypeIds=${typeIds}&chapterId=${chapterId}`);
};

export const getQuestionsBySubjectAndQuestionId = (subjectId, typeIds) =>
  API.get(`/questions/by-subject-and-id?subjectId=${subjectId}&questiontypeId=${typeIds}`);

export const getQuestionsBySubjectAndChapterId = (subjectId, chapterId) =>
  API.get(`/questions/by-subject-and-chapter-id?subjectId=${subjectId}&chapterId=${chapterId}`);

/* ======================================================
   🧪 FULL TEST / CUSTOM TEST
====================================================== */
export const fetchFullTestQuestion = () => API.get(`/questions/fulltest`);
export const fetchFullTestByPortion = (portionId) =>
  API.get(`/questions/portion/${portionId}`);
export const fetchFullTestBySubject = (portionId, subjectId) =>
  API.get(`/questions/portion/${portionId}/subject/${subjectId}`);
export const fetchFullTestByChapter = (portionId, subjectId, chapterId) =>
  API.get(`/questions/portion/${portionId}/subject/${subjectId}/chapter/${chapterId}`);

export const fetchCustomTestQuestions = async (portionId, chapterIds, questionLimit) => {
  const { data } = await API.post("/questions/custom", {
    portionId,
    chapterIds,
    questionLimit,
  });
  return data;
};

/* ======================================================
   🏆 RESULTS / LEADERBOARD
====================================================== */
export const fetchResultByUser = (userId) => API.get(`/tests/${userId}`);

export const fetchLeaderBoard = async () =>
  (await API.get(`/tests/leaders`)).data;

/* ======================================================
   ⭐ FAVORITES
====================================================== */
export const checkFavoriteStatus = async (userId) =>
  (await API.get(`/fav-questions/${userId}`)).data;

export const addFavoriteQuestion = async (userId, questionId) =>
  (await API.post("/fav-questions", {
    userId: parseInt(userId, 10),
    questionId,
  })).data;

export const removeFavoriteQuestion = async (userId, questionId) =>
  (await API.delete("/fav-questions", {
    data: { userId: parseInt(userId, 10), questionId },
  })).data;

/* ======================================================
   🚨 WRONG QUESTION REPORTS
====================================================== */
export const reportWrongQuestion = async (questionId, reason) =>
  (await API.post("/wrong-reports", { questionId, reason })).data;

export const getAllWrongQuestionReports = async () =>
  (await API.get("/wrong-reports")).data;

export const updateWrongQuestionReportStatus = async (id, status) =>
  (await API.patch(`/wrong-reports/${id}`, { status })).data;

/* ======================================================
   📄 PDF MATERIALS
====================================================== */
export const fetchTopicPdfs = async (topicId) =>
  (await API.get(`/pdf/topic/${topicId}`)).data;

/* ======================================================
   🎁 FREE MATERIALS
====================================================== */
export const fetchFreeMaterialsBySubject = async (subjectId) =>
  (await API.get(`/freematerials/subject/${subjectId}`)).data;

export const fetchFreeMaterialsByChapter = async (chapterId) =>
  (await API.get(`/freematerials/chapter/${chapterId}`)).data;

/* ======================================================
   🔔 NOTIFICATION APIs
====================================================== */
export const saveFcmToken = async (fcmToken) =>
  (await API.post("/users/save-fcm-token", { fcmToken })).data;

export const fetchMyNotifications = async () =>
  (await API.get("/notifications/my")).data;

export const sendAdminNotification = async ({ title, message, sendToAll, userId }) =>
  (await API.post("/notifications/send", {
    title,
    message,
    sendToAll,
    userId,
  })).data;

export const markNotificationRead = async (id) =>
  (await API.patch(`/notifications/${id}/read`)).data;

export const markAllNotificationsRead = async () =>
  (await API.patch("/notifications/read-all")).data;

/* ======================================================
   💳 SUBSCRIPTION + PAYMENT
====================================================== */
export const startFreeTrial = async () =>
  (await API.post("/subscription/start-trial")).data;

export const validateSubscription = async () => {
  try {
    const { data } = await API.get("/subscription/validate");
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      return { status: "REGISTERED", premiumExpiry: null, trialEndsAt: null };
    }
    throw error;
  }
};

export const createRazorpayOrder = async (planType) =>
  (await API.post("/subscription/razorpay/create-order", { plan: planType })).data;

export const verifyRazorpayPayment = async (paymentData) =>
  (await API.post("/subscription/razorpay/verify", paymentData)).data;

/* ---------- GOOGLE SUBSCRIPTION ---------- */
export const verifyGoogleSubscription = async ({
  purchaseToken,
  productId,
  packageName,
}) =>
  (await API.post("/subscription/google/verify", {
    purchaseToken,
    productId,
    packageName,
  })).data;

/* ---------- APPLE SUBSCRIPTION ---------- */
export const verifyAppleSubscription = async ({ receiptData, isSandbox }) =>
  (await API.post("/subscription/apple/verify", {
    receiptData,
    isSandbox,
  })).data;

/* ======================================================
   👤 PROFILE
====================================================== */
export const getMe = () => API.get("/users/me");

export default API;
