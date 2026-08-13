import { useState, useEffect } from "react"
import { Search, Filter, Package, CheckCircle, XCircle, Clock, Bell } from "lucide-react"
import { searchProducts, subscribeRestockAlert } from "../services/api"
import api from "../services/api"

export default function StockPage() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("")
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [stockFilter, setStockFilter] = useState("")
  const [notifyState, setNotifyState] = useState({})

  useEffect(() => {
    api.get("/stock/categories").then(r => setCategories(r.data)).catch(() => {})
    fetchProducts()
  }, [])

  const fetchProducts = async (q = "", cat = "") => {
    setLoading(true)
    try {
      const res = await searchProducts(q || undefined, cat || undefined)
      const list = Array.isArray(res.data) ? res.data : (res.data.products || [])
      setProducts(list)
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

  const filteredProducts = products.filter(p => {
    if (stockFilter === "out_of_stock") return p.totalStock === 0
    if (stockFilter === "low_stock") return p.totalStock > 0 && p.totalStock < 10
    if (stockFilter === "in_stock") return p.totalStock >= 10
    return true
  })

  const openNotify = (productId) =>
    setNotifyState(s => ({ ...s, [productId]: { open: true, email: "", loading: false, success: "", error: "" } }))

  const closeNotify = (productId) =>
    setNotifyState(s => ({ ...s, [productId]: { ...s[productId], open: false } }))

  const handleNotifySubmit = async (productId, e) => {
    e.preventDefault()
    const ns = notifyState[productId]
    if (!ns?.email) return
    setNotifyState(s => ({ ...s, [productId]: { ...s[productId], loading: true, error: "" } }))
    try {
      const res = await subscribeRestockAlert(productId, ns.email)
      setNotifyState(s => ({ ...s, [productId]: { ...s[productId], loading: false, success: res.data.message, open: false } }))
    } catch (err) {
      setNotifyState(s => ({ ...s, [productId]: { ...s[productId], loading: false, error: err.response?.data?.message || "Failed. Try again." } }))
    }
  }

  const getStockBadge = (product) => {
    if (product.totalStock === 0)
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 border border-red-100 flex items-center gap-1 w-max"><XCircle size={10} /> Out of Stock</span>
    if (product.totalStock < 10)
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100 flex items-center gap-1 w-max"><Clock size={10} /> Low Stock ({product.totalStock} left)</span>
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1 w-max"><CheckCircle size={10} /> In Stock</span>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-800 animate-fade-in bg-white border border-slate-100 rounded-2xl shadow-sm my-6">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-850 mb-1">Product Catalog</h1>
        <p className="text-slate-500 text-sm font-semibold">Check real-time stock levels, sizes, and colors of products.</p>
      </div>

      {/* Search & Filter */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-8">
        <div className="relative sm:col-span-2">
          <input type="text" placeholder="Search catalog..." value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-amber-500/50 transition-all" />
          <Search size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button type="submit" className="bg-[#f5c518] text-[#0a0e1a] font-extrabold px-6 py-3 rounded-xl hover:bg-[#e6b400] transition-all text-xs flex items-center justify-center gap-1.5 shadow-sm">
          <Filter size={14} /> Filter Search
        </button>
      </form>

      {/* Stock Tabs */}
      <div className="flex gap-2 mb-8 border-b border-slate-100 pb-4 flex-wrap">
        {[{ label: "All Levels", value: "" }, { label: "Good Stock", value: "in_stock" }, { label: "Low Stock", value: "low_stock" }, { label: "Out of Stock", value: "out_of_stock" }].map(tab => (
          <button key={tab.value} type="button" onClick={() => setStockFilter(tab.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${stockFilter === tab.value ? "bg-[#0a0e1a] text-white shadow-sm" : "bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <div key={i} className="bg-slate-50 h-52 rounded-2xl animate-pulse border border-slate-100" />)}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 border border-slate-100 rounded-2xl">
          <Package size={44} className="text-slate-300 mx-auto mb-3" />
          <h3 className="text-slate-700 font-extrabold text-sm mb-1">No products found</h3>
          <p className="text-slate-500 text-xs font-semibold">Try different search filters or select a different category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => {
            const isOut = product.totalStock === 0
            const ns = notifyState[product.productId] || {}
            return (
              <div key={product._id}
                className={`border rounded-2xl p-5 shadow-sm transition-all flex flex-col justify-between min-h-[220px] relative ${isOut ? "bg-slate-50 border-slate-200 opacity-60 grayscale" : "bg-white border-slate-100 hover:shadow-md"}`}>

                {/* Unavailable ribbon */}
                {isOut && (
                  <div className="absolute top-3 right-3 bg-red-100 text-red-600 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-red-200">
                    Unavailable
                  </div>
                )}

                <div>
                  {product.image && (
                    <img src={product.image} alt={product.name}
                      className={`w-full h-32 object-cover rounded-xl mb-4 border border-slate-100 ${isOut ? "grayscale" : ""}`} />
                  )}
                  <div className="mb-2">{getStockBadge(product)}</div>
                  <h3 className="text-slate-800 font-extrabold text-xs mb-1 line-clamp-2 leading-snug">{product.name}</h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">{product.category}</p>
                </div>

                <div>
                  <p className="text-slate-800 font-black text-sm mb-3">KES {product.price?.toLocaleString()}</p>

                  {product.variants?.length > 0 && (
                    <div className="border-t border-slate-50 pt-2.5 mb-3">
                      <p className="text-slate-400 text-[9px] font-bold mb-1.5 uppercase tracking-wider">Sizes/Variants:</p>
                      <div className="flex flex-wrap gap-1">
                        {product.variants.map((v, i) => (
                          <span key={i} className={`text-[9px] font-bold px-2 py-0.5 rounded border ${v.stock > 0 ? "bg-slate-50 border-slate-200 text-slate-600" : "border-slate-100 text-slate-300 line-through"}`}>
                            {v.size || v.color} ({v.stock})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notify Me — only shown on out-of-stock cards */}
                  {isOut && (
                    <div className="border-t border-slate-100 pt-3">
                      {ns.success ? (
                        <p className="text-emerald-600 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle size={11} /> {ns.success}
                        </p>
                      ) : ns.open ? (
                        <form onSubmit={e => handleNotifySubmit(product.productId, e)} className="flex flex-col gap-1.5">
                          <input type="email" required placeholder="your@email.com"
                            value={ns.email || ""}
                            onChange={e => setNotifyState(s => ({ ...s, [product.productId]: { ...s[product.productId], email: e.target.value } }))}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-800 focus:outline-none focus:border-amber-400" />
                          {ns.error && <p className="text-red-500 text-[9px] font-bold">{ns.error}</p>}
                          <div className="flex gap-1">
                            <button type="submit" disabled={ns.loading}
                              className="flex-1 bg-[#0a0e1a] text-white text-[9px] font-black py-1.5 rounded-lg hover:bg-black transition-colors disabled:opacity-50">
                              {ns.loading ? "Saving…" : "Notify Me"}
                            </button>
                            <button type="button" onClick={() => closeNotify(product.productId)}
                              className="px-2 py-1.5 rounded-lg border border-slate-200 text-[9px] text-slate-500 hover:bg-slate-50">
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button onClick={() => openNotify(product.productId)}
                          className="w-full flex items-center justify-center gap-1.5 border border-slate-200 text-slate-400 hover:border-amber-400 hover:text-amber-600 text-[10px] font-bold py-2 rounded-lg transition-all">
                          <Bell size={11} /> Notify me when back in stock
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
