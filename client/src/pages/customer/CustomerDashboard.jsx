import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Package, RotateCcw, ChevronRight, User, Clock } from 'lucide-react'
import api from '../../services/api'

export default function CustomerDashboard() {
  const { user } = useAuth()
  const [orders, setOrders]   = useState([])
  const [returns, setReturns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/orders/my').catch(() => ({ data: [] })),
      api.get('/returns/my').catch(() => ({ data: [] })),
    ]).then(([o, r]) => {
      setOrders(o.data.slice(0, 3))
      setReturns(r.data.slice(0, 3))
    }).finally(() => setLoading(false))
  }, [])

  const statusClass = (s) => `status-${s}`

  const navCards = [
    { icon: Package,   label: 'My Orders',  sub: 'Track & view your orders',  to: '/dashboard/orders'  },
    { icon: RotateCcw, label: 'My Returns', sub: 'Manage return requests',     to: '/dashboard/returns' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center text-brand-navy font-black">
            {user?.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Hello, {user?.name.split(' ')[0]}! 👋</h1>
            <p className="text-brand-muted text-sm">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Quick nav */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
        {navCards.map(({ icon: Icon, label, sub, to }) => (
          <Link key={to} to={to} className="card flex items-center gap-4 group hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 bg-brand-gold/15 rounded-xl flex items-center justify-center group-hover:bg-brand-gold/25 transition-colors flex-shrink-0">
              <Icon size={22} className="text-brand-gold" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">{label}</h3>
              <p className="text-brand-muted text-sm">{sub}</p>
            </div>
            <ChevronRight size={18} className="text-brand-muted group-hover:text-brand-gold" />
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-lg">Recent Orders</h2>
          <Link to="/dashboard/orders" className="text-brand-gold text-sm hover:underline">View all</Link>
        </div>
        {loading ? <div className="h-20 animate-pulse bg-brand-border/30 rounded-xl" /> :
          orders.length === 0 ? (
            <div className="text-center py-8">
              <Package size={36} className="text-brand-muted mx-auto mb-2" />
              <p className="text-brand-muted text-sm">No orders yet.</p>
            </div>
          ) : orders.map(order => (
            <div key={order._id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-brand-border last:border-0 gap-2">
              <div>
                <p className="text-white font-medium text-sm">{order.orderId}</p>
                <p className="text-brand-muted text-xs">{order.items?.map(i => i.name).join(', ')}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={statusClass(order.status)}>{order.status.replace(/_/g, ' ')}</span>
                {order.estimatedDelivery && (
                  <span className="text-brand-muted text-xs flex items-center gap-1">
                    <Clock size={11} />{new Date(order.estimatedDelivery).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))
        }
      </div>

      {/* Recent Returns */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-lg">Recent Returns</h2>
          <Link to="/dashboard/returns" className="text-brand-gold text-sm hover:underline">View all</Link>
        </div>
        {loading ? <div className="h-20 animate-pulse bg-brand-border/30 rounded-xl" /> :
          returns.length === 0 ? (
            <div className="text-center py-8">
              <RotateCcw size={36} className="text-brand-muted mx-auto mb-2" />
              <p className="text-brand-muted text-sm">No return requests yet.</p>
            </div>
          ) : returns.map(r => (
            <div key={r._id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-brand-border last:border-0 gap-2">
              <div>
                <p className="text-white font-medium text-sm">{r.returnId}</p>
                <p className="text-brand-muted text-xs">Order: {r.orderId} · {r.reason.replace(/_/g, ' ')}</p>
              </div>
              <span className={statusClass(r.status)}>{r.status.replace(/_/g, ' ')}</span>
            </div>
          ))
        }
      </div>
    </div>
  )
}
