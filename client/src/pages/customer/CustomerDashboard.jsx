import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  Package, 
  RotateCcw, 
  CheckCircle, 
  Clock, 
  HelpCircle, 
  Bell, 
  Search, 
  ChevronRight, 
  ArrowRight, 
  Headphones,
  ShoppingBag,
  TrendingUp
} from 'lucide-react'
import api from '../../services/api'
import Sidebar from '../../components/Sidebar'

export default function CustomerDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [returns, setReturns] = useState([])
  const [productsCount, setProductsCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/orders/my').catch(() => ({ data: [] })),
      api.get('/returns/my').catch(() => ({ data: [] })),
      api.get('/stock').catch(() => ({ data: { total: 0 } })),
    ]).then(([o, r, p]) => {
      setOrders(o.data)
      setReturns(r.data)
      setProductsCount(p.data.total || p.data.products?.length || 0)
    }).finally(() => setLoading(false))
  }, [])

  const activeOrdersCount = orders.filter(o => ['processing', 'shipped', 'out_for_delivery'].includes(o.status)).length
  const activeReturnsCount = returns.filter(r => ['requested', 'approved', 'received', 'refund_processing'].includes(r.status)).length
  const pendingRefundsCount = returns.filter(r => r.status === 'refund_processing').length

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'shipped':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
      case 'delivered':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
      case 'processing':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border border-red-500/20'
      default:
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      {/* Sidebar - Dark theme overrides specifically for Sidebar inside white dashboard layout */}
      <Sidebar />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-navy font-bold text-sm">
              👋
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                Hello, {user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-gray-500 text-xs mt-0.5">Welcome to your Northstar Retail support dashboard.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold">3</span>
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="w-9 h-9 rounded-full bg-[#0d1321] text-brand-gold flex items-center justify-center font-bold text-xs">
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-gray-700 hidden sm:inline">{user?.name?.split(' ')[0]}</span>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 p-6 sm:p-8 space-y-6">

          {/* Banner alert */}
          <div className="bg-[#fffbeb] border border-[#fde68a] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-gold/15 rounded-xl flex items-center justify-center text-brand-navy flex-shrink-0">
                <Package size={20} className="text-brand-navy" />
              </div>
              <div>
                <p className="text-gray-800 font-semibold text-sm">Track, manage and get help for your orders — all in one place.</p>
              </div>
            </div>
            <Link to="/help" className="inline-flex items-center gap-1.5 bg-[#0d1321] text-white hover:bg-[#1a2340] font-bold px-4 py-2 rounded-lg text-xs transition-colors whitespace-nowrap">
              View Help Topics <ArrowRight size={13} />
            </Link>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Active orders', value: activeOrdersCount, labelFull: 'My Orders', icon: ShoppingBag, color: 'bg-amber-500/10 text-amber-500', link: '/dashboard/orders' },
              { label: 'Return request', value: activeReturnsCount, labelFull: 'Returns', icon: RotateCcw, color: 'bg-amber-500/10 text-amber-500', link: '/dashboard/returns' },
              { label: 'Pending', value: pendingRefundsCount, labelFull: 'Refunds', icon: CheckCircle, color: 'bg-amber-500/10 text-amber-500', link: '/dashboard/returns' },
              { label: 'In stock', value: productsCount, labelFull: 'Products', icon: Box, color: 'bg-amber-500/10 text-amber-500', link: '/stock' }
            ].map((stat, i) => (
              <Link key={i} to={stat.link} className="bg-white border border-gray-150 rounded-2xl p-5 hover:shadow-md transition-shadow group flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{stat.labelFull}</p>
                  <p className="text-2xl font-black text-gray-800 mt-2">{stat.value}</p>
                  <p className="text-gray-400 text-[10px] mt-0.5 font-medium">{stat.label}</p>
                </div>
                <div className="flex flex-col justify-between items-end h-full">
                  <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center flex-shrink-0`}>
                    <stat.icon size={16} />
                  </div>
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-brand-gold mt-6 transition-colors" />
                </div>
              </Link>
            ))}
          </div>

          {/* Main Grid: Orders & Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column: Recent Orders */}
            <div className="lg:col-span-2 bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-gray-800 font-bold text-base flex items-center gap-2">
                    <Package size={18} className="text-brand-gold" /> Recent Orders
                  </h2>
                  <Link to="/dashboard/orders" className="text-brand-gold text-xs font-bold hover:underline flex items-center gap-0.5">
                    View All Orders <ChevronRight size={12} />
                  </Link>
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, idx) => (
                      <div key={idx} className="h-16 bg-gray-50 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package size={40} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No orders placed yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 4).map(order => (
                      <div key={order._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200">
                            <ShoppingBag size={20} className="text-gray-400" />
                          </div>
                          <div>
                            <p className="text-gray-800 font-bold text-sm">Order #{order.orderId}</p>
                            <p className="text-gray-400 text-xs mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadgeClass(order.status)}`}>
                            {order.status.replace(/_/g, ' ')}
                          </span>
                          <Link to="/dashboard/orders" className="border border-gray-200 text-gray-700 hover:bg-gray-100 font-bold px-4 py-1.5 rounded-lg text-xs transition-colors">
                            {order.status === 'delivered' ? 'View' : 'Track'}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Support status card indicator inside left container */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-gray-800 font-bold text-sm mb-4">Order Support Status</h3>
                <div className="flex items-center gap-5">
                  {/* Circle progress mockup */}
                  <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-95" viewBox="0 0 36 36">
                      <path className="text-gray-200" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className="text-brand-gold" strokeDasharray="78, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-gray-800 font-black text-base">78%</span>
                      <span className="text-[7px] text-gray-400 font-bold uppercase tracking-wider leading-none">Resolved</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-gray-800 font-bold text-sm">Great news!</h4>
                    <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">Most customers find the answers they need without contacting support.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Actions, FAQ & CTA */}
            <div className="space-y-6">

              {/* Quick Actions */}
              <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
                <h2 className="text-gray-800 font-bold text-sm mb-4">⚡ Quick Actions</h2>
                <div className="space-y-2">
                  {[
                    { label: 'Track an Order', to: '/dashboard/orders' },
                    { label: 'Request a Return', to: '/dashboard/returns' },
                    { label: 'Check Product Stock', to: '/stock' }
                  ].map((act, idx) => (
                    <Link key={idx} to={act.to} className="w-full flex items-center justify-between p-3 rounded-xl bg-[#fffbeb] border border-[#fde68a]/50 text-brand-navy hover:bg-[#fff7d6] transition-colors text-xs font-bold">
                      <span>{act.label}</span>
                      <ChevronRight size={14} className="text-brand-gold" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Popular Help Topics */}
              <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-gray-800 font-bold text-sm">📋 Popular Help Topics</h2>
                  <Link to="/help" className="text-brand-gold text-[10px] font-bold hover:underline">View All</Link>
                </div>
                <div className="space-y-1.5">
                  {[
                    { q: 'Where is my order?', link: '/dashboard/orders' },
                    { q: 'How do I return an item?', link: '/dashboard/returns' },
                    { q: 'How long do refunds take?', link: '/dashboard/returns' },
                    { q: 'Is this product in stock?', link: '/stock' },
                    { q: 'How do I change my delivery address?', link: '/help' }
                  ].map((faq, idx) => (
                    <Link key={idx} to={faq.link} className="flex items-center justify-between py-2 text-gray-600 hover:text-brand-gold text-xs transition-colors border-b border-gray-100 last:border-0">
                      <span>{faq.q}</span>
                      <ChevronRight size={12} className="text-gray-300" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Support Card box */}
              <div className="bg-[#fffbeb] border border-[#fde68a] rounded-2xl p-6 shadow-sm text-center">
                <div className="w-10 h-10 bg-brand-gold/15 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Headphones size={20} className="text-brand-gold" />
                </div>
                <h3 className="text-gray-800 font-bold text-sm mb-1">Still need help?</h3>
                <p className="text-gray-500 text-xs mb-4">Our support team is here for you.</p>
                <Link to="/contact" className="w-full inline-flex items-center justify-center gap-1.5 bg-brand-gold text-brand-navy font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-brand-gold-hover transition-colors">
                  Contact Support <ArrowRight size={13} />
                </Link>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  )
}
