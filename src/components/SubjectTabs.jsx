import React, { useEffect, useMemo, useState } from "react";
import { useSelectedQuestionTypes } from "@/contexts/SelectedQuestionTypesContext";
import { useNavigate } from "react-router-dom";

/**
 * Props:
 * - monthData: the selected month data (object with resultsByChapter/resultsByType)
 * - section: "resultsByChapter" | "resultsByType"
 * - orderedSubjects: (optional) array of subject keys in desired order (actual keys that appear in monthData)
 * - groupedSubjects: (optional) map { grade: [{ originalName, displayName }, ...], ... }
 */
const SubjectTabs = ({ monthData = {}, section = "", orderedSubjects = [], groupedSubjects = {} }) => {
  const navigate = useNavigate();
  const {
    setSelectedQuestionTypes,
    setSelectedQuestionTypeId,
    setChapterId,
    setSubject,
    setSubjectId,
  } = useSelectedQuestionTypes();

  // subject order mapping
  const subjectOrder = { Physics: 1, Chemistry: 2, Biology: 3 };

  const getBaseSubject = (subjectKey = "") => {
    const clean = String(subjectKey).replace(/^\d+\s*/, "").toLowerCase();
    if (clean.includes("phys")) return "Physics";
    if (clean.includes("chem")) return "Chemistry";
    if (clean.includes("bio")) return "Biology";
    return subjectKey;
  };

  // Build mapping originalName -> displayName from groupedSubjects
  const subjectLabelMap = useMemo(() => {
    const map = {};
    if (groupedSubjects && typeof groupedSubjects === "object") {
      Object.values(groupedSubjects).forEach((arr) => {
        arr.forEach((item) => {
          if (item && item.originalName) {
            // keep originalName (with grade) as label
            map[item.originalName] = item.originalName;
          }
        });
      });
    }
    return map;
  }, [groupedSubjects]);

  // Build subjects array in the order we want
  const subjectsArray = useMemo(() => {
    let subjectKeys = [];

    if (Array.isArray(orderedSubjects) && orderedSubjects.length > 0) {
      subjectKeys = orderedSubjects;
    } else if (groupedSubjects && Object.keys(groupedSubjects).length > 0) {
      Object.keys(groupedSubjects).forEach((grade) => {
        groupedSubjects[grade].forEach((item) => subjectKeys.push(item.originalName));
      });
    } else {
      const setOfKeys = new Set();
      const sec = monthData?.[section] || {};
      Object.values(sec).forEach((entry) => {
        if (entry?.subjects && typeof entry.subjects === "object") {
          Object.keys(entry.subjects).forEach((s) => setOfKeys.add(s));
        }
      });
      subjectKeys = [...setOfKeys];
    }

    // sort keys by subjectOrder (Physics -> Chemistry -> Biology), keep grade numbers
   // sort keys first by grade (11 before 12), then by subjectOrder
subjectKeys.sort((a, b) => {
  // extract grade number (e.g. "11" from "11 Physics")
  const gradeA = parseInt(a.match(/^\d+/)?.[0] || "999", 10);
  const gradeB = parseInt(b.match(/^\d+/)?.[0] || "999", 10);

  if (gradeA !== gradeB) return gradeA - gradeB;

  // within the same grade, sort Physics → Chemistry → Biology
  const aBase = getBaseSubject(a);
  const bBase = getBaseSubject(b);
  const aOrder = subjectOrder[aBase] ?? 999;
  const bOrder = subjectOrder[bBase] ?? 999;
  return aOrder - bOrder;
});


    return subjectKeys.map((key) => ({
      key,
      label: subjectLabelMap[key] || key, // label = full name with grade
    }));
  }, [orderedSubjects, groupedSubjects, subjectLabelMap, monthData, section]);

  const [activeSubjectKey, setActiveSubjectKey] = useState(
    subjectsArray.length > 0 ? subjectsArray[0].key : ""
  );

  // Keep activeSubjectKey valid
  useEffect(() => {
    if (subjectsArray.length === 0) {
      setActiveSubjectKey("");
      return;
    }
    if (!activeSubjectKey || !subjectsArray.some((s) => s.key === activeSubjectKey)) {
      setActiveSubjectKey(subjectsArray[0].key);
    }
  }, [subjectsArray, activeSubjectKey]);

 const handlePracticeNavigation = (chapterName, chapterData) => {
  const subjectStats = chapterData.subjects[activeSubjectKey];
  const selectedSubjectId = subjectStats?.subjectId;

  setSubject(activeSubjectKey);
  setSubjectId(selectedSubjectId);

  if (section === "resultsByType") {
    // set both single and array
    setSelectedQuestionTypes([chapterData.typeId]);
    setSelectedQuestionTypeId(chapterData.typeId);  // ✅ single ID
  } else if (section === "resultsByChapter") {
    setChapterId(chapterData.chapterId);
  }

  navigate("/user/practice");
};
  const mergedChapterData = useMemo(() => {
    if (section !== "resultsByChapter") return monthData?.resultsByType || {};
    return monthData?.resultsByChapter || {};
  }, [monthData, section]);

  const calculateAccuracy = (correct, attempted) => {
    if (!attempted || Number(attempted) === 0) return 0;
    return ((correct / attempted) * 100).toFixed(2);
  };

  if (!subjectsArray.length) {
    return (
      <div className="py-6">
        <p className="text-center text-gray-500">No subject data available.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex space-x-4 mb-6 overflow-auto">
        {subjectsArray.map(({ key, label }) => (
          <button
            key={key}
            className={`px-4 py-2 rounded text-md font-semibold whitespace-nowrap ${
              activeSubjectKey === key
                ? "bg-[#31CA31] text-white"
                : "bg-white text-[#35095e] border border-gray-200 hover:text-[#017bcd] duration-200"
            }`}
            onClick={() => setActiveSubjectKey(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg overflow-hidden">
        <div className="table-scroll-container overflow-x-auto relative">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#017ACC]">
              <tr>
                <th className="px-4 py-2 text-left text-md font-medium text-white uppercase tracking-wider">
                  {section === "resultsByChapter" ? "Chapter" : "Type"}
                </th>
                <th className="px-4 py-2 text-center text-md font-medium text-white uppercase tracking-wider">Attempted</th>
                <th className="px-4 py-2 text-center text-md font-medium text-white uppercase tracking-wider">Correct</th>
                <th className="px-4 py-2 text-center text-md font-medium text-white uppercase tracking-wider">Wrong</th>
                <th className="px-4 py-2 text-center text-md font-medium text-white uppercase tracking-wider">Correct %</th>
                <th className="px-4 py-2 text-center text-md font-medium text-white uppercase tracking-wider">Wrong %</th>
                <th className="px-4 py-2 text-center text-md font-medium text-white uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(mergedChapterData || {})
                .filter(([_, metrics]) => metrics?.subjects && metrics.subjects[activeSubjectKey])
                .sort(([, a], [, b]) => {
                  const aData = a.subjects[activeSubjectKey];
                  const bData = b.subjects[activeSubjectKey];
                  const aWrongPct = aData.attempted > 0 ? aData.wrong / aData.attempted : 0;
                  const bWrongPct = bData.attempted > 0 ? bData.wrong / bData.attempted : 0;
                  return bWrongPct - aWrongPct;
                })
                .map(([chapter, metrics]) => {
                  const subjectData = metrics.subjects[activeSubjectKey];
                  const { attempted = 0, correct = 0, wrong = 0 } = subjectData || {};
                  const accuracy = calculateAccuracy(correct, attempted);
                  const wrongAccuracy = calculateAccuracy(wrong, attempted);

                  return (
                    <tr key={chapter}>
                      <td className="flex gap-3 items-center px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                        <div className="relative w-8 h-8 flex items-center justify-center">
                          <svg className="w-full h-full" viewBox="0 0 50 50">
                            <circle className="text-gray-200" strokeWidth="5" stroke="currentColor" fill="transparent" r={20} cx="25" cy="25" />
                            <circle
                              className="text-[#FF5252]"
                              strokeWidth="5"
                              strokeDasharray={2 * Math.PI * 20}
                              strokeDashoffset={2 * Math.PI * 20 - (parseFloat(accuracy) / 100) * 2 * Math.PI * 20}
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="transparent"
                              r={20}
                              cx="25"
                              cy="25"
                              transform="rotate(-90 25 25)"
                            />
                          </svg>
                        </div>
                        <p className="flex items-center">{chapter}</p>
                      </td>

                      <td className="px-4 py-3 text-center text-[#282c35]">{attempted}</td>
                      <td className="px-4 py-3 text-center text-[#282c35]">{correct}</td>
                      <td className="px-4 py-3 text-center text-red-500">{wrong}</td>
                      <td className="px-4 py-3 text-center text-blue-600">{accuracy}%</td>
                      <td className="px-4 py-3 text-center text-red-600">{wrongAccuracy}%</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handlePracticeNavigation(chapter, metrics)}
                          className="px-3 py-1 bg-[#31CA31] text-white rounded-full hover:bg-[#16a34a] transition-colors"
                        >
                          Practice
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubjectTabs;
