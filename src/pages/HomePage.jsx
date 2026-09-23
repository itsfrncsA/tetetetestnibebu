import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Play, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  Filter, 
  History,
  GraduationCap,
  Star,
  ChevronRight,
  Calculator,
  Target,
  FileText,
  Scale,
  Library,
  LogIn,
  Quote,
  RefreshCw,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { apiService } from '../services/api';

const MOTIVATIONAL_QUOTES = [
  {
    quote: "The CPA title is not given to the smartest, but to the most persistent. Trust the process, your three letters are waiting.",
    author: "Philippine CPA Aspirant Motto"
  },
  {
    quote: "Every debit of hard work today will balance into a credit of success on the PRC Board Examination results day.",
    author: "Board Reviewer Principle"
  },
  {
    quote: "One day, your name will be on the official PRC list of passers and every late-night review session will have been worth it.",
    author: "Future Certified Public Accountant"
  },
  {
    quote: "Study with discipline, master each standard item by item, and conquer the CPALE with unwavering confidence.",
    author: "CPA Board Strategy"
  },
  {
    quote: "Difficult accounting standards don't stay difficult forever. With consistent practice, mastery becomes second nature.",
    author: "Examinee Mindset"
  },
  {
    quote: "Success is the sum of small accounting problems and tax computations solved day in and day out.",
    author: "Review Discipline"
  },
  {
    quote: "Commit your review efforts to excellence, stay focused on the goal, and claim your CPA license in 2026!",
    author: "Philippine CPA Board Examinee"
  },
  {
    quote: "Do not count the hours you study; make the hours you study count. Balance your time and master the fundamentals.",
    author: "Accountancy Excellence"
  }
];

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

  // Quote State
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length));

  const handleNextQuote = () => {
    setQuoteIndex(prev => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

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

  const subjectCoverColors = {
    FAR: '#1e3a8a',
    AFAR: '#065f46',
    MAS: '#78350f',
    AUD: '#581c87',
    TAX: '#881337',
    RFBT: '#164e63'
  };

  const referencesList = [
    {
      subject: 'FAR',
      title: 'Financial Accounting and Reporting',
      sources: [
        'Philippine Financial Reporting Standards (PFRS) & Philippine Accounting Standards (PAS)',
        'Conceptual Framework for Financial Reporting (FRSC)',
        'Practical Financial Accounting (Valix, Peralta, Valix)',
        'Intermediate Accounting (Robles & Empleo)'
      ]
    },
    {
      subject: 'AFAR',
      title: 'Advanced Financial Accounting & Reporting',
      sources: [
        'PFRS 3 (Business Combinations), PFRS 10 (Consolidation), PFRS 15 (Revenue Recognition)',
        'Advanced Financial Accounting & Reporting Reviewer (Dayag / De Jesus / Guerrero)',
        'PAS 21 (Foreign Currency Transactions & Hedging)'
      ]
    },
    {
      subject: 'MAS',
      title: 'Management Advisory Services',
      sources: [
        'Managerial Accounting (Garrison, Noreen, Brewer)',
        'Management Advisory Services Reviewer (Cabrera / Agamata / Bobadilla)',
        'Financial Management & Quantitative Techniques (Horngren)'
      ]
    },
    {
      subject: 'AUD',
      title: 'Auditing (Theory and Problems)',
      sources: [
        'Philippine Standards on Auditing (PSA 200 - PSA 700 Series)',
        'Code of Ethics for Professional Accountants in the Philippines (PICPA/PRC BOA)',
        'Auditing Theory & Practice (Salosagcol, Tiu, Ocampo / Escala)'
      ]
    },
    {
      subject: 'TAX',
      title: 'Taxation',
      sources: [
        'National Internal Revenue Code (NIRC) as amended by RA 10963 (TRAIN Law)',
        'Corporate Recovery and Tax Incentives for Enterprises (CREATE Act - RA 11534)',
        'Ease of Paying Taxes (EOPT) Act (RA 11976 - 2024)',
        'Reviewer in Taxation (Tabag & Garcia / Co Untian / De Leon)'
      ]
    },
    {
      subject: 'RFBT',
      title: 'Regulatory Framework for Business Transactions',
      sources: [
        'Revised Corporation Code of the Philippines (Republic Act No. 11232)',
        'Civil Code of the Philippines (Law on Sales, Obligations & Contracts, Law on Partnerships)',
        'Anti-Money Laundering Act (AMLA - RA 9160 as amended)',
        'RFBT Compendium & Reviewer (Soriano / De Leon / Andrix)'
      ]
    },
    {
      subject: 'BOA',
      title: 'PRC Board of Accountancy Grading Metrics',
      sources: [
        'Philippine Accountancy Act of 2004 (Republic Act No. 9298)',
        'PRC Professional Regulatory Board of Accountancy (BOA) Table of Specifications (TOS)',
        'Section 15 Passing Criteria: General Average ≥ 75.00% with No Subject Below 65.00%'
      ]
    }
  ];

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex];

  // ==========================================
  // LANDING PAGE (WHEN NOT LOGGED IN)
  // ==========================================
  if (!currentUser) {
    return (
      <div style={{ minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1.5rem 4rem' }}>
        
        <div style={{ maxWidth: '780px', width: '100%', textAlign: 'center' }}>
          
          {/* Main Top Header Emblem */}
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '12px',
            background: '#ffc107',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            border: '2px solid #ffb300'
          }}>
            <GraduationCap size={38} color="#10081d" />
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px', marginBottom: '0.4rem', lineHeight: 1.2 }}>
            Reviewer
          </h1>
          <p style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '2rem', fontWeight: 500 }}>
            Philippine CPALE Personal Reviewer & Practice System
          </p>

          {/* Solid Motivational Quote Card */}
          <div style={{
            background: '#19102c',
            border: '1px solid #2b1a4a',
            borderTop: '3px solid #ffc107',
            borderRadius: '12px',
            padding: '1.75rem 2rem',
            textAlign: 'center',
            position: 'relative',
            marginBottom: '2.5rem',
            boxShadow: '0 6px 24px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.6rem' }}>
              <Quote size={26} color="#ffc107" />
            </div>

            <p style={{ fontSize: '1.05rem', fontStyle: 'italic', color: '#f8fafc', lineHeight: 1.6, marginBottom: '0.9rem', fontWeight: 500 }}>
              "{currentQuote.quote}"
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#ffc107', fontWeight: 700, letterSpacing: '0.3px' }}>
                — {currentQuote.author}
              </span>

              <button
                onClick={handleNextQuote}
                title="Shuffle new motivational quote"
                style={{
                  background: '#24163f',
                  border: '1px solid #3d2466',
                  color: '#cbd5e1',
                  borderRadius: '4px',
                  padding: '3px 8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 600
                }}
              >
                <RefreshCw size={11} />
                <span>Shuffle</span>
              </button>
            </div>
          </div>

          {/* Single Focused Action Button */}
          <div style={{ marginBottom: '2.5rem' }}>
            <button
              onClick={onOpenAuth}
              className="btn btn-gold"
              style={{
                padding: '0.85rem 2.8rem',
                fontSize: '1rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 4px 16px rgba(255, 193, 7, 0.3)'
              }}
            >
              <LogIn size={18} />
              <span>Sign In to Start Review</span>
            </button>
          </div>

          {/* Highlights Strip */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.2rem', color: '#94a3b8', fontSize: '0.8rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle size={13} color="#34d399" />
              100+ Board Questions
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle size={13} color="#34d399" />
              6 Core CPALE Subjects
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle size={13} color="#34d399" />
              PRC BOA Standards
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle size={13} color="#34d399" />
              Detailed Solutions
            </span>
          </div>

        </div>

      </div>
    );
  }

  // ==========================================
  // LOGGED IN DASHBOARD
  // ==========================================
  return (
    <div style={{ minHeight: '100vh', paddingBottom: '5rem' }}>
      
      {/* Welcome & Motivational Quote Header Banner */}
      <section style={{ background: '#140c24', borderBottom: '1px solid #2b1a4a', padding: '1.5rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.2rem' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffc107', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.2rem' }}>
              <Sparkles size={16} />
              <span>Welcome Back, {currentUser.name}!</span>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>
              "{currentQuote.quote}"
            </p>
          </div>

          <button
            onClick={handleNextQuote}
            style={{
              background: '#22163b',
              border: '1px solid #3b2260',
              color: '#cbd5e1',
              borderRadius: '4px',
              padding: '0.4rem 0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontWeight: 600
            }}
          >
            <RefreshCw size={13} />
            <span>Next Quote</span>
          </button>

        </div>
      </section>

      {/* Main Content Area */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem 0' }}>

        {/* Section 1: Select Review Mode */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
              Select Review Mode
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
              Choose your training and mock exam simulation mode
            </p>
          </div>

          <div style={{ fontSize: '0.82rem', color: '#cbd5e1', background: '#19102c', padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid #2b1a4a' }}>
            Examinee: <strong style={{ color: '#ffc107' }}>{currentUser.name}</strong>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.2rem', marginBottom: '3.5rem' }}>
          
          {/* Mock Board Exam Mode */}
          <div 
            onClick={() => setExamMode('mock')}
            className="feature-card"
            style={{
              border: examMode === 'mock' ? '2px solid #ffc107' : '1px solid #2b1a4a',
              background: examMode === 'mock' ? '#22163b' : '#19102c'
            }}
          >
            <div style={{ width: '46px', height: '46px', borderRadius: '8px', background: '#2c1a4b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Award size={24} color="#ffc107" />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>
              Mock Board Exam Mode
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1.2rem' }}>
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
            className="feature-card"
            style={{
              border: examMode === 'practice' ? '2px solid #34d399' : '1px solid #2b1a4a',
              background: examMode === 'practice' ? '#22163b' : '#19102c'
            }}
          >
            <div style={{ width: '46px', height: '46px', borderRadius: '8px', background: '#2c1a4b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <BookOpen size={24} color="#34d399" />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>
              Self-Paced Practice
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1.2rem' }}>
              Learn as you answer with instant step-by-step mathematical computations and statutory legal citations.
            </p>
            <button 
              className="btn btn-primary"
              onClick={(e) => { e.stopPropagation(); setExamMode('practice'); handleStart(); }}
              style={{ width: '100%', fontSize: '0.85rem', background: '#059669', borderColor: '#10b981' }}
            >
              Start Practice Mode
            </button>
          </div>

          {/* Subject & Topic Drill */}
          <div 
            onClick={() => setExamMode('drill')}
            className="feature-card"
            style={{
              border: examMode === 'drill' ? '2px solid #818cf8' : '1px solid #2b1a4a',
              background: examMode === 'drill' ? '#22163b' : '#19102c'
            }}
          >
            <div style={{ width: '46px', height: '46px', borderRadius: '8px', background: '#2c1a4b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Filter size={24} color="#818cf8" />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>
              Subject & Topic Drill
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1.2rem' }}>
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

        {/* Section 2: CPALE Exam Subjects (100 Questions) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
              CPALE Exam Subjects (100 Questions)
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
              Curated question bank with balanced randomized 50-item mock exam sampling
            </p>
          </div>

          <button 
            onClick={() => onNavigate('archive')}
            style={{ background: 'transparent', border: 'none', color: '#ffc107', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer' }}
          >
            <History size={16} />
            <span>View Examinee Archive & Results →</span>
          </button>
        </div>

        {/* Courses Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.2rem', marginBottom: '4rem' }}>
          {subjectSummary.map(subj => (
            <div key={subj.code} className="course-card">
              
              {/* Course Top Bar */}
              <div className="course-img" style={{ background: subjectCoverColors[subj.code] || '#2c1a4b' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#fff', letterSpacing: '1px' }}>
                    {subj.code}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                    Philippine CPA Board Exam
                  </div>
                </div>

                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: '#10081d',
                  color: '#ffc107',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid #38275c'
                }}>
                  {subj.total} Items
                </div>
              </div>

              {/* Course Body */}
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className={`badge badge-${subj.code}`}>{subj.code}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#ffc107', fontSize: '0.78rem', fontWeight: 700 }}>
                      <Star size={13} fill="#ffc107" />
                      <span>5.0</span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', marginBottom: '0.7rem' }}>
                    {subj.name}
                  </h3>

                  {/* Topics Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '1.2rem' }}>
                    {subj.topics && subj.topics.slice(0, 3).map(t => (
                      <span key={t} style={{ fontSize: '0.7rem', color: '#cbd5e1', background: '#22163b', padding: '2px 6px', borderRadius: '4px', border: '1px solid #38275c' }}>
                        {t}
                      </span>
                    ))}
                    {subj.topics && subj.topics.length > 3 && (
                      <span style={{ fontSize: '0.7rem', color: '#ffc107', fontWeight: 700 }}>
                        +{subj.topics.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Course Card Action */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #2b1a4a', paddingTop: '0.9rem', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    Board Standard: <strong>PRC BOA</strong>
                  </span>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleStart(subj.code)}
                    style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}
                  >
                    <span>Practice {subj.code}</span>
                    <ChevronRight size={13} />
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* Section 3: References & Question Bank Sources */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <Library size={22} color="#ffc107" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
              References & Reviewer Sources
            </h2>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            All 100 mock examination questions, mathematical solutions, and statutory citations are curated based on official Philippine standards and authoritative review literature:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {referencesList.map((ref) => (
              <div key={ref.subject} className="reference-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span className={`badge badge-${ref.subject === 'BOA' ? 'FAR' : ref.subject}`}>
                    {ref.subject}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Philippine Standards</span>
                </div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff' }}>
                  {ref.title}
                </h4>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.1rem', margin: '0.3rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {ref.sources.map((src, i) => (
                    <li key={i} style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                      {src}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
