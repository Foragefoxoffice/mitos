import React from "react";
import { motion } from "framer-motion";

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
          This Privacy Policy explains how Mitos Learning (OPC) Private Limited 
          collects, uses, stores, and protects user data when using the Mitos Learning Mobile App.
        </p>
      </motion.div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 pb-20 space-y-10">

        {/* Section Template */}
        {[
          {
            title: "1. Definitions",
            content: (
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Personal Information:</strong> Data capable of identifying an individual.</li>
                <li><strong>Sensitive Personal Data:</strong> Passwords, financial information, etc.</li>
                <li><strong>User:</strong> Anyone who installs or uses the App.</li>
                <li><strong>Processing:</strong> Collection, storage, use, disclosure, or deletion.</li>
              </ul>
            )
          },
          {
            title: "2. Information We Collect",
            content: (
              <div className="space-y-4">

                <p className="font-semibold">Account & Login Information</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Name, email, and phone via Gmail Sign-in or WhatsApp OTP.</li>
                  <li>Profile details for account verification.</li>
                </ul>

                <p className="font-semibold">Usage Data</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Tests taken, scores, logs, session duration.</li>
                  <li>Device model, OS, IP address, app version.</li>
                  <li>Analytics via Google Analytics.</li>
                </ul>

                <p className="font-semibold">Payment Data</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Subscription data from Google Play Billing.</li>
                  <li>No storage of card/bank details.</li>
                </ul>

                <p className="font-semibold">Communications</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Support messages, emails, WhatsApp communication.</li>
                </ul>

              </div>
            )
          },
          {
            title: "3. Use of Information",
            content: (
              <ul className="list-disc pl-6 space-y-2">
                <li>Account creation & OTP authentication.</li>
                <li>Providing learning services & analytics.</li>
                <li>Processing subscription payments via Google Play.</li>
                <li>Sending alerts, OTPs, updates, and promotions.</li>
                <li>Improving App performance.</li>
                <li>Legal compliance.</li>
              </ul>
            )
          },
          {
            title: "4. Legal Basis for Processing",
            content: (
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Consent</strong> – User agreement.</li>
                <li><strong>Contractual necessity</strong> – Delivering the subscribed service.</li>
                <li><strong>Legal obligation</strong> – IT laws.</li>
                <li><strong>Legitimate interest</strong> – Improving stability & fraud prevention.</li>
              </ul>
            )
          },
          {
            title: "5. Cookies & Analytics",
            content: (
              <ul className="list-disc pl-6 space-y-2">
                <li>Used for analytics, performance & active sessions.</li>
                <li>Users may disable non-essential cookies.</li>
              </ul>
            )
          },
          {
            title: "6. OTP Verification & Communication",
            content: (
              <ul className="list-disc pl-6 space-y-2">
                <li>WhatsApp/Gmail OTP used for login authentication.</li>
                <li>Users consent to receiving SMS/Email/WhatsApp alerts.</li>
                <li>Promotional consent can be withdrawn via email.</li>
                <li>Service messages cannot be disabled.</li>
              </ul>
            )
          },
          {
            title: "7. Data Retention",
            content: (
              <ul className="list-disc pl-6 space-y-2">
                <li>Data kept while the account is active.</li>
                <li>Deleted or anonymized within 15 days of account deletion.</li>
              </ul>
            )
          },
          {
            title: "8. Data Storage & Security",
            content: (
              <ul className="list-disc pl-6 space-y-2">
                <li>Data stored on secure servers.</li>
                <li>Encryption, firewalls, and access restrictions applied.</li>
                <li>No system guarantees 100% security.</li>
              </ul>
            )
          },
          {
            title: "9. Sharing & Disclosure",
            content: (
              <ul className="list-disc pl-6 space-y-2">
                <li>No selling or renting data.</li>
                <li>Shared with service providers under agreements.</li>
                <li>Shared when legally required.</li>
                <li>Data protected during mergers/acquisitions.</li>
              </ul>
            )
          },
          {
            title: "10. Payments & Refunds",
            content: (
              <ul className="list-disc pl-6 space-y-2">
                <li>All payments handled via Google Play Billing.</li>
                <li>Mitos does NOT process refunds directly.</li>
                <li>Refunds follow Google Play policies.</li>
              </ul>
            )
          },
          {
            title: "11. User Rights",
            content: (
              <ul className="list-disc pl-6 space-y-2">
                <li>Right to access data.</li>
                <li>Right to correct information.</li>
                <li>Right to delete account & data.</li>
                <li>Right to withdraw promotional consent.</li>
              </ul>
            )
          },
          {
            title: "12. Children’s Privacy",
            content: (
              <p>The App is intended for users aged 14 years and above.</p>
            )
          },
          {
            title: "13. International Data Transfer",
            content: (
              <p>Any transfer outside India will follow proper safeguards.</p>
            )
          },
          {
            title: "14. Changes to This Policy",
            content: (
              <p>Updates will be posted on the App. Continued use means acceptance.</p>
            )
          },
          {
            title: "15. Grievance Redressal",
            content: (
              <div className="space-y-1">
                <p><strong>Grievance Officer</strong></p>
                <p>Mitos Learning (OPC) Private Limited</p>
                <p>13/1-116, Mettur, Salem, Tamil Nadu – 636403</p>

                <p>Email: <a href="mailto:support@mitoslearning.in" className="text-blue-600 underline">support@mitoslearning.in</a></p>
                <p>Phone: <a href="tel:9344201653" className="text-blue-600 underline">9344201653</a></p>

                <p className="text-gray-500 text-sm italic">
                  We respond within 24 hours and resolve within 15 days.
                </p>
              </div>
            )
          }

        ].map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.08 }}
            viewport={{ once: true, amount: 0.3 }}
            className="p-8 bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all"
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
