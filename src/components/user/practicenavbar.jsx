import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ replace next/navigation
import { FaArrowLeft } from "react-icons/fa";
import UserDropdown from "../UserDropdown";

const PracticeNavbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch("https://mitoslearning.in/api/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="">
      <div className="test_header flex justify-between">
        {/* Left section */}
        <div className="flex justify-center items-center gap-6">
          <button
            onClick={() => navigate(-1)} // ✅ back navigation
            className="flex items-center px-3 py-1.5 rounded-xl 
             bg-[#007ACC] border border-[#007ACC] 
             text-[#fff] font-medium shadow-sm 
             transition-all duration-200 cursor-pointer"
          >
            <FaArrowLeft />
            <span className="pl-2">
              Back
            </span>
          </button>
          <h1 className="font-bold text-xl text-[#35095e] md:text-3xl">Practice</h1>
        </div>

        {/* Logo */}
        <a href="/user/dashboard">
          <img
            src={"/images/logo/logo.png"} // ✅ normal <img> in Vite
            className="hidden md:block"
            alt="logo"
            referrerPolicy="no-referrer"
            width={150}
            height={80}
          />
        </a>

        {/* User Dropdown */}
        <UserDropdown user={user} />
      </div>
    </div>
  );
};

export default PracticeNavbar;
