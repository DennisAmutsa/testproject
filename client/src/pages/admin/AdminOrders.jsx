import { useState, useEffect } from 'react'
import { Plus, X, Check, ShoppingBag, Truck } from 'lucide-react'
import api from '../../services/api'

const STATUSES = ['processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [updating, setUpdating]   = useState(null)
  const [error, setError]         = useState('')
  const [filterStatus, setFilter] = useState('')
  const [form, setForm] = useState({ orderId: '', customerName: '', customerEmail: '', items: [{ name: '', quantity: 1, price: 0 }], estimatedDelivery: '' })

  const fetchOrders = () =>
    api.get('/orders').then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false))

  useEffect(() => { fetchOrders() }, [])

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { name: '', quantity: 1, price: 0 }] }))
  const updateItem = (i, field, val) => setForm(f => ({ ...f, items: f.items.map((item, idx) => idx === i ? { ...item, [field]: field !== 'name' ? Number(val) : val } : item) }))

  const handleCreate = async (e) => {
    e.preventDefault(); setError('')
    try {
      await api.post('/orders', { ...form, estimatedDelivery: form.estimatedDelivery || undefined })
      setShowForm(false); setForm({ orderId: '', customerName: '', customerEmail: '', items: [{ name: '', quantity: 1, price: 0 }], estimatedDelivery: '' })
      fetchOrders()
    } catch (err) { setError(err.response?.data?.message || 'Failed to create order.') }
  }

  const handleStatusUpdate = async (id, status, trackingNumber) => {
    setUpdating(id)
    await api.patch(`/orders/${id}/status`, { status, trackingNumber }).catch(() => {})
    setUpdating(null); fetchOrders()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this order?')) return
    await api.delete(`/orders/${id}`).catch(() => {})
    fetchOrders()
  }

  const filtered = filterStatus ? orders.filter(o => o.status === filterStatus) : orders

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div><h1 className="text-2xl font-bold text-white">Orders</h1><p className="text-brand-muted text-sm">Manage all customer orders</p></div>
        <button onClick={() => { setShowForm(!showForm); setError('') }} className="btn-gold"><Plus size={16} />Create Order</button>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button onClick={() => setFilter('')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!filterStatus ? 'bg-brand-gold text-brand-navy' : 'bg-brand-card border border-brand-border text-brand-muted hover:text-white'}`}>All ({orders.length})</button>
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${filterStatus === s ? 'bg-brand-gold text-brand-navy' : 'bg-brand-card border border-brand-border text-brand-muted hover:text-white'}`}>
            {s.replace(/_/g, ' ')} ({orders.filter(o => o.status === s).length})
          </button>
        ))}
      </div>

      {/* Create order form */}
      {showForm && (
        <div className="card mb-8 animate-slide-up">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-bold">Create New Order</h2>
            <button onClick={() => setShowForm(false)}><X size={18} className="text-brand-muted hover:text-white" /></button>
          </div>
          {error && <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div><label className="block text-sm font-medium text-white mb-1.5">Order ID</label><input type="text" placeholder="NS-10024" value={form.orderId} onChange={e => setForm({ ...form, orderId: e.target.value })} required className="input-field" /></div>
              <div><label className="block text-sm font-medium text-white mb-1.5">Customer Name</label><input type="text" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} required className="input-field" /></div>
              <div><label className="block text-sm font-medium text-white mb-1.5">Customer Email</label><input type="email" value={form.customerEmail} onChange={e => setForm({ ...form, customerEmail: e.target.value })} required className="input-field" /></div>
            </div>
            <div><label className="block text-sm font-medium text-white mb-1.5">Est. Delivery</label><input type="date" value={form.estimatedDelivery} onChange={e => setForm({ ...form, estimatedDelivery: e.target.value })} className="input-field sm:w-48" /></div>
            <div>
              <div className="flex items-center justify-between mb-2"><label className="text-sm font-medium text-white">Order Items</label><button type="button" onClick={addItem} className="text-brand-gold text-xs hover:underline flex items-center gap-1"><Plus size={12}/>Add Item</button></div>
              {form.items.map((item, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                  <input type="text" placeholder="Item name" value={item.name} onChange={e => updateItem(i, 'name', e.target.value)} required className="input-field text-sm py-2" />
                  <input type="number" placeholder="Qty" min="1" value={item.quantity} onChange={e => updateItem(i, 'quantity', e.target.value)} className="input-field text-sm py-2" />
                  <input type="number" placeholder="Price (KES)" min="0" value={item.price} onChange={e => updateItem(i, 'price', e.target.value)} className="input-field text-sm py-2" />
                </div>
              ))}
            </div>
            <div className="flex gap-3"><button type="submit" className="btn-gold"><Check size={15}/>Create Order</button><button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button></div>
          </form>
        </div>
      )}

      {/* Orders table */}
      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="card h-20 animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16"><ShoppingBag size={44} className="text-brand-muted mx-auto mb-3" /><p className="text-brand-muted">No orders found.</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <div key={order._id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-white font-bold text-sm">{order.orderId}</p>
                    <span className={`status-${order.status}`}>{order.status.replace(/_/g, ' ')}</span>
                  </div>
                  <p className="text-brand-muted text-xs">{order.customerName} · {order.customerEmail}</p>
                  <p className="text-brand-muted text-xs">{order.items?.map(i => `${i.name} x${i.quantity}`).join(', ')}</p>
                  {order.trackingNumber && <p className="text-brand-muted text-xs mt-0.5 flex items-center gap-1"><Truck size={10}/>{order.trackingNumber}</p>}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {STATUSES.filter(s => s !== order.status && s !== 'cancelled').map(s => (
                    <button key={s} disabled={updating === order._id} onClick={() => handleStatusUpdate(order._id, s, s === 'shipped' ? prompt('Tracking number?') : undefined)}
                      className="px-2 py-1 text-xs rounded-lg bg-brand-card border border-brand-border text-brand-muted hover:text-brand-gold hover:border-brand-gold/40 transition-all capitalize disabled:opacity-50">
                      → {s.replace(/_/g, ' ')}
                    </button>
                  ))}
                  <button onClick={() => handleDelete(order._id)} className="px-2 py-1 text-xs rounded-lg border border-red-400/30 text-red-400 hover:bg-red-500/10 transition-all">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
