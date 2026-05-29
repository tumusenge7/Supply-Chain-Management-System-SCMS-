import { useState, useEffect } from 'react';
import API from '../api';

const empty = { deliveryCode: '', deliveryDate: '', quantityDelivered: '', deliveryStatus: '', shipmentNumber: '' };

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');

  const load = () => API.get('/deliveries').then(r => setDeliveries(r.data));
  useEffect(() => {
    load();
    API.get('/shipments').then(r => setShipments(r.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await API.put(`/deliveries/${editing}`, form);
        setMsg('Delivery updated successfully!');
        setEditing(null);
      } else {
        await API.post('/deliveries', form);
        setMsg('Delivery added successfully!');
      }
      setForm(empty);
      load();
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error saving delivery');
    }
  };

  const handleEdit = (d) => {
    setEditing(d.deliveryCode);
    setForm({
      deliveryCode: d.deliveryCode,
      deliveryDate: d.deliveryDate?.split('T')[0] || '',
      quantityDelivered: d.quantityDelivered,
      deliveryStatus: d.deliveryStatus,
      shipmentNumber: d.shipmentNumber,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this delivery?')) return;
    try {
      await API.delete(`/deliveries/${id}`);
      setMsg('Delivery deleted.');
      load();
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error deleting');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Deliveries</h2>

      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">{editing ? 'Edit Delivery' : 'Add Delivery'}</h3>
        {msg && <p className={`mb-3 text-sm p-2 rounded ${msg.includes('success') || msg.includes('deleted') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{msg}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Delivery Code</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.deliveryCode}
              onChange={e => setForm({ ...form, deliveryCode: e.target.value })}
              disabled={!!editing}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Delivery Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.deliveryDate}
              onChange={e => setForm({ ...form, deliveryDate: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Quantity Delivered</label>
            <input
              type="number"
              min="1"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.quantityDelivered}
              onChange={e => setForm({ ...form, quantityDelivered: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.deliveryStatus}
              onChange={e => setForm({ ...form, deliveryStatus: e.target.value })}
              required
            >
              <option value="">Select status</option>
              {['Pending', 'Delivered', 'Failed', 'Returned'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Shipment</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.shipmentNumber}
              onChange={e => setForm({ ...form, shipmentNumber: e.target.value })}
              required
            >
              <option value="">Select shipment</option>
              {shipments.map(s => (
                <option key={s.shipmentNumber} value={s.shipmentNumber}>{s.shipmentNumber} - {s.destination}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-medium transition">
              {editing ? 'Update' : 'Add'} Delivery
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
              {['Code', 'Date', 'Quantity', 'Status', 'Shipment', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deliveries.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-6 text-gray-400">No deliveries found</td></tr>
            ) : deliveries.map((d, i) => (
              <tr key={d.deliveryCode} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-4 py-2">{d.deliveryCode}</td>
                <td className="px-4 py-2">{d.deliveryDate?.split('T')[0]}</td>
                <td className="px-4 py-2">{d.quantityDelivered}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    d.deliveryStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                    d.deliveryStatus === 'Failed' ? 'bg-red-100 text-red-600' :
                    d.deliveryStatus === 'Returned' ? 'bg-orange-100 text-orange-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>{d.deliveryStatus}</span>
                </td>
                <td className="px-4 py-2">{d.shipmentNumber}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button onClick={() => handleEdit(d)} className="text-blue-600 hover:underline text-xs">Edit</button>
                  <button onClick={() => handleDelete(d.deliveryCode)} className="text-red-600 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
