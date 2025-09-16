import { useState, useEffect } from "react";
import Subject from "@/components/practice/subject";
import Chapter from "@/components/practice/chapter";
import TopicsPage from "@/components/practice/topics";
import MeterialsSubject from "@/components/study-material/subject";
import MeterialsChapter from "@/components/study-material/chapter";
import MeterialsTopicsPage from "@/components/study-material/topics";
import QuestiontypePage from "@/components/practice/questiontype";
import Portion from "@/components/test/test-postion";
import TestSubject from "@/components/test/test-subject";
import TestChapter from "@/components/test/test-chapter";
import TestTopics from "@/components/test/test-topic";
import CommonLoader from "../../../components/commonLoader";
import { TbBulb } from "react-icons/tb";
import { LuNotebookPen } from "react-icons/lu";
import { RiBook2Line } from "react-icons/ri";
import { HiArrowSmallLeft } from "react-icons/hi2";
import { FiSearch, FiX } from "react-icons/fi";
import PremiumPopup from "@/components/PremiumPopup";

/* ----------------------- reusable search ----------------------- */
const SearchBar = ({ value, onChange, placeholder = "Search..." }) => (
  <div className="relative w-full max-w-xs md:max-w-md">
    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#007acc]" />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-10 pr-10 py-2 rounded-lg border border-[#cfe9fb] focus:outline-none focus:ring-2 focus:ring-[#007acc] text-[#00497a]"
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange("")}
        className="absolute right-3 top-1/2 -translate-y-1/2"
        aria-label="Clear search"
      >
        <FiX className="text-[#4b6b86] bg-[#fff]" />
      </button>
    )}
  </div>
);

/* ---------------------------- tab state helper --------------------------- */
const useTabState = (tabKey, initialScreen) => {
  const sessionKey = `tabState-${tabKey}`;

  const getInitialState = () => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(sessionKey);
      if (saved) return JSON.parse(saved);
    }
    return {
      currentScreen: initialScreen,
      selectedPortion: null,
      selectedSubject: null,
      selectedChapter: null,
      selectedTopic: null,
      selectedQuestiontype: null,
      history: [initialScreen],
    };
  };

  const [state, setState] = useState(getInitialState);

  useEffect(() => {
    sessionStorage.setItem(sessionKey, JSON.stringify(state));
  }, [state]);

  const update = (updates) => setState((prev) => ({ ...prev, ...updates }));

  const navigateTo = (screen) => {
    update({
      history: [...state.history, screen],
      currentScreen: screen,
    });
  };

  const goBack = () => {
    if (state.history.length > 1) {
      const newHistory = state.history.slice(0, -1);
      const previousScreen = newHistory[newHistory.length - 1];
      update({ history: newHistory, currentScreen: previousScreen });
    }
  };

  return {
    ...state,
    goBack,
    navigateTo,
    handlePortionSelect: (portion) => (
      update({ selectedPortion: portion }), navigateTo("test-subject")
    ),
    handleTestSubjectSelect: (subject, portion) => (
      update({ selectedSubject: subject, selectedPortion: portion }),
      navigateTo("test-chapter")
    ),
    handleTestChapterSelect: (subject, portion, chapter) => (
      update({
        selectedSubject: subject,
        selectedPortion: portion,
        selectedChapter: chapter,
      }),
      navigateTo("test-topic")
    ),
    handleSubjectSelect: (subject) => (
      update({ selectedSubject: subject }), navigateTo("chapter")
    ),
    handleChapterSelect: (chapter) => (
      update({ selectedChapter: chapter }), navigateTo("topic")
    ),
    handleTopicSelect: (topic) => (
      update({ selectedTopic: topic }), navigateTo("questiontype")
    ),
    handleQuestiontypeSelect: (questiontype) =>
      update({ selectedQuestiontype: questiontype }),
    handleScreenSelection: (screen) => navigateTo(screen),
  };
};

