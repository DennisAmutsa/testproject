import { useState, useEffect } from 'react'
import { Package, Search, Clock, MapPin, AlertCircle, Mail } from 'lucide-react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function CustomerOrders() {
  const { user } = useAuth()
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(false)
  const [trackId, setTrackId] = useState('')
  const [tracked, setTracked] = useState(null)
  const [trackErr, setTrackErr] = useState('')
  const [tracking, setTracking] = useState(false)

  // Guest Email Lookup state
  const [lookupEmail, setLookupEmail] = useState('')
  const [lookupOrders, setLookupOrders] = useState([])
  const [lookupError, setLookupError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    if (user) {
      setLoading(true)
      api.get('/orders/my')
        .then(r => setOrders(r.data))
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [user])

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

  // Handle Email Lookup (Guest mode)
  const handleEmailLookup = async (e) => {
    e.preventDefault()
    if (!lookupEmail.trim()) return
    setLoading(true)
    setLookupError('')
    setLookupOrders([])
    setHasSearched(true)
    try {
      const res = await api.get(`/orders/email/${lookupEmail.trim().toLowerCase()}`)
      setLookupOrders(res.data)
      if (res.data.length === 0) {
        setLookupError('No orders found associated with this email address.')
      }
    } catch (err) {
      setLookupError('Failed to fetch orders. Please check your email and try again.')
    } finally {
      setLoading(false)
    }
  }

  const STEPS = ['processing', 'shipped', 'out_for_delivery', 'delivered']
  const stepIndex = (status) => STEPS.indexOf(status)

  const statusClass = (s) => `status-${s}`

  const OrderCard = ({ order }) => (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-4 text-slate-900 hover:border-slate-300 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-stone-900 font-extrabold">{order.orderId}</p>
          <p className="text-stone-600 text-sm font-medium">{order.customerName} · {order.customerEmail}</p>
          <p className="text-stone-400 text-xs font-medium mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
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

  const isGuest = !user

  return (
    <div className="flex-1 max-w-4xl mx-auto px-6 sm:px-8 py-10 animate-fade-in overflow-y-auto">
      {/* Direct Email Input Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8 text-slate-900">
        <form onSubmit={handleEmailLookup} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email address (e.g. jane@example.com)"
            value={lookupEmail}
            onChange={e => setLookupEmail(e.target.value)}
            required
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 transition-all flex-1"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#111111] text-white font-extrabold px-6 py-3 rounded-xl hover:bg-black transition-all whitespace-nowrap"
          >
            {loading ? 'Fetching Orders…' : 'View Orders'}
          </button>
        </form>

        {lookupError && (
          <p className="text-red-500 text-sm mt-3 flex items-center gap-2 font-semibold">
            <AlertCircle size={15}/>{lookupError}
          </p>
        )}
      </div>

      {/* Orders List (Most recent on top) */}
      {hasSearched && (
        <div>
          {lookupOrders.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl text-center py-12 shadow-sm text-slate-800">
              <Package size={44} className="text-slate-300 mx-auto mb-3" />
              <h3 className="text-slate-800 font-extrabold mb-1">No orders found</h3>
              <p className="text-slate-500 text-sm font-semibold">No orders are associated with this email address.</p>
            </div>
          ) : (
            lookupOrders.map(order => <OrderCard key={order._id} order={order} />)
          )}
        </div>
      )}

      {/* Default view before typing email */}
      {!hasSearched && !isGuest && orders.length > 0 && (
        <div>
          {orders.map(order => <OrderCard key={order._id} order={order} />)}
        </div>
      )}
    </div>
  )
}
