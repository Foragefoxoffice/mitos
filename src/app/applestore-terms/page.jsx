import React from "react";
import { motion } from "framer-motion";

const termsSections = [
  {
    title: "Definitions",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>App</strong>: The Mitos Learning iOS mobile application
          distributed via the Apple App Store.
        </li>
        <li>
          <strong>Services</strong>: NEET tests, digital content, analytics, and
          performance tracking provided within the App.
        </li>
        <li>
          <strong>Subscription</strong>: A paid plan for premium access for 1
          year or 2 years.
        </li>
        <li>
          <strong>Trial Period</strong>: A 14-day free trial for new users.
        </li>
        <li>
          <strong>Apple Billing</strong>: Apple’s official in-app purchase
          payment system.
        </li>
      </ul>
    ),
  },

  {
    title: "Eligibility & Registration",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>The App is available to individuals 14 years of age or older.</li>
        <li>Registration requires WhatsApp or Gmail OTP verification.</li>
        <li>You must provide accurate and verifiable information.</li>
        <li>You are responsible for all activities under your account.</li>
        <li>
          Mitos Learning may suspend/terminate accounts suspected of misuse.
        </li>
      </ul>
    ),
  },

  {
    title: "Services & Access",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>
          Includes mock tests, explanations, analytics, and personalized study
          insights.
        </li>
        <li>
          Mitos Learning may change or discontinue services without prior
          notice.
        </li>
        <li>Premium content requires an active Subscription.</li>
      </ul>
    ),
  },

  {
    title: "Subscriptions & Billing",
    content: (
      <div className="space-y-2">
        <p>• Subscriptions available: 1 year and 2 years.</p>
        <p>• All new users receive a 14-day free trial.</p>
        <p>
          • Payments are processed through{" "}
          <strong>Apple App Store Billing</strong>.
        </p>
        <p>• Mitos Learning does not store banking/card information.</p>
        <p>• Subscriptions auto-renew unless cancelled in Apple settings.</p>
        <p>
          • Taxes and currency conversion are determined by Apple at checkout.
        </p>
      </div>
    ),
  },

  {
    title: "Refund Policy",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Refunds are governed solely by Apple’s App Store refund policy.</li>
        <li>
          Refund requests must be submitted via Apple Support at
          reportaproblem.apple.com.
        </li>
        <li>Mitos Learning cannot issue or manage refunds for Apple purchases.</li>
      </ul>
    ),
  },

  {
    title: "User Conduct",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Use the App for lawful educational purposes only.</li>
        <li>Do not copy or share App content without permission.</li>
        <li>No cheating, hacking, or unauthorized modification of the App.</li>
        <li>Do not reverse-engineer the App or bypass Subscription rules.</li>
        <li>Violations may result in suspension or permanent ban.</li>
      </ul>
    ),
  },

  {
    title: "Intellectual Property",
    content: (
      <p>
        All App content—questions, solutions, graphics, software, UI, and
        trademarks—is the property of{" "}
        <strong>Mitos Learning (OPC) Private Limited</strong>. You receive only
        a limited, non-exclusive, revocable license for personal, non-commercial
        educational use. Unauthorized reproduction is prohibited under Indian
        law.
      </p>
    ),
  },

  {
    title: "Communications & OTP Verification",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>
          You authorize OTPs, notifications, and service messages via WhatsApp,
          Gmail, or SMS.
        </li>
        <li>
          Promotional messages may be sent; you can opt out by emailing{" "}
          <a href="mailto:support@mitoslearning.in" className="text-blue-600">
            support@mitoslearning.in
          </a>
          .
        </li>
        <li>Essential messages (OTP, alerts, payments) cannot be opted out.</li>
      </ul>
    ),
  },

  {
    title: "Privacy & Data Handling",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Data is processed per the in-App Privacy Policy.</li>
        <li>Mitos Learning stores data on secure, encrypted servers.</li>
        <li>
          Data collected may include identifiers, contact information, analytics
          and usage logs for service improvement.
        </li>
      </ul>
    ),
  },

  {
    title: "Disclaimers",
    content: (
      <p>
        The App and Services are provided on an <em>“as-is”</em> basis. Mitos
        Learning does not guarantee uninterrupted access, accuracy, or exam
        results. The App is an educational tool, not a guarantee of academic
        performance.
      </p>
    ),
  },

  {
    title: "Limitation of Liability",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>
          Mitos Learning is not liable for indirect, incidental, or consequential
          damages.
        </li>
        <li>
          Total liability shall not exceed the amount paid by the user in the
          preceding 6 months.
        </li>
        <li>
          Exclusions do not apply to cases of willful misconduct or gross
          negligence.
        </li>
      </ul>
    ),
  },

  {
    title: "Termination & Account Deletion",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>
          Users may request account deletion via email to{" "}
          <a href="mailto:support@mitoslearning.in" className="text-blue-600">
            support@mitoslearning.in
          </a>
        </li>
        <li>Data will be deleted within 15 days as per Indian IT laws.</li>
        <li>
          Mitos Learning may suspend accounts violating Terms or applicable law.
        </li>
      </ul>
    ),
  },

  {
    title: "Governing Law & Jurisdiction",
    content: (
      <p>
        This Agreement is governed by the laws of India. Disputes fall under the
        exclusive jurisdiction of courts in Tamil Nadu, India. International
        users agree to the same jurisdiction.
      </p>
    ),
  },

  {
    title: "Changes to These Terms",
    content: (
      <p>
        Mitos Learning may update these Terms at any time. Revised Terms will be
        displayed in the App. Continued use constitutes acceptance.
      </p>
    ),
  },

  {
    title: "Contact & Grievance Redressal",
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
          All grievances are acknowledged within 24 hours and resolved within 15
          days as per Indian regulations.
        </p>
      </div>
    ),
  },
];

// -------------------------------------------------------------

export default function TermsAndConditions() {
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
          Terms & Conditions
        </h1>
        <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
          Effective Date: <strong>November 2025</strong>
          <br />
          These Terms govern your use of the Mitos Learning iOS App.
        </p>
      </motion.div>

      {/* Content Sections */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 pb-20">
        {termsSections.map((section, index) => (
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
