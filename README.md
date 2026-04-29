# KhiladiKing - Premium Betting Web Application

![KhiladiKing](https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=1200&q=80)

KhiladiKing is a modern, high-fidelity full-stack sports betting and casino gaming platform. It features a stunning glassmorphism UI, real-time sports odds simulations, interactive mock games, and a complete Node.js backend for wallet management.

## 🚀 Features

### **Frontend (React + Vite)**
- **Premium UI/UX:** Built with vanilla CSS variables and Framer Motion for buttery-smooth animations and a dark glassmorphism aesthetic.
- **Authentication:** Secure Login and Registration forms with password visibility toggles and error handling.
- **Wallet System:** Interactive Deposit and Withdrawal interfaces supporting UPI and Bank Transfer mockups.
- **Sports Betting:** Live IPL match dashboard with an interactive Bet Slip drawer calculating potential returns based on live odds.
- **Interactive Games:**
  - **Aviator:** Real-time multiplier crash simulation.
  - **Mines:** 5x5 playable grid with progressive cash-out logic.
  - **Color Trading:** 3-minute countdown timer with color betting mechanics.
- **User Dashboard:** Profile summary and detailed transaction history with animated filtering.

### **Backend (Node.js + Express + SQLite)**
- **Stateless Authentication:** JWT-based login and registration system with Bcrypt password hashing.
- **Wallet API:** Real-time balance fetching, deposit logging, and withdrawal deductions.
- **Transaction History:** All bets, wins, deposits, and withdrawals are securely stored and fetched from an SQLite database.
- **Game Logic API:** APIs to deduct stakes upon starting a game (`/api/games/bet`) and credit winnings upon cashing out (`/api/games/win`).

## 🛠️ Technology Stack

- **Frontend:** React 19, React Router v7, Framer Motion, Lucide React, Vite
- **Backend:** Node.js, Express.js
- **Database:** SQLite3
- **Security:** JSON Web Tokens (JWT), Bcrypt, dotenv
- **Dev Tools:** Concurrently

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd khiladiKing
   ```

2. **Install dependencies**:
   ```bash
   npm install
   cd server && npm install
   cd ..
   ```

3. **Configure Environment Variables**:
   Create a `.env` in the root directory:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```
   Create a `.env` in the `server/` directory:
   ```env
   PORT=3000
   JWT_SECRET=your_super_secret_key
   ```

### Running the App

Start both the frontend and backend servers simultaneously:
```bash
npm start
```
- The **Frontend** will be running at `http://localhost:5173`
- The **Backend API** will be running at `http://localhost:3000`

## 🎮 How to Play
1. Navigate to the frontend URL and register a new account.
2. You will instantly receive a **₹5,000 Sign-up Bonus** in your SQLite database profile.
3. Place a bet on an IPL match or launch a Casino game. Watch your actual backend balance update in real-time as you win or lose!
