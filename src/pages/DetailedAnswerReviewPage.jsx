import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  BookOpen, 
  FileText, 
  Scale, 
  Filter, 
  Calendar, 
  Clock, 
  Heart,
  Award
} from 'lucide-react';
import { apiService } from '../services/api';

export default function DetailedAnswerReviewPage({ 
  submissionId, 
  submissionData, 
  onBack 
}) {
  const [exam, setExam] = useState(submissionData || null);
  const [loading, setLoading] = useState(!submissionData);
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'WRONG' | 'CORRECT'
  const [filterSubject, setFilterSubject] = useState('ALL');

  useEffect(() => {
    if (!submissionData && submissionId) {
      setLoading(true);
      apiService.getExamById(submissionId)
        .then(res => {
          if (res && res.data) setExam(res.data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [submissionId, submissionData]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', color: '#94a3b8' }}>
        Loading examination review details...
      </div>
    );
  }

  if (!exam) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '2rem' }} className="glass-panel">
        <h3>Exam Submission Not Found</h3>
        <button className="btn btn-primary" onClick={onBack} style={{ marginTop: '1rem' }}>
          Back to Archive
        </button>
      </div>
    );
  }

  const answersList = exam.answers || [];

  const filteredAnswers = answersList.filter(item => {
    if (filterType === 'CORRECT' && !item.isCorrect) return false;
    if (filterType === 'WRONG' && item.isCorrect) return false;
    if (filterSubject !== 'ALL' && item.subject !== filterSubject) return false;
    return true;
  });

  const correctCount = answersList.filter(a => a.isCorrect).length;
  const wrongCount = answersList.length - correctCount;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          className="btn btn-secondary" 
          onClick={onBack}
          style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Submissions</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Examinee:</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            {exam.examineeName || 'Examinee'}
            <Heart size={15} color="#ec4899" fill="#ec4899" />
          </span>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            padding: '2px 10px',
            borderRadius: '999px',
            background: exam.status === 'PASSED' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
            color: exam.status === 'PASSED' ? '#34d399' : '#f87171',
            border: `1px solid ${exam.status === 'PASSED' ? '#10b981' : '#ef4444'}`
          }}>
            {exam.status} ({exam.generalAverage}%)
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Correct / Wrong Filter Pills */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            onClick={() => setFilterType('ALL')}
            style={{
              padding: '0.35rem 0.8rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: filterType === 'ALL' ? '1px solid #6366f1' : '1px solid transparent',
              background: filterType === 'ALL' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.04)',
              color: filterType === 'ALL' ? '#fff' : '#94a3b8'
            }}
          >
            All Items ({answersList.length})
          </button>

          <button
            onClick={() => setFilterType('WRONG')}
            style={{
              padding: '0.35rem 0.8rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: filterType === 'WRONG' ? '1px solid #ef4444' : '1px solid transparent',
              background: filterType === 'WRONG' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255,255,255,0.04)',
              color: filterType === 'WRONG' ? '#fca5a5' : '#94a3b8'
            }}
          >
            Wrong Answers ({wrongCount})
          </button>

          <button
            onClick={() => setFilterType('CORRECT')}
            style={{
              padding: '0.35rem 0.8rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: filterType === 'CORRECT' ? '1px solid #10b981' : '1px solid transparent',
              background: filterType === 'CORRECT' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.04)',
              color: filterType === 'CORRECT' ? '#a7f3d0' : '#94a3b8'
            }}
          >
            Correct Answers ({correctCount})
          </button>
        </div>

        {/* Subject Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Subject:</span>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            style={{
              background: '#0b0f19',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff',
              padding: '0.35rem 0.7rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              outline: 'none'
            }}
          >
            <option value="ALL">All Subjects</option>
            <option value="FAR">FAR</option>
            <option value="AFAR">AFAR</option>
            <option value="MAS">MAS</option>
            <option value="AUD">AUD</option>
            <option value="TAX">TAX</option>
            <option value="RFBT">RFBT</option>
          </select>
        </div>

      </div>

      {/* Answers List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {filteredAnswers.map((item, idx) => {
          const isCorrect = item.isCorrect;
          const choices = item.choices || {};

          return (
            <div 
              key={item.questionId || idx}
              className="glass-panel"
              style={{
                padding: '1.8rem',
                borderLeft: `5px solid ${isCorrect ? '#10b981' : '#ef4444'}`,
                background: 'rgba(17, 24, 39, 0.85)'
              }}
            >
              {/* Question Metadata Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 800, color: '#f8fafc', fontSize: '1rem' }}>
                    Item #{idx + 1} (QID: {item.questionId})
                  </span>
                  <span className={`badge badge-${item.subject}`}>{item.subject}</span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.topic}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {isCorrect ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#34d399', fontSize: '0.85rem', fontWeight: 700 }}>
                      <CheckCircle2 size={16} />
                      <span>Correct</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#f87171', fontSize: '0.85rem', fontWeight: 700 }}>
                      <XCircle size={16} />
                      <span>Incorrect</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <p style={{ fontSize: '1rem', color: '#f1f5f9', lineHeight: '1.6', marginBottom: '1.2rem', fontWeight: 500 }}>
                {item.question}
              </p>

              {/* Choices Inspector */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.6rem', marginBottom: '1.2rem' }}>
                {['A', 'B', 'C', 'D'].map(key => {
                  const text = choices[key];
                  if (!text) return null;

                  const isChosen = item.selectedAnswer === key;
                  const isAnswerKey = item.correctAnswer === key;

                  let border = '1px solid rgba(255,255,255,0.06)';
                  let bg = 'rgba(255,255,255,0.02)';
                  let color = '#cbd5e1';

                  if (isAnswerKey) {
                    border = '1.5px solid #10b981';
                    bg = 'rgba(16, 185, 129, 0.15)';
                    color = '#6ee7b7';
                  } else if (isChosen && !isAnswerKey) {
                    border = '1.5px solid #ef4444';
                    bg = 'rgba(239, 68, 68, 0.15)';
                    color = '#fca5a5';
                  }

                  return (
                    <div 
                      key={key}
                      style={{
                        padding: '0.6rem 0.8rem',
                        borderRadius: '8px',
                        border: border,
                        background: bg,
                        color: color,
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.6rem'
                      }}
                    >
                      <strong style={{ minWidth: '18px' }}>{key}.</strong>
                      <span style={{ flex: 1 }}>{text}</span>
                      {isChosen && (
                        <span style={{ fontSize: '0.7rem', background: isAnswerKey ? '#10b981' : '#ef4444', color: '#fff', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                          Her Choice
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation & Solutions Box */}
              <div style={{ background: '#0b0f19', borderRadius: '10px', padding: '1rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  <BookOpen size={14} />
                  <span>Explanation & Reasoning:</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.5', marginBottom: item.solution || item.legalBasis ? '0.8rem' : '0' }}>
                  {item.explanation}
                </p>

                {item.solution && (
                  <div style={{ marginTop: '0.6rem', padding: '0.6rem', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                      <FileText size={13} />
                      <span>Step-by-Step Computational Solution:</span>
                    </div>
                    <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#e0f2fe', whiteSpace: 'pre-wrap', margin: 0 }}>
                      {item.solution}
                    </pre>
                  </div>
                )}

                {item.legalBasis && (
                  <div style={{ marginTop: '0.6rem', padding: '0.6rem', background: 'rgba(244, 63, 94, 0.08)', borderRadius: '6px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#fb7185', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                      <Scale size={13} />
                      <span>Legal & Accounting Standard Basis:</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#fda4af', margin: 0 }}>
                      {item.legalBasis}
                    </p>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
