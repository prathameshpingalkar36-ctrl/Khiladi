const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const getAuthToken = () => localStorage.getItem('token');
export const setAuthToken = (token) => localStorage.setItem('token', token);
export const removeAuthToken = () => localStorage.removeItem('token');
export const getUserInfo = () => JSON.parse(localStorage.getItem('user'));
export const setUserInfo = (user) => localStorage.setItem('user', JSON.stringify(user));

const request = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  
  return data;
};

// Auth
export const login = (phone, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ phone, password }) });
export const register = (name, phone, password) => request('/auth/register', { method: 'POST', body: JSON.stringify({ name, phone, password }) });
export const adminLogin = (email, password) => request('/auth/admin-login', { method: 'POST', body: JSON.stringify({ email, password }) });

// Wallet
export const getBalance = () => request('/wallet/balance');
export const getHistory = () => request('/wallet/history');
export const deposit = (amount, utr) => request('/wallet/deposit', { method: 'POST', body: JSON.stringify({ amount, utr }) });
export const withdraw = (amount, details) => request('/wallet/withdraw', { method: 'POST', body: JSON.stringify({ amount, details }) });

// Games
export const placeBet = (amount, gameName) => request('/games/bet', { method: 'POST', body: JSON.stringify({ amount, gameName }) });
export const processWin = (amount, gameName) => request('/games/win', { method: 'POST', body: JSON.stringify({ amount, gameName }) });

// Admin
export const getAdminUsers = () => request('/admin/users');
export const getAdminDeposits = () => request('/admin/deposits');
export const approveDeposit = (transactionId) => request('/admin/approve-deposit', { method: 'POST', body: JSON.stringify({ transactionId }) });
export const rejectDeposit = (transactionId) => request('/admin/reject-deposit', { method: 'POST', body: JSON.stringify({ transactionId }) });
export const getAdminWithdrawals = () => request('/admin/withdrawals');
export const approveWithdrawal = (transactionId) => request('/admin/approve-withdrawal', { method: 'POST', body: JSON.stringify({ transactionId }) });
export const rejectWithdrawal = (transactionId) => request('/admin/reject-withdrawal', { method: 'POST', body: JSON.stringify({ transactionId }) });
export const getAdminActivity = () => request('/admin/activity');
