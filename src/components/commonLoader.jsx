import React from "react";

export default function CommonLoader() {
  return (
    <div className="flex items-center h-[400px] mb-6 justify-center">
      <div className="relative flex items-center justify-center">
        {/* Spinning ring */}
        <div className="w-20 h-20 rounded-full border-4 border-gray-200 border-t-[#480878] animate-spin"></div>

        {/* Logo in center */}
        <img
          src="/images/logo/logo1.png"
          alt="Mitos Logo"
          className="absolute w-12 h-12 object-contain"
        />
      </div>
    </div>
  );
}
