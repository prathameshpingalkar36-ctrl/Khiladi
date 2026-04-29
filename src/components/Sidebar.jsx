import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Trophy, Gamepad2, Coins, Target, User, ShieldAlert, Dice5, Zap, Star, Gift, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getUserInfo } from '../utils/api';

const Sidebar = () => {
  const user = getUserInfo();
  const isAdmin = user && user.isAdmin;

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'IPL Betting', path: '/sports/ipl', icon: <Trophy size={20} /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={20} color="var(--accent-gold)" /> },
    { name: 'Refer & Earn', path: '/refer', icon: <Gift size={20} /> },
    { name: 'Aviator', path: '/games/aviator', icon: <Zap size={20} /> },
    { name: 'Crash Game', path: '/games/crash', icon: <Zap size={20} /> },
    { name: 'Dice Game', path: '/games/dice', icon: <Dice5 size={20} /> },
    { name: 'Lucky Wheel', path: '/games/lucky-wheel', icon: <Star size={20} /> },
    { name: 'Mines', path: '/games/mines', icon: <Target size={20} /> },
    { name: 'Color Trading', path: '/games/color-trading', icon: <Gamepad2 size={20} /> },
    { name: 'Casino Games', path: '/games/casino', icon: <Coins size={20} /> },
    { name: 'Support', path: '/support', icon: <MessageCircle size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        {navItems.map((item) => (
          <li key={item.path} className="sidebar-item">
            <NavLink
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
        {isAdmin && (
          <li className="sidebar-item">
            <NavLink to="/admin" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} style={{ marginTop: '10px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', border: '1px solid var(--primary)' }}>
              <ShieldAlert size={20} />
              <span>Admin Panel</span>
            </NavLink>
          </li>
        )}
      </ul>
      <WinningFeed />
    </aside>
  );
};

const WinningFeed = () => {
  const [wins, setWins] = React.useState([
    { name: 'Rahul S.', amount: 1250, game: 'Aviator' },
    { name: 'Amit K.', amount: 400, game: 'Dice' },
    { name: 'Priya M.', amount: 8000, game: 'Slots' }
  ]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const names = ['Vikram', 'Sneha', 'Arjun', 'Anjali', 'Deepak', 'Sonia'];
      const games = ['Aviator', 'Mines', 'Slots', 'Color Trading'];
      const newWin = {
        name: names[Math.floor(Math.random() * names.length)] + ' ' + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + '.',
        amount: Math.floor(Math.random() * 5000) + 100,
        game: games[Math.floor(Math.random() * games.length)]
      };
      setWins(prev => [newWin, ...prev.slice(0, 4)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ marginTop: 'auto', padding: '16px', borderTop: '1px solid var(--border-color)' }}>
      <h4 style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Live Winnings</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {wins.map((win, i) => (
          <motion.div 
            key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '8px', borderLeft: '2px solid var(--accent-green)' }}
          >
            <div style={{ fontWeight: 'bold' }}>{win.name}</div>
            <div style={{ color: 'var(--text-muted)' }}>Won <span style={{ color: 'var(--accent-green)' }}>₹{win.amount}</span> on {win.game}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