/* --------------------------------- page --------------------------------- */
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("tab1");
  const [isLoading, setIsLoading] = useState(false);

  const practiceState = useTabState("practice", "subject");
  const testState = useTabState("test", "full-portion");
  const studyMaterialState = useTabState("study-material", "subject");

  // per-tab search terms
  const [practiceSearch, setPracticeSearch] = useState("");
  const [testSearch, setTestSearch] = useState("");
  const [studySearch, setStudySearch] = useState("");

  // Reset search when screen changes
  useEffect(() => setPracticeSearch(""), [practiceState.currentScreen]);
  useEffect(() => setTestSearch(""), [testState.currentScreen]);
  useEffect(() => setStudySearch(""), [studyMaterialState.currentScreen]);

  const tabDetails = {
    tab1: { label: "Practice", icon: <TbBulb className="inline mr-1" /> },
    tab2: { label: "Test", icon: <LuNotebookPen className="inline mr-1" /> },
    tab3: { label: "Study Material", icon: <RiBook2Line className="inline mr-1" /> },
  };

  const handleTabClick = (tab) => {
    setIsLoading(true);
    setTimeout(() => {
      setActiveTab(tab);
      sessionStorage.setItem("activeTab", tab);
      setIsLoading(false);
      if (tab === "tab1") practiceState.navigateTo("subject");
      else if (tab === "tab2") testState.navigateTo("full-portion");
      else if (tab === "tab3") studyMaterialState.navigateTo("subject");
    }, 50);
  };

  // helpers to know when to show Back + Search
  const showPracticeHeader = ["chapter", "topic", "questiontype"].includes(
    practiceState.currentScreen
  );
  const showTestHeader = [
    "test-subject",
    "test-chapter",
    "test-topic",
    "questiontype",
  ].includes(testState.currentScreen);
  const showStudyHeader = ["chapter", "topic"].includes(
    studyMaterialState.currentScreen
  );

  const getSearchPlaceholder = (tab, screen) => {
    if (tab === "tab1") {
      if (screen === "chapter") return "Search chapters...";
      if (screen === "topic") return "Search topics...";
      if (screen === "questiontype") return "Search types...";
    }
    if (tab === "tab2") {
      if (screen === "test-subject") return "Search subjects...";
      if (screen === "test-chapter") return "Search chapters...";
      if (screen === "test-topic") return "Search topics...";
      if (screen === "questiontype") return "Search types...";
    }
    if (tab === "tab3") {
      if (screen === "chapter") return "Search chapters...";
      if (screen === "topic") return "Search topics...";
    }
    return "Search...";
  };

  return (
    <div className="pt-6">
      {/* Unified sticky header */}
      <div className="sticky top-0 z-50 bg-white rounded-4xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-5 py-6">
          {/* Tabs */}
          <div className="flex space-x-2 md:space-x-4">
            {["tab1", "tab2", "tab3"].map((tab) => (
              <button
                key={tab}
                className={`tab px-3 sm:px-6 py-2 md:py-2.5 rounded-3xl transition-all duration-200 ${activeTab === tab
                  ? "bg-[#007ACC] text-white font-semibold shadow-md"
                  : "bg-[#dff4ff] text-[#00497A]"
                  }`}
                onClick={() => handleTabClick(tab)}
              >
                <span className="flex items-center text-sm md:text-base">
                  {tabDetails[tab]?.icon}
                  {tabDetails[tab]?.label}
                </span>
              </button>
            ))}
          </div>

          {/* Back + Search */}
          <div className="flex items-center gap-3 md:gap-4">
            {(activeTab === "tab1" && showPracticeHeader) && (
              <button
                onClick={practiceState.goBack}
                className="flex items-center px-3 py-1.5 rounded-xl 
             bg-[#007ACC] border border-[#007ACC] 
             text-[#fff] font-medium shadow-sm 
             transition-all duration-200 cursor-pointer"
              >
                <HiArrowSmallLeft className="text-lg" />
                <span className="ml-1 hidden sm:inline">Back</span>
              </button>

            )}
            {(activeTab === "tab2" && showTestHeader) && (
              <button
                onClick={testState.goBack}
                className="flex items-center px-3 py-1.5 rounded-xl 
             bg-[#007ACC] border border-[#007ACC] 
             text-[#fff] font-medium shadow-sm 
             transition-all duration-200 cursor-pointer"
              >
                <HiArrowSmallLeft className="text-lg" />
                <span className="ml-1 hidden sm:inline">Back</span>
              </button>
            )}
            {(activeTab === "tab3" && showStudyHeader) && (
              <button
                onClick={studyMaterialState.goBack}
                className="flex items-center px-3 py-1.5 rounded-xl 
             bg-[#007ACC] border border-[#007ACC] 
             text-[#fff] font-medium shadow-sm 
             transition-all duration-200 cursor-pointer"
              >
                <HiArrowSmallLeft className="text-lg" />
                <span className="ml-1 hidden sm:inline">Back</span>
              </button>
            )}

            {(showPracticeHeader || showTestHeader || showStudyHeader) && (
              <SearchBar
                value={
                  activeTab === "tab1"
                    ? practiceSearch
                    : activeTab === "tab2"
                      ? testSearch
                      : studySearch
                }
                onChange={
                  activeTab === "tab1"
                    ? setPracticeSearch
                    : activeTab === "tab2"
                      ? setTestSearch
                      : setStudySearch
                }
                placeholder={getSearchPlaceholder(
                  activeTab,
                  activeTab === "tab1"
                    ? practiceState.currentScreen
                    : activeTab === "tab2"
                      ? testState.currentScreen
                      : studyMaterialState.currentScreen
                )}
              />
            )}
          </div>
        </div>
      </div>

      {/* Content */}

      {isLoading ? (
        <CommonLoader />
      ) : (
        <div className="mt-4">
          {/* PRACTICE */}
          {activeTab === "tab1" && (
            <>
              {practiceState.currentScreen === "subject" && (
                <Subject
                  onSubjectSelect={practiceState.handleSubjectSelect}
                  onScreenSelection={practiceState.handleScreenSelection}
                />
              )}
              {practiceState.currentScreen === "chapter" && (
                <Chapter
                  selectedSubject={practiceState.selectedSubject}
                  selectedPortion={practiceState.selectedPortion}
                  onChapterSelect={practiceState.handleChapterSelect}
                  onScreenSelection={practiceState.handleScreenSelection}
                  searchTerm={practiceSearch}
                />
              )}
              {practiceState.currentScreen === "topic" && (
                <TopicsPage
                  selectedChapter={practiceState.selectedChapter}
                  onTopicSelect={practiceState.handleTopicSelect}
                  searchTerm={practiceSearch}
                />
              )}
              {practiceState.currentScreen === "questiontype" && (
                <QuestiontypePage
                  selectedTopic={practiceState.selectedTopic}
                  selectedChapter={practiceState.selectedChapter}
                  onQuestiontypeSelect={practiceState.handleQuestiontypeSelect}
                  searchTerm={practiceSearch}
                />
              )}
            </>
          )}

          {/* TEST */}
          {activeTab === "tab2" && (
            <>
              {testState.currentScreen === "full-portion" && (
                <Portion
                  onPortionSelect={testState.handlePortionSelect}
                  onScreenSelection={testState.handleScreenSelection}
                />
              )}
              {testState.currentScreen === "test-subject" && (
                <TestSubject
                  selectedPortion={testState.selectedPortion}
                  onSubjectSelect={testState.handleTestSubjectSelect}
                  onScreenSelection={testState.handleScreenSelection}
                  searchTerm={testSearch}
                />
              )}
              {testState.currentScreen === "test-chapter" && (
                <TestChapter
                  selectedSubject={testState.selectedSubject}
                  selectedPortion={testState.selectedPortion}
                  onChapterSelect={testState.handleChapterSelect}
                  onScreenSelection={testState.handleScreenSelection}
                  searchTerm={testSearch}
                />
              )}
              {testState.currentScreen === "test-topic" && (
                <TestTopics
                  selectedSubject={testState.selectedSubject}
                  selectedPortion={testState.selectedPortion}
                  selectedChapter={testState.selectedChapter}
                  onTopicSelect={testState.handleTestChapterSelect}
                  onScreenSelection={testState.handleScreenSelection}
                  searchTerm={testSearch}
                />
              )}
              {testState.currentScreen === "questiontype" && (
                <QuestiontypePage
                  selectedTopic={testState.selectedTopic}
                  selectedChapter={testState.selectedChapter}
                  onQuestiontypeSelect={testState.handleQuestiontypeSelect}
                  searchTerm={testSearch}
                />
              )}
            </>
          )}

          {/* STUDY MATERIAL */}
          {activeTab === "tab3" && (
            <>
              {studyMaterialState.currentScreen === "subject" && (
                <MeterialsSubject
                  onSubjectSelect={studyMaterialState.handleSubjectSelect}
                  onScreenSelection={studyMaterialState.handleScreenSelection}
                />
              )}
              {studyMaterialState.currentScreen === "chapter" && (
                <MeterialsChapter
                  selectedSubject={studyMaterialState.selectedSubject}
                  onChapterSelect={studyMaterialState.handleChapterSelect}
                  onScreenSelection={studyMaterialState.handleScreenSelection}
                  searchTerm={studySearch}
                />
              )}
              {studyMaterialState.currentScreen === "topic" && (
                <MeterialsTopicsPage
                  selectedChapter={studyMaterialState.selectedChapter}
                  onTopicSelect={studyMaterialState.handleTopicSelect}
                  searchTerm={studySearch}
                />
              )}
            </>
          )}
        </div>
      )}

      {/* Premium popup */}
      {false && <PremiumPopup onClose={() => { }} />}
    </div>
  );
}
