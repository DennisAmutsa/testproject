import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Package, RotateCcw, Box, ChevronRight, Headphones, ArrowRight, Mail, AlertCircle, Clock, Truck, ShieldCheck, HelpCircle } from 'lucide-react'
import { getHelpTopics, searchHelp, getOrdersByEmail, getReturnsByEmail } from '../services/api'
import heroImg from '../assets/hero.png'

export default function HomePage() {
  const [searchQuery, setSearchQuery]     = useState('')
  const [helpTopics, setHelpTopics]       = useState([])
  const [searchResults, setSearchResults] = useState(null)
  const [searching, setSearching]         = useState(false)

  // Public Email Tracking States
  const [trackingType, setTrackingType]   = useState('none') // 'none', 'orders', 'returns'
  const [trackingEmail, setTrackingEmail] = useState('')
  const [trackingResults, setResults]     = useState(null)
  const [trackingLoading, setLoading]     = useState(false)
  const [trackingError, setError]         = useState('')

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

  const handleEmailTrack = async (e) => {
    e.preventDefault()
    if (!trackingEmail.trim()) return
    setLoading(true)
    setError('')
    setResults(null)
    try {
      if (trackingType === 'orders') {
        const res = await getOrdersByEmail(trackingEmail.trim().toLowerCase())
        setResults(res.data)
        if (res.data.length === 0) {
          setError('No orders found matching this email address.')
        }
      } else {
        const res = await getReturnsByEmail(trackingEmail.trim().toLowerCase())
        setResults(res.data)
        if (res.data.length === 0) {
          setError('No return requests found matching this email address.')
        }
      }
    } catch (err) {
      setError('An error occurred during lookup. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const popularQueries = ['Where is my order?', 'How do I return an item?', 'Is this in stock?']

  const features = [
    {
      icon: Package,
      title: 'Order Status',
      desc: 'Where is my order? Track your order, shipping status and estimated delivery.',
      type: 'orders',
      cta: 'Track Order',
    },
    {
      icon: RotateCcw,
      title: 'Returns & Refunds',
      desc: 'Need to return something? Check your return eligibility and refund status.',
      type: 'returns',
      cta: 'Manage Return',
    },
    {
      icon: Box,
      title: 'Stock Availability',
      desc: 'Looking for an item? Check product and size availability before contacting support.',
      link: '/stock',
      cta: 'Check Stock',
    },
  ]

  return (
    <div className="bg-brand-navy min-h-screen text-white animate-fade-in pb-16">

      {/* Hero section */}
      <section className="relative overflow-hidden border-b border-[#111827] min-h-[460px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(245,197,24,0.06),transparent_60%)] pointer-events-none" />

        <div className="w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center min-h-[460px]">
            <div className="py-16 lg:py-20 pl-6 sm:pl-12 lg:pl-24 pr-6 lg:pr-12">
              <p className="text-brand-gold font-bold text-xs uppercase tracking-[0.25em] mb-4">
                Welcome to Northstar Support
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-white leading-[1.1] mb-5 tracking-tight">
                Get Help, <span className="text-brand-gold italic">Instantly.</span>
              </h1>
              <p className="text-brand-muted text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
                Find answers about your orders, returns, refunds and product availability — without waiting for customer support.
              </p>

              {/* Search bar */}
              <form onSubmit={handleSearch} className="flex gap-0 mb-4 max-w-lg border border-brand-border rounded-xl bg-brand-dark overflow-hidden">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                  <input
                    type="text"
                    placeholder='Search for help, e.g. "Where is my order?"'
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setSearchResults(null) }}
                    className="w-full bg-transparent px-4 py-3.5 pl-11 text-white placeholder-brand-muted focus:outline-none text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={searching}
                  className="bg-brand-gold text-brand-navy font-bold px-6 py-3.5 hover:bg-brand-gold-hover transition-all text-sm whitespace-nowrap"
                >
                  {searching ? '…' : 'Search'}
                </button>
              </form>

              {/* Popular queries */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-brand-muted text-xs font-semibold">Popular:</span>
                {popularQueries.map(q => (
                  <button
                    key={q}
                    onClick={() => setSearchQuery(q)}
                    className="px-3 py-1 rounded-full border border-brand-border text-brand-muted text-xs hover:border-brand-gold/50 hover:text-brand-gold transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Search Results */}
              {searchResults !== null && (
                <div className="mt-5 bg-brand-card border border-brand-border rounded-2xl p-4 max-w-lg animate-slide-up">
                  {searchResults.length === 0 ? (
                    <p className="text-brand-muted text-sm">
                      No results. Try <Link to="/contact" className="text-brand-gold hover:underline">contacting support</Link>.
                    </p>
                  ) : (
                    <ul>
                      {searchResults.map(r => (
                        <li key={r.id}>
                          <Link to={r.link} className="flex items-center justify-between py-2.5 text-white hover:text-brand-gold text-sm border-b border-brand-border last:border-0">
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

            <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[50%] overflow-hidden">
              <img
                src={heroImg}
                alt="Customer support"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-brand-navy to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-12 bg-brand-navy">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, link, type, cta }) => (
              <div
                key={title}
                className="bg-brand-navy border border-brand-border hover:border-brand-gold/50 rounded-2xl p-6 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center mb-5 group-hover:bg-brand-gold/20 transition-colors">
                    <Icon size={22} className="text-brand-gold" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                  <p className="text-brand-muted text-sm mb-6 leading-relaxed">{desc}</p>
                </div>
                {type ? (
                  <button
                    onClick={() => {
                      setTrackingType(type)
                      setResults(null)
                      setError('')
                      const el = document.getElementById('public-tracker-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 bg-brand-gold text-brand-navy font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-gold-hover transition-all text-sm w-fit"
                  >
                    {cta} <ArrowRight size={14} />
                  </button>
                ) : (
                  <Link
                    to={link}
                    className="inline-flex items-center gap-2 bg-brand-gold text-brand-navy font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-gold-hover transition-all text-sm w-fit"
                  >
                    {cta} <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Public Tracker lookup form */}
      {trackingType !== 'none' && (
        <section id="public-tracker-section" className="py-12 bg-brand-navy animate-slide-up border-t border-brand-border/40">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-brand-card border border-brand-border rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-white font-extrabold text-lg capitalize">
                    Track your {trackingType}
                  </h2>
                  <p className="text-brand-muted text-xs mt-1">Enter your registered email address to fetch live status reports.</p>
                </div>
                <button 
                  onClick={() => { setTrackingType('none'); setResults(null); setError(''); }}
                  className="text-brand-muted hover:text-white p-1"
                >
                  <XCircle size={18} />
                </button>
              </div>

              <form onSubmit={handleEmailTrack} className="flex flex-col sm:flex-row gap-3 mb-6">
                <input 
                  type="email" 
                  placeholder="Enter email address (e.g. john@example.com)" 
                  value={trackingEmail}
                  onChange={e => setTrackingEmail(e.target.value)}
                  required
                  className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-3 text-white placeholder-brand-muted focus:outline-none text-xs flex-1"
                />
                <button 
                  type="submit" 
                  disabled={trackingLoading}
                  className="bg-brand-gold text-brand-navy font-extrabold px-6 py-3 rounded-xl hover:bg-brand-gold-hover transition-all text-xs whitespace-nowrap"
                >
                  {trackingLoading ? 'Searching…' : `Search ${trackingType}`}
                </button>
              </form>

              {trackingError && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold flex items-center gap-1.5 mb-6 animate-fade-in">
                  <AlertCircle size={14} /> {trackingError}
                </div>
              )}

              {/* Dynamic list rendering */}
              {trackingResults && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-brand-gold text-[10px] font-black uppercase tracking-wider border-b border-brand-border pb-2 mb-3">
                    Found {trackingResults.length} {trackingType === 'orders' ? 'orders' : 'returns'}
                  </h3>

                  {trackingResults.map(item => (
                    <div key={item._id} className="bg-brand-dark border border-brand-border/60 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <span className="text-white font-bold text-xs">
                          {trackingType === 'orders' ? `Order #${item.orderId}` : `Return #${item.returnId}`}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          ['delivered', 'approved'].includes(item.status) 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {item.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="text-[10px] text-brand-muted leading-relaxed">
                        {trackingType === 'orders' ? (
                          <>
                            <p>Items: {item.items?.map(i => `${i.name} (x${i.quantity})`).join(', ')}</p>
                            {item.trackingNumber && (
                              <p className="text-brand-gold font-bold mt-1 flex items-center gap-1">
                                <Truck size={10} /> Tracking ID: {item.trackingNumber}
                              </p>
                            )}
                          </>
                        ) : (
                          <>
                            <p>Reason: {item.reason}</p>
                            {item.notes && <p>Notes: "{item.notes}"</p>}
                          </>
                        )}
                        <p className="mt-1">Status Date: {new Date(item.updatedAt || item.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Popular help topics */}
      <section className="pb-20 bg-brand-navy">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="lg:col-span-2 border border-brand-border rounded-2xl p-6 bg-brand-navy">
              <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                Popular Help Topics
              </h2>
              {helpTopics.length === 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-10 bg-brand-dark rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                  {helpTopics.map(topic => (
                    <Link
                      key={topic.id}
                      to={topic.link}
                      className="flex items-center justify-between py-3 border-b border-brand-border/60 hover:bg-brand-dark/30 rounded-lg px-2 group transition-all"
                    >
                      <span className="text-brand-muted text-sm group-hover:text-brand-gold transition-colors">
                        {topic.question}
                      </span>
                      <ChevronRight size={14} className="text-brand-muted group-hover:text-brand-gold" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-brand-dark border border-brand-border rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center mb-4">
                  <Headphones size={22} className="text-brand-gold" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Need more help?</h3>
                <p className="text-brand-muted text-sm leading-relaxed mb-6">
                  Can't find what you're looking for?
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-brand-gold text-brand-navy font-semibold px-5 py-3 rounded-xl hover:bg-brand-gold-hover transition-all text-sm"
              >
                <Mail size={15} /> Contact Support →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
