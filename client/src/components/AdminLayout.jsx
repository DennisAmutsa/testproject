import { useState, useEffect } from 'react'
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom'
import { Menu, X, Bell, Search, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AdminSidebar from './AdminSidebar'
import api from '../services/api'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    // Dynamic tickets and returns badge
    Promise.all([
      api.get('/returns').catch(() => ({ data: [] })),
      api.get('/contact').catch(() => ({ data: [] }))
    ]).then(([returns, contacts]) => {
      const returnsPending = Array.isArray(returns.data) ? returns.data.filter(r => r.status === 'requested').length : 0;
      const contactsNew = Array.isArray(contacts.data) ? contacts.data.filter(c => c.status === 'new').length : 0;
      setNotificationCount(returnsPending + contactsNew)
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
    if (path === '/admin' || path === '/admin/') {
      const hour = new Date().getHours();
      let greeting = 'Good morning';
      if (hour >= 12 && hour < 17) {
        greeting = 'Good afternoon';
      } else if (hour >= 17 || hour < 5) {
        greeting = 'Good evening';
      }
      return {
        title: `${greeting}, ${user?.name ? user.name.split(' ')[0] : 'Dennis'}`,
        subtitle: "Here's what's happening across Northstar today."
      };
    }
    if (path.includes('/orders')) {
      return {
        title: 'Manage Orders',
        subtitle: 'View, fulfill, and update orders from customers.'
      };
    }
    if (path.includes('/products')) {
      return {
        title: 'Manage Products',
        subtitle: 'Add, edit, or remove catalog items.'
      };
    }
    if (path.includes('/returns')) {
      return {
        title: 'Manage Returns & Refunds',
        subtitle: 'Process return requests and refunds.'
      };
    }
    if (path.includes('/contacts')) {
      return {
        title: 'Support Tickets',
        subtitle: 'Respond to customer support contact queries.'
      };
    }
    return {
      title: 'Northstar Admin Panel',
      subtitle: 'System management tools.'
    };
  };

  const header = getHeaderDetails();

  return (
    <div className="flex w-full h-screen bg-[#f8fafc] text-slate-800 overflow-hidden relative">
      
      {/* 1. Desktop Sidebar (Sticky, persistent) */}
      <div className="hidden lg:block flex-shrink-0">
        <AdminSidebar />
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
            <AdminSidebar onClose={() => setMobileOpen(false)} />
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
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-1.5 leading-tight">
                {header.title}
              </h1>
              <p className="text-slate-500 text-[10px] sm:text-xs mt-0.5 font-semibold hidden sm:block">
                {header.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Icon */}
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Search size={18} />
            </button>

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
                className="flex items-center gap-1.5 sm:gap-2 focus:outline-none group"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1e293b] text-[#f5c518] border border-[#f5c518]/25 flex items-center justify-center font-bold text-xs">
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'DA'}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold text-slate-800 leading-none">{user?.name || 'Dennis Amutsa'}</p>
                  <span className="text-[9px] font-bold text-[#f5c518] bg-[#f5c518]/10 px-1.5 py-0.5 rounded-full inline-block mt-1">Admin</span>
                </div>
                <ChevronRight size={14} className={`text-slate-400 group-hover:text-slate-600 transition-transform hidden sm:block ${dropdownOpen ? 'rotate-90' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-1 z-20 animate-fade-in">
                  <div className="px-4 py-2 border-b border-slate-50">
                    <p className="text-xs font-bold text-slate-800 truncate">{user?.name || 'Dennis Amutsa'}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@northstar.com'}</p>
                  </div>
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
