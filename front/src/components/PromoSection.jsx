import { useState } from 'react'

const PromoSection = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Email:', email)
  }

  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800" 
                alt="Légumes frais" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Form */}
          <div className="order-1 lg:order-2 bg-white p-8 md:p-10 rounded-2xl shadow-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Profitez de nos offres spéciales
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Inscrivez-vous à notre newsletter et recevez 10% de réduction sur votre première commande
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-yellow-400 text-primary-900 py-3 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors"
              >
                S'abonner maintenant
              </button>
            </form>
            <p className="text-sm text-gray-500 mt-4">
              En vous inscrivant, vous acceptez de recevoir nos communications marketing
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PromoSection
