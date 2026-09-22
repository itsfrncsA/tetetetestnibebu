import React, { useEffect, useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

export default function Timer({ durationSeconds, onTimeUp, onTick, isPaused = false }) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);

  useEffect(() => {
    setTimeLeft(durationSeconds);
  }, [durationSeconds]);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) {
      if (timeLeft <= 0 && onTimeUp) onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const nextVal = prev - 1;
        if (onTick) onTick(durationSeconds - nextVal);
        if (nextVal <= 0) {
          clearInterval(interval);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return nextVal;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isPaused, onTimeUp, onTick, durationSeconds]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const isWarning = timeLeft < 600; // Under 10 minutes

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.4rem 0.85rem',
      borderRadius: '999px',
      background: isWarning ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.12)',
      border: `1px solid ${isWarning ? 'rgba(239, 68, 68, 0.4)' : 'rgba(99, 102, 241, 0.3)'}`,
      color: isWarning ? '#fca5a5' : '#a5b4fc',
      fontFamily: 'var(--font-mono)',
      fontWeight: 600,
      fontSize: '0.9rem'
    }}>
      {isWarning ? <AlertCircle size={16} color="#ef4444" /> : <Clock size={16} />}
      <span>
        {hours > 0 ? `${hours}:` : ''}
        {minutes.toString().padStart(2, '0')}:
        {seconds.toString().padStart(2, '0')}
      </span>
      {isPaused && (
        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', background: '#eab308', color: '#000', padding: '1px 5px', borderRadius: '4px', marginLeft: '4px' }}>
          Paused
        </span>
      )}
    </div>
  );
}
