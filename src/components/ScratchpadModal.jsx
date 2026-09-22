import React, { useState } from 'react';
import { X, Calculator, Delete, RotateCcw, FileText } from 'lucide-react';

export default function ScratchpadModal({ isOpen, onClose }) {
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcFormula, setCalcFormula] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleNum = (n) => {
    if (calcDisplay === '0' || calcDisplay === 'Error') {
      setCalcDisplay(n.toString());
    } else {
      setCalcDisplay(calcDisplay + n.toString());
    }
  };

  const handleOp = (op) => {
    setCalcFormula(calcFormula + ' ' + calcDisplay + ' ' + op);
    setCalcDisplay('0');
  };

  const handleClear = () => {
    setCalcDisplay('0');
    setCalcFormula('');
  };

  const handleCalculate = () => {
    try {
      const fullExp = calcFormula + ' ' + calcDisplay;
      // Safe sanitized arithmetic evaluator
      const sanitized = fullExp.replace(/[^0-9+\-*/().]/g, '');
      const result = Function(`'use strict'; return (${sanitized})`)();
      setCalcFormula('');
      setCalcDisplay(Number(result).toLocaleString('en-US', { maximumFractionDigits: 4 }));
    } catch (e) {
      setCalcDisplay('Error');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '680px',
        padding: '1.5rem',
        borderRadius: '16px',
        background: '#111827',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calculator size={20} color="#6366f1" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>CPALE Examinee Financial Calculator & Scratchpad</h3>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          
          {/* Calculator Section */}
          <div style={{ background: '#0b0f19', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'right', minHeight: '18px', overflow: 'hidden' }}>
              {calcFormula}
            </div>
            <div style={{
              fontSize: '1.6rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              textAlign: 'right',
              padding: '0.4rem 0',
              color: '#f8fafc',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              marginBottom: '0.8rem'
            }}>
              {calcDisplay}
            </div>

            {/* Calc Buttons Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
              <button className="btn btn-secondary" onClick={handleClear} style={{ padding: '0.6rem', color: '#f87171' }}>C</button>
              <button className="btn btn-secondary" onClick={() => handleOp('/')} style={{ padding: '0.6rem' }}>÷</button>
              <button className="btn btn-secondary" onClick={() => handleOp('*')} style={{ padding: '0.6rem' }}>×</button>
              <button className="btn btn-secondary" onClick={() => handleOp('-')} style={{ padding: '0.6rem' }}>−</button>

              <button className="btn btn-secondary" onClick={() => handleNum(7)} style={{ padding: '0.6rem' }}>7</button>
              <button className="btn btn-secondary" onClick={() => handleNum(8)} style={{ padding: '0.6rem' }}>8</button>
              <button className="btn btn-secondary" onClick={() => handleNum(9)} style={{ padding: '0.6rem' }}>9</button>
              <button className="btn btn-secondary" onClick={() => handleOp('+')} style={{ padding: '0.6rem' }}>+</button>

              <button className="btn btn-secondary" onClick={() => handleNum(4)} style={{ padding: '0.6rem' }}>4</button>
              <button className="btn btn-secondary" onClick={() => handleNum(5)} style={{ padding: '0.6rem' }}>5</button>
              <button className="btn btn-secondary" onClick={() => handleNum(6)} style={{ padding: '0.6rem' }}>6</button>
              <button className="btn btn-secondary" onClick={() => handleNum('.')} style={{ padding: '0.6rem' }}>.</button>

              <button className="btn btn-secondary" onClick={() => handleNum(1)} style={{ padding: '0.6rem' }}>1</button>
              <button className="btn btn-secondary" onClick={() => handleNum(2)} style={{ padding: '0.6rem' }}>2</button>
              <button className="btn btn-secondary" onClick={() => handleNum(3)} style={{ padding: '0.6rem' }}>3</button>
              <button className="btn btn-primary" onClick={handleCalculate} style={{ padding: '0.6rem', gridColumn: 'span 1' }}>=</button>
              
              <button className="btn btn-secondary" onClick={() => handleNum(0)} style={{ padding: '0.6rem', gridColumn: 'span 2' }}>0</button>
              <button className="btn btn-secondary" onClick={() => handleNum('00')} style={{ padding: '0.6rem', gridColumn: 'span 2' }}>00</button>
            </div>
          </div>

          {/* Working Paper / Scratchpad Section */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                <FileText size={14} />
                <span>Working Notes (Auto-saved)</span>
              </div>
              <button 
                onClick={() => setNotes('')} 
                style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Clear
              </button>
            </div>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Jot down computations, journal entries, or tax rates..."
              style={{
                flex: 1,
                minHeight: '220px',
                background: '#0b0f19',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px',
                color: '#e2e8f0',
                padding: '0.8rem',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-mono)',
                resize: 'none',
                outline: 'none'
              }}
            />
          </div>

        </div>

        {/* Footer info */}
        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
          <button className="btn btn-primary" onClick={onClose} style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
