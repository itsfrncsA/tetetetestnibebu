import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  Calculator, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import QuestionCard from '../components/QuestionCard';
import QuestionNavigator from '../components/QuestionNavigator';
import Timer from '../components/Timer';
import { apiService } from '../services/api';

const STORAGE_KEY = 'cpale_active_quiz_state';

export default function QuizPage({ 
  examConfig, 
  onFinishExam, 
  onOpenCalculator 
}) {
  // Try restoring from active localStorage session if available
  const savedSession = useRef(null);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        savedSession.current = parsed;
      }
    }
  } catch (e) {
    savedSession.current = null;
  }

  const [questions, setQuestions] = useState(() => savedSession.current?.questions || []);
  const [currentIndex, setCurrentIndex] = useState(() => savedSession.current?.currentIndex || 0);
  const [answers, setAnswers] = useState(() => savedSession.current?.answers || {});
  const [flaggedIds, setFlaggedIds] = useState(() => new Set(savedSession.current?.flaggedIds || []));
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('ALL');
  const [showPracticeAnswer, setShowPracticeAnswer] = useState(false);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(() => savedSession.current?.timeSpentSeconds || 0);
  const [loading, setLoading] = useState(() => !savedSession.current?.questions?.length);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default duration: 3 hours (10,800s) for mock exam
  const examDuration = 3 * 60 * 60;

  // Initial load if not restored from session
  useEffect(() => {
    if (savedSession.current?.questions?.length) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const params = {
      mode: examConfig.mode,
      subject: examConfig.subject,
      topic: examConfig.topic,
      difficulty: examConfig.difficulty,
      limit: examConfig.limit,
      shuffle: examConfig.shuffle !== undefined ? examConfig.shuffle : (examConfig.mode === 'mock')
    };

    apiService.getQuestions(params)
      .then(res => {
        if (res && res.data) {
          setQuestions(res.data);
          // Save initial session
          const initialSave = {
            questions: res.data,
            currentIndex: 0,
            answers: {},
            flaggedIds: [],
            timeSpentSeconds: 0,
            examConfig,
            timestamp: Date.now()
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSave));
        }
      })
      .catch(err => console.error('Failed to load questions:', err))
      .finally(() => setLoading(false));
  }, [examConfig]);

  // Sync state to localStorage on every change
  useEffect(() => {
    if (!loading && questions.length > 0) {
      try {
        const stateToSave = {
          questions,
          currentIndex,
          answers,
          flaggedIds: Array.from(flaggedIds),
          timeSpentSeconds,
          examConfig,
          timestamp: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      } catch (e) {
        console.warn('Failed saving quiz session to localStorage:', e);
      }
    }
  }, [questions, currentIndex, answers, flaggedIds, timeSpentSeconds, loading, examConfig]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['input', 'textarea'].includes(document.activeElement.tagName?.toLowerCase())) return;

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
        // Clear active session once submitted
        localStorage.removeItem(STORAGE_KEY);
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
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid #341a5c', borderTopColor: '#ffc107', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#94a3b8', fontWeight: 600 }}>Loading CPALE Question Bank...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '2rem' }} className="clean-panel">
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
            borderRadius: '4px',
            background: examConfig.mode === 'mock' ? '#261840' : '#064e3b',
            color: examConfig.mode === 'mock' ? '#ffc107' : '#6ee7b7',
            border: `1px solid ${examConfig.mode === 'mock' ? '#4a287e' : '#059669'}`
          }}>
            {examConfig.mode === 'mock' ? 'Mock Board Exam' : examConfig.mode === 'practice' ? 'Practice Mode' : 'Subject Drill'}
          </span>
        </div>

        {/* Right: Timer & Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          {examConfig.mode === 'mock' && (
            <Timer 
              durationSeconds={examDuration}
              initialTimeSpent={timeSpentSeconds}
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
            className="btn btn-gold"
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
              Tip: Press <kbd style={{ background: '#1c1230', padding: '2px 6px', borderRadius: '4px', border: '1px solid #2c1c4d' }}>A</kbd> <kbd style={{ background: '#1c1230', padding: '2px 6px', borderRadius: '4px', border: '1px solid #2c1c4d' }}>B</kbd> <kbd style={{ background: '#1c1230', padding: '2px 6px', borderRadius: '4px', border: '1px solid #2c1c4d' }}>C</kbd> <kbd style={{ background: '#1c1230', padding: '2px 6px', borderRadius: '4px', border: '1px solid #2c1c4d' }}>D</kbd> or <kbd style={{ background: '#1c1230', padding: '2px 6px', borderRadius: '4px', border: '1px solid #2c1c4d' }}>←</kbd> <kbd style={{ background: '#1c1230', padding: '2px 6px', borderRadius: '4px', border: '1px solid #2c1c4d' }}>→</kbd>
            </div>

            {isLastQuestion ? (
              <button
                className="btn btn-gold"
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
          background: 'rgba(10, 5, 18, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="clean-panel" style={{ maxWidth: '480px', width: '100%', padding: '2rem', background: '#1c1230', border: '1px solid #ffc107' }}>
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
                className="btn btn-gold"
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
