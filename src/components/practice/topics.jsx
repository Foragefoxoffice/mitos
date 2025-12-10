"use client";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { fetchTopics, fetchQuestionByTopic } from "../../utils/api";
import { useSelectedTopics } from "../../contexts/SelectedTopicsContext";
import axios from "axios";
import PremiumPopup from "../PremiumPopup";
import CommonLoader from "../commonLoader";

// Special topics → always last
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
    // If premium and expiry is in the future → unrestricted
    if (premiumExpiry && premiumExpiry > now) return false;
    // If premium but expired → restricted
    return true;
  }

  // 4️⃣ Check TRIALED status with active trial
  if (status === "TRIALED") {
    const trialEndsAt = user.trialEndsAt ? new Date(user.trialEndsAt) : null;
    // If trial and expiry is in the future → unrestricted
    if (trialEndsAt && trialEndsAt > now) return false;
    // If trial but expired → restricted
    return true;
  }

  // 5️⃣ REGISTERED (no premium/trial) → restricted
  if (status === "REGISTERED") return true;

  // 6️⃣ Default: restrict unknown statuses
  return true;
};

export default function TopicsPage() {
  const { chapterId } = useParams();
  const { searchTerm } = useOutletContext();
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [chapterName, setChapterName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const { selectedTopics, setSelectedTopics } = useSelectedTopics();

  useEffect(() => {
    const loadTopics = async () => {
      try {
        setLoading(true);

        const response = await fetchTopics(chapterId);
        const { data, chapterName } = response;

        setChapterName(chapterName);

        const topicsWithQuestions = await Promise.all(
          data.map(async (topic) => {
            try {
              const res = await fetchQuestionByTopic(topic.id);
              let count = 0;

              if (Array.isArray(res?.data)) count = res.data.length;
              else if (Array.isArray(res)) count = res.length;

              return { ...topic, questionCount: count };
            } catch {
              return { ...topic, questionCount: 0 };
            }
          })
        );

        setTopics(topicsWithQuestions);

        const valid = topicsWithQuestions.filter((t) => t.questionCount > 0);
        setFilteredTopics(valid);
      } catch (err) {
        setError("Unable to load topics.");
      } finally {
        setLoading(false);
      }
    };

    if (chapterId) loadTopics();
  }, [chapterId]);

  // Search filtering
  useEffect(() => {
    const term = searchTerm?.trim().toLowerCase() || "";
    const valid = topics.filter((t) => t.questionCount > 0);

    const result = term
      ? valid.filter((t) => t.name.toLowerCase().includes(term))
      : valid;

    setFilteredTopics(result);
  }, [topics, searchTerm]);

  // Reset all selections when list changes
  useEffect(() => {
    setSelectedTopics([]);
    setSelectAll(false);
  }, [filteredTopics]);

  const handleCheckboxChange = (topic) => {
    if (isRestrictedUser() && topic.isPremium) {
      setShowPopup(true);
      return;
    }

    if (selectedTopics.includes(topic.id)) {
      setSelectedTopics(selectedTopics.filter((id) => id !== topic.id));
      setSelectAll(false);
    } else {
      const updated = [...selectedTopics, topic.id];

      const allowedCount = filteredTopics.filter(
        (t) => !isRestrictedUser() || !t.isPremium
      ).length;

      setSelectedTopics(updated);

      if (updated.length === allowedCount) setSelectAll(true);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTopics([]);
    } else {
      const allowed = filteredTopics.filter(
        (t) => !isRestrictedUser() || !t.isPremium
      );
      setSelectedTopics(allowed.map((t) => t.id));
    }
    setSelectAll(!selectAll);
  };

  const startTest = () => {
    if (selectedTopics.length === 0) {
      alert("Please select at least one topic.");
      return;
    }
    navigate("/user/practice");
  };

  const noMatches =
    !loading && !error && filteredTopics.length === 0 && searchTerm?.trim();

  /* ---------------------------------------------------
     ✅ SORTING LOGIC
     For restricted users (Guest + Registered):
       1. Free regular topics
       2. Free special topics (ordered by SPECIAL_BOTTOM_ORDER)
       3. Premium regular topics
       4. Premium special topics (ordered by SPECIAL_BOTTOM_ORDER)
     
     For premium users:
       1. Regular topics
       2. Special topics (ordered by SPECIAL_BOTTOM_ORDER)
  --------------------------------------------------- */
  const restricted = isRestrictedUser();

  let orderedTopics = [];

  // 🟦 If user is GUEST or REGISTERED → FREE FIRST, then apply special ordering within each group
  if (restricted) {
    // Free regular topics (not special)
    const freeRegular = filteredTopics.filter(
      (t) => !t.isPremium && getSpecialRank(t.name) === -1
    );

    // Free special topics (ordered by SPECIAL_BOTTOM_ORDER)
    const freeSpecial = filteredTopics
      .filter((t) => !t.isPremium && getSpecialRank(t.name) !== -1)
      .sort((a, b) => getSpecialRank(a.name) - getSpecialRank(b.name));

    // Premium regular topics (not special)
    const premiumRegular = filteredTopics.filter(
      (t) => t.isPremium && getSpecialRank(t.name) === -1
    );

    // Premium special topics (ordered by SPECIAL_BOTTOM_ORDER)
    const premiumSpecial = filteredTopics
      .filter((t) => t.isPremium && getSpecialRank(t.name) !== -1)
      .sort((a, b) => getSpecialRank(a.name) - getSpecialRank(b.name));

    orderedTopics = [...freeRegular, ...freeSpecial, ...premiumRegular, ...premiumSpecial];
  }

  // 🟩 If PREMIUM user → normal topics first, special last
  else {
    const normalTopics = filteredTopics.filter(
      (t) => getSpecialRank(t.name) === -1
    );

    const specialTopics = filteredTopics
      .filter((t) => getSpecialRank(t.name) !== -1)
      .sort((a, b) => getSpecialRank(a.name) - getSpecialRank(b.name));

    orderedTopics = [...normalTopics, ...specialTopics];
  }


  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-[#017bcd] pb-6">Attempt by Topic</h1>

      {chapterName && <h2 className="text-lg mb-4">{chapterName}</h2>}

      {loading && <CommonLoader />}
      {error && <p className="text-center pt-10 text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          {noMatches && (
            <p className="text-center pt-10">No topics match your search.</p>
          )}

          {!noMatches && (
            <>
              <div className="topic_cards space-y-3">

                {/* Select All only for premium users */}
                {filteredTopics.length > 0 && !restricted && (
                  <div className="topic_card">
                    <input
                      type="checkbox"
                      id="selectAll"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                    <label htmlFor="selectAll" className="ml-2 cursor-pointer">
                      Full Chapter ({filteredTopics.length} topics)
                    </label>
                  </div>
                )}

                {orderedTopics.map((topic) => {
                  const locked = restricted && topic.isPremium;

                  return (
                    <div
                      key={topic.id}
                      className={`topic_card flex items-center space-x-2 ${locked ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      onClick={() => {
                        if (locked) setShowPopup(true);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTopics.includes(topic.id)}
                        disabled={locked}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleCheckboxChange(topic);
                        }}
                      />

                      <label className="cursor-pointer text-lg font-normal">
                        {topic.name}
                        {locked && (
                          <span className="text-red-500 ml-2">🔒 Locked</span>
                        )}
                      </label>
                    </div>
                  );
                })}
              </div>

              {filteredTopics.length > 0 && (
                <button
                  className="mx-auto mt-14 btn bg-green-500 text-white px-4 py-2 rounded"
                  onClick={startTest}
                >
                  Lets Practice
                </button>
              )}
            </>
          )}
        </>
      )}

      {showPopup && <PremiumPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
}
