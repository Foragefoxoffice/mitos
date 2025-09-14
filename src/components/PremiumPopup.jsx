import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function PremiumPopup({ onClose }) {
  const [isBouncing, setIsBouncing] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        className="bg-gradient-to-br from-blue-400 to-purple-500 p-6 rounded-3xl max-w-md w-full mx-4 border-4 border-yellow-300 shadow-xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.6 }}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-3xl font-bold text-white font-comic drop-shadow-md">
            <span className="text-yellow-300">Let's</span> Unlock Feature!
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
            You're just one step away from leveling up your learning! Unlock
            these awesome student features:
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
          <motion.div>
            <Link
              to="/login"
              className="block bg-yellow-400 hover:bg-yellow-300 text-purple-800 font-bold py-3 px-6 rounded-xl text-center text-lg shadow-md transform transition-all hover:scale-105"
              onClick={() => navigate("/login")}
            >
              🚀 Start Practicing Now
            </Link>
          </motion.div>

          <Link
            to="/register"
            className="block bg-pink-500 hover:bg-pink-400 text-white font-bold py-3 px-6 rounded-xl text-center text-lg shadow-md transform transition-all hover:scale-105"
            onClick={() => navigate("/register")}
          >
            🎓 Create My Free Student Account
          </Link>

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
