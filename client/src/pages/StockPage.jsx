import { useState, useEffect } from 'react'
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
  const [stockFilter, setStockFilter] = useState('') // '', 'in_stock', 'low_stock', 'out_of_stock'

  useEffect(() => {
    api.get('/stock/categories').then(r => setCategories(r.data)).catch(() => {})
    fetchProducts()
  }, [])

  const fetchProducts = async (q = '', cat = '') => {
    setLoading(true)
    try {
      const res = await searchProducts(q || undefined, cat || undefined)
      // Check structure of res.data
      const list = Array.isArray(res.data) ? res.data : (res.data.products || [])
      setProducts(list)
      setSearched(true)
    } catch { 
      setProducts([]) 
    } finally { 
      setLoading(false) 
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchProducts(query, category)
  }

  // Filter products locally by stock level
  const filteredProducts = products.filter(p => {
    if (stockFilter === 'out_of_stock') return p.totalStock === 0;
    if (stockFilter === 'low_stock') return p.totalStock > 0 && p.totalStock < 10;
    if (stockFilter === 'in_stock') return p.totalStock >= 10;
    return true;
  });

  const getStockBadge = (product) => {
    if (product.totalStock === 0) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 border border-red-100 flex items-center gap-1 w-max">
          <XCircle size={10} /> Out of Stock
        </span>
      );
    }
    if (product.totalStock < 10) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100 flex items-center gap-1 w-max">
          <Clock size={10} /> Low Stock ({product.totalStock} left)
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1 w-max">
        <CheckCircle size={10} /> In Stock
      </span>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-800 animate-fade-in bg-white border border-slate-100 rounded-2xl shadow-sm my-6">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-850 mb-1">Product Catalog</h1>
        <p className="text-slate-500 text-sm font-semibold">Check real-time stock levels, sizes, and colors of products.</p>
      </div>

      {/* Search & Filter Form */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-8">
        <div className="relative sm:col-span-2">
          <input 
            type="text" 
            placeholder="Search catalog..." 
            value={query}
            onChange={e => setQuery(e.target.value)} 
            className="w-full bg-slate-50 border border-slate-205 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-amber-500/50 transition-all" 
          />
          <Search size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
        </div>

        <div>
          <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <button type="submit" className="bg-[#f5c518] text-[#0a0e1a] font-extrabold px-6 py-3 rounded-xl hover:bg-[#e6b400] transition-all text-xs flex items-center justify-center gap-1.5 shadow-sm">
          <Filter size={14} /> Filter Search
        </button>
      </form>

      {/* Stock Level Quick Filter Tabs */}
      <div className="flex gap-2 mb-8 border-b border-slate-100 pb-4">
        {[
          { label: 'All Levels', value: '' },
          { label: 'Good Stock', value: 'in_stock' },
          { label: 'Low Stock', value: 'low_stock' },
          { label: 'Out of Stock', value: 'out_of_stock' }
        ].map(tab => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setStockFilter(tab.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              stockFilter === tab.value
                ? 'bg-slate-850 text-white shadow-sm'
                : 'bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-slate-50 h-52 rounded-2xl animate-pulse border border-slate-100 shadow-sm" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 border border-slate-100 rounded-2xl">
          <Package size={44} className="text-slate-300 mx-auto mb-3" />
          <h3 className="text-slate-700 font-extrabold text-sm mb-1">No products found</h3>
          <p className="text-slate-450 text-xs font-semibold">Try different search filters or select a different category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product._id} className="bg-white border border-slate-105 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[220px]">
              <div>
                {product.image && (
                  <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-xl mb-4 border border-slate-100" />
                )}
                <div className="mb-2">{getStockBadge(product)}</div>
                <h3 className="text-slate-800 font-extrabold text-xs mb-1 line-clamp-2 leading-snug">{product.name}</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">{product.category}</p>
              </div>

              <div>
                <p className="text-slate-800 font-black text-sm mb-3">KES {product.price?.toLocaleString()}</p>
                {product.variants?.length > 0 && (
                  <div className="border-t border-slate-50 pt-2.5">
                    <p className="text-slate-450 text-[9px] font-bold mb-1.5 uppercase tracking-wider">Sizes/Variants:</p>
                    <div className="flex flex-wrap gap-1">
                      {product.variants.map((v, i) => (
                        <span key={i} className={`text-[9px] font-bold px-2 py-0.5 rounded border ${v.stock > 0 ? 'bg-slate-50 border-slate-200 text-slate-650' : 'border-slate-100 text-slate-300 line-through'}`}>
                          {v.size || v.color} ({v.stock})
                        </span>
                      ))}
                    </div>
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
