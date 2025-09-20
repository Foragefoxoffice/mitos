// Dashboard.js
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { TbBulb } from "react-icons/tb";
import { LuNotebookPen } from "react-icons/lu";
import { RiBook2Line } from "react-icons/ri";
import { HiArrowSmallLeft } from "react-icons/hi2";
import { FiSearch, FiX } from "react-icons/fi";

/* ----------------------- reusable search ----------------------- */
const SearchBar = ({ value, onChange, placeholder = "Search..." }) => (
  <div className="relative w-full max-w-xs md:max-w-md">
    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#007acc]" />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-10 pr-10 py-2 rounded-lg border border-[#cfe9fb] focus:outline-none focus:ring-2 focus:ring-[#007acc] text-[#00497a]"
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange("")}
        className="absolute right-3 top-1/2 -translate-y-1/2"
        aria-label="Clear search"
      >
        <FiX className="text-[#4b6b86] bg-[#fff]" />
      </button>
    )}
  </div>
);

/* ----------------------- profile completion modal ----------------------- */
const ProfileCompletionModal = ({
  open,
  values,
  setValues,
  onSubmit,
  submitting,
  error,
  errors = {},
  onValidate,
}) => {
  if (!open) return null;

  const [touched, setTouched] = useState({
    phoneNumber: false,
    className: false,
  });

  const classOptions = [
    { label: "Select class…", value: "" },
    { label: "Class 11", value: "CLASS_11" },
    { label: "Class 12", value: "CLASS_12" },
    { label: "Repeater", value: "REPEATER" },
  ];

  const phoneInvalid =
    !!errors.phoneNumber && (touched.phoneNumber || submitting);
  const classInvalid = !!errors.className && (touched.className || submitting);

  const setTouchedField = (k) =>
    setTouched((t) => ({ ...t, [k]: true }));

  const handlePhoneChange = (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setValues((v) => ({ ...v, phoneNumber: onlyDigits }));
    onValidate && onValidate({ ...values, phoneNumber: onlyDigits });
  };

  const handleClassChange = (e) => {
    const val = e.target.value;
    setValues((v) => ({ ...v, className: val }));
    onValidate && onValidate({ ...values, className: val });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-[92%] max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-xl font-semibold text-[#00497a] mb-1">
          Complete your profile
        </h3>
        <p className="text-sm text-[#4b6b86] mb-4">
          Please add your mobile number and class to continue.
        </p>

        <div className="space-y-4">
          {/* Phone */}
          <div>
            <label className="block text-sm text-[#00497a] mb-1">
              Mobile number (India)
            </label>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="10-digit mobile (starts with 6–9)"
              className={[
                "w-full rounded-lg px-3 py-2 text-black focus:outline-none",
                phoneInvalid
                  ? "border border-red-500 ring-1 ring-red-300 focus:ring-red-500"
                  : "border border-[#cfe9fb] focus:ring-2 focus:ring-[#007acc]",
              ].join(" ")}
              value={values.phoneNumber}
              onChange={handlePhoneChange}
              onBlur={() => setTouchedField("phoneNumber")}
            />
            {phoneInvalid && (
              <p className="mt-1 text-xs text-red-600">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Class */}
          <div>
            <label className="block text-sm text-[#00497a] mb-1">
              Class
            </label>
            <select
              className={[
                "w-full rounded-lg px-3 py-2 bg-white text-black focus:outline-none",
                classInvalid
                  ? "border border-red-500 ring-1 ring-red-300 focus:ring-red-500"
                  : "border border-[#cfe9fb] focus:ring-2 focus:ring-[#007acc]",
              ].join(" ")}
              value={values.className}
              onChange={handleClassChange}
              onBlur={() => setTouchedField("className")}
            >
              {classOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {classInvalid && (
              <p className="mt-1 text-xs text-red-600">{errors.className}</p>
            )}
          </div>

          {/* Server/top-level error */}
          {error ? <div className="text-sm text-red-600">{error}</div> : null}

          <button
            onClick={onSubmit}
            disabled={submitting}
            className="w-full bg-[#007ACC] text-white font-semibold rounded-lg py-2 hover:opacity-95 disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save & continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ----------------------- main dashboard ----------------------- */
export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  // profile state
  const [user, setUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileValues, setProfileValues] = useState({
    phoneNumber: "",
    className: "",
  });
  const [profileErrors, setProfileErrors] = useState({
    phoneNumber: "",
    className: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");

  const validateProfile = (vals) => {
    const errors = { phoneNumber: "", className: "" };
    const phone = (vals.phoneNumber || "").replace(/\D/g, "");
    if (!phone) errors.phoneNumber = "Mobile number is required.";
    else if (!/^[6-9]\d{9}$/.test(phone))
      errors.phoneNumber = "Enter a valid Indian mobile.";
    if (!vals.className) errors.className = "Please select your class.";
    return { errors, isValid: !errors.phoneNumber && !errors.className };
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    (async () => {
      try {
        const res = await fetch("https://mitoslearning.in/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user profile");
        const data = await res.json();
        const u = data?.user ?? data;
        setUser(u);

        setProfileValues({
          phoneNumber: u?.phoneNumber ? String(u.phoneNumber).slice(0, 10) : "",
          className: u?.className ?? "",
        });

        const phoneOk = !!u?.phoneNumber;
        const classOk = !!u?.className;
        setShowProfileModal(!(phoneOk && classOk));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const handleSaveProfile = async () => {
    const { errors, isValid } = validateProfile(profileValues);
    setProfileErrors(errors);
    if (!isValid) {
      setProfileError("Please fix the highlighted fields.");
      return;
    }

    try {
      setSavingProfile(true);
      const token = localStorage.getItem("token");
      const fd = new FormData();
      fd.append("phoneNumber", profileValues.phoneNumber);
      fd.append("className", profileValues.className);

      const res = await fetch(
        `https://mitoslearning.in/api/users/update-profile/${user.id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        }
      );

      if (!res.ok) throw new Error("Failed to update profile");

      setUser((u) => ({
        ...(u || {}),
        phoneNumber: profileValues.phoneNumber,
        className: profileValues.className,
      }));
      setShowProfileModal(false);
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const tabDetails = {
    practice: {
      label: "Practice",
      icon: <TbBulb className="inline mr-1" />,
      path: "/user/dashboard/practice/subjects",
    },
    test: {
      label: "Test",
      icon: <LuNotebookPen className="inline mr-1" />,
      path: "/user/dashboard/test/portions",
    },
    study: {
      label: "Study Material",
      icon: <RiBook2Line className="inline mr-1" />,
      path: "/user/dashboard/study/subjects",
    },
  };

  const getActiveTabFromUrl = () => {
    if (location.pathname.includes("/practice")) return "practice";
    if (location.pathname.includes("/test")) return "test";
    if (location.pathname.includes("/study")) return "study";
    return "practice";
  };
  const activeTab = getActiveTabFromUrl();

  return (
    <div className="pt-6">
      {/* ✅ Profile completion modal */}
      <ProfileCompletionModal
        open={showProfileModal}
        values={profileValues}
        setValues={setProfileValues}
        onSubmit={handleSaveProfile}
        submitting={savingProfile}
        error={profileError}
        errors={profileErrors}
        onValidate={(vals) => setProfileErrors(validateProfile(vals).errors)}
      />

      {/* HEADER + TABS */}
      <div className="sticky top-0 z-50">
        {/* Mobile Header */}
        <div className="flex items-center sm:hidden justify-between px-5 py-4 rounded-3xl bg-white shadow mb-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-3 py-1.5 rounded-xl bg-[#007ACC] text-white"
          >
            <HiArrowSmallLeft className="text-lg" />
          </button>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search..."
          />
        </div>

        {/* Desktop Header */}
        <div className="flex flex-col md:flex-row md:items-center rounded-4xl bg-white md:justify-between gap-3 px-5 py-6 shadow">
          <div className="hidden sm:flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center px-3 py-1.5 rounded-xl bg-[#007ACC] text-white"
            >
              <HiArrowSmallLeft className="text-lg" />
              <span className="ml-1">Back</span>
            </button>
          </div>
          <div className="flex space-x-2 md:space-x-4">
            {Object.keys(tabDetails).map((tabKey) => (
              <button
                key={tabKey}
                className={`px-4 py-2 rounded-3xl font-semibold transform transition-all duration-200 
                  ${
                    activeTab === tabKey
                      ? "bg-[#007ACC] text-white shadow-md scale-105"
                      : "bg-[#dff4ff] text-[#00497A] hover:bg-[#bfe7ff] hover:scale-105 active:scale-95"
                  }`}
                onClick={() => navigate(tabDetails[tabKey].path)}
              >
                {tabDetails[tabKey].icon}
                {tabDetails[tabKey].label}
              </button>
            ))}
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search..."
            />
          </div>
        </div>
      </div>

      {/* Nested content */}
      <div className={showProfileModal ? "opacity-40 pointer-events-none mt-6" : "mt-6"}>
        <Outlet context={{ searchTerm }} />
      </div>
    </div>
  );
}
