import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Info, X } from 'lucide-react';
import { placeBet } from '../../utils/api';

const initialMatches = [
  { id: 1, teamA: 'Chennai Super Kings', teamB: 'Mumbai Indians', time: 'LIVE', odds: { A: 1.85, X: 3.20, B: 2.10 } },
  { id: 2, teamA: 'Royal Challengers', teamB: 'Kolkata Knight Riders', time: 'Today, 19:30', odds: { A: 1.90, X: 3.00, B: 1.90 } },
  { id: 3, teamA: 'Delhi Capitals', teamB: 'Gujarat Titans', time: 'Tomorrow, 15:00', odds: { A: 2.20, X: 3.10, B: 1.70 } }
];

const IPL = () => {
  const [matches, setMatches] = useState(initialMatches);
  const [betSlip, setBetSlip] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Simulate Live Odds Fluctuation
  useState(() => {
    const interval = setInterval(() => {
      setMatches(prev => prev.map(m => ({
        ...m,
        odds: {
          A: +(m.odds.A + (Math.random() * 0.1 - 0.05)).toFixed(2),
          X: +(m.odds.X + (Math.random() * 0.2 - 0.1)).toFixed(2),
          B: +(m.odds.B + (Math.random() * 0.1 - 0.05)).toFixed(2)
        }
      })));
    }, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const handlePlaceBet = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const gameName = `IPL: ${betSlip.match.teamA} vs ${betSlip.match.teamB} (${betSlip.selection})`;
      await placeBet(betAmount, gameName);
      setMessage(`Bet placed successfully! Potential Win: ₹${(betAmount * betSlip.odds).toFixed(2)}`);
      setBetSlip(null);
      setBetAmount('');
      // Optionally trigger balance update here
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '20px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      
      {/* Matches List */}
      <div style={{ flex: '1 1 600px' }}>
        <h1 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy size={32} className="gradient-text" /> 
          IPL 2026 Betting
        </h1>
        {message && <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-green)', color: 'var(--accent-green)', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>{message}</div>}
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-red)', color: 'var(--accent-red)', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>{error}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {matches.map((match) => (
            <div key={match.id} className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ color: match.time === 'LIVE' ? 'var(--accent-red)' : 'var(--text-muted)', fontWeight: match.time === 'LIVE' ? 'bold' : 'normal' }}>
                  {match.time === 'LIVE' ? '🔴 LIVE' : match.time}
                </span>
                <Info size={16} color="var(--text-muted)" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{match.teamA}</div>
                <div style={{ color: 'var(--text-muted)' }}>VS</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{match.teamB}</div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setBetSlip({ match, selection: match.teamA, odds: match.odds.A })}
                  style={{ flex: 1, padding: '12px', background: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>1</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--accent-green)', fontSize: '1.1rem' }}>{match.odds.A}</span>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setBetSlip({ match, selection: 'Draw', odds: match.odds.X })}
                  style={{ flex: 1, padding: '12px', background: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>X</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--accent-gold)', fontSize: '1.1rem' }}>{match.odds.X}</span>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setBetSlip({ match, selection: match.teamB, odds: match.odds.B })}
                  style={{ flex: 1, padding: '12px', background: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.1rem' }}>{match.odds.B}</span>
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bet Slip Sidebar */}
      <div style={{ flex: '1 1 300px' }}>
        <div className="glass-panel" style={{ padding: '20px', position: 'sticky', top: '90px' }}>
          <h2 style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>Bet Slip</h2>
          
          <AnimatePresence>
            {betSlip ? (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div style={{ background: 'var(--bg-dark)', padding: '16px', borderRadius: '12px', marginBottom: '16px', position: 'relative' }}>
                  <button onClick={() => setBetSlip(null)} style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--text-muted)' }}>
                    <X size={16} />
                  </button>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{betSlip.match.teamA} vs {betSlip.match.teamB}</div>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Pick: {betSlip.selection}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Odds:</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>{betSlip.odds}</span>
                  </div>
                </div>

                <form onSubmit={handlePlaceBet}>
                  <input 
                    type="number" 
                    placeholder="Enter Stake (₹)" 
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="input-field" 
                    style={{ marginBottom: '16px' }}
                    required
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontWeight: 'bold' }}>
                    <span>Potential Return:</span>
                    <span style={{ color: 'var(--accent-green)' }}>
                      ₹{betAmount ? (betAmount * betSlip.odds).toFixed(2) : '0.00'}
                    </span>
                  </div>
                  <button type="submit" className="btn-success" style={{ width: '100%' }}>
                    Place Bet
                  </button>
                </form>
              </motion.div>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px 0' }}>
                Click on the odds to add selections to the bet slip.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default IPL;
