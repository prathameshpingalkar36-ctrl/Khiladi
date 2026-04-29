import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, LogIn, UserPlus, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBalance, getUserInfo } from '../utils/api';

const Navbar = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [balance, setBalance] = React.useState(0);
  const user = getUserInfo();
  const isLoggedIn = !!user;

  React.useEffect(() => {
    let interval;
    if (isLoggedIn) {
      const updateBalance = () => getBalance().then(data => setBalance(data.balance)).catch(console.error);
      updateBalance();
      interval = setInterval(updateBalance, 5000); // 5-sec auto-refresh
    }
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <span className="gradient-text">Khiladi</span>King
      </Link>
      
      <div className="nav-actions">
        {isLoggedIn ? (
          <>
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ background: 'var(--bg-card)', padding: '8px', borderRadius: '50%', border: '1px solid var(--border-color)', position: 'relative' }}
              >
                <Bell size={20} color="var(--text-muted)" />
                <span style={{ position: 'absolute', top: '0', right: '0', width: '8px', height: '8px', background: 'var(--accent-red)', borderRadius: '50%' }}></span>
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="glass-panel"
                    style={{ position: 'absolute', top: '48px', right: '-60px', width: '300px', padding: '16px', zIndex: 100 }}
                  >
                    <h3 style={{ fontSize: '1rem', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Notifications</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ fontSize: '0.875rem' }}>
                        <strong style={{ color: 'var(--accent-green)' }}>Deposit Successful</strong>
                        <p style={{ color: 'var(--text-muted)' }}>Your deposit of ₹2,000 has been credited.</p>
                      </div>
                      <div style={{ fontSize: '0.875rem' }}>
                        <strong style={{ color: 'var(--primary)' }}>IPL Match Live</strong>
                        <p style={{ color: 'var(--text-muted)' }}>CSK vs MI is live now. Place your bets!</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="balance-chip" style={{ cursor: 'pointer' }} onClick={() => navigate('/profile')}>
              <span className="balance-amount">₹ {balance.toFixed(2)}</span>
            </div>
            <button className="btn-success" onClick={() => navigate('/deposit')} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.875rem' }}>
              <Wallet size={16} />
              Deposit
            </button>
          </>
        ) : (
          <>
            <button className="btn-primary" onClick={() => navigate('/login')} style={{ background: 'transparent', color: 'var(--primary)', boxShadow: 'none' }}>
              <LogIn size={18} /> Login
            </button>
            <button className="btn-primary" onClick={() => navigate('/register')}>
              <UserPlus size={18} /> Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
