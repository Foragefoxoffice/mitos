import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export default function AdminRegister() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("https://mitoslearning.in/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role: "user" }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data.user.id);
        navigate("/user/dashboard");
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign-In success
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch("https://mitoslearning.in/api/auth/google-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data.user.id);

        navigate("/user/dashboard");
      } else {
        setError(data.message || "Google authentication failed.");
      }
    } catch (err) {
      console.error("Google Login error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleGoogleError = () => {
    setError("Google Sign-In failed. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId="501560257854-oor7kgad2o2dk9l2qhv5ekd5ilmt9h0r.apps.googleusercontent.com">
      <div className="container p-10">
        <div className="flex w-full">
          {/* Left Side (illustration) */}
          <div className="w-[40%] hidden md:flex">
            <div className="login">
              <div className="login_img">
                <img src="/images/login/login_img.png"   referrerPolicy="no-referrer" alt="Login Illustration" />
              </div>
              <div className="flying_logo">
                <img src="/images/login/pop1.png"   referrerPolicy="no-referrer" alt="pop1" />
                <img src="/images/login/pop2.png"   referrerPolicy="no-referrer" alt="pop2" />
              </div>
            </div>
          </div>

          {/* Right Side (form) */}
          <div className="md:w-[60%] w-full">
            <div className="login_content">
              <div className="logo">
                <img src="/images/logo/logo.png"   referrerPolicy="no-referrer" alt="Logo" />
              </div>

              <h1 className="font-bold text-5xl text-center text-[#35095e] pt-6">Create Account</h1>

              <form onSubmit={handleSubmit} className="mt-6">
                {/* Email Input */}
                <div className="mb-4">
                  <label>Email address<span>*</span></label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>

                {/* Password Input */}
                <div className="mb-4">
                  <label>Password<span>*</span></label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Your Password"
                  />
                </div>

                {/* Name Input */}
                <div className="mb-4">
                  <label>User Name<span>*</span></label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter User Name"
                  />
                </div>

                {/* Error Message */}
                {error && <p className="text-red-500">{error}</p>}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="login_btn flex bg-[#007ACC] items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading && (
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
                  )}
                  {isLoading ? "Registering..." : "Create Account"}
                </button>
              </form>

              <div className="mt-4 flex justify-center">
                <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
              </div>

              <p className="mt-2 text-black text-center">
                Already have an account?{" "}
                <a href="/login" className="text-[#35095E]">Login here</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
