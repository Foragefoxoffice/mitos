import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TestContext } from "@/contexts/TestContext";
import { FiClock, FiClipboard } from "react-icons/fi";

const TEST_LABELS = {
  "full-portion": "Full Test",
  "portion-full-test": "Portion Test",
  "custom-test": "Custom Test",
};

function normalizeToNEET(raw = "") {
  const s = String(raw).toLowerCase();
  if (s.includes("phys")) return "Physics";
  if (s.includes("chem")) return "Chemistry";
  if (s.includes("bio") || s.includes("bot") || s.includes("zoo")) return "Biology";
  return null;
}

function TestAnalyticsPopup({ test, onClose }) {
  const subjects = ["Physics", "Chemistry", "Biology"];
  const subjectColors = {
    Physics: "bg-[#B57170]",
    Chemistry: "bg-[#E1AD01]",
    Biology: "bg-[#32CD32]",
  };

  const subjectAgg = {
    Physics: { correct: 0, wrong: 0 },
    Chemistry: { correct: 0, wrong: 0 },
    Biology: { correct: 0, wrong: 0 },
  };

  Object.values(test.resultsBySubject || {}).forEach((r) => {
    const key = normalizeToNEET(r?.subjectName || r?.name || r?.subject || r?.title);
    if (key) {
      subjectAgg[key].correct += Number(r?.correct || 0);
      subjectAgg[key].wrong += Number(r?.wrong || 0);
    }
  });

  const processedSubjects = subjects.map((name) => ({
    name,
    marks: subjectAgg[name].correct * 4 - subjectAgg[name].wrong,
  }));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 overflow-y-auto flex items-center justify-center p-4">
      <div className="bg-[#F0F8FF] rounded-2xl shadow-2xl w-full max-w-[600px] p-6">
        <h2 className="text-2xl font-bold text-[#007ACC] mb-1">Analytics</h2>
        <p className="text-gray-400 text-sm mb-5">
          {new Date(test.date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        {/* Score + Time */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="border border-[#D3CBFB] rounded-2xl py-4 px-4 bg-white text-center shadow-inner">
            <p className="text-sm text-gray-500 font-medium">Overall Score</p>
            <p className="text-3xl font-bold text-[#007ACC]">
              {test.score} <span className="text-lg text-gray-400">/ {test.totalMarks}</span>
            </p>
          </div>
          <div className="border border-gray-200 rounded-2xl py-4 px-4 bg-white text-center shadow-inner">
            <p className="text-sm text-gray-500 font-medium">Time Taken</p>
            <p className="text-3xl font-bold text-red-500">{test.timeTaken}</p>
          </div>
        </div>

        {/* Subject marks */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {processedSubjects.map(({ name, marks }) => (
            <div
              key={name}
              className={`${subjectColors[name]} text-white flex flex-col items-center rounded-2xl py-4 px-2 font-semibold`}
            >
              <p className="text-base">{name}</p>
              <p className="text-2xl">{marks}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-[#32CD32] text-white rounded-xl py-3 text-center">
            <p className="text-sm">Correct</p>
            <p className="text-2xl font-bold">{test.correct}</p>
          </div>
          <div className="bg-[#d43131] text-white rounded-xl py-3 text-center">
            <p className="text-sm">Wrong</p>
            <p className="text-2xl font-bold">{test.wrong}</p>
          </div>
          <div className="bg-[#d49331] text-white rounded-xl py-3 text-center">
            <p className="text-sm">Skipped</p>
            <p className="text-2xl font-bold">{test.unanswered}</p>
          </div>
          <div className="bg-[#d43190fe] text-white rounded-xl py-3 text-center">
            <p className="text-sm">Accuracy</p>
            <p className="text-2xl font-bold">{test.accuracy}%</p>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-[#D32F2F] hover:bg-[#b91c1c] text-white px-10 py-2 rounded-full font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyTestsPage() {
  const navigate = useNavigate();
  const { setSavedTestData } = useContext(TestContext);
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("myTests") || "[]");
    setTests(stored);
  }, []);

  const handleTestClick = (test) => {
    setSelectedTest(test);
    setShowActionModal(true);
  };

  const handleReattempt = () => {
    setShowActionModal(false);
    setSavedTestData({
      mode: "reattempt",
      questions: selectedTest.questions,
      testName: selectedTest.testName,
    });
    navigate("/user/test");
  };

  const handleViewAnswers = () => {
    setShowActionModal(false);
    setSavedTestData({
      mode: "view-answers",
      questions: selectedTest.questions,
      userAnswers: selectedTest.userAnswers,
      testName: selectedTest.testName,
    });
    navigate("/user/test");
  };

  const handleAnalytics = () => {
    setShowActionModal(false);
    setShowAnalytics(true);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 pt-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/user/dashboard")}
          className="flex items-center px-3 py-1.5 rounded-md bg-[#007ACC] text-white font-medium text-sm hover:bg-[#005fa3] transition-colors"
        >
          ← Back
        </button>
        <div className="flex items-center gap-2">
          <FiClipboard size={22} className="text-[#007ACC]" />
          <h1 className="text-2xl font-bold text-[#007ACC]">My Tests</h1>
        </div>
      </div>

      {tests.length === 0 ? (
        <div className="text-center py-20">
          <FiClipboard size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg font-medium">No tests attempted yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Complete a test from the dashboard to see it here.
          </p>
          <button
            onClick={() => navigate("/user/dashboard/test/portions")}
            className="mt-6 bg-[#007ACC] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#005fa3] transition-colors"
          >
            Start a Test
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tests.map((test) => (
            <div
              key={test.id}
              onClick={() => handleTestClick(test)}
              className="bg-white rounded-2xl shadow-sm border border-[#007ACC20] p-5 cursor-pointer hover:shadow-md hover:border-[#007ACC50] transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="bg-[#007ACC15] text-[#007ACC] text-xs font-semibold px-3 py-1 rounded-full">
                    {TEST_LABELS[test.testName] || "Test"}
                  </span>
                  <p className="text-xs text-gray-400 mt-1.5">
                    {new Date(test.date).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#007ACC]">{test.score}</p>
                  <p className="text-xs text-gray-400">/ {test.totalMarks}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-xs mb-3">
                <div className="bg-[#32CD3215] rounded-lg py-2">
                  <p className="text-[#32CD32] font-bold text-base">{test.correct}</p>
                  <p className="text-gray-500">Correct</p>
                </div>
                <div className="bg-[#d4313115] rounded-lg py-2">
                  <p className="text-[#d43131] font-bold text-base">{test.wrong}</p>
                  <p className="text-gray-500">Wrong</p>
                </div>
                <div className="bg-[#d4933115] rounded-lg py-2">
                  <p className="text-[#d49331] font-bold text-base">{test.unanswered}</p>
                  <p className="text-gray-500">Skipped</p>
                </div>
                <div className="bg-[#d4319015] rounded-lg py-2">
                  <p className="text-[#d43190fe] font-bold text-base">{test.accuracy}%</p>
                  <p className="text-gray-500">Accuracy</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <FiClock size={11} />
                  {test.timeTaken} min
                </span>
                <span>•</span>
                <span>{test.questions?.length || 0} Questions</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && selectedTest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-xl font-bold text-[#007ACC] mb-1">
              {TEST_LABELS[selectedTest.testName] || "Test"}
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Score: {selectedTest.score}/{selectedTest.totalMarks} &nbsp;•&nbsp;{" "}
              {new Date(selectedTest.date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleReattempt}
                className="w-full bg-[#007ACC] text-white rounded-xl py-3 font-semibold hover:bg-[#005fa3] transition-colors"
              >
                🔄 Re-attempt Test
              </button>
              <button
                onClick={handleViewAnswers}
                className="w-full bg-[#32CD32] text-white rounded-xl py-3 font-semibold hover:bg-[#28a528] transition-colors"
              >
                👁 View Answers
              </button>
              <button
                onClick={handleAnalytics}
                className="w-full bg-[#d43190fe] text-white rounded-xl py-3 font-semibold hover:bg-[#b02870] transition-colors"
              >
                📊 Analytics Score
              </button>
              <button
                onClick={() => setShowActionModal(false)}
                className="w-full border border-gray-300 text-gray-600 rounded-xl py-3 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Popup */}
      {showAnalytics && selectedTest && (
        <TestAnalyticsPopup
          test={selectedTest}
          onClose={() => setShowAnalytics(false)}
        />
      )}
    </div>
  );
}
