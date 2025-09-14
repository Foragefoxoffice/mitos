import { Routes, Route } from "react-router-dom";
import { SelectedTopicsProvider } from "./contexts/SelectedTopicsContext";
import { SelectedQuestionTypesProvider } from "./contexts/SelectedQuestionTypesContext";
import { TestProvider } from "./contexts/TestContext";
import RouteGuard from "./components/RouteGuard";
import Layout from "./components/user/Layout";
import LandingPage from "./app/home/page";
import LoginPage from "./app/login/page";
import RegisterPage from "./app/register/page";
import Dashboard from "./app/user/dashboard/page";
import ResultPage from "./app/user/progress/page";
import NeetScorePredictorPage from "./app/user/neet-score-predictor/page";
import Leaderboard from "./app/user/leaderboard/page";
import FavoriteQuestionsPage from "./app/user/favorite/page";
import FAQPage from "./app/user/faq/page";
import NewsListPage from "./app/user/news/page";
import NewsDetailPage from "./app/user/news/single-news/page";
import UserSettings from "./app/user/settings/page";
import PracticePage from "./app/user/practice/page";
import TestPage from "./app/user/test/page";
import StudyMaterialsPage from "./app/user/study-materials/page";
import PrivacyPolicy from "./app/privacy-policy/page";
import TermsAndConditions from "./app/terms-and-conditions/page";
import About from "./app/about/page";

function App() {
  return (
    <TestProvider>
      <SelectedTopicsProvider>
        <SelectedQuestionTypesProvider>
          <RouteGuard>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
                 <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                <Route path="/about" element={<About />} />
              <Route path="/user" element={<Layout />}>
                <Route path="/user/dashboard" element={<Dashboard />} />
                <Route path="/user/progress" element={<ResultPage />} />
                <Route path="/user/neet-score-predictor" element={<NeetScorePredictorPage />} />
                <Route path="/user/leaderboard" element={<Leaderboard />} />
                <Route path="/user/favorites" element={<FavoriteQuestionsPage />} />
                <Route path="/user/faq" element={<FAQPage />} />
                <Route path="/user/news" element={<NewsListPage />} />
                <Route path="/user/news/:id" element={<NewsDetailPage />} />
                <Route path="/user/settings" element={<UserSettings />} />
                <Route path="/user/practice" element={<PracticePage />} />
                <Route path="/user/test" element={<TestPage />} />
                <Route path="/user/study-materials" element={<StudyMaterialsPage />} />
              </Route>
            </Routes>
          </RouteGuard>
        </SelectedQuestionTypesProvider>
      </SelectedTopicsProvider>
    </TestProvider>
  );
}

export default App;
