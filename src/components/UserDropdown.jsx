import { FaAngleDown } from "react-icons/fa6";
import {
  HiMiniArrowUturnLeft,
  HiOutlineCog8Tooth,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserDropdown = ({ user }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef(null);
  const navigate = useNavigate();

  const togglePopup = () => {
    setIsPopupOpen((prev) => !prev);
  };

  // Close popup on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsPopupOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("refreshToken");
    navigate("/", { replace: true });
  };

  const handleProfileClick = () => {
    navigate("/user/faq/profile");
    setIsPopupOpen(false);
  };

  const handleSettingsClick = () => {
    navigate("/user/settings");
    setIsPopupOpen(false);
  };

  // Build full image URL
  const profileImage = user?.profile?.startsWith("http")
    ? user.profile
    : `https://mitoslearning.in${user?.profile || ""}`;

  return (
    <div className="relative">
      <button
        className="flex items-center bg-transparent space-x-2 focus:outline-none"
        onClick={togglePopup}
      >
        <div className="w-10 h-10 md:w-12 md:h-12 relative rounded-full overflow-hidden">
          <img
            src={user?.profile ? profileImage : "/images/user/default.png"}
            alt="User Icon"
            referrerPolicy="no-referrer"
            className="object-cover rounded-full w-full h-full"
          />
        </div>
        <FaAngleDown className="text-xl m-0 text-gray-600" />
      </button>

      {/* Popup */}
      {isPopupOpen && (
        <div
          ref={popupRef}
          className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg animate-slide-down z-50"
        >
          <ul>
            <li className="px-4 py-2 flex gap-3 items-center text-gray-700 font-semibold">
              {user?.name || "Guest"}
            </li>
            <li
              className="px-4 py-2 flex gap-3 items-center hover:bg-gray-100 cursor-pointer"
              onClick={handleProfileClick}
            >
              <HiOutlineUserCircle className="text-xl text-gray-600" /> Help
            </li>
            <li
              className="px-4 py-2 flex gap-3 items-center hover:bg-gray-100 cursor-pointer"
              onClick={handleSettingsClick}
            >
              <HiOutlineCog8Tooth className="text-xl text-gray-600" /> Settings
            </li>
            <li
              className="px-4 py-2 flex gap-3 items-center hover:bg-gray-100 cursor-pointer"
              onClick={handleLogout}
            >
              <HiMiniArrowUturnLeft className="text-xl text-gray-600" /> Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
