import React, { useMemo } from "react";
import Select from "react-select"; // ✅ Direct import, no dynamic/ssr nonsense

const customStyles = {
  control: (provided) => ({
    ...provided,
    borderRadius: "8px",
    width: "200px",
    border: "1px solid #ccc",
    boxShadow: "none",
    fontWeight: "bold",
    padding: "5px",
    transition: "0.3s",
    "&:hover": {
      borderColor: "#51216E",
    },
  }),
  placeholder: (provided) => ({ ...provided, color: "#888", fontSize: "14px" }),
  singleValue: (provided) => ({
    ...provided,
    color: "#35095E",
    fontWeight: "bold",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "8px",
    overflow: "hidden",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? "#51216E"
      : state.isSelected
      ? "#017bcd"
      : "#fff",
    color: state.isFocused || state.isSelected ? "#fff" : "#333",
    padding: "10px",
    cursor: "pointer",
    "&:active": { backgroundColor: "#51216E", color: "#fff" },
  }),
};

export const TestTimer = ({
  totalTime,
  timeLeft,
  formatTime,
  getUniqueSubjects,
  subjectFilter,
  setSubjectFilter,
  showSubmitConfirmationPopup,
  onShowAnswers,
  showAnswer,
}) => {
  const subjectOrder = ["Physics", "Chemistry", "Biology"];

  const subjectOptions = useMemo(() => {
    const sortedSubjects = [...getUniqueSubjects].sort(
      (a, b) => subjectOrder.indexOf(a.name) - subjectOrder.indexOf(b.name)
    );

    return [
      { value: null, label: "All Subjects" },
      ...sortedSubjects.map((subject) => ({
        value: subject.id,
        label: subject.name,
      })),
    ];
  }, [getUniqueSubjects]);

  const handleSelectChange = (selectedOption) => {
    setSubjectFilter(selectedOption.value);
  };

  const selectedOption = useMemo(
    () =>
      subjectOptions.find((option) => option.value === subjectFilter) ||
      subjectOptions[0],
    [subjectOptions, subjectFilter]
  );

  const totalTimeTaken = totalTime - timeLeft;

  return (
    <div className="md:flex justify-between items-center">
      <p className="mt-2 mb-5 md:mb-0 flex items-center gap-2">
        <img width={30} src="/images/menuicon/time.png" alt="Time Icon" />
        <span className="text-[#FF0000] text-xl">
          {formatTime(showAnswer ? totalTimeTaken : timeLeft)} MIN
        </span>
      </p>

      <div className="flex items-center gap-4">
        {getUniqueSubjects.length > 0 && (
          <Select
            options={subjectOptions}
            value={selectedOption}
            onChange={handleSelectChange}
            styles={customStyles}
            isSearchable={false}
            className="p-2"
          />
        )}

        {showAnswer === false && (
          <button
            onClick={showSubmitConfirmationPopup}
            className="btn hover:text-[#fff] hover:border-none text-md"
            style={{ padding: "6px 40px", backgroundColor: "#007ACC" }}
          >
            Submit
          </button>
        )}

        {showAnswer === true && (
          <button
            onClick={() => onShowAnswers?.(false)}
            className="btn whitespace-nowrap"
            style={{ padding: "0.5rem 3rem" }}
          >
            View Results
          </button>
        )}
      </div>
    </div>
  );
};
