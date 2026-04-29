import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { MessageCircle, X, Send, PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout-wrapper">
      <Navbar />
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
      <SupportWidget />
    </div>
  );
};

const Footer = () => {
  return (
    <footer style={{ padding: '40px 20px', borderTop: '1px solid var(--border-color)', marginTop: '40px', background: 'rgba(0,0,0,0.2)' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '40px' }}>
        <div style={{ maxWidth: '400px' }}>
          <h3 style={{ marginBottom: '16px' }}><span className="gradient-text">Khiladi</span>King</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            The most trusted and secure betting platform in India. Join over 1M+ players and experience the thrill of live gaming.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center' }}>
          <div>
            <h4 style={{ marginBottom: '12px', fontSize: '1rem' }}>Platform</h4>
            <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>About Us</li>
              <li>Responsible Gambling</li>
              <li>Partner Program</li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: '12px', fontSize: '1rem' }}>Support</h4>
            <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Help Center</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container" style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ padding: '4px 8px', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>18+</div>
          <div style={{ padding: '4px 8px', border: '1px solid var(--text-muted)', color: 'var(--text-muted)', borderRadius: '4px', fontSize: '0.7rem' }}>SECURE SSL</div>
          <div style={{ padding: '4px 8px', border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)', borderRadius: '4px', fontSize: '0.7rem' }}>VIP CERTIFIED</div>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>© 2026 KhiladiKing Entertainment. All rights reserved.</p>
      </div>
    </footer>
  );
};

const SupportWidget = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div style={{ position: 'fixed', right: '24px', bottom: '80px', zIndex: 1000 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="glass-panel"
            style={{ width: '300px', marginBottom: '16px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
          >
            <div style={{ background: 'var(--primary)', padding: '16px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></div>
                <span style={{ fontWeight: 'bold' }}>Support Online</span>
              </div>
              <X size={18} style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
            </div>
            <div style={{ padding: '20px', fontSize: '0.9rem', maxHeight: '300px', overflowY: 'auto' }}>
              <div style={{ background: 'var(--bg-card-hover)', padding: '12px', borderRadius: '12px', marginBottom: '12px', width: '80%' }}>
                Hello! How can we help you today?
              </div>
              <div style={{ background: 'var(--primary)', color: 'white', padding: '12px', borderRadius: '12px', marginLeft: 'auto', marginBottom: '12px', width: '80%' }}>
                I have a problem with my deposit.
              </div>
            </div>
            <div style={{ padding: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px' }}>
              <input type="text" placeholder="Type a message..." className="input-field" style={{ padding: '8px' }} />
              <button className="btn-primary" style={{ padding: '8px' }}><Send size={16} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: '60px', 
          height: '60px', 
          borderRadius: '50%', 
          background: 'var(--primary)', 
          color: 'white', 
          border: 'none', 
          boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
      >
        <MessageCircle size={30} />
      </motion.button>
    </div>
  );
};

export default Layout;
