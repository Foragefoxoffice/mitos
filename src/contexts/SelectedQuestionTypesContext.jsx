import { createContext, useContext, useState, useEffect } from "react";

const SelectedQuestionTypesContext = createContext();

export const SelectedQuestionTypesProvider = ({ children }) => {
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState([]);
  const [chapterId, setChapterId] = useState(null);
  const [subject, setSubject] = useState("");
  const [subjectId, setSubjectId] = useState(null);

  // ✅ Reset question type selections when chapter or subject changes
  useEffect(() => {
    setSelectedQuestionTypes([]);
  }, [chapterId, subjectId]);

  return (
    <SelectedQuestionTypesContext.Provider
      value={{
        selectedQuestionTypes,
        setSelectedQuestionTypes,
        chapterId,
        setChapterId,
        subject,
        setSubject,
        subjectId,
        setSubjectId,
      }}
    >
      {children}
    </SelectedQuestionTypesContext.Provider>
  );
};

export const useSelectedQuestionTypes = () =>
  useContext(SelectedQuestionTypesContext);
