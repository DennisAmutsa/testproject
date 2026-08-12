import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Package, RotateCcw, Box, ChevronRight, Headphones, ArrowRight } from 'lucide-react'
import { getHelpTopics, searchHelp } from '../services/api'

export default function HomePage() {
  const [searchQuery, setSearchQuery]   = useState('')
  const [helpTopics, setHelpTopics]     = useState([])
  const [searchResults, setSearchResults] = useState(null)
  const [searching, setSearching]       = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getHelpTopics().then(res => setHelpTopics(res.data)).catch(() => {})
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const res = await searchHelp(searchQuery)
      setSearchResults(res.data)
    } catch { setSearchResults([]) }
    finally { setSearching(false) }
  }

  const popularQueries = ['Where is my order?', 'How do I return an item?', 'Is this in stock?']

  const features = [
    { icon: Package, title: 'Order Status', desc: 'Track your order, check shipping status and estimated delivery.', link: '/dashboard/orders', cta: 'Track Order' },
    { icon: RotateCcw, title: 'Returns & Refunds', desc: 'Check your return eligibility, start a return or track your refund status.', link: '/dashboard/returns', cta: 'Manage Return' },
    { icon: Box, title: 'Stock Availability', desc: 'Check if an item is in stock and see available sizes or variants.', link: '/stock', cta: 'Check Stock' },
  ]

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy via-brand-dark to-brand-card border-b border-brand-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-gold/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="text-brand-gold font-semibold text-sm uppercase tracking-widest mb-3">Welcome to Northstar Support</p>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
              Get Help, <span className="text-brand-gold italic">Instantly.</span>
            </h1>
            <p className="text-brand-muted text-lg mb-10 leading-relaxed">
              Find answers to your questions about orders, returns and product availability — without waiting for support.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                <input
                  type="text"
                  placeholder='Search for help, e.g. "Where is my order?"'
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setSearchResults(null) }}
                  className="input-field pl-12"
                />
              </div>
              <button type="submit" disabled={searching} className="btn-gold px-6 whitespace-nowrap">
                {searching ? 'Searching…' : 'Search'}
              </button>
            </form>

            {/* Popular queries */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-brand-muted text-sm">Popular:</span>
              {popularQueries.map(q => (
                <button
                  key={q}
                  onClick={() => { setSearchQuery(q); }}
                  className="px-3 py-1 rounded-full border border-brand-border text-brand-muted text-xs hover:border-brand-gold/50 hover:text-brand-gold transition-all"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Search Results */}
            {searchResults !== null && (
              <div className="mt-6 card animate-slide-up">
                {searchResults.length === 0 ? (
                  <p className="text-brand-muted text-sm">No results found. Try <Link to="/contact" className="text-brand-gold hover:underline">contacting support</Link>.</p>
                ) : (
                  <ul className="space-y-2">
                    {searchResults.map(r => (
                      <li key={r.id}>
                        <Link to={r.link} className="flex items-center justify-between py-2 text-white hover:text-brand-gold transition-colors text-sm">
                          <span>{r.question}</span>
                          <ChevronRight size={14} className="text-brand-muted" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, link, cta }) => (
            <div key={title} className="card group hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-brand-gold/15 flex items-center justify-center mb-4 group-hover:bg-brand-gold/25 transition-colors">
                <Icon size={22} className="text-brand-gold" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
              <p className="text-brand-muted text-sm mb-5 leading-relaxed">{desc}</p>
              <Link to={link} className="btn-gold text-sm py-2 px-4 w-fit">
                {cta} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Help Topics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card">
            <h2 className="section-title flex items-center gap-2 mb-6">📋 Popular Help Topics</h2>
            {helpTopics.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-10 bg-brand-border/50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {helpTopics.map(topic => (
                  <Link
                    key={topic.id}
                    to={topic.link}
                    className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-brand-border/50 transition-colors group"
                  >
                    <span className="text-white text-sm group-hover:text-brand-gold transition-colors">{topic.question}</span>
                    <ChevronRight size={14} className="text-brand-muted group-hover:text-brand-gold" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Need More Help CTA */}
          <div className="card flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-gold/15 flex items-center justify-center mb-4">
                <Headphones size={22} className="text-brand-gold" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Need More Help?</h3>
              <p className="text-brand-muted text-sm leading-relaxed mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
            </div>
            <Link to="/contact" className="btn-gold w-full justify-center text-sm">
              Contact Support <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
