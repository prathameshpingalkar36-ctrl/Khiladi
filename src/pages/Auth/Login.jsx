import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginApi, setAuthToken, setUserInfo } from '../../utils/api';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (phone.length < 10) return setError('Please enter a valid 10-digit phone number');
    
    setLoading(true);
    try {
      const data = await loginApi(phone, password);
      setAuthToken(data.token);
      setUserInfo(data.user);
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ justifyContent: 'center', alignItems: 'center', background: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.1), transparent 40%), var(--bg-dark)' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel"
        style={{ width: '100%', maxWidth: '420px', padding: '40px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '8px' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)' }}>Login to continue winning</p>
        </div>

        {error && <p style={{ color: 'var(--accent-red)', textAlign: 'center', marginBottom: '16px' }}>{error}</p>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Phone Field */}
          <div style={{ position: 'relative' }}>
            <Phone size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" className="input-field" style={{ paddingLeft: '48px' }} required />
          </div>

          {/* Password Field */}
          <div style={{ position: 'relative' }}>
            <Lock size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-field" 
              style={{ paddingLeft: '48px', paddingRight: '48px' }} 
              required 
            />
            <div 
              style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', cursor: 'pointer' }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <span style={{ color: 'var(--primary)', fontSize: '0.875rem', cursor: 'pointer', fontWeight: '500' }}>Forgot Password?</span>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            style={{ marginTop: '8px', padding: '16px', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Logging in...' : 'Login'} <LogIn size={20} />
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Register</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
