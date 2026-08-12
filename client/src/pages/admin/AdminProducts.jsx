import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, X, Check, Package } from 'lucide-react'
import api from '../../services/api'

const EMPTY = { name: '', category: '', description: '', price: '', restockDate: '', variants: [{ size: '', color: '', stock: 0, sku: '' }] }

export default function AdminProducts() {
  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [showForm, setShowForm]     = useState(false)
  const [editing, setEditing]       = useState(null)
  const [form, setForm]             = useState(EMPTY)
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState('')
  const [filterCat, setFilterCat]   = useState('')

  const fetchProducts = () =>
    api.get('/stock', { params: filterCat ? { category: filterCat } : {} })
      .then(r => setProducts(r.data.products || r.data))
      .catch(() => {})
      .finally(() => setLoading(false))

  useEffect(() => {
    api.get('/stock/categories').then(r => setCategories(r.data)).catch(() => {})
    fetchProducts()
  }, [filterCat])

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowForm(true); setError('') }
  const openEdit = (p) => {
    setEditing(p._id)
    setForm({ name: p.name, category: p.category, description: p.description || '', price: p.price, restockDate: p.restockDate ? p.restockDate.slice(0, 10) : '', variants: p.variants?.length ? p.variants : [{ size: '', color: '', stock: 0, sku: '' }] })
    setShowForm(true); setError('')
  }

  const addVariant = () => setForm(f => ({ ...f, variants: [...f.variants, { size: '', color: '', stock: 0, sku: '' }] }))
  const removeVariant = (i) => setForm(f => ({ ...f, variants: f.variants.filter((_, idx) => idx !== i) }))
  const updateVariant = (i, field, val) => setForm(f => ({ ...f, variants: f.variants.map((v, idx) => idx === i ? { ...v, [field]: field === 'stock' ? Number(val) : val } : v) }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSaving(true)
    try {
      const payload = { ...form, price: Number(form.price), restockDate: form.restockDate || undefined }
      if (editing) await api.put(`/stock/${editing}`, payload)
      else await api.post('/stock', payload)
      setShowForm(false); setForm(EMPTY); setEditing(null); fetchProducts()
    } catch (err) { setError(err.response?.data?.message || 'Failed to save.') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    await api.delete(`/stock/${id}`).catch(() => {})
    fetchProducts()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-brand-muted text-sm mt-0.5">Manage your product catalog</p>
        </div>
        <button onClick={openAdd} className="btn-gold"><Plus size={16} />Add Product</button>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button onClick={() => setFilterCat('')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!filterCat ? 'bg-brand-gold text-brand-navy' : 'bg-brand-card border border-brand-border text-brand-muted hover:text-white'}`}>All</button>
        {categories.map(c => (
          <button key={c} onClick={() => setFilterCat(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterCat === c ? 'bg-brand-gold text-brand-navy' : 'bg-brand-card border border-brand-border text-brand-muted hover:text-white'}`}>{c}</button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="card mb-8 animate-slide-up">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-bold">{editing ? 'Edit Product' : 'New Product'}</h2>
            <button onClick={() => setShowForm(false)} className="text-brand-muted hover:text-white"><X size={18} /></button>
          </div>
          {error && <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Product Name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required className="input-field">
                  <option value="">Select category…</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Price (KES)</label>
                <input type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Restock Date <span className="text-brand-muted">(if out of stock)</span></label>
                <input type="date" value={form.restockDate} onChange={e => setForm({ ...form, restockDate: e.target.value })} className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Description</label>
              <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field resize-none" />
            </div>

            {/* Variants */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-white">Variants (size / color / stock)</label>
                <button type="button" onClick={addVariant} className="text-brand-gold text-xs hover:underline flex items-center gap-1"><Plus size={12} />Add Variant</button>
              </div>
              <div className="space-y-2">
                {form.variants.map((v, i) => (
                  <div key={i} className="grid grid-cols-4 gap-2 items-center">
                    <input type="text" placeholder="Size" value={v.size} onChange={e => updateVariant(i, 'size', e.target.value)} className="input-field text-sm py-2" />
                    <input type="text" placeholder="Color" value={v.color} onChange={e => updateVariant(i, 'color', e.target.value)} className="input-field text-sm py-2" />
                    <input type="number" placeholder="Stock" min="0" value={v.stock} onChange={e => updateVariant(i, 'stock', e.target.value)} className="input-field text-sm py-2" />
                    <button type="button" onClick={() => removeVariant(i)} className="text-red-400 hover:text-red-300 flex justify-center"><X size={16} /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-gold"><Check size={15} />{saving ? 'Saving…' : 'Save Product'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Product list */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="card h-40 animate-pulse" />)}</div>
      ) : products.length === 0 ? (
        <div className="card text-center py-16"><Package size={44} className="text-brand-muted mx-auto mb-3" /><p className="text-brand-muted">No products yet. Add your first product above.</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p._id} className="card">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-sm">{p.name}</h3>
                  <p className="text-brand-muted text-xs">{p.category}</p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(p)} className="p-1.5 text-brand-muted hover:text-brand-gold transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(p._id)} className="p-1.5 text-brand-muted hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
              <p className="text-brand-gold font-bold text-lg mb-2">KES {p.price?.toLocaleString()}</p>
              <span className={`badge ${p.isAvailable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {p.isAvailable ? `In Stock (${p.totalStock})` : 'Out of Stock'}
              </span>
              {p.variants?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {p.variants.map((v, i) => <span key={i} className="text-xs px-2 py-0.5 bg-brand-dark rounded border border-brand-border text-brand-muted">{v.size} {v.color} ({v.stock})</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
