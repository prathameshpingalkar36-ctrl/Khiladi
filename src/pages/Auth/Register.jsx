import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { register, setAuthToken, setUserInfo } from '../../utils/api';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (name.length < 3) return setError('Please enter your full name');
    if (phone.length < 10) return setError('Please enter a valid 10-digit phone number');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    if (password !== confirmPassword) return setError('Passwords do not match');
    
    setLoading(true);
    try {
      const data = await register(name, phone, password);
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
          <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '8px' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)' }}>Join KhiladiKing and start winning</p>
        </div>

        {error && <p style={{ color: 'var(--accent-red)', textAlign: 'center', marginBottom: '16px' }}>{error}</p>}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Name Field */}
          <div style={{ position: 'relative' }}>
            <User size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="input-field" style={{ paddingLeft: '48px' }} required />
          </div>

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

          {/* Confirm Password Field */}
          <div style={{ position: 'relative' }}>
            <Lock size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="Confirm Password" 
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="input-field" 
              style={{ paddingLeft: '48px', paddingRight: '48px' }} 
              required 
            />
            <div 
              style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', cursor: 'pointer' }}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            style={{ marginTop: '8px', padding: '16px', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Creating Account...' : 'Register Now'} <ArrowRight size={20} />
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
