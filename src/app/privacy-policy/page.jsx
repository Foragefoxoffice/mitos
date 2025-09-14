import React from "react";
import { motion } from "framer-motion";

const privacySections = [
  {
    title: "Who We Are & Contact",
    content: (
      <div className="space-y-2">
        <p>
          <strong>Entity:</strong> Mitos Learning (OPC) Private Limited
        </p>
        <p>
          <strong>Registered Address:</strong> 13/1-116, Mettur, Salem, Tamil Nadu – 636403
        </p>
        <p>
          <strong>Grievance Officer Contact:</strong>
        </p>
        <ul className="list-disc pl-5">
          <li>
            Email:{" "}
            <a
              href="mailto:support@mitoslearning.in"
              className="text-blue-600 underline"
            >
              support@mitoslearning.in
            </a>
          </li>
          <li>
            Phone:{" "}
            <a href="tel:9360370336" className="text-blue-600 underline">
              9360370336
            </a>
          </li>
          <li>Postal: same as registered address</li>
        </ul>
        <p className="text-sm text-gray-500 italic">
          We will acknowledge grievances within 24 hours and aim to resolve them within 15 days.
        </p>
      </div>
    ),
  },
  {
    title: "Information We Collect",
    content: (
      <ul className="list-decimal pl-5 space-y-2">
        <li>
          <span className="font-semibold">Login Data:</span> Google Sign-In basic
          profile (name, email, profile ID).
        </li>
        <li>
          <span className="font-semibold">Additional Info:</span> Contact number and
          class/grade you provide.
        </li>
        <li>
          <span className="font-semibold">Usage Data:</span> Tests taken, scores,
          time spent, device details, app version, IP address.
        </li>
        <li>
          <span className="font-semibold">Analytics:</span> We use Google Analytics
          to understand usage and improve features.
        </li>
        <li>
          <span className="font-semibold">Cookies:</span> Essential and
          non-essential cookies to operate and improve the platform.
        </li>
        <li>
          <span className="font-semibold">Communications:</span> Emails/messages,
          feedback, surveys.
        </li>
        <li className="mt-2 font-semibold text-red-600">
          Note: We do not collect payment information at present, as the Platform
          is free.
        </li>
      </ul>
    ),
  },
  {
    title: "How We Use Your Information",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Create and manage your account.</li>
        <li>Provide personalized learning content.</li>
        <li>Analyze performance to improve features.</li>
      </ul>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen relative font-sans bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* background glow effects */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-200/40 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl -z-10"></div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="pt-20 pb-12 px-6 text-center"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 drop-shadow-md">
          Privacy Policy
        </h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          At <span className="font-semibold text-blue-700">Mitos Learning</span>, we
          value your trust. This policy explains how we handle your data with care,
          transparency, and security.
        </p>
      </motion.div>

      {/* Sections */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 pb-20">
        {privacySections.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            className="mb-10 p-8 bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-4 flex items-center gap-2">
              <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></span>
              {section.title}
            </h2>
            <div className="text-gray-700 leading-relaxed">{section.content}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
