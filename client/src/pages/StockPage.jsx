import { useState, useEffect } from "react"
import { Search, Filter, Package, CheckCircle, XCircle, Clock, Bell, ShoppingBag, Check, X, ArrowRight } from "lucide-react"
import { searchProducts, subscribeRestockAlert, placeOrder } from "../services/api"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

export default function StockPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("")
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [stockFilter, setStockFilter] = useState("")
  const [notifyState, setNotifyState] = useState({})

  // Order modal state
  const [orderModalProduct, setOrderModalProduct] = useState(null)
  const [orderForm, setOrderForm] = useState({
    customerName: "",
    customerEmail: "",
    selectedVariant: "",
    quantity: 1
  })
  const [orderSubmitting, setOrderSubmitting] = useState(false)
  const [orderError, setOrderError] = useState("")
  const [orderSuccess, setOrderSuccess] = useState(null)

  useEffect(() => {
    api.get("/stock/categories").then(r => setCategories(r.data)).catch(() => {})
    fetchProducts()
  }, [])

  useEffect(() => {
    if (user) {
      setOrderForm(f => ({
        ...f,
        customerName: user.name || "",
        customerEmail: user.email || ""
      }))
    }
  }, [user])

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

  // Restock notify helpers
  const openNotify = (productId) =>
    setNotifyState(s => ({ ...s, [productId]: { open: true, email: user?.email || "", loading: false, success: "", error: "" } }))

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

  // Order modal helpers
  const openOrderModal = (product) => {
    const defaultVariant = product.variants?.find(v => v.stock > 0)?.size || product.variants?.[0]?.size || ""
    setOrderModalProduct(product)
    setOrderForm(f => ({
      ...f,
      customerName: user?.name || "",
      customerEmail: user?.email || "",
      selectedVariant: defaultVariant,
      quantity: 1
    }))
    setOrderError("")
    setOrderSuccess(null)
  }

  const closeOrderModal = () => {
    setOrderModalProduct(null)
    setOrderSuccess(null)
    setOrderError("")
  }

  const handleOrderSubmit = async (e) => {
    e.preventDefault()
    if (!orderForm.customerName || !orderForm.customerEmail) {
      setOrderError("Name and email are required.")
      return
    }

    setOrderSubmitting(true)
    setOrderError("")

    try {
      const itemData = {
        name: orderModalProduct.name,
        price: orderModalProduct.price,
        quantity: Number(orderForm.quantity),
        image: orderModalProduct.image || "",
        productId: orderModalProduct.productId,
        size: orderForm.selectedVariant
      }

      const res = await placeOrder({
        customerName: orderForm.customerName,
        customerEmail: orderForm.customerEmail,
        items: [itemData]
      })

      setOrderSuccess(res.data.order)
      fetchProducts() // Refresh stock levels in background
    } catch (err) {
      setOrderError(err.response?.data?.message || "Failed to place order. Please try again.")
    } finally {
      setOrderSubmitting(false)
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
        <h1 className="text-2xl font-extrabold text-slate-850 mb-1">Product Catalog & Ordering</h1>
        <p className="text-slate-500 text-sm font-semibold">Browse real-time inventory, place orders, or request back-in-stock alerts.</p>
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
                className={`border rounded-2xl p-5 shadow-sm transition-all flex flex-col justify-between min-h-[240px] relative ${isOut ? "bg-slate-50 border-slate-200 opacity-60 grayscale" : "bg-white border-slate-100 hover:shadow-md"}`}>

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

                  {/* Action buttons: Order Now (In Stock) OR Notify Me (Out of Stock) */}
                  {!isOut ? (
                    <button
                      onClick={() => openOrderModal(product)}
                      className="w-full flex items-center justify-center gap-1.5 bg-[#f5c518] text-[#0a0e1a] font-extrabold text-xs py-2 rounded-xl hover:bg-[#e6b400] transition-all shadow-sm"
                    >
                      <ShoppingBag size={13} /> Order Now
                    </button>
                  ) : (
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

      {/* Place Order Modal */}
      {orderModalProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-up relative">
            <button
              onClick={closeOrderModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={18} />
            </button>

            {!orderSuccess ? (
              <>
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-sm">{orderModalProduct.name}</h3>
                    <p className="text-slate-500 text-xs font-semibold">KES {orderModalProduct.price?.toLocaleString()}</p>
                  </div>
                </div>

                {orderError && (
                  <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold">
                    {orderError}
                  </div>
                )}

                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jane Doe"
                      value={orderForm.customerName}
                      onChange={e => setOrderForm({ ...orderForm, customerName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. jane@example.com"
                      value={orderForm.customerEmail}
                      onChange={e => setOrderForm({ ...orderForm, customerEmail: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {orderModalProduct.variants?.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Select Size / Variant</label>
                        <select
                          value={orderForm.selectedVariant}
                          onChange={e => setOrderForm({ ...orderForm, selectedVariant: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none"
                        >
                          {orderModalProduct.variants.map((v, i) => (
                            <option key={i} value={v.size || v.color} disabled={v.stock === 0}>
                              {v.size || v.color} {v.stock === 0 ? "(Out of stock)" : `(${v.stock} available)`}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={orderForm.quantity}
                          onChange={e => setOrderForm({ ...orderForm, quantity: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-600">Total Price:</span>
                    <span className="font-black text-slate-850 text-sm">
                      KES {(orderModalProduct.price * orderForm.quantity).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={orderSubmitting}
                      className="flex-1 bg-[#f5c518] text-[#0a0e1a] font-extrabold text-xs py-3 rounded-xl hover:bg-[#e6b400] transition-colors shadow-sm disabled:opacity-50"
                    >
                      {orderSubmitting ? "Placing Order…" : "Confirm & Place Order"}
                    </button>
                    <button
                      type="button"
                      onClick={closeOrderModal}
                      className="px-4 py-3 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check size={24} />
                </div>
                <h3 className="font-extrabold text-slate-800 text-base mb-1">Order Placed Successfully!</h3>
                <p className="text-slate-500 text-xs mb-4">Your order ID has been generated for tracking:</p>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 inline-block">
                  <span className="text-xs text-amber-700 font-semibold block">Order Tracking ID:</span>
                  <span className="text-lg font-black text-slate-900 tracking-wider select-all">{orderSuccess.orderId}</span>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      closeOrderModal()
                      navigate(user ? "/dashboard/orders" : `/orders`)
                    }}
                    className="w-full bg-[#0a0e1a] text-white font-extrabold text-xs py-3 rounded-xl hover:bg-slate-900 transition-colors flex items-center justify-center gap-1.5"
                  >
                    Track My Order <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={closeOrderModal}
                    className="w-full text-slate-500 text-xs font-bold py-2 hover:text-slate-800"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
