"use client";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserDropdown from "../UserDropdown";
import { set } from "date-fns";

import { FiBell } from "react-icons/fi";

const UserComponent = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  // Fetch user info and notifications
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        // Fetch User
        const userRes = await fetch("https://mitoslearning.in/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }

        // Fetch Notifications
        const notifyRes = await fetch("https://mitoslearning.in/api/notifications/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (notifyRes.ok) {
          const notifyData = await notifyRes.json();
          const list = Array.isArray(notifyData) ? notifyData : (notifyData.notifications || []);
          // Count unread (using 'read' property as fixed previously)
          const count = list.filter(n => !n.read).length;
          setUnreadCount(count);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // ... (getStatusBadge remains same) ...
  const getStatusBadge = () => {
    // Use user status from DB fetch
    const status = user?.status ? user.status.toUpperCase() : null;
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

  const status = user?.status ? user.status.toUpperCase() : 'REGISTERED';

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
          <UserDropdown user={user} />
        )}
      </div>
    </div>
  );
};
export default UserComponent;