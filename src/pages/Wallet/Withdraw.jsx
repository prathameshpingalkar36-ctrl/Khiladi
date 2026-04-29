import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Landmark, Smartphone, ArrowRight } from 'lucide-react';
import { withdraw as withdrawApi, getBalance } from '../../utils/api';

const Withdraw = () => {
  const [method, setMethod] = useState('upi'); // 'upi' or 'bank'
  const [amount, setAmount] = useState('');
  const [details, setDetails] = useState('');
  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => {
    getBalance().then(data => setBalance(data.balance)).catch(console.error);
  }, []);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const data = await withdrawApi(amount, details);
      setBalance(data.balance);
      setMessage(data.message);
      setAmount('');
      setDetails('');
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="container animate-fade-in" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '24px' }}>Withdraw Funds</h1>

      <div className="glass-panel" style={{ padding: '24px' }}>
        
        {/* Balance Display */}
        <div style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))', padding: '24px', borderRadius: '16px', textAlign: 'center', marginBottom: '32px', border: '1px solid var(--glass-border)' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Available Balance</p>
          <h2 style={{ fontSize: '2.5rem', color: 'white' }}>₹ {balance.toFixed(2)}</h2>
        </div>

        {/* Withdrawal Method Selection */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button 
            onClick={() => setMethod('upi')}
            style={{ flex: 1, padding: '16px', borderRadius: '12px', border: `1px solid ${method === 'upi' ? 'var(--primary)' : 'var(--border-color)'}`, background: method === 'upi' ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-card)', color: method === 'upi' ? 'var(--primary)' : 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', transition: 'var(--transition-fast)' }}
          >
            <Smartphone size={24} />
            <span style={{ fontWeight: '600' }}>UPI Transfer</span>
          </button>
          
          <button 
            onClick={() => setMethod('bank')}
            style={{ flex: 1, padding: '16px', borderRadius: '12px', border: `1px solid ${method === 'bank' ? 'var(--primary)' : 'var(--border-color)'}`, background: method === 'bank' ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-card)', color: method === 'bank' ? 'var(--primary)' : 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', transition: 'var(--transition-fast)' }}
          >
            <Landmark size={24} />
            <span style={{ fontWeight: '600' }}>Bank Transfer</span>
          </button>
        </div>

        <form onSubmit={handleWithdraw} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && <p style={{ color: 'var(--accent-red)' }}>{error}</p>}
          {message && <p style={{ color: 'var(--accent-green)' }}>{message}</p>}
          <div style={{ position: 'relative' }}>
            <IndianRupee size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="number" 
              placeholder="Withdrawal Amount" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field" 
              style={{ paddingLeft: '48px', fontSize: '1.1rem' }} 
              required 
            />
          </div>

          {method === 'upi' ? (
            <input 
              type="text" 
              placeholder="Enter your UPI ID" 
              value={details}
              onChange={e => setDetails(e.target.value)}
              className="input-field" 
              required 
            />
          ) : (
            <>
              <input type="text" placeholder="Account Details (Name, Acct, IFSC)" value={details} onChange={e => setDetails(e.target.value)} className="input-field" required />
            </>
          )}

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="btn-primary" 
            style={{ marginTop: '16px', padding: '16px' }}
          >
            Request Withdrawal <ArrowRight size={20} />
          </motion.button>
        </form>

      </div>
    </div>
  );
};

export default Withdraw;
