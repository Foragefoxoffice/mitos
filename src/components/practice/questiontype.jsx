"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import {
  fetchQuestionType,
  fetchQuestionBychapter,
} from "../../utils/api";
import { useSelectedQuestionTypes } from "../../contexts/SelectedQuestionTypesContext";
import PremiumPopup from "../PremiumPopup";
import CommonLoader from "../commonLoader";

export default function QuestiontypePage() {
  const { chapterId } = useParams();            // 👈 get chapterId from URL
  const { searchTerm } = useOutletContext();    // 👈 get searchTerm from Dashboard
  const navigate = useNavigate();

  const {
    selectedQuestionTypes,
    setSelectedQuestionTypes,
    setChapterId,
  } = useSelectedQuestionTypes();

  const [availableQuestionTypes, setAvailableQuestionTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  // ✅ Guest check
  const isGuestUser = () => {
    if (typeof window !== "undefined") {
      const roleFromLocal = localStorage.getItem("role");
      const roleFromCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("role="))
        ?.split("=")[1];
      return (roleFromLocal || roleFromCookie) === "guest";
    }
    return false;
  };

  useEffect(() => {
    setIsGuest(isGuestUser());
  }, []);

  // clear selections when chapter changes
  useEffect(() => {
    setSelectedQuestionTypes([]);
    setSelectAll(false);
    if (chapterId) setChapterId(chapterId);
  }, [chapterId, setSelectedQuestionTypes, setChapterId]);

  // load question types for chapter
  useEffect(() => {
    if (!chapterId) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const questionsResponse = await fetchQuestionBychapter(chapterId);
        const questionsData = questionsResponse.data;
        if (!Array.isArray(questionsData)) {
          throw new Error("Invalid questions data format");
        }

        const questionTypeIdsInChapter = [
          ...new Set(questionsData.map((q) => q.questionTypeId)),
        ];

        const typesResponse = await fetchQuestionType();
        const allQuestionTypes = typesResponse.data;
        if (!Array.isArray(allQuestionTypes)) {
          throw new Error("Invalid question types data format");
        }

        const chapterQuestionTypes = allQuestionTypes.filter((type) =>
          questionTypeIdsInChapter.includes(type.id)
        );

        const sorted = isGuest
          ? [...chapterQuestionTypes].sort((a, b) => {
              if (a.isPremium === b.isPremium) return 0;
              return a.isPremium ? 1 : -1;
            })
          : chapterQuestionTypes;

        setSelectedQuestionTypes([]);
        setSelectAll(false);

        setAvailableQuestionTypes(sorted);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Unable to load question types. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [chapterId, isGuest, setSelectedQuestionTypes]);

  // 🔎 filter by search term
  const filteredQuestionTypes = useMemo(() => {
    const term = searchTerm?.trim().toLowerCase();
    if (!term) return availableQuestionTypes;
    return availableQuestionTypes.filter((t) =>
      String(t.name || "").toLowerCase().includes(term)
    );
  }, [availableQuestionTypes, searchTerm]);

  // reset selection when filtered list changes
  useEffect(() => {
    setSelectedQuestionTypes([]);
    setSelectAll(false);
  }, [filteredQuestionTypes, setSelectedQuestionTypes]);

  const handleCheckboxChange = (questionType) => {
    const isLocked = isGuest && questionType.isPremium;
    if (isLocked) {
      setShowPopup(true);
      return;
    }

    const id = questionType.id;
    if (selectedQuestionTypes.includes(id)) {
      setSelectedQuestionTypes(selectedQuestionTypes.filter((i) => i !== id));
      setSelectAll(false);
    } else {
      const updated = [...selectedQuestionTypes, id];
      setSelectedQuestionTypes(updated);

      const allowedCount = filteredQuestionTypes.filter(
        (t) => !isGuest || !t.isPremium
      ).length;
      if (updated.length === allowedCount) setSelectAll(true);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedQuestionTypes([]);
    } else {
      const allowed = filteredQuestionTypes.filter(
        (type) => !isGuest || !type.isPremium
      );
      setSelectedQuestionTypes(allowed.map((type) => type.id));
    }
    setSelectAll(!selectAll);
  };

  const startTest = () => {
    if (selectedQuestionTypes.length > 0) {
      // 👇 route updated to dashboard practice
      navigate(`/user/practice`);
    } else {
      alert("Please select at least one question type.");
    }
  };

  const noMatches =
    !loading && !error && filteredQuestionTypes.length === 0 && searchTerm?.trim();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-[#017bcd] mb-4">
          Attempt by Question Type
        </h1>
      </div>

      {loading && <CommonLoader />}
      {error && <p className="text-center pt-10 text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          {noMatches ? (
            <p className="text-center pt-10">No types match your search.</p>
          ) : filteredQuestionTypes.length > 0 ? (
            <>
              <div className="topic_cards space-y-3">
                {!isGuest && (
                  <div className="topic_card attemtpt-checkbox">
                    <input
                      type="checkbox"
                      id="selectAll"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="appearance-none rounded-full border border-blue-600
                                 checked:bg-blue-600 checked:border-blue-600
                                 relative cursor-pointer
                                 after:content-['✓'] after:text-white after:text-xl
                                 after:absolute after:top-1/2 after:left-1/2
                                 after:-translate-x-1/2 after:-translate-y-[57%]
                                 after:hidden checked:after:block"
                    />
                    <label htmlFor="selectAll" className="cursor-pointer text-lg ml-2">
                      Select All ({filteredQuestionTypes.length} Types)
                    </label>
                  </div>
                )}

                {filteredQuestionTypes.map((type) => {
                  const isLocked = isGuest && type.isPremium;
                  return (
                    <div
                      key={type.id}
                      className={`topic_card flex items-center space-x-2 ${
                        isLocked ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() => {
                        if (isLocked) setShowPopup(true);
                      }}
                    >
                      <label
                        style={{ width: 30 }}
                        className="inline-flex items-center cursor-pointer attemtpt-checkbox"
                      >
                        <input
                          type="checkbox"
                          id={`questionType-${type.id}`}
                          checked={selectedQuestionTypes.includes(type.id)}
                          disabled={isLocked}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleCheckboxChange(type);
                          }}
                          className="appearance-none rounded-full border border-blue-600
                                     checked:bg-blue-600 checked:border-blue-600
                                     relative cursor-pointer
                                     after:content-['✓'] after:text-white after:text-xl
                                     after:absolute after:top-1/2 after:left-1/2
                                     after:-translate-x-1/2 after:-translate-y-[57%]
                                     after:hidden checked:after:block"
                        />
                      </label>

                      <label
                        htmlFor={`questionType-${type.id}`}
                        className="cursor-pointer text-lg"
                      >
                        {type.name}
                        {type.isPremium && isGuest && (
                          <span className="text-red-500 ml-2">🔒 Locked</span>
                        )}
                      </label>
                    </div>
                  );
                })}
              </div>

              <button
                className="mx-auto mt-14 btn bg-blue-600 text-white px-4 py-2 rounded"
                onClick={startTest}
              >
                Lets Practice
              </button>
            </>
          ) : (
            <p className="text-center pt-10">
              No question types available for this chapter.
            </p>
          )}
        </>
      )}

      {showPopup && <PremiumPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
}
