import React, { useState } from 'react';
import { BookOpen, Award, History, Calculator, User, Sparkles, Heart, LogIn, LogOut, ShieldCheck } from 'lucide-react';

export default function Navbar({
  activePage,
  setActivePage,
  examineeName,
  setExamineeName,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenCalculator
}) {
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

  const isSuperadmin = currentUser && (currentUser.role === 'superadmin' || currentUser.username === 'superadmin');

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
          >
            <History size={16} />
            <span>Examinee Results & Archive</span>
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

        {/* Auth & User Profile Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div className="examinee-pill" style={{ background: isSuperadmin ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.06)', borderColor: isSuperadmin ? '#6366f1' : 'var(--border-color)' }}>
                <div className="examinee-avatar" style={{ background: isSuperadmin ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}>
                  {isSuperadmin ? <ShieldCheck size={14} color="#fff" /> : currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff', lineHeight: '1.2' }}>
                    {currentUser.name}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: isSuperadmin ? '#a5b4fc' : '#94a3b8', fontWeight: 600 }}>
                    {isSuperadmin ? 'Super Admin' : `@${currentUser.username}`}
                  </span>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="nav-btn"
                title="Sign Out"
                style={{ padding: '0.4rem 0.6rem', color: '#f87171' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                className="btn btn-primary"
                onClick={onOpenAuth}
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
              >
                <LogIn size={15} />
                <span>Login / Register</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
