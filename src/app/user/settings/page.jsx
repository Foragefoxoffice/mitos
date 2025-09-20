import { useEffect, useMemo, useState } from "react";
import CommonLoader from "../../../components/commonLoader";

const PHONE_REGEX = /^(?:\+?91[-\s]?)?[6-9]\d{9}$/; // Indian 10-digit, optional +91
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,}$/;

export default function UserSettings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    age: "",
    gender: "",
    password: "",
  });

  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch current user
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication required. Please log in.");

        const res = await fetch("https://mitoslearning.in/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Failed to fetch profile (HTTP ${res.status})`);

        const data = await res.json();
        setUser(data);

        setFormData({
          name: data?.name || "",
          phoneNumber: data?.phoneNumber || "",
          age: data?.age ? String(data.age) : "",
          gender: data?.gender || "",
          password: "",
        });

        if (data?.profile) {
          setProfilePreview(
            data.profile.startsWith("http")
              ? data.profile
              : `https://mitoslearning.in${data.profile}`
          );
        }
      } catch (e) {
        setError(e.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Validation
  const errors = useMemo(() => {
    const e = {};

    if (!formData.name.trim()) e.name = "Please enter your full name.";

    if (!formData.phoneNumber.trim()) {
      e.phoneNumber = "Please enter your phone number.";
    } else if (!PHONE_REGEX.test(formData.phoneNumber.trim())) {
      e.phoneNumber = "Enter a valid Indian mobile number (10 digits, +91 optional).";
    }

    if (formData.age) {
      const age = Number(formData.age);
      if (Number.isNaN(age) || !Number.isInteger(age))
        e.age = "Age must be a whole number.";
      else if (age < 13 || age > 120) e.age = "Age must be between 13 and 120.";
    }

    if (formData.password && !PASSWORD_REGEX.test(formData.password)) {
      e.password = "Min 8 chars with at least 1 letter and 1 number.";
    }

    return e;
  }, [formData]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const markTouched = (name) => setTouched((t) => ({ ...t, [name]: true }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "age") {
      if (value === "" || /^\d{0,3}$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }
    if (name === "phoneNumber") {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\s+/g, "") }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (jpeg, png, webp, etc.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be under 5 MB.");
      return;
    }
    setProfileImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setProfilePreview(reader.result?.toString() || "");
    reader.readAsDataURL(file);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setTouched({
    name: true,
    phoneNumber: true,
    age: true,
    gender: true,
    password: true,
  });
  if (!isValid) return;

  try {
    setIsSubmitting(true);
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required. Please log in.");

    const fd = new FormData();
    fd.append("name", formData.name.trim());

    // ✅ Normalize phone (only 10 digits)
    const cleanPhone = formData.phoneNumber.replace(/\D/g, "").slice(-10);
    fd.append("phoneNumber", cleanPhone);

    // ✅ Ensure age is number, skip if empty
    if (formData.age) fd.append("age", String(Number(formData.age)));

    // ✅ Normalize gender to backend values
    const genderMap = {
      male: "MALE",
      female: "FEMALE",
      other: "OTHER",
      "prefer-not-to-say": "PREFER_NOT_TO_SAY",
    };
    if (formData.gender) {
      fd.append("gender", genderMap[formData.gender] || formData.gender);
    }

    if (formData.password) fd.append("password", formData.password);
    if (profileImage) fd.append("profile", profileImage);

    const res = await fetch(
      `https://mitoslearning.in/api/users/update-profile/${user?.id}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      }
    );

    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json?.message || "Profile update failed");

    // ✅ Correctly extract updated user
    const updated =
      json.updatedUser || json.user || json.data || json; // flexible parsing
    setUser(updated);

    if (updated?.profile) {
      setProfilePreview(
        updated.profile.startsWith("http")
          ? updated.profile
          : `https://mitoslearning.in${updated.profile}`
      );
    }

    setFormData((prev) => ({ ...prev, password: "" }));
    alert("Profile updated successfully!");
  } catch (e) {
    alert(e.message || "Failed to update profile");
  } finally {
    setIsSubmitting(false);
  }
};


  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <CommonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto p-6 rounded-xl bg-red-50 border border-red-200">
        <p className="text-red-700 font-semibold mb-2">Error loading profile</p>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const fieldHint = (text) => <p className="mt-1 text-xs text-gray-500">{text}</p>;
  const fieldError = (name) =>
    touched[name] && errors[name] ? (
      <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
    ) : null;

  const passwordStrength =
    formData.password.length >= 8
      ? PASSWORD_REGEX.test(formData.password)
        ? "Strong"
        : "Weak"
      : formData.password
      ? "Too short"
      : "";

  return (
    <div className="mx-auto p-5 md:p-8">
      {/* Header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              {profilePreview ? (
                <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-gray-200">
                  <img
                    src={profilePreview}
                    alt="Profile"
                      referrerPolicy="no-referrer"
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.currentTarget.src = "/images/user/default.png";
                    }}
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 ring-2 ring-gray-300 flex items-center justify-center">
                  <span className="text-xl">👤</span>
                </div>
              )}

              <label className="absolute -bottom-1 -right-1 bg-[#35095E] hover:bg-[#4b1492] text-white rounded-full p-2 cursor-pointer shadow-md">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </label>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user?.name || "User"}</h2>
              <p className="text-sm text-gray-500">{user?.email || ""}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#35095E] text-white hover:bg-[#4b1492]"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm space-y-6"
        noValidate
      >
        {/* Name + Phone */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Full Name <span className="text-red-600">*</span>
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => markTouched("name")}
              placeholder="Your full name"
              className={`w-full p-3 rounded-lg border ${
                touched.name && errors.name ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#35095E]`}
            />
            {fieldHint("This name will be shown on your profile.")}
            {fieldError("name")}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Phone Number <span className="text-red-600">*</span>
            </label>
            <input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              onBlur={() => markTouched("phoneNumber")}
              inputMode="tel"
              placeholder="+91XXXXXXXXXX or 9XXXXXXXXX"
              className={`w-full p-3 rounded-lg border ${
                touched.phoneNumber && errors.phoneNumber
                  ? "border-red-500"
                  : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#35095E]`}
            />
            {fieldHint("10-digit Indian mobile. +91 prefix optional.")}
            {fieldError("phoneNumber")}
          </div>
        </div>

        {/* Age + Gender */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Age</label>
            <input
              name="age"
              value={formData.age}
              onChange={handleChange}
              onBlur={() => markTouched("age")}
              placeholder="e.g., 18"
              className={`w-full p-3 rounded-lg border ${
                touched.age && errors.age ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#35095E]`}
            />
            {fieldHint("Optional. If provided, must be between 13 and 120.")}
            {fieldError("age")}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              onBlur={() => markTouched("gender")}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#35095E] bg-white"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
            {fieldHint("Optional.")}
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">New Password</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={() => markTouched("password")}
            placeholder="Leave blank to keep current"
            className={`w-full p-3 rounded-lg border ${
              touched.password && errors.password ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-[#35095E]`}
          />
          <div className="mt-1 flex items-center justify-between">
            {fieldHint("Min 8 characters, must include at least 1 letter & 1 number.")}
            {formData.password && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  passwordStrength === "Strong"
                    ? "bg-green-100 text-green-700"
                    : passwordStrength === "Too short"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {passwordStrength}
              </span>
            )}
          </div>
          {fieldError("password")}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className={`w-full mt-6 rounded-xl py-3 font-semibold text-white transition ${
            isSubmitting || !isValid
              ? "bg-[#35095E]/50 cursor-not-allowed"
              : "bg-[#35095E] hover:bg-[#4b1492]"
          }`}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {/* Mobile logout */}
      <div className="md:hidden mt-4">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-xl py-3 font-semibold bg-gray-100 text-gray-800 hover:bg-gray-200"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
