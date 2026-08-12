import { useState, useEffect } from 'react'
import { RotateCcw, CheckCircle, XCircle } from 'lucide-react'
import api from '../../services/api'

const STATUS_FLOW = ['requested', 'approved', 'received', 'refund_processing', 'refunded', 'rejected']

export default function AdminReturns() {
  const [returns, setReturns]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [updating, setUpdating]   = useState(null)
  const [filterStatus, setFilter] = useState('')

  const fetchReturns = () =>
    api.get('/returns').then(r => setReturns(r.data)).catch(() => {}).finally(() => setLoading(false))

  useEffect(() => { fetchReturns() }, [])

  const updateStatus = async (id, status) => {
    setUpdating(id)
    let refundAmount
    if (status === 'refunded') {
      const amt = prompt('Enter refund amount (KES):')
      refundAmount = Number(amt) || 0
    }
    await api.patch(`/returns/${id}/status`, { status, refundAmount }).catch(() => {})
    setUpdating(null); fetchReturns()
  }

  const filtered = filterStatus ? returns.filter(r => r.status === filterStatus) : returns

  const nextActions = (status) => {
    const idx = STATUS_FLOW.indexOf(status)
    const actions = []
    if (status === 'requested') actions.push('approved', 'rejected')
    else if (status === 'approved') actions.push('received')
    else if (status === 'received') actions.push('refund_processing')
    else if (status === 'refund_processing') actions.push('refunded')
    return actions
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Return Requests</h1>
        <p className="text-brand-muted text-sm">Review and process customer returns</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button onClick={() => setFilter('')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!filterStatus ? 'bg-brand-gold text-brand-navy' : 'bg-brand-card border border-brand-border text-brand-muted hover:text-white'}`}>All ({returns.length})</button>
        {STATUS_FLOW.map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filterStatus === s ? 'bg-brand-gold text-brand-navy' : 'bg-brand-card border border-brand-border text-brand-muted hover:text-white'}`}>
            {s.replace(/_/g, ' ')} ({returns.filter(r => r.status === s).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="card h-24 animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16"><RotateCcw size={44} className="text-brand-muted mx-auto mb-3" /><p className="text-brand-muted">No return requests found.</p></div>
      ) : (
        <div className="space-y-4">
          {filtered.map(r => (
            <div key={r._id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white font-bold text-sm">{r.returnId}</p>
                    <span className={`status-${r.status}`}>{r.status.replace(/_/g, ' ')}</span>
                  </div>
                  <p className="text-brand-muted text-xs">{r.customerName} · {r.customerEmail}</p>
                  <p className="text-brand-muted text-xs">Order: {r.orderId} · Reason: {r.reason.replace(/_/g, ' ')}</p>
                  {r.notes && <p className="text-brand-muted text-xs italic mt-0.5">"{r.notes}"</p>}
                  <p className="text-brand-muted text-xs mt-0.5">{new Date(r.createdAt).toLocaleDateString()}</p>
                  {r.refundAmount > 0 && <p className="text-green-400 text-xs font-semibold mt-1">Refund: KES {r.refundAmount.toLocaleString()}</p>}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {nextActions(r.status).map(action => (
                    <button key={action} disabled={updating === r._id} onClick={() => updateStatus(r._id, action)}
                      className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all capitalize disabled:opacity-50 ${action === 'rejected' ? 'border border-red-400/40 text-red-400 hover:bg-red-500/10' : 'border border-brand-gold/40 text-brand-gold hover:bg-brand-gold/10'}`}>
                      {action === 'approved' && <CheckCircle size={12} className="inline mr-1" />}
                      {action === 'rejected' && <XCircle size={12} className="inline mr-1" />}
                      {action.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
