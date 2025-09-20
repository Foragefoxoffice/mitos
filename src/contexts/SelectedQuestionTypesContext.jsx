// contexts/SelectedQuestionTypesContext.js
"use client";

import { createContext, useContext, useState } from "react";

const SelectedQuestionTypesContext = createContext();

export const SelectedQuestionTypesProvider = ({ children }) => {
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState([]); // multiple
  const [selectedQuestionTypeId, setSelectedQuestionTypeId] = useState(null); // ✅ single
  const [chapterId, setChapterId] = useState(null);
  const [subject, setSubject] = useState(null);
  const [subjectId, setSubjectId] = useState(null);

  return (
    <SelectedQuestionTypesContext.Provider
      value={{
        selectedQuestionTypes,
        setSelectedQuestionTypes,
        selectedQuestionTypeId,        // ✅ expose single ID
        setSelectedQuestionTypeId,     // ✅ expose setter
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
