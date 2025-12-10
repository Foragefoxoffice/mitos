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

// Special question types that should appear at the end
const SPECIAL_BOTTOM_ORDER = [
  "Previous Year Questions",
  "Previous Year Questions-Part 1",
  "Previous Year Questions-Part 2",
  "Assertion & Reason Questions",
  "Picture Based Questions",
  "Match Questions",
  "NCERT Exemplar Questions",
];

const getSpecialRank = (name = "") => {
  const i = SPECIAL_BOTTOM_ORDER.findIndex(
    (t) => t.toLowerCase() === name.toLowerCase().trim()
  );
  return i === -1 ? -1 : i;
};

/* ---------------------------------------------------
   🔐 ACCESS LOGIC
   Guest → restricted
   Registered → restricted
   Trial (active) → unrestricted
   Premium (active) → unrestricted
--------------------------------------------------- */
const isRestrictedUser = () => {
  if (typeof window === "undefined") return true;

  // 1️⃣ Check if user is a guest (no token)
  const token = localStorage.getItem("token");
  if (!token) return true;

  const role = (localStorage.getItem("role") || "").toUpperCase();
  if (role === "GUEST") return true;

  // 2️⃣ Get user data from localStorage
  const stored = localStorage.getItem("user");
  if (!stored) return true;

  let user;
  try {
    user = JSON.parse(stored);
  } catch {
    return true;
  }

  const status = (user.status || "").toUpperCase();
  const now = new Date();

  // 3️⃣ Check PREMIUM status with active expiry
  if (status === "PREMIUM") {
    const premiumExpiry = user.premiumExpiry ? new Date(user.premiumExpiry) : null;
    if (premiumExpiry && premiumExpiry > now) return false;
    return true;
  }

  // 4️⃣ Check TRIALED status with active trial
  if (status === "TRIALED") {
    const trialEndsAt = user.trialEndsAt ? new Date(user.trialEndsAt) : null;
    if (trialEndsAt && trialEndsAt > now) return false;
    return true;
  }

  // 5️⃣ REGISTERED (no premium/trial) → restricted
  if (status === "REGISTERED") return true;

  // 6️⃣ Default: restrict unknown statuses
  return true;
};

export default function QuestiontypePage() {
  const { chapterId } = useParams();
  const { searchTerm } = useOutletContext();
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

        // Apply smart sorting based on user restriction status
        const restricted = isRestrictedUser();
        let sorted;

        if (restricted) {
          // Free regular types
          const freeRegular = chapterQuestionTypes.filter(
            (t) => !t.isPremium && getSpecialRank(t.name) === -1
          );

          // Free special types
          const freeSpecial = chapterQuestionTypes
            .filter((t) => !t.isPremium && getSpecialRank(t.name) !== -1)
            .sort((a, b) => getSpecialRank(a.name) - getSpecialRank(b.name));

          // Premium regular types
          const premiumRegular = chapterQuestionTypes.filter(
            (t) => t.isPremium && getSpecialRank(t.name) === -1
          );

          // Premium special types
          const premiumSpecial = chapterQuestionTypes
            .filter((t) => t.isPremium && getSpecialRank(t.name) !== -1)
            .sort((a, b) => getSpecialRank(a.name) - getSpecialRank(b.name));

          sorted = [...freeRegular, ...freeSpecial, ...premiumRegular, ...premiumSpecial];
        } else {
          // Premium users: normal then special
          const normalTypes = chapterQuestionTypes.filter(
            (t) => getSpecialRank(t.name) === -1
          );

          const specialTypes = chapterQuestionTypes
            .filter((t) => getSpecialRank(t.name) !== -1)
            .sort((a, b) => getSpecialRank(a.name) - getSpecialRank(b.name));

          sorted = [...normalTypes, ...specialTypes];
        }

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
  }, [chapterId, setSelectedQuestionTypes]);

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
    const restricted = isRestrictedUser();
    const isLocked = restricted && questionType.isPremium;
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
        (t) => !restricted || !t.isPremium
      ).length;
      if (updated.length === allowedCount) setSelectAll(true);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedQuestionTypes([]);
    } else {
      const restricted = isRestrictedUser();
      const allowed = filteredQuestionTypes.filter(
        (type) => !restricted || !type.isPremium
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
                {!isRestrictedUser() && (
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
                  const restricted = isRestrictedUser();
                  const isLocked = restricted && type.isPremium;
                  return (
                    <div
                      key={type.id}
                      className={`topic_card flex items-center space-x-2 ${isLocked ? "opacity-50 cursor-not-allowed" : ""
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
                        {isLocked && (
                          <span className="text-red-500 ml-2">🔒 Locked</span>
                        )}
                      </label>
                    </div>
                  );
                })}
              </div>

              <button
                className="mx-auto mt-14 btn bg-green-500 text-white px-4 py-2 rounded"
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
