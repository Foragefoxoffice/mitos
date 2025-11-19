import React from "react";
import { motion } from "framer-motion";

const privacySections = [
  {
    title: "Definitions",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>Personal Information</strong>: Any identifiable data such as
          name, email address, or phone number.
        </li>
        <li>
          <strong>Sensitive Data</strong>: Authentication credentials or
          payment-associated details.
        </li>
        <li>
          <strong>User</strong>: Any person accessing or using the Mitos
          Learning App.
        </li>
        <li>
          <strong>Processing</strong>: Operations performed on personal data
          including collection, storage, usage, or deletion.
        </li>
      </ul>
    ),
  },

  {
    title: "Information We Collect",
    content: (
      <div className="space-y-3">
        <p className="font-semibold">a) Account and Login Data</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Name, email, and contact number via WhatsApp or Gmail OTP login.</li>
          <li>User profile information for identification and verification.</li>
        </ul>

        <p className="font-semibold mt-2">b) Usage and Analytics Data</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Test attempts, scores, activity logs, and usage time.</li>
          <li>Device model, OS version, IP address, and app version.</li>
          <li>Analytics via Apple App Analytics and internal tools.</li>
        </ul>

        <p className="font-semibold mt-2">c) Payment Data</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Purchase metadata via Apple Billing.</li>
          <li>
            Mitos Learning does <strong>not</strong> store card or bank details.
          </li>
        </ul>

        <p className="font-semibold mt-2">d) Communications & Feedback</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Emails, support messages, WhatsApp interactions.</li>
          <li>Feedback or responses to surveys.</li>
        </ul>
      </div>
    ),
  },

  {
    title: "How We Use Your Information",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Account creation and identity verification via OTP.</li>
        <li>Providing and personalizing learning services and analytics.</li>
        <li>Processing subscription payments via Apple Billing.</li>
        <li>Sending service alerts, OTPs, and promotional messages.</li>
        <li>Improving App quality through diagnostics and analytics.</li>
        <li>Compliance with legal obligations and grievance resolution.</li>
      </ul>
    ),
  },

  {
    title: "Legal Basis for Processing",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Consent</strong> — You provide explicit consent.</li>
        <li><strong>Contractual necessity</strong> — To deliver subscribed services.</li>
        <li><strong>Legal obligation</strong> — Compliance with IT laws.</li>
        <li><strong>Legitimate interest</strong> — Improve security and reliability.</li>
      </ul>
    ),
  },

  {
    title: "Cookies & Analytics",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>
          Apple App Store analytics collect aggregated device and usage
          information.
        </li>
        <li>We do not use advertisement cookies or third-party trackers.</li>
      </ul>
    ),
  },

  {
    title: "OTP Verification & Communication Consent",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Login occurs via WhatsApp or Gmail OTP verification.</li>
        <li>
          You authorize service-related and promotional communication via
          WhatsApp, Gmail, or in-app notifications.
        </li>
        <li>
          Promotional opt-out is available via email to{" "}
          <a href="mailto:support@mitoslearning.in" className="text-blue-600">
            support@mitoslearning.in
          </a>
          .
        </li>
        <li>Service notifications cannot be disabled.</li>
      </ul>
    ),
  },

  {
    title: "Payment Processing & Refunds",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>All purchases are processed exclusively through Apple Billing.</li>
        <li>Mitos Learning does not access or store payment details.</li>
        <li>
          Refunds follow Apple’s policy via{" "}
          <a
            href="https://reportaproblem.apple.com"
            className="text-blue-600 underline"
          >
            reportaproblem.apple.com
          </a>
          .
        </li>
      </ul>
    ),
  },

  {
    title: "Data Retention",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Data is retained for as long as the account is active.</li>
        <li>
          After account deletion, personal data is erased or anonymized within
          15 days.
        </li>
        <li>Backup copies are removed after legal retention periods.</li>
      </ul>
    ),
  },

  {
    title: "Data Storage & Security",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Stored on secure servers controlled by Mitos Learning.</li>
        <li>Encryption, firewalls, and limited-access controls are applied.</li>
        <li>No system can guarantee complete security.</li>
      </ul>
    ),
  },

  {
    title: "Sharing & Disclosure of Data",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>No selling or renting of personal information.</li>
        <li>
          Data may be shared with secure service providers for hosting,
          analytics, or communication.
        </li>
        <li>Shared if required by law or government agencies.</li>
        <li>
          In case of merger/reorganization, data remains protected under similar
          standards.
        </li>
      </ul>
    ),
  },

  {
    title: "User Rights",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Right to access personal information.</li>
        <li>Right to correct inaccurate data.</li>
        <li>Right to delete your account and associated data.</li>
        <li>
          Right to withdraw promotional consent by emailing{" "}
          <a href="mailto:support@mitoslearning.in" className="text-blue-600">
            support@mitoslearning.in
          </a>
          .
        </li>
        <li>Requests are processed within 15 days.</li>
      </ul>
    ),
  },

  {
    title: "Children’s Privacy",
    content: (
      <p>
        The App is intended for users aged 14–22. Users under 18 may use the App
        without parental consent but should understand this Policy before
        continuing.
      </p>
    ),
  },

  {
    title: "International Data Transfer",
    content: (
      <p>
        If data is transferred outside India, it will be protected under
        safeguards compliant with Indian data protection laws.
      </p>
    ),
  },

  {
    title: "Changes to This Privacy Policy",
    content: (
      <p>
        We may revise this Policy occasionally due to legal, technical, or
        operational changes. Updated versions will appear in the App. Continued
        use signifies acceptance.
      </p>
    ),
  },

  {
    title: "Grievance Redressal & Contact Details",
    content: (
      <div className="space-y-2">
        <p>
          <strong>Grievance Officer</strong>
        </p>
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
          <a href="tel:9344201653" className="text-blue-600 underline">
            9344201653
          </a>
        </p>
        <p className="text-sm text-gray-500 italic">
          Grievances are acknowledged within 24 hours and resolved within 15
          days under IT Rules 2021.
        </p>
      </div>
    ),
  },
];

// -------------------------------------------------------------

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen relative font-sans bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-200/40 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl -z-10" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="pt-20 pb-12 px-6 text-center"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 drop-shadow-md">
          Privacy Policy
        </h1>
        <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
          Effective Date: <strong>November 2025</strong>
          <br />
          This Privacy Policy describes how we handle your data when using the
          Mitos Learning iOS App.
        </p>
      </motion.div>

      {/* Content Sections */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 pb-20">
        {privacySections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
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
