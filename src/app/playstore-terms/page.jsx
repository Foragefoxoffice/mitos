import React from "react";
import { motion } from "framer-motion";

const termsSections = [
  {
    title: "Definitions",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>“App” refers to the Mitos Learning Android application on Google Play.</li>
        <li>“Services” include NEET tests, study materials, analytics, and related tools.</li>
        <li>“Subscription” means a paid plan giving premium access for a chosen duration.</li>
        <li>“User Data” refers to personal, contact, and usage information collected from the User.</li>
        <li>“Trial Period” refers to the 14-day free access to premium features.</li>
      </ul>
    ),
  },
  {
    title: "Eligibility & Account Registration",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Users must be 14 years or older; below 18 may use with awareness of these Terms.</li>
        <li>Registration is via OTP (WhatsApp/Gmail). You must provide accurate details.</li>
        <li>You are responsible for maintaining your account confidentiality.</li>
        <li>Sharing or using another person’s account is prohibited.</li>
      </ul>
    ),
  },
  {
    title: "Services & Access",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Mitos Learning provides online NEET prep content and analytics.</li>
        <li>The Company may modify or discontinue any service without notice.</li>
        <li>Some features require an active paid Subscription.</li>
      </ul>
    ),
  },
  {
    title: "Subscriptions & Payments",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Paid plans are available for 1-year and 2-year durations.</li>
        <li>New users get a 14-day free trial from the registration date.</li>
        <li>Payments are processed securely via Google Play Billing.</li>
        <li>Subscriptions auto-renew unless cancelled in Play Store settings.</li>
        <li>Applicable taxes are included as per Indian laws.</li>
      </ul>
    ),
  },
  {
    title: "Refund Policy",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>All payments follow Google Play’s refund policy.</li>
        <li>Refunds must be requested through your Google Play account.</li>
        <li>Mitos Learning cannot directly process Play Store refunds.</li>
      </ul>
    ),
  },
  {
    title: "User Conduct",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>You may not copy, distribute, or reproduce content without written permission.</li>
        <li>Cheating, hacking, or unauthorized data extraction is prohibited.</li>
        <li>You must not reverse-engineer or damage the App’s systems.</li>
      </ul>
    ),
  },
  {
    title: "Intellectual Property",
    content: (
      <p>
        All questions, solutions, UI, trademarks, and materials are owned by Mitos Learning (OPC) Private
        Limited. You receive a revocable, limited license for personal learning use only.
      </p>
    ),
  },
  {
    title: "Communications & Notifications",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>You consent to WhatsApp, Gmail, SMS, and in-app notifications.</li>
        <li>Includes OTPs, alerts, payments, and promotional messages.</li>
        <li>You may opt out of promotions but not essential service messages.</li>
      </ul>
    ),
  },
  {
    title: "Privacy & Data Handling",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>User Data is processed per the Privacy Policy.</li>
        <li>Data includes login, contact, analytics, and usage patterns.</li>
        <li>Data is stored securely on Mitos Learning servers.</li>
      </ul>
    ),
  },
  {
    title: "Disclaimers",
    content: (
      <p>
        The App is provided “as is.” No guarantee is made regarding uninterrupted service or educational
        outcomes.
      </p>
    ),
  },
  {
    title: "Limitation of Liability",
    content: (
      <p>
        Mitos Learning is not liable for indirect or consequential damages. Maximum liability is limited to
        the amount paid in the last six months.
      </p>
    ),
  },
  {
    title: "Termination & Account Deletion",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>You may request deletion via support@mitoslearning.in.</li>
        <li>Data deletion is completed within 15 days per Indian IT rules.</li>
        <li>We may suspend accounts violating these Terms.</li>
      </ul>
    ),
  },
  {
    title: "Governing Law & Jurisdiction",
    content: <p>These Terms are governed by Indian law. Tamil Nadu courts hold exclusive jurisdiction.</p>,
  },
  {
    title: "Changes to Terms",
    content: <p>We may modify Terms anytime. Continued use means acceptance of revised Terms.</p>,
  },
  {
    title: "Contact & Grievance Redressal",
    content: (
      <div className="space-y-2">
        <p>Mitos Learning (OPC) Private Limited</p>
        <p>13/1-116, Mettur, Salem, Tamil Nadu – 636403</p>
        <p>Email: <a href="mailto:support@mitoslearning.in" className="text-blue-600 underline">support@mitoslearning.in</a></p>
        <p>Phone: <a href="tel:9344201653" className="text-blue-600 underline">9344201653</a></p>
        <p className="text-sm text-gray-500 italic">
          Grievances acknowledged within 24 hours and resolved within 15 days.
        </p>
      </div>
    ),
  },
];

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen relative font-sans bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-200/40 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl -z-10"></div>

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
          Please read these Terms carefully. By using <span className="font-semibold text-blue-700">Mitos Learning</span>, you agree to these conditions.
        </p>
      </motion.div>

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
            <div className="text-gray-700 leading-relaxed">{section.content}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
