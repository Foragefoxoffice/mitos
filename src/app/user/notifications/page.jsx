import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBell, FiCheck, FiCheckCircle, FiClock, FiTrash2 } from "react-icons/fi";
import CommonLoader from "../../../components/commonLoader";
import {
    fetchMyNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    getCurrentUser
} from "../../../utils/api";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("all"); // 'all', 'unread'
    const [user, setUser] = useState(null);

    useEffect(() => {
        loadNotifications();
        const currentUser = getCurrentUser();
        setUser(currentUser);
    }, []);

    const formatMessage = (text) => {
        if (!text || !user) return text;

        let formatted = text;
        if (user.name) formatted = formatted.replace(/{{\s*name\s*}}/gi, user.name);
        if (user.email) formatted = formatted.replace(/{{\s*email\s*}}/gi, user.email);
        if (user.phoneNumber) formatted = formatted.replace(/{{\s*phone\s*}}/gi, user.phoneNumber);

        return formatted;
    };

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const data = await fetchMyNotifications();
            console.log("DEBUG: Fetched Notifications:", data); // ✅ Check structure
            // Ensure we have an array
            const notifyList = Array.isArray(data) ? data : (data.notifications || []);

            // Sort by newest first
            const sorted = notifyList.sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );

            setNotifications(sorted);
        } catch (err) {
            console.error("Failed to load notifications:", err);
            // Fail gracefully
            setError("Unable to load notifications at the moment.");
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id, e) => {
        e.stopPropagation();
        console.log("DEBUG: Marking as read with ID:", id); // ✅ Check ID
        if (!id) {
            console.error("DEBUG: No ID found for notification");
            return;
        }

        try {
            // Optimistic update
            setNotifications(prev => prev.map(n => {
                const currentId = n.id || n._id;
                if (currentId == id) { // ✅ Loose equality handles string/number mismatch
                    return { ...n, read: true };
                }
                return n;
            }));

            await markNotificationRead(id);
            console.log("DEBUG: Mark as read API called successfully");
        } catch (err) {
            console.error("Failed to mark read:", err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            // Optimistic update
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));

            await markAllNotificationsRead();
        } catch (err) {
            console.error("Failed to mark all read:", err);
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === "unread") return !n.read;
        return true;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <CommonLoader />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <FiBell className="text-[#35095E]" />
                        Notifications
                        {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                {unreadCount} new
                            </span>
                        )}
                    </h1>
                    <p className="text-gray-500 mt-1">Stay updated with your latest alerts and announcements</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white rounded-lg p-1 border border-gray-200 flex">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${filter === "all" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter("unread")}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${filter === "unread" ? "bg-indigo-50 text-indigo-700" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            Unread
                        </button>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm text-sm"
                        >
                            <FiCheckCircle /> Mark all read
                        </button>
                    )}
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiBell className="text-gray-300 text-2xl" />
                        </div>
                        <p className="text-gray-500 font-medium">No notifications found</p>
                        {filter === 'unread' && notifications.length > 0 && (
                            <button
                                onClick={() => setFilter('all')}
                                className="mt-2 text-indigo-600 text-sm hover:underline"
                            >
                                View all notifications
                            </button>
                        )}
                    </div>
                ) : (
                    <AnimatePresence>
                        {filteredNotifications.map((notification) => (
                            <motion.div
                                key={notification.id || notification._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                layout
                                className={`group relative p-5 rounded-xl border transition-all duration-200
                  ${notification.read
                                        ? "bg-white border-gray-100"
                                        : "bg-indigo-50/50 border-indigo-100 shadow-sm"
                                    }`}
                            >
                                <div className="flex gap-4">
                                    <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                     ${notification.read ? "bg-gray-100 text-gray-400" : "bg-indigo-100 text-indigo-600"}`}>
                                        <FiBell size={18} />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start gap-4">
                                            <h3 className={`font-semibold text-lg ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                                                {formatMessage(notification.title)}
                                            </h3>
                                            <span className="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
                                                <FiClock size={12} />
                                                {new Date(notification.createdAt).toLocaleDateString(undefined, {
                                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </span>
                                        </div>

                                        {/* Prefer finalMessage if available */}
                                        <p className={`mt-1 text-sm ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                                            {notification.finalMessage || formatMessage(notification.message)}
                                        </p>

                                        {!notification.read && (
                                            <div className="mt-3 flex justify-end">
                                                <button
                                                    onClick={(e) => handleMarkAsRead(notification.id || notification._id, e)}
                                                    className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-full transition"
                                                >
                                                    <FiCheck /> Mark as read
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Unread Indicator Dot */}
                                {!notification.read && (
                                    <div className="absolute top-5 right-[-6px] w-2 h-2 rounded-full bg-red-500 ring-4 ring-white md:hidden"></div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
