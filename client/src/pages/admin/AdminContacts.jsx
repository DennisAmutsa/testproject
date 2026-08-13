import { useState, useEffect } from 'react'
import { MessageSquare, Check, Eye, Trash2, Mail, User, Clock } from 'lucide-react'
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

  const handleDelete = async (id) => {
    if (!confirm('Delete this ticket?')) return
    await api.delete(`/contact/${id}`).catch(() => {})
    fetchContacts()
  }

  const filtered = filterStatus ? contacts.filter(c => c.status === filterStatus) : contacts

  const getStatusBadge = (status) => {
    switch (status) {
      case 'resolved':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-1 rounded-full text-[10px] font-bold capitalize';
      case 'read':
        return 'bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-full text-[10px] font-bold capitalize';
      case 'new':
      default:
        return 'bg-amber-50 text-amber-600 border border-amber-100 px-2.5 py-1 rounded-full text-[10px] font-bold capitalize';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-800 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Support Tickets & Feedback</h1>
          <p className="text-slate-500 text-sm font-semibold mt-0.5">Read, resolve, and manage incoming support tickets from the contact form</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        {['', 'new', 'read', 'resolved'].map(s => (
          <button 
            key={s} 
            onClick={() => setFilter(s)} 
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize ${
              filterStatus === s 
                ? 'bg-[#f5c518] text-[#0a0e1a]' 
                : 'bg-white border border-slate-105 text-slate-500 hover:text-slate-800 shadow-sm'
            }`}
          >
            {s || 'All'} {s ? `(${contacts.filter(c => c.status === s).length})` : `(${contacts.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-105 h-20 rounded-2xl animate-pulse shadow-sm" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl text-center py-16 shadow-sm">
          <MessageSquare size={44} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-bold text-sm">No messages found in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(c => (
            <div key={c._id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(c.status)}
                    <h3 className="text-slate-850 font-black text-sm">{c.subject}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-1 text-slate-500 text-[10px] font-bold">
                    <p className="flex items-center gap-1"><User size={12}/>{c.name}</p>
                    <p className="flex items-center gap-1"><Mail size={12}/>{c.email}</p>
                    <p className="flex items-center gap-1"><Clock size={12}/>{new Date(c.createdAt).toLocaleString()}</p>
                  </div>

                  {expanded === c._id && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-xl text-slate-700 text-xs font-semibold leading-relaxed border border-slate-100 animate-fade-in">
                      {c.message}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button 
                    onClick={() => { setExpanded(expanded === c._id ? null : c._id); if (c.status === 'new') updateStatus(c._id, 'read') }}
                    className="px-3 py-1.5 text-[10px] font-bold rounded-lg border border-slate-205 bg-slate-50 hover:bg-[#f5c518]/10 hover:border-[#f5c518]/30 text-slate-600 hover:text-[#9a6a00] transition-colors flex items-center gap-1"
                  >
                    <Eye size={12} /> {expanded === c._id ? 'Hide Message' : 'View Message'}
                  </button>
                  {c.status !== 'resolved' && (
                    <button 
                      onClick={() => updateStatus(c._id, 'resolved')}
                      className="px-3 py-1.5 text-[10px] font-bold rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1"
                    >
                      <Check size={12} /> Mark Resolved
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(c._id)} 
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-slate-100"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
