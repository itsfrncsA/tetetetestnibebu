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
  Search,
  GraduationCap,
  Star,
  Layers,
  ChevronRight,
  Calculator,
  Target
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
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleStart = (overrideSubject = null) => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    const subj = overrideSubject || (selectedSubject === 'ALL' ? undefined : selectedSubject);
    const config = {
      examineeName: currentUser.name || examineeName.trim() || 'Examinee',
      userId: currentUser.id || currentUser._id,
      mode: overrideSubject ? 'drill' : examMode,
      subject: subj,
      difficulty: selectedDifficulty === 'ALL' ? undefined : selectedDifficulty,
      limit: !subj ? customLimit : undefined,
      shuffle: true
    };
    onStartExam(config);
  };

  const subjectCoverGradients = {
    FAR: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
    AFAR: 'linear-gradient(135deg, #065f46, #10b981)',
    MAS: 'linear-gradient(135deg, #78350f, #f59e0b)',
    AUD: 'linear-gradient(135deg, #581c87, #a855f7)',
    TAX: 'linear-gradient(135deg, #881337, #f43f5e)',
    RFBT: 'linear-gradient(135deg, #164e63, #06b6d4)'
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '5rem' }}>
      
      {/* Udema Hero Banner */}
      <section style={{
        background: 'linear-gradient(180deg, #241442 0%, #351f56 60%, #171128 100%)',
        padding: '4.5rem 1.5rem 5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        {/* Ambient Glows */}
        <div style={{
          position: 'absolute',
          top: '-80px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(255, 193, 7, 0.12) 0%, rgba(107, 59, 168, 0.25) 50%, transparent 80%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '850px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 193, 7, 0.12)', border: '1px solid rgba(255, 193, 7, 0.3)', padding: '0.35rem 1rem', borderRadius: '999px', fontSize: '0.82rem', color: '#ffc107', fontWeight: 700, marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <Sparkles size={15} />
            <span>Official Philippine CPA Licensure Reviewer</span>
          </div>

          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px', marginBottom: '0.8rem', lineHeight: 1.2 }}>
            WHAT WOULD YOU MASTER?
          </h1>

          <p style={{ fontSize: '1.1rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '2.2rem', maxWidth: '700px', margin: '0 auto 2.2rem' }}>
            Increase your expertise in Financial Accounting, Advanced Accounting, Auditing, Management Advisory, Taxation, and Philippine Business Law.
          </p>

          {/* Hero Search & Filter Bar */}
          <div style={{
            maxWidth: '680px',
            margin: '0 auto 2rem',
            background: '#ffffff',
            borderRadius: '9999px',
            padding: '6px 8px 6px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            boxShadow: '0 12px 35px rgba(0,0,0,0.5)'
          }}>
            <Search size={20} color="#6b3ba8" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ex. Cash and Cash Equivalents, CREATE Act, Partnerships..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '0.95rem',
                color: '#1f2937',
                background: 'transparent'
              }}
            />
            <button 
              onClick={() => handleStart()}
              className="btn btn-primary"
              style={{
                borderRadius: '9999px',
                padding: '0.65rem 1.6rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                background: '#4b2c79',
                color: '#fff',
                border: 'none'
              }}
            >
              Start Drill
            </button>
          </div>

          {/* User Quick Info */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(0,0,0,0.35)', padding: '0.5rem 1.2rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.85rem' }}>
            <span style={{ color: '#94a3b8' }}>Examinee:</span>
            <strong style={{ color: '#fff' }}>{currentUser ? currentUser.name : 'Guest User'}</strong>
            {!currentUser && (
              <button 
                onClick={onOpenAuth}
                style={{ background: '#ffc107', color: '#171128', border: 'none', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
              >
                Sign In
              </button>
            )}
          </div>

        </div>
      </section>

      {/* Udema Stats / Features Banner Strip */}
      <section style={{ background: '#171128', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,193,7,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,193,7,0.25)' }}>
              <GraduationCap size={24} color="#ffc107" />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: '1.05rem' }}>+50 Board Questions</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Explore mock tests in 6 CPALE subjects</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16,185,129,0.25)' }}>
              <Award size={24} color="#34d399" />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: '1.05rem' }}>PRC BOA Standards</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>75% General Average & 65% Subject Rule</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(99,102,241,0.25)' }}>
              <Target size={24} color="#818cf8" />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: '1.05rem' }}>Focus on Target</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Detailed math solutions & legal citations</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(244,63,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(244,63,94,0.25)' }}>
              <Calculator size={24} color="#fb7185" />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: '1.05rem' }}>Real-time Scratchpad</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Built-in financial and tax calculator</div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3.5rem 1.5rem 0' }}>

        {/* Section 1: Select a Review Mode (Udema Topic selector style) */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>
            Select Review Mode
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Choose how you want to train and review for the licensure exam
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          
          {/* Mock Board Exam Mode */}
          <div 
            onClick={() => setExamMode('mock')}
            className={`udema-feature-card ${examMode === 'mock' ? 'active-mode' : ''}`}
            style={{
              border: examMode === 'mock' ? '2px solid #ffc107' : '1px solid rgba(255,255,255,0.08)',
              background: examMode === 'mock' ? 'rgba(75, 44, 121, 0.35)' : 'var(--bg-card)'
            }}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255,193,7,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem' }}>
              <Award size={28} color="#ffc107" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '0.6rem' }}>
              Mock Board Exam Mode
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1.2rem' }}>
              Simulates actual PRC Board conditions with 3-hour timer, question flagging, and official passing scorecard.
            </p>
            <button 
              className="btn btn-gold"
              onClick={(e) => { e.stopPropagation(); setExamMode('mock'); handleStart(); }}
              style={{ width: '100%', fontSize: '0.85rem' }}
            >
              Start Mock Exam
            </button>
          </div>

          {/* Self-Paced Practice */}
          <div 
            onClick={() => setExamMode('practice')}
            className={`udema-feature-card ${examMode === 'practice' ? 'active-mode' : ''}`}
            style={{
              border: examMode === 'practice' ? '2px solid #34d399' : '1px solid rgba(255,255,255,0.08)',
              background: examMode === 'practice' ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-card)'
            }}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem' }}>
              <BookOpen size={28} color="#34d399" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '0.6rem' }}>
              Self-Paced Practice
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1.2rem' }}>
              Learn as you answer with instant step-by-step mathematical computations and Philippine statutory legal bases.
            </p>
            <button 
              className="btn btn-primary"
              onClick={(e) => { e.stopPropagation(); setExamMode('practice'); handleStart(); }}
              style={{ width: '100%', fontSize: '0.85rem', background: '#059669' }}
            >
              Start Practice Mode
            </button>
          </div>

          {/* Subject & Topic Drill */}
          <div 
            onClick={() => setExamMode('drill')}
            className={`udema-feature-card ${examMode === 'drill' ? 'active-mode' : ''}`}
            style={{
              border: examMode === 'drill' ? '2px solid #818cf8' : '1px solid rgba(255,255,255,0.08)',
              background: examMode === 'drill' ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg-card)'
            }}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem' }}>
              <Filter size={28} color="#818cf8" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '0.6rem' }}>
              Subject & Topic Drill
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1.2rem' }}>
              Target specific CPALE subjects (e.g. Focus on Taxation under CREATE & EOPT, or Business Combinations in AFAR).
            </p>
            <button 
              className="btn btn-primary"
              onClick={(e) => { e.stopPropagation(); setExamMode('drill'); }}
              style={{ width: '100%', fontSize: '0.85rem' }}
            >
              Choose Subject Drill
            </button>
          </div>

        </div>

        {/* Section 2: Udema Popular Courses / CPALE Exam Subjects (50 Items) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ color: '#ffc107', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.3rem' }}>
              Curated Question Bank
            </div>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fff' }}>
              CPALE Exam Subjects (50 Items)
            </h2>
          </div>

          <button 
            onClick={() => onNavigate('archive')}
            style={{ background: 'transparent', border: 'none', color: '#ffc107', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.92rem', fontWeight: 700, cursor: 'pointer' }}
          >
            <History size={17} />
            <span>View Examinee Archive & Results →</span>
          </button>
        </div>

        {/* Courses Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          {subjectSummary.map(subj => (
            <div key={subj.code} className="udema-course-card">
              
              {/* Course Top Graphic */}
              <div className="udema-course-img" style={{ background: subjectCoverGradients[subj.code] || 'linear-gradient(135deg, #351f56, #4b2c79)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', letterSpacing: '1px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                    {subj.code}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                    Philippine CPA Licensure Board
                  </div>
                </div>

                {/* Question count pill */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(8px)',
                  color: '#ffc107',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '3px 9px',
                  borderRadius: '999px',
                  border: '1px solid rgba(255,193,7,0.4)'
                }}>
                  {subj.total} Items
                </div>
              </div>

              {/* Course Body */}
              <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                    <span className={`badge badge-${subj.code}`}>{subj.code}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#ffc107', fontSize: '0.8rem', fontWeight: 700 }}>
                      <Star size={14} fill="#ffc107" />
                      <span>5.0</span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: '0.8rem' }}>
                    {subj.name}
                  </h3>

                  {/* Topics Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.2rem' }}>
                    {subj.topics && subj.topics.slice(0, 3).map(t => (
                      <span key={t} style={{ fontSize: '0.72rem', color: '#cbd5e1', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px' }}>
                        {t}
                      </span>
                    ))}
                    {subj.topics && subj.topics.length > 3 && (
                      <span style={{ fontSize: '0.72rem', color: '#ffc107', fontWeight: 700 }}>
                        +{subj.topics.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Course Card Action */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Standard: <strong>PRC BOA</strong>
                  </span>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleStart(subj.code)}
                    style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
                  >
                    <span>Practice {subj.code}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
