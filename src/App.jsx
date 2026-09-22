import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ScratchpadModal from './components/ScratchpadModal';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import SubmissionsArchivePage from './pages/SubmissionsArchivePage';
import DetailedAnswerReviewPage from './pages/DetailedAnswerReviewPage';

export default function App() {
  const [activePage, setActivePage] = useState('home'); // 'home' | 'quiz' | 'results' | 'archive' | 'review'
  const [examineeName, setExamineeName] = useState(() => {
    return localStorage.getItem('cpale_examinee_name') || 'Student';
  });
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [examConfig, setExamConfig] = useState({
    examineeName: 'Student',
    mode: 'mock',
    shuffle: true
  });
  const [currentResult, setCurrentResult] = useState(null);
  const [inspectSubmissionId, setInspectSubmissionId] = useState(null);
  const [inspectSubmissionData, setInspectSubmissionData] = useState(null);

  // Save examinee name
  useEffect(() => {
    if (examineeName) {
      localStorage.setItem('cpale_examinee_name', examineeName);
    }
  }, [examineeName]);

  const handleStartExam = (config) => {
    setExamConfig(config);
    setActivePage('quiz');
  };

  const handleFinishExam = (resultData) => {
    setCurrentResult(resultData);
    setActivePage('results');
  };

  const handleInspectSubmission = (submissionId) => {
    setInspectSubmissionId(submissionId);
    setInspectSubmissionData(null);
    setActivePage('review');
  };

  const handleViewCurrentDetailedReview = () => {
    if (currentResult) {
      setInspectSubmissionData(currentResult);
      setInspectSubmissionId(currentResult._id || currentResult.id);
      setActivePage('review');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar 
        activePage={activePage}
        setActivePage={setActivePage}
        examineeName={examineeName}
        setExamineeName={setExamineeName}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
      />

      {/* Main Pages */}
      <main style={{ flex: 1 }}>
        {activePage === 'home' && (
          <HomePage 
            examineeName={examineeName}
            setExamineeName={setExamineeName}
            onStartExam={handleStartExam}
            onNavigate={(page) => setActivePage(page)}
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
            onRetake={() => setActivePage('home')}
            onViewDetailedReview={handleViewCurrentDetailedReview}
            onNavigateArchive={() => setActivePage('archive')}
          />
        )}

        {activePage === 'archive' && (
          <SubmissionsArchivePage 
            onInspectSubmission={handleInspectSubmission}
            onStartNewExam={() => setActivePage('home')}
          />
        )}

        {activePage === 'review' && (
          <DetailedAnswerReviewPage 
            submissionId={inspectSubmissionId}
            submissionData={inspectSubmissionData}
            onBack={() => setActivePage('archive')}
          />
        )}
      </main>

      {/* Floating Scratchpad / Financial Calculator Modal */}
      <ScratchpadModal 
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </div>
  );
}
