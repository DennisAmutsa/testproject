import { useState, useEffect } from 'react'
import { Plus, Tag, Folder } from 'lucide-react'
import api from '../../services/api'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/stock/categories').catch(() => ({ data: [] })),
      api.get('/stock').catch(() => ({ data: [] }))
    ]).then(([catRes, stockRes]) => {
      setCategories(catRes.data)
      setProducts(Array.isArray(stockRes.data) ? stockRes.data : (stockRes.data.products || []))
    }).catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in text-slate-800">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Product Categories</h1>
        <p className="text-slate-500 text-sm font-semibold mt-0.5">Manage and organize store product categorization</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-white border border-slate-100 rounded-2xl animate-pulse shadow-sm" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl text-center py-16 shadow-sm">
          <Tag size={44} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-bold">No categories defined yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {categories.map(c => {
            const count = products.filter(p => p.category === c).length;
            return (
              <div key={c} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#f5c518]/10 rounded-xl flex items-center justify-center text-[#9a6a00]">
                    <Folder size={18} />
                  </div>
                  <div>
                    <h3 className="text-slate-800 font-extrabold text-sm">{c}</h3>
                    <p className="text-slate-400 text-xs mt-0.5 font-semibold">{count} products linked</p>
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
