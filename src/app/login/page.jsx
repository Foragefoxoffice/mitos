import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import useAuth from "../../contexts/useAuth";
import { setUserRole } from "@/utils/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useAuth(); // Handles auto token refresh

  // Handle form-based login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("https://mitoslearning.in/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.role !== "user") {
          setError("Access restricted to student users only.");
          setIsLoading(false);
          return;
        }

        // ✅ Store tokens and user data in localStorage
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("userId", data.user.id);
        setUserRole(data.role);

        navigate("/user/dashboard"); // 🔄 useNavigate instead of router.push
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Sign-In success
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch(
        "https://mitoslearning.in/api/auth/google-auth",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential: credentialResponse.credential }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data.role !== "user") {
          setError("Access restricted to student users only.");
          return;
        }

        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("userId", data.user.id);
        setUserRole(data.role);

        navigate("/user/dashboard");
      } else {
        setError(data.message || "Google authentication failed.");
      }
    } catch (err) {
      console.error("Google Login Error:", err);
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
          {/* Left side illustration */}
          <div className="w-[40%] hidden md:flex">
            <div className="login">
              <div className="login_img">
                <img
                  src="/images/login/login_img.png"
                  referrerPolicy="no-referrer"
                  alt="Login Illustration"
                />
              </div>
              <div className="flying_logo">
                <img
                  src="/images/login/pop1.png"
                  referrerPolicy="no-referrer"
                  alt="pop1"
                />
                <img
                  src="/images/login/pop2.png"
                  referrerPolicy="no-referrer"
                  alt="pop2"
                />
              </div>
            </div>
          </div>

          {/* Right side login form */}
          <div className="w-full md:w-[60%]">
            <div className="login_content">
              <div className="logo text-center">
                <Link to="/user/dashboard">
                  <img
                    src="/images/logo/logo.png"
                    alt="Logo"
                    referrerPolicy="no-referrer"
                    className="mx-auto"
                  />
                </Link>
              </div>

              <h1 className="text-[#35095e] font-bold text-4xl mt-6 text-center">
                Student Login
              </h1>

              <form onSubmit={handleSubmit} className="mt-6">
                <div className="mb-4">
                  <label htmlFor="email">
                    Email address<span>*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password">
                    Password<span>*</span>
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="forgot mb-2">
                  <Link to="/auth/register">Forgot your password?</Link>
                </div>

                <button
                  type="submit"
                  className="login_btn bg-[#007ACC]  flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </form>

              <p className="mt-2 text-black text-center">
                You don't have an account?{" "}
                <Link to="/register" className="text-[#35095E] font-medium">
                  Sign up here
                </Link>
              </p>

              <div className="mt-4 flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
