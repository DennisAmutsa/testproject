import { useState, useEffect } from 'react'
import { Users, Search, ShoppingBag, Mail } from 'lucide-react'
import api from '../../services/api'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders')
      .then(res => {
        if (Array.isArray(res.data)) {
          // Derive unique customers from orders
          const derived = {};
          res.data.forEach(o => {
            const email = o.customerEmail?.toLowerCase().trim();
            if (!email) return;
            const orderSum = o.items?.reduce((s, i) => s + (i.price * i.quantity), 0) || 0;
            if (derived[email]) {
              derived[email].ordersCount += 1;
              derived[email].totalSpent += orderSum;
            } else {
              derived[email] = {
                name: o.customerName || 'Anonymous',
                email: o.customerEmail,
                ordersCount: 1,
                totalSpent: orderSum,
                joined: new Date(o.createdAt).toLocaleDateString()
              };
            }
          });
          setCustomers(Object.values(derived));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-800 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Customer Directory</h1>
          <p className="text-slate-500 text-sm font-semibold mt-0.5">View customer registrations, purchase histories, and contact info</p>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search customers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500/50 transition-colors shadow-sm"
          />
          <Search size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-white border border-slate-100 rounded-2xl animate-pulse shadow-sm" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl text-center py-16 shadow-sm">
          <Users size={44} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-bold">No customers found.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-black">
                <th className="p-4">Customer</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Total Orders</th>
                <th className="p-4">Total Spent</th>
                <th className="p-4">Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-bold text-slate-850">{c.name}</td>
                  <td className="p-4 text-slate-600 font-semibold">{c.email}</td>
                  <td className="p-4 text-slate-600 font-semibold">{c.ordersCount} orders</td>
                  <td className="p-4 font-extrabold text-slate-800">KES {c.totalSpent.toLocaleString()}</td>
                  <td className="p-4 text-slate-450 font-medium">{c.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
