import { useState, useEffect } from 'react'
import { Layers, Plus, Minus, Check, AlertTriangle } from 'lucide-react'
import api from '../../services/api'

export default function AdminInventory() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  const fetchProducts = () => {
    api.get('/stock')
      .then(res => {
        setProducts(Array.isArray(res.data) ? res.data : (res.data.products || []))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleRestock = async (product, newStock) => {
    setUpdating(product._id)
    try {
      const updatedVariants = product.variants?.map(v => ({
        ...v,
        stock: newStock
      })) || [{ size: 'Default', color: 'Default', stock: newStock }]

      await api.put(`/stock/${product._id}`, {
        name: product.name,
        category: product.category,
        price: product.price,
        variants: updatedVariants
      })
      fetchProducts()
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in text-slate-800">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Manage Inventory</h1>
        <p className="text-slate-500 text-sm font-semibold mt-0.5">Monitor stock levels, restock items, and track SKUs</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-white border border-slate-100 rounded-2xl animate-pulse shadow-sm" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl text-center py-16 shadow-sm">
          <Layers size={44} className="text-slate-355 mx-auto mb-3" />
          <p className="text-slate-500 font-bold">No products in inventory yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-black">
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">SKU / Variants</th>
                  <th className="p-4">Total Stock</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => {
                  const isLow = p.totalStock < 10 && p.totalStock > 0;
                  const isOut = p.totalStock === 0;
                  
                  return (
                    <tr key={p._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-bold text-slate-800">{p.name}</td>
                      <td className="p-4 font-semibold text-slate-500">{p.category}</td>
                      <td className="p-4 text-slate-500 font-semibold">
                        {p.variants?.map(v => `${v.sku || 'SKU'} (${v.size || 'N/A'}/${v.color || 'N/A'})`).join(', ') || 'No SKU'}
                      </td>
                      <td className="p-4 font-extrabold text-slate-800">{p.totalStock} units</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          isOut 
                            ? 'bg-red-50 text-red-600 border-red-100' 
                            : isLow 
                            ? 'bg-amber-50 text-amber-600 border-amber-100' 
                            : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Good Stock'}
                        </span>
                      </td>
                      <td className="p-4 text-right flex justify-end gap-1.5">
                        <button 
                          disabled={updating === p._id}
                          onClick={() => handleRestock(p, Math.max(0, p.totalStock - 5))}
                          className="p-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 disabled:opacity-50"
                        >
                          <Minus size={12} />
                        </button>
                        <button 
                          disabled={updating === p._id}
                          onClick={() => handleRestock(p, p.totalStock + 10)}
                          className="p-1.5 bg-[#f5c518]/10 hover:bg-[#f5c518]/20 border border-[#f5c518]/20 rounded-lg text-[#9a6a00] font-extrabold disabled:opacity-50 flex items-center gap-1 text-[10px]"
                        >
                          <Plus size={10} /> +10 Restock
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
