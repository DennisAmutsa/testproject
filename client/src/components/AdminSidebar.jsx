import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  LayoutDashboard,
  Clipboard,
  Package,
  Layers,
  Tag,
  Percent,
  Users,
  RotateCcw,
  MessageSquare,
  HelpCircle,
  BarChart2,
  FileText,
  UserCheck,
  Shield,
  Settings,
  List,
  LogOut
} from 'lucide-react'
import api from '../services/api'

export default function AdminSidebar({ onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [ordersCount, setOrdersCount] = useState(0)
  const [lowStockCount, setLowStockCount] = useState(0)
  const [returnsCount, setReturnsCount] = useState(0)
  const [ticketsCount, setTicketsCount] = useState(0)

  useEffect(() => {
    // Fetch dynamic stats for admin badges
    api.get('/orders').then(res => {
      if (Array.isArray(res.data)) {
        // Count active/processing orders
        const active = res.data.filter(o => ['processing', 'shipped'].includes(o.status)).length;
        setOrdersCount(active)
      }
    }).catch(() => {})

    api.get('/stock').then(res => {
      const data = Array.isArray(res.data) ? res.data : (res.data.products || []);
      const lowStock = data.filter(p => p.totalStock < 10).length;
      setLowStockCount(lowStock)
    }).catch(() => {})

    api.get('/returns').then(res => {
      if (Array.isArray(res.data)) {
        const pending = res.data.filter(r => r.status === 'requested').length;
        setReturnsCount(pending)
      }
    }).catch(() => {})

    api.get('/contact').then(res => {
      if (Array.isArray(res.data)) {
        const unread = res.data.filter(c => c.status === 'new').length;
        setTicketsCount(unread)
      }
    }).catch(() => {})
  }, [location.pathname])

  const handleLogout = async () => {
    if (onClose) onClose();
    navigate('/landing')
    await logout()
  }

  // Four-pointed star logo matching the mockup exactly
  const NorthstarLogo = () => (
    <svg className="w-6 h-6 text-[#f5c518] fill-[#f5c518] flex-shrink-0" viewBox="0 0 24 24">
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z" />
    </svg>
  )

  const sections = [
    {
      title: '',
      links: [
        { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true }
      ]
    },
    {
      title: 'STORE',
      links: [
        { to: '/admin/orders', label: 'Orders', icon: Clipboard, badge: ordersCount },
        { to: '/admin/products', label: 'Products', icon: Package },
        { to: '/admin/inventory', label: 'Inventory', icon: Layers, badge: lowStockCount },
        { to: '/admin/categories', label: 'Categories', icon: Tag },
        { to: '/admin/promotions', label: 'Promotions', icon: Percent }
      ]
    },
    {
      title: 'CUSTOMERS',
      links: [
        { to: '/admin/customers', label: 'Customers', icon: Users },
        { to: '/admin/returns', label: 'Returns & Refunds', icon: RotateCcw, badge: returnsCount }
      ]
    },
    {
      title: 'SUPPORT',
      links: [
        { to: '/admin/contacts', label: 'Support Tickets', icon: MessageSquare, badge: ticketsCount },
        { to: '/admin/help', label: 'Help Center', icon: HelpCircle }
      ]
    },
    {
      title: 'ANALYTICS',
      links: [
        { to: '/admin/analytics', label: 'Sales Analytics', icon: BarChart2 },
        { to: '/admin/reports', label: 'Reports', icon: FileText }
      ]
    },
    {
      title: 'ADMINISTRATION',
      links: [
        { to: '/admin/users', label: 'Admin Users', icon: UserCheck },
        { to: '/admin/roles', label: 'Roles & Permissions', icon: Shield },
        { to: '/admin/settings', label: 'Settings', icon: Settings },
        { to: '/admin/activity', label: 'Activity Logs', icon: List }
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
            <span className="text-[#0a0e1a] font-black text-sm tracking-wider block">NORTHSTAR</span>
            <span className="text-slate-500 text-[9px] font-bold tracking-widest block mt-0.5">RETAIL CO.</span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-6">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {section.title && (
                <span className="px-6 text-[10px] font-bold text-[#64748b] tracking-wider block mb-2">
                  {section.title}
                </span>
              )}
              <nav className="space-y-0.5 px-3">
                {section.links.map((link, lIdx) => {
                  const isActive = location.pathname === link.to && !link.disabled;
                  return (
                    <NavLink
                      key={lIdx}
                      to={link.disabled ? '#' : link.to}
                      onClick={(e) => {
                        if (link.disabled) {
                          e.preventDefault();
                        } else if (onClose) {
                          onClose();
                        }
                      }}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                        isActive
                          ? 'text-[#f5c518] bg-[#f5c518]/10 font-bold'
                          : 'text-[#cbd5e1] hover:text-white hover:bg-[#1e293b]/50'
                      } ${link.disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <link.icon size={16} className={isActive ? 'text-[#f5c518]' : 'text-[#94a3b8] group-hover:text-white'} />
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

      {/* User profile / Logout */}
      <div className="p-4 border-t border-[#1f2937]/30">
        <div className="flex items-center justify-between p-2 hover:bg-[#1e293b]/30 rounded-xl transition-all cursor-pointer group" onClick={() => navigate('/admin/settings')}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1e293b] text-[#f5c518] border border-[#f5c518]/25 flex items-center justify-center font-bold text-xs">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : 'DA'}
            </div>
            <div className="text-left leading-tight">
              <p className="text-white text-xs font-bold truncate max-w-[110px]">{user?.name || 'Dennis Amutsa'}</p>
              <p className="text-[#f5c518] text-[9px] font-bold mt-0.5">Admin</p>
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); handleLogout(); }} className="text-[#64748b] hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}
