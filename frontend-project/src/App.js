import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Suppliers from './components/Suppliers';
import Shipments from './components/Shipments';
import Deliveries from './components/Deliveries';
import Reports from './components/Reports';

export default function App() {
  const [username, setUsername] = useState(localStorage.getItem('username'));

  const handleLogin = (name) => setUsername(name);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername(null);
  };

  if (!username) return <Login onLogin={handleLogin} />;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navbar username={username} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Navigate to="/suppliers" />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/shipments" element={<Shipments />} />
          <Route path="/deliveries" element={<Deliveries />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
