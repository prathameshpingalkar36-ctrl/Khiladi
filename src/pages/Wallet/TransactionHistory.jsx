import React, { useState } from 'react';
import { ArrowLeft, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getHistory } from '../../utils/api';

const TransactionHistory = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [transactions, setTransactions] = useState([]);

  React.useEffect(() => {
    getHistory().then(setTransactions).catch(console.error);
  }, []);

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'deposit' || filter === 'withdraw') return t.type === filter;
    if (filter === 'bets') return t.type === 'bet' || t.type === 'win';
    return true;
  });

  return (
    <div className="container animate-fade-in" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '24px' }}>
        <ArrowLeft size={20} /> Back to Profile
      </button>

      <h1 style={{ marginBottom: '24px' }}>Transaction History</h1>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
        {['all', 'deposit', 'withdraw', 'bets'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '20px', 
              background: filter === f ? 'var(--primary)' : 'var(--bg-card)', 
              color: filter === f ? 'white' : 'var(--text-muted)',
              border: `1px solid ${filter === f ? 'var(--primary)' : 'var(--border-color)'}`,
              textTransform: 'capitalize',
              fontWeight: '500'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredTransactions.map((txn, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={txn.id} 
            className="glass-panel" 
            style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '24px', 
                background: (txn.type === 'deposit' || txn.type === 'win') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: (txn.type === 'deposit' || txn.type === 'win') ? 'var(--accent-green)' : 'var(--accent-red)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {(txn.type === 'deposit' || txn.type === 'win') ? <ArrowDownRight size={24} /> : <ArrowUpRight size={24} />}
              </div>
              <div>
                <h3 style={{ textTransform: 'capitalize', fontSize: '1.1rem', marginBottom: '4px' }}>
                  {txn.type} {txn.details && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>({txn.details})</span>}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{new Date(txn.created_at).toLocaleString()}</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ 
                fontWeight: 'bold', fontSize: '1.1rem', 
                color: (txn.type === 'deposit' || txn.type === 'win') ? 'var(--accent-green)' : 'var(--text-main)' 
              }}>
                {(txn.type === 'deposit' || txn.type === 'win') ? '+' : '-'}₹{txn.amount}
              </div>
              <div style={{ 
                fontSize: '0.8rem', 
                marginTop: '4px',
                color: txn.status === 'Approved' || txn.status === 'Completed' || txn.status === 'Success' ? 'var(--accent-green)' : 
                       txn.status === 'Pending' ? 'var(--accent-gold)' : 'var(--accent-red)'
              }}>
                {txn.status}
              </div>
            </div>
          </motion.div>
        ))}
        {filteredTransactions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No transactions found.
          </div>
        )}
      </div>

    </div>
  );
};

export default TransactionHistory;
