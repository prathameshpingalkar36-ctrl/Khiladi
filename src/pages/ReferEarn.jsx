import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Gift, Users, ArrowRight } from 'lucide-react';
import { getUserInfo } from '../utils/api';

const ReferEarn = () => {
  const user = getUserInfo();
  const [copied, setCopied] = React.useState(false);

  const referralCode = user?.referral_code || 'GUEST';
  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Header Card */}
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', color: 'white', marginBottom: '32px' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}
        >
          <Gift size={40} />
        </motion.div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>Refer & Earn</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
          Invite your friends and get ₹50 for every successful referral + 2% commission on their lifetime winnings!
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Referral Link Card */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Share2 size={20} color="var(--primary)" /> Your Referral Link
          </h3>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px dashed var(--border-color)', marginBottom: '20px', wordBreak: 'break-all', fontSize: '0.9rem' }}>
            {referralLink}
          </div>
          <button 
            onClick={handleCopy}
            className="btn-primary" 
            style={{ width: '100%', gap: '12px' }}
          >
            {copied ? 'COPIED!' : 'COPY LINK'} <Copy size={18} />
          </button>
        </div>

        {/* Stats Card */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={20} color="var(--accent-gold)" /> Referral Stats
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Total Referrals</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>12</div>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Earned</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-green)' }}>₹600</div>
            </div>
          </div>
          <button className="btn-success" style={{ width: '100%', marginTop: '20px', background: 'transparent', border: '1px solid var(--accent-green)', color: 'var(--accent-green)' }}>
            Withdraw Earnings
          </button>
        </div>

      </div>

      {/* How it works */}
      <div style={{ marginTop: '40px' }}>
        <h3 style={{ marginBottom: '20px' }}>How it works?</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { step: '1', title: 'Share your link', desc: 'Copy your referral link and share it with your friends via WhatsApp or Social Media.' },
            { step: '2', title: 'Friend Registers', desc: 'Your friend registers using your link and makes their first deposit.' },
            { step: '3', title: 'Get Reward', desc: 'You instantly receive ₹50 in your wallet and start earning commission on their bets.' }
          ].map(item => (
            <div key={item.step} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-card-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                {item.step}
              </div>
              <div>
                <h4 style={{ marginBottom: '4px' }}>{item.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ReferEarn;
