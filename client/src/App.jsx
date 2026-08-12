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
import CustomerLayout from './components/CustomerLayout'
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
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-brand-navy"><div className="animate-spin w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full" /></div>
  return user ? children : <Navigate to="/login" replace />
}
function RequireAdmin({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-brand-navy"><div className="animate-spin w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full" /></div>
  if (!user) return <Navigate to="/login" replace />
  return user.role === 'admin' ? children : <Navigate to="/dashboard" replace />
}
function RedirectIfLoggedIn({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
  return children
}

// Home route auto-redirect wrapper
function HomeWrapper() {
  const { user } = useAuth()
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
  }
  return <HomePage />
}

export default function App() {
  const { user } = useAuth()
  
  return (
    <div className="min-h-screen flex flex-col bg-brand-navy">
      <Routes>
        {/* Dashboard/Admin Routes (No public Navbar/Footer, they will render their own sidebars) */}
        <Route path="/dashboard" element={
          <RequireAuth>
            <CustomerLayout />
          </RequireAuth>
        }>
          <Route index element={<CustomerDashboard />} />
          <Route path="orders" element={<CustomerOrders />} />
          <Route path="returns" element={<CustomerReturns />} />
          <Route path="stock" element={<StockPage />} />
        </Route>

        <Route path="/admin/*" element={
          <RequireAdmin>
            <div className="flex-1 flex">
              <main className="flex-1 bg-brand-navy">
                <Routes>
                  <Route path="/"           element={<AdminDashboard />} />
                  <Route path="/products"  element={<AdminProducts />} />
                  <Route path="/orders"    element={<AdminOrders />} />
                  <Route path="/returns"   element={<AdminReturns />} />
                  <Route path="/contacts"  element={<AdminContacts />} />
                </Routes>
              </main>
            </div>
          </RequireAdmin>
        } />

        {/* Public Routes (With public Navbar and Footer) */}
        <Route path="*" element={
          <>
            <Navbar />
            <div className="flex-1">
              <Routes>
                <Route path="/"        element={<HomeWrapper />} />
                <Route path="/about"   element={<AboutPage />} />
                <Route path="/help"    element={<HelpPage />} />
                <Route path="/stock"   element={<StockPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login"   element={<RedirectIfLoggedIn><LoginPage /></RedirectIfLoggedIn>} />
                <Route path="/signup"  element={<RedirectIfLoggedIn><SignUpPage /></RedirectIfLoggedIn>} />
                <Route path="*"        element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <Footer />
          </>
        } />
      </Routes>
    </div>
  )
}
