import { HiTruck, HiShieldCheck, HiClock } from 'react-icons/hi'

const Features = () => {
  const features = [
    {
      icon: <HiTruck className="w-12 h-12" />,
      title: 'Livraison gratuite',
      description: 'Pour toute commande supérieure à 10 000 FCFA'
    },
    {
      icon: <HiShieldCheck className="w-12 h-12" />,
      title: 'Paiement sécurisé',
      description: 'Vos transactions sont 100% sécurisées'
    },
    {
      icon: <HiClock className="w-12 h-12" />,
      title: 'Support 24/7',
      description: 'Notre équipe est disponible à tout moment'
    }
  ]

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 text-primary-600 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
