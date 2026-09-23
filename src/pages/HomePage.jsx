import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Play, 
  BookOpen, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  Filter, 
  History,
  TrendingUp,
  Heart
} from 'lucide-react';
import { apiService } from '../services/api';

export default function HomePage({ 
  examineeName, 
  setExamineeName, 
  currentUser,
  onOpenAuth,
  onStartExam, 
  onNavigate 
}) {
  const [subjectSummary, setSubjectSummary] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [examMode, setExamMode] = useState('mock'); // 'mock' | 'practice' | 'drill'
  const [customLimit, setCustomLimit] = useState(50);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getSubjectSummary()
      .then(data => {
        if (data && data.subjects) setSubjectSummary(data.subjects);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStart = () => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    const config = {
      examineeName: currentUser.name || examineeName.trim() || 'Examinee',
      userId: currentUser.id || currentUser._id,
      mode: examMode,
      subject: selectedSubject === 'ALL' ? undefined : selectedSubject,
      difficulty: selectedDifficulty === 'ALL' ? undefined : selectedDifficulty,
      limit: selectedSubject === 'ALL' ? customLimit : undefined,
      shuffle: true
    };
    onStartExam(config);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      
      {/* Hero Header */}
      <div className="glass-panel" style={{
        padding: '3rem 2.5rem',
        marginBottom: '2.5rem',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.7), rgba(15, 23, 42, 0.9))'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '750px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '0.3rem 0.8rem', borderRadius: '999px', fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 600, marginBottom: '1rem' }}>
            <Sparkles size={14} />
            <span>Philippine CPA Licensure Examination Standard Practice</span>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2, marginBottom: '1rem' }}>
            Master the Philippine CPALE with Precision & Instant Analytics
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.8rem' }}>
            Comprehensive 50-item curated reviewer across <strong>FAR, AFAR, MAS, AUD, TAX, and RFBT</strong>. 
            Includes Philippine tax rules (TRAIN, CREATE, EOPT), Revised Corporation Code, and standard BOA grading.
          </p>

          {/* Quick Examinee Setup */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', background: 'rgba(11, 15, 25, 0.8)', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '220px' }}>
              <Heart size={18} color="#ec4899" fill="#ec4899" />
              <div style={{ width: '100%' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, marginBottom: '2px' }}>
                  {currentUser ? 'Logged In Examinee' : 'Examinee Account'}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                  {currentUser ? currentUser.name : 'Guest (Sign in required to record scores)'}
                </div>
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              onClick={handleStart}
              style={{ padding: '0.75rem 1.8rem', fontSize: '1rem' }}
            >
              {currentUser ? <Play size={18} fill="#fff" /> : <Sparkles size={18} />}
              <span>{currentUser ? 'Begin Exam Session' : 'Login to Start Exam'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode Selection Cards */}
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.2rem', color: '#f1f5f9' }}>
        Select Review Mode
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        {/* Mock Board Exam Mode */}
        <div 
          onClick={() => setExamMode('mock')}
          className="glass-panel"
          style={{
            padding: '1.75rem',
            cursor: 'pointer',
            border: examMode === 'mock' ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.08)',
            background: examMode === 'mock' ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
        >
          {examMode === 'mock' && (
            <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
              <CheckCircle size={20} color="#6366f1" />
            </div>
          )}
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Award size={22} color="#818cf8" />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>
            Mock Board Exam Mode
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1rem' }}>
            Simulates actual PRC Board Examination conditions. Includes 3-hour timer, question flagger, and official CPALE passing rating computation ($\ge 75\%$ average).
          </p>
          <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 600 }}>
            <span>⏱️ 3-Hour Timer</span>
            <span>📊 Official Scorecard</span>
          </div>
        </div>

        {/* Practice Mode */}
        <div 
          onClick={() => setExamMode('practice')}
          className="glass-panel"
          style={{
            padding: '1.75rem',
            cursor: 'pointer',
            border: examMode === 'practice' ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
            background: examMode === 'practice' ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-card)',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
        >
          {examMode === 'practice' && (
            <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
              <CheckCircle size={20} color="#10b981" />
            </div>
          )}
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <BookOpen size={22} color="#34d399" />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>
            Self-Paced Practice & Review
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1rem' }}>
            Learn as you answer. Instant "Check Answer" button reveals detailed explanations, step-by-step mathematical solutions, and Philippine statutory citations.
          </p>
          <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.75rem', color: '#6ee7b7', fontWeight: 600 }}>
            <span>💡 Instant Solutions</span>
            <span>⚖️ Legal Basis Citations</span>
          </div>
        </div>

        {/* Subject Drill Mode */}
        <div 
          onClick={() => setExamMode('drill')}
          className="glass-panel"
          style={{
            padding: '1.75rem',
            cursor: 'pointer',
            border: examMode === 'drill' ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
            background: examMode === 'drill' ? 'rgba(245, 158, 11, 0.12)' : 'var(--bg-card)',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
        >
          {examMode === 'drill' && (
            <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
              <CheckCircle size={20} color="#f59e0b" />
            </div>
          )}
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Filter size={22} color="#fbbf24" />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>
            Subject & Topic Drill
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1rem' }}>
            Target specific subjects where you need mastery (e.g. Focus on Taxation under CREATE & EOPT, or Business Combinations in AFAR).
          </p>
          <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.75rem', color: '#fde68a', fontWeight: 600 }}>
            <span>🎯 Subject Filtering</span>
            <span>📈 Targeted Mastery</span>
          </div>
        </div>

      </div>

      {/* Subject Filter selector if in drill mode or custom config */}
      {examMode === 'drill' && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.8rem', color: '#fff' }}>
            Choose Target Subject:
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {['FAR', 'AFAR', 'MAS', 'AUD', 'TAX', 'RFBT'].map(code => (
              <button
                key={code}
                onClick={() => setSelectedSubject(code)}
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  border: selectedSubject === code ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                  background: selectedSubject === code ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.04)',
                  color: selectedSubject === code ? '#fff' : '#cbd5e1'
                }}
              >
                {code}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Subject Breakdown Overview Cards */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f1f5f9' }}>
          CPALE Exam Subjects (50 Items)
        </h2>
        <button 
          onClick={() => onNavigate('archive')}
          style={{ background: 'transparent', border: 'none', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
        >
          <History size={16} />
          <span>View Past Exam Results & Answers →</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.2rem' }}>
        {subjectSummary.map(subj => (
          <div key={subj.code} className="glass-panel" style={{ padding: '1.25rem', borderLeft: `4px solid var(--badge-${subj.code.toLowerCase()})` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
              <div>
                <span className={`badge badge-${subj.code}`}>{subj.code}</span>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '0.4rem', color: '#fff' }}>
                  {subj.name}
                </h4>
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
                {subj.total} <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>items</span>
              </span>
            </div>

            {/* Topics sample */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.8rem' }}>
              {subj.topics && subj.topics.slice(0, 3).map(t => (
                <span key={t} style={{ fontSize: '0.7rem', color: '#94a3b8', background: 'rgba(255,255,255,0.04)', padding: '2px 6px', borderRadius: '4px' }}>
                  {t}
                </span>
              ))}
              {subj.topics && subj.topics.length > 3 && (
                <span style={{ fontSize: '0.7rem', color: '#64748b', padding: '2px 4px' }}>
                  +{subj.topics.length - 3} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
