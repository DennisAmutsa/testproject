import { useState } from 'react'
import { Settings, Save, Check } from 'lucide-react'

export default function AdminSettings() {
  const [currency, setCurrency] = useState('KES')
  const [email, setEmail] = useState('support@northstar.com')
  const [phone, setPhone] = useState('+254 700 000 000')
  const [success, setSuccess] = useState(false)

  const handleSave = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-800 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Store Settings</h1>
        <p className="text-slate-500 text-sm font-semibold mt-0.5">Configure store info, primary currency, and contact numbers</p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-xs font-bold flex items-center gap-1.5 animate-fade-in">
            <Check size={14} /> Store settings updated successfully!
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-650 mb-1.5">Store Currency</label>
            <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none text-xs">
              <option value="KES">Kenyan Shilling (KES)</option>
              <option value="USD">US Dollar ($)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-650 mb-1.5">Support Contact Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none text-xs" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-650 mb-1.5">Support Phone Line</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none text-xs" />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button type="submit" className="bg-[#f5c518] text-[#0a0e1a] font-extrabold px-5 py-2.5 rounded-xl hover:bg-[#e6b400] transition-all flex items-center gap-1.5 shadow-sm text-xs">
            <Save size={15} /> Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
