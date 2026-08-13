import { useState, useEffect } from 'react'
import { Plus, Percent, Check, Trash2, Calendar } from 'lucide-react'

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState([
    { id: '1', code: 'NORTHSTAR10', discount: 10, type: 'percentage', active: true, expiry: '2026-12-31' },
    { id: '2', code: 'WELCOME50', discount: 50, type: 'fixed', active: true, expiry: '2026-09-30' }
  ])
  const [code, setCode] = useState('')
  const [discount, setDiscount] = useState('')
  const [type, setType] = useState('percentage')
  const [expiry, setExpiry] = useState('')
  const [showForm, setShowForm] = useState(false)

  const handleAdd = (e) => {
    e.preventDefault();
    if (!code || !discount) return;
    const newPromo = {
      id: String(Date.now()),
      code: code.toUpperCase(),
      discount: Number(discount),
      type,
      active: true,
      expiry: expiry || '2026-12-31'
    };
    setPromotions([...promotions, newPromo]);
    setCode('');
    setDiscount('');
    setExpiry('');
    setShowForm(false);
  }

  const handleDelete = (id) => {
    setPromotions(promotions.filter(p => p.id !== id))
  }

  const handleToggle = (id) => {
    setPromotions(promotions.map(p => p.id === id ? { ...p, active: !p.active } : p))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Store Promotions</h1>
          <p className="text-slate-500 text-sm font-semibold mt-0.5">Create and manage coupon codes, discounts, and active campaigns</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-[#f5c518] text-[#0a0e1a] font-extrabold px-5 py-2.5 rounded-xl hover:bg-[#e6b400] transition-all flex items-center gap-1.5 shadow-sm text-xs">
          <Plus size={16} /> Add Promotion
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-md mb-8 animate-slide-up space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Coupon Code</label>
              <input type="text" placeholder="WINTER20" value={code} onChange={e => setCode(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Discount Val</label>
              <input type="number" placeholder="20" value={discount} onChange={e => setDiscount(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed (KES)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Expiry Date</label>
              <input type="date" value={expiry} onChange={e => setExpiry(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none" />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-[#f5c518] text-[#0a0e1a] font-extrabold px-4 py-2 rounded-xl text-xs hover:bg-[#e6b400]">Create</button>
            <button type="button" onClick={() => setShowForm(false)} className="border border-slate-200 px-4 py-2 rounded-xl text-xs">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-black">
              <th className="p-4">Promo Code</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Expiry</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map(p => (
              <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-800 flex items-center gap-1.5">
                  <Percent size={14} className="text-[#9a6a00]" /> {p.code}
                </td>
                <td className="p-4 font-semibold text-slate-600">
                  {p.discount} {p.type === 'percentage' ? '%' : 'KES'}
                </td>
                <td className="p-4 text-slate-450 font-medium">{p.expiry}</td>
                <td className="p-4">
                  <button onClick={() => handleToggle(p.id)} className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${p.active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                    {p.active ? 'Active' : 'Disabled'}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(p.id)} className="text-slate-400 hover:text-red-500 p-1"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
