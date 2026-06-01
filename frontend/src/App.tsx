import { Navigate, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import AppLayout from './components/AppLayout';
import DashboardPage from './pages/DashboardPage';
import LessonsPage from './pages/LessonsPage';
import LoginPage from './pages/LoginPage';
import ProgressPage from './pages/ProgressPage';
import QuizPage from './pages/QuizPage';
import SignupPage from './pages/SignupPage';
import WordQuizPage from './pages/WordQuizPage';
import WordsPage from './pages/WordsPage';
import WrongNotesPage from './pages/WrongNotesPage';
import './styles.css';

function App() {
  const protectedPage = (page: ReactNode) => (
    <ProtectedRoute>
      <AppLayout>{page}</AppLayout>
    </ProtectedRoute>
  );

  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={protectedPage(<DashboardPage />)} />
        <Route path="/lessons" element={protectedPage(<LessonsPage />)} />
        <Route path="/words" element={protectedPage(<WordsPage />)} />
        <Route path="/word-quiz" element={protectedPage(<WordQuizPage />)} />
        <Route path="/quiz" element={protectedPage(<QuizPage />)} />
        <Route path="/quiz/review" element={protectedPage(<QuizPage mode="review" />)} />
        <Route path="/progress" element={protectedPage(<ProgressPage />)} />
        <Route path="/wrong-notes" element={protectedPage(<WrongNotesPage />)} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
