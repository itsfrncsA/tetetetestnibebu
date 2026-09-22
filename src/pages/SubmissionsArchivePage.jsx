import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Eye, 
  Trash2, 
  Award, 
  Clock, 
  Calendar, 
  User, 
  Heart, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { apiService } from '../services/api';

export default function SubmissionsArchivePage({ 
  onInspectSubmission, 
  onStartNewExam 
}) {
  const [submissions, setSubmissions] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchHistory = () => {
    setLoading(true);
    apiService.getExamHistory(searchName)
      .then(res => {
        if (res && res.data) {
          setSubmissions(res.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHistory();
  }, [searchName]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Delete this exam record?')) {
      await apiService.deleteExam(id);
      fetchHistory();
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#ec4899', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            <Heart size={16} fill="#ec4899" />
            <span>Examinee Result & Answer Review Archive</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
            Examinee Performance Archive
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            View and inspect all past exam submissions, test ratings, and item-by-item answer breakdown.
          </p>
        </div>

        <button className="btn btn-primary" onClick={onStartNewExam}>
          + Take New Exam
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <Search size={18} color="#94a3b8" />
        <input 
          type="text"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="Filter by Examinee Name (e.g. your girlfriend's name)..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '0.95rem',
            outline: 'none'
          }}
        />
        {searchName && (
          <button 
            onClick={() => setSearchName('')} 
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            Clear
          </button>
        )}
        <button 
          onClick={fetchHistory}
          style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#cbd5e1', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}
        >
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Submissions List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          Loading submissions...
        </div>
      ) : submissions.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <History size={48} color="#64748b" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f8fafc' }}>
            No Exam Submissions Found
          </h3>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            {searchName ? `No results found for "${searchName}".` : 'No exam attempts have been recorded yet. Start an exam to see results and answers here!'}
          </p>
          <button className="btn btn-primary" onClick={onStartNewExam}>
            Start First Exam
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {submissions.map((sub) => {
            const isPassed = sub.status === 'PASSED';
            const isConditional = sub.status === 'CONDITIONAL';
            const statusColor = isPassed ? '#10b981' : isConditional ? '#f59e0b' : '#ef4444';
            const statusBg = isPassed ? 'rgba(16, 185, 129, 0.15)' : isConditional ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)';

            return (
              <div 
                key={sub._id || sub.id} 
                className="glass-panel"
                onClick={() => onInspectSubmission(sub._id || sub.id)}
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              >
                {/* Left: Examinee info & Date */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '240px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    color: '#fff',
                    fontSize: '1.1rem'
                  }}>
                    {sub.examineeName ? sub.examineeName.charAt(0).toUpperCase() : 'E'}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>
                      <span>{sub.examineeName || 'Examinee'}</span>
                      <Heart size={14} color="#ec4899" fill="#ec4899" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Calendar size={12} />
                        {new Date(sub.createdAt).toLocaleDateString()} {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span>•</span>
                      <span style={{ textTransform: 'capitalize' }}>{sub.mode} Mode</span>
                    </div>
                  </div>
                </div>

                {/* Middle: Score & Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Score</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                      {sub.score} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>/ {sub.totalQuestions}</span>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Rating</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: statusColor, fontFamily: 'var(--font-mono)' }}>
                      {sub.generalAverage}%
                    </div>
                  </div>

                  <div>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.3rem 0.9rem',
                      borderRadius: '999px',
                      background: statusBg,
                      color: statusColor,
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      letterSpacing: '0.5px'
                    }}>
                      {sub.status}
                    </span>
                  </div>
                </div>

                {/* Right: Inspect Button & Delete */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => onInspectSubmission(sub._id || sub.id)}
                    style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
                  >
                    <Eye size={15} />
                    <span>Inspect Answers</span>
                  </button>

                  <button 
                    onClick={(e) => handleDelete(e, sub._id || sub.id)}
                    style={{ background: 'transparent', border: 'none', color: '#64748b', padding: '6px', cursor: 'pointer' }}
                    title="Delete record"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
