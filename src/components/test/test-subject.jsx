"use client";
import React, { useState, useEffect, useMemo, useContext } from "react";
import {
  fetchSubjectsByPortions,
  fetchChaptersBySubject,
} from "../../utils/api";
import { TestContext } from "../../contexts/TestContext";
import { useNavigate, useParams, useOutletContext } from "react-router-dom"; 
import { FaAngleDown } from "react-icons/fa6";
import CommonLoader from "../commonLoader";
import { FiInfo } from "react-icons/fi";

export default function TestSubject() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSubjectId, setExpandedSubjectId] = useState(null);
  const [selectedChapters, setSelectedChapters] = useState({});
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const [questionLimit, setQuestionLimit] = useState(60);

  const { setTestData } = useContext(TestContext);
  const { portionId } = useParams(); // ✅ portion from URL
  const { searchTerm } = useOutletContext(); // ✅ search from Dashboard
  const navigate = useNavigate();
  
  // 🔄 Load subjects + chapters for portion
  useEffect(() => {
    const loadSubjects = async () => {
      if (!portionId) return;

      try {
        setLoading(true);
        setError(null);

        const subjectsData = await fetchSubjectsByPortions(portionId);
        const subjectsWithDetails = await Promise.all(
          subjectsData.map(async (subject) => {
            const details = await fetchChaptersBySubject(subject.id);
            return {
              ...subject,
              chapters: Array.isArray(details) ? details : [],
            };
          })
        );

       // NEW - order: Physics, Chemistry, Biology
const subjectOrder = { Physics: 1, Chemistry: 2, Biology: 3 };

const sorted = subjectsWithDetails.sort((a, b) => {
  const aKey = subjectOrder[a.name] ?? 999;
  const bKey = subjectOrder[b.name] ?? 999;
  return aKey - bKey;
});

        setSubjects(sorted);

        const defaultExpanded = sorted.find((s) => s.chapters.length > 0);
        if (defaultExpanded) setExpandedSubjectId(defaultExpanded.id);
        else setExpandedSubjectId(null);
      } catch (err) {
        console.error(err);
        setError("Unable to load subjects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadSubjects();
  }, [portionId]);

  // 📌 Expand/Collapse Subject
  const toggleSubject = (id) =>
    setExpandedSubjectId((prev) => (prev === id ? null : id));

  // 📌 Toggle chapter
  const toggleChapter = (subjectId, chapterId, chapterName) => {
    setSelectedChapters((prev) => {
      const subjectChapters = prev[subjectId] || {};
      const updated = subjectChapters[chapterId]
        ? { ...subjectChapters, [chapterId]: undefined }
        : { ...subjectChapters, [chapterId]: chapterName };
      return { ...prev, [subjectId]: updated };
    });
  };

  // 📌 Select/Deselect all visible chapters
  const toggleSelectAllVisible = (subjectId, visibleChapters) => {
    setSelectedChapters((prev) => {
      const allSelected = visibleChapters.every((c) => prev[subjectId]?.[c.id]);
      const updated = allSelected
        ? { ...(prev[subjectId] || {}) }
        : {
            ...(prev[subjectId] || {}),
            ...Object.fromEntries(visibleChapters.map((c) => [c.id, c.name])),
          };

      if (allSelected) {
        for (const c of visibleChapters) {
          if (updated[c.id]) delete updated[c.id];
        }
      }
      return { ...prev, [subjectId]: updated };
    });
  };

  // 🔎 Search filter (subjects + chapters)
  const filteredSubjects = useMemo(() => {
    const term = searchTerm?.trim().toLowerCase();
    if (!term) return subjects;

    return subjects
      .map((s) => {
        const subjectMatches = String(s.name || "")
          .toLowerCase()
          .includes(term);
        if (subjectMatches) return s;

        const filteredChapters = (s.chapters || []).filter((c) =>
          String(c.name || "").toLowerCase().includes(term)
        );
        if (filteredChapters.length > 0) {
          return { ...s, chapters: filteredChapters };
        }
        return null;
      })
      .filter(Boolean);
  }, [subjects, searchTerm]);

  // 📌 Keep expanded subject valid after search filter
  useEffect(() => {
    if (!filteredSubjects.length) {
      setExpandedSubjectId(null);
      return;
    }
    const stillVisible = filteredSubjects.some(
      (s) => s.id === expandedSubjectId && s.chapters.length > 0
    );
    if (!stillVisible) {
      const firstWithChapters = filteredSubjects.find(
        (s) => s.chapters.length > 0
      );
      setExpandedSubjectId(firstWithChapters ? firstWithChapters.id : null);
    }
  }, [filteredSubjects, expandedSubjectId]);

  // 📌 Start Test
  const handleStart = () => {
    const selectedIds = Object.values(selectedChapters).flatMap((chapters) =>
      Object.keys(chapters).filter((id) => chapters[id])
    );
    if (!selectedIds.length) return alert("Select at least one chapter");
    setShowLimitPopup(true);
  };

  const confirmStartTest = () => {
    const selectedIds = Object.values(selectedChapters).flatMap((chapters) =>
      Object.keys(chapters).filter((id) => chapters[id])
    );
    setTestData({
      testname: "custom-test",
      portionId,
      chapterIds: selectedIds,
      questionLimit,
    });
    navigate("/user/test"); // ✅ go to start page
  };

  const bgColors = {
    Biology: "bg-[#32CD32]",
    Physics: "bg-[#B57170]",
    Chemistry: "bg-[#E1AD01]",
  };

  const noMatches =
    !loading &&
    !error &&
    filteredSubjects.length === 0 &&
    searchTerm?.trim().length > 0;

  return (
    <div className="py-6 relative">
      {/* Info Box */}
      <div className="mb-4">
        <div className="flex items-center gap-3 rounded-xl border border-purple-200 bg-purple-50 p-3 md:p-4">
          <div className="mt-0.5 inline-flex h-8 w-8 flex-none items-center justify-center rounded-full bg-purple-600">
            <FiInfo className="h-5 w-5 text-white" />
          </div>
          <p className="text-sm md:text-base text-purple-900">
            <span className="font-semibold">Key Info:</span> Each NCERT detail
            is framed in{" "}
            <span className="font-semibold">10+ different question types</span>.
          </p>
        </div>
      </div>

      {loading && <CommonLoader />}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && (
        <>
          {noMatches ? (
            <p className="text-center pt-10">
              No subjects/chapters match your search.
            </p>
          ) : (
            <div className="space-y-3">
              {filteredSubjects.map((subject) => {
                const isExpanded = expandedSubjectId === subject.id;
                const visibleChapters = subject.chapters || [];
                const allSelectedVisible = visibleChapters.length
                  ? visibleChapters.every(
                      (ch) => selectedChapters[subject.id]?.[ch.id]
                    )
                  : false;

                return (
                  <div key={subject.id} className="rounded-lg overflow-hidden">
                    <div
                      className={`flex justify-between items-center px-4 py-6 text-white cursor-pointer ${
                        bgColors[subject.name.split(" ")[1]] || "bg-gray-400"
                      }`}
                      onClick={() => toggleSubject(subject.id)}
                    >
                      <h3 className="font-bold text-lg">
                        {subject.name} | {visibleChapters.length} Chapters
                      </h3>
                      <div
                        className={`transition-transform duration-300 w-7 h-7 rounded-full flex items-center justify-center ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      >
                        <FaAngleDown className="text-white text-sm" />
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="bg-white p-6">
                        {/* Selected Tags */}
                        {Object.entries(selectedChapters).some(
                          ([, chaps]) =>
                            Object.keys(chaps).filter((k) => chaps[k]).length >
                            0
                        ) && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {Object.entries(selectedChapters).flatMap(
                              ([subjId, chaps]) =>
                                Object.entries(chaps)
                                  .filter(([, name]) => !!name)
                                  .map(([chapterId, chapterName]) => (
                                    <div
                                      key={chapterId}
                                      className="flex items-center bg-[#DFF4FF] text-[#007ACC] px-3 py-1 rounded-full text-sm font-medium shadow-sm"
                                    >
                                      {chapterName}
                                      <button
                                        onClick={() =>
                                          toggleChapter(
                                            subjId,
                                            chapterId,
                                            chapterName
                                          )
                                        }
                                        className="ml-2 h-5 w-5 bg-[#007ACC] rounded-full text-[#fff]"
                                      >
                                        &times;
                                      </button>
                                    </div>
                                  ))
                            )}
                          </div>
                        )}

                        {/* Select All */}
                        <div className="flex w-40 items-center mb-4 bg-[#DFF4FF] rounded-full px-4 py-2">
                          <input
                            type="checkbox"
                            checked={allSelectedVisible}
                            onChange={() =>
                              toggleSelectAllVisible(
                                subject.id,
                                visibleChapters
                              )
                            }
                            className="w-4 h-4 border-2 border-blue-500"
                          />
                          <label className="ml-2 font-medium text-[#004C7F]">
                            Select All
                          </label>
                        </div>

                        {/* Chapters */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mt-6">
                          {visibleChapters.map((chapter) => (
                            <label
                              key={chapter.id}
                              className="flex items-center text-gray-700"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  !!selectedChapters[subject.id]?.[chapter.id]
                                }
                                onChange={() =>
                                  toggleChapter(
                                    subject.id,
                                    chapter.id,
                                    chapter.name
                                  )
                                }
                                className="w-4 h-4"
                              />
                              <span className="ml-2 text-md text-black">
                                {chapter.name}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer */}
          <div className="mt-10 text-center">
            <button
              onClick={handleStart}
              className="px-8 py-3 bg-[#31CA31] text-white rounded-full font-medium shadow hover:bg-green-600 cursor-pointer"
            >
              Take Your Test
            </button>
          </div>

          {/* Limit Modal */}
          {showLimitPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl w-full max-w-lg shadow-lg overflow-hidden relative">
                <div className="bg-[#007ACC] text-white text-center text-md md:text-3xl font-semibold py-6">
                  Select Number Of Questions
                </div>

                <div className="px-6 py-4 space-y-4">
                  {[30, 50, 100, 180].map((val) => {
                    const isSelected = questionLimit === val;
                    return (
                      <div
                        key={val}
                        onClick={() => setQuestionLimit(val)}
                        className={`flex bg-[#F0F8FF] items-center px-6 py-6 rounded-lg cursor-pointer border transition-all ${
                          isSelected
                            ? "border-[#007ACC] text-[#000] bg-blue-50 shadow-sm"
                            : "border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-5 h-5 flex items-center justify-center rounded border ${
                              isSelected
                                ? "bg-blue-600 border-blue-600"
                                : "border-gray-300"
                            }`}
                          >
                            {isSelected && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                viewBox="0 0 24 24"
                              >
                                <path d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="text-base font-medium">
                            {val} Questions
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="px-6 py-4 flex justify-between">
                  <button
                    onClick={() => setShowLimitPopup(false)}
                    className="px-12 py-2 bg-[#CDEFE3] text-[#068457] rounded-full font-medium cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={confirmStartTest}
                    className="px-4 py-2 bg-[#31CA31] text-white rounded-full font-medium shadow hover:bg-green-600 cursor-pointer"
                  >
                    Start Test
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
