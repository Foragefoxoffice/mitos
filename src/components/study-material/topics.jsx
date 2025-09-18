import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import { fetchTopicsWithPDF } from "../../utils/api";
import PremiumPopup from "../PremiumPopup";
import CommonLoader from "../commonLoader";

export default function MeterialsTopicsPage({
  selectedChapter,
  onTopicSelect,
  searchTerm = "",
}) {
  const { chapterId } = useParams(); // ✅ get from /chapters/:chapterId/topics

  const [topics, setTopics] = useState([]);
  const [chapterName, setChapterName] = useState(selectedChapter?.name || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  // ✅ guest check
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

  // ✅ check if topic or any PDF inside is premium
  const topicHasPremiumPdf = (topic) =>
    Array.isArray(topic?.pdf) && topic.pdf.some((p) => !!p?.isPremium);

  const isLockedForGuest = (topic) =>
    isGuestUser() && (topic?.isPremium || topicHasPremiumPdf(topic));

  // ✅ fetch topics for this chapter
  useEffect(() => {
    const loadTopicsWithPDFs = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!chapterId) {
          setLoading(false);
          setError("No chapter selected.");
          return;
        }

        const resp = await fetchTopicsWithPDF(chapterId);
        const payload = resp?.data || {};
        const list = Array.isArray(payload.topics) ? payload.topics : [];

        if (selectedChapter?.name) setChapterName(selectedChapter.name);

        setTopics(list);

        if (list.length === 0) {
          setError("No topics with PDFs found in this chapter.");
        }
      } catch (err) {
        console.error("Failed to fetch topics with PDFs:", err);
        setError("Unable to load topics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadTopicsWithPDFs();
  }, [chapterId, selectedChapter?.name]);

  // 🔎 search filter
  const filteredTopics = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return topics;
    return topics.filter((t) =>
      String(t.name || "").toLowerCase().includes(term)
    );
  }, [topics, searchTerm]);

  // ✅ handle navigation
  const handleGoToMaterials = (topic) => {
    if (isLockedForGuest(topic)) {
      setShowPopup(true);
      return;
    }

    // 🔗 go deeper: /user/dashboard/study/topics/:topicId
    navigate(`/user/study/topics/${topic.id}/materials`);

    if (onTopicSelect) onTopicSelect(topic);
  };

  const noMatches =
    !loading && !error && filteredTopics.length === 0 && searchTerm.trim().length > 0;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-1 text-[#017bcd]">
        Study Materials {chapterName && `- ${chapterName}`}
      </h1>

      {loading && <CommonLoader />}
      {error && <p className="text-center pt-10 text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          {noMatches ? (
            <p className="text-center pt-10">No topics match your search.</p>
          ) : (
            <div className="grid mt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-24">
              {[...filteredTopics]
                .sort((a, b) => {
                  const aLocked = isLockedForGuest(a);
                  const bLocked = isLockedForGuest(b);
                  if (aLocked !== bLocked) return aLocked - bLocked;
                  return a.name.localeCompare(b.name);
                })
                .map((topic) => {
                  const locked = isLockedForGuest(topic);

                  return (
                    <div
                      key={topic.id}
                      className="rounded-xl bg-transparent p-6 text-black border border-[#ccc] shadow-sm"
                    >
                      <p className="text-2xl font-semibold leading-tight text-black break-words">
                        {topic.name}
                        {locked && (
                          <span className="ml-2 align-middle text-[#b45309]">🔒</span>
                        )}
                      </p>

                      <div className="mt-6 flex justify-center">
                        <button
                          aria-disabled={locked}
                          onClick={() => handleGoToMaterials(topic)}
                          className={`inline-flex min-w-[220px] items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-sm transition
                            ${
                              locked
                                ? "bg-white/70 text-[#5C222A]/60 cursor-not-allowed"
                                : "bg-[#5C222A] text-white hover:bg-white hover:text-[#5C222A]"
                            }`}
                          title={
                            locked ? "Premium content (login/upgrade)" : "Start Studying"
                          }
                        >
                          Start Studying
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </>
      )}

      {showPopup && <PremiumPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
}
