import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import { CartProvider } from './contexts/CartContext'
import { ToastProvider } from './contexts/ToastContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import Produits from './pages/Produits'
import ProductDetail from './pages/ProductDetail'
import Panier from './pages/Panier'
import Contact from './pages/Contact'
import Dashboard from './pages/Dashboard'
import Services from './pages/Services'
import AdminDashboard from './pages/admin_standard/AdminDashboard'
import AdminUsers from './pages/admin_standard/AdminUsers'
import AdminProducts from './pages/admin_standard/AdminProducts'
import AdminSales from './pages/admin_standard/AdminSales'
import AdminFormations from './pages/admin_standard/AdminFormations'
import ProducerDashboard from './pages/producer/ProducerDashboard'
import ProducerProducts from './pages/producer/ProducerProducts'
import ProducerStatistics from './pages/producer/ProducerStatistics'
import ProducerSales from './pages/producer/ProducerSales'
import ProducerProfile from './pages/producer/ProducerProfile'
import ProducerSettings from './pages/producer/ProducerSettings'
import ProducerFormations from './pages/producer/ProducerFormations'
import DeliveryDashboard from './pages/delivery/DeliveryDashboard'
import DeliveryDeliveries from './pages/delivery/DeliveryDeliveries'
import DeliveryHistory from './pages/delivery/DeliveryHistory'
import DeliveryStatistics from './pages/delivery/DeliveryStatistics'
import SuperAdminDashboard from './pages/super_admin/SuperAdminDashboard'
import SuperAdminOrders from './pages/super_admin/SuperAdminOrders'
import SuperAdminProducts from './pages/super_admin/SuperAdminProducts'
import RegisterModal from './components/RegisterModal'
import LoginModal from './components/LoginModal'
import ErrorSystemTest from './components/ErrorSystemTest'
import Experts from './pages/Experts'
import Vendeurs from './pages/Vendeurs'
import Livraison from './pages/Livraison'
import Commandes from './pages/Commandes'
import ResetPassword from './pages/ResetPassword'
import AdminLogin from './pages/admin_standard/AdminLogin'

