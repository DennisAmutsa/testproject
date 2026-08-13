import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, X, Check, Package, RotateCcw, DollarSign, Calendar, Eye } from 'lucide-react'
import api from '../../services/api'

const EMPTY = { name: '', category: '', description: '', price: '', image: '', restockDate: '', variants: [{ size: '', color: '', stock: 0, sku: '' }] }

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
  const [filterStock, setFilterStock] = useState('')

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
    setForm({ 
      name: p.name, 
      category: p.category, 
      description: p.description || '', 
      price: p.price, 
      image: p.image || '',
      restockDate: p.restockDate ? p.restockDate.slice(0, 10) : '', 
      variants: p.variants?.length ? p.variants : [{ size: '', color: '', stock: 0, sku: '' }] 
    })
    setShowForm(true); setError('')
  }

  const addVariant = () => setForm(f => ({ ...f, variants: [...f.variants, { size: '', color: '', stock: 0, sku: '' }] }))
  const removeVariant = (i) => setForm(f => ({ ...f, variants: f.variants.filter((_, idx) => idx !== i) }))
  const updateVariant = (i, field, val) => setForm(f => ({ ...f, variants: f.variants.map((v, idx) => idx === i ? { ...v, [field]: field === 'stock' ? Number(val) : val } : v) }))

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(f => ({ ...f, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Manage Catalog</h1>
          <p className="text-slate-500 text-sm font-semibold mt-0.5">Add, update, and manage your inventory stock</p>
        </div>
        <button onClick={openAdd} className="bg-[#f5c518] text-[#0a0e1a] font-extrabold px-5 py-2.5 rounded-xl hover:bg-[#e6b400] transition-all flex items-center gap-1.5 shadow-sm text-xs">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Category filter tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        <button 
          onClick={() => setFilterCat('')} 
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            !filterCat 
              ? 'bg-[#f5c518] text-[#0a0e1a]' 
              : 'bg-white border border-slate-100 text-slate-500 hover:text-slate-800 shadow-sm'
          }`}
        >
          All
        </button>
        {categories.map(c => (
          <button 
            key={c} 
            onClick={() => setFilterCat(c)} 
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterCat === c 
                ? 'bg-[#f5c518] text-[#0a0e1a]' 
                : 'bg-white border border-slate-100 text-slate-500 hover:text-slate-800 shadow-sm'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Form Overlay */}
      {showForm && (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-md mb-8 animate-slide-up">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-slate-800 font-extrabold text-base">{editing ? 'Edit Product' : 'New Product'}</h2>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 p-1"><X size={18} /></button>
          </div>
          {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-semibold">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-650 mb-1.5">Product Name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-855 placeholder-slate-450 focus:outline-none focus:border-amber-500/60 transition-all text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-650 mb-1.5">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-855 placeholder-slate-450 focus:outline-none focus:border-amber-500/60 transition-all text-xs">
                  <option value="">Select category…</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  <option value="Jackets">Jackets</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Dresses">Dresses</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-650 mb-1.5">Price (KES)</label>
                <input type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-855 placeholder-slate-450 focus:outline-none focus:border-amber-500/60 transition-all text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-650 mb-1.5">Restock Date <span className="text-slate-400 font-normal">(optional)</span></label>
                <input type="date" value={form.restockDate} onChange={e => setForm({ ...form, restockDate: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-855 placeholder-slate-450 focus:outline-none focus:border-amber-500/60 transition-all text-xs" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-650 mb-1.5">Description</label>
              <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-855 placeholder-slate-450 focus:outline-none focus:border-amber-500/60 transition-all text-xs resize-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div>
                <label className="block text-xs font-bold text-slate-650 mb-1.5">Upload Product Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-600 focus:outline-none"
                />
              </div>
              {form.image && (
                <div className="flex flex-col items-start">
                  <span className="text-[10px] font-bold text-slate-400 mb-1">Image Preview:</span>
                  <img src={form.image} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-slate-100 shadow-sm" />
                </div>
              )}
            </div>

            {/* Variants */}
            <div>
              <div className="flex items-center justify-between mb-3 border-t border-slate-50 pt-4">
                <label className="text-xs font-bold text-slate-800">Variants (Size / Color / Stock)</label>
                <button type="button" onClick={addVariant} className="text-[#d4a017] text-xs font-bold hover:underline flex items-center gap-1"><Plus size={12} />Add Variant</button>
              </div>
              <div className="space-y-2">
                {form.variants.map((v, i) => (
                  <div key={i} className="grid grid-cols-4 gap-3 items-center">
                    <input type="text" placeholder="Size" value={v.size} onChange={e => updateVariant(i, 'size', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500/60 transition-all text-xs" />
                    <input type="text" placeholder="Color" value={v.color} onChange={e => updateVariant(i, 'color', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500/60 transition-all text-xs" />
                    <input type="number" placeholder="Stock" min="0" value={v.stock} onChange={e => updateVariant(i, 'stock', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500/60 transition-all text-xs" />
                    <button type="button" onClick={() => removeVariant(i)} className="text-red-500 hover:text-red-700 flex justify-center p-1"><X size={16} /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button type="submit" disabled={saving} className="bg-[#f5c518] text-[#0a0e1a] font-extrabold px-5 py-2.5 rounded-xl hover:bg-[#e6b400] transition-all flex items-center gap-1.5 shadow-sm text-xs">
                <Check size={15} />{saving ? 'Saving…' : 'Save Product'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-slate-200 text-slate-700 hover:bg-slate-50 font-extrabold px-5 py-2.5 rounded-xl text-xs transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Product list */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-100 h-44 rounded-2xl animate-pulse shadow-sm" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl text-center py-16 shadow-sm">
          <Package size={44} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-bold text-sm">No products found. Add your first product above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => (
            <div key={p._id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative text-slate-800 flex flex-col justify-between min-h-[190px]">
              <div>
                {p.image && (
                  <img src={p.image} alt={p.name} className="w-full h-32 object-cover rounded-xl mb-4 border border-slate-100" />
                )}
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="min-w-0">
                    <h3 className="text-slate-800 font-extrabold text-sm truncate">{p.name}</h3>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-0.5">{p.category}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => openEdit(p)} className="p-1.5 text-slate-400 hover:text-amber-500 transition-colors"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(p._id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
                <p className="text-slate-850 font-black text-base mb-3">KES {p.price?.toLocaleString()}</p>
              </div>

              <div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block border ${p.isAvailable && p.totalStock > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                  {p.isAvailable && p.totalStock > 0 ? `In Stock (${p.totalStock})` : 'Out of Stock'}
                </span>
                
                {p.variants?.length > 0 && (
                  <div className="mt-3.5 flex flex-wrap gap-1 border-t border-slate-50 pt-3">
                    {p.variants.map((v, i) => (
                      <span key={i} className="text-[9px] px-2 py-0.5 bg-slate-50 rounded-lg border border-slate-100 text-slate-500 font-bold">
                        {v.size} {v.color} ({v.stock})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
