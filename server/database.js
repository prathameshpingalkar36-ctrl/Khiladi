const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function getDbConnection() {
  return open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
}

async function initializeDb() {
  const db = await getDbConnection();
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      balance REAL DEFAULT 0.0,
      isAdmin BOOLEAN DEFAULT 0,
      referral_code TEXT UNIQUE,
      referred_by TEXT,
      last_checkin DATETIME,
      xp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL, -- 'deposit', 'withdraw', 'bet', 'win'
      amount REAL NOT NULL,
      status TEXT DEFAULT 'Pending',
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `);
  
  console.log('Database initialized successfully.');
  
  // Migration: Ensure isAdmin column exists (using camelCase for consistency with previous Mongoose models)
  try {
    await db.exec('ALTER TABLE users ADD COLUMN isAdmin BOOLEAN DEFAULT 0');
    await db.exec('ALTER TABLE users ADD COLUMN referral_code TEXT UNIQUE');
    await db.exec('ALTER TABLE users ADD COLUMN referred_by TEXT');
    await db.exec('ALTER TABLE users ADD COLUMN last_checkin DATETIME');
    await db.exec('ALTER TABLE users ADD COLUMN xp INTEGER DEFAULT 0');
    await db.exec('ALTER TABLE users ADD COLUMN level INTEGER DEFAULT 1');
  } catch (err) {
    // Columns might already exist, ignore.
  }

  return db;
}

module.exports = {
  getDbConnection,
  initializeDb
};
