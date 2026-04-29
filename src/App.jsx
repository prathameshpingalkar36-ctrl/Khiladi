import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AdminLogin from './pages/Auth/AdminLogin';
import Deposit from './pages/Wallet/Deposit';
import Withdraw from './pages/Wallet/Withdraw';
import TransactionHistory from './pages/Wallet/TransactionHistory';
import IPL from './pages/Sports/IPL';
import GameView from './pages/Games/GameView';
import Profile from './pages/Profile';
import ReferEarn from './pages/ReferEarn';
import Leaderboard from './pages/Leaderboard';
import Support from './pages/Support';
import AdminDashboard from './pages/Admin/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="sports/ipl" element={<IPL />} />
          <Route path="games/:gameId" element={<GameView />} />
          <Route path="deposit" element={<Deposit />} />
          <Route path="withdraw" element={<Withdraw />} />
          <Route path="history" element={<TransactionHistory />} />
          <Route path="profile" element={<Profile />} />
          <Route path="refer" element={<ReferEarn />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="support" element={<Support />} />
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
        {/* Auth routes without standard layout for cleaner look */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
