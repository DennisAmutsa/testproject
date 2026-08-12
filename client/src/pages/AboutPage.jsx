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
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-navy via-brand-dark to-brand-card border-b border-brand-border py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-brand-gold rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Star size={28} className="text-brand-navy fill-brand-navy" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">About Northstar</h1>
          <p className="text-brand-muted text-lg leading-relaxed max-w-2xl mx-auto">
            We're a mid-size e-commerce company on a mission to make shopping support effortless.
            No more waiting — get help instantly, any time of day.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-brand-muted leading-relaxed mb-4">
              Northstar Retail Co. was founded with one belief: <span className="text-white font-medium">customers deserve instant answers</span>.
              Our support team was drowning in repetitive questions about orders, returns, and stock — so we built a smarter way.
            </p>
            <p className="text-brand-muted leading-relaxed">
              This Support Deflection MVP lets customers self-serve in seconds, freeing our team to handle complex issues that actually need a human touch.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[['10K+', 'Happy Customers'], ['99.9%', 'Uptime'], ['< 2 min', 'Avg Resolution'], ['30 days', 'Return Window']].map(([stat, label]) => (
              <div key={label} className="card text-center">
                <div className="text-brand-gold text-2xl font-black mb-1">{stat}</div>
                <div className="text-brand-muted text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-brand-dark border-y border-brand-border py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card text-center hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 bg-brand-gold/15 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon size={20} className="text-brand-gold" />
                </div>
                <h3 className="text-white font-bold mb-2">{title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Meet the Team</h2>
        <p className="text-brand-muted text-center mb-8 text-sm">The pod behind the Northstar Sprint MVP.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {team.map(({ name, role, initial }) => (
            <div key={name} className="card text-center hover:-translate-y-1 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-brand-gold flex items-center justify-center mx-auto mb-3 text-brand-navy font-black text-2xl">
                {initial}
              </div>
              <h3 className="text-white font-semibold text-sm">{name}</h3>
              <p className="text-brand-muted text-xs mt-0.5">{role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
