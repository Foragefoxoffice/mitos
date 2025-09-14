"use client";
import React, { useCallback, useState } from "react";
import DOMPurify from "dompurify";
import { FaHeart, FaRegHeart, FaFlag } from "react-icons/fa";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import ImagePopup from "@/components/ImagePopup";
import { motion } from "framer-motion";

// Helper component to render HTML with MathJax support
const HtmlWithMath = ({ html }) => {
  // Sanitize the HTML first
  const cleanHtml = DOMPurify.sanitize(html);

  return (
    <MathJax inline dynamic>
      <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
    </MathJax>
  );
};

export const TestQuestion = ({
  question,
  userAnswers,
  handleAnswer,
  currentQuestionIndex,
  filteredQuestions,
  toggleFavorite,
  isFavorite,
  onShowAnswers,
  onReportQuestion,
}) => {
  const [imagePopup, setImagePopup] = useState({
    show: false,
    src: "",
  });

  const renderOptionButtons = useCallback(
    (question) => {
      return question.options.map((option, index) => {
        const optionLabels = ["A", "B", "C", "D"];
        const currentOptionLabel = optionLabels[index];

        const userSelected = userAnswers[question.id];
        const isSelected = userSelected === currentOptionLabel;
        const isCorrect = question.correctOption === currentOptionLabel;

        let buttonClass =
          "flex items-center gap-2 w-full text-left px-4 py-3 rounded-lg transition-all duration-150 ";

        if (onShowAnswers) {
          if (isCorrect) {
            buttonClass += "bg-green-600 text-white border-green-600 selected"; // correct answer
          } else if (isSelected && !isCorrect) {
            buttonClass += "bg-red-500 text-white border-red-500 selected"; // wrong answer selected by user
          } else {
            buttonClass += "bg-[#F0F8FF] text-[#282C35] opacity-60";
          }
        } else {
          if (isSelected) {
            buttonClass += "bg-[#017bcd] text-white border-[#017bcd] selected";
          } else {
            buttonClass += "bg-[#F0F8FF] text-[#282C35]";
          }
        }

        return (
          <motion.div
            key={index}
            whileHover={{ scale: !onShowAnswers ? 1.02 : 1 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <button
              onClick={() =>
                !onShowAnswers && handleAnswer(question.id, currentOptionLabel)
              }
              className={buttonClass}
              disabled={onShowAnswers}
            >
              <span className="font-bold flex items-center justify-center option_label min-w-[1.5rem]">
                {currentOptionLabel}
              </span>
              <div className="flex-1 question_option">
                <HtmlWithMath html={option} />
              </div>
            </button>
          </motion.div>
        );
      });
    },
    [handleAnswer, userAnswers, onShowAnswers]
  );

  return (
    <MathJaxContext
      config={{
        loader: { load: ["input/tex", "output/chtml"] },
        tex: {
          packages: { "[+]": ["color", "mhchem"] },
          inlineMath: [
            ["$", "$"],
            ["\\(", "\\)"],
          ],
          displayMath: [
            ["$$", "$$"],
            ["\\[", "\\]"],
          ],
        },
      }}
    >
      <div className="flex gap-4 items-center py-4">
        <h2 className="text-lg font-semibold mb-2">
          Question {currentQuestionIndex + 1} / {filteredQuestions.length}
        </h2>
        <button
          onClick={() => toggleFavorite(question.id)}
          className="p-2 rounded-full bg-transparent transition duration-200"
        >
          {isFavorite ? (
            <FaHeart className="text-red-500 w-6 h-6" />
          ) : (
            <FaRegHeart className="text-black w-6 h-6" />
          )}
        </button>
        <button
          onClick={onReportQuestion}
          className="p-2 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 flex items-center gap-1"
          title="Report this question"
        >
          <FaFlag className="w-4 h-4" />
          <span>Report</span>
        </button>
      </div>

      <div className="mb-4 question_option">
        <HtmlWithMath html={question.question} />
      </div>
      {question.image && (
        <img
          alt=""
          src={`https://mitoslearning.in/${question.image}`}
          className="max-w-full h-auto my-4 rounded"
          onClick={() =>
            setImagePopup({
              show: true,
              src: `https://mitoslearning.in/${question.image}`,
            })
          }
        />
      )}
      <div className="option_btns flex flex-col gap-6">
        {renderOptionButtons(question)}
      </div>
      {onShowAnswers === true && (
        <div
          className={`mb-4 question_option p-4 rounded-lg border ${
            userAnswers[question.id] === question.correctOption
              ? "bg-green-100 border-green-300"
              : "bg-red-100 border-red-300"
          }`}
        >
          <div className="mb-4 question_option flex gap-2">
            <span
              style={{ color: "green", fontWeight: 800 }}
              className="font-bold"
            >
              Correct Option:{" "}
            </span>
            <b>
              <HtmlWithMath html={question.correctOption} />
            </b>
          </div>

          <div className="mb-4 question_option">
            <span
              style={{ color: "green", fontWeight: 800 }}
              className="font-semibold"
            >
              Solution:{" "}
            </span>
            <HtmlWithMath html={question.hint} />
            {question.hintImage && (
              <img
                src={`https://mitoslearning.in/${question.hintImage}`}
                alt="Hint illustration"
                className="max-w-full h-auto my-2"
                onClick={() =>
                  setImagePopup({
                    show: true,
                    src: `https://mitoslearning.in/${question.hintImage}`,
                  })
                }
              />
            )}
          </div>
        </div>
      )}
      {imagePopup.show && (
        <ImagePopup
          src={imagePopup.src}
          onClose={() => setImagePopup({ show: false, src: "" })}
        />
      )}
    </MathJaxContext>
  );
};
