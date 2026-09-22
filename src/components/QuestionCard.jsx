import React, { useState } from 'react';
import { Flag, Eye, EyeOff, BookOpen, CheckCircle, XCircle, FileText, Scale } from 'lucide-react';

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  isFlagged,
  onToggleFlag,
  isPracticeMode = false,
  showAnswerInPractice = false,
  onToggleShowPracticeAnswer
}) {
  const choicesKeys = ['A', 'B', 'C', 'D'];
  const hasRevealed = isPracticeMode && showAnswerInPractice;

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '2rem', minHeight: '480px', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Metadata Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
            Item {questionNumber} <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.9rem' }}>/ {totalQuestions}</span>
          </span>
          <span className={`badge badge-${question.subject}`}>
            {question.subject}
          </span>
          <span className={`badge badge-${question.difficulty}`}>
            {question.difficulty}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: '4px' }}>
            {question.topic}
          </span>
        </div>

        {/* Flag Button & Practice Reveal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {isPracticeMode && (
            <button
              onClick={onToggleShowPracticeAnswer}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              {hasRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{hasRevealed ? 'Hide Solution' : 'Check Answer'}</span>
            </button>
          )}

          <button
            onClick={() => onToggleFlag(question.id)}
            style={{
              background: isFlagged ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${isFlagged ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)'}`,
              color: isFlagged ? '#fbbf24' : '#94a3b8',
              padding: '0.4rem 0.8rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
          >
            <Flag size={14} fill={isFlagged ? '#f59e0b' : 'none'} />
            <span>{isFlagged ? 'Flagged' : 'Flag'}</span>
          </button>
        </div>
      </div>

      {/* Question Text */}
      <div style={{ fontSize: '1.05rem', color: '#f1f5f9', fontWeight: 500, lineHeight: '1.7', marginBottom: '2rem' }}>
        {question.question}
      </div>

      {/* Choices List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
        {choicesKeys.map((key) => {
          const choiceText = question.choices[key];
          const isSelected = selectedAnswer === key;
          const isCorrectChoice = question.correctAnswer === key;

          let btnBg = 'rgba(255, 255, 255, 0.03)';
          let borderColor = 'rgba(255, 255, 255, 0.08)';
          let badgeBg = 'rgba(255, 255, 255, 0.08)';
          let textColor = '#e2e8f0';

          if (isSelected) {
            btnBg = 'rgba(99, 102, 241, 0.18)';
            borderColor = '#6366f1';
            badgeBg = '#6366f1';
          }

          // Visual feedback in practice mode when revealed
          if (hasRevealed) {
            if (isCorrectChoice) {
              btnBg = 'rgba(16, 185, 129, 0.2)';
              borderColor = '#10b981';
              badgeBg = '#10b981';
              textColor = '#a7f3d0';
            } else if (isSelected && !isCorrectChoice) {
              btnBg = 'rgba(239, 68, 68, 0.2)';
              borderColor = '#ef4444';
              badgeBg = '#ef4444';
              textColor = '#fca5a5';
            }
          }

          return (
            <button
              key={key}
              onClick={() => onSelectAnswer(question.id, key)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.9rem 1.2rem',
                borderRadius: '12px',
                background: btnBg,
                border: `1.5px solid ${borderColor}`,
                color: textColor,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '0.95rem'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: badgeBg,
                color: isSelected || (hasRevealed && (isCorrectChoice || isSelected)) ? '#fff' : '#cbd5e1',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {key}
              </div>
              <span style={{ flex: 1, lineHeight: '1.5' }}>{choiceText}</span>
              {hasRevealed && isCorrectChoice && <CheckCircle size={18} color="#10b981" />}
              {hasRevealed && isSelected && !isCorrectChoice && <XCircle size={18} color="#ef4444" />}
            </button>
          );
        })}
      </div>

      {/* Practice Mode Solution & Legal Basis Accordion */}
      {hasRevealed && (
        <div style={{
          marginTop: 'auto',
          background: '#0b0f19',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '12px',
          padding: '1.25rem',
          animation: 'fadeIn 0.25s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', color: '#a5b4fc', fontWeight: 700, fontSize: '0.9rem' }}>
            <BookOpen size={16} />
            <span>Official Explanation & Key Concept</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1rem' }}>
            {question.explanation}
          </p>

          {/* Mathematical Solution if available */}
          {question.solution && (
            <div style={{ marginBottom: '1rem', background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                <FileText size={14} />
                <span>Step-by-Step Computational Solution</span>
              </div>
              <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#e2e8f0', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                {question.solution}
              </pre>
            </div>
          )}

          {/* Legal Basis if available */}
          {question.legalBasis && (
            <div style={{ background: 'rgba(244, 63, 94, 0.08)', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fb7185', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                <Scale size={14} />
                <span>Applicable Philippine Legal & Standard Basis</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#fda4af', margin: 0 }}>
                {question.legalBasis}
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
