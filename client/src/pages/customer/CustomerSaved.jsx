import { useState, useEffect } from 'react'
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function CustomerSaved() {
  const [savedProducts, setSavedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Dynamic stock list - filter mock saved ones or show premium catalog items as saved
    api.get('/stock')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data.products || []);
        // Seed first 2 items as saved for showcase
        setSavedProducts(data.slice(0, 2))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in text-slate-800">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Saved Items</h1>
        <p className="text-slate-500 text-sm mt-0.5 font-semibold">Your bookmarked and favorite products catalog</p>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-100 h-48 rounded-2xl animate-pulse shadow-sm" />
          ))}
        </div>
      ) : savedProducts.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl text-center py-12 shadow-sm text-slate-800">
          <Heart size={44} className="text-slate-350 mx-auto mb-3" />
          <h3 className="text-slate-850 font-extrabold mb-1">No saved items yet</h3>
          <p className="text-slate-500 text-sm font-semibold mb-6">Browse products to add them to your saved catalog list.</p>
          <Link to="/dashboard/stock" className="bg-[#f5c518] text-[#0a0e1a] font-extrabold px-6 py-2.5 rounded-xl hover:bg-[#e6b400] transition-colors inline-flex items-center gap-1.5 shadow-sm text-xs">
            Browse Products <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {savedProducts.map(product => (
            <div key={product._id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex gap-4 hover:shadow-md transition-shadow relative">
              <div className="w-20 h-20 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img 
                  src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&auto=format&fit=crop&q=60'} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-slate-800 font-extrabold text-sm truncate">{product.name}</h3>
                    <button className="text-red-500 hover:text-red-650 p-1 flex-shrink-0">
                      <Heart size={16} fill="currentColor" />
                    </button>
                  </div>
                  <p className="text-[#d4a017] text-xs font-black mt-1">KES {product.price?.toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-3">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${product.totalStock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {product.totalStock > 0 ? `${product.totalStock} In Stock` : 'Out of Stock'}
                  </span>
                  <Link to="/dashboard/stock" className="text-slate-800 hover:text-amber-500 font-black text-xs inline-flex items-center gap-0.5">
                    View Catalog <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
