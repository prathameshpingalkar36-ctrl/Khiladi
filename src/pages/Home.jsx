import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Gamepad2, Coins, PlayCircle, Zap, Dice5, Star, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [bonusMessage, setBonusMessage] = React.useState('');
  const [isClaiming, setIsClaiming] = React.useState(false);
  const [stats, setStats] = React.useState(null);
  const [showPromo, setShowPromo] = React.useState(false);

  React.useEffect(() => {
    // Show promo modal after 2 seconds on first load
    const hasSeenPromo = sessionStorage.getItem('hasSeenPromo');
    if (!hasSeenPromo) {
      const timer = setTimeout(() => {
        setShowPromo(true);
        sessionStorage.setItem('hasSeenPromo', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  React.useEffect(() => {
    fetch('http://localhost:3000/api/stats')
      .then(res => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  const handleClaimDaily = async () => {
    setIsClaiming(true);
    try {
      const res = await fetch('http://localhost:3000/api/user/daily-checkin', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setBonusMessage('🎉 ₹10 Bonus Claimed!');
        // Refresh balance after a short delay
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setBonusMessage(data.error || 'Failed to claim bonus');
      }
    } catch (err) {
      setBonusMessage('Server error');
    } finally {
      setIsClaiming(false);
      setTimeout(() => setBonusMessage(''), 5000);
    }
  };

  const games = [
    { id: 'aviator', name: 'Aviator', icon: <Zap size={32} />, color: '#ef4444' },
    { id: 'crash', name: 'Crash Game', icon: <Zap size={32} />, color: '#f97316' },
    { id: 'dice', name: 'Dice Game', icon: <Dice5 size={32} />, color: '#8b5cf6' },
    { id: 'lucky-wheel', name: 'Lucky Wheel', icon: <Star size={32} />, color: '#ec4899' },
    { id: 'color-trading', name: 'Color Trading', icon: <Gamepad2 size={32} />, color: '#3b82f6' },
    { id: 'casino', name: 'Live Casino', icon: <Coins size={32} />, color: '#fbbf24' },
    { id: 'slots', name: 'Casino Slots', icon: <Star size={32} />, color: '#fbbf24' },
    { id: 'mines', name: 'Mines Game', icon: <Target size={32} />, color: '#10b981' },
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: '20px' }}>
      
      {/* Promotion Modal Overlay */}
      {showPromo && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel"
            style={{ maxWidth: '450px', width: '100%', padding: '40px', textAlign: 'center', position: 'relative', border: '1px solid var(--accent-gold)' }}
          >
            <button 
              onClick={() => setShowPromo(false)}
              style={{ position: 'absolute', right: '16px', top: '16px', color: 'var(--text-muted)' }}
            >
              <X size={24} />
            </button>
            
            <div style={{ width: '80px', height: '80px', background: 'rgba(251,191,36,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--accent-gold)' }}>
              <Gift size={40} />
            </div>
            
            <h2 className="gradient-text-gold" style={{ fontSize: '2rem', marginBottom: '12px' }}>Welcome Bonus!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              Deposit now and get <span style={{ color: 'white', fontWeight: 'bold' }}>100% EXTRA</span> in your wallet. Start your winning journey with KhiladiKing today!
            </p>
            
            <button 
              onClick={() => { setShowPromo(false); navigate('/deposit'); }}
              className="btn-primary" 
              style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: 'black' }}
            >
              CLAIM 100% BONUS NOW
            </button>
            <p style={{ marginTop: '16px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>*Terms and conditions apply</p>
          </motion.div>
        </div>
      )}

      {/* Hero Banner Carousel */}
      <div style={{ marginBottom: '32px' }}>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ 
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', 
            borderRadius: '24px', 
            padding: '40px', 
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          {/* Animated Background Elements */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            style={{ position: 'absolute', right: '-100px', top: '-100px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '40%' }}
          />
          
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ maxWidth: '500px' }}>
              <span style={{ background: 'var(--accent-gold)', color: 'black', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '16px', display: 'inline-block' }}>
                LIMITED TIME OFFER
              </span>
              <h1 style={{ color: 'white', fontSize: '2.8rem', marginBottom: '12px', lineHeight: '1.1' }}>Get 100% Bonus <br/>on First Deposit!</h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '24px' }}>
                Join the VIP club today and double your winning potential instantly. Valid for all new users!
              </p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button onClick={() => navigate('/deposit')} className="btn-primary" style={{ background: 'white', color: 'var(--primary)', fontWeight: 'bold' }}>
                  CLAIM NOW
                </button>
                <button onClick={() => navigate('/refer')} className="btn-secondary" style={{ border: '1px solid white', color: 'white' }}>
                  LEARN MORE
                </button>
              </div>
            </div>
            
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              style={{ display: 'none', md: 'block' }}
            >
              <Trophy size={180} color="var(--accent-gold)" style={{ filter: 'drop-shadow(0 0 20px rgba(251,191,36,0.4))' }} />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Daily Reward Section */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', background: 'var(--secondary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)' }}>
            <Gift size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '2px' }}>Daily Login Bonus</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Claim your free ₹10 every 24 hours!</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          {bonusMessage ? (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: bonusMessage.includes('Claimed') ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 'bold' }}>{bonusMessage}</motion.span>
          ) : (
            <button 
              onClick={handleClaimDaily} 
              disabled={isClaiming}
              className="btn-primary" 
              style={{ padding: '8px 20px', fontSize: '0.9rem', background: 'var(--secondary)', boxShadow: '0 4px 14px rgba(139, 92, 246, 0.3)' }}
            >
              {isClaiming ? 'Claiming...' : 'Claim ₹10'}
            </button>
          )}
        </div>
      </div>

      {/* Top Games Section */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Gamepad2 size={24} className="gradient-text" /> 
          Top Trending Games
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: `0 10px 25px -5px ${game.color}40` }}
              onClick={() => navigate(`/games/${game.id}`)}
              className="glass-panel"
              style={{ 
                padding: '24px 16px', 
                textAlign: 'center', 
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                borderTop: `2px solid ${game.color}`
              }}
            >
              <div style={{ color: game.color, background: `${game.color}15`, padding: '16px', borderRadius: '50%' }}>
                {game.icon}
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>{game.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderBottom: '3px solid var(--primary)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px' }}>Total Players</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{stats?.totalUsers?.toLocaleString() || '1,200'}+</div>
          </div>
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderBottom: '3px solid var(--accent-green)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px' }}>Total Payouts</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent-green)' }}>₹{stats?.totalPayouts?.toLocaleString() || '450,000'}+</div>
          </div>
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderBottom: '3px solid var(--accent-gold)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px' }}>Games Played</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{stats?.gamesPlayed?.toLocaleString() || '8,500'}+</div>
          </div>
        </div>
      </div>

      {/* Live Sports Matches Mockup */}
      <div>
        <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy size={24} className="gradient-text" /> 
          Live Sports
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3].map((match) => (
            <div key={match} className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/sports/ipl')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', width: '40px' }}>74'</div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>Team Alpha {match}</div>
                  <div style={{ fontWeight: '600' }}>Team Beta {match}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ background: 'var(--bg-dark)', padding: '8px 16px', borderRadius: '8px', textAlign: 'center', minWidth: '60px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1</div>
                  <div style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>1.85</div>
                </div>
                <div style={{ background: 'var(--bg-dark)', padding: '8px 16px', borderRadius: '8px', textAlign: 'center', minWidth: '60px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>X</div>
                  <div style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>3.20</div>
                </div>
                <div style={{ background: 'var(--bg-dark)', padding: '8px 16px', borderRadius: '8px', textAlign: 'center', minWidth: '60px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2</div>
                  <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>2.10</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
            {/* Winners Testimonials */}
      <div style={{ marginTop: '40px', marginBottom: '60px' }}>
        <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Star size={24} color="var(--accent-gold)" /> 
          What Our Players Say
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {[
            { name: 'Sameer P.', review: 'Won ₹25k on Aviator yesterday! Fast withdrawal and very fair odds.', rating: 5 },
            { name: 'Kiran G.', review: 'Best betting platform in India. The games are so realistic and smooth.', rating: 5 },
            { name: 'Ankita L.', review: 'Referral program is amazing. I earned ₹500 just by inviting my friends.', rating: 5 }
          ].map((item, i) => (
            <div key={i} className="glass-panel" style={{ padding: '24px', position: 'relative' }}>
              <div style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}>
                {[...Array(item.rating)].map((_, idx) => <Star key={idx} size={14} fill="var(--accent-gold)" color="var(--accent-gold)" />)}
              </div>
              <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.95rem' }}>"{item.review}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-card-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>{item.name[0]}</div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent-green)' }}>✓ Verified Winner</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Home;
