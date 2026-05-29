import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/suppliers', label: 'Suppliers' },
  { to: '/shipments', label: 'Shipments' },
  { to: '/deliveries', label: 'Deliveries' },
  { to: '/reports', label: 'Reports' },
];

export default function Navbar({ username, onLogout }) {
  const location = useLocation();

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xl font-bold tracking-wide">SupplyNet SCMS</span>
        <div className="flex flex-wrap gap-2 items-center">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                location.pathname.startsWith(l.to)
                  ? 'bg-white text-blue-900'
                  : 'hover:bg-blue-700'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <span className="text-sm text-blue-200 ml-2">Hi, {username}</span>
          <button
            onClick={onLogout}
            className="px-4 py-1.5 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
