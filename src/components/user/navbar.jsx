"use client";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserDropdown from "../UserDropdown";
import { useSubscription } from "../../contexts/SubscriptionContext";
import { getMe } from "../../utils/api";
import { FiBell } from "react-icons/fi";

const UserComponent = () => {
  const [role, setRole] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // ✅ Use centralized user data from context
  const { userData } = useSubscription();
  const [user, setUser] = useState(userData);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);


  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        localStorage.removeItem("user");
        return null;
      }

      const response = await getMe();
      const data = response.data;

      // Cache user data in state and localStorage
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));

      return data;
    };

    fetchUserData();
  }, []);
  // Fetch notifications only (user data comes from context)
  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        // Fetch Notifications
        const notifyRes = await fetch("https://mitoslearning.in/api/notifications/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (notifyRes.ok) {
          const notifyData = await notifyRes.json();
          const list = Array.isArray(notifyData) ? notifyData : (notifyData.notifications || []);
          const count = list.filter(n => !n.read).length;
          setUnreadCount(count);
        }

      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // ... (getStatusBadge remains same) ...
  const getStatusBadge = () => {
    // Use user status from context
    const status = userData?.status ? userData.status.toUpperCase() : null;
    if (!status) return null;

    let colorClass = "bg-gray-100 text-gray-800"; // default REGISTERED
    let text = status;

    if (status === 'TRIALED' || status === 'TRIAL') {
      colorClass = "bg-orange-100 text-orange-800 border border-orange-200";
      text = "TRIAL ACTIVE";
    } else if (status === 'PREMIUM') {
      colorClass = "bg-green-100 text-green-800 border border-green-200";
      text = "PREMIUM";
    } else {
      colorClass = "bg-blue-50 text-blue-700 border border-blue-100";
      text = "REGISTERED";
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${colorClass}`}>
        {text}
      </span>
    );
  };

  const status = userData?.status ? userData.status.toUpperCase() : 'REGISTERED';

  return (
    <div className="flex justify-between items-center w-full px-4">
      <div></div>
      <div className="flex items-center gap-4">
        {role !== 'guest' && (
          <>
            {getStatusBadge()}

            {(status === 'REGISTERED' || status === 'TRIALED' || status === 'TRIAL') && (
              <Link
                to="/user/subscription"
                className="hidden sm:inline-flex items-center justify-center px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-sm transition-all"
              >
                Upgrade Now
              </Link>
            )}

            {/* Notification Bell */}
            <Link to="/user/notifications" className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
              <FiBell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
              )}
            </Link>
          </>
        )}

        {role === 'guest' ? (
          <a
            href="/login"
            className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200"
          >
            Login
          </a>
        ) : (
          <UserDropdown user={userData} />
        )}
      </div>
    </div>
  );
};
export default UserComponent;