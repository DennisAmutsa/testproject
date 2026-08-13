import { useState, useEffect } from 'react'
import { Plus, X, Check, ShoppingBag, Truck, Calendar, DollarSign, User, Mail, Search, Trash2 } from 'lucide-react'
import api from '../../services/api'

const STATUSES = ['processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [updating, setUpdating]   = useState(null)
  const [error, setError]         = useState('')
  const [filterStatus, setFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
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

  const filtered = orders.filter(o => {
    const matchesStatus = filterStatus ? o.status === filterStatus : true;
    const matchesSearch = searchTerm 
      ? o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) || 
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-1 rounded-full text-[10px] font-bold capitalize';
      case 'shipped':
      case 'out_for_delivery':
        return 'bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-full text-[10px] font-bold capitalize';
      case 'processing':
        return 'bg-amber-50 text-amber-600 border border-amber-100 px-2.5 py-1 rounded-full text-[10px] font-bold capitalize';
      case 'cancelled':
      default:
        return 'bg-slate-50 text-slate-500 border border-slate-100 px-2.5 py-1 rounded-full text-[10px] font-bold capitalize';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Customer Orders</h1>
          <p className="text-slate-500 text-sm font-semibold mt-0.5">Fulfill shipments, update tracking numbers, and view statuses</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setError('') }} className="bg-[#f5c518] text-[#0a0e1a] font-extrabold px-5 py-2.5 rounded-xl hover:bg-[#e6b400] transition-all flex items-center gap-1.5 shadow-sm text-xs">
          <Plus size={16} /> Create Order
        </button>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex gap-2 flex-wrap">
          <button 
            onClick={() => setFilter('')} 
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              !filterStatus 
                ? 'bg-[#f5c518] text-[#0a0e1a]' 
                : 'bg-white border border-slate-105 text-slate-500 hover:text-slate-800 shadow-sm'
            }`}
          >
            All ({orders.length})
          </button>
          {STATUSES.map(s => (
            <button 
              key={s} 
              onClick={() => setFilter(s)} 
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize ${
                filterStatus === s 
                  ? 'bg-[#f5c518] text-[#0a0e1a]' 
                  : 'bg-white border border-slate-105 text-slate-500 hover:text-slate-800 shadow-sm'
              }`}
            >
              {s.replace(/_/g, ' ')} ({orders.filter(o => o.status === s).length})
            </button>
          ))}
        </div>

        <div className="relative">
          <input 
            type="text" 
            placeholder="Search orders..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 bg-white border border-slate-205 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500/50 transition-colors shadow-sm"
          />
          <Search size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
        </div>
      </div>

      {/* Create Order Modal-style panel */}
      {showForm && (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-md mb-8 animate-slide-up">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
            <h2 className="text-slate-800 font-extrabold text-base">Create New Order</h2>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
          </div>
          {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-semibold">{error}</div>}
          
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-650 mb-1.5">Order ID</label>
                <input type="text" placeholder="NS10025" value={form.orderId} onChange={e => setForm({ ...form, orderId: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-855 focus:outline-none focus:border-amber-500/50 transition-all text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-650 mb-1.5">Customer Name</label>
                <input type="text" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-855 focus:outline-none focus:border-amber-500/50 transition-all text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-650 mb-1.5">Customer Email</label>
                <input type="email" value={form.customerEmail} onChange={e => setForm({ ...form, customerEmail: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-855 focus:outline-none focus:border-amber-500/50 transition-all text-xs" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-650 mb-1.5">Est. Delivery Date</label>
              <input type="date" value={form.estimatedDelivery} onChange={e => setForm({ ...form, estimatedDelivery: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-855 focus:outline-none focus:border-amber-500/50 transition-all text-xs sm:w-48" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3 border-t border-slate-50 pt-4">
                <label className="text-xs font-bold text-slate-850">Items List</label>
                <button type="button" onClick={addItem} className="text-[#d4a017] text-xs font-bold hover:underline flex items-center gap-1"><Plus size={12} />Add Item</button>
              </div>
              {form.items.map((item, i) => (
                <div key={i} className="grid grid-cols-3 gap-3 mb-2">
                  <input type="text" placeholder="Item name" value={item.name} onChange={e => updateItem(i, 'name', e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500/50 transition-all text-xs" />
                  <input type="number" placeholder="Quantity" min="1" value={item.quantity} onChange={e => updateItem(i, 'quantity', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500/50 transition-all text-xs" />
                  <input type="number" placeholder="Price (KES)" min="0" value={item.price} onChange={e => updateItem(i, 'price', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500/50 transition-all text-xs" />
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button type="submit" className="bg-[#f5c518] text-[#0a0e1a] font-extrabold px-5 py-2.5 rounded-xl hover:bg-[#e6b400] transition-all flex items-center gap-1.5 shadow-sm text-xs">
                <Check size={15} /> Create Order
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-slate-200 text-slate-700 hover:bg-slate-50 font-extrabold px-5 py-2.5 rounded-xl text-xs transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Orders Table-styled blocks */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-105 h-20 rounded-2xl animate-pulse shadow-sm" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl text-center py-16 shadow-sm">
          <ShoppingBag size={44} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-bold text-sm">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => {
            const totalAmount = order.items?.reduce((s, i) => s + (i.price * i.quantity), 0) || 0;
            
            return (
              <div key={order._id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-slate-800 font-black text-sm">#{order.orderId}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-1 text-slate-500 text-[11px] font-semibold">
                      <p className="flex items-center gap-1 text-slate-800 font-bold"><User size={12}/>{order.customerName}</p>
                      <p className="flex items-center gap-1"><Mail size={12}/>{order.customerEmail}</p>
                      <p className="flex items-center gap-1 font-extrabold text-slate-800"><DollarSign size={12}/>KES {totalAmount.toLocaleString()}</p>
                    </div>

                    <div className="text-[10px] text-slate-400 font-semibold mt-1">
                      <span className="text-slate-550 font-bold">Items:</span> {order.items?.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                    </div>

                    {order.trackingNumber && (
                      <p className="text-blue-600 text-[10px] font-bold mt-1.5 flex items-center gap-1">
                        <Truck size={12}/> Tracking: {order.trackingNumber}
                      </p>
                    )}
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                    {STATUSES.filter(s => s !== order.status && s !== 'cancelled').map(s => (
                      <button 
                        key={s} 
                        disabled={updating === order._id} 
                        onClick={() => handleStatusUpdate(order._id, s, s === 'shipped' ? prompt('Enter shipping tracking number:') || undefined : undefined)}
                        className="px-3 py-1.5 text-[10px] font-bold rounded-lg border border-slate-200 bg-slate-50 hover:bg-[#f5c518]/10 hover:border-[#f5c518]/30 text-slate-600 hover:text-[#9a6a00] transition-colors disabled:opacity-50 capitalize"
                      >
                        → Set {s.replace(/_/g, ' ')}
                      </button>
                    ))}
                    <button 
                      onClick={() => handleDelete(order._id)} 
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-slate-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
