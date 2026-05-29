import { useState } from 'react';
import API from '../api';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      onLogin(res.data.username);
    } catch {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-900 text-center mb-2">SupplyNet Ltd</h1>
        <p className="text-center text-gray-500 mb-6">Supply Chain Management System</p>
        {error && <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg transition">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
