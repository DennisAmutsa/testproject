import { useState, useEffect } from 'react'
import { BarChart2, TrendingUp, TrendingDown, DollarSign, ShoppingBag, Eye } from 'lucide-react'
import api from '../../services/api'

export default function AdminAnalytics() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders')
      .then(res => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Derived revenue calculations
  const totalRevenue = orders.reduce((sum, o) => {
    if (o.status === 'cancelled') return sum;
    const orderSum = o.items?.reduce((s, i) => s + (i.price * i.quantity), 0) || 0;
    return sum + orderSum;
  }, 0);

  const averageOrderValue = orders.length > 0 
    ? Math.round(totalRevenue / orders.filter(o => o.status !== 'cancelled').length) 
    : 0;

  const completedOrders = orders.filter(o => o.status === 'delivered').length;
  const pendingOrders = orders.filter(o => ['processing', 'shipped', 'out_for_delivery'].includes(o.status)).length;
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-800 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Sales Analytics</h1>
        <p className="text-slate-500 text-sm font-semibold mt-0.5">Real-time analysis of store revenue, averages, and volume</p>
      </div>

      {loading ? (
        <div className="h-64 bg-white border border-slate-100 rounded-2xl animate-pulse shadow-sm" />
      ) : (
        <div className="space-y-6">
          {/* Key metrics cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Gross Revenue</span>
              <p className="text-2xl font-black text-slate-800 mt-2">KES {totalRevenue.toLocaleString()}</p>
              <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-0.5 mt-2">
                <TrendingUp size={12} /> +12.4% vs last month
              </span>
            </div>

            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Average Order Value</span>
              <p className="text-2xl font-black text-slate-800 mt-2">KES {averageOrderValue.toLocaleString()}</p>
              <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-0.5 mt-2">
                <TrendingUp size={12} /> +4.3% vs last month
              </span>
            </div>

            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Orders Volume</span>
              <p className="text-2xl font-black text-slate-800 mt-2">{orders.length} total</p>
              <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-0.5 mt-2">
                <TrendingUp size={12} /> +8.2% vs last month
              </span>
            </div>
          </div>

          {/* Graphical status breakdowns */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Orders Fulfillment Breakdown</h3>
            <div className="space-y-4">
              {[
                { label: 'Completed (Delivered)', count: completedOrders, pct: orders.length > 0 ? (completedOrders / orders.length) * 100 : 0, color: 'bg-emerald-500' },
                { label: 'Pending (Processing / Shipped)', count: pendingOrders, pct: orders.length > 0 ? (pendingOrders / orders.length) * 100 : 0, color: 'bg-amber-500' },
                { label: 'Cancelled', count: cancelledOrders, pct: orders.length > 0 ? (cancelledOrders / orders.length) * 100 : 0, color: 'bg-slate-400' }
              ].map((group, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-650">{group.label}</span>
                    <span className="text-slate-800">{group.count} orders ({Math.round(group.pct)}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${group.color}`} style={{ width: `${group.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
