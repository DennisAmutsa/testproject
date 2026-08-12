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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">How can we help?</h1>
        <p className="text-brand-muted">Search our knowledge base or browse popular topics below.</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input type="text" placeholder="Search help articles…" value={query}
            onChange={e => { setQuery(e.target.value); setResults(null) }} className="input-field pl-12" />
        </div>
        <button type="submit" disabled={searching} className="btn-gold px-6 whitespace-nowrap">
          {searching ? 'Searching…' : 'Search'}
        </button>
      </form>

      {results !== null && (
        <div className="card mb-8 animate-slide-up">
          {results.length === 0
            ? <p className="text-brand-muted text-sm">No results. Try <Link to="/contact" className="text-brand-gold hover:underline">contacting us</Link>.</p>
            : <ul>{results.map(r => (
                <li key={r.id}>
                  <Link to={r.link} className="flex items-center justify-between py-2.5 text-white hover:text-brand-gold text-sm">
                    <span>{r.question}</span><ChevronRight size={14} className="text-brand-muted" />
                  </Link>
                </li>
              ))}</ul>
          }
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {quickLinks.map(({ icon: Icon, label, to }) => (
          <Link key={to} to={to} className="card text-center hover:-translate-y-1 transition-all duration-200 group">
            <div className="w-10 h-10 bg-brand-gold/15 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-brand-gold/25 transition-colors">
              <Icon size={18} className="text-brand-gold" />
            </div>
            <p className="text-white text-xs font-medium">{label}</p>
          </Link>
        ))}
      </div>

      {/* Popular Topics */}
      <div className="card mb-8">
        <h2 className="text-white font-bold text-lg mb-4">Popular Topics</h2>
        <div className="grid sm:grid-cols-2 gap-1">
          {topics.map(t => (
            <Link key={t.id} to={t.link} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-brand-border/50 text-sm text-white hover:text-brand-gold group transition-colors">
              <span>{t.question}</span><ChevronRight size={14} className="text-brand-muted group-hover:text-brand-gold" />
            </Link>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="card">
        <h2 className="text-white font-bold text-lg mb-4">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="border border-brand-border rounded-xl overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-white text-sm font-medium hover:bg-brand-border/30 transition-colors">
                <span>{faq.q}</span>
                <ChevronRight size={14} className={`text-brand-muted transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-brand-muted text-sm leading-relaxed border-t border-brand-border pt-3 animate-fade-in">
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
