import { useState, useEffect } from 'react'
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom'
import { Menu, X, Bell, ChevronRight, Headphones } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Sidebar from './Sidebar'
import api from '../services/api'

export default function CustomerLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    // Dynamic counts for notification bell
    Promise.all([
      api.get('/orders/my').catch(() => ({ data: [] })),
      api.get('/returns/my').catch(() => ({ data: [] }))
    ]).then(([orders, returns]) => {
      const inTransit = Array.isArray(orders.data) 
        ? orders.data.filter(o => ['shipped', 'out_for_delivery'].includes(o.status)).length 
        : 0;
      const approved = Array.isArray(returns.data) 
        ? returns.data.filter(r => ['approved', 'refund_processing'].includes(r.status)).length 
        : 0;
      setNotificationCount(inTransit + approved)
    }).catch(() => {})
  }, [location.pathname])

  const handleLogout = async () => {
    setDropdownOpen(false)
    await logout()
    navigate('/')
  }

  // Get dynamic title based on location
  const getHeaderDetails = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/dashboard/') {
      return {
        title: `Hello, ${user?.name ? user.name.split(' ')[0] : 'Dennis'}!`,
        subtitle: 'Welcome to your Northstar Retail support dashboard.'
      };
    }
    if (path.includes('/orders')) {
      return {
        title: 'My Orders',
        subtitle: 'Track, manage and view your order history.'
      };
    }
    if (path.includes('/returns')) {
      return {
        title: 'My Returns',
        subtitle: 'Manage your return and refund requests.'
      };
    }
    if (path.includes('/stock')) {
      return {
        title: 'Stock Availability',
        subtitle: 'Browse current stock levels of our product catalog.'
      };
    }
    if (path.includes('/account')) {
      return {
        title: 'My Account',
        subtitle: 'View and manage your profile details.'
      };
    }
    if (path.includes('/saved')) {
      return {
        title: 'Saved Items',
        subtitle: 'Your favorite and bookmarked items.'
      };
    }
    return {
      title: 'Northstar Support',
      subtitle: 'Need help? Contact support or browse solutions.'
    };
  };

  const header = getHeaderDetails();

  return (
    <div className="flex w-full h-screen bg-[#f8fafc] text-slate-800 overflow-hidden relative">
      
      {/* 1. Desktop Sidebar (Sticky, persistent) */}
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar />
      </div>

      {/* 2. Mobile Sidebar Overlay Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setMobileOpen(false)}
          />
          
          {/* Drawer content */}
          <div className="relative flex flex-col w-[260px] max-w-xs bg-[#0a0e1a] animate-slide-right shadow-2xl z-50">
            {/* Close button */}
            <button 
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white bg-slate-800/40 focus:outline-none"
            >
              <X size={18} />
            </button>
            <Sidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* 3. Main content body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-100 px-4 sm:px-8 py-4 flex items-center justify-between z-10 flex-shrink-0 select-none">
          <div className="flex items-center gap-3">
            {/* Hamburger menu button for small screens */}
            <button 
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl focus:outline-none"
            >
              <Menu size={20} />
            </button>

            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                {header.title}
              </h1>
              <p className="text-slate-500 text-[10px] sm:text-xs mt-0.5 font-semibold hidden sm:block">
                {header.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Notifications Bell */}
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={18} />
              {notificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-orange-600 text-white rounded-full flex items-center justify-center text-[9px] font-black">
                  {notificationCount}
                </span>
              )}
            </button>
            
            {/* User Dropdown */}
            <div className="relative border-l border-slate-150 pl-3 sm:pl-4">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 sm:gap-2 focus:outline-none group"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0a0e1a] text-[#f5c518] flex items-center justify-center font-bold text-xs">
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'DA'}
                </div>
                <ChevronRight size={14} className={`text-slate-400 group-hover:text-slate-600 transition-transform hidden sm:block ${dropdownOpen ? 'rotate-90' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-1 z-20 animate-fade-in">
                  <div className="px-4 py-2 border-b border-slate-50">
                    <p className="text-xs font-bold text-slate-800 truncate">{user?.name || 'Dennis Amutsa'}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user?.email || 'customer@northstar.com'}</p>
                  </div>
                  <Link 
                    to="/dashboard/account" 
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    My Profile
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="w-full text-left block px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content View wrapper */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
