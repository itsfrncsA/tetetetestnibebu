import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  RotateCcw, 
  Eye, 
  Clock, 
  BookOpen, 
  History,
  TrendingUp,
  Heart,
  Share2
} from 'lucide-react';

export default function ResultsPage({ 
  result, 
  onRetake, 
  onViewDetailedReview, 
  onNavigateArchive 
}) {
  if (!result) return null;

  const isPassed = result.status === 'PASSED';
  const isConditional = result.status === 'CONDITIONAL';

  const statusColor = isPassed ? '#10b981' : isConditional ? '#f59e0b' : '#ef4444';
  const statusBg = isPassed ? 'rgba(16, 185, 129, 0.15)' : isConditional ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)';
  const statusBorder = isPassed ? 'rgba(16, 185, 129, 0.4)' : isConditional ? 'rgba(245, 158, 11, 0.4)' : 'rgba(239, 68, 68, 0.4)';

  const timeFormatted = () => {
    const mins = Math.floor((result.timeSpentSeconds || 0) / 60);
    const secs = (result.timeSpentSeconds || 0) % 60;
    return `${mins}m ${secs}s`;
  };

  const subjectScores = result.subjectScores instanceof Map 
    ? Object.fromEntries(result.subjectScores)
    : (result.subjectScores || {});

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
      
      {/* Official CPALE Certificate / Scorecard Panel */}
      <div className="glass-panel" style={{
        padding: '3rem 2.5rem',
        borderRadius: '24px',
        border: `2px solid ${statusBorder}`,
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(11, 15, 25, 0.95))',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 20px 50px ${statusBg}`
      }}>
        
        {/* Certificate Watermark Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.3rem 1rem', borderRadius: '999px', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.8rem' }}>
            <span>Republic of the Philippines • PRC Board of Accountancy Simulation</span>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
            CPALE Official Performance Rating
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '1.1rem', color: '#cbd5e1', fontWeight: 600 }}>
              Examinee:
            </span>
            <span style={{ fontSize: '1.25rem', color: '#a5b4fc', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              {result.examineeName || 'Student'}
              <Heart size={16} color="#ec4899" fill="#ec4899" />
            </span>
          </div>
        </div>

        {/* Big Rating Banner */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          alignItems: 'center',
          background: statusBg,
          border: `1px solid ${statusBorder}`,
          padding: '1.8rem',
          borderRadius: '18px',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              General Weighted Average
            </div>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: statusColor, fontFamily: 'var(--font-mono)' }}>
              {result.generalAverage}%
            </div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500 }}>
              {result.score} of {result.totalQuestions} items correct
            </div>
          </div>

          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)', padding: '0 1rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Board Exam Status
            </div>
            <div style={{
              display: 'inline-block',
              fontSize: '1.5rem',
              fontWeight: 800,
              padding: '0.4rem 1.4rem',
              borderRadius: '999px',
              background: statusColor,
              color: '#fff',
              letterSpacing: '1px'
            }}>
              {result.status}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
              {isPassed && 'Passed General Average (>=75%) & No Subject < 65%'}
              {isConditional && 'Average >=75% with conditional subject(s)'}
              {!isPassed && !isConditional && 'General Average below 75%'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Time Elapsed
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
              <Clock size={20} color="#a5b4fc" />
              <span>{timeFormatted()}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.3rem' }}>
              Recorded on {new Date(result.createdAt || Date.now()).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Subject-Wise Performance Table */}
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={18} color="#6366f1" />
          <span>Subject-by-Subject Breakdown</span>
        </h3>

        <div style={{
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '14px',
          border: '1px solid rgba(255,255,255,0.06)',
          overflow: 'hidden',
          marginBottom: '2rem'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}>
                <th style={{ padding: '0.9rem 1.2rem', fontWeight: 700 }}>Subject Code</th>
                <th style={{ padding: '0.9rem 1.2rem', fontWeight: 700 }}>Score</th>
                <th style={{ padding: '0.9rem 1.2rem', fontWeight: 700 }}>Rating (%)</th>
                <th style={{ padding: '0.9rem 1.2rem', fontWeight: 700 }}>PRC Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(subjectScores).map(code => {
                const s = subjectScores[code];
                const subjPassed = s.percentage >= 75;
                const subjConditional = s.percentage >= 65 && s.percentage < 75;
                return (
                  <tr key={code} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.9rem 1.2rem' }}>
                      <span className={`badge badge-${code}`}>{code}</span>
                    </td>
                    <td style={{ padding: '0.9rem 1.2rem', color: '#e2e8f0' }}>
                      {s.correct} / {s.total}
                    </td>
                    <td style={{ padding: '0.9rem 1.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: s.percentage >= 75 ? '#34d399' : s.percentage >= 65 ? '#fbbf24' : '#f87171' }}>
                      {s.percentage}%
                    </td>
                    <td style={{ padding: '0.9rem 1.2rem' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: subjPassed ? 'rgba(16,185,129,0.15)' : subjConditional ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                        color: subjPassed ? '#34d399' : subjConditional ? '#fbbf24' : '#f87171'
                      }}>
                        {subjPassed ? 'Passed' : subjConditional ? 'Conditional' : 'Below 65%'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          <button
            className="btn btn-primary"
            onClick={onViewDetailedReview}
            style={{ padding: '0.8rem 1.6rem' }}
          >
            <Eye size={18} />
            <span>Inspect All Answers & Step-by-Step Solutions</span>
          </button>

          <button
            className="btn btn-secondary"
            onClick={onRetake}
            style={{ padding: '0.8rem 1.4rem' }}
          >
            <RotateCcw size={18} />
            <span>Take Another Exam</span>
          </button>

          <button
            className="btn btn-secondary"
            onClick={onNavigateArchive}
            style={{ padding: '0.8rem 1.4rem' }}
          >
            <History size={18} />
            <span>View Submissions Archive & History</span>
          </button>
        </div>

      </div>

    </div>
  );
}
