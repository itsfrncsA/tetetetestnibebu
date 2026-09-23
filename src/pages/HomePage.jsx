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
  ExternalLink,
  Library
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
        'Intermediate Accounting 1, 2, & 3 (Robles & Empleo)'
      ]
    },
    {
      subject: 'AFAR',
      title: 'Advanced Financial Accounting & Reporting',
      sources: [
        'PFRS 3 (Business Combinations), PFRS 10 (Consolidated Financial Statements)',
        'PFRS 15 (Revenue from Contracts with Customers)',
        'Advanced Financial Accounting & Reporting Reviewer (Dayag / De Jesus / Guerrero)',
        'PAS 21 (The Effects of Changes in Foreign Exchange Rates)'
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
        'National Internal Revenue Code (NIRC) of the Philippines as amended by RA 10963 (TRAIN Law)',
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

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '5rem' }}>
      
      {/* Top Banner Bar */}
      <section style={{ background: '#160e26', borderBottom: '1px solid #2c1c4d', padding: '1.75rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: '#261840', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #38275c' }}>
              <GraduationCap size={22} color="#ffc107" />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>+50 Board Questions</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Mock questions in 6 CPALE subjects</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: '#261840', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #38275c' }}>
              <Award size={22} color="#34d399" />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>PRC BOA Standards</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>75% General Average & 65% Rule</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: '#261840', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #38275c' }}>
              <Target size={22} color="#818cf8" />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>Focus on Target</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Math solutions & statutory citations</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: '#261840', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #38275c' }}>
              <Calculator size={22} color="#fb7185" />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>Real-time Scratchpad</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Financial and tax calculator</div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem 0' }}>

        {/* Section 1: Select Review Mode */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
              Select Review Mode
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Choose your training and mock exam simulation mode
            </p>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#cbd5e1', background: '#1c1230', padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid #2c1c4d' }}>
            Examinee: <strong style={{ color: '#ffc107' }}>{currentUser ? currentUser.name : 'Guest User'}</strong>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '3.5rem' }}>
          
          {/* Mock Board Exam Mode */}
          <div 
            onClick={() => setExamMode('mock')}
            className="udema-feature-card"
            style={{
              border: examMode === 'mock' ? '2px solid #ffc107' : '1px solid #2c1c4d',
              background: examMode === 'mock' ? '#261840' : '#1c1230'
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#341a5c', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
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
            className="udema-feature-card"
            style={{
              border: examMode === 'practice' ? '2px solid #34d399' : '1px solid #2c1c4d',
              background: examMode === 'practice' ? '#261840' : '#1c1230'
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#341a5c', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
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
            className="udema-feature-card"
            style={{
              border: examMode === 'drill' ? '2px solid #818cf8' : '1px solid #2c1c4d',
              background: examMode === 'drill' ? '#261840' : '#1c1230'
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#341a5c', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
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

        {/* Section 2: CPALE Exam Subjects (50 Items) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
              CPALE Exam Subjects (50 Items)
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Curated board questions with full computations and legal references
            </p>
          </div>

          <button 
            onClick={() => onNavigate('archive')}
            style={{ background: 'transparent', border: 'none', color: '#ffc107', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}
          >
            <History size={16} />
            <span>View Examinee Archive & Results →</span>
          </button>
        </div>

        {/* Courses Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem', marginBottom: '4rem' }}>
          {subjectSummary.map(subj => (
            <div key={subj.code} className="udema-course-card">
              
              {/* Course Top Bar */}
              <div className="udema-course-img" style={{ background: subjectCoverColors[subj.code] || '#341a5c' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', letterSpacing: '1px' }}>
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
                  background: '#120a22',
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
                      <span key={t} style={{ fontSize: '0.7rem', color: '#cbd5e1', background: '#261840', padding: '2px 6px', borderRadius: '4px', border: '1px solid #38275c' }}>
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #2c1c4d', paddingTop: '0.9rem', marginTop: '0.5rem' }}>
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
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
              References & Reviewer Sources
            </h2>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            All 50 mock examination questions, mathematical solutions, and statutory citations are curated based on official Philippine standards and authoritative review literature:
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
