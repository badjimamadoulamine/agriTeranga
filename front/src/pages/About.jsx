import Header from '../components/Header'
import Footer from '../components/Footer'

const About = ({ onOpenRegister, onOpenLogin }) => {
  const values = [
    {
      icon: (
        <svg className="w-16 h-16 text-green-700 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ),
      title: 'Équité',
      description: 'Nous assurons des transactions justes qui valorisent le travail des agriculteurs et garantissent des prix abordables pour les consommateurs.'
    },
    {
      icon: (
        <svg className="w-16 h-16 text-green-700 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Transparence',
      description: 'Nous offrons une traçabilité complète du producteur au consommateur pour une confiance totale dans la qualité des produits.'
    },
    {
      icon: (
        <svg className="w-16 h-16 text-green-700 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Durabilité',
      description: 'Nous soutenons les pratiques agricoles respectueuses de l\'environnement pour préserver nos terres pour les générations futures.'
    }
  ]

  return (
    <div className="min-h-screen">
      <Header onRegisterClick={onOpenRegister} onLoginClick={onOpenLogin} />
      
      <main>
        {/* Hero Section */}
        <section 
          className="relative py-28 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/src/assets/prop.jpg')`
        }}
        >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            À Propos d'AgriTeranga
          </h1>
          <p className="text-lg md:text-xl max-w-4xl mx-auto leading-relaxed text-white">
            Notre mission est de donner le pouvoir aux agriculteurs locaux en créant un écosystème agricole transparent, équitable et durable pour tous.
          </p>
        </div>
        {/* Optional overlay */}
        <div className="absolute inset-0 bg-black opacity-30"></div>
        </section>

        {/* Qui sommes-nous Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Column - Text */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                  Qui sommes-nous ?
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Agriteranga est une plateforme numérique dédiée à la valorisation des produits agricoles locaux. Nous mettons en relation directe les producteurs, les consommateurs et les livreurs, pour encourager une agriculture durable, transparente et équitable. Notre objectif est de construire un pont entre les champs sénégalais et votre table, en garantissant la fraîcheur, la qualité et une juste rémunération pour les agriculteurs.
                  </p>
                  <p>
                    Grâce à notre réseau, les producteurs peuvent vendre facilement leurs récoltes, les consommateurs ont accès à des produits frais et sains, et les livreurs participent à la chaîne de distribution locale. Ensemble, nous bâtissons un écosystème agricole responsable qui soutient les communautés rurales et favorise le développement local.
                  </p>
                </div>
                  {/* 🔹 Bouton centré */}
                <div className="flex justify-center mt-8">
                  <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors flex items-center gap-2">
                    Contactez-nous
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Right Column - Images Grid */}
              <div className="grid grid-cols-2 gap-4 mt-10">
                <div className="col-span-1 row-span-2">
                  <img 
                    src="/src/assets/apropos1.jpg" 
                    alt="Jeune pousse" 
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                </div>
                <div className="col-span-1">
                  <img 
                    src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500" 
                    alt="Légumes frais" 
                    className="w-full h-48 object-cover rounded-lg shadow-lg"
                  />
                </div>
                <div className="col-span-1">
                  <img 
                    src="/src/assets/apropos3.jpg" 
                    alt="Plantation d'arbre" 
                    className="w-full h-48 object-cover rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nos valeurs Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Nos valeurs
              </h2>
              <p className="text-gray-600 text-lg">
                Au cœur de notre démarche, trois piliers fondamentaux guident nos actions.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-shadow text-center"
                >
                  {value.icon}
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default About