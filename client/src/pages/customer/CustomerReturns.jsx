import { useState, useEffect } from 'react'
import { RotateCcw, Plus, CheckCircle, XCircle, AlertCircle, Clock, Mail } from 'lucide-react'
import api, { getReturnsByEmail } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const REASONS = [
  { value: 'damaged',         label: 'Damaged on arrival' },
  { value: 'wrong_item',      label: 'Wrong item received' },
  { value: 'not_as_described',label: 'Not as described' },
  { value: 'changed_mind',    label: 'Changed my mind' },
  { value: 'other',           label: 'Other' },
]

export default function CustomerReturns() {
  const { user } = useAuth()
  const [returns, setReturns]   = useState([])
  const [loading, setLoading]   = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [policy, setPolicy]     = useState(null)
  const [form, setForm]         = useState({ orderId: '', reason: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess]   = useState('')
  const [error, setError]       = useState('')

  // Guest Email Lookup
  const [lookupEmail, setLookupEmail] = useState('')
  const [lookupReturns, setLookupReturns] = useState([])
  const [lookupError, setLookupError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const fetchReturns = () => {
    if (user) {
      setLoading(true)
      api.get('/returns/my').then(r => setReturns(r.data)).catch(() => {}).finally(() => setLoading(false))
    }
  }

  useEffect(() => {
    fetchReturns()
    api.get('/returns/policy').then(r => setPolicy(r.data)).catch(() => {})
  }, [user])

  const handleEmailLookup = async (e) => {
    e.preventDefault()
    if (!lookupEmail.trim()) return
    setLoading(true)
    setLookupError('')
    setLookupReturns([])
    setHasSearched(true)
    try {
      const res = await getReturnsByEmail(lookupEmail.trim().toLowerCase())
      setLookupReturns(res.data)
      if (res.data.length === 0) {
        setLookupError('No return requests found for this email address.')
      }
    } catch (err) {
      setLookupError('Failed to fetch returns. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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

  const ReturnCard = ({ r }) => (
    <div className="bg-white border border-amber-950/10 rounded-2xl p-6 shadow-xs text-stone-900 hover:border-amber-700/30 transition-all mb-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {statusIcon(r.status)}
            <p className="text-stone-900 font-extrabold text-sm">{r.returnId}</p>
          </div>
          <p className="text-stone-600 text-xs font-medium">Order: {r.orderId} · {REASONS.find(x => x.value === r.reason)?.label || r.reason}</p>
          <p className="text-stone-400 text-xs font-medium mt-0.5">{new Date(r.createdAt).toLocaleDateString()}</p>
          {r.notes && <p className="text-stone-500 text-xs mt-1.5 italic font-medium">"{r.notes}"</p>}
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize status-${r.status}`}>{r.status.replace(/_/g, ' ')}</span>
          {r.refundAmount > 0 && <span className="text-emerald-600 text-xs font-extrabold">KES {r.refundAmount.toLocaleString()} refund</span>}
          {r.resolvedAt && <span className="text-stone-400 text-[10px] font-medium">{new Date(r.resolvedAt).toLocaleDateString()}</span>}
        </div>
      </div>
    </div>
  )

  const isGuest = !user

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in text-stone-900">
      {/* Direct Email Lookup Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8 text-slate-900">
        <form onSubmit={handleEmailLookup} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email address (e.g. jane@example.com)"
            value={lookupEmail}
            onChange={e => setLookupEmail(e.target.value)}
            required
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 transition-all flex-1"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#111111] text-white font-extrabold px-6 py-3 rounded-xl hover:bg-black transition-all whitespace-nowrap"
          >
            {loading ? 'Fetching Returns…' : 'View Returns'}
          </button>
        </form>

        {lookupError && (
          <p className="text-red-500 text-sm mt-3 flex items-center gap-2 font-semibold">
            <AlertCircle size={15}/>{lookupError}
          </p>
        )}
      </div>

      {/* Returns List */}
      {hasSearched && (
        <div>
          {lookupReturns.length === 0 ? (
            <div className="bg-white border border-amber-950/10 rounded-2xl text-center py-12 shadow-xs text-stone-900">
              <RotateCcw size={44} className="text-stone-300 mx-auto mb-3" />
              <h3 className="text-stone-900 font-extrabold mb-1">No return requests found</h3>
              <p className="text-stone-500 text-sm font-medium">No return requests found for this email address.</p>
            </div>
          ) : (
            lookupReturns.map(r => <ReturnCard key={r._id} r={r} />)
          )}
        </div>
      )}

      {!hasSearched && !isGuest && returns.length > 0 && (
        <div>
          {returns.map(r => <ReturnCard key={r._id} r={r} />)}
        </div>
      )}
    </div>
  )
}
