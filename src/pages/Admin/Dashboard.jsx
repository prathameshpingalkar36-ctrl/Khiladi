import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, IndianRupee, Activity, ArrowLeft, Check, X, RefreshCw, Shield, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAdminUsers, getAdminDeposits, approveDeposit, rejectDeposit, getAdminWithdrawals, approveWithdrawal, rejectWithdrawal, getAdminActivity } from '../../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('deposits');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userData, depositData, withdrawalData, activityData] = await Promise.all([
        getAdminUsers(),
        getAdminDeposits(),
        getAdminWithdrawals().catch(() => []),
        getAdminActivity().catch(() => [])
      ]);
      setUsers(userData);
      setDeposits(depositData);
      setWithdrawals(withdrawalData);
      setActivity(activityData);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveDeposit(id);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectDeposit(id);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleApproveWithdrawal = async (id) => {
    try {
      await approveWithdrawal(id);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRejectWithdrawal = async (id) => {
    try {
      await rejectWithdrawal(id);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading && users.length === 0) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Admin Panel...</div>;

  return (
    <div className="container animate-fade-in" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Shield size={32} color="var(--primary)" /> Admin Control Center
        </h1>
        <button onClick={fetchData} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Refresh Data
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <Users size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Players</p>
            <h2 style={{ fontSize: '1.5rem' }}>{users.length}</h2>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-green)' }}>
            <Activity size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pending Requests</p>
            <h2 style={{ fontSize: '1.5rem' }}>{deposits.length}</h2>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-red)' }}>
            <Clock size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pending Withdrawals</p>
            <h2 style={{ fontSize: '1.5rem' }}>{withdrawals.length}</h2>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button 
          onClick={() => setActiveTab('deposits')}
          className={activeTab === 'deposits' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '10px 24px' }}
        >
          Deposits ({deposits.length})
        </button>
        <button 
          onClick={() => setActiveTab('withdrawals')}
          className={activeTab === 'withdrawals' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '10px 24px' }}
        >
          Withdrawals
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '10px 24px' }}
        >
          Users
        </button>
        <button 
          onClick={() => setActiveTab('activity')}
          className={activeTab === 'activity' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '10px 24px' }}
        >
          Activity
        </button>
      </div>

      {activeTab === 'users' && (
        <div style={{ marginBottom: '24px' }}>
          <input 
            type="text" 
            placeholder="Search players by name or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{ maxWidth: '400px' }}
          />
        </div>
      )}

      {error && <p style={{ color: 'var(--accent-red)', marginBottom: '20px' }}>{error}</p>}

      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        {activeTab === 'deposits' ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-card-hover)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '16px', textAlign: 'left' }}>User</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Amount</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>UTR Details</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '16px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {deposits.length === 0 ? (
                  <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No pending deposit requests</td></tr>
                ) : (
                  deposits.map(dep => (
                    <tr key={dep.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: '600' }}>{dep.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{dep.phone}</div>
                      </td>
                      <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--accent-green)' }}>₹ {dep.amount}</td>
                      <td style={{ padding: '16px', fontSize: '0.9rem' }}>{dep.details}</td>
                      <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(dep.created_at).toLocaleString()}</td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button onClick={() => handleApprove(dep.id)} className="btn-success" style={{ padding: '8px', borderRadius: '8px' }} title="Approve">
                            <Check size={18} />
                          </button>
                          <button onClick={() => handleReject(dep.id)} className="btn-error" style={{ padding: '8px', borderRadius: '8px', background: 'var(--accent-red)' }} title="Reject">
                            <X size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'withdrawals' ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-card-hover)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '16px', textAlign: 'left' }}>User</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Amount</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Details</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '16px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.length === 0 ? (
                  <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No pending withdrawal requests</td></tr>
                ) : (
                  withdrawals.map(w => (
                    <tr key={w.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: '600' }}>{w.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{w.phone}</div>
                      </td>
                      <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--accent-red)' }}>₹ {w.amount}</td>
                      <td style={{ padding: '16px', fontSize: '0.9rem' }}>{w.details}</td>
                      <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(w.created_at).toLocaleString()}</td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button onClick={() => handleApproveWithdrawal(w.id)} className="btn-success" style={{ padding: '8px', borderRadius: '8px' }} title="Approve">
                            <Check size={18} />
                          </button>
                          <button onClick={() => handleRejectWithdrawal(w.id)} className="btn-error" style={{ padding: '8px', borderRadius: '8px', background: 'var(--accent-red)' }} title="Reject">
                            <X size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'users' ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', background: 'var(--bg-card-hover)' }}>
                  <th style={{ padding: '16px' }}>Player</th>
                  <th style={{ padding: '16px' }}>Phone</th>
                  <th style={{ padding: '16px' }}>Balance</th>
                  <th style={{ padding: '16px' }}>Joined</th>
                  <th style={{ padding: '16px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.phone.includes(searchTerm)).map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '16px' }}>{user.name} {user.isAdmin && <span style={{fontSize: '0.6rem', color: 'var(--primary)'}}>(ADMIN)</span>}</td>
                    <td style={{ padding: '16px' }}>{user.phone}</td>
                    <td style={{ padding: '16px', color: 'var(--accent-green)', fontWeight: 'bold' }}>₹{user.balance?.toFixed(2)}</td>
                    <td style={{ padding: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '16px' }}>
                      <button 
                        onClick={() => {
                          const amt = prompt(`Update balance for ${user.name}:`, user.balance);
                          if (amt !== null) {
                            fetch('http://localhost:3000/api/admin/update-balance', {
                              method: 'POST',
                              headers: { 
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                              },
                              body: JSON.stringify({ userId: user.id, amount: Number(amt) })
                            }).then(fetchData).catch(err => alert(err.message));
                          }
                        }}
                        style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.8rem' }}
                      >
                        EDIT BALANCE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', background: 'var(--bg-card-hover)' }}>
                  <th style={{ padding: '16px' }}>User</th>
                  <th style={{ padding: '16px' }}>Action</th>
                  <th style={{ padding: '16px' }}>Amount</th>
                  <th style={{ padding: '16px' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {activity.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '16px' }}>{item.user_name}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        textTransform: 'uppercase', 
                        fontSize: '0.7rem', 
                        fontWeight: 'bold',
                        color: item.type === 'win' ? 'var(--accent-green)' : item.type === 'bet' ? 'var(--accent-red)' : 'var(--primary)'
                      }}>
                        {item.type} ({item.details})
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 'bold' }}>₹{item.amount}</td>
                    <td style={{ padding: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(item.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;