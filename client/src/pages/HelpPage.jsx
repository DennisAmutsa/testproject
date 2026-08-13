import { useState, useEffect } from 'react'
import { getHelpTopics, searchHelp } from '../services/api'
import { Search, ChevronRight, Package, RotateCcw, Box, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const FAQS = [
  { q: 'How do I track my order?', a: 'Log in to your account and go to Dashboard → My Orders to see real-time tracking for all your orders.' },
  { q: 'What is your return policy?', a: 'We accept returns within 30 days of delivery for unused items with original tags. Items damaged on arrival or wrong items are also eligible.' },
  { q: 'How long do refunds take?', a: 'Once we receive your returned item, refunds are processed within 5–7 business days to your original payment method.' },
  { q: 'Can I change my delivery address?', a: 'Address changes can be made within 1 hour of placing an order by contacting our support team immediately.' },
  { q: 'Do you ship internationally?', a: 'Currently, we ship within Kenya only. International shipping is coming soon.' },
  { q: 'How do I check if a product is back in stock?', a: 'Visit the Stock Availability page and search for the product. You can see real-time stock levels and restock dates.' },
]

export default function HelpPage() {
  const [topics, setTopics]       = useState([])
  const [query, setQuery]         = useState('')
  const [results, setResults]     = useState(null)
  const [searching, setSearching] = useState(false)
  const [openFaq, setOpenFaq]     = useState(null)

  useEffect(() => {
    getHelpTopics().then(r => setTopics(r.data)).catch(() => {})
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    try {
      const res = await searchHelp(query)
      setResults(res.data)
    } catch { setResults([]) }
    finally { setSearching(false) }
  }

  const quickLinks = [
    { icon: Package,    label: 'Track an Order',     to: '/dashboard/orders'  },
    { icon: RotateCcw,  label: 'Start a Return',     to: '/dashboard/returns' },
    { icon: Box,        label: 'Check Stock',         to: '/stock'             },
    { icon: MessageCircle, label: 'Contact Support', to: '/contact'           },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in text-slate-900">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-slate-900 mb-2">How can we help?</h1>
        <p className="text-slate-600 font-semibold text-sm">Search our knowledge base or browse popular topics below.</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search help articles…" value={query}
            onChange={e => { setQuery(e.target.value); setResults(null) }} className="w-full bg-white border border-slate-300 rounded-xl pl-12 pr-4 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-400 shadow-sm" />
        </div>
        <button type="submit" disabled={searching} className="bg-[#0a0e1a] text-[#f5c518] font-black px-6 py-3 rounded-xl hover:bg-black transition-colors text-xs shadow-md whitespace-nowrap">
          {searching ? 'Searching…' : 'Search'}
        </button>
      </form>

      {results !== null && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 shadow-sm animate-slide-up">
          {results.length === 0
            ? <p className="text-slate-600 text-sm font-medium">No results. Try <Link to="/contact" className="text-amber-600 font-bold hover:underline">contacting us</Link>.</p>
            : <ul>{results.map(r => (
                <li key={r.id}>
                  <Link to={r.link} className="flex items-center justify-between py-2.5 text-slate-900 font-bold hover:text-amber-600 text-sm border-b border-slate-100 last:border-0">
                    <span>{r.question}</span><ChevronRight size={14} className="text-slate-400" />
                  </Link>
                </li>
              ))}</ul>
          }
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {quickLinks.map(({ icon: Icon, label, to }) => (
          <Link key={to} to={to} className="bg-white border border-slate-200 rounded-2xl p-5 text-center hover:-translate-y-1 transition-all duration-200 group shadow-sm">
            <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-amber-100 transition-colors">
              <Icon size={18} className="text-amber-600" />
            </div>
            <p className="text-slate-900 text-xs font-extrabold">{label}</p>
          </Link>
        ))}
      </div>

      {/* Popular Topics */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
        <h2 className="text-slate-900 font-black text-lg mb-4">Popular Topics</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {topics.map(t => (
            <Link key={t.id} to={t.link} className="flex items-center justify-between px-3.5 py-3 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-800 hover:text-amber-600 group transition-colors border border-slate-100">
              <span>{t.question}</span><ChevronRight size={14} className="text-slate-400 group-hover:text-amber-600" />
            </Link>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-slate-900 font-black text-lg mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-slate-900 text-xs font-extrabold hover:bg-slate-50 transition-colors">
                <span>{faq.q}</span>
                <ChevronRight size={14} className={`text-slate-400 transition-transform ${openFaq === i ? 'rotate-90 text-amber-600' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-slate-600 text-xs font-medium leading-relaxed border-t border-slate-100 pt-3 animate-fade-in bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
