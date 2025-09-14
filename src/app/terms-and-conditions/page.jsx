import React from "react";
import { motion } from "framer-motion";

const termsSections = [
  {
    title: "Eligibility & Accounts",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>You must be at least 14 years old to use the Platform.</li>
        <li>
          You agree to provide accurate information during registration (Google
          Sign-In, phone number, class).
        </li>
        <li>
          You are responsible for maintaining the confidentiality of your
          account credentials.
        </li>
      </ul>
    ),
  },
  {
    title: "Services",
    content: (
      <p>
        We provide NEET preparation practice tests, study materials, and
        analytics. Our services are currently free and require only login.
      </p>
    ),
  },
  {
    title: "Intellectual Property",
    content: (
      <p>
        All Platform content (questions, solutions, explanations, UI, logos,
        trademarks) is owned by{" "}
        <span className="font-semibold">Mitos Learning (OPC) Private Limited</span>. We grant you a limited,
        non-transferable, revocable license to use the Platform for personal
        learning purposes.
      </p>
    ),
  },
  {
    title: "User Conduct",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Sharing or redistributing our content without permission is prohibited.</li>
        <li>Do not cheat, misuse, or interfere with the Platform’s operation.</li>
        <li>
          Do not introduce viruses, reverse engineer, or harm our systems.
        </li>
      </ul>
    ),
  },
  {
    title: "Cookies & Analytics",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>
          We use cookies and similar technologies (including Google Analytics)
          to operate the Platform, maintain login sessions, and analyze usage to
          improve features.
        </li>
        <li>Essential cookies are required for the Platform to function.</li>
        <li>
          By using the Platform, you consent to our use of cookies and analytics
          as described here and in the Privacy Policy.
        </li>
        <li>
          You may disable non-essential cookies via your browser, but some
          features may not work.
        </li>
      </ul>
    ),
  },
  {
    title: "Privacy & Data Handling",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>
          We collect and process personal information including name, email
          (from Google Sign-In), contact number, class, and usage data to
          provide and improve services.
        </li>
        <li>We do not currently collect payment information.</li>
        <li>
          Full details are in our{" "}
          <span className="font-semibold text-blue-600">
            Privacy Policy
          </span>{" "}
          (incorporated into these Terms).
        </li>
        <li>
          We may send you promotional emails/SMS; you may opt out anytime.
        </li>
      </ul>
    ),
  },
  {
    title: "Data Deletion Requests",
    content: (
      <p>
        You may request deletion of your Mitos Learning account and associated
        personal data by emailing{" "}
        <a
          href="mailto:support@mitoslearning.in"
          className="text-blue-600 underline"
        >
          support@mitoslearning.in
        </a>{" "}
        with subject line “Delete My Data.” We will acknowledge within 24 hours
        and complete deletion within 15 days as per Indian law.
      </p>
    ),
  },
  {
    title: "Communications",
    content: (
      <p>
        You consent to receive service-related messages (OTP, notices, updates)
        and promotional communications. You can opt out of promotional
        communications but not essential service messages.
      </p>
    ),
  },
  {
    title: "Payments & Refunds",
    content: (
      <p>
        Currently, the Platform is free. If we introduce paid plans, a separate
        payment and refund policy will be published.
      </p>
    ),
  },
  {
    title: "Disclaimers",
    content: (
      <p>
        We strive for accurate and helpful content but do not guarantee exam
        outcomes. The Platform is provided <em>“as is”</em> without warranties of
        any kind.
      </p>
    ),
  },
  {
    title: "Limitation of Liability",
    content: (
      <p>
        To the maximum extent permitted by law, Mitos Learning is not liable for
        indirect or consequential damages arising from your use of the Platform.
        Our total liability shall not exceed the amount you paid to us in the
        last six months (currently zero as the service is free).
      </p>
    ),
  },
  {
    title: "Governing Law & Jurisdiction",
    content: (
      <p>
        These Terms are governed by the laws of India. The courts of Tamil Nadu,
        India have exclusive jurisdiction over disputes.
      </p>
    ),
  },
  {
    title: "Changes to Terms",
    content: (
      <p>
        We may modify these Terms at any time. Continued use of the Platform
        after changes means you accept the revised Terms.
      </p>
    ),
  },
  {
    title: "Contact & Grievance Officer",
    content: (
      <div className="space-y-2">
        <p>Mitos Learning (OPC) Private Limited</p>
        <p>13/1-116, Mettur, Salem, Tamil Nadu – 636403</p>
        <p>
          Email:{" "}
          <a
            href="mailto:support@mitoslearning.in"
            className="text-blue-600 underline"
          >
            support@mitoslearning.in
          </a>
        </p>
        <p>
          Phone:{" "}
          <a href="tel:9360370336" className="text-blue-600 underline">
            9360370336
          </a>
        </p>
        <p className="text-sm text-gray-500 italic">
          We will acknowledge grievances within 24 hours and aim to resolve them
          within 15 days.
        </p>
      </div>
    ),
  },
];

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen relative font-sans bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Background blobs for depth */}
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
          Terms & Conditions
        </h1>
        <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
          Please read these Terms carefully. By accessing or using{" "}
          <span className="font-semibold text-blue-700">Mitos Learning</span>,
          you agree to be bound by them.
        </p>
      </motion.div>

      {/* Sections */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 pb-20">
        {termsSections.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="mb-8 p-8 bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-4 flex items-center gap-2">
              <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></span>
              {section.title}
            </h2>
            <div className="text-gray-700 leading-relaxed">
              {section.content}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
