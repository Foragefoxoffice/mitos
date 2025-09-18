import { Routes, Route, Outlet } from "react-router-dom";
import { SelectedTopicsProvider } from "./contexts/SelectedTopicsContext";
import { SelectedQuestionTypesProvider } from "./contexts/SelectedQuestionTypesContext";
import { TestProvider } from "./contexts/TestContext";
import RouteGuard from "./components/RouteGuard";
import Layout from "./components/user/Layout";
import Dashboard from "./app/user/dashboard/page";
// Public pages
import LandingPage from "./app/home/page";
import LoginPage from "./app/login/page";
import RegisterPage from "./app/register/page";
import PrivacyPolicy from "./app/privacy-policy/page";
import TermsAndConditions from "./app/terms-and-conditions/page";
import About from "./app/about/page";

// User dashboard pages
import ResultPage from "./app/user/progress/page";
import NeetScorePredictorPage from "./app/user/neet-score-predictor/page";
import Leaderboard from "./app/user/leaderboard/page";
import FavoriteQuestionsPage from "./app/user/favorite/page";
import FAQPage from "./app/user/faq/page";
import NewsListPage from "./app/user/news/page";
import NewsDetailPage from "./app/user/news/single-news/page";
import UserSettings from "./app/user/settings/page";

// Flow entry wrappers
import PracticePage from "./app/user/practice/page";
import TestPage from "./app/user/test/page";
import StudyMaterialsPage from "./app/user/study-materials/page";

// Step components (Practice)
import Subject from "@/components/practice/subject";
import Chapter from "@/components/practice/chapter";
import TopicsPage from "@/components/practice/topics";
import QuestiontypePage from "@/components/practice/questiontype";

// Step components (Test)
import Portion from "@/components/test/test-postion";
import TestSubject from "@/components/test/test-subject";
import TestChapter from "@/components/test/test-chapter";
import TestTopics from "@/components/test/test-topic";

// Step components (Study Materials)
import MeterialsSubject from "@/components/study-material/subject";
import MeterialsChapter from "@/components/study-material/chapter";
import MeterialsTopicsPage from "@/components/study-material/topics";

function App() {
  return (
    <TestProvider>
      <SelectedTopicsProvider>
        <SelectedQuestionTypesProvider>
          <RouteGuard>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/about" element={<About />} />

              {/* Flow entry routes */}
              <Route path="/user/practice" element={<PracticePage />} />
              <Route path="/user/test" element={<TestPage />} />
              {/* User routes (all inside /user/) */}
              <Route path="/user" element={<Layout />}>
                 <Route path="study/topics/:topicId/materials" element={<StudyMaterialsPage />} />

                {/* -------- DASHBOARD FLOW -------- */}
                <Route path="dashboard" element={<Dashboard />}>
                  {/* Default page when visiting /user/dashboard */}
                  <Route index element={<Subject />} />

                  {/* Practice flow */}
                  <Route path="practice/subjects" element={<Subject />} />
                  <Route path="practice/:subjectId/chapters" element={<Chapter />} />
                  <Route path="practice/:chapterId/topics" element={<TopicsPage />} />
                  <Route path="practice/:chapterId/questiontypes" element={<QuestiontypePage />} />

                  {/* Test flow */}
                  <Route path="test/portions" element={<Portion />} />
                  <Route path="test/:portionId/subjects" element={<TestSubject />} />
                  <Route path="test/:subjectId/:portionId/chapters" element={<TestChapter />} />
                  <Route path="test/:chapterId/topics" element={<TestTopics />} />
                  <Route path="test/:topicId/questiontypes" element={<QuestiontypePage />} />

                  {/* Study material flow */}
                  <Route path="study/subjects" element={<MeterialsSubject />} />
                  <Route path="study/subjects/:subjectId/chapters" element={<MeterialsChapter />} />
                  <Route path="study/chapters/:chapterId/topics" element={<MeterialsTopicsPage />} />
                 
                </Route>

                {/* -------- OTHER USER PAGES -------- */}
                <Route path="progress" element={<ResultPage />} />
                <Route path="neet-score-predictor" element={<NeetScorePredictorPage />} />
                <Route path="leaderboard" element={<Leaderboard />} />
                <Route path="favorites" element={<FavoriteQuestionsPage />} />
                <Route path="faq" element={<FAQPage />} />
                <Route path="news" element={<NewsListPage />} />
                <Route path="news/:id" element={<NewsDetailPage />} />
                <Route path="settings" element={<UserSettings />} />
              </Route>
            </Routes>
          </RouteGuard>
        </SelectedQuestionTypesProvider>
      </SelectedTopicsProvider>
    </TestProvider>
  );
}

export default App;
