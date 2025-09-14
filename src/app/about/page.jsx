import React from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Target, Eye, Layers, Users } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

export default function About() {
  return (
    <div className="min-h-screen text-gray-800 bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
        className="py-20 text-center px-6 relative overflow-hidden"
      >
        {/* subtle background gradient blob */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"></div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 drop-shadow-md">
          About Us
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed">
          <span className="font-semibold text-blue-700">Mitos Learning</span> is a
          Tamil Nadu–based educational technology platform dedicated to helping
          students prepare for NEET with innovative tools, expert content, and
          cutting-edge analytics.
        </p>
      </motion.section>

      {/* Mission & Vision */}
      <section className="grid md:grid-cols-2 gap-10 px-6 md:px-16 relative z-10">
        {[
          {
            icon: <Target className="w-8 h-8 text-blue-700" />,
            title: "Our Mission",
            desc: "To empower every NEET aspirant — whether in a city or a small town — with accessible, effective, and affordable test preparation tools. We aim to remove barriers so motivated students can achieve their medical dreams.",
          },
          {
            icon: <Eye className="w-8 h-8 text-indigo-700" />,
            title: "Our Vision",
            desc: "To become India’s most trusted and effective NEET preparation partner — blending technology, analytics, and expert content to make success achievable for every student.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={i}
            className="group relative"
          >
            <div className="h-full rounded-3xl p-8 bg-white/70 backdrop-blur-xl border border-white/30 shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3">
                {item.icon}
                <h2 className="text-2xl font-bold text-blue-800">{item.title}</h2>
              </div>
              <p className="mt-4 text-gray-700 leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* What We Offer */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={2}
        className="px-6 md:px-16 py-20"
      >
        <h2 className="text-4xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700">
          What We Offer
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "Practice Tests",
              desc: "Thousands of NEET-style questions with detailed solutions.",
              icon: <Layers className="w-10 h-10 text-blue-600" />,
            },
            {
              title: "Smart Analytics",
              desc: "Track your progress, identify weak areas, and improve faster.",
              icon: <Target className="w-10 h-10 text-indigo-600" />,
            },
            {
              title: "Easy Access",
              desc: "Free login with Google — quick, secure, and reliable.",
              icon: <Eye className="w-10 h-10 text-purple-600" />,
            },
            {
              title: "Community",
              desc: "Connect with peers & mentors for tips, guidance, and support.",
              icon: <Users className="w-10 h-10 text-pink-600" />,
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="group"
            >
              <div className="h-full rounded-2xl p-8 bg-white shadow-md border hover:shadow-xl hover:scale-[1.03] transition-all duration-300 flex flex-col items-start">
                {item.icon}
                <h3 className="text-xl font-semibold mt-4 text-blue-700">{item.title}</h3>
                <p className="mt-2 text-gray-600">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Our Approach */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={3}
        className="px-6 md:px-16 py-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl"
      >
        <h2 className="text-4xl font-extrabold text-center mb-12 text-blue-700">
          Our Approach
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Student-Centered",
              desc: "Every feature is designed to help you learn efficiently and confidently.",
            },
            {
              title: "Data Privacy",
              desc: "We only collect the essential info needed to personalize your learning.",
            },
            {
              title: "Continuous Improvement",
              desc: "We listen to feedback and constantly improve our content & technology.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="bg-white rounded-2xl p-8 shadow hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-indigo-700">{item.title}</h3>
              <p className="mt-3 text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Contact Us */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={4}
        className="px-6 md:px-20 py-20 relative overflow-hidden text-white mt-20"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-800 -z-10"></div>
        <h2 className="text-4xl font-extrabold text-center mb-12 text-blue-700">Contact Us</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
          <p className="flex items-center gap-3 text-lg">
            <MapPin className="w-6 h-6" /> 13/1-116, Mettur, Salem, Tamil Nadu – 636403
          </p>
          <p className="flex items-center gap-3 text-lg">
            <Mail className="w-6 h-6" />
            <a
              href="mailto:support@mitoslearning.in"
              className="hover:underline decoration-2"
            >
              support@mitoslearning.in
            </a>
          </p>
        </div>
      </motion.section>
    </div>
  );
}
