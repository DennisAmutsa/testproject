import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, Star, ChevronDown, LogOut, User, LayoutDashboard, Shield } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/dashboard/orders', label: 'Orders' },
    { to: '/dashboard/returns', label: 'Returns' },
    { to: '/stock', label: 'Stock Availability' },
    { to: '/help', label: 'Help' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
      <div className="w-full px-6 sm:px-12 lg:px-24">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Star size={16} className="text-white fill-white" />
            </div>
            <div className="leading-tight">
              <div className="text-white font-extrabold text-sm tracking-wide">NORTHSTAR</div>
              <div className="text-slate-400 text-[10px] tracking-widest uppercase font-semibold">Retail Co.</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Auth Area */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white text-sm font-semibold">{user.name.split(' ')[0]}</span>
                  {user.role === 'admin' && <Shield size={14} className="text-amber-400" />}
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden animate-fade-in">
                    <div className="px-4 py-3 border-b border-slate-700">
                      <p className="text-white text-sm font-semibold">{user.name}</p>
                      <p className="text-slate-400 text-xs">{user.email}</p>
                      <span className={`badge mt-1 ${user.role === 'admin' ? 'bg-amber-400/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {user.role}
                      </span>
                    </div>
                    <Link
                      to={user.role === 'admin' ? '/admin' : '/dashboard'}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-white hover:bg-slate-700 transition-colors"
                    >
                      <LayoutDashboard size={14} /> Dashboard
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setDropdownOpen(false); }}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 w-full text-left transition-colors"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-outline text-sm py-2 px-4">Sign In</Link>
                <Link to="/signup" className="btn-gold text-sm py-2 px-4">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white p-2">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-800 py-4 space-y-1 animate-fade-in">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-lg text-sm font-medium ${isActive ? 'text-amber-400 bg-amber-400/10' : 'text-slate-300 hover:text-white'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="pt-3 border-t border-slate-800 flex gap-2 px-2">
              {user ? (
                <>
                  <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setMenuOpen(false)} className="btn-outline flex-1 justify-center text-sm py-2">Dashboard</Link>
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="btn-outline flex-1 justify-center text-sm py-2 text-rose-400 border-rose-500/30">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline flex-1 justify-center text-sm py-2">Sign In</Link>
                  <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn-gold flex-1 justify-center text-sm py-2">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
