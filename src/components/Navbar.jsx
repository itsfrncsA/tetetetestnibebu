import React from 'react';
import { 
  BookOpen, 
  History, 
  Calculator, 
  User, 
  LogIn, 
  LogOut, 
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

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
  const isSuperadmin = currentUser && (currentUser.role === 'superadmin' || currentUser.username === 'superadmin');

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Brand Logo */}
        <div className="nav-brand" onClick={() => setActivePage('home')}>
          <div className="nav-logo-badge">
            <GraduationCap size={22} color="#120a22" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontWeight: 900, letterSpacing: '0.5px' }}>Reviewer</span>
              <span style={{ fontSize: '0.65rem', background: '#ffc107', color: '#120a22', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>2026</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500 }}>Personal Board Reviewer</div>
          </div>
        </div>

        {/* Navigation links (only when logged in) */}
        {currentUser ? (
          <nav className="nav-links">
            <button
              className={`nav-btn ${activePage === 'home' ? 'active' : ''}`}
              onClick={() => setActivePage('home')}
            >
              <BookOpen size={16} />
              <span>Courses & Drills</span>
            </button>

            <button
              className={`nav-btn ${activePage === 'archive' ? 'active' : ''}`}
              onClick={() => setActivePage('archive')}
            >
              <History size={16} />
              <span>Examinee Archive</span>
            </button>

            <button
              className="nav-btn"
              onClick={onOpenCalculator}
              title="Open Financial & Tax Calculator"
            >
              <Calculator size={16} />
              <span>Scratchpad</span>
            </button>
          </nav>
        ) : null}

        {/* Right CTA & Auth Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          
          {currentUser ? (
            <>
              {/* Quick Mock Exam Button for Logged in Users */}
              <button 
                className="btn btn-gold"
                onClick={() => {
                  setActivePage('home');
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}
              >
                MOCK EXAM
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="examinee-pill" style={{ background: isSuperadmin ? 'rgba(81, 38, 143, 0.4)' : '#1c1230', borderColor: isSuperadmin ? '#ffc107' : 'var(--border-color)' }}>
                  <div className="examinee-avatar">
                    {isSuperadmin ? <ShieldCheck size={14} color="#120a22" /> : currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#fff', lineHeight: '1.2' }}>
                      {currentUser.name}
                    </span>
                    <span style={{ fontSize: '0.62rem', color: isSuperadmin ? '#ffc107' : '#cbd5e1', fontWeight: 700 }}>
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
            </>
          ) : (
            <button
              className="btn btn-gold"
              onClick={onOpenAuth}
              style={{ padding: '0.5rem 1.2rem', fontSize: '0.88rem' }}
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
