import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  Calculator, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import QuestionCard from '../components/QuestionCard';
import QuestionNavigator from '../components/QuestionNavigator';
import Timer from '../components/Timer';
import { apiService } from '../services/api';

export default function QuizPage({ 
  examConfig, 
  onFinishExam, 
  onOpenCalculator 
}) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: 'A' | 'B' | 'C' | 'D' }
  const [flaggedIds, setFlaggedIds] = useState(new Set());
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('ALL');
  const [showPracticeAnswer, setShowPracticeAnswer] = useState(false);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default duration: 3 hours (10,800s) for mock exam
  const examDuration = 3 * 60 * 60;

  useEffect(() => {
    setLoading(true);
    const params = {
      subject: examConfig.subject,
      difficulty: examConfig.difficulty,
      limit: examConfig.limit,
      shuffle: examConfig.mode === 'mock'
    };

    apiService.getQuestions(params)
      .then(res => {
        if (res && res.data) {
          setQuestions(res.data);
        }
      })
      .catch(err => console.error('Failed to load questions:', err))
      .finally(() => setLoading(false));
  }, [examConfig]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) return;

      const currentQ = questions[currentIndex];
      if (!currentQ) return;

      if (['1', 'a', 'A'].includes(e.key)) handleSelectAnswer(currentQ.id, 'A');
      if (['2', 'b', 'B'].includes(e.key)) handleSelectAnswer(currentQ.id, 'B');
      if (['3', 'c', 'C'].includes(e.key)) handleSelectAnswer(currentQ.id, 'C');
      if (['4', 'd', 'D'].includes(e.key)) handleSelectAnswer(currentQ.id, 'D');

      if (e.key === 'ArrowRight' && currentIndex < questions.length - 1) {
        handleNext();
      }
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, questions, answers]);

  const handleSelectAnswer = (qId, choiceKey) => {
    setAnswers(prev => ({ ...prev, [qId]: choiceKey }));
  };

  const handleToggleFlag = (qId) => {
    setFlaggedIds(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowPracticeAnswer(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowPracticeAnswer(false);
    }
  };

  const handleSubmitExam = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        examineeName: examConfig.examineeName || 'Examinee',
        mode: examConfig.mode || 'mock',
        answers: answers,
        timeSpentSeconds: timeSpentSeconds
      };

      const result = await apiService.submitExam(payload);
      if (result && result.data) {
        onFinishExam(result.data);
      }
    } catch (err) {
      console.error('Error submitting exam:', err);
      alert('Failed to submit exam. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsSubmitModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#94a3b8', fontWeight: 600 }}>Loading CPALE Question Bank...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '2rem' }} className="glass-panel">
        <AlertTriangle size={48} color="#f59e0b" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Questions Found</h3>
        <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
          No questions match your current filter selection.
        </p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '1.5rem 1.5rem 3rem' }}>
      
      {/* Top Status Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        
        {/* Left: Examinee info & Mode Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
            {examConfig.examineeName || 'Examinee'}'s Exam
          </div>
          <span style={{ 
            fontSize: '0.75rem', 
            fontWeight: 700, 
            padding: '2px 8px', 
            borderRadius: '6px',
            background: examConfig.mode === 'mock' ? 'rgba(99,102,241,0.2)' : 'rgba(16,185,129,0.2)',
            color: examConfig.mode === 'mock' ? '#a5b4fc' : '#6ee7b7',
            border: `1px solid ${examConfig.mode === 'mock' ? 'rgba(99,102,241,0.4)' : 'rgba(16,185,129,0.4)'}`
          }}>
            {examConfig.mode === 'mock' ? 'Mock Board Exam' : examConfig.mode === 'practice' ? 'Practice Mode' : 'Subject Drill'}
          </span>
        </div>

        {/* Right: Timer & Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          {examConfig.mode === 'mock' && (
            <Timer 
              durationSeconds={examDuration}
              onTick={(spent) => setTimeSpentSeconds(spent)}
              onTimeUp={handleSubmitExam}
            />
          )}

          <button 
            className="btn btn-secondary"
            onClick={onOpenCalculator}
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
          >
            <Calculator size={15} />
            <span>Scratchpad</span>
          </button>

          <button
            className="btn btn-primary"
            onClick={() => setIsSubmitModalOpen(true)}
            style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem' }}
          >
            <Send size={15} />
            <span>Finish Exam</span>
          </button>
        </div>
      </div>

      {/* Main Grid Layout: Question Card (Left) + Navigator (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Question Area */}
        <div>
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            selectedAnswer={answers[currentQuestion.id]}
            onSelectAnswer={handleSelectAnswer}
            isFlagged={flaggedIds.has(currentQuestion.id)}
            onToggleFlag={handleToggleFlag}
            isPracticeMode={examConfig.mode === 'practice'}
            showAnswerInPractice={showPracticeAnswer}
            onToggleShowPracticeAnswer={() => setShowPracticeAnswer(prev => !prev)}
          />

          {/* Bottom Nav Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.2rem' }}>
            <button
              className="btn btn-secondary"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              style={{ opacity: currentIndex === 0 ? 0.4 : 1, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer' }}
            >
              <ChevronLeft size={18} />
              <span>Previous</span>
            </button>

            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Tip: Press <kbd style={{ background: '#1e293b', padding: '2px 6px', borderRadius: '4px', border: '1px solid #334155' }}>A</kbd> <kbd style={{ background: '#1e293b', padding: '2px 6px', borderRadius: '4px', border: '1px solid #334155' }}>B</kbd> <kbd style={{ background: '#1e293b', padding: '2px 6px', borderRadius: '4px', border: '1px solid #334155' }}>C</kbd> <kbd style={{ background: '#1e293b', padding: '2px 6px', borderRadius: '4px', border: '1px solid #334155' }}>D</kbd> or <kbd style={{ background: '#1e293b', padding: '2px 6px', borderRadius: '4px', border: '1px solid #334155' }}>←</kbd> <kbd style={{ background: '#1e293b', padding: '2px 6px', borderRadius: '4px', border: '1px solid #334155' }}>→</kbd>
            </div>

            {isLastQuestion ? (
              <button
                className="btn btn-primary"
                onClick={() => setIsSubmitModalOpen(true)}
              >
                <Send size={16} />
                <span>Submit Exam</span>
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleNext}
              >
                <span>Next</span>
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Question Navigator */}
        <QuestionNavigator
          questions={questions}
          currentIndex={currentIndex}
          onSelectIndex={(idx) => {
            setCurrentIndex(idx);
            setShowPracticeAnswer(false);
          }}
          answers={answers}
          flaggedIds={flaggedIds}
          onToggleFlag={handleToggleFlag}
          selectedSubjectFilter={selectedSubjectFilter}
          setSelectedSubjectFilter={setSelectedSubjectFilter}
        />

      </div>

      {/* Submit Confirmation Modal */}
      {isSubmitModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 300,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="glass-panel" style={{ maxWidth: '480px', width: '100%', padding: '2rem', background: '#111827', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.8rem', color: '#fff' }}>
              Submit Exam for Rating?
            </h3>
            
            <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              You have answered <strong>{answeredCount}</strong> out of <strong>{questions.length}</strong> questions.
              {unansweredCount > 0 && (
                <span style={{ color: '#f59e0b', display: 'block', marginTop: '0.5rem' }}>
                  ⚠️ You still have {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}.
                </span>
              )}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setIsSubmitModalOpen(false)}
                disabled={isSubmitting}
              >
                Keep Answering
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmitExam}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Evaluating...' : 'Confirm & See Results'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
