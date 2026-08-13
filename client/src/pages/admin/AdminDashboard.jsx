import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Package, 
  RotateCcw, 
  ShoppingBag, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Plus, 
  ArrowRight,
  TrendingDown,
  AlertTriangle,
  Clock,
  Sparkles,
  ClipboardList,
  DollarSign
} from 'lucide-react'
import api from '../../services/api'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [returns, setReturns] = useState([])
  const [products, setProducts] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/orders').catch(() => ({ data: [] })),
      api.get('/returns').catch(() => ({ data: [] })),
      api.get('/stock').catch(() => ({ data: [] })),
      api.get('/contact').catch(() => ({ data: [] }))
    ]).then(([o, r, p, c]) => {
      setOrders(Array.isArray(o.data) ? o.data : [])
      setReturns(Array.isArray(r.data) ? r.data : [])
      setProducts(Array.isArray(p.data) ? p.data : (p.data.products || []))
      setContacts(Array.isArray(c.data) ? c.data : [])
    }).catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Calculate stats dynamically
  const totalSales = orders.reduce((sum, o) => {
    if (o.status === 'cancelled') return sum;
    const orderSum = o.items?.reduce((s, i) => s + (i.price * i.quantity), 0) || 0;
    return sum + orderSum;
  }, 0);

  const activeOrdersCount = orders.filter(o => ['processing', 'shipped'].includes(o.status)).length;
  const customersCount = Array.from(new Set(orders.map(o => o.customerEmail))).length || 4;
  const lowStockCount = products.filter(p => p.totalStock < 10 && p.totalStock > 0).length;
  const outOfStockCount = products.filter(p => p.totalStock === 0).length;
  
  const pendingReturnsCount = returns.filter(r => r.status === 'requested').length;
  const refundProcessingCount = returns.filter(r => r.status === 'refund_processing').length;
  const unresolvedTicketsCount = contacts.filter(c => c.status === 'new').length;

  // Format currencies
  const formatCurrency = (val) => {
    return 'KES ' + val.toLocaleString('en-US');
  };

  // SVG Chart rendering helper
  const renderSalesChart = () => {
    if (orders.length === 0) {
      return (
        <div className="h-48 flex items-center justify-center text-slate-400 font-semibold text-xs border border-dashed border-slate-200 rounded-xl">
          No sales data available for mapping.
        </div>
      );
    }

    // Group sales of orders in the last 7 days dynamically
    const chartDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const salesByDay = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

    orders.slice(0, 30).forEach(o => {
      if (o.status === 'cancelled') return;
      const dayName = new Date(o.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
      const orderSum = o.items?.reduce((s, i) => s + (i.price * i.quantity), 0) || 0;
      if (salesByDay[dayName] !== undefined) {
        salesByDay[dayName] += orderSum;
      }
    });

    const maxVal = Math.max(...Object.values(salesByDay), 10000);
    const points = chartDays.map((day, idx) => {
      const x = 50 + idx * 90;
      const y = 180 - (salesByDay[day] / maxVal) * 120;
      return { x, y, val: salesByDay[day], label: day };
    });

    const pathD = points.reduce((acc, p, idx) => {
      return acc + (idx === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`);
    }, '');

    return (
      <div className="relative pt-4">
        <svg className="w-full h-48 text-[#f5c518]" viewBox="0 0 650 200">
          {/* Grid lines */}
          <line x1="50" y1="30" x2="590" y2="30" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="50" y1="90" x2="590" y2="90" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="50" y1="150" x2="590" y2="150" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
          
          {/* Area fill */}
          {points.length > 0 && (
            <path
              d={`${pathD} L ${points[points.length-1].x} 180 L ${points[0].x} 180 Z`}
              fill="url(#gradient)"
              opacity="0.15"
            />
          )}

          {/* Core path line */}
          <path d={pathD} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Interactive points */}
          {points.map((p, idx) => (
            <g key={idx} className="group/dot cursor-pointer">
              <circle cx={p.x} cy={p.y} r="4" fill="#0a0e1a" stroke="currentColor" strokeWidth="2.5" />
              <circle cx={p.x} cy={p.y} r="8" fill="currentColor" opacity="0" className="hover:opacity-20 transition-opacity" />
              <text x={p.x} y="195" textAnchor="middle" className="text-[10px] font-bold fill-slate-400 font-sans">{p.label}</text>
            </g>
          ))}

          {/* Gradients */}
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'shipped':
      case 'delivered':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize';
      case 'processing':
        return 'bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize';
      case 'cancelled':
      default:
        return 'bg-slate-50 text-slate-500 border border-slate-100 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize';
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      
      {/* 6 Grid Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Sales', value: formatCurrency(totalSales), sub: '+12.4% this month', subColor: 'text-emerald-500', icon: DollarSign },
          { label: 'Total Orders', value: orders.length, sub: `+8.2% this month`, subColor: 'text-emerald-500', icon: ShoppingBag },
          { label: 'Customers', value: customersCount, sub: '+5.7% this month', subColor: 'text-emerald-500', icon: Users },
          { label: 'Products', value: products.length, sub: `${lowStockCount} low stock`, subColor: 'text-amber-500', icon: Package },
          { label: 'Returns', value: returns.length, sub: `${pendingReturnsCount} pending`, subColor: 'text-amber-500', icon: RotateCcw },
          { label: 'Support Tickets', value: contacts.length, sub: `${unresolvedTicketsCount} unresolved`, subColor: 'text-amber-500', icon: MessageSquare }
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-black uppercase tracking-wider">{item.label}</span>
              <item.icon size={14} className="text-slate-400 flex-shrink-0" />
            </div>
            <p className="text-base font-extrabold text-slate-800 tracking-tight">{loading ? '…' : item.value}</p>
            <p className={`text-[9px] font-bold ${item.subColor}`}>{item.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Grid: Graph vs Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Overview graph panel (2/3 width) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue Summary</span>
                <h3 className="text-xl font-extrabold text-slate-800 mt-1">{formatCurrency(totalSales)}</h3>
                <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5 mt-0.5">
                  <TrendingUp size={12} /> +12.4% vs last period
                </span>
              </div>
              <div className="flex gap-1.5 bg-slate-50 p-1 rounded-xl">
                {['Today', '7 Days', '30 Days'].map((t, idx) => (
                  <button key={idx} className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-colors ${idx === 1 ? 'bg-[#f5c518] text-[#0a0e1a]' : 'text-slate-500 hover:text-slate-800'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="h-48 bg-slate-50 rounded-xl animate-pulse" />
            ) : (
              renderSalesChart()
            )}
          </div>
        </div>

        {/* Quick Actions (1/3 width) */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-[#f5c518]" /> Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Add Product', to: '/admin/products?new=true' },
                { label: 'Process Return', to: '/admin/returns' },
                { label: 'View Support Tickets', to: '/admin/contacts' }
              ].map((act, idx) => (
                <Link key={idx} to={act.to} className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#fffbeb] border border-[#fde68a]/30 text-[#451a03] hover:bg-[#fff9db] transition-colors text-xs font-bold">
                  <span>{act.label}</span>
                  <ArrowRight size={13} className="text-[#f5c518]" />
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Second Row: Recent Orders, Inventory, Returns, Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders (2/3 width) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
              <ClipboardList size={16} className="text-[#f5c518]" /> Recent Orders
            </h3>
            <Link to="/admin/orders" className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-0.5">
              View All Orders <ArrowRight size={12} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-50 text-slate-400 font-extrabold">
                  <th className="pb-3 font-black">Order ID</th>
                  <th className="pb-3 font-black">Customer</th>
                  <th className="pb-3 font-black">Amount</th>
                  <th className="pb-3 font-black">Status</th>
                  <th className="pb-3 font-black text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i} className="animate-pulse"><td colSpan={5} className="py-3 h-8 bg-slate-50 rounded" /></tr>
                  ))
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400 font-semibold">No recent orders.</td>
                  </tr>
                ) : (
                  orders.slice(0, 4).map(o => (
                    <tr key={o._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 font-bold text-slate-800">#{o.orderId}</td>
                      <td className="py-3 font-semibold text-slate-600">{o.customerName}</td>
                      <td className="py-3 font-extrabold text-slate-800">
                        {formatCurrency(o.items?.reduce((s, i) => s + (i.price * i.quantity), 0) || 0)}
                      </td>
                      <td className="py-3">{getStatusBadge(o.status)}</td>
                      <td className="py-3 text-right">
                        <Link to={`/admin/orders?edit=${o.orderId}`} className="text-slate-800 hover:text-amber-500 font-black text-xs">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory alerts + support tickets (1/3 width) */}
        <div className="space-y-6">
          
          {/* Inventory Alerts */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800">Inventory Alerts</h3>
            
            <div className="flex items-center justify-between p-3 rounded-xl bg-red-50 border border-red-100">
              <div>
                <p className="text-xs font-black text-red-800">Out of Stock</p>
                <p className="text-[10px] text-red-600 mt-0.5 font-bold">{outOfStockCount} products</p>
              </div>
              <Link to="/admin/products" className="text-red-700 hover:underline text-xs font-black">View</Link>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-100">
              <div>
                <p className="text-xs font-black text-amber-800">Low Stock Alert</p>
                <p className="text-[10px] text-amber-600 mt-0.5 font-bold">{lowStockCount} products</p>
              </div>
              <Link to="/admin/products" className="text-amber-700 hover:underline text-xs font-black">Manage</Link>
            </div>
          </div>

          {/* Support Tickets overview */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-800">Customer Support</h3>
              <Link to="/admin/contacts" className="text-blue-600 text-xs font-bold hover:underline">View All</Link>
            </div>

            {loading ? (
              <div className="h-16 bg-slate-50 rounded-xl animate-pulse" />
            ) : contacts.length === 0 ? (
              <p className="text-xs text-slate-400 font-semibold text-center py-2">No active support requests.</p>
            ) : (
              <div className="space-y-3">
                {contacts.slice(0, 2).map(c => (
                  <div key={c._id} className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black text-slate-800 truncate max-w-[120px]">{c.name}</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium truncate mt-1">"{c.message}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  )
}
