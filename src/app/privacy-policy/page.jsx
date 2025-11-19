import React from "react";
import { motion } from "framer-motion";

const privacySections = [
  {
    title: "Definitions",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>“Personal Information” includes name, email, contact number, IP address, etc.</li>
        <li>“Sensitive Personal Data” includes financial/payment authentication data.</li>
        <li>“Processing” refers to collection, storage, use, disclosure, or deletion of data.</li>
        <li>“Service Providers” include Razorpay, hosting vendors, and third parties assisting operations.</li>
      </ul>
    ),
  },
  {
    title: "Information We Collect",
    content: (
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Account & Login Information</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Name, email, contact number collected via WhatsApp/Gmail OTP login.</li>
            <li>Data you provide when updating your profile.</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Usage Information</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Test attempts, analytics, study interactions.</li>
            <li>Browser type, IP address, device info, session duration.</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Payment Information</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Transaction metadata and Razorpay order IDs.</li>
            <li>No card numbers / CVV stored by Mitos Learning.</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Communication Data</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Emails, support messages, survey responses, feedback forms.</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: "How We Use Your Information",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Authenticate users through OTP verification.</li>
        <li>Provide NEET preparation, tests, analytics, and user experience enhancements.</li>
        <li>Process secure payments through Razorpay.</li>
        <li>Send OTPs, account alerts, service updates, and promotional messages.</li>
        <li>Improve website performance and content using analytics.</li>
        <li>Comply with legal and accounting obligations.</li>
      </ul>
    ),
  },
  {
    title: "Legal Basis for Processing",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Consent:</strong> You consent to data collection during usage.</li>
        <li><strong>Contractual Necessity:</strong> Required to deliver purchased services.</li>
        <li><strong>Legal Obligation:</strong> Required to maintain financial and regulatory compliance.</li>
        <li><strong>Legitimate Interest:</strong> Fraud prevention, platform security, and improvements.</li>
      </ul>
    ),
  },
  {
    title: "Cookies & Analytics",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Used for smoother login, user experience, and analytics.</li>
        <li>Essential cookies cannot be disabled.</li>
        <li>You may disable non-essential cookies via browser settings.</li>
        <li>Analytics data is anonymized and used internally only.</li>
      </ul>
    ),
  },
  {
    title: "OTP Verification & Communication Consent",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Login and account creation require WhatsApp/Gmail OTP verification.</li>
        <li>You consent to receive service and promotional communications.</li>
        <li>You may withdraw promotional consent anytime via email.</li>
        <li>Service-critical messages cannot be opted out of.</li>
      </ul>
    ),
  },
  {
    title: "Payment & Refund Data Handling",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Payments handled securely by Razorpay via encrypted PCI-DSS systems.</li>
        <li>We store only transaction IDs, status, and timestamps.</li>
        <li>Refund requests (within 15 days) are processed in 7–10 business days.</li>
      </ul>
    ),
  },
  {
    title: "Data Retention",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Data retained as long as your account is active.</li>
        <li>Upon deletion requests, personal data is erased within 15 days.</li>
        <li>Some transaction data may be retained for tax compliance.</li>
      </ul>
    ),
  },
  {
    title: "Data Security",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Secure servers with encryption and restricted access.</li>
        <li>Regular security audits and penetration testing.</li>
        <li>End‑to‑end encrypted data transmission.</li>
        <li>No digital system can be 100% risk‑free; users acknowledge this.</li>
      </ul>
    ),
  },
  {
    title: "Sharing & Disclosure",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>No selling or renting of user data.</li>
        <li>Shared only with service providers like Razorpay or hosting vendors.</li>
        <li>Shared only when required by law or court order.</li>
        <li>In business transfers, successors follow the same protection standards.</li>
      </ul>
    ),
  },
  {
    title: "User Rights",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Access your personal data.</li>
        <li>Request corrections of inaccurate data.</li>
        <li>Request deletion of account and data.</li>
        <li>Withdraw consent for promotional communication.</li>
        <li>Responses provided within 15 days.</li>
      </ul>
    ),
  },
  {
    title: "Children’s Privacy",
    content: (
      <p>The Website is intended for ages 14+. Users under 18 may use the platform but should review this policy.</p>
    ),
  },
  {
    title: "International Data Transfer",
    content: <p>If data is transferred outside India, equivalent protection measures are ensured.</p>,
  },
  {
    title: "Changes to This Policy",
    content: <p>We may update this Policy anytime. Continued use after changes means acceptance of revised terms.</p>,
  },
  {
    title: "Grievance Redressal & Contact",
    content: (
      <div className="space-y-2">
        <p>Mitos Learning (OPC) Private Limited</p>
        <p>13/1-116, Mettur, Salem, Tamil Nadu – 636403</p>
        <p>Email: support@mitoslearning.in</p>
        <p>Phone: 9344201653</p>
        <p className="text-sm text-gray-500 italic">Grievances acknowledged in 24 hours and resolved within 15 days.</p>
      </div>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen relative font-sans bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-200/40 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl -z-10"></div>

      {/* Hero Section */}
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
          Your privacy is important to us. This Privacy Policy explains how <span className="font-semibold text-blue-700">Mitos Learning</span> collects, processes, and protects your data.
        </p>
      </motion.div>

      {/* Sections */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 pb-20">
        {privacySections.map((section, idx) => (
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