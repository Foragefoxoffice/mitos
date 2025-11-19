import React from "react";
import { motion } from "framer-motion";

const termsSections = [
  {
    title: "Definitions",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>Platform</strong>: The Mitos Learning website and related
          services.
        </li>
        <li>
          <strong>Services</strong>: NEET practice tests, learning content, and
          analytics provided via the website.
        </li>
        <li>
          <strong>Subscription</strong>: Paid access plan to premium content.
        </li>
        <li>
          <strong>Razorpay</strong>: Third-party payment gateway used by Mitos
          Learning.
        </li>
        <li>
          <strong>User Data</strong>: Personal and transactional data collected
          during registration or purchase.
        </li>
      </ul>
    ),
  },

  {
    title: "Eligibility & Registration",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>You must be at least 14 years old to use the Website.</li>
        <li>Registration occurs via WhatsApp or Gmail OTP verification.</li>
        <li>You must provide true and accurate information.</li>
        <li>
          You are responsible for safeguarding your OTP verification and account
          activity.
        </li>
        <li>
          The Company reserves the right to suspend accounts providing false
          information or violating Terms.
        </li>
      </ul>
    ),
  },

  {
    title: "Services & Access",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>
          Access includes question banks, analytics, video lessons, and other
          learning tools.
        </li>
        <li>
          Some features are accessible only through an active subscription.
        </li>
        <li>
          The Company may modify or discontinue services without prior notice.
        </li>
      </ul>
    ),
  },

  {
    title: "Subscriptions & Payments",
    content: (
      <div className="space-y-2">
        <p>• Subscription durations: 1 year and 2 years.</p>
        <p>• A 14-day free trial is available for new users.</p>
        <p>
          • Payments are processed securely through{" "}
          <strong>Razorpay (PCI-DSS compliant)</strong>.
        </p>
        <p>• Mitos Learning does not store card/UPI details.</p>
        <p>• Taxes are shown at checkout.</p>
        <p>
          • Upon successful payment, confirmation is sent via WhatsApp or Gmail.
        </p>
      </div>
    ),
  },

  {
    title: "Refund Policy",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>
          Refund eligible only if requested within <strong>15 days</strong> of
          subscription activation.
        </li>
        <li>
          Request must come from registered WhatsApp/Gmail to{" "}
          <a href="mailto:support@mitoslearning.in" className="text-blue-600">
            support@mitoslearning.in
          </a>
        </li>
        <li>
          Refunds (after verification) will be processed in{" "}
          <strong>7–10 business days</strong>.
        </li>
        <li>No partial or late usage refunds after 15 days.</li>
      </ul>
    ),
  },

  {
    title: "User Conduct",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Do not copy or share content without authorization.</li>
        <li>Do not reverse engineer or tamper with the Website.</li>
        <li>Do not upload malware or attempt unauthorized access.</li>
        <li>Do not share your access credentials.</li>
      </ul>
    ),
  },

  {
    title: "Intellectual Property Rights",
    content: (
      <p>
        All Website content, including questions, designs, text, analytics,
        trademarks, and software, is owned by{" "}
        <strong>Mitos Learning (OPC) Private Limited</strong>. You are granted a
        personal, limited, revocable license for learning use only. Commercial
        use or redistribution is strictly prohibited.
      </p>
    ),
  },

  {
    title: "Communications",
    content: (
      <p>
        By registering, you agree to receive OTPs, confirmations, service
        updates, and promotional messages via WhatsApp, Gmail, or SMS. You may
        opt out of promotional messages but not essential notifications.
      </p>
    ),
  },

  {
    title: "Privacy & Data Handling",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>
          All data is handled as per our Privacy Policy and IT Security Rules
          2011.
        </li>
        <li>User data is stored securely on Mitos Learning’s servers.</li>
        <li>We use industry-standard encryption and restricted access.</li>
      </ul>
    ),
  },

  {
    title: "Disclaimers",
    content: (
      <p>
        The Platform is provided <em>“as is”</em>. We do not guarantee
        uninterrupted access or exam performance outcomes.
      </p>
    ),
  },

  {
    title: "Limitation of Liability",
    content: (
      <p>
        Mitos Learning is not liable for indirect or consequential damages
        including data loss. Total liability will not exceed the subscription
        amount paid in the last 6 months.
      </p>
    ),
  },

  {
    title: "Termination & Account Deletion",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>
          Users may request account deletion by emailing{" "}
          <a href="mailto:support@mitoslearning.in" className="text-blue-600">
            support@mitoslearning.in
          </a>
        </li>
        <li>Data deletion will be completed within 15 days of verification.</li>
        <li>
          The Company may suspend accounts violating these Terms at its
          discretion.
        </li>
      </ul>
    ),
  },

  {
    title: "Governing Law & Jurisdiction",
    content: (
      <p>
        These Terms are governed by the laws of India. All disputes fall under
        the exclusive jurisdiction of courts in Tamil Nadu, India.
      </p>
    ),
  },

  {
    title: "Modification of Terms",
    content: (
      <p>
        Mitos Learning may update these Terms at any time. Continued use means
        you accept the revised Terms.
      </p>
    ),
  },

  {
    title: "Contact & Grievance Redressal",
    content: (
      <div className="space-y-2">
        <p>
          <strong>Mitos Learning (OPC) Private Limited</strong>
        </p>
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
          We acknowledge grievances within 24 hours and aim to resolve them
          within 15 days (as per IT Rules, 2021).
        </p>
      </div>
    ),
  },
];

// -----------------------------------------------------

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
          Please read these Terms carefully. By using{" "}
          <span className="font-semibold text-blue-700">Mitos Learning</span>,
          you agree to be bound by them.
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
            <div className="text-gray-700 leading-relaxed">
              {section.content}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
