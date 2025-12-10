import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdEmail, MdWhatsapp } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import {
  sendWhatsappOtp,
  sendEmailOtp,
  verifyWhatsappOtp,
  verifyEmailOtp,
} from "../../utils/api";
import useAuth from "../../contexts/useAuth"; // keep this if you already auto-refresh tokens

const features = [
  {
    title: "NCERT Coverage",
    description:
      "36000+ NCERT Line by Line NEET Questions, 10+ question types and past 34 years PYQs.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    title: "Error Analysis",
    description:
      "Personal in-depth analysis and mark booster for weak areas, chapters and patterns.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Tests & DPPs",
    description:
      "Unlimited customisable chapter tests, DPPs, full-length mocks and more.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2z"
        />
      </svg>
    ),
  },
];

export default function OtpAuthPage({ mode = "login" }) {
  const navigate = useNavigate();
  useAuth(); // still lets your app auto-refresh if already logged in

  // "whatsapp" | "email"
  const [loginMethod, setLoginMethod] = useState("whatsapp");
  const [step, setStep] = useState("ENTER_CONTACT"); // ENTER_CONTACT | ENTER_OTP | REGISTER

  const [contactValue, setContactValue] = useState(""); // phone or email
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Registration fields (only when backend says requiresRegistration)
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regClassName, setRegClassName] = useState("");

  // Small animation for left-side features
  const [activeFeature, setActiveFeature] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setActiveFeature((prev) => (prev + 1) % features.length),
      4500
    );
    return () => clearInterval(id);
  }, []);

  const resetAll = () => {
    setStep("ENTER_CONTACT");
    setContactValue("");
    setOtp("");
    setError("");
    setInfo("");
    setRegName("");
    setRegEmail("");
    setRegPhone("");
    setRegClassName("");
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!contactValue.trim()) {
      setError(
        `Please enter your ${loginMethod === "whatsapp" ? "WhatsApp number" : "email address"
        }`
      );
      return;
    }

    if (loginMethod === "whatsapp" && contactValue.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    if (loginMethod === "email" && !/\S+@\S+\.\S+/.test(contactValue)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setIsSendingOtp(true);
      if (loginMethod === "whatsapp") {
        await sendWhatsappOtp(contactValue);
      } else {
        await sendEmailOtp(contactValue);
      }
      setStep("ENTER_OTP");
      setInfo(
        `We’ve sent a verification code to your ${loginMethod === "whatsapp" ? "WhatsApp number" : "email address"
        }.`
      );
    } catch (err) {
      console.error("Send OTP error:", err);
      setError(err?.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    try {
      setIsVerifying(true);
      let res;
      if (loginMethod === "whatsapp") {
        res = await verifyWhatsappOtp(contactValue, otp);
      } else {
        res = await verifyEmailOtp(contactValue, otp);
      }

      // If backend says they must register
      if (res?.requiresRegistration) {
        setStep("REGISTER");
        // prefill known fields
        if (loginMethod === "whatsapp") {
          setRegPhone(contactValue);
        } else {
          setRegEmail(contactValue);
        }
        setInfo("Almost done! Please complete your profile.");
        return;
      }

      // Already logged in (tokens set in verify*), go to dashboard
      navigate("/user/dashboard");
    } catch (err) {
      console.error("Verify OTP error:", err);
      setError(
        err?.response?.data?.message ||
        "Invalid OTP. Please check the code and try again."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!regName.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!regClassName.trim()) {
      setError("Please enter your class");
      return;
    }

    const registrationFields =
      loginMethod === "whatsapp"
        ? {
          name: regName,
          email: regEmail,
          className: regClassName,
        }
        : {
          name: regName,
          phoneNumber: regPhone ? (regPhone.startsWith("+91") ? regPhone : "+91" + regPhone.replace(/\s+/g, "")) : "",
          className: regClassName,
        };

    try {
      setIsRegistering(true);
      let res;
      if (loginMethod === "whatsapp") {
        res = await verifyWhatsappOtp(contactValue, otp, registrationFields);
      } else {
        res = await verifyEmailOtp(contactValue, otp, registrationFields);
      }

      // verify* will set tokens when registrationFields are sent
      navigate("/user/dashboard");
    } catch (err) {
      console.error("Complete registration error:", err);
      setError(
        err?.response?.data?.message ||
        "Could not complete registration. Please try again."
      );
    } finally {
      setIsRegistering(false);
    }
  };

  const titleText =
    step === "REGISTER"
      ? "Create your account"
      : mode === "register"
        ? "Student Sign Up"
        : "Student Login";

  const subText =
    step === "ENTER_CONTACT"
      ? loginMethod === "whatsapp"
        ? "Enter your WhatsApp number to continue"
        : "Enter your email address to continue"
      : step === "ENTER_OTP"
        ? "Enter the 6-digit verification code sent to you"
        : "Fill in your details to complete your registration";

  const currentStepIndex =
    step === "ENTER_CONTACT" ? 0 : step === "ENTER_OTP" ? 1 : 2;

  const stepsMeta = [
    { key: "ENTER_CONTACT", label: "Contact", sub: "Phone / Email" },
    { key: "ENTER_OTP", label: "Verify", sub: "Enter OTP" },
    { key: "REGISTER", label: "Profile", sub: "Complete details" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Soft gradient background */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse animation-delay-4000" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(22)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-white/40 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 6}s`,
              opacity: 0.15 + Math.random() * 0.3,
            }}
          />
        ))}
      </div>

      {/* Main card */}
      <div className="w-full max-w-6xl relative z-10">
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/15 shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* LEFT: Marketing / Option A hero */}
            <div className="lg:w-[46%] bg-gradient-to-br from-[#1B0533] via-[#35095E] to-[#007ACC] text-white p-6 md:p-10 relative overflow-hidden">
              {/* subtle pattern */}
              <div className="absolute inset-0 opacity-15">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 25% 25%, white 1px, transparent 0)",
                    backgroundSize: "40px 40px",
                    animation: "pan 22s linear infinite",
                  }}
                />
              </div>

              <div className="relative z-10 h-full flex flex-col">
                {/* Badge & heading */}
                <div className="mb-6">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium mb-4 gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/90 text-white text-[10px] font-bold">
                      NEET
                    </span>
                    <span>AI-Powered Practice & Analysis</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold mb-3 leading-tight bg-gradient-to-r from-white via-cyan-100 to-emerald-200 bg-clip-text text-transparent">
                    Welcome to Mitos Learning
                  </h2>
                  <p className="text-sm md:text-base text-cyan-100/90 leading-relaxed max-w-md" style={{ color: "#cefafe" }}>
                    Unlock personalised question sets, deep error analysis and
                    exam-level mock tests crafted to push you above{" "}
                    <span className="font-semibold">650+ in NEET.</span>
                  </p>
                </div>

                {/* Feature carousel */}
                <div className="space-y-4 mb-6 md:mb-8">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-4 p-4 rounded-2xl transition-all duration-500 transform ${activeFeature === index
                          ? "bg-white/18 scale-[1.03] shadow-xl shadow-black/30 border border-white/30"
                          : "bg-white/6 scale-100 opacity-80 border border-white/10"
                        }`}
                    >
                      <div
                        className={`p-3 rounded-2xl transition-all duration-500 ${activeFeature === index
                            ? "bg-white/30 -translate-y-0.5"
                            : "bg-white/15"
                          }`}
                      >
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base md:text-lg mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-xs md:text-[13px] text-cyan-100/90 leading-relaxed" style={{ color: "#cefafe" }}>
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom stats / testimonial */}
                <div className="mt-auto grid grid-cols-2 gap-3 text-xs md:text-sm">
                  <div className="rounded-2xl bg-black/20 border border-white/15 p-3 flex flex-col justify-between">
                    <div className="text-[11px] uppercase tracking-wide text-cyan-100/70 mb-1">
                      Students trained
                    </div>
                    <div className="text-xl md:text-2xl font-bold">10,000+</div>
                    <div className="text-[11px] text-cyan-100/70 mt-1">
                      Real exam style practice & analysis.
                    </div>
                  </div>
                  <div className="rounded-2xl bg-black/15 border border-white/15 p-3 flex flex-col justify-between">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-yellow-300 text-sm">★</span>
                      <span className="text-[11px] uppercase tracking-wide text-cyan-100/70">
                        Trusted by toppers
                      </span>
                    </div>
                    <div className="text-[11px] text-cyan-100/85 leading-snug">
                      &quot;The chapter-wise tests and error analysis made my
                      revision 10x sharper.&quot;
                    </div>
                    <div className="text-[11px] text-cyan-100/70 mt-1">
                      – NEET Aspirant, 2025 Batch
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Auth card (Option A style) */}
            <div className="lg:w-[54%] bg-white/95 p-5 md:p-8">
              <div className=" mx-auto">
                {/* Logo + small tag */}
                <div className="flex items-center justify-between mb-4">
                  <a href="/" className="group flex items-center gap-2">
                    <div className="relative">
                      <img
                        src="/images/logo/logo.png"
                        alt="Mitos Learning Logo"
                        className="w-50 group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>

                  </a>
                  <div className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900/5 text-slate-500 border border-slate-200">
                    100% secure OTP login
                  </div>
                </div>

                {/* Stepper */}
                {/* <div className="mb-6">
                  <div className="flex items-center justify-between gap-3">
                    {stepsMeta.map((s, idx) => {
                      const active = idx === currentStepIndex;
                      const completed = idx < currentStepIndex;
                      return (
                        <div key={s.key} className="flex-1 flex flex-col items-center">
                          <div className="flex items-center w-full">
                            <div className="flex flex-col items-center">
                              <div
                                className={`h-6 w-6 rounded-full text-[11px] flex items-center justify-center font-semibold border ${
                                  active
                                    ? "bg-[#35095E] text-white border-[#35095E]"
                                    : completed
                                    ? "bg-emerald-500 text-white border-emerald-500"
                                    : "bg-white text-slate-400 border-slate-200"
                                }`}
                              >
                                {completed ? "✓" : idx + 1}
                              </div>
                            </div>
                            {idx < stepsMeta.length - 1 && (
                              <div className="flex-1 h-[2px] mx-2 rounded-full bg-slate-200 overflow-hidden">
                                <div
                                  className={`h-full transition-all duration-500 ${
                                    completed
                                      ? "w-full bg-emerald-500"
                                      : active
                                      ? "w-1/2 bg-[#35095E]"
                                      : "w-0 bg-transparent"
                                  }`}
                                />
                              </div>
                            )}
                          </div>
                          <div className="mt-1 text-center">
                            <div
                              className={`text-[11px] font-semibold uppercase tracking-wide ${
                                active
                                  ? "text-[#35095E]"
                                  : completed
                                  ? "text-emerald-600"
                                  : "text-slate-400"
                              }`}
                            >
                              {s.label}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {s.sub}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div> */}

                {/* Title + subtitle */}
                <div className="text-center my-7">
                  <h1 className="text-2xl md:text-3xl font-bold mb-2 text-slate-900">
                    {titleText}
                  </h1>
                  <p className="text-xs md:text-sm text-slate-500">{subText}</p>
                </div>

                {/* Step 1: enter phone/email */}
                {step === "ENTER_CONTACT" && (
                  <form
                    onSubmit={handleSendOtp}
                    className="space-y-6 grid gap-5 bg-slate-50/80 border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm"
                  >
                    {/* Toggle method */}
                    <div className="flex bg-white rounded-full p-1 mb-1 border border-slate-200">
                      <button
                        type="button"
                        onClick={() => {
                          setLoginMethod("whatsapp");
                          setContactValue("");
                          setError("");
                          setInfo("");
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-full text-xs md:text-sm font-semibold transition-all ${loginMethod === "whatsapp"
                            ? "bg-[#35095E] text-white shadow-sm shadow-[#35095E]/40"
                            : "text-[#35095E] hover:bg-slate-50"
                          }`}
                      >
                        <FaWhatsapp className="text-lg" />
                        <span>WhatsApp</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginMethod("email");
                          setContactValue("");
                          setError("");
                          setInfo("");
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-full text-xs md:text-sm font-semibold transition-all ${loginMethod === "email"
                            ? "bg-[#35095E] text-white shadow-sm shadow-[#35095E]/40"
                            : "text-[#35095E] hover:bg-slate-50"
                          }`}
                      >
                        <MdEmail className="text-lg" />
                        <span>Email</span>
                      </button>
                    </div>

                    {/* Input */}
                    <div>
                      <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-2">
                        {loginMethod === "whatsapp"
                          ? "WhatsApp Number"
                          : "Email Address"}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center border border-slate-200 rounded-xl px-3 md:px-4 bg-white focus-within:border-[#35095E] focus-within:ring-2 focus-within:ring-[#35095E]/15 transition-all">
                        {loginMethod === "whatsapp" ? (
                          <FaWhatsapp className="text-green-500 mr-2 text-lg flex-shrink-0" />
                        ) : (
                          <MdEmail className="text-slate-500 mr-2 text-lg flex-shrink-0" />
                        )}
                        <input
                          type={loginMethod === "whatsapp" ? "tel" : "email"}
                          value={contactValue}
                          onChange={(e) => setContactValue(e.target.value)}
                          placeholder={
                            loginMethod === "whatsapp"
                              ? "Enter WhatsApp number"
                              : "Enter email address"
                          }
                          className="w-full py-2.5 md:py-3 bg-transparent focus:outline-none text-sm md:text-base text-slate-900 placeholder-slate-400"
                        />
                      </div>
                      <p className="mt-1 text-[11px] text-slate-400">
                        We&apos;ll use this only to send your OTP. No spam, ever.
                      </p>
                    </div>

                    {error && (
                      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-3 py-2.5 rounded-xl text-xs md:text-sm">
                        {error}
                      </div>
                    )}

                    {info && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 px-3 py-2.5 rounded-xl text-xs md:text-sm">
                        {info}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSendingOtp}
                      className="w-full cursor-pointer bg-[#35095E] text-white py-2.5 md:py-3 px-6 rounded-xl text-sm md:text-base font-bold hover:bg-[#2a0649] focus:ring-4 focus:ring-purple-200/70 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSendingOtp ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          Sending OTP...
                        </>
                      ) : (
                        <>
                          Send OTP
                          <span className="text-lg">➡️</span>
                        </>
                      )}
                    </button>

                    <div className="text-[11px] text-slate-400 text-center">
                      Having trouble? You can switch between WhatsApp and Email
                      anytime.
                    </div>
                  </form>
                )}

                {/* Step 2: enter OTP */}
                {step === "ENTER_OTP" && (
                  <form
                    onSubmit={handleVerifyOtp}
                    className="space-y-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm"
                  >
                    <div className="text-center text-xs md:text-sm text-slate-500 mb-1">
                      We sent an OTP to{" "}
                      <span className="font-semibold text-slate-800">
                        {loginMethod === "whatsapp"
                          ? `+91 ${contactValue}`
                          : contactValue}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-2">
                        Enter 6-digit OTP
                      </label>
                      <div className="flex gap-2 justify-center">
                        <input
                          type="text"
                          maxLength={6}
                          value={otp}
                          onChange={(e) =>
                            setOtp(e.target.value.replace(/\D/g, ""))
                          }
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-center tracking-[0.4em] text-2xl font-bold text-[#35095E] bg-white focus:outline-none focus:border-[#35095E] focus:ring-2 focus:ring-[#35095E]/20"
                        />
                      </div>
                      <p className="mt-1 text-[11px] text-slate-400 text-center">
                        Didn&apos;t get it? Check spam / promotions or request a new
                        OTP below.
                      </p>
                    </div>

                    {error && (
                      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-3 py-2.5 rounded-xl text-xs md:text-sm">
                        {error}
                      </div>
                    )}

                    {info && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 px-3 py-2.5 rounded-xl text-xs md:text-sm">
                        {info}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isVerifying}
                      className="w-full cursor-pointer bg-[#35095E] text-white py-2.5 md:py-3 px-6 rounded-xl text-sm md:text-base font-bold hover:bg-[#2a0649] focus:ring-4 focus:ring-purple-200/70 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isVerifying ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          Verifying...
                        </>
                      ) : (
                        <>
                          Verify &amp; Continue
                          <span>✅</span>
                        </>
                      )}
                    </button>

                    <div className="flex justify-between text-[11px] text-slate-500 mt-2">
                      <button
                        type="button"
                        className="underline underline-offset-2 hover:text-slate-700"
                        onClick={resetAll}
                      >
                        Use different{" "}
                        {loginMethod === "whatsapp" ? "number" : "email"}
                      </button>
                      <button
                        type="button"
                        className="underline underline-offset-2 hover:text-slate-700"
                        onClick={handleSendOtp}
                      >
                        Resend OTP
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 3: registration form (when requiresRegistration === true) */}
                {step === "REGISTER" && (
                  <form
                    onSubmit={handleCompleteRegistration}
                    className="space-y-5 bg-slate-50/80 border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm"
                  >
                    <div className="text-center text-xs md:text-sm text-slate-500 mb-1">
                      Verified{" "}
                      <span className="font-semibold text-slate-800">
                        {loginMethod === "whatsapp"
                          ? `+91 ${contactValue}`
                          : contactValue}
                      </span>
                      . Please complete your profile.
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 md:py-3 bg-white focus:outline-none focus:border-[#35095E] focus:ring-2 focus:ring-[#35095E]/20 text-sm md:text-base"
                        placeholder="Enter your full name"
                      />
                    </div>

                    {loginMethod === "whatsapp" ? (
                      <div>
                        <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1">
                          Email (optional)
                        </label>
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 md:py-3 bg-white focus:outline-none focus:border-[#35095E] focus:ring-2 focus:ring-[#35095E]/20 text-sm md:text-base"
                          placeholder="Enter your email"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1">
                          Phone Number (optional)
                        </label>
                        <input
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 md:py-3 bg-white focus:outline-none focus:border-[#35095E] focus:ring-2 focus:ring-[#35095E]/20 text-sm md:text-base"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1">
                        Class / Grade <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={regClassName}
                        onChange={(e) => setRegClassName(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 md:py-3 bg-white focus:outline-none focus:border-[#35095E] focus:ring-2 focus:ring-[#35095E]/20 text-sm md:text-base"
                      >
                        <option value="">Select your class/grade</option>
                        <option value="CLASS_11">Class 11</option>
                        <option value="CLASS_12">Class 12</option>
                        <option value="REPEATER">Repeater</option>
                      </select>
                    </div>

                    {error && (
                      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-3 py-2.5 rounded-xl text-xs md:text-sm">
                        {error}
                      </div>
                    )}

                    {info && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 px-3 py-2.5 rounded-xl text-xs md:text-sm">
                        {info}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isRegistering}
                      className="w-full cursor-pointer bg-[#35095E] text-white py-2.5 md:py-3 px-6 rounded-xl text-sm md:text-base font-bold hover:bg-[#2a0649] focus:ring-4 focus:ring-purple-200/70 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isRegistering ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          Creating account...
                        </>
                      ) : (
                        <>
                          Complete Registration
                          <span>🎉</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={resetAll}
                      className="w-full mt-2 text-[11px] text-slate-500 underline underline-offset-2 hover:text-slate-700"
                    >
                      Start over
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Local keyframes just for this page */}
      <style jsx="true">{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-18px) rotate(180deg);
          }
        }
        @keyframes pan {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(-60px, -60px);
          }
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
