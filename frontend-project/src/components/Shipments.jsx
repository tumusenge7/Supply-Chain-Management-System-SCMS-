import { useState, useEffect } from 'react';
import API from '../api';

const empty = { shipmentNumber: '', shipmentDate: '', shipmentStatus: '', destination: '', supplierCode: '' };

export default function Shipments() {
  const [shipments, setShipments] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');

  const load = () => API.get('/shipments').then(r => setShipments(r.data));
  useEffect(() => {
    load();
    API.get('/suppliers').then(r => setSuppliers(r.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await API.put(`/shipments/${editing}`, form);
        setMsg('Shipment updated successfully!');
        setEditing(null);
      } else {
        await API.post('/shipments', form);
        setMsg('Shipment added successfully!');
      }
      setForm(empty);
      load();
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error saving shipment');
    }
  };

  const handleEdit = (s) => {
    setEditing(s.shipmentNumber);
    setForm({
      shipmentNumber: s.shipmentNumber,
      shipmentDate: s.shipmentDate?.split('T')[0] || '',
      shipmentStatus: s.shipmentStatus,
      destination: s.destination,
      supplierCode: s.supplierCode,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this shipment?')) return;
    try {
      await API.delete(`/shipments/${id}`);
      setMsg('Shipment deleted.');
      load();
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error deleting');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Shipments</h2>

      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">{editing ? 'Edit Shipment' : 'Add Shipment'}</h3>
        {msg && <p className={`mb-3 text-sm p-2 rounded ${msg.includes('success') || msg.includes('deleted') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{msg}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Shipment Number</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.shipmentNumber}
              onChange={e => setForm({ ...form, shipmentNumber: e.target.value })}
              disabled={!!editing}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Shipment Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.shipmentDate}
              onChange={e => setForm({ ...form, shipmentDate: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.shipmentStatus}
              onChange={e => setForm({ ...form, shipmentStatus: e.target.value })}
              required
            >
              <option value="">Select status</option>
              {['Pending', 'In Transit', 'Delivered', 'Cancelled'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Destination</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.destination}
              onChange={e => setForm({ ...form, destination: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Supplier</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.supplierCode}
              onChange={e => setForm({ ...form, supplierCode: e.target.value })}
              required
            >
              <option value="">Select supplier</option>
              {suppliers.map(s => (
                <option key={s.supplierCode} value={s.supplierCode}>{s.supplierName}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-medium transition">
              {editing ? 'Update' : 'Add'} Shipment
            </button>
            {editing && (
              <button type="button" onClick={() => { setEditing(null); setForm(empty); }} className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-medium transition">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-blue-900 text-white">
            <tr>
              {['Number', 'Date', 'Status', 'Destination', 'Supplier', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shipments.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-6 text-gray-400">No shipments found</td></tr>
            ) : shipments.map((s, i) => (
              <tr key={s.shipmentNumber} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-4 py-2">{s.shipmentNumber}</td>
                <td className="px-4 py-2">{s.shipmentDate?.split('T')[0]}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    s.shipmentStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                    s.shipmentStatus === 'In Transit' ? 'bg-yellow-100 text-yellow-700' :
                    s.shipmentStatus === 'Cancelled' ? 'bg-red-100 text-red-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>{s.shipmentStatus}</span>
                </td>
                <td className="px-4 py-2">{s.destination}</td>
                <td className="px-4 py-2">{s.supplierName}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button onClick={() => handleEdit(s)} className="text-blue-600 hover:underline text-xs">Edit</button>
                  <button onClick={() => handleDelete(s.shipmentNumber)} className="text-red-600 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
