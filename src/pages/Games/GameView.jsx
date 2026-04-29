import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, AlertCircle, TrendingUp, Dice5, Target, Zap } from 'lucide-react';
import { placeBet, processWin, getBalance } from '../../utils/api';

const GameView = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  
  // Generic State
  const [betAmount, setBetAmount] = useState(100);
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isGameRunning, setIsGameRunning] = useState(false);

  useEffect(() => {
    getBalance().then(data => setBalance(data.balance)).catch(() => {});
  }, []);

  // --- GAME LOGIC STATES ---
  
  // Aviator & Crash
  const [multiplier, setMultiplier] = useState(1.00);
  
  // Color Trading
  const [selectedColor, setSelectedColor] = useState(null);
  const [colorResult, setColorResult] = useState(null);
  const [countdown, setCountdown] = useState(10);
  
  // Roulette & Wheel
  const [spinning, setSpinning] = useState(false);
  const [selectedBet, setSelectedBet] = useState(null);
  const [spinResult, setSpinResult] = useState(null);

  // Mines
  const [minesGrid, setMinesGrid] = useState(Array(25).fill({ revealed: false, isMine: false }));
  const [minesCashedOut, setMinesCashedOut] = useState(false);

  // Dice
  const [diceResult, setDiceResult] = useState(null);

  // --- GAME LOGIC HANDLERS ---

  // Crash / Aviator Logic
  useEffect(() => {
    let interval;
    if (isGameRunning && (gameId === 'aviator' || gameId === 'crash')) {
      interval = setInterval(() => {
        setMultiplier(prev => {
          const crashThreshold = Math.random() * 10 + 1.1; // Random crash point
          if (prev > crashThreshold) {
            setIsGameRunning(false);
            setError('CRASHED! Better luck next time.');
            return 1.00;
          }
          return prev + (prev * 0.02); // Exponential growth
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isGameRunning, gameId]);

  const startCrashGame = async () => {
    setError(''); setMessage('');
    try {
      const data = await placeBet(betAmount, gameId.toUpperCase());
      setBalance(data.balance);
      setIsGameRunning(true);
      setMultiplier(1.00);
    } catch (err) { setError(err.message); }
  };

  const cashOutCrash = async () => {
    if (!isGameRunning) return;
    const winAmount = betAmount * multiplier;
    setIsGameRunning(false);
    try {
      const data = await processWin(winAmount, `${gameId.toUpperCase()} Cashout ${multiplier.toFixed(2)}x`);
      setBalance(data.balance);
      setMessage(`WON ₹${winAmount.toFixed(2)} at ${multiplier.toFixed(2)}x!`);
    } catch (err) { setError(err.message); }
  };

  // Dice Logic
  const rollDice = async (guess) => {
    setError(''); setMessage('');
    try {
      const data = await placeBet(betAmount, 'DICE');
      setBalance(data.balance);
      setIsGameRunning(true);
      
      setTimeout(async () => {
        const roll = Math.floor(Math.random() * 6) + 1;
        setDiceResult(roll);
        setIsGameRunning(false);

        const isWin = (guess === 'high' && roll > 3) || (guess === 'low' && roll <= 3);
        if (isWin) {
          const winAmount = betAmount * 1.9;
          const winData = await processWin(winAmount, 'DICE WIN');
          setBalance(winData.balance);
          setMessage(`Rolled ${roll}! YOU WON ₹${winAmount.toFixed(2)}`);
        } else {
          setError(`Rolled ${roll}. YOU LOST!`);
        }
      }, 1000);
    } catch (err) { setError(err.message); }
  };

  // Slots Logic
  const [slotReels, setSlotReels] = useState(['7', '7', '7']);
  const [isSpinning, setIsSpinning] = useState(false);
  const slotSymbols = ['7', '💎', '🍒', '🔔', 'BAR'];

  const spinSlots = async () => {
    setError(''); setMessage('');
    try {
      const data = await placeBet(betAmount, 'SLOTS');
      setBalance(data.balance);
      setIsSpinning(true);
      
      let spinCount = 0;
      const interval = setInterval(() => {
        setSlotReels([
          slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
          slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
          slotSymbols[Math.floor(Math.random() * slotSymbols.length)]
        ]);
        spinCount++;
        if (spinCount > 20) {
          clearInterval(interval);
          finishSlots();
        }
      }, 50);
    } catch (err) { setError(err.message); }
  };

  const finishSlots = async () => {
    setIsSpinning(false);
    const [s1, s2, s3] = [
      slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
      slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
      slotSymbols[Math.floor(Math.random() * slotSymbols.length)]
    ];
    setSlotReels([s1, s2, s3]);

    if (s1 === s2 && s2 === s3) {
      const multipliers = { '7': 50, '💎': 20, '🍒': 10, '🔔': 5, 'BAR': 2 };
      const winAmount = betAmount * (multipliers[s1] || 2);
      const data = await processWin(winAmount, 'SLOTS WIN');
      setBalance(data.balance);
      setMessage(`JACKPOT! You won ₹${winAmount.toFixed(2)}`);
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
      const winAmount = betAmount * 1.5;
      const data = await processWin(winAmount, 'SLOTS MINI WIN');
      setBalance(data.balance);
      setMessage(`Mini Win! You won ₹${winAmount.toFixed(2)}`);
    } else {
      setError('Better luck next time!');
    }
  };
  const [colorHistory, setColorHistory] = useState(['red', 'green', 'red', 'violet', 'green']);
  
  const startColorGame = async (selection) => {
    setError(''); setMessage('');
    try {
      const data = await placeBet(betAmount, 'COLOR TRADING');
      setBalance(data.balance);
      setIsGameRunning(true);
      setCountdown(5); // Fast 5-sec countdown for demo
      setSelectedColor(selection);
    } catch (err) { setError(err.message); }
  };

  useEffect(() => {
    let timer;
    if (isGameRunning && gameId === 'color-trading' && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown === 0 && isGameRunning && gameId === 'color-trading') {
      setIsGameRunning(false);
      const colors = ['red', 'green', 'violet'];
      const result = colors[Math.floor(Math.random() * colors.length)];
      setColorResult(result);
      setColorHistory(prev => [result, ...prev].slice(0, 10));

      const isWin = selectedColor === result || 
                    (selectedColor === 'red' && result === 'violet') || 
                    (selectedColor === 'green' && result === 'violet');

      if (isWin) {
        const winAmount = betAmount * (result === 'violet' ? 4.5 : 2);
        processWin(winAmount, 'COLOR WIN').then(data => {
          setBalance(data.balance);
          setMessage(`Result: ${result.toUpperCase()}! YOU WON ₹${winAmount.toFixed(2)}`);
        });
      } else {
        setError(`Result: ${result.toUpperCase()}. YOU LOST!`);
      }
    }
    return () => clearInterval(timer);
  }, [countdown, isGameRunning, gameId, selectedColor, betAmount]);
  const spinWheel = async () => {
    if (!selectedBet) return setError('Select a multiplier first!');
    setError(''); setMessage('');
    try {
      const data = await placeBet(betAmount, 'LUCKY WHEEL');
      setBalance(data.balance);
      setSpinning(true);

      setTimeout(async () => {
        setSpinning(false);
        const options = [0, 2, 5, 0, 10, 2, 0, 50]; // Multipliers
        const result = options[Math.floor(Math.random() * options.length)];
        setSpinResult(result);

        if (result > 0) {
          const winAmount = betAmount * result;
          const winData = await processWin(winAmount, `WHEEL WIN ${result}x`);
          setBalance(winData.balance);
          setMessage(`Landed on ${result}x! YOU WON ₹${winAmount.toFixed(2)}`);
        } else {
          setError('Landed on 0. Try again!');
        }
      }, 2000);
    } catch (err) { setError(err.message); }
  };

  // Mines Logic
  const startMines = async () => {
    setError(''); setMessage('');
    try {
      const data = await placeBet(betAmount, 'MINES');
      setBalance(data.balance);
      setMinesGrid(Array(25).fill({ revealed: false, isMine: false }));
      setIsGameRunning(true);
      setMinesCashedOut(false);
    } catch (err) { setError(err.message); }
  };

  const handleMineClick = (index) => {
    if (!isGameRunning || minesCashedOut) return;
    const isMine = Math.random() < 0.15; // 15% mine chance
    const newGrid = [...minesGrid];
    newGrid[index] = { revealed: true, isMine };
    setMinesGrid(newGrid);
    if (isMine) {
      setIsGameRunning(false);
      setError('BOOM! Game Over.');
    }
  };

  const cashOutMines = async () => {
    const revealedCount = minesGrid.filter(c => c.revealed && !c.isMine).length;
    if (revealedCount === 0) return;
    const winAmount = betAmount * (1 + (revealedCount * 0.3));
    setIsGameRunning(false);
    setMinesCashedOut(true);
    try {
      const data = await processWin(winAmount, 'MINES CASHOUT');
      setBalance(data.balance);
      setMessage(`Cashed out ₹${winAmount.toFixed(2)}!`);
    } catch (err) { setError(err.message); }
  };

  const gameTitles = {
    'aviator': 'Aviator',
    'crash': 'Crash Game',
    'dice': 'Dice Game',
    'lucky-wheel': 'Lucky Wheel',
    'slots': 'Casino Slots',
    'mines': 'Mines Game',
    'color-trading': 'Color Trading',
    'roulette': 'Roulette',
    'casino': 'Live Casino'
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '24px', background: 'none', border: 'none', cursor: 'pointer' }}>
        <ArrowLeft size={20} /> Back to Lobby
      </button>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card-hover)', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ margin: 0 }}>{gameTitles[gameId] || 'Game'}</h2>
          <div style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>₹ {(balance || 0).toLocaleString()}</div>
        </div>

        {/* Message Banner */}
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)', padding: '10px', textAlign: 'center' }}>{error}</div>}
        {message && <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)', padding: '10px', textAlign: 'center' }}>{message}</div>}

        {/* Dynamic Game Viewport */}
        <div style={{ height: '400px', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          
          {/* AVIATOR / CRASH */}
          {(gameId === 'aviator' || gameId === 'crash') && (
            <div style={{ width: '100%', height: '100%', position: 'relative', background: 'radial-gradient(circle at center, #1a1a2e 0%, #0a0a0a 100%)' }}>
              {/* Grid Background */}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              
              <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div
                  animate={isGameRunning ? { 
                    y: [0, -2, 2, 0],
                    filter: ['drop-shadow(0 0 10px #ef4444)', 'drop-shadow(0 0 20px #ef4444)', 'drop-shadow(0 0 10px #ef4444)']
                  } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                  style={{ fontSize: '4rem', marginBottom: '20px', color: '#ef4444' }}
                >
                  <Zap size={80} strokeWidth={2.5} fill="#ef4444" />
                </motion.div>
                
                <h1 style={{ 
                  fontSize: '5rem', 
                  fontWeight: '900', 
                  fontFamily: 'monospace',
                  color: isGameRunning ? 'var(--accent-green)' : 'var(--accent-red)',
                  textShadow: isGameRunning ? '0 0 20px rgba(16, 185, 129, 0.5)' : '0 0 20px rgba(239, 68, 68, 0.5)'
                }}>
                  {(multiplier || 1).toFixed(2)}x
                </h1>
                
                {isGameRunning && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '80%' }}
                    style={{ height: '4px', background: 'linear-gradient(90deg, transparent, var(--primary), transparent)', borderRadius: '2px', marginTop: '20px' }}
                  />
                )}
              </div>
            </div>
          )}

          {/* DICE */}
          {gameId === 'dice' && (
            <div style={{ textAlign: 'center', background: 'radial-gradient(circle, #1e1b4b 0%, #0a0a0a 100%)', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div
                animate={isGameRunning ? { 
                  rotateX: [0, 360, 720],
                  rotateY: [0, 360, 720],
                  scale: [1, 1.2, 1]
                } : { rotate: 0 }}
                transition={{ duration: 0.6, repeat: isGameRunning ? Infinity : 0 }}
                style={{ 
                  width: '120px', 
                  height: '120px', 
                  background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)', 
                  borderRadius: '24px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                {!isGameRunning && diceResult && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', padding: '15px' }}>
                    {[...Array(diceResult)].map((_, i) => (
                      <div key={i} style={{ width: '15px', height: '15px', borderRadius: '50%', background: 'white', boxShadow: '0 0 10px white' }} />
                    ))}
                  </div>
                )}
                {isGameRunning && <Dice5 size={60} color="white" />}
              </motion.div>
              {diceResult && !isGameRunning && (
                <motion.h2 
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  style={{ marginTop: '32px', fontSize: '4rem', fontWeight: 'bold', color: 'white' }}
                >
                  {diceResult}
                </motion.h2>
              )}
            </div>
          )}

          {/* LUCKY WHEEL */}
          {gameId === 'lucky-wheel' && (
            <div style={{ textAlign: 'center' }}>
              <motion.div
                animate={{ rotate: spinning ? 1800 : 0 }}
                transition={{ duration: 2, ease: "circOut" }}
                style={{ width: '250px', height: '250px', borderRadius: '50%', border: '8px solid var(--border-color)', background: 'conic-gradient(red, orange, yellow, green, blue, indigo, violet, red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <div style={{ width: '60px', height: '60px', background: 'white', borderRadius: '50%', color: 'black', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>WHEEL</div>
              </motion.div>
              <div style={{ position: 'absolute', top: '50px', fontSize: '2rem' }}>★</div>
            </div>
          )}

          {/* SLOTS */}
          {gameId === 'slots' && (
            <div style={{ width: '100%', padding: '40px', background: 'linear-gradient(to bottom, #2d3748, #1a202c)' }}>
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                {slotReels.map((symbol, i) => (
                  <motion.div
                    key={i}
                    animate={isSpinning ? { y: [0, -20, 20, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 0.1 }}
                    style={{ 
                      width: '100px', 
                      height: '140px', 
                      background: 'white', 
                      borderRadius: '15px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '3.5rem',
                      boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2), 0 10px 20px rgba(0,0,0,0.5)',
                      border: '4px solid #ffd700'
                    }}
                  >
                    {symbol}
                  </motion.div>
                ))}
              </div>
              <div style={{ width: '100%', height: '4px', background: 'red', position: 'absolute', top: '50%', left: 0, opacity: 0.3, zIndex: 1 }} />
            </div>
          )}

          {/* MINES */}
          {gameId === 'mines' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', padding: '20px' }}>
              {minesGrid.map((cell, i) => (
                <motion.div
                  key={i}
                  whileHover={!cell.revealed ? { scale: 1.05, background: '#333' } : {}}
                  whileTap={!cell.revealed ? { scale: 0.95 } : {}}
                  onClick={() => handleMineClick(i)}
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    background: cell.revealed 
                      ? (cell.isMine ? 'linear-gradient(135deg, #ef4444 0%, #7f1d1d 100%)' : 'linear-gradient(135deg, #10b981 0%, #064e3b 100%)') 
                      : 'linear-gradient(135deg, #222 0%, #111 100%)', 
                    borderRadius: '12px', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.05)',
                    boxShadow: cell.revealed ? '0 0 15px rgba(0,0,0,0.5)' : 'inset 0 2px 5px rgba(255,255,255,0.05)'
                  }}
                >
                  {cell.revealed ? (cell.isMine ? <AlertCircle size={30} color="white" /> : <Target size={30} color="white" />) : null}
                </motion.div>
              ))}
            </div>
          )}

          {/* COLOR TRADING */}
          {gameId === 'color-trading' && (
            <div style={{ width: '100%', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Period: 20240427001</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
                  00:{countdown.toString().padStart(2, '0')}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px' }}>
                {[
                  { id: 'red', color: 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)' },
                  { id: 'green', color: 'linear-gradient(135deg, #10b981 0%, #064e3b 100%)' },
                  { id: 'violet', color: 'linear-gradient(135deg, #8b5cf6 0%, #4c1d95 100%)' }
                ].map(c => (
                  <motion.div
                    key={c.id}
                    whileHover={{ scale: 1.05, filter: 'brightness(1.2)' }}
                    whileTap={{ scale: 0.95 }}
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      borderRadius: '20px', 
                      background: c.color, 
                      border: selectedColor === c.id ? '4px solid white' : '1px solid rgba(255,255,255,0.1)', 
                      cursor: 'pointer', 
                      boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      fontSize: '0.8rem'
                    }}
                    onClick={() => !isGameRunning && startColorGame(c.id)}
                  >
                    {c.id}
                  </motion.div>
                ))}
              </div>

              <div style={{ background: '#111', padding: '15px', borderRadius: '12px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>History</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {colorHistory.map((h, i) => (
                    <div key={i} style={{ width: '20px', height: '20px', borderRadius: '50%', background: h === 'violet' ? '#8b5cf6' : (h === 'red' ? '#ef4444' : '#10b981') }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Default / Casino */}
          {(gameId === 'casino' || gameId === 'roulette') && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <h2 style={{ marginBottom: '20px' }}>{gameTitles[gameId]} Interface</h2>
              <div style={{ fontSize: '4rem' }}>🎮</div>
              <p style={{ color: 'var(--text-muted)', marginTop: '20px' }}>Advanced betting simulation active.</p>
            </div>
          )}

        </div>

        {/* Controls */}
        <div style={{ padding: '24px', background: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Amount (₹)</label>
              <input 
                type="number" 
                value={betAmount} 
                onChange={(e) => setBetAmount(e.target.value)} 
                className="input-field" 
                disabled={isGameRunning || spinning}
              />
            </div>

            {/* Contextual Buttons */}
            {(gameId === 'aviator' || gameId === 'crash') && (
              <button 
                onClick={isGameRunning ? cashOutCrash : startCrashGame} 
                className={isGameRunning ? 'btn-success' : 'btn-primary'}
                style={{ flex: 1, height: '48px', fontWeight: 'bold' }}
              >
                {isGameRunning ? `CASH OUT (${multiplier.toFixed(2)}x)` : 'PLACE BET'}
              </button>
            )}

            {gameId === 'dice' && (
              <div style={{ display: 'flex', gap: '10px', flex: 1 }}>
                <button onClick={() => rollDice('low')} disabled={isGameRunning} className="btn-secondary" style={{ flex: 1, height: '48px' }}>1-3 (LOW)</button>
                <button onClick={() => rollDice('high')} disabled={isGameRunning} className="btn-primary" style={{ flex: 1, height: '48px' }}>4-6 (HIGH)</button>
              </div>
            )}

            {gameId === 'lucky-wheel' && (
              <div style={{ display: 'flex', gap: '10px', flex: 1 }}>
                <select onChange={(e) => setSelectedBet(e.target.value)} className="input-field" style={{ flex: 1 }}>
                  <option value="">Select Multiplier</option>
                  <option value="2">2x</option>
                  <option value="5">5x</option>
                  <option value="10">10x</option>
                </select>
                <button onClick={spinWheel} disabled={spinning} className="btn-primary" style={{ flex: 1, height: '48px' }}>SPIN</button>
              </div>
            )}

            {gameId === 'mines' && (
              <button 
                onClick={isGameRunning ? cashOutMines : startMines} 
                className={isGameRunning ? 'btn-success' : 'btn-primary'}
                style={{ flex: 1, height: '48px' }}
              >
                {isGameRunning ? 'CASH OUT' : 'START GAME'}
              </button>
            )}

            {gameId === 'color-trading' && (
              <div style={{ flex: 1, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Select a color above to start the period
              </div>
            )}

            {gameId === 'slots' && (
              <button onClick={spinSlots} disabled={isSpinning} className="btn-primary" style={{ flex: 1, height: '48px', background: 'linear-gradient(to right, #f6e05e, #ecc94b)', color: 'black', fontSize: '1.2rem', fontWeight: '900' }}>
                SPIN SLOTS
              </button>
            )}

            {(!['aviator', 'crash', 'dice', 'lucky-wheel', 'mines', 'color-trading', 'slots'].includes(gameId)) && (
              <button className="btn-primary" style={{ flex: 1, height: '48px' }}>DEMO BET</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameView;
