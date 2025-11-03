import { useState } from 'react'

const NewsletterSection = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log(formData)
  }

  return (
    <section className="py-12 md:py-16 bg-primary-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Inscrivez-vous à notre newsletter
          </h2>
          <p className="text-primary-100 text-lg">
            Recevez nos dernières offres et actualités
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <input
              type="text"
              placeholder="Prénom"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
              required
            />
            <input
              type="text"
              placeholder="Nom"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
              required
            />
            <input
              type="tel"
              placeholder="Téléphone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
              required
            />
            <input
              type="text"
              placeholder="Adresse"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
              required
            />
            <input
              type="text"
              placeholder="Ville"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
              required
            />
          </div>
          <div className="text-center mt-6">
            <button 
              type="submit"
              className="bg-yellow-400 text-primary-900 px-10 py-3 rounded-full font-bold text-lg hover:bg-yellow-300 transition-colors"
            >
              S'inscrire maintenant
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default NewsletterSection
