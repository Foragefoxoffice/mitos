import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import {
  FaHeart,
  FaLightbulb,
  FaCheck,
  FaTimes,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import DOMPurify from "dompurify";
import CommonLoader from "../../../components/commonLoader";

const HtmlWithMath = ({ html }) => {
  const cleanHtml = DOMPurify.sanitize(html);
  return (
    <MathJax inline dynamic>
      <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
    </MathJax>
  );
};

const FavoriteQuestionCard = ({
  question,
  onRemove,
  index,
  expandedId,
  setExpandedId,
}) => {
  const isExpanded = expandedId === question.questionId;
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    await onRemove(question.questionId);
    setIsRemoving(false);
  };

  const toggleExpand = () => {
    setExpandedId(isExpanded ? null : question.questionId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isRemoving ? 0 : 1,
        y: isRemoving ? -20 : 0,
        scale: isRemoving ? 0.9 : 1,
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 ${
        isExpanded ? "ring-2 ring-[#35095E]" : ""
      }`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <span className="bg-blue-100 text-[#35095E] px-3 py-1 rounded-full text-sm font-medium">
              #{index + 1}
            </span>
            <span className="text-gray-500 text-sm">
              ID: {question.questionId}
            </span>
          </div>
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className={`p-2 rounded-full transition-all duration-200 bg-transparent ${
              isRemoving ? "opacity-50" : "hover:bg-red-50"
            }`}
            aria-label="Remove from favorites"
          >
            <FaHeart className="w-5 h-5 text-red-500 fill-current" />
          </button>
        </div>

        <div className="mt-4 cursor-pointer" onClick={toggleExpand}>
          <HtmlWithMath html={question.question.question} />
        </div>

        {question.question.image && (
          <div className="mt-4 rounded-lg overflow-hidden">
            <img
              src={`https://mitoslearning.in/${question.question.image}`}
              alt="Question illustration"
                referrerPolicy="no-referrer"
              className="w-full h-auto max-h-60 object-contain mx-auto"
            />
          </div>
        )}

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {["A", "B", "C", "D"].map((option) => (
                  <motion.div
                    key={option}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg border transition-colors ${
                      question.question.correctOption === option
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-start">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-3 flex-shrink-0 ${
                          question.question.correctOption === option
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {question.question.correctOption === option ? (
                          <FaCheck className="w-3 h-3" />
                        ) : (
                          <FaTimes className="w-3 h-3" />
                        )}
                      </span>
                      <div>
                        <div className="font-semibold text-gray-700 mb-1">
                          Option {option}:
                        </div>
                        <HtmlWithMath
                          html={question.question[`option${option}`]}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {(question.question.hint || question.question.hintImage) && (
                <motion.div
                  className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center text-yellow-800 mb-2">
                    <FaLightbulb className="mr-2" />
                    <h4 className="font-semibold">Solution</h4>
                  </div>
                  {question.question.hint && (
                    <div className="prose prose-yellow max-w-none">
                      <HtmlWithMath html={question.question.hint} />
                    </div>
                  )}
                  {question.question.hintImage && (
                    <div className="mt-3 rounded-lg overflow-hidden">
                      <img
                        src={`https://mitoslearning.in/${question.question.hintImage}`}
                        alt="Hint illustration"
                          referrerPolicy="no-referrer"
                        className="w-full h-auto max-h-60 object-contain mx-auto"
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
          <button
            onClick={toggleExpand}
            className="text-black bg-transparent hover:text-[#35095E] text-sm font-medium flex items-center"
          >
            {isExpanded ? "Show less" : "Show options"}
          </button>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              question.question.correctOption
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            Correct: {question.question.correctOption}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const maxVisiblePages = 5;
  let startPage, endPage;

  if (totalPages <= maxVisiblePages) {
    startPage = 1;
    endPage = totalPages;
  } else {
    const maxVisibleBeforeCurrent = Math.floor(maxVisiblePages / 2);
    const maxVisibleAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;

    if (currentPage <= maxVisibleBeforeCurrent) {
      startPage = 1;
      endPage = maxVisiblePages;
    } else if (currentPage + maxVisibleAfterCurrent >= totalPages) {
      startPage = totalPages - maxVisiblePages + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - maxVisibleBeforeCurrent;
      endPage = currentPage + maxVisibleAfterCurrent;
    }
  }

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="flex items-center justify-center mt-8">
      <nav
        className="inline-flex rounded-md shadow-sm -space-x-px"
        aria-label="Pagination"
      >
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
        >
          <FaAngleDoubleLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
        >
          <FaAngleLeft className="h-4 w-4" />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 border border-gray-300 text-sm font-medium ${
              currentPage === page
                ? "bg-[#35095E] text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
        >
          <FaAngleRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
        >
          <FaAngleDoubleRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
};

export default function FavoriteQuestionsPage() {
  const [favoriteQuestions, setFavoriteQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(5);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchFavoriteQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!token || !userId) {
          throw new Error("Please login to view favorites");
        }

        const response = await fetch(
          `https://mitoslearning.in/api/fav-questions/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch favorite questions");

        const data = await response.json();
        setFavoriteQuestions(data || []);
      } catch (err) {
        setError(err.message || "Failed to load favorite questions");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteQuestions();
  }, [token, userId]);

  const removeFromFavorites = async (questionId) => {
    try {
      const response = await fetch(
        `https://mitoslearning.in/api/fav-questions`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId, questionId }),
        }
      );

      if (!response.ok) throw new Error("Failed to remove from favorites");

      setFavoriteQuestions((prev) =>
        prev.filter((q) => q.questionId !== questionId)
      );
      if (expandedId === questionId) setExpandedId(null);
    } catch (err) {
      setError(err.message || "Failed to remove from favorites");
    }
  };

  // Pagination logic
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = favoriteQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );
  const totalPages = Math.ceil(favoriteQuestions.length / questionsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    setExpandedId(null);
  };

  return (
    <MathJaxContext
      config={{
        loader: { load: ["input/tex", "output/chtml"] },
        tex: {
          packages: { "[+]": ["color", "mhchem"] },
          inlineMath: [["$", "$"], ["\\(", "\\)"]],
          displayMath: [["$$", "$$"], ["\\[", "\\]"]],
        },
      }}
    >
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Your Favorite Questions
            <span className="ml-2 bg-blue-100 text-[#35095E] px-3 py-1 rounded-full text-sm font-medium">
              {favoriteQuestions.length} saved
            </span>
          </h1>

          {loading && (
            <div className="flex justify-center items-center py-12">
              <CommonLoader />
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded"
            >
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}

          {!loading && !error && favoriteQuestions.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200"
            >
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No favorites yet
              </h3>
              <p className="mt-1 text-gray-500">
                Start marking questions as favorites to see them here.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate("/practice")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Go to Practice
                </button>
              </div>
            </motion.div>
          )}

          <div className="space-y-6">
            <AnimatePresence>
              {currentQuestions.map((favQuestion, index) => (
                <FavoriteQuestionCard
                  key={favQuestion.questionId}
                  question={favQuestion}
                  onRemove={removeFromFavorites}
                  index={indexOfFirstQuestion + index}
                  expandedId={expandedId}
                  setExpandedId={setExpandedId}
                />
              ))}
            </AnimatePresence>
          </div>

          {favoriteQuestions.length > questionsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={paginate}
            />
          )}
        </div>
      </div>
    </MathJaxContext>
  );
}
