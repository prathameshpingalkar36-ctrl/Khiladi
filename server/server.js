require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { getDbConnection, initializeDb } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'khiladiking_super_secret_key_2026';

app.use(cors());
app.use(express.json());

let db;
initializeDb().then(database => {
  db = database;
  console.log('Server connected to SQLite database');
  
  app.get('/api/admin/withdrawals', authenticateAdmin, async (req, res) => {
  try {
    const withdrawals = await db.all(
      `SELECT t.*, u.name, u.phone 
       FROM transactions t 
       JOIN users u ON t.user_id = u.id 
       WHERE t.type = 'withdraw' AND t.status = 'Pending'`
    );
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending withdrawals.' });
  }
});

app.post('/api/admin/approve-withdrawal', authenticateAdmin, async (req, res) => {
  const { transactionId } = req.body;
  try {
    const transaction = await db.get('SELECT * FROM transactions WHERE id = ?', [transactionId]);
    if (!transaction || transaction.status !== 'Pending') return res.status(400).json({ error: 'Invalid transaction.' });

    await db.run('UPDATE transactions SET status = ? WHERE id = ?', ['Completed', transactionId]);
    res.json({ message: 'Withdrawal approved successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve withdrawal.' });
  }
});

app.post('/api/admin/reject-withdrawal', authenticateAdmin, async (req, res) => {
  const { transactionId } = req.body;
  try {
    const transaction = await db.get('SELECT * FROM transactions WHERE id = ?', [transactionId]);
    if (!transaction || transaction.status !== 'Pending') return res.status(400).json({ error: 'Invalid transaction.' });

    await db.run('UPDATE transactions SET status = ? WHERE id = ?', ['Rejected', transactionId]);
    // Refund the user since the balance was deducted on request
    await db.run('UPDATE users SET balance = balance + ? WHERE id = ?', [transaction.amount, transaction.user_id]);

    res.json({ message: 'Withdrawal rejected and balance refunded.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject withdrawal.' });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const topWinners = await db.all('SELECT name, level, balance FROM users WHERE isAdmin = 0 ORDER BY balance DESC LIMIT 10');
    res.json(topWinners);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard.' });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const userCount = await db.get('SELECT COUNT(*) as count FROM users');
    const payoutSum = await db.get('SELECT SUM(amount) as sum FROM transactions WHERE type = "win" AND status = "Approved"');
    const gameCount = await db.get('SELECT COUNT(*) as count FROM transactions WHERE type = "bet"');
    
    res.json({
      totalUsers: userCount.count + 1200,
      totalPayouts: (payoutSum.sum || 0) + 450000,
      gamesPlayed: gameCount.count + 8500
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch platform stats.' });
  }
});

app.get('/api/admin/activity', authenticateAdmin, async (req, res) => {
  try {
    const activity = await db.all(`
      SELECT t.*, u.name as user_name 
      FROM transactions t 
      JOIN users u ON t.user_id = u.id 
      ORDER BY t.created_at DESC LIMIT 50
    `);
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity log.' });
  }
});

app.post('/api/user/daily-checkin', authenticateToken, async (req, res) => {
  try {
    const user = await db.get('SELECT last_checkin, balance FROM users WHERE id = ?', [req.user.id]);
    const now = new Date();
    const last = user.last_checkin ? new Date(user.last_checkin) : null;

    if (last && (now - last) < 24 * 60 * 60 * 1000) {
      const remaining = Math.ceil((24 * 60 * 60 * 1000 - (now - last)) / (60 * 60 * 1000));
      return res.status(400).json({ error: `Next bonus available in ${remaining} hours.` });
    }

    const bonus = 10.0;
    await db.run('UPDATE users SET balance = balance + ?, last_checkin = ? WHERE id = ?', [bonus, now.toISOString(), req.user.id]);
    await db.run('INSERT INTO transactions (user_id, type, amount, status, details) VALUES (?, "win", ?, "Approved", "Daily Login Bonus")', [req.user.id, bonus]);

    res.json({ message: 'Daily bonus claimed!', newBalance: user.balance + bonus });
  } catch (error) {
    console.error('Checkin error:', error);
    res.status(500).json({ error: 'Failed to claim daily bonus.' });
  }
});

app.get('/api/admin/users', authenticateAdmin, async (req, res) => {
  try {
    const users = await db.all('SELECT id, name, phone, balance, isAdmin, created_at FROM users ORDER BY created_at DESC');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

app.post('/api/admin/update-balance', authenticateAdmin, async (req, res) => {
  const { userId, amount } = req.body;
  try {
    await db.run('UPDATE users SET balance = ? WHERE id = ?', [amount, userId]);
    res.json({ message: 'Balance updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update balance.' });
  }
});

app.listen(PORT, () => {
    console.log(`Backend Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

// Email Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user;
    next();
  });
};

// Middleware to verify Admin
const authenticateAdmin = async (req, res, next) => {
  authenticateToken(req, res, async () => {
    try {
      // If it's the hardcoded admin ID from admin-login
      if (req.user.id === 'admin') {
        return next();
      }

      const user = await db.get('SELECT * FROM users WHERE id = ?', [req.user.id]);
      if (!user || !user.isAdmin) {
        return res.status(403).json({ error: 'Admin access required.' });
      }
      next();
    } catch (error) {
      console.error('Admin auth error:', error);
      res.status(500).json({ error: 'Failed to verify admin status.' });
    }
  });
};

// --- AUTH ROUTES ---

app.post('/api/auth/register', async (req, res) => {
  const { name, phone, password } = req.body;
  if (!name || !phone || !password) return res.status(400).json({ error: 'All fields are required.' });

  try {
    const existingUser = await db.get('SELECT * FROM users WHERE phone = ?', [phone]);
    if (existingUser) return res.status(400).json({ error: 'Phone number already registered.' });

    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const result = await db.run(
      'INSERT INTO users (name, phone, password, balance, isAdmin, referral_code, referred_by) VALUES (?, ?, ?, 0, 0, ?, ?)',
      [name, phone, hashedPassword, referralCode, req.body.referredBy || null]
    );

    const user = { id: result.lastID, name, phone, balance: 0, isAdmin: 0, referral_code: referralCode };
    const token = jwt.sign({ id: user.id, phone: user.phone }, JWT_SECRET);
    
    res.status(201).json({ message: 'User registered successfully', token, user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { phone, password } = req.body;
  try {
    const user = await db.get('SELECT * FROM users WHERE phone = ?', [phone]);
    if (!user) return res.status(400).json({ error: 'Invalid phone number or password.' });
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid phone number or password.' });

    const token = jwt.sign({ id: user.id, phone: user.phone }, JWT_SECRET);
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login.' });
  }
});

app.post('/api/auth/admin-login', async (req, res) => {
  const { email, password } = req.body;
  // Keep the hardcoded admin for now as requested by the original code's logic
  if (email === 'prathameshpingalkar45@gmail.com' && password === 'Prathamesh@123') {
    const token = jwt.sign({ id: 'admin', email, isAdmin: true }, JWT_SECRET);
    res.json({ token, user: { email, isAdmin: true, name: 'Main Admin' } });
  } else {
    res.status(401).json({ error: 'Invalid admin credentials.' });
  }
});

// --- WALLET ROUTES ---

app.get('/api/wallet/balance', authenticateToken, async (req, res) => {
  try {
    if (req.user.id === 'admin') {
      return res.json({ balance: 999999 }); // Admin has infinite demo balance
    }
    const user = await db.get('SELECT balance FROM users WHERE id = ?', [req.user.id]);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ balance: user.balance });
  } catch (error) {
    console.error('Balance fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch balance.' });
  }
});

app.post('/api/wallet/deposit', authenticateToken, async (req, res) => {
  const { amount, utr } = req.body;
  try {
    const user = await db.get('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (!user) return res.status(404).json({ error: 'User not found. Please log out and log in again.' });

    const result = await db.run(
      'INSERT INTO transactions (user_id, type, amount, status, details) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, 'deposit', Number(amount), 'Pending', `UTR: ${utr}`]
    );
    const transactionId = result.lastID;

    // Send Notification Email to Admin
    const approveLink = `http://localhost:3000/api/admin/approve-deposit-email?transactionId=${transactionId}`;

    // Log the link to console regardless (helpful for dev if email fails)
    console.log('\n--- NEW DEPOSIT REQUEST ---');
    console.log(`User: ${user.name} (${user.phone})`);
    console.log(`Amount: ₹${amount}`);
    console.log(`Approve Link: ${approveLink}`);
    console.log('---------------------------\n');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'prathameshpingalkar45@gmail.com',
      subject: 'New Deposit Request - KhiladiKing',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">New Deposit Request</h2>
          <p><strong>User:</strong> ${user.name} (${user.phone})</p>
          <p><strong>Amount:</strong> ₹${amount}</p>
          <p><strong>UTR:</strong> ${utr}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <a href="${approveLink}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Approve Deposit</a>
          <p style="margin-top: 20px; font-size: 0.8rem; color: #666;">Clicking this link will immediately credit the user's account.</p>
        </div>
      `
    };

    if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your_email@gmail.com') {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error('Email send error:', err.message);
          console.log('Check your .env credentials. Using Gmail? Use an App Password.');
        } else {
          console.log('Email sent successfully:', info.response);
        }
      });
    } else {
      console.log('Skipping email send: EMAIL_USER is not configured in .env');
    }

    res.json({ message: 'Deposit request sent. Waiting for admin approval.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process deposit request.' });
  }
});

app.post('/api/wallet/withdraw', authenticateToken, async (req, res) => {
  const { amount, details } = req.body;
  try {
    const user = await db.get('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    
    if (user.balance < Number(amount)) {
      return res.status(400).json({ error: 'Insufficient balance.' });
    }

    // Deduct balance immediately
    await db.run('UPDATE users SET balance = balance - ? WHERE id = ?', [Number(amount), req.user.id]);

    const result = await db.run(
      'INSERT INTO transactions (user_id, type, amount, status, details) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, 'withdraw', Number(amount), 'Pending', details]
    );
    
    res.json({ message: 'Withdrawal request submitted.', balance: user.balance - Number(amount) });
  } catch (error) {
    console.error('Withdrawal error:', error);
    res.status(500).json({ error: 'Failed to process withdrawal.' });
  }
});

app.get('/api/wallet/history', authenticateToken, async (req, res) => {
  try {
    const transactions = await db.all(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history.' });
  }
});

// --- GAMES ROUTES ---

app.post('/api/games/bet', authenticateToken, async (req, res) => {
  const { amount, gameName } = req.body;
  const numAmount = parseFloat(amount);
  const betAmount = Number(amount);
  
  try {
    const user = await db.get('SELECT balance FROM users WHERE id = ?', [req.user.id]);
    if (user.balance < betAmount) return res.status(400).json({ error: 'Insufficient balance.' });

    const xpGain = Math.floor(betAmount / 10);
    await db.run('UPDATE users SET balance = balance - ?, xp = xp + ? WHERE id = ?', [betAmount, xpGain, req.user.id]);
    
    const updatedUser = await db.get('SELECT xp FROM users WHERE id = ?', [req.user.id]);
    const newLevel = Math.floor(Math.sqrt(updatedUser.xp / 100)) + 1;
    await db.run('UPDATE users SET level = ? WHERE id = ?', [newLevel, req.user.id]);
    
    await db.run(
      'INSERT INTO transactions (user_id, type, amount, status, details) VALUES (?, "bet", ?, "Approved", ?)',
      [req.user.id, betAmount, gameName]
    );

    res.json({ message: 'Bet placed successfully', balance: user.balance - betAmount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to place bet.' });
  }
});

app.post('/api/games/win', authenticateToken, async (req, res) => {
  const { amount, gameName, details } = req.body;
  
  try {
    const winAmount = Number(amount);
    const xpBonus = Math.floor(winAmount / 20); // 5 XP per 100 win
    
    await db.run('UPDATE users SET balance = balance + ?, xp = xp + ? WHERE id = ?', [winAmount, xpBonus, req.user.id]);
    
    // Recalculate Level
    const user = await db.get('SELECT balance, xp FROM users WHERE id = ?', [req.user.id]);
    const newLevel = Math.floor(Math.sqrt(user.xp / 100)) + 1;
    await db.run('UPDATE users SET level = ? WHERE id = ?', [newLevel, req.user.id]);

    await db.run(
      'INSERT INTO transactions (user_id, type, amount, status, details) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, 'win', winAmount, 'Approved', details || gameName]
    );

    res.json({ message: 'Win processed successfully', balance: user.balance + winAmount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process win.' });
  }
});

// --- ADMIN ROUTES ---

app.get('/api/admin/users', authenticateAdmin, async (req, res) => {
  try {
    const users = await db.all('SELECT id, name, phone, balance, isAdmin FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

app.get('/api/admin/deposits', authenticateAdmin, async (req, res) => {
  try {
    const deposits = await db.all(
      `SELECT t.*, u.name, u.phone 
       FROM transactions t 
       JOIN users u ON t.user_id = u.id 
       WHERE t.type = 'deposit' AND t.status = 'Pending'`
    );
    res.json(deposits);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending deposits.' });
  }
});

app.get('/api/admin/approve-deposit-email', async (req, res) => {
  const { transactionId } = req.query;
  try {
    const transaction = await db.get('SELECT * FROM transactions WHERE id = ?', [transactionId]);
    if (!transaction || transaction.status !== 'Pending') {
      return res.send('<h1>Invalid or already processed transaction.</h1>');
    }

    await db.run('UPDATE transactions SET status = ? WHERE id = ?', ['Approved', transactionId]);
    await db.run('UPDATE users SET balance = balance + ? WHERE id = ?', [transaction.amount, transaction.user_id]);

    res.send(`
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h1 style="color: #10b981;">✅ Deposit Approved!</h1>
        <p>Transaction ID: ${transactionId} has been successfully processed.</p>
        <p>User balance has been updated.</p>
        <a href="http://localhost:5173/admin" style="color: #2563eb; text-decoration: none;">Go to Admin Dashboard</a>
      </div>
    `);
  } catch (error) {
    console.error('Email approval error:', error);
    res.status(500).send('<h1>Server error during approval.</h1>');
  }
});

app.post('/api/admin/approve-deposit', authenticateAdmin, async (req, res) => {
  const { transactionId } = req.body;
  try {
    const transaction = await db.get('SELECT * FROM transactions WHERE id = ?', [transactionId]);
    if (!transaction || transaction.status !== 'Pending') return res.status(400).json({ error: 'Invalid transaction.' });

    await db.run('UPDATE transactions SET status = ? WHERE id = ?', ['Approved', transactionId]);
    await db.run('UPDATE users SET balance = balance + ? WHERE id = ?', [transaction.amount, transaction.user_id]);

    res.json({ message: 'Deposit approved successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve deposit.' });
  }
});

app.post('/api/admin/reject-deposit', authenticateAdmin, async (req, res) => {
  const { transactionId } = req.body;
  try {
    const transaction = await db.get('SELECT * FROM transactions WHERE id = ?', [transactionId]);
    if (!transaction || transaction.status !== 'Pending') return res.status(400).json({ error: 'Invalid transaction.' });

    await db.run('UPDATE transactions SET status = ? WHERE id = ?', ['Rejected', transactionId]);

    res.json({ message: 'Deposit rejected successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject deposit.' });
  }
});

