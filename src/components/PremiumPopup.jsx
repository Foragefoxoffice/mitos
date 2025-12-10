import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSubscription } from "../contexts/SubscriptionContext";
import { getUserRole } from "../utils/auth";

export default function PremiumPopup({ onClose, timeExpired = false }) {
  const [isBouncing, setIsBouncing] = useState(false);
  const navigate = useNavigate();
  const { subscriptionStatus } = useSubscription();

  // Check if user is a guest (no token/not logged in)
  const userRole = getUserRole();
  const token = localStorage.getItem('token');
  const isGuest = userRole === 'guest' || !token;

  // All logged-in users (REGISTERED, TRIALED, PREMIUM) should go to subscription
  const isLoggedIn = !isGuest && token;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center" style={{ zIndex: 9999 }}>
      <motion.div
        className="bg-gradient-to-br from-blue-400 to-purple-500 p-6 rounded-3xl max-w-md w-full mx-4 border-4 border-yellow-300 shadow-xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.6 }}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-3xl font-bold text-white font-comic drop-shadow-md">
            {timeExpired ? (
              <span className="text-yellow-300">Time's Up! ⏳</span>
            ) : isLoggedIn ? (
              // Title for logged-in users (REGISTERED, TRIALED, PREMIUM)
              <>
                <span className="text-yellow-300">Unlock</span> Premium!
              </>
            ) : (
              // Default title for guests
              <>
                <span className="text-yellow-300">Let's</span> Unlock Feature!
              </>
            )}
          </h3>

          <motion.button
            onClick={onClose}
            style={{ background: "none", border: "none" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-white text-2xl"
          >
            ✕
          </motion.button>
        </div>

        <div className="bg-white bg-opacity-90 rounded-2xl p-4 mb-6 relative">
          <div className="absolute -top-4 -left-4 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-xl">🔒</span>
          </div>
          <p className="text-lg text-gray-800 font-medium pl-6">
            {timeExpired
              ? "Your guest access has expired. Login to continue learning with these benefits:"
              : isLoggedIn
                ? "You need a Premium plan to access this content. Upgrade now to unlock:"
                : "You're just one step away from leveling up your learning! Unlock these awesome student features:"}
          </p>
          <ul className="mt-3 space-y-2 pl-6">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-800 ">Unlimited Practice Questions by Topic & Chapter</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-800 ">Mock Tests & Time-Based Challenges</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-800 ">Instant Results, Accuracy Reports & Leaderboards</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-800 ">Track Progress, Master Mistakes & Improve</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col space-y-4">

          {/* Conditional Buttons */}
          {isLoggedIn ? (
            // Button for all logged-in users (REGISTERED, TRIALED, PREMIUM)
            <motion.div>
              <Link
                to="/user/subscription"
                className="block bg-yellow-400 hover:bg-yellow-300 text-purple-800 font-bold py-3 px-6 rounded-xl text-center text-lg shadow-md transform transition-all hover:scale-105"
                onClick={() => {
                  onClose();
                  navigate("/user/subscription");
                }}
              >
                🚀 Upgrade to Premium
              </Link>
            </motion.div>
          ) : (
            // Button for Guests only
            <>
              <motion.div>
                <Link
                  to="/login"
                  className="block bg-yellow-400 hover:bg-yellow-300 text-purple-800 font-bold py-3 px-6 rounded-xl text-center text-lg shadow-md transform transition-all hover:scale-105"
                  onClick={() => {
                    onClose();
                    navigate("/login");
                  }}
                >
                  {timeExpired ? "🔐 Login to Continue" : "🚀 Start Practicing Now"}
                </Link>
              </motion.div>
            </>
          )}

          <button
            onClick={onClose}
            style={{ background: "none", border: "none" }}
            className="text-white font-medium underline mt-2"
          >
            I'll explore more first
          </button>
        </div>
      </motion.div>
    </div>
  );
}
