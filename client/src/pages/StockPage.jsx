import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Package, CheckCircle, XCircle, Clock } from 'lucide-react'
import { searchProducts } from '../services/api'
import api from '../services/api'

export default function StockPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    api.get('/stock/categories').then(r => setCategories(r.data)).catch(() => {})
    // Load all products on mount
    fetchProducts()
  }, [])

  const fetchProducts = async (q = '', cat = '') => {
    setLoading(true)
    try {
      const res = await searchProducts(q || undefined, cat || undefined)
      setProducts(res.data)
      setSearched(true)
    } catch { setProducts([]) }
    finally { setLoading(false) }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchProducts(query, category)
  }

  const stockBadge = (product) => {
    if (product.totalStock === 0) return <span className="badge bg-red-500/20 text-red-400"><XCircle size={12}/> Out of Stock</span>
    if (product.totalStock < 5) return <span className="badge bg-yellow-500/20 text-yellow-400"><Clock size={12}/> Low Stock ({product.totalStock} left)</span>
    return <span className="badge bg-green-500/20 text-green-400"><CheckCircle size={12}/> In Stock</span>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Stock Availability</h1>
        <p className="text-brand-muted">Search our product catalog and check real-time stock levels.</p>
      </div>

      {/* Search & Filter */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input type="text" placeholder="Search products…" value={query}
            onChange={e => setQuery(e.target.value)} className="input-field pl-12" />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} className="input-field sm:w-52">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button type="submit" className="btn-gold px-6 whitespace-nowrap">
          <Filter size={16} /> Filter
        </button>
      </form>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => <div key={i} className="card h-48 animate-pulse bg-brand-card" />)}
        </div>
      ) : products.length === 0 && searched ? (
        <div className="text-center py-20 card">
          <Package size={48} className="text-brand-muted mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">No products found</h3>
          <p className="text-brand-muted text-sm">Try a different search term or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map(product => (
            <div key={product._id} className="card hover:-translate-y-1 transition-all duration-300">
              <div className="w-full h-32 bg-brand-dark rounded-lg flex items-center justify-center mb-4">
                <Package size={40} className="text-brand-border" />
              </div>
              <div className="mb-2">{stockBadge(product)}</div>
              <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{product.name}</h3>
              <p className="text-brand-muted text-xs mb-2">{product.category}</p>
              <p className="text-brand-gold font-bold text-lg mb-3">KES {product.price?.toLocaleString()}</p>
              {product.variants?.length > 0 && (
                <div className="mb-3">
                  <p className="text-brand-muted text-xs mb-1.5">Available sizes:</p>
                  <div className="flex flex-wrap gap-1">
                    {product.variants.map((v, i) => (
                      <span key={i} className={`text-xs px-2 py-0.5 rounded border ${v.stock > 0 ? 'border-brand-gold/40 text-brand-gold' : 'border-brand-border text-brand-border line-through'}`}>
                        {v.size || v.color}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {product.totalStock === 0 && product.restockDate && (
                <p className="text-brand-muted text-xs">
                  Restocking: {new Date(product.restockDate).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {!searched && !loading && (
        <div className="text-center py-20">
          <Package size={48} className="text-brand-muted mx-auto mb-4" />
          <p className="text-brand-muted">Search above to browse our catalog</p>
        </div>
      )}
    </div>
  )
}
