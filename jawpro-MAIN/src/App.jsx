import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import About from "./components/about/About";
import Main from "./components/main/Main";
import Footer from "./components/footer/footer";
import HomePage from "./pages/HomePage";
import Discover from "./pages/discover/discover";
import MajorNursing from "./pages/discover/majorspages/MajorNursing.jsx";
import MajorComputerScience from "./pages/discover/majorspages/MajorComputerScience.jsx";
import MajorGraphicDesign from "./pages/discover/majorspages/MajorGraphicDesign.jsx";
import MajorIslamicHistory from "./pages/discover/majorspages/MajorIslamicHistory.jsx";
import MajorBusinessAdministration from "./pages/discover/majorspages/MajorBusinessAdministration.jsx";
import IntroductionToProgramming from "./pages/courses/IntroductiontoProgramming.jsx";
import PreviewPro from "./pages/courses/previewpro.jsx";
import PomodoroClock from "./pages/Calendar/PomodoroClock.jsx";
import MockTests from "./pages/Mock Test/MTEST/MockTests.jsx";
import QuduratTest from "./pages/Mock Test/QuduratTest.jsx";
import QuduratResults from "./pages/Mock Test/QuduratResults.jsx";
import SignIn from "./pages/sign-in/sign-in-component.jsx";
import Profile from "./pages/sign-in/Profile.jsx";
import Login from "./pages/sign-in/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import CourseDiscovery from "./pages/Mock Test/CourseDiscovery.jsx";
import ApologyPage from "./pages/sign-in/ApologyPage.jsx";
import PaymentPage from "./pages/courses/PaymentPage.jsx";
import IntroToProgrammingCourse from "./pages/courses/IntroToProgrammingCourse.jsx";
import CourseTest from "./components/CourseTest/CourseTest.jsx";
import TestIntroPage from './pages/TestIntroPage';
import RiasecTestPage from './pages/RiasecTestPage';
import ResultsPage from './pages/ResultsPage';
import RecommendationsPage from './pages/RecommendationsPage';
import LearningPathLevelsPage from './pages/LearningPathLevelsPage';
import MajorLevelPage from './pages/MajorLevelPage';


const App = () => {
  return (
    <div id="up" className="container">
      <Router>
        <Header />
        <div className="divider" />

        <Routes>
          {/* Public Routes */}
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/login-in" element={<Login />} />
          <Route path="/pomodoro" element={<PomodoroClock />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/apology-in" element={<ApologyPage />} />
          <Route path="/about" element={<About />} />{" "}
          <Route path="/discover" element={<Discover/>} />
          <Route path="/Nursing" element={<MajorNursing />} />
          <Route
            path="/Business-Administration"
            element={<MajorBusinessAdministration />}
          />
          <Route path="/Computer-Science" element={<MajorComputerScience />} />
          <Route path="/graphic-design" element={<MajorGraphicDesign />} />
          <Route path="/Islamic-History" element={<MajorIslamicHistory />} />
          <Route
            path="/Introduction-to-Programming"
            element={<IntroductionToProgramming />}
          />
          <Route
            path="/preview-Introduction-to-Programming"
            element={<PreviewPro />}
          />
          <Route path="/mock-tests" element={<MockTests />} />
          {/* Protected Routes */}
          <Route
            path="/main"
            element={
              <ProtectedRoute>
                <Main />
              </ProtectedRoute>
            }
          />
          <Route
            path="/qudurat-mock-test"
            element={
              <ProtectedRoute>
                <QuduratTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/qudurat-results"
            element={
              <ProtectedRoute>
                <QuduratResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/CourseDiscovery"
            element={
              <ProtectedRoute>
                <CourseDiscovery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/:courseId"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/course-test/:courseId"
            element={
              <ProtectedRoute>
                <CourseTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/intro-to-programming"
            element={
              <ProtectedRoute>
                <IntroToProgrammingCourse />
              </ProtectedRoute>
            }
          />{" "}
                <Route
        path="/AI-tests"
        element={
          <ProtectedRoute>
            <TestIntroPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/test"
        element={
          <ProtectedRoute>
            <RiasecTestPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/results"
        element={
          <ProtectedRoute>
            <ResultsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/recommendations" element={<RecommendationsPage />} />
<Route path="/major/:majorId" element={<LearningPathLevelsPage />} />
<Route path="/major/:majorId/level/:levelId" element={<MajorLevelPage />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>

        <div className="divider" />
        <Footer />
      </Router>
    </div>
  );
};

export default App;