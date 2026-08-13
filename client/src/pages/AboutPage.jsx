import { Star, Shield, Zap, Users, Target, Heart } from 'lucide-react'

const team = [
  { name: 'Dennis Amutsa', role: 'Lead Developer', initial: 'D' },
  { name: 'Team Member 2', role: 'Backend Engineer', initial: 'T' },
  { name: 'Team Member 3', role: 'Frontend Engineer', initial: 'T' },
  { name: 'Team Member 4', role: 'UI/UX Designer', initial: 'T' },
]

const values = [
  { icon: Zap,     title: 'Speed',       desc: 'Instant answers, zero wait times for your customers.' },
  { icon: Shield,  title: 'Reliability', desc: 'Rock-solid uptime so support is always available.' },
  { icon: Heart,   title: 'Empathy',     desc: 'Built with customer experience at the core.' },
  { icon: Target,  title: 'Precision',   desc: 'Right answers to the right questions, every time.' },
]

export default function AboutPage() {
  return (
    <div className="animate-fade-in text-slate-900">
      {/* Hero */}
      <section className="bg-[#0a0e1a] border-b border-slate-800 py-16 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-[#f5c518] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Star size={28} className="text-[#0a0e1a] fill-[#0a0e1a]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">About Northstar</h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
            We're a mid-size e-commerce company on a mission to make shopping support effortless.
            No more waiting — get help instantly, any time of day.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-4">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed mb-4 text-sm font-medium">
              Northstar Retail Co. was founded with one belief: <span className="text-slate-900 font-bold">customers deserve instant answers</span>.
              Our support team was drowning in repetitive questions about orders, returns, and stock — so we built a smarter way.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm font-medium">
              This Support Deflection MVP lets customers self-serve in seconds, freeing our team to handle complex issues that actually need a human touch.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[['10K+', 'Happy Customers'], ['99.9%', 'Uptime'], ['< 2 min', 'Avg Resolution'], ['30 days', 'Return Window']].map(([stat, label]) => (
              <div key={label} className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
                <div className="text-amber-600 text-2xl font-black mb-1">{stat}</div>
                <div className="text-slate-600 text-xs font-bold">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-slate-900 mb-8 text-center">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center hover:-translate-y-1 transition-all shadow-sm">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon size={20} className="text-amber-600" />
                </div>
                <h3 className="text-slate-900 font-black mb-2">{title}</h3>
                <p className="text-slate-600 text-xs font-medium leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-black text-slate-900 mb-2 text-center">Meet the Team</h2>
        <p className="text-slate-600 text-center mb-8 text-sm font-semibold">The pod behind the Northstar Sprint MVP.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {team.map(({ name, role, initial }) => (
            <div key={name} className="bg-white border border-slate-200 rounded-2xl p-6 text-center hover:-translate-y-1 transition-all shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-[#0a0e1a] text-[#f5c518] flex items-center justify-center mx-auto mb-3 font-black text-2xl shadow-md">
                {initial}
              </div>
              <h3 className="text-slate-900 font-black text-sm">{name}</h3>
              <p className="text-slate-500 text-xs font-bold mt-0.5">{role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
