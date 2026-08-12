import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  RotateCcw, 
  Package, 
  MessageSquare, 
  LogOut, 
  Star, 
  Shield, 
  User,
  Home
} from 'lucide-react'

export default function Sidebar({ admin }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const customerLinks = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/orders', label: 'My Orders', icon: ShoppingBag },
    { to: '/dashboard/returns', label: 'My Returns', icon: RotateCcw },
  ]

  const adminLinks = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: 'Products Catalog', icon: Package },
    { to: '/admin/orders', label: 'All Orders', icon: ShoppingBag },
    { to: '/admin/returns', label: 'Return Requests', icon: RotateCcw },
    { to: '/admin/contacts', label: 'Messages', icon: MessageSquare },
  ]

  const links = admin ? adminLinks : customerLinks

  return (
    <aside className="w-64 bg-brand-navy border-r border-brand-border min-h-screen flex flex-col justify-between p-4 flex-shrink-0">
      <div className="space-y-6">
        {/* Logo / Title */}
        <div className="flex items-center gap-3 px-2 py-3 border-b border-brand-border">
          <div className="w-9 h-9 bg-brand-gold rounded-lg flex items-center justify-center">
            <Star size={18} className="text-brand-navy fill-brand-navy" />
          </div>
          <div>
            <span className="text-white font-bold text-sm tracking-wider block">NORTHSTAR</span>
            <span className="text-brand-muted text-[10px] uppercase tracking-widest block">
              {admin ? 'Admin Panel' : 'Customer Workspace'}
            </span>
          </div>
        </div>

        {/* User Card info */}
        <div className="flex items-center gap-3 p-3 bg-brand-card border border-brand-border rounded-xl">
          <div className="w-9 h-9 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
            <span className="text-[10px] text-brand-muted flex items-center gap-1 font-mono uppercase">
              {admin ? <Shield size={10} className="text-brand-gold" /> : <User size={10} />}
              {user?.role}
            </span>
          </div>
        </div>

        {/* Links */}
        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive 
                    ? 'text-brand-navy bg-brand-gold font-bold shadow-md shadow-brand-gold/15' 
                    : 'text-brand-muted hover:text-white hover:bg-brand-card'
                }`
              }
            >
              <link.icon size={15} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="space-y-2 border-t border-brand-border pt-4">
        {/* Link back to Main Site */}
        <NavLink 
          to="/" 
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-brand-muted hover:text-white hover:bg-brand-card transition-all"
        >
          <Home size={15} />
          <span>Back to Main Site</span>
        </NavLink>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 w-full text-left transition-all"
        >
          <LogOut size={15} />
          <span>Logout Session</span>
        </button>
      </div>
    </aside>
  )
}
