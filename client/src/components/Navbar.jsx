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
    { to: '/orders', label: 'Orders' },
    { to: '/returns', label: 'Returns' },
    { to: '/stock', label: 'Stock Availability' },
    { to: '/help', label: 'Help' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-[#f6f0e8]/95 backdrop-blur border-b border-[#111111]/10">
      <div className="w-full px-6 sm:px-12 lg:px-24">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[#111111] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Star size={16} className="text-[#f6f0e8] fill-[#f6f0e8]" />
            </div>
            <div className="leading-tight">
              <div className="text-[#111111] font-extrabold text-sm tracking-wide">NORTHSTAR</div>
              <div className="text-[#4a4a4a] text-[10px] tracking-widest uppercase font-semibold">Retail Co.</div>
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
                    isActive ? 'text-[#111111] bg-white/80' : 'text-[#4a4a4a] hover:text-[#111111] hover:bg-white/70'
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
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/70 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center text-[#f6f0e8] font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[#111111] text-sm font-semibold">{user.name.split(' ')[0]}</span>
                  {user.role === 'admin' && <Shield size={14} className="text-[#111111]" />}
                  <ChevronDown size={14} className="text-[#4a4a4a]" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-[#111111]/15 rounded-xl shadow-xl overflow-hidden animate-fade-in">
                    <div className="px-4 py-3 border-b border-[#111111]/10">
                      <p className="text-[#111111] text-sm font-semibold">{user.name}</p>
                      <p className="text-[#4a4a4a] text-xs">{user.email}</p>
                      <span className={`badge mt-1 ${user.role === 'admin' ? 'bg-[#111111]/10 text-[#111111]' : 'bg-[#111111]/5 text-[#111111]'}`}>
                        {user.role}
                      </span>
                    </div>
                    <Link
                      to={user.role === 'admin' ? '/admin' : '/dashboard'}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#111111] hover:bg-[#f6f0e8] transition-colors"
                    >
                      <LayoutDashboard size={14} /> Dashboard
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setDropdownOpen(false); }}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#111111] hover:bg-[#f6f0e8] w-full text-left transition-colors"
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
          <div className="relative md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-[#111111] p-2 focus:outline-none">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Mobile Menu Floating Popup */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-[#111111]/15 rounded-2xl shadow-2xl p-3 z-50 animate-slide-up">
                <div className="space-y-1">
                  {navLinks.map(link => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `block px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          isActive ? 'text-[#111111] bg-[#f6f0e8]' : 'text-[#4a4a4a] hover:text-[#111111] hover:bg-slate-50'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>

                <div className="pt-2.5 mt-2 border-t border-[#111111]/10 flex flex-col gap-1.5">
                  {user ? (
                    <>
                      <Link
                        to={user.role === 'admin' ? '/admin' : '/dashboard'}
                        onClick={() => setMenuOpen(false)}
                        className="btn-outline justify-center text-xs py-2 w-full"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => { handleLogout(); setMenuOpen(false); }}
                        className="btn-outline justify-center text-xs py-2 w-full text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <div className="flex gap-2">
                      <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline flex-1 justify-center text-xs py-2">Sign In</Link>
                      <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn-gold flex-1 justify-center text-xs py-2">Sign Up</Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
