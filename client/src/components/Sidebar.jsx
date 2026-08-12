import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  Home,
  Briefcase,
  Truck,
  RotateCcw,
  ShoppingBag,
  User,
  Heart,
  Bell,
  Headphones,
  Mail,
  LogOut
} from 'lucide-react'
import api from '../services/api'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [orderCount, setOrderCount] = useState(0)
  const [returnCount, setReturnCount] = useState(0)
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    // Dynamic counts from API
    api.get('/orders/my')
      .then(res => {
        if (Array.isArray(res.data)) {
          // Count active orders
          const active = res.data.filter(o => ['processing', 'shipped', 'out_for_delivery'].includes(o.status)).length;
          setOrderCount(active)
          
          // Notifications count: e.g. active shipped/out_for_delivery orders
          const inTransit = res.data.filter(o => ['shipped', 'out_for_delivery'].includes(o.status)).length;
          setNotificationCount(prev => prev + inTransit)
        }
      })
      .catch(() => {})

    api.get('/returns/my')
      .then(res => {
        if (Array.isArray(res.data)) {
          const activeReturns = res.data.filter(r => ['requested', 'approved', 'received', 'refund_processing'].includes(r.status)).length;
          setReturnCount(activeReturns)
          
          // Notifications count: e.g. approved returns
          const approved = res.data.filter(r => ['approved', 'refund_processing'].includes(r.status)).length;
          setNotificationCount(prev => prev + approved)
        }
      })
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  // Four-pointed star logo matching the mockup exactly
  const NorthstarLogo = () => (
    <svg className="w-6 h-6 text-[#f5c518] fill-[#f5c518] flex-shrink-0" viewBox="0 0 24 24">
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z" />
    </svg>
  )

  const sections = [
    {
      title: 'MAIN',
      links: [
        { to: '/dashboard', label: 'Home', icon: Home, end: true }
      ]
    },
    {
      title: 'SHOP & ORDERS',
      links: [
        { to: '/dashboard/orders', label: 'My Orders', icon: Briefcase, badge: orderCount },
        { to: '/dashboard/orders?track=true', label: 'Track Delivery', icon: Truck },
        { to: '/dashboard/returns', label: 'Returns & Refunds', icon: RotateCcw, badge: returnCount },
        { to: '/dashboard/stock', label: 'Browse Products', icon: ShoppingBag }
      ]
    },
    {
      title: 'ACCOUNT',
      links: [
        { to: '/dashboard/account', label: 'My Account', icon: User, disabled: true },
        { to: '/dashboard/saved', label: 'Saved Items', icon: Heart, disabled: true },
        { to: '/dashboard/notifications', label: 'Notifications', icon: Bell, badge: notificationCount }
      ]
    },
    {
      title: 'SUPPORT',
      links: [
        { to: '/help', label: 'Need Help?', icon: Headphones },
        { to: '/contact', label: 'Contact Support', icon: Mail }
      ]
    }
  ]

  return (
    <aside className="w-[260px] bg-[#0a0e1a] h-screen sticky top-0 flex flex-col justify-between flex-shrink-0 border-r border-[#1f2937]/50 select-none">
      <div className="flex-1 py-6 overflow-y-auto scrollbar-none">
        {/* Logo / Header */}
        <div className="flex items-center gap-2.5 px-6 mb-8">
          <NorthstarLogo />
          <div className="leading-none">
            <span className="text-white font-black text-sm tracking-wider block">NORTHSTAR</span>
            <span className="text-[#8a9bb8] text-[9px] font-bold tracking-widest block mt-0.5">RETAIL CO.</span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-6">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <span className="px-6 text-[10px] font-bold text-[#475569] tracking-wider block mb-2">
                {section.title}
              </span>
              <nav className="space-y-0.5 px-3">
                {section.links.map((link, lIdx) => {
                  const isActive = location.pathname === link.to && !link.disabled;
                  return (
                    <NavLink
                      key={lIdx}
                      to={link.disabled ? '#' : link.to}
                      onClick={(e) => link.disabled && e.preventDefault()}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                        isActive
                          ? 'text-[#f5c518] bg-[#f5c518]/10'
                          : 'text-[#94a3b8] hover:text-white hover:bg-[#1e293b]/30'
                      } ${link.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <link.icon size={16} className={isActive ? 'text-[#f5c518]' : 'text-[#64748b] group-hover:text-white'} />
                        <span>{link.label}</span>
                      </div>
                      {link.badge !== undefined && link.badge > 0 && (
                        <span className="bg-[#f5c518] text-[#0a0e1a] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                          {link.badge}
                        </span>
                      )}
                    </NavLink>
                  )
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Support Card & Profile */}
      <div className="p-4 border-t border-[#1f2937]/30 space-y-4">
        {/* Need Help Box Card */}
        <div className="bg-[#111827]/60 border border-[#1f2937]/50 rounded-2xl p-4 flex flex-col items-center text-center">
          <div className="w-8 h-8 bg-[#f5c518]/10 rounded-full flex items-center justify-center mb-2">
            <Headphones size={15} className="text-[#f5c518]" />
          </div>
          <h4 className="text-white font-bold text-xs">Need Help?</h4>
          <p className="text-[#64748b] text-[10px] mt-0.5 mb-3 flex items-center gap-1 justify-center">
            Support available 
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-400 font-medium">Online</span>
          </p>
          <NavLink to="/contact" className="w-full py-2 bg-[#f5c518] text-[#0a0e1a] font-extrabold text-[10px] rounded-lg hover:bg-[#e6b400] transition-colors flex items-center justify-center gap-1">
            Contact Support &rarr;
          </NavLink>
        </div>

        {/* Profile Card & Logout Options */}
        <div className="flex items-center justify-between p-2 hover:bg-[#1e293b]/30 rounded-xl transition-all cursor-pointer group" onClick={() => navigate('/dashboard/account')}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1e293b] text-[#f5c518] border border-[#f5c518]/20 flex items-center justify-center font-bold text-xs">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'DA'}
            </div>
            <div className="text-left leading-tight">
              <p className="text-white text-xs font-bold truncate max-w-[110px]">
                {user?.name || 'Dennis Amutsa'}
              </p>
              <p className="text-[#64748b] text-[9px] mt-0.5">
                {user?.role === 'admin' ? 'Administrator' : 'Customer Account'}
              </p>
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); handleLogout(); }} title="Logout" className="text-[#64748b] hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}
