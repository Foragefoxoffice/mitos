"use client";

import React, { createContext, useState } from "react";

export const TestContext = createContext();

export const TestProvider = ({ children }) => {
  const [testData, setTestData] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [savedTestData, setSavedTestData] = useState(null); // for replay/view-answers mode

  return (
    <TestContext.Provider value={{ testData, setTestData, selectedTopics, setSelectedTopics, savedTestData, setSavedTestData }}>
      {children}
    </TestContext.Provider>
  );
};
