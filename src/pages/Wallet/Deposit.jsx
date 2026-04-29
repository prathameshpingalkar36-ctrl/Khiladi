import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IndianRupee, Copy, CheckCircle2, QrCode, Maximize } from 'lucide-react';
import { deposit as depositApi } from '../../utils/api';

const Deposit = () => {
  const [amount, setAmount] = useState('');
  const [utr, setUtr] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);

  const upiId = "8087130247@ibl";

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await depositApi(amount, utr);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '24px' }}>Deposit Funds</h1>
      
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div 
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="glass-panel" 
            style={{ padding: '24px' }}
          >
            {/* Step 1: Transfer */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>1</div>
                <h3 style={{ fontSize: '1.1rem' }}>Transfer via UPI</h3>
              </div>
              
              <div style={{ background: 'var(--bg-card-hover)', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px dashed var(--border-color)' }}>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '4px' }}>Official UPI ID</p>
                  <p style={{ fontWeight: '600', fontSize: '1.1rem', letterSpacing: '0.5px' }}>{upiId}</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={handleCopy} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: copied ? 'var(--accent-green)' : 'var(--primary)', background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '12px', transition: '0.2s', border: '1px solid var(--glass-border)' }}>
                    {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                    {copied ? 'Copied' : 'Copy ID'}
                  </button>
                  <button onClick={() => setScanning(true)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--accent-gold)', background: 'rgba(251, 191, 36, 0.1)', padding: '12px', borderRadius: '12px', transition: '0.2s', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                    <Maximize size={18} />
                    Scan QR
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                <div style={{ width: '160px', height: '160px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=KhiladiKing&cu=INR`)}`} 
                    alt="UPI QR Code" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Details */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>2</div>
                <h3 style={{ fontSize: '1.1rem' }}>Submit Details</h3>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {error && <p style={{ color: 'var(--accent-red)' }}>{error}</p>}
                <div style={{ position: 'relative' }}>
                  <IndianRupee size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="number" 
                    placeholder="Enter Amount" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input-field" 
                    style={{ paddingLeft: '48px', fontSize: '1.1rem' }} 
                    required 
                  />
                </div>

                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    placeholder="12-Digit UTR / Reference No." 
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                    className="input-field" 
                    required 
                  />
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="btn-success" 
                  style={{ marginTop: '8px', padding: '16px' }}
                >
                  Submit Deposit Request
                </motion.button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel" 
            style={{ padding: '40px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            >
              <CheckCircle2 size={80} color="var(--accent-green)" />
            </motion.div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-green)' }}>Request Submitted!</h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Your deposit request for <strong>₹{amount}</strong> has been sent to the admin. 
              The amount will be credited to your wallet once verified.
            </p>
            <button 
              onClick={() => { setSubmitted(false); setAmount(''); setUtr(''); }}
              className="btn-primary" 
              style={{ marginTop: '16px' }}
            >
              Make Another Deposit
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mock Scanner Modal */}
      <AnimatePresence>
        {scanning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
            <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
              <div style={{ position: 'relative', width: '280px', height: '280px', margin: '0 auto 32px', border: '2px solid var(--primary)', borderRadius: '24px', overflow: 'hidden' }}>
                <motion.div 
                  animate={{ y: [0, 280, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--primary)', boxShadow: '0 0 15px var(--primary)', zIndex: 2 }}
                />
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=KhiladiKing&cu=INR`)}`} 
                  alt="Scanner View" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} 
                />
              </div>
              <h3 style={{ color: 'white', marginBottom: '16px' }}>Align QR Code within frame</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Point your camera at the payment QR code</p>
              <button 
                onClick={() => {
                  setScanning(false);
                  setUtr('UTR' + Math.floor(Math.random() * 1000000000));
                  setAmount('500');
                }} 
                className="btn-primary" 
                style={{ width: '100%' }}
              >
                Simulate Successful Scan
              </button>
              <button 
                onClick={() => setScanning(false)} 
                style={{ marginTop: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Deposit;
