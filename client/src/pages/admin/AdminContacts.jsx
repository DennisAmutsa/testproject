import { useState, useEffect } from 'react'
import { MessageSquare, Check, Eye } from 'lucide-react'
import api from '../../services/api'

export default function AdminContacts() {
  const [contacts, setContacts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [expanded, setExpanded]   = useState(null)
  const [filterStatus, setFilter] = useState('')

  const fetchContacts = () =>
    api.get('/contact').then(r => setContacts(r.data)).catch(() => {}).finally(() => setLoading(false))

  useEffect(() => { fetchContacts() }, [])

  const updateStatus = async (id, status) => {
    await api.patch(`/contact/${id}/status`, { status }).catch(() => {})
    fetchContacts()
  }

  const filtered = filterStatus ? contacts.filter(c => c.status === filterStatus) : contacts

  const statusColor = { new: 'bg-blue-500/20 text-blue-400', read: 'bg-yellow-500/20 text-yellow-400', resolved: 'bg-green-500/20 text-green-400' }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Contact Messages</h1>
        <p className="text-brand-muted text-sm">Messages from the contact form</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {['', 'new', 'read', 'resolved'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filterStatus === s ? 'bg-brand-gold text-brand-navy' : 'bg-brand-card border border-brand-border text-brand-muted hover:text-white'}`}>
            {s || 'All'} {s ? `(${contacts.filter(c => c.status === s).length})` : `(${contacts.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="card h-20 animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16"><MessageSquare size={44} className="text-brand-muted mx-auto mb-3" /><p className="text-brand-muted">No messages found.</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => (
            <div key={c._id} className={`card transition-all ${c.status === 'new' ? 'border-blue-500/30' : ''}`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge ${statusColor[c.status]}`}>{c.status}</span>
                    <p className="text-white font-semibold text-sm">{c.subject}</p>
                  </div>
                  <p className="text-brand-muted text-xs">{c.name} · {c.email} · {new Date(c.createdAt).toLocaleDateString()}</p>
                  {expanded === c._id && (
                    <p className="mt-3 text-white text-sm leading-relaxed border-t border-brand-border pt-3 animate-fade-in">{c.message}</p>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => { setExpanded(expanded === c._id ? null : c._id); if (c.status === 'new') updateStatus(c._id, 'read') }}
                    className="px-2 py-1 text-xs rounded-lg border border-brand-border text-brand-muted hover:text-white transition-all flex items-center gap-1">
                    <Eye size={12} />{expanded === c._id ? 'Hide' : 'Read'}
                  </button>
                  {c.status !== 'resolved' && (
                    <button onClick={() => updateStatus(c._id, 'resolved')}
                      className="px-2 py-1 text-xs rounded-lg border border-green-400/40 text-green-400 hover:bg-green-500/10 transition-all flex items-center gap-1">
                      <Check size={12} />Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
