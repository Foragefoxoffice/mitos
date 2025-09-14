"use client";
import React, { useEffect } from "react";

export const TestSidebar = ({
  filteredQuestions,
  userAnswers,
  visitedQuestions,
  markedQuestions,
  handleQuestionNavigation,
  questionNavRefs,
  onShowAnswers,
}) => {
  // Navigate to first question when show answers mode is activated
  useEffect(() => {
    if (onShowAnswers && filteredQuestions.length > 0) {
      handleQuestionNavigation(0);
    }
  }, [onShowAnswers, filteredQuestions.length, handleQuestionNavigation]);

  return (
    <>
      <ul className="answer_label">
        {onShowAnswers ? (
          <>
            <li className="text-[#4CAF50] after:bg-[#4CAF50]">Correct</li>
            <li className="text-[#F44336] after:bg-[#F44336]">Wrong</li>
            <li className="unanswered-label text-[#e49331] after:bg-[#e49331]">Un-answered</li>
          </>
        ) : (
          <>
            <li className="text-[#35095E] after:bg-[#35095E]">Answered</li>
            <li className="text-[#000] after:bg-[#e49331]">Un-answered</li>
            <li className="notvisited-label after:bg-[#CAE2FF]">Not visited</li>
            <li className="text-[#8e0068] after:bg-[#80008e]">
              Mark for Review
            </li>
          </>
        )}
      </ul>
      <div className="rounded_navs">
        {filteredQuestions.map((question, index) => {
          const isAnswered = userAnswers[question.id] !== undefined;
          const isVisited = visitedQuestions[question.id] !== undefined;
          const isMarked = markedQuestions[question.id] !== undefined;
          const isCorrect = userAnswers[question.id] === question.correctOption;

          let buttonColor = "bg-[#CAE2FF]";
          let buttonText = "text-[#35095E]";

          if (onShowAnswers) {
            if (isAnswered) {
              buttonColor = isCorrect ? "bg-[#4CAF50]" : "bg-[#F44336]";
              buttonText = "text-white";
            } else {
              buttonColor = "bg-[#CAE2FF]   text-[#35095E]";
              buttonText = "text-[#35095E]";
            }
          } else {
            // Original coloring logic when not showing answers
            if (isAnswered) {
              buttonColor = "bg-[#35095E]";
              buttonText = "text-[#fff]";
            } else if (isVisited) {
              buttonColor = "bg-[#e49331] text-[#fff]";
            }
            if (isMarked) {
              buttonColor = "bg-[#8e0068] text-[#fff] ";
            }
          }

          return (
            <button
              key={question.id}
              ref={(el) => (questionNavRefs.current[index] = el)}
              onClick={() => handleQuestionNavigation(index)}
              className={`p-2 rounded-lg text-center ${buttonColor} ${buttonText} min-w-[40px]`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </>
  );
};
