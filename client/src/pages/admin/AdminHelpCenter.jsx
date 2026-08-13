import { useState, useEffect } from 'react'
import { HelpCircle, Search, Plus, BookOpen } from 'lucide-react'
import api from '../../services/api'

export default function AdminHelpCenter() {
  const [topics, setTopics] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchTopics = () => {
    const url = searchTerm ? `/help/search?q=${encodeURIComponent(searchTerm)}` : '/help/topics';
    api.get(url)
      .then(res => setTopics(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchTopics()
  }, [searchTerm])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-800 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Support Help Center</h1>
          <p className="text-slate-500 text-sm font-semibold mt-0.5">Manage and browse frequently asked questions (FAQs) and deflection patterns</p>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search FAQs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 bg-white border border-slate-205 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500/50 transition-colors shadow-sm"
          />
          <Search size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-white border border-slate-100 rounded-2xl animate-pulse shadow-sm" />
          ))}
        </div>
      ) : topics.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl text-center py-16 shadow-sm">
          <HelpCircle size={44} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-bold">No FAQ topics found matching your query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map(t => (
            <div key={t.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#f5c518]/10 text-[#9a6a00] flex items-center justify-center flex-shrink-0">
                <BookOpen size={14} />
              </div>
              <div className="min-w-0">
                <span className="bg-slate-50 border border-slate-100 text-slate-500 text-[8px] font-black uppercase px-2 py-0.5 rounded-full inline-block tracking-wider mb-2">
                  {t.category}
                </span>
                <h3 className="text-slate-800 font-extrabold text-xs leading-snug">{t.question}</h3>
                <p className="text-slate-450 text-[10px] font-semibold mt-1">Deflection Route: {t.link}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
