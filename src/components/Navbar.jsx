import React, { useState } from 'react';
import { BookOpen, Award, History, Calculator, User, Sparkles, Heart } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, examineeName, setExamineeName, onOpenCalculator }) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(examineeName);

  const handleSaveName = (e) => {
    e.preventDefault();
    if (tempName.trim()) {
      setExamineeName(tempName.trim());
      localStorage.setItem('cpale_examinee_name', tempName.trim());
    }
    setIsEditingName(false);
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Brand */}
        <div className="nav-brand" onClick={() => setActivePage('home')}>
          <div className="nav-logo-badge">
            <span>CPA</span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>CPALE Portal</span>
              <span style={{ fontSize: '0.7rem', background: '#3b82f6', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>2026</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>Philippine Board Reviewer</div>
          </div>
        </div>

        {/* Navigation buttons */}
        <nav className="nav-links">
          <button 
            className={`nav-btn ${activePage === 'home' ? 'active' : ''}`}
            onClick={() => setActivePage('home')}
          >
            <BookOpen size={16} />
            <span>Dashboard</span>
          </button>

          <button 
            className={`nav-btn ${activePage === 'archive' ? 'active' : ''}`}
            onClick={() => setActivePage('archive')}
            style={{ position: 'relative' }}
          >
            <History size={16} />
            <span>Examinee Results & Archive</span>
            <span style={{ background: '#ec4899', color: 'white', fontSize: '0.65rem', padding: '1px 5px', borderRadius: '999px', fontWeight: 700 }}>
              GF View
            </span>
          </button>

          <button 
            className="nav-btn"
            onClick={onOpenCalculator}
            title="Open Financial & Tax Calculator"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <Calculator size={16} />
            <span>Scratchpad</span>
          </button>
        </nav>

        {/* Examinee Profile Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {isEditingName ? (
            <form onSubmit={handleSaveName} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <input 
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                autoFocus
                placeholder="Examinee name..."
                style={{
                  background: '#1e293b',
                  border: '1px solid #6366f1',
                  color: '#fff',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  outline: 'none',
                  width: '130px'
                }}
              />
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
              >
                Save
              </button>
            </form>
          ) : (
            <div 
              className="examinee-pill" 
              onClick={() => { setTempName(examineeName); setIsEditingName(true); }}
              title="Click to edit examinee name"
              style={{ cursor: 'pointer' }}
            >
              <div className="examinee-avatar">
                {examineeName ? examineeName.charAt(0).toUpperCase() : 'E'}
              </div>
              <span style={{ fontWeight: 600 }}>{examineeName || 'Student'}</span>
              <Heart size={12} color="#ec4899" fill="#ec4899" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
