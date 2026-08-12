import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, RotateCcw, ShoppingBag, MessageSquare, TrendingUp } from 'lucide-react'
import api from '../../services/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, returns: 0, products: 0, contacts: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/orders').catch(() => ({ data: [] })),
      api.get('/returns').catch(() => ({ data: [] })),
      api.get('/stock').catch(() => ({ data: { total: 0 } })),
      api.get('/contact').catch(() => ({ data: [] })),
    ]).then(([o, r, s, c]) => {
      setStats({
        orders: o.data.length,
        returns: r.data.length,
        products: s.data.total || s.data.products?.length || 0,
        contacts: c.data.length,
        newContacts: c.data.filter(x => x.status === 'new').length,
        pendingReturns: r.data.filter(x => x.status === 'requested').length,
      })
    }).finally(() => setLoading(false))
  }, [])

  const cards = [
    { icon: ShoppingBag, label: 'Total Orders',    value: stats.orders,   sub: 'All time',                  to: '/admin/orders',   color: 'blue' },
    { icon: RotateCcw,   label: 'Return Requests', value: stats.returns,  sub: `${stats.pendingReturns || 0} pending`, to: '/admin/returns',  color: 'yellow' },
    { icon: Package,     label: 'Products',         value: stats.products, sub: 'In catalog',                to: '/admin/products', color: 'green' },
    { icon: MessageSquare, label: 'Messages',       value: stats.contacts, sub: `${stats.newContacts || 0} unread`, to: '/admin/contacts', color: 'purple' },
  ]

  const colorMap = {
    blue:   'bg-blue-500/15 text-blue-400',
    yellow: 'bg-yellow-500/15 text-yellow-400',
    green:  'bg-green-500/15 text-green-400',
    purple: 'bg-purple-500/15 text-purple-400',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-brand-muted text-sm mt-0.5">Northstar Retail Co. — Support Deflection MVP</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map(({ icon: Icon, label, value, sub, to, color }) => (
          <Link key={to} to={to} className="card hover:-translate-y-1 transition-all group">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${colorMap[color]}`}>
              <Icon size={20} />
            </div>
            <div className="text-3xl font-black text-white mb-1">
              {loading ? <span className="inline-block w-10 h-8 bg-brand-border rounded animate-pulse" /> : value}
            </div>
            <p className="text-white font-medium text-sm">{label}</p>
            <p className="text-brand-muted text-xs mt-0.5">{sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Manage Products', to: '/admin/products', icon: Package },
          { label: 'Manage Orders',   to: '/admin/orders',   icon: ShoppingBag },
          { label: 'Manage Returns',  to: '/admin/returns',  icon: RotateCcw },
          { label: 'View Messages',   to: '/admin/contacts', icon: MessageSquare },
        ].map(({ label, to, icon: Icon }) => (
          <Link key={to} to={to} className="btn-outline justify-center py-3 text-sm">
            <Icon size={15} />{label}
          </Link>
        ))}
      </div>
    </div>
  )
}
