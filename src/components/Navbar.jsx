import React from 'react';
import { 
  BookOpen, 
  Award, 
  History, 
  Calculator, 
  User, 
  LogIn, 
  LogOut, 
  ShieldCheck,
  Search,
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
        {/* Udema Brand Logo */}
        <div className="nav-brand" onClick={() => setActivePage('home')}>
          <div className="nav-logo-badge">
            <GraduationCap size={22} color="#171128" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontWeight: 900, letterSpacing: '0.5px' }}>UDEMA</span>
              <span style={{ fontSize: '0.65rem', background: '#ffc107', color: '#171128', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>CPALE 2026</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500 }}>Philippine Board Reviewer Portal</div>
          </div>
        </div>

        {/* Navigation links */}
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
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <Calculator size={16} />
            <span>Scratchpad</span>
          </button>
        </nav>

        {/* Right CTA & Auth Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          
          {/* Gold Admission / Quick Mock Exam Button */}
          <button 
            className="btn btn-gold"
            onClick={() => {
              setActivePage('home');
              window.scrollTo({ top: 350, behavior: 'smooth' });
            }}
            style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}
          >
            MOCK EXAM
          </button>

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="examinee-pill" style={{ background: isSuperadmin ? 'rgba(107, 59, 168, 0.4)' : 'rgba(255, 255, 255, 0.08)', borderColor: isSuperadmin ? '#ffc107' : 'var(--border-color)' }}>
                <div className="examinee-avatar">
                  {isSuperadmin ? <ShieldCheck size={14} color="#171128" /> : currentUser.name.charAt(0).toUpperCase()}
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
          ) : (
            <button
              className="btn btn-secondary"
              onClick={onOpenAuth}
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
            >
              <LogIn size={15} />
              <span>Login</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
