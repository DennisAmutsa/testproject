import { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'
import api from '../services/api'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/contact', form)
      setSuccess(true)
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.')
    } finally { setLoading(false) }
  }

  const contactInfo = [
    { icon: Mail,    label: 'Email',    value: 'support@northstar.co.ke' },
    { icon: Phone,   label: 'Phone',    value: '+254 700 000 001' },
    { icon: MapPin,  label: 'Address',  value: 'Westlands, Nairobi, Kenya' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-1">Contact Us</h1>
        <p className="text-brand-muted">Can't find what you need? Our team responds within 24 hours.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info */}
        <div className="space-y-4">
          {contactInfo.map(({ icon: Icon, label, value }) => (
            <div key={label} className="card flex items-start gap-4">
              <div className="w-10 h-10 bg-brand-gold/15 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-brand-gold" />
              </div>
              <div>
                <p className="text-brand-muted text-xs mb-0.5">{label}</p>
                <p className="text-white text-sm font-medium">{value}</p>
              </div>
            </div>
          ))}
          <div className="card">
            <h3 className="text-white font-semibold text-sm mb-2">Support Hours</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-brand-muted">Mon – Fri</span><span className="text-white">8am – 6pm</span></div>
              <div className="flex justify-between"><span className="text-brand-muted">Saturday</span><span className="text-white">9am – 3pm</span></div>
              <div className="flex justify-between"><span className="text-brand-muted">Sunday</span><span className="text-brand-muted">Closed</span></div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 card">
          {success ? (
            <div className="text-center py-10 animate-slide-up">
              <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Message Sent!</h3>
              <p className="text-brand-muted text-sm mb-6">We'll get back to you within 24 hours.</p>
              <button onClick={() => setSuccess(false)} className="btn-gold">Send Another Message</button>
            </div>
          ) : (
            <>
              <h2 className="text-white font-bold text-lg mb-6">Send a Message</h2>
              {error && <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1.5">Full Name</label>
                    <input id="contact-name" type="text" placeholder="Jane Wanjiku" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })} required className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1.5">Email</label>
                    <input id="contact-email" type="email" placeholder="you@example.com" value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })} required className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">Subject</label>
                  <input id="contact-subject" type="text" placeholder="What is your question about?" value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })} required className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">Message</label>
                  <textarea id="contact-message" rows={5} placeholder="Describe your issue in detail…" value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })} required className="input-field resize-none" />
                </div>
                <button type="submit" disabled={loading} className="btn-gold w-full justify-center py-3">
                  <Send size={16} />{loading ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
