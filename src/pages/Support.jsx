import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, Phone, HelpCircle, ChevronDown } from 'lucide-react';

const Support = () => {
  const [openFaq, setOpenFaq] = React.useState(null);

  const faqs = [
    { q: 'How do I deposit money?', a: 'Go to the Wallet section, scan the QR code or use the UPI ID provided, enter the amount, and submit your UTR number. Your balance will be updated once verified by our team.' },
    { q: 'How long does withdrawal take?', a: 'Withdrawals are typically processed within 30 minutes to 2 hours. In rare cases, it might take up to 24 hours depending on bank processing times.' },
    { q: 'Is my data secure?', a: 'Yes, we use industry-standard SSL encryption and secure database protocols to ensure your personal and financial information is always protected.' },
    { q: 'What is the minimum deposit?', a: 'The minimum deposit amount is ₹100.' }
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>24/7 Support Center</h1>
        <p style={{ color: 'var(--text-muted)' }}>Need help? Our dedicated support team is always here for you.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <a href="https://wa.me/8087130247" className="glass-panel" style={{ padding: '24px', textAlign: 'center', cursor: 'pointer' }}>
          <MessageCircle size={40} color="#25D366" style={{ marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '8px' }}>WhatsApp Support</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Instant replies for technical issues.</p>
        </a>
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
          <Mail size={40} color="var(--primary)" style={{ marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '8px' }}>Email Support</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>support@khiladiking.com</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <HelpCircle size={24} color="var(--accent-gold)" /> Frequently Asked Questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', textAlign: 'left' }}
              >
                <span style={{ fontWeight: '600' }}>{faq.q}</span>
                <ChevronDown size={20} style={{ transform: openFaq === idx ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
              </button>
              {openFaq === idx && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ color: 'var(--text-muted)', fontSize: '0.95rem', padding: '0 0 12px 0' }}
                >
                  {faq.a}
                </motion.p>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Support;
