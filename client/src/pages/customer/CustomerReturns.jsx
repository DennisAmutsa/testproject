import { useState, useEffect } from 'react'
import { RotateCcw, Plus, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react'
import api from '../../services/api'

const REASONS = [
  { value: 'damaged',         label: 'Damaged on arrival' },
  { value: 'wrong_item',      label: 'Wrong item received' },
  { value: 'not_as_described',label: 'Not as described' },
  { value: 'changed_mind',    label: 'Changed my mind' },
  { value: 'other',           label: 'Other' },
]

export default function CustomerReturns() {
  const [returns, setReturns]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [policy, setPolicy]     = useState(null)
  const [form, setForm]         = useState({ orderId: '', reason: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess]   = useState('')
  const [error, setError]       = useState('')

  const fetchReturns = () =>
    api.get('/returns/my').then(r => setReturns(r.data)).catch(() => {}).finally(() => setLoading(false))

  useEffect(() => {
    fetchReturns()
    api.get('/returns/policy').then(r => setPolicy(r.data)).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess(''); setSubmitting(true)
    try {
      const res = await api.post('/returns', form)
      setSuccess(res.data.message)
      setForm({ orderId: '', reason: '', notes: '' })
      setShowForm(false)
      fetchReturns()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit. Please try again.')
    } finally { setSubmitting(false) }
  }

  const statusIcon = (s) => {
    if (s === 'refunded') return <CheckCircle size={14} className="text-green-400" />
    if (s === 'rejected') return <XCircle size={14} className="text-red-400" />
    return <Clock size={14} className="text-yellow-400" />
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">My Returns</h1>
          <p className="text-slate-500 text-sm mt-0.5 font-semibold">Manage your return and refund requests</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setError(''); setSuccess('') }} className="bg-[#f5c518] text-[#0a0e1a] font-extrabold px-5 py-2.5 rounded-xl hover:bg-[#e6b400] transition-all flex items-center gap-1.5 shadow-sm">
          <Plus size={16} /> New Return Request
        </button>
      </div>

      {/* Success / Error */}
      {success && <div className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm flex items-center gap-2 font-semibold"><CheckCircle size={16}/>{success}</div>}
      {error   && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2 font-semibold"><AlertCircle size={16}/>{error}</div>}

      {/* New Return Form */}
      {showForm && (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-8 animate-slide-up">
          <h2 className="text-slate-800 font-extrabold mb-4 text-base">Submit a Return Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-650 mb-1.5">Order ID</label>
              <input type="text" placeholder="e.g. NS-10021" value={form.orderId}
                onChange={e => setForm({ ...form, orderId: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-855 placeholder-slate-450 focus:outline-none focus:border-amber-500/60 transition-all text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-650 mb-1.5">Reason for Return</label>
              <select value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-855 placeholder-slate-450 focus:outline-none focus:border-amber-500/60 transition-all text-xs">
                <option value="">Select a reason…</option>
                {REASONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-650 mb-1.5">Additional Notes <span className="text-slate-400 font-normal">(optional)</span></label>
              <textarea rows={3} placeholder="Describe the issue…" value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-855 placeholder-slate-450 focus:outline-none focus:border-amber-500/60 transition-all text-xs resize-none" />
            </div>
            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={submitting} className="bg-[#f5c518] text-[#0a0e1a] font-extrabold px-5 py-2.5 rounded-xl hover:bg-[#e6b400] transition-all flex items-center gap-1.5 shadow-sm text-xs">
                <RotateCcw size={14} />{submitting ? 'Submitting…' : 'Submit Request'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-slate-200 text-slate-700 hover:bg-slate-50 font-extrabold px-5 py-2.5 rounded-xl text-xs transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Return Policy */}
      {policy && (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6 border-amber-500/20">
          <h3 className="text-[#d4a017] font-extrabold text-sm mb-3">📋 Return Policy</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1">Return Window</p>
              <p className="text-slate-750 font-extrabold">{policy.windowDays} days from delivery</p>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1">Refund Timeline</p>
              <p className="text-slate-750 font-extrabold">{policy.refundTimeline}</p>
            </div>
          </div>
        </div>
      )}

      {/* Returns List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-100 h-24 rounded-2xl animate-pulse shadow-sm" />
          ))}
        </div>
      ) : returns.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl text-center py-12 shadow-sm text-slate-800">
          <RotateCcw size={44} className="text-slate-300 mx-auto mb-3" />
          <h3 className="text-slate-800 font-extrabold mb-1">No return requests</h3>
          <p className="text-slate-500 text-sm font-semibold">Submit a request above to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {returns.map(r => (
            <div key={r._id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm text-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {statusIcon(r.status)}
                    <p className="text-slate-800 font-extrabold text-sm">{r.returnId}</p>
                  </div>
                  <p className="text-slate-500 text-xs font-semibold">Order: {r.orderId} · {REASONS.find(x => x.value === r.reason)?.label || r.reason}</p>
                  <p className="text-slate-400 text-xs font-semibold mt-0.5">{new Date(r.createdAt).toLocaleDateString()}</p>
                  {r.notes && <p className="text-slate-500 text-xs mt-1.5 italic font-medium">"{r.notes}"</p>}
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize status-${r.status}`}>{r.status.replace(/_/g, ' ')}</span>
                  {r.refundAmount > 0 && <span className="text-green-600 text-xs font-extrabold">KES {r.refundAmount.toLocaleString()} refund</span>}
                  {r.resolvedAt && <span className="text-slate-400 text-[10px] font-semibold">{new Date(r.resolvedAt).toLocaleDateString()}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
  )
}
