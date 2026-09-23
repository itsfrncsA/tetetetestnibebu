import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ScratchpadModal from './components/ScratchpadModal';
import AuthModal from './components/AuthModal';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import SubmissionsArchivePage from './pages/SubmissionsArchivePage';
import DetailedAnswerReviewPage from './pages/DetailedAnswerReviewPage';

export default function App() {
  // Restore active page: If an active quiz session exists in localStorage, automatically resume on 'quiz'
  const [activePage, setActivePage] = useState(() => {
    try {
      const activeQuiz = localStorage.getItem('cpale_active_quiz_state');
      if (activeQuiz) {
        const parsed = JSON.parse(activeQuiz);
        if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
          return 'quiz';
        }
      }
      return localStorage.getItem('cpale_active_page') || 'home';
    } catch (e) {
      return 'home';
    }
  });
  
  // Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cpale_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Examinee & Exam States
  const [examineeName, setExamineeName] = useState(() => {
    return localStorage.getItem('cpale_examinee_name') || 'Student';
  });
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  
  const [examConfig, setExamConfig] = useState(() => {
    try {
      const activeQuiz = localStorage.getItem('cpale_active_quiz_state');
      if (activeQuiz) {
        const parsed = JSON.parse(activeQuiz);
        if (parsed && parsed.examConfig) return parsed.examConfig;
      }
    } catch (e) {}
    return {
      examineeName: 'Student',
      mode: 'mock',
      shuffle: true
    };
  });

  const [currentResult, setCurrentResult] = useState(() => {
    try {
      const saved = localStorage.getItem('cpale_current_result');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [inspectSubmissionId, setInspectSubmissionId] = useState(null);
  const [inspectSubmissionData, setInspectSubmissionData] = useState(null);

  // Sync examinee name when user logs in
  useEffect(() => {
    if (currentUser && currentUser.role !== 'superadmin') {
      setExamineeName(currentUser.name);
      localStorage.setItem('cpale_examinee_name', currentUser.name);
    }
  }, [currentUser]);

  const handlePageChange = (page) => {
    setActivePage(page);
    try {
      localStorage.setItem('cpale_active_page', page);
    } catch (e) {}
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('cpale_auth_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cpale_auth_user');
    handlePageChange('home');
  };

  const handleStartExam = (config) => {
    // Clear any previous quiz session when explicitly starting a fresh exam
    localStorage.removeItem('cpale_active_quiz_state');
    setExamConfig(config);
    handlePageChange('quiz');
  };

  const handleFinishExam = (resultData) => {
    setCurrentResult(resultData);
    localStorage.setItem('cpale_current_result', JSON.stringify(resultData));
    localStorage.removeItem('cpale_active_quiz_state');
    handlePageChange('results');
  };

  const handleInspectSubmission = (submissionId) => {
    setInspectSubmissionId(submissionId);
    setInspectSubmissionData(null);
    handlePageChange('review');
  };

  const handleViewCurrentDetailedReview = () => {
    if (currentResult) {
      setInspectSubmissionData(currentResult);
      setInspectSubmissionId(currentResult._id || currentResult.id);
      handlePageChange('review');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar 
        activePage={activePage}
        setActivePage={handlePageChange}
        examineeName={examineeName}
        setExamineeName={setExamineeName}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
      />

      {/* Main Pages */}
      <main style={{ flex: 1 }}>
        {activePage === 'home' && (
          <HomePage 
            examineeName={examineeName}
            setExamineeName={setExamineeName}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onStartExam={handleStartExam}
            onNavigate={(page) => handlePageChange(page)}
          />
        )}

        {activePage === 'quiz' && (
          <QuizPage 
            examConfig={examConfig}
            onFinishExam={handleFinishExam}
            onOpenCalculator={() => setIsCalculatorOpen(true)}
          />
        )}

        {activePage === 'results' && (
          <ResultsPage 
            result={currentResult}
            onRetake={() => handlePageChange('home')}
            onViewDetailedReview={handleViewCurrentDetailedReview}
            onNavigateArchive={() => handlePageChange('archive')}
          />
        )}

        {activePage === 'archive' && (
          <SubmissionsArchivePage 
            currentUser={currentUser}
            examineeName={examineeName}
            onInspectSubmission={handleInspectSubmission}
            onStartNewExam={() => handlePageChange('home')}
          />
        )}

        {activePage === 'review' && (
          <DetailedAnswerReviewPage 
            submissionId={inspectSubmissionId}
            submissionData={inspectSubmissionData}
            onBack={() => handlePageChange('archive')}
          />
        )}
      </main>

      {/* Floating Scratchpad / Financial Calculator Modal */}
      <ScratchpadModal 
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      {/* Auth Modal (Login / Register / Superadmin) */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
