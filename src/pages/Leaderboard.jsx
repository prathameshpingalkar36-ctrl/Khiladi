import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, User } from 'lucide-react';

const Leaderboard = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        setWinners(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="container animate-fade-in" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div className="skeleton" style={{ width: '200px', height: '40px', margin: '0 auto 10px' }} />
        <div className="skeleton" style={{ width: '300px', height: '20px', margin: '0 auto' }} />
      </div>
      <div className="glass-panel" style={{ padding: '20px' }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} className="skeleton" style={{ height: '60px', marginBottom: '12px' }} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="container animate-fade-in" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Trophy size={60} color="var(--accent-gold)" style={{ marginBottom: '16px' }} />
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Global Hall of Fame</h1>
          <p style={{ color: 'var(--text-muted)' }}>The top 10 players with the highest winnings on KhiladiKing.</p>
        </motion.div>
      </div>

      {/* Top 3 Podium Mockup */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '20px', marginBottom: '40px', padding: '20px' }}>
        {/* 2nd Place */}
        {winners[1] && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
              <Medal size={30} color="white" />
            </div>
            <div className="glass-panel" style={{ padding: '15px', width: '120px', height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{winners[1].name}</div>
              <div style={{ color: 'var(--accent-green)', fontSize: '0.9rem' }}>₹{winners[1].balance.toLocaleString()}</div>
            </div>
          </div>
        )}

        {/* 1st Place */}
        {winners[0] && (
          <div style={{ textAlign: 'center' }}>
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', boxShadow: '0 0 20px var(--accent-gold)' }}
            >
              <Trophy size={40} color="white" />
            </motion.div>
            <div className="glass-panel" style={{ padding: '20px', width: '150px', height: '140px', border: '2px solid var(--accent-gold)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{winners[0].name}</div>
              <div style={{ color: 'var(--accent-green)', fontSize: '1.1rem', fontWeight: 'bold' }}>₹{winners[0].balance.toLocaleString()}</div>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {winners[2] && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
              <Medal size={25} color="white" />
            </div>
            <div className="glass-panel" style={{ padding: '15px', width: '110px', height: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{winners[2].name}</div>
              <div style={{ color: 'var(--accent-green)', fontSize: '0.8rem' }}>₹{winners[2].balance.toLocaleString()}</div>
            </div>
          </div>
        )}
      </div>

      {/* List View */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', background: 'var(--bg-card-hover)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px' }}>Rank</th>
              <th style={{ padding: '16px' }}>Player</th>
              <th style={{ padding: '16px' }}>Level</th>
              <th style={{ padding: '16px', textAlign: 'right' }}>Total Winnings</th>
            </tr>
          </thead>
          <tbody>
            {winners.map((winner, index) => (
              <tr key={index} style={{ borderBottom: '1px solid var(--border-color)', background: index < 3 ? 'rgba(251, 191, 36, 0.03)' : 'transparent' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: index === 0 ? 'var(--accent-gold)' : 'var(--bg-card-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {index + 1}
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={16} />
                    </div>
                    {winner.name}
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    LV {winner.level}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold', color: 'var(--accent-green)' }}>
                  ₹ {winner.balance.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Leaderboard;
