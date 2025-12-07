import { Routes, Route } from "react-router-dom";
import { SelectedTopicsProvider } from "./contexts/SelectedTopicsContext";
import { SelectedQuestionTypesProvider } from "./contexts/SelectedQuestionTypesContext";
import { TestProvider } from "./contexts/TestContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { GuestTimerProvider } from "./contexts/GuestTimerContext";
import RouteGuard from "./components/RouteGuard.jsx";
import Layout from "./components/user/Layout";
import Dashboard from "./app/user/dashboard/page";

// Import the hook
import useDevProtector from "./hooks/useDevProtector";

// Public pages
import LandingPage from "./app/home/page";
import LoginPage from "./app/otpAuthPage/page";
import OtpAuthPage from "./app/otpAuthPage/page";

import RegisterPage from "./app/register/page";
import PrivacyPolicy from "./app/privacy-policy/page";
import TermsAndConditions from "./app/terms-and-conditions/page";
import About from "./app/about/page";
import PlaystoreTerms from "./app/playstore-terms/page";
import ApplestoreTerms from "./app/applestore-terms/page";
import ApplestorePrivacy from "./app/applestore-privacy/page";
import PlaystorePrivacy from "./app/playstore-privacy/page";

// User dashboard pages
import ResultPage from "./app/user/progress/page";
import NeetScorePredictorPage from "./app/user/neet-score-predictor/page";
import Leaderboard from "./app/user/leaderboard/page";
import FavoriteQuestionsPage from "./app/user/favorite/page";
import FAQPage from "./app/user/faq/page";
import NewsListPage from "./app/user/news/page";
import NotificationsPage from "./app/user/notifications/page";

import NewsDetailPage from "./app/user/news/single-news/page";
import UserSettings from "./app/user/settings/page";
import SubscriptionPage from "./app/user/subscription/page";

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

// free materials pages
import FreeMaterialsSubject from "./app/freeMaterials/FreeMaterialsSubject";
import FreeMaterialsChapter from "./app/freeMaterials/FreeMaterialsChapter";
import FreeMaterialsList from "./app/freeMaterials/FreeMaterialsList";
import FreeMaterialsMedia from "./app/freeMaterials/FreeMaterialsMedia";

function App() {
  // ✅ Activate protection
  useDevProtector();

  return (
    <GuestTimerProvider>
      <TestProvider>
        <SubscriptionProvider>
          <SelectedTopicsProvider>
            <SelectedQuestionTypesProvider>
              <RouteGuard>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<OtpAuthPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/playstore-terms" element={<PlaystoreTerms />} />
                  <Route path="/applestore-terms" element={<ApplestoreTerms />} />
                  <Route path="/applestore-privacy" element={<ApplestorePrivacy />} />
                  <Route path="/playstore-privacy" element={<PlaystorePrivacy />} />

                  {/* Flow entry routes */}
                  <Route path="/user/practice" element={<PracticePage />} />
                  <Route path="/user/test" element={<TestPage />} />

                  {/* User routes */}
                  <Route path="/user" element={<Layout />}>
                    <Route path="study/topics/:topicId/materials" element={<StudyMaterialsPage />} />

                    {/* Dashboard flow */}
                    <Route path="dashboard" element={<Dashboard />}>
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

                    {/* Other user pages */}
                    <Route path="progress" element={<ResultPage />} />
                    <Route path="neet-score-predictor" element={<NeetScorePredictorPage />} />
                    <Route path="leaderboard" element={<Leaderboard />} />
                    <Route path="favorites" element={<FavoriteQuestionsPage />} />
                    <Route path="faq" element={<FAQPage />} />
                    <Route path="news" element={<NewsListPage />} />
                    <Route path="news/:id" element={<NewsDetailPage />} />
                    <Route path="notifications" element={<NotificationsPage />} />
                    <Route path="settings" element={<UserSettings />} />
                    <Route path="subscription" element={<SubscriptionPage />} />

                    {/* ---- Free Materials Flow ---- */}

                    <Route
                      path="free-materials"
                      element={<FreeMaterialsSubject />}
                    />

                    <Route
                      path="free-materials/subject/:subjectId"
                      element={<FreeMaterialsChapter />}
                    />

                    <Route
                      path="free-materials/chapter/:chapterId"
                      element={<FreeMaterialsList />}
                    />

                    <Route
                      path="free-materials/media/:chapterId"
                      element={<FreeMaterialsMedia />}
                    />


                  </Route>
                </Routes>
              </RouteGuard>
            </SelectedQuestionTypesProvider>
          </SelectedTopicsProvider>
        </SubscriptionProvider>
      </TestProvider>
    </GuestTimerProvider>
  );
}

export default App;
