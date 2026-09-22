import React from 'react';
import { Flag, CheckCircle2, HelpCircle } from 'lucide-react';

export default function QuestionNavigator({
  questions,
  currentIndex,
  onSelectIndex,
  answers,
  flaggedIds,
  onToggleFlag,
  selectedSubjectFilter,
  setSelectedSubjectFilter
}) {
  const subjects = ['ALL', 'FAR', 'AFAR', 'MAS', 'AUD', 'TAX', 'RFBT'];

  const answeredCount = Object.keys(answers).length;
  const flaggedCount = flaggedIds.size;
  const total = questions.length;

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', height: 'fit-content' }}>
      {/* Header & Stats */}
      <div style={{ marginBottom: '1rem', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>Question Navigator</h4>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            {answeredCount} of {total} Done
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{
            width: `${total > 0 ? (answeredCount / total) * 100 : 0}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #6366f1, #10b981)',
            transition: 'width 0.3s ease'
          }} />
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.75rem', fontSize: '0.75rem', color: '#94a3b8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#3b82f6' }} />
            <span>Answered ({answeredCount})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#f59e0b' }} />
            <span>Flagged ({flaggedCount})</span>
          </div>
        </div>
      </div>

      {/* Subject Filter Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '1rem' }}>
        {subjects.map(s => (
          <button
            key={s}
            onClick={() => setSelectedSubjectFilter(s)}
            style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '6px',
              fontSize: '0.7rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: selectedSubjectFilter === s ? '1px solid #6366f1' : '1px solid transparent',
              background: selectedSubjectFilter === s ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.04)',
              color: selectedSubjectFilter === s ? '#a5b4fc' : '#94a3b8'
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Question Number Badges Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '0.45rem',
        maxHeight: '340px',
        overflowY: 'auto',
        paddingRight: '4px'
      }}>
        {questions.map((q, idx) => {
          const isAnswered = answers[q.id] !== undefined && answers[q.id] !== null;
          const isFlagged = flaggedIds.has(q.id);
          const isCurrent = currentIndex === idx;
          const matchesFilter = selectedSubjectFilter === 'ALL' || q.subject === selectedSubjectFilter;

          if (!matchesFilter) return null;

          let bg = 'rgba(255, 255, 255, 0.04)';
          let borderColor = 'rgba(255, 255, 255, 0.08)';
          let color = '#94a3b8';

          if (isAnswered) {
            bg = 'rgba(59, 130, 246, 0.2)';
            borderColor = 'rgba(59, 130, 246, 0.5)';
            color = '#93c5fd';
          }
          if (isFlagged) {
            borderColor = '#f59e0b';
          }
          if (isCurrent) {
            bg = '#6366f1';
            borderColor = '#818cf8';
            color = '#ffffff';
          }

          return (
            <button
              key={q.id}
              onClick={() => onSelectIndex(idx)}
              style={{
                position: 'relative',
                height: '36px',
                borderRadius: '8px',
                background: bg,
                border: `1.5px solid ${borderColor}`,
                color: color,
                fontWeight: isCurrent ? 800 : 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span>{idx + 1}</span>
              {isFlagged && (
                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#f59e0b',
                  boxShadow: '0 0 6px #f59e0b'
                }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
