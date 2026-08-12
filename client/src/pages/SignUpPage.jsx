import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UserPlus, Eye, EyeOff, Star } from 'lucide-react'

export default function SignUpPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Star size={24} className="text-brand-navy fill-brand-navy" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-brand-muted text-sm mt-1">Join Northstar and get instant support</p>
        </div>

        <div className="card">
          {error && <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Full Name</label>
              <input id="signup-name" type="text" placeholder="Jane Wanjiku" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Email address</label>
              <input id="signup-email" type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Password</label>
              <div className="relative">
                <input id="signup-password" type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} required className="input-field pr-12" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Confirm Password</label>
              <input id="signup-confirm" type="password" placeholder="Repeat password" value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })} required className="input-field" />
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full justify-center py-3 mt-2">
              <UserPlus size={16} />
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-brand-muted text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-gold hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