function AppContent() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const { login } = useAuth()

  const openRegisterModal = () => {
    setIsLoginModalOpen(false)
    setIsRegisterModalOpen(true)
  }
  
  const openLoginModal = () => {
    setIsRegisterModalOpen(false)
    setIsLoginModalOpen(true)
  }

  const closeRegisterModal = () => setIsRegisterModalOpen(false)
  const closeLoginModal = () => setIsLoginModalOpen(false)

  const handleAuthSuccess = (userData) => {
    login(userData)
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home onOpenRegister={openRegisterModal} onOpenLogin={openLoginModal} />} />
          
          <Route path="/products" element={<Produits onOpenRegister={openRegisterModal} onOpenLogin={openLoginModal} />} />
          <Route path="/produit/:id" element={<ProductDetail onOpenRegister={openRegisterModal} onOpenLogin={openLoginModal} />} />
          <Route path="/panier" element={<Panier onOpenRegister={openRegisterModal} onOpenLogin={openLoginModal} />} />
          <Route path="/connexion" element={<Login onOpenRegister={openRegisterModal} onOpenLogin={openLoginModal} />} />
          <Route path="/contact" element={<Contact onOpenRegister={openRegisterModal} onOpenLogin={openLoginModal} />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/about" element={<About onOpenRegister={openRegisterModal} onOpenLogin={openLoginModal} />} />
          <Route path="/login" element={<Login onOpenRegister={openRegisterModal} onOpenLogin={openLoginModal} />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute dashboard="any">
                <Dashboard onOpenRegister={openRegisterModal} onOpenLogin={openLoginModal} />
              </ProtectedRoute>
            }
          />
          <Route path="/services" element={<Services onOpenRegister={openRegisterModal} onOpenLogin={openLoginModal} />} />
          <Route path="/experts" element={<Experts onOpenRegister={openRegisterModal} onOpenLogin={openLoginModal} />} />
          <Route path="/sellers" element={<Vendeurs onOpenRegister={openRegisterModal} onOpenLogin={openLoginModal} />} />
          <Route path="/test-errors" element={<ErrorSystemTest />} />
          <Route path="/livraison" element={<Livraison onOpenRegister={openRegisterModal} onOpenLogin={openLoginModal} />} />
          <Route path="/commandes" element={<Commandes onOpenRegister={openRegisterModal} onOpenLogin={openLoginModal} />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute dashboard="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute dashboard="admin">
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute dashboard="admin">
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/sales"
            element={
              <ProtectedRoute dashboard="admin">
                <AdminSales />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/formations"
            element={
              <ProtectedRoute dashboard="admin">
                <AdminFormations />
              </ProtectedRoute>
            }
          />
          
          {/* Producer Routes */}
          <Route path="/producer/dashboard" element={<ProtectedRoute dashboard="producer"><ProducerDashboard /></ProtectedRoute>} />
          <Route path="/producer/products" element={<ProtectedRoute dashboard="producer"><ProducerProducts /></ProtectedRoute>} />
          <Route path="/producer/statistics" element={<ProtectedRoute dashboard="producer"><ProducerStatistics /></ProtectedRoute>} />
          <Route path="/producer/sales" element={<ProtectedRoute dashboard="producer"><ProducerSales /></ProtectedRoute>} />
          <Route path="/producer/profile" element={<ProtectedRoute dashboard="producer"><ProducerProfile /></ProtectedRoute>} />
          <Route path="/producer/settings" element={<ProtectedRoute dashboard="producer"><ProducerSettings /></ProtectedRoute>} />
          <Route path="/producer/formations" element={<ProtectedRoute dashboard="producer"><ProducerFormations /></ProtectedRoute>} />
          
          {/* Delivery Routes */}
          <Route path="/delivery/dashboard" element={<ProtectedRoute dashboard="delivery"><DeliveryDashboard /></ProtectedRoute>} />
          <Route path="/delivery/deliveries" element={<ProtectedRoute dashboard="delivery"><DeliveryDeliveries /></ProtectedRoute>} />
          <Route path="/delivery/history" element={<ProtectedRoute dashboard="delivery"><DeliveryHistory /></ProtectedRoute>} />
          <Route path="/delivery/statistics" element={<ProtectedRoute dashboard="delivery"><DeliveryStatistics /></ProtectedRoute>} />
          
          {/* Super Admin Routes */}
          <Route path="/super-admin/dashboard" element={<ProtectedRoute dashboard="super-admin"><SuperAdminDashboard /></ProtectedRoute>} />
          <Route path="/super-admin/orders" element={<ProtectedRoute dashboard="super-admin"><SuperAdminOrders /></ProtectedRoute>} />
          <Route path="/super-admin/products" element={<ProtectedRoute dashboard="super-admin"><SuperAdminProducts /></ProtectedRoute>} />
          
          {/* Super Admin Access to Admin Standard Pages */}
          <Route
            path="/super-admin/admin-dashboard"
            element={
              <ProtectedRoute dashboard="super-admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/admin-users"
            element={
              <ProtectedRoute dashboard="super-admin">
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/admin-products"
            element={
              <ProtectedRoute dashboard="super-admin">
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/admin-sales"
            element={
              <ProtectedRoute dashboard="super-admin">
                <AdminSales />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/admin-formations"
            element={
              <ProtectedRoute dashboard="super-admin">
                <AdminFormations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/admin-login"
            element={
              <ProtectedRoute dashboard="super-admin">
                <AdminLogin />
              </ProtectedRoute>
            }
          />
        </Routes>
        
        {/* Modal d'inscription */}
        <RegisterModal 
          isOpen={isRegisterModalOpen} 
          onClose={closeRegisterModal} 
          onSwitchToLogin={openLoginModal}
          onSuccess={handleAuthSuccess}
        />

        {/* Modal de connexion */}
        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={closeLoginModal}
          onSwitchToRegister={openRegisterModal}
          onSuccess={handleAuthSuccess}
        />
      </div>
    </Router>
  )
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
          <ToastContainer position="top-right" autoClose={5000} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App