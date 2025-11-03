import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiMenu, HiX } from 'react-icons/hi'

const MainLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="text-xl md:text-2xl font-bold text-primary-600">
              Agriteranga
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors">
                Accueil
              </Link>
              <Link to="/products" className="text-gray-600 hover:text-primary-600 transition-colors">
                Produits
              </Link>
              <Link to="/formations" className="text-gray-600 hover:text-primary-600 transition-colors">
                Formations
              </Link>
              <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors">
                Dashboard
              </Link>
              <Link to="/login" className="btn-primary px-4 py-2">
                Connexion
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
              <div className="flex flex-col gap-4">
                <Link 
                  to="/" 
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Accueil
                </Link>
                <Link 
                  to="/products" 
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Produits
                </Link>
                <Link 
                  to="/formations" 
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Formations
                </Link>
                <Link 
                  to="/dashboard" 
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/login" 
                  className="btn-primary px-4 py-2 text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Connexion
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12 md:mt-16 lg:mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-4">Agriteranga</h3>
              <p className="text-sm md:text-base text-gray-400">Votre plateforme agricole de confiance</p>
            </div>
            <div>
              <h4 className="text-base md:text-lg font-semibold mb-4">Liens rapides</h4>
              <ul className="space-y-2 text-sm md:text-base text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Accueil</Link></li>
                <li><Link to="/products" className="hover:text-white transition-colors">Produits</Link></li>
                <li><Link to="/formations" className="hover:text-white transition-colors">Formations</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">À propos</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-base md:text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm md:text-base text-gray-400">
                <li>Email: contact@agriteranga.com</li>
                <li>Tél: +221 XX XXX XX XX</li>
                <li>Adresse: Dakar, Sénégal</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-sm md:text-base text-gray-400">
            <p>&copy; 2025 Agriteranga. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout
