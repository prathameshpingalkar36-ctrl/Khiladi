import React from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Clock, LogOut, ChevronRight, Settings, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo, getBalance, removeAuthToken } from '../utils/api';

const Profile = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = React.useState(0);
  const user = getUserInfo();

  React.useEffect(() => {
    if (user) {
      getBalance().then(data => setBalance(data.balance)).catch(console.error);
    } else {
      navigate('/login');
    }
  }, [navigate, user]);

  const handleLogout = () => {
    removeAuthToken();
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  if (!user) return null;

  return (
    <div className="container animate-fade-in" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '24px' }}>My Profile</h1>

      {/* User Info Card */}
      <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginBottom: '24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--accent-gold)', color: 'black', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold' }}>
          ID: #KK{user.id?.toString().padStart(6, '0')}
        </div>
        
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, #1e3a8a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', border: '4px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <User size={50} />
        </div>
        
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '4px' }}>{user.name}</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--accent-green)', fontSize: '0.9rem', marginBottom: '4px' }}>
            <Shield size={14} /> Verified Member
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>{user.phone}</p>
        </div>

        {/* VIP Level */}
        <div style={{ width: '100%', marginTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '8px' }}>
            <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>VIP LEVEL {user.level || 1}</span>
            <span style={{ color: 'var(--text-muted)' }}>XP: {user.xp || 0} / {(Math.pow(user.level || 1, 2) * 100)}</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${Math.min(((user.xp || 0) / (Math.pow(user.level || 1, 2) * 100)) * 100, 100)}%` }}
              style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-gold), #fbbf24)', boxShadow: '0 0 10px var(--accent-gold)' }}
            />
          </div>
        </div>
      </div>

      {/* Stats and Balance Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), transparent)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>Available Balance</p>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-green)' }}>₹ {balance.toLocaleString()}</h2>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button onClick={() => navigate('/deposit')} className="btn-success" style={{ flex: 1, padding: '6px', fontSize: '0.8rem' }}>Deposit</button>
            <button onClick={() => navigate('/withdraw')} className="btn-primary" style={{ flex: 1, padding: '6px', fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}>Withdraw</button>
          </div>
        </div>
        
        <div className="glass-panel" style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), transparent)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>Total Winnings</p>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-gold)' }}>₹ {(balance * 1.2).toLocaleString()}</h2>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '16px' }}>Games Played: 124</p>
        </div>
      </div>

      {/* Menu Options */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          
          <motion.li whileHover={{ background: 'var(--bg-card-hover)' }} style={{ borderBottom: '1px solid var(--border-color)' }}>
            <button onClick={() => navigate('/history')} style={{ width: '100%', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Clock size={20} color="var(--primary)" />
                <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>Transaction History</span>
              </div>
              <ChevronRight size={20} color="var(--text-muted)" />
            </button>
          </motion.li>

          <motion.li whileHover={{ background: 'var(--bg-card-hover)' }} style={{ borderBottom: '1px solid var(--border-color)' }}>
            <button style={{ width: '100%', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <CreditCard size={20} color="var(--accent-gold)" />
                <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>Saved Payment Methods</span>
              </div>
              <ChevronRight size={20} color="var(--text-muted)" />
            </button>
          </motion.li>

          <motion.li whileHover={{ background: 'var(--bg-card-hover)' }} style={{ borderBottom: '1px solid var(--border-color)' }}>
            <button style={{ width: '100%', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Settings size={20} color="var(--text-muted)" />
                <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>Account Settings</span>
              </div>
              <ChevronRight size={20} color="var(--text-muted)" />
            </button>
          </motion.li>

          <motion.li whileHover={{ background: 'rgba(239, 68, 68, 0.1)' }}>
            <button onClick={handleLogout} style={{ width: '100%', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--accent-red)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <LogOut size={20} />
                <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>Logout</span>
              </div>
            </button>
          </motion.li>

        </ul>
      </div>

    </div>
  );
};

export default Profile;
