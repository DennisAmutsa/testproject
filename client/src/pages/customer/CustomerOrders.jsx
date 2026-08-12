import { useState, useEffect } from 'react'
import { Package, Search, Clock, MapPin, AlertCircle } from 'lucide-react'
import api from '../../services/api'

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
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-4 text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-slate-800 font-extrabold">{order.orderId}</p>
          <p className="text-slate-500 text-sm font-semibold">{order.customerName} · {order.customerEmail}</p>
          <p className="text-slate-400 text-xs font-semibold mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <span className={statusClass(order.status)}>{order.status.replace(/_/g, ' ')}</span>
      </div>

      {/* Progress bar */}
      {order.status !== 'cancelled' && (
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex flex-col items-center flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mb-1 ${i <= stepIndex(order.status) ? 'bg-[#f5c518] text-[#0a0e1a] font-black' : 'bg-slate-100 text-slate-400'}`}>
                  {i + 1}
                </div>
                <span className={`text-[10px] text-center font-bold hidden sm:block ${i <= stepIndex(order.status) ? 'text-[#d4a017]' : 'text-slate-400'}`}>
                  {s.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#f5c518] rounded-full transition-all" style={{ width: `${((stepIndex(order.status) + 1) / STEPS.length) * 100}%` }} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        {order.items?.map((item, i) => (
          <div key={i} className="flex justify-between sm:flex-col bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-500 text-xs font-bold">{item.name}</span>
            <span className="text-slate-800 text-xs font-black mt-1">x{item.quantity} · KES {item.price?.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {order.trackingNumber && (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 font-semibold border-t border-slate-100 pt-3">
          <MapPin size={12} /> Tracking: <span className="text-slate-800 font-mono font-bold">{order.trackingNumber}</span>
        </div>
      )}
      {order.estimatedDelivery && order.status !== 'delivered' && (
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 font-semibold">
          <Clock size={12} /> Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
        </div>
      )}
    </div>
  )

  return (
    <div className="flex-1 max-w-4xl mx-auto px-6 sm:px-8 py-10 animate-fade-in overflow-y-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">My Orders</h1>

        {/* Track by ID */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-8 text-slate-800">
          <h2 className="text-slate-800 font-extrabold mb-3">Track an Order</h2>
          <form onSubmit={handleTrack} className="flex gap-3">
            <input type="text" placeholder="Enter order ID (e.g. NS-10021)" value={trackId}
              onChange={e => setTrackId(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500/60 transition-all flex-1" />
            <button type="submit" disabled={tracking} className="bg-[#f5c518] text-[#0a0e1a] font-extrabold px-6 py-2.5 rounded-xl hover:bg-[#e6b400] transition-all whitespace-nowrap">
              <Search size={15} />{tracking ? '…' : 'Track'}
            </button>
          </form>
          {trackErr && <p className="text-red-500 text-sm mt-3 flex items-center gap-2 font-semibold"><AlertCircle size={14}/>{trackErr}</p>}
          {tracked && <div className="mt-4 animate-slide-up"><OrderCard order={tracked} /></div>}
        </div>

        {/* My orders list */}
        <h2 className="text-slate-800 font-extrabold mb-4">Order History</h2>
        {loading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="bg-white border border-slate-100 h-32 rounded-2xl animate-pulse" />)}</div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl text-center py-12 shadow-sm text-slate-800">
            <Package size={44} className="text-slate-300 mx-auto mb-3" />
            <h3 className="text-slate-800 font-extrabold mb-1">No orders found</h3>
            <p className="text-slate-500 text-sm font-semibold">Your order history will appear here.</p>
          </div>
        ) : orders.map(order => <OrderCard key={order._id} order={order} />)}
      </div>
  )
}
