import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogIn, Eye, EyeOff, Star, Shield } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-[#f6f0e8]">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#111111] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Star size={24} className="text-[#f6f0e8] fill-[#f6f0e8]" />
          </div>
          <h1 className="text-2xl font-bold text-[#111111]">Welcome back</h1>
          <p className="text-[#4a4a4a] text-sm mt-1">Sign in to your Northstar account</p>
        </div>

        <div className="card bg-white border border-[#111111]/10 rounded-2xl shadow-sm">
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-1.5">Email address</label>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                className="input-field bg-white text-[#111111] placeholder-[#6b6b6b] border-[#111111]/15 focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111111] mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  className="input-field pr-12 bg-white text-[#111111] placeholder-[#6b6b6b] border-[#111111]/15 focus:border-[#111111]"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a4a4a] hover:text-[#111111]">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-gold w-full justify-center py-3 mt-2 bg-[#111111] text-white hover:bg-[#2a2a2a]">
              <LogIn size={16} />
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-[#4a4a4a] text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#111111] hover:underline font-medium">Sign up free</Link>
          </p>
        </div>

      </div>
    </div>
  )
}
