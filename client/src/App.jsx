import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Public pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import HelpPage from './pages/HelpPage'
import StockPage from './pages/StockPage'

// Customer dashboard
import CustomerDashboard from './pages/customer/CustomerDashboard'
import CustomerOrders from './pages/customer/CustomerOrders'
import CustomerReturns from './pages/customer/CustomerReturns'

// Admin dashboard
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminReturns from './pages/admin/AdminReturns'
import AdminContacts from './pages/admin/AdminContacts'

// Route guards
function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full" /></div>
  return user ? children : <Navigate to="/login" replace />
}
function RequireAdmin({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full" /></div>
  if (!user) return <Navigate to="/login" replace />
  return user.role === 'admin' ? children : <Navigate to="/dashboard" replace />
}
function RedirectIfLoggedIn({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
  return children
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/"        element={<HomePage />} />
          <Route path="/about"   element={<AboutPage />} />
          <Route path="/help"    element={<HelpPage />} />
          <Route path="/stock"   element={<StockPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Auth */}
          <Route path="/login"  element={<RedirectIfLoggedIn><LoginPage /></RedirectIfLoggedIn>} />
          <Route path="/signup" element={<RedirectIfLoggedIn><SignUpPage /></RedirectIfLoggedIn>} />

          {/* Customer Dashboard */}
          <Route path="/dashboard"         element={<RequireAuth><CustomerDashboard /></RequireAuth>} />
          <Route path="/dashboard/orders"  element={<RequireAuth><CustomerOrders /></RequireAuth>} />
          <Route path="/dashboard/returns" element={<RequireAuth><CustomerReturns /></RequireAuth>} />

          {/* Admin Dashboard */}
          <Route path="/admin"           element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
          <Route path="/admin/products"  element={<RequireAdmin><AdminProducts /></RequireAdmin>} />
          <Route path="/admin/orders"    element={<RequireAdmin><AdminOrders /></RequireAdmin>} />
          <Route path="/admin/returns"   element={<RequireAdmin><AdminReturns /></RequireAdmin>} />
          <Route path="/admin/contacts"  element={<RequireAdmin><AdminContacts /></RequireAdmin>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
