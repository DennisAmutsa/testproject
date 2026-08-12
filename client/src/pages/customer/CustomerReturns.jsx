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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">My Returns</h1>
          <p className="text-brand-muted text-sm mt-0.5">Manage your return and refund requests</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setError(''); setSuccess('') }} className="btn-gold">
          <Plus size={16} /> New Return Request
        </button>
      </div>

      {/* Success / Error */}
      {success && <div className="mb-4 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm flex items-center gap-2"><CheckCircle size={16}/>{success}</div>}
      {error   && <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2"><AlertCircle size={16}/>{error}</div>}

      {/* New Return Form */}
      {showForm && (
        <div className="card mb-8 animate-slide-up">
          <h2 className="text-white font-semibold mb-4">Submit a Return Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Order ID</label>
              <input type="text" placeholder="e.g. NS-10021" value={form.orderId}
                onChange={e => setForm({ ...form, orderId: e.target.value })} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Reason for Return</label>
              <select value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} required className="input-field">
                <option value="">Select a reason…</option>
                {REASONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Additional Notes <span className="text-brand-muted">(optional)</span></label>
              <textarea rows={3} placeholder="Describe the issue…" value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })} className="input-field resize-none" />
            </div>
            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={submitting} className="btn-gold">
                <RotateCcw size={15} />{submitting ? 'Submitting…' : 'Submit Request'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Return Policy */}
      {policy && (
        <div className="card mb-6 border-brand-gold/20">
          <h3 className="text-brand-gold font-semibold text-sm mb-3">📋 Return Policy</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-brand-muted text-xs mb-1">Return Window</p>
              <p className="text-white">{policy.windowDays} days from delivery</p>
            </div>
            <div>
              <p className="text-brand-muted text-xs mb-1">Refund Timeline</p>
              <p className="text-white">{policy.refundTimeline}</p>
            </div>
          </div>
        </div>
      )}

      {/* Returns List */}
      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="card h-24 animate-pulse" />)}</div>
      ) : returns.length === 0 ? (
        <div className="card text-center py-12">
          <RotateCcw size={44} className="text-brand-muted mx-auto mb-3" />
          <h3 className="text-white font-semibold mb-1">No return requests</h3>
          <p className="text-brand-muted text-sm">Submit a request above to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {returns.map(r => (
            <div key={r._id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {statusIcon(r.status)}
                    <p className="text-white font-semibold text-sm">{r.returnId}</p>
                  </div>
                  <p className="text-brand-muted text-xs">Order: {r.orderId} · {REASONS.find(x => x.value === r.reason)?.label || r.reason}</p>
                  <p className="text-brand-muted text-xs mt-0.5">{new Date(r.createdAt).toLocaleDateString()}</p>
                  {r.notes && <p className="text-brand-muted text-xs mt-1 italic">"{r.notes}"</p>}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`status-${r.status}`}>{r.status.replace(/_/g, ' ')}</span>
                  {r.refundAmount > 0 && <span className="text-green-400 text-xs font-semibold">KES {r.refundAmount.toLocaleString()} refund</span>}
                  {r.resolvedAt && <span className="text-brand-muted text-xs">{new Date(r.resolvedAt).toLocaleDateString()}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
