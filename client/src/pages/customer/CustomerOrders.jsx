import { useState, useEffect } from 'react'
import { Package, Search, Clock, MapPin, AlertCircle } from 'lucide-react'
import api from '../../services/api'
import Sidebar from '../../components/Sidebar'

export default function CustomerOrders() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [trackId, setTrackId] = useState('')
  const [tracked, setTracked] = useState(null)
  const [trackErr, setTrackErr] = useState('')
  const [tracking, setTracking] = useState(false)

  useEffect(() => {
    api.get('/orders/my')
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleTrack = async (e) => {
    e.preventDefault()
    setTrackErr(''); setTracked(null); setTracking(true)
    try {
      const res = await api.get(`/orders/${trackId}`)
      setTracked(res.data)
    } catch (err) {
      setTrackErr(err.response?.data?.message || 'Order not found.')
    } finally { setTracking(false) }
  }

  const STEPS = ['processing', 'shipped', 'out_for_delivery', 'delivered']
  const stepIndex = (status) => STEPS.indexOf(status)

  const statusClass = (s) => `status-${s}`

  const OrderCard = ({ order }) => (
    <div className="card mb-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-white font-bold">{order.orderId}</p>
          <p className="text-brand-muted text-sm">{order.customerName} · {order.customerEmail}</p>
          <p className="text-brand-muted text-xs mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <span className={statusClass(order.status)}>{order.status.replace(/_/g, ' ')}</span>
      </div>

      {/* Progress bar */}
      {order.status !== 'cancelled' && (
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex flex-col items-center flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mb-1 ${i <= stepIndex(order.status) ? 'bg-brand-gold text-brand-navy font-bold' : 'bg-brand-border text-brand-muted'}`}>
                  {i + 1}
                </div>
                <span className={`text-[10px] text-center hidden sm:block ${i <= stepIndex(order.status) ? 'text-brand-gold' : 'text-brand-muted'}`}>
                  {s.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
          <div className="h-1 bg-brand-border rounded-full overflow-hidden">
            <div className="h-full bg-brand-gold rounded-full transition-all" style={{ width: `${((stepIndex(order.status) + 1) / STEPS.length) * 100}%` }} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        {order.items?.map((item, i) => (
          <div key={i} className="flex justify-between sm:flex-col">
            <span className="text-brand-muted text-xs">{item.name}</span>
            <span className="text-white text-xs">x{item.quantity} · KES {item.price?.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {order.trackingNumber && (
        <div className="mt-3 flex items-center gap-2 text-xs text-brand-muted border-t border-brand-border pt-3">
          <MapPin size={12} /> Tracking: <span className="text-white font-mono">{order.trackingNumber}</span>
        </div>
      )}
      {order.estimatedDelivery && order.status !== 'delivered' && (
        <div className="mt-2 flex items-center gap-2 text-xs text-brand-muted">
          <Clock size={12} /> Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
        </div>
      )}
    </div>
  )

  return (
    <div className="flex min-h-screen bg-brand-navy">
      <Sidebar />
      <div className="flex-1 max-w-4xl mx-auto px-6 sm:px-8 py-10 animate-fade-in overflow-y-auto">
        <h1 className="text-2xl font-bold text-white mb-6">My Orders</h1>

        {/* Track by ID */}
        <div className="card mb-8">
          <h2 className="text-white font-semibold mb-3">Track an Order</h2>
          <form onSubmit={handleTrack} className="flex gap-3">
            <input type="text" placeholder="Enter order ID (e.g. NS-10021)" value={trackId}
              onChange={e => setTrackId(e.target.value)} required className="input-field flex-1" />
            <button type="submit" disabled={tracking} className="btn-gold whitespace-nowrap">
              <Search size={15} />{tracking ? '…' : 'Track'}
            </button>
          </form>
          {trackErr && <p className="text-red-400 text-sm mt-3 flex items-center gap-2"><AlertCircle size={14}/>{trackErr}</p>}
          {tracked && <div className="mt-4 animate-slide-up"><OrderCard order={tracked} /></div>}
        </div>

        {/* My orders list */}
        <h2 className="text-white font-semibold mb-4">Order History</h2>
        {loading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="card h-32 animate-pulse" />)}</div>
        ) : orders.length === 0 ? (
          <div className="card text-center py-12">
            <Package size={44} className="text-brand-muted mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-1">No orders found</h3>
            <p className="text-brand-muted text-sm">Your order history will appear here.</p>
          </div>
        ) : orders.map(order => <OrderCard key={order._id} order={order} />)}
      </div>
    </div>
  )
}
