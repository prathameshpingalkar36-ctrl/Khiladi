import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Trophy, Wallet, User, Gamepad2 } from 'lucide-react';
import { motion } from 'framer-motion';

const MobileNav = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-nav">
      <NavLink to="/" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <Home size={24} />
        <span>Home</span>
      </NavLink>
      
      <NavLink to="/sports/ipl" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <Trophy size={24} />
        <span>IPL</span>
      </NavLink>
      
      {/* Center Action Button (Deposit) */}
      <motion.div 
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.9 }}
        className="mobile-nav-item center-action" 
        onClick={() => navigate('/deposit')}
        style={{ position: 'relative', top: '-15px', zIndex: 10 }}
      >
        <div style={{ 
          width: '56px', 
          height: '56px', 
          background: 'linear-gradient(135deg, var(--accent-green) 0%, #059669 100%)', 
          borderRadius: '18px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)',
          border: '4px solid var(--bg-dark)'
        }}>
          <Wallet size={28} color="white" />
        </div>
        <span style={{ fontSize: '0.7rem', marginTop: '4px', fontWeight: 'bold', color: 'var(--accent-green)' }}>Deposit</span>
      </motion.div>
      
      <NavLink to="/games/aviator" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <Gamepad2 size={24} />
        <span>Games</span>
      </NavLink>
      
      <NavLink to="/profile" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <User size={24} />
        <span>Profile</span>
      </NavLink>
    </div>
  );
};

export default MobileNav;
