import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { ToastProvider } from './contexts/ToastContext'
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
import SuperAdminDashboard from './pages/super_admin/SuperAdminDashboard'
import SuperAdminOrders from './pages/super_admin/SuperAdminOrders'
import SuperAdminProducts from './pages/super_admin/SuperAdminProducts'
import RegisterModal from './components/RegisterModal'
import LoginModal from './components/LoginModal'
import ErrorSystemTest from './components/ErrorSystemTest'
import Experts from './pages/Experts'
import Vendeurs from './pages/Vendeurs'
import Livraison from './pages/Livraison'

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
          <Route path="/about" element={<About onOpenRegister={openRegisterModal} onOpenLogin={openLoginModal} />} />
          <Route path="/login" element={<Login onOpenRegister={openRegisterModal} onOpenLogin={openLoginModal} />} />
          <Route path="/dashboard" element={<Dashboard onOpenRegister={openRegisterModal} onOpenLogin={openLoginModal} />} />
          <Route path="/services" element={<Services onOpenRegister={openRegisterModal} onOpenLogin={openLoginModal} />} />
          <Route path="/experts" element={<Experts onOpenRegister={openRegisterModal} onOpenLogin={openLoginModal} />} />
          <Route path="/sellers" element={<Vendeurs onOpenRegister={openRegisterModal} onOpenLogin={openLoginModal} />} />
          <Route path="/test-errors" element={<ErrorSystemTest />} />
          <Route path="/livraison" element={<Livraison onOpenRegister={openRegisterModal} onOpenLogin={openLoginModal} />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/sales" element={<AdminSales />} />
          <Route path="/admin/formations" element={<AdminFormations />} />
          
          {/* Producer Routes */}
          <Route path="/producer/dashboard" element={<ProducerDashboard />} />
          <Route path="/producer/products" element={<ProducerProducts />} />
          <Route path="/producer/statistics" element={<ProducerStatistics />} />
          <Route path="/producer/sales" element={<ProducerSales />} />
          <Route path="/producer/profile" element={<ProducerProfile />} />
          <Route path="/producer/settings" element={<ProducerSettings />} />
          <Route path="/producer/formations" element={<ProducerFormations />} />
          
          {/* Delivery Routes */}
          <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
          <Route path="/delivery/deliveries" element={<DeliveryDeliveries />} />
          <Route path="/delivery/history" element={<DeliveryHistory />} />
          
          {/* Super Admin Routes */}
          <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/super-admin/orders" element={<SuperAdminOrders />} />
          <Route path="/super-admin/products" element={<SuperAdminProducts />} />
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
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App