import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const TestResults = ({
  calculateScore,
  totalMarks,
  totalTime,
  timeLeft,
  formatTime,
  userAnswers = {},
  questions = [],
  calculateCorrectAnswers,
  calculateWrongAnswers,
  calculateAccuracy,
  resultsBySubject = {},
  resultsByType = {},
  onShowAnswers,
}) => {
  const navigate = useNavigate();
  const [showTypeResults, setShowTypeResults] = useState(false);

  // ✅ attempted count
  const attempted = Object.keys(userAnswers || {}).length;

  const subjects = ["Physics", "Chemistry", "Biology"];
  const subjectColors = {
    Physics: "bg-[#B57170]",
    Chemistry: "bg-[#E1AD01]",
    Biology: "bg-[#32CD32]",
  };

  // ---------- NEET subject aggregation ----------
  const MARKS_PER_CORRECT = 4;
  const NEGATIVE_PER_WRONG = 1;

  const normalizeToNEET = (raw = "") => {
    const s = String(raw).toLowerCase();
    if (s.includes("phys")) return "Physics";
    if (s.includes("chem")) return "Chemistry";
    if (s.includes("bio") || s.includes("bot") || s.includes("zoo"))
      return "Biology";
    return null;
  };

  const aggregateSubjects = () => {
    const agg = {
      Physics: { correct: 0, wrong: 0 },
      Chemistry: { correct: 0, wrong: 0 },
      Biology: { correct: 0, wrong: 0 },
    };

    // 1) Prefer resultsBySubject
    const rbsValues = Object.values(resultsBySubject || {});
    let usedSource = false;

    if (rbsValues.length > 0) {
      for (const r of rbsValues) {
        const key =
          normalizeToNEET(r?.subjectName || r?.name || r?.subject || r?.title);
        if (!key) continue;
        agg[key].correct += Number(r?.correct || 0);
        agg[key].wrong += Number(r?.wrong || 0);
        usedSource = true;
      }
    }

    // 2) Fallback: use resultsByType[*].subjects
    if (!usedSource) {
      for (const typeData of Object.values(resultsByType || {})) {
        const subjectsMap = typeData?.subjects || {};
        for (const [subjName, subjData] of Object.entries(subjectsMap)) {
          const key = normalizeToNEET(subjName);
          if (!key) continue;
          agg[key].correct += Number(subjData?.correct || 0);
          agg[key].wrong += Number(subjData?.wrong || 0);
        }
      }
    }

    return agg;
  };

  const subjectAgg = aggregateSubjects();

  const processedSubjects = subjects.map((name) => {
    const { correct = 0, wrong = 0 } = subjectAgg[name] || {};
    const marks = correct * MARKS_PER_CORRECT - wrong * NEGATIVE_PER_WRONG;
    return { name, marks };
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 bg-opacity-70 h-auto overflow-auto flex items-center justify-center">
      <div className="relative bg-[#F0F8FF] rounded-2xl shadow-2xl w-[95%] max-w-[800px] p-6 pt-10 text-center">
        {/* Trophy */}
        <div className="absolute -top-[244px] left-1/2 transform -translate-x-1/2">
          <img
            src="/images/practice/done.png"
            alt="Trophy"
            className="w-full h-[400px] object-contain mx-auto"
          />
        </div>

        <h2 className="text-4xl font-bold text-black mb-6 mt-7">Your Score</h2>

        {/* Overall Score & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm md:px-20 px-4">
          <div className="border border-[#D3CBFB] flex flex-col gap-2 rounded-3xl py-4 px-2 bg-white shadow-inner">
            <p className="text-black text-2xl font-semibold">Overall Score :</p>
            <p className="text-[#007ACC] md:text-4xl text-2xl font-semibold">
              {calculateScore()} / {totalMarks}
            </p>
          </div>
          <div className="border border-[#e0e0e0] rounded-3xl py-6 px-4 bg-white flex flex-col gap-2 shadow-inner">
            <p className="text-black text-2xl font-semibold">Total Time Taken:</p>
            <div className="flex justify-center items-center gap-1 text-red-600 font-bold text-2xl">
              <img src="/images/menuicon/time.png" className="w-8 h-auto" />
              {formatTime(totalTime - timeLeft)} MIN
            </div>
          </div>
        </div>

        {/* Subject Score Cards */}
        <div className="grid px-6 grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {processedSubjects.map(({ name, marks }) => (
            <div
              key={name}
              className={`${subjectColors[name]} text-white flex flex-col gap-2 rounded-3xl py-5 px-4 font-semibold text-lg`}
            >
              <p className="text-2xl">{name}</p>
              <p className="text-2xl">{marks}</p>
            </div>
          ))}
        </div>

        {/* Stats Badges */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs mb-6">
          <div className="bg-[#9BCD1326] text-[#759E05] px-2 py-2 rounded-xl font-medium">
            <p className="text-lg font-bold">Correct</p>
            <p className="text-xl font-bold">{calculateCorrectAnswers()}</p>
          </div>
          <div className="bg-[#E3F2FD] text-[#007ACC] px-2 py-2 rounded-xl font-medium">
            <p className="text-lg font-bold">Attempted</p>
            <p className="text-xl font-bold">{attempted}</p>
          </div>
          <div className="bg-[#3157D426] text-[#3457a1] px-2 py-2 rounded-xl font-medium">
            <p className="text-lg font-bold">Unanswered</p>
            <p className="text-xl font-bold">{questions.length - attempted}</p>
          </div>
          <div className="bg-[#D4319026] text-[#b30c91] px-2 py-2 rounded-xl font-medium">
            <p className="text-lg font-bold">Accuracy</p>
            <p className="text-xl font-bold">{calculateAccuracy()}%</p>
          </div>
          <div className="bg-[#D4313126] text-[#b10000] px-2 py-2 rounded-xl font-medium">
            <p className="text-lg font-bold">Wrong</p>
            <p className="text-xl font-bold">{calculateWrongAnswers()}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid md:flex gap-3 md:justify-between justify-center mt-4 bg-white md:rounded-full p-4 rounded-md border border-[#007ACC40]">
          <button
            onClick={() => setShowTypeResults(true)}
            className="bg-[#31CA31] text-white rounded-full py-4 px-4 font-semibold shadow hover:bg-[#009044]"
          >
            View Question Type Analysis
          </button>
          <button
            onClick={() => onShowAnswers?.(true)}
            className="bg-[#31CA31] text-white rounded-full py-4 px-4 font-semibold shadow hover:bg-[#009044]"
          >
            View Answers
          </button>
          <button
            onClick={() => navigate("/user/dashboard")}
            className="bg-[#31CA31] text-white rounded-full py-4 px-4 font-semibold shadow hover:bg-[#009044]"
          >
            Go Back to Another Test
          </button>
        </div>
      </div>

      {/* Type Analysis Popup */}
      {showTypeResults && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
          <div className="bg-white w-[95%] md:w-[600px] rounded-[25px] overflow-hidden shadow-lg">
            {/* Header */}
            <div className="bg-[#007ACC] flex items-center gap-3 px-5 py-4 justify-center">
              <div className="bg-white p-2 rounded-full">
                <img
                  src="/images/practice/last-one.png"
                  alt="icon"
                  className="w-6 h-6 md:w-8 md:h-8"
                />
              </div>
              <h2 className="text-white text-lg md:text-2xl font-semibold">
                Question Type Analysis
              </h2>
            </div>

            {/* Body */}
            <div className="p-4 md:p-6 space-y-6 overflow-auto max-h-[600px]">
              {Object.entries(resultsByType || {}).map(([typeId, typeData]) => (
                <div
                  key={typeId}
                  className="bg-[#F8FBFF] p-4 rounded-[14px] shadow-sm space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-[15px] font-semibold text-[#333]">
                      {typeData.typeName}
                    </h3>
                    <div className="flex gap-2 text-xs md:text-sm">
                      <span className="bg-[#E3F2FD] text-[#007ACC] font-medium px-3 py-1 rounded-full">
                        Attempted: {typeData.attempted}
                      </span>
                      <span className="bg-[#E6F4EA] text-[#28A745] font-medium px-3 py-1 rounded-full">
                        Correct: {typeData.correct}
                      </span>
                      <span className="bg-[#FCECEC] text-[#D32F2F] font-medium px-3 py-1 rounded-full">
                        Wrong: {typeData.wrong}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {Object.entries(typeData.subjects || {}).map(
                      ([subjectId, subjectData]) => (
                        <div
                          key={subjectId}
                          className="flex justify-between items-center bg-white rounded-[10px] px-4 py-2 shadow-sm"
                        >
                          <span className="text-[14px] font-medium text-[#333]">
                            {subjectId}
                          </span>
                          <div className="flex gap-12 text-sm">
                            <span className="text-[#007ACC]">
                              ↻ {subjectData.attempted}
                            </span>
                            <span className="text-[#28A745]">
                              ✓ {subjectData.correct}
                            </span>
                            <span className="text-[#D32F2F]">
                              ✗ {subjectData.wrong}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Close */}
            <div className="py-6 flex justify-center">
              <button
                onClick={() => setShowTypeResults(false)}
                className="bg-[#D32F2F] hover:bg-[#b91c1c] text-white px-8 py-2 rounded-full text-[16px] font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
