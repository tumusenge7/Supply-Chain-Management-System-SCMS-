import { useState } from 'react';
import API from '../api';

export default function Reports() {
  const [period, setPeriod] = useState('daily');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/reports/${period}`);
      setData(res.data);
    } catch (err) {
      alert('Error fetching report');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Reports</h2>

      <div className="bg-white rounded-xl shadow p-6 mb-8 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Report Period</label>
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={period}
            onChange={e => { setPeriod(e.target.value); setData(null); }}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <button
          onClick={fetchReport}
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-medium transition"
        >
          {loading ? 'Loading...' : 'Generate Report'}
        </button>
      </div>

      {data && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Total Suppliers', value: data.suppliers.length, color: 'bg-blue-100 text-blue-800' },
              { label: 'Shipments', value: data.shipments.length, color: 'bg-yellow-100 text-yellow-800' },
              { label: 'Deliveries', value: data.deliveries.length, color: 'bg-green-100 text-green-800' },
            ].map(card => (
              <div key={card.label} className={`rounded-xl p-6 ${card.color} text-center`}>
                <p className="text-4xl font-bold">{card.value}</p>
                <p className="text-sm font-medium mt-1">{card.label}</p>
              </div>
            ))}
          </div>

          <ReportTable title="Suppliers" headers={['Code', 'Name', 'Telephone', 'Address', 'Email']}
            rows={data.suppliers.map(s => [s.supplierCode, s.supplierName, s.telephone, s.address, s.email])} />

          <ReportTable title="Shipments" headers={['Number', 'Date', 'Status', 'Destination', 'Supplier Code']}
            rows={data.shipments.map(s => [s.shipmentNumber, s.shipmentDate?.split('T')[0], s.shipmentStatus, s.destination, s.supplierCode])} />

          <ReportTable title="Deliveries" headers={['Code', 'Date', 'Quantity', 'Status', 'Shipment']}
            rows={data.deliveries.map(d => [d.deliveryCode, d.deliveryDate?.split('T')[0], d.quantityDelivered, d.deliveryStatus, d.shipmentNumber])} />
        </div>
      )}
    </div>
  );
}

function ReportTable({ title, headers, rows }) {
  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            {headers.map(h => <th key={h} className="px-4 py-3 text-left text-gray-600 font-medium">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={headers.length} className="text-center py-6 text-gray-400">No data</td></tr>
          ) : rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              {row.map((cell, j) => <td key={j} className="px-4 py-2">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
