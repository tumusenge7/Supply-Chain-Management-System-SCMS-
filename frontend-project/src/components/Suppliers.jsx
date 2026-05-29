import { useState, useEffect } from 'react';
import API from '../api';

const empty = { supplierCode: '', supplierName: '', telephone: '', address: '', email: '' };

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState('');

  const load = () => API.get('/suppliers').then(r => setSuppliers(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/suppliers', form);
      setMsg('Supplier added successfully!');
      setForm(empty);
      load();
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error adding supplier');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Suppliers</h2>

      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Add Supplier</h3>
        {msg && <p className={`mb-3 text-sm p-2 rounded ${msg.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{msg}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'supplierCode', label: 'Supplier Code' },
            { name: 'supplierName', label: 'Supplier Name' },
            { name: 'telephone', label: 'Telephone' },
            { name: 'address', label: 'Address' },
            { name: 'email', label: 'Email', type: 'email' },
          ].map(f => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-gray-600 mb-1">{f.label}</label>
              <input
                type={f.type || 'text'}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form[f.name]}
                onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                required
              />
            </div>
          ))}
          <div className="md:col-span-2">
            <button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-medium transition">
              Add Supplier
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-blue-900 text-white">
            <tr>
              {['Code', 'Name', 'Telephone', 'Address', 'Email'].map(h => (
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {suppliers.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-6 text-gray-400">No suppliers found</td></tr>
            ) : suppliers.map((s, i) => (
              <tr key={s.supplierCode} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-4 py-2">{s.supplierCode}</td>
                <td className="px-4 py-2">{s.supplierName}</td>
                <td className="px-4 py-2">{s.telephone}</td>
                <td className="px-4 py-2">{s.address}</td>
                <td className="px-4 py-2">{s.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
