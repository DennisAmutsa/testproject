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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in text-slate-900">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 mb-1">Contact Us</h1>
        <p className="text-slate-600 text-sm font-semibold">Can't find what you need? Our team responds within 24 hours.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info */}
        <div className="space-y-4">
          {contactInfo.map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-bold mb-0.5">{label}</p>
                <p className="text-slate-900 text-sm font-extrabold">{value}</p>
              </div>
            </div>
          ))}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-slate-900 font-extrabold text-sm mb-3">Support Hours</h3>
            <div className="space-y-2 text-xs font-bold">
              <div className="flex justify-between"><span className="text-slate-500">Mon – Fri</span><span className="text-slate-900">8am – 6pm</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Saturday</span><span className="text-slate-900">9am – 3pm</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Sunday</span><span className="text-red-500 font-black">Closed</span></div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {success ? (
            <div className="text-center py-10 animate-slide-up">
              <CheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
              <h3 className="text-slate-900 font-black text-xl mb-2">Message Sent!</h3>
              <p className="text-slate-600 text-sm font-semibold mb-6">We'll get back to you within 24 hours.</p>
              <button onClick={() => setSuccess(false)} className="bg-[#0a0e1a] text-[#f5c518] font-black px-6 py-3 rounded-xl hover:bg-black transition-colors text-xs shadow-md">Send Another Message</button>
            </div>
          ) : (
            <>
              <h2 className="text-slate-900 font-black text-xl mb-6">Send a Message</h2>
              {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Full Name</label>
                    <input id="contact-name" type="text" placeholder="Jane Wanjiku" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Email</label>
                    <input id="contact-email" type="email" placeholder="you@example.com" value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Subject</label>
                  <input id="contact-subject" type="text" placeholder="What is your question about?" value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-400" />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Message</label>
                  <textarea id="contact-message" rows={5} placeholder="Describe your issue in detail…" value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-400 resize-none" />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-[#0a0e1a] text-[#f5c518] font-black text-xs py-3.5 rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50">
                  <Send size={15} />{loading ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
