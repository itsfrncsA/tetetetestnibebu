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
      <div style={{ minHeight: '85vh', padding: '3rem 1.5rem 5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* Top Hero Section */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            
            {/* Top Announcement Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#19102c',
              border: '1px solid #38245c',
              borderRadius: '9999px',
              padding: '0.35rem 1rem',
              fontSize: '0.8rem',
              color: '#ffc107',
              fontWeight: 700,
              marginBottom: '1.5rem'
            }}>
              <GraduationCap size={16} color="#ffc107" />
              <span>Philippine Certified Public Accountant Licensure Exam (CPALE) 2026</span>
            </div>

            <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px', marginBottom: '0.75rem', lineHeight: 1.2 }}>
              Master the Board Exam with Confidence
            </h1>
            
            <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '720px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
              A dedicated personal reviewer featuring 100+ verified CPALE questions, balanced 50-item mock simulations, step-by-step mathematical computations, and statutory legal citations.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <button
                onClick={onOpenAuth}
                className="btn btn-gold"
                style={{
                  padding: '0.9rem 2.5rem',
                  fontSize: '1rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  boxShadow: '0 4px 20px rgba(255, 193, 7, 0.25)'
                }}
              >
                <LogIn size={18} />
                <span>Sign In to Start Review</span>
              </button>

              <button
                onClick={onOpenAuth}
                className="btn btn-secondary"
                style={{
                  padding: '0.9rem 1.8rem',
                  fontSize: '0.95rem',
                  fontWeight: 700
                }}
              >
                <BookOpen size={18} color="#cbd5e1" />
                <span>Create Student Account</span>
              </button>
            </div>

            {/* Highlights Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', color: '#cbd5e1', fontSize: '0.82rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#19102c', border: '1px solid #2b1a4a', padding: '0.4rem 0.85rem', borderRadius: '6px' }}>
                <CheckCircle size={15} color="#10b981" />
                <strong>100+ Board Questions</strong>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#19102c', border: '1px solid #2b1a4a', padding: '0.4rem 0.85rem', borderRadius: '6px' }}>
                <CheckCircle size={15} color="#10b981" />
                <strong>PRC BOA 75% Standards</strong>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#19102c', border: '1px solid #2b1a4a', padding: '0.4rem 0.85rem', borderRadius: '6px' }}>
                <CheckCircle size={15} color="#10b981" />
                <strong>Step-by-Step Math Solutions</strong>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#19102c', border: '1px solid #2b1a4a', padding: '0.4rem 0.85rem', borderRadius: '6px' }}>
                <CheckCircle size={15} color="#10b981" />
                <strong>Statutory Law Citations</strong>
              </span>
            </div>

          </div>

          {/* Solid Motivational Quote Card */}
          <div style={{
            background: '#19102c',
            border: '1px solid #2b1a4a',
            borderTop: '3px solid #ffc107',
            borderRadius: '12px',
            padding: '1.75rem 2rem',
            textAlign: 'center',
            marginBottom: '3.5rem',
            boxShadow: '0 6px 24px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <Quote size={24} color="#ffc107" />
            </div>

            <p style={{ fontSize: '1.05rem', fontStyle: 'italic', color: '#f8fafc', lineHeight: 1.6, marginBottom: '0.8rem', fontWeight: 500 }}>
              "{currentQuote.quote}"
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
              <span style={{ fontSize: '0.82rem', color: '#ffc107', fontWeight: 700 }}>
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
                  padding: '3px 9px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                <RefreshCw size={12} />
                <span>Shuffle</span>
              </button>
            </div>
          </div>

          {/* Feature Highlights (4 Solid Cards) */}
          <div style={{ marginBottom: '3.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
                Engineered for CPALE Board Exam Success
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                Key features designed to simulate real exam pressure and provide thorough understanding
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
              <div style={{ background: '#19102c', border: '1px solid #2b1a4a', borderRadius: '10px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#2c1a4b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Award size={22} color="#ffc107" />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>
                  Mock Exam Simulation
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  Balanced 50-item randomized test across all 6 subjects with a 3-hour timer, question flags, and instant PRC passing scorecard.
                </p>
              </div>

              <div style={{ background: '#19102c', border: '1px solid #2b1a4a', borderRadius: '10px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#2c1a4b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Calculator size={22} color="#34d399" />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>
                  Step-by-Step Math
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  Every quantitative question in FAR, AFAR, and MAS features exhaustive line-by-line calculations and balance proofs.
                </p>
              </div>

              <div style={{ background: '#19102c', border: '1px solid #2b1a4a', borderRadius: '10px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#2c1a4b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Scale size={22} color="#f43f5e" />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>
                  Updated Philippine Laws
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  Fully compliant with RA 11976 (Ease of Paying Taxes Act), CREATE Act, Revised Corporation Code, and latest PFRS/PSA standards.
                </p>
              </div>

              <div style={{ background: '#19102c', border: '1px solid #2b1a4a', borderRadius: '10px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#2c1a4b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <ShieldCheck size={22} color="#818cf8" />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>
                  Auto-Saved Progress
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  Session persistence ensures your active examination answers and timer are never lost if you accidentally refresh.
                </p>
              </div>
            </div>
          </div>

          {/* 6 Core Subjects Grid */}
          <div style={{ marginBottom: '3.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
                  6 CPALE Core Review Subjects
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                  Total of 100 questions covering the full PRC Board Table of Specifications (TOS)
                </p>
              </div>

              <button
                onClick={onOpenAuth}
                style={{ background: 'transparent', border: 'none', color: '#ffc107', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <span>Sign in to practice subjects</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.2rem' }}>
              {[
                { 
                  code: 'FAR', 
                  name: 'Financial Accounting and Reporting', 
                  items: '20 Questions', 
                  border: '#3b82f6', 
                  topics: ['PFRS 15 Revenue', 'PFRS 16 Leases', 'PAS 16 PPE & Depreciation', 'PAS 2 Inventories (FIFO/AVCO)'] 
                },
                { 
                  code: 'AFAR', 
                  name: 'Advanced Financial Accounting & Reporting', 
                  items: '20 Questions', 
                  border: '#10b981', 
                  topics: ['PFRS 3 Business Combinations', 'Goodwill Computation', 'PFRS 10 Consolidations', 'PAS 21 Forex & Derivatives'] 
                },
                { 
                  code: 'MAS', 
                  name: 'Management Advisory Services', 
                  items: '16 Questions', 
                  border: '#f59e0b', 
                  topics: ['Cost-Volume-Profit (CVP)', 'Break-even Point Analysis', 'Operating Leverage', 'Standard Cost Variances'] 
                },
                { 
                  code: 'AUD', 
                  name: 'Auditing (Theory & Problems)', 
                  items: '16 Questions', 
                  border: '#a855f7', 
                  topics: ['PSA 700 Auditor Reports', 'Audit Risk Model (AAR = IR × CR × DR)', 'Substantive Testing', 'Internal Controls'] 
                },
                { 
                  code: 'TAX', 
                  name: 'Taxation (TRAIN, CREATE, EOPT)', 
                  items: '14 Questions', 
                  border: '#f43f5e', 
                  topics: ['RA 11976 (EOPT Act)', 'CREATE Act 20%/25% CIT', '12% VAT Computation', 'Capital Gains & Income Tax'] 
                },
                { 
                  code: 'RFBT', 
                  name: 'Regulatory Framework for Business Transactions', 
                  items: '14 Questions', 
                  border: '#06b6d4', 
                  topics: ['Revised Corporation Code (RA 11232)', 'Obligations & Contracts', 'Law on Sales & Partnerships', 'AMLA (RA 9160)'] 
                }
              ].map(s => (
                <div key={s.code} style={{
                  background: '#19102c',
                  border: '1px solid #2b1a4a',
                  borderTop: `3px solid ${s.border}`,
                  borderRadius: '10px',
                  padding: '1.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                      <span className={`badge badge-${s.code}`}>{s.code}</span>
                      <span style={{ fontSize: '0.78rem', color: s.border, fontWeight: 700, background: '#120a22', padding: '2px 8px', borderRadius: '4px', border: '1px solid #2b1a4a' }}>
                        {s.items}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', marginBottom: '0.8rem' }}>
                      {s.name}
                    </h3>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.2rem' }}>
                      {s.topics.map((t, idx) => (
                        <span key={idx} style={{ fontSize: '0.72rem', color: '#cbd5e1', background: '#24163f', padding: '2px 7px', borderRadius: '4px', border: '1px solid #38275c' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={onOpenAuth}
                    className="btn btn-secondary"
                    style={{ width: '100%', fontSize: '0.82rem', padding: '0.5rem', display: 'flex', justifyContent: 'center' }}
                  >
                    <span>Sign In to Start {s.code}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Official PRC BOA Grading Standard */}
          <div style={{
            background: '#140c24',
            border: '1px solid #2b1a4a',
            borderRadius: '12px',
            padding: '1.75rem 2rem',
            marginBottom: '3rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <Scale size={22} color="#ffc107" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                PRC Board of Accountancy (BOA) Passing Criteria
              </h3>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              Under Republic Act No. 9298 (Philippine Accountancy Act of 2004), a candidate is rated under the following official standard:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div style={{ background: '#19102c', border: '1px solid #2b1a4a', borderLeft: '3px solid #10b981', padding: '1rem', borderRadius: '6px' }}>
                <div style={{ color: '#34d399', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.2rem' }}>PASSED</div>
                <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                  General Weighted Average (GWA) ≥ 75.00% AND no grade lower than 65.00% in any subject.
                </div>
              </div>

              <div style={{ background: '#19102c', border: '1px solid #2b1a4a', borderLeft: '3px solid #f59e0b', padding: '1rem', borderRadius: '6px' }}>
                <div style={{ color: '#fbbf24', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.2rem' }}>CONDITIONED</div>
                <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                  Obtained a general average of ≥ 75.00% but scored below 65.00% in not more than 2 subjects.
                </div>
              </div>

              <div style={{ background: '#19102c', border: '1px solid #2b1a4a', borderLeft: '3px solid #ef4444', padding: '1rem', borderRadius: '6px' }}>
                <div style={{ color: '#f87171', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.2rem' }}>FAILED</div>
                <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                  General average &lt; 75.00%, or obtained below 65.00% in 3 or more subjects.
                </div>
              </div>
            </div>
          </div>

          {/* References & Reviewer Sources Preview */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <Library size={20} color="#ffc107" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                Official Philippine Reviewer References
              </h3>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              All questions adhere to PRC BOA Table of Specifications, Valix, Robles & Empleo, Dayag, Cabrera, PSA, NIRC (TRAIN/CREATE/EOPT), and RA 11232.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0.85rem' }}>
              {referencesList.slice(0, 6).map(ref => (
                <div key={ref.subject} className="reference-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span className={`badge badge-${ref.subject}`}>{ref.subject}</span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Philippine Standards</span>
                  </div>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>{ref.title}</h4>
                  <p style={{ fontSize: '0.75rem', color: '#cbd5e1', margin: 0 }}>
                    {ref.sources[0]}
                  </p>
                </div>
              ))}
            </div>
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
