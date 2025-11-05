import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  GraduationCap, 
  Truck, 
  Users, 
  Shield, 
  Headphones,
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Services = ({ onOpenRegister, onOpenLogin }) => {
  // Données des services principaux
  const mainServices = [
    {
      id: 1,
      title: 'E-commerce Agricole',
      description: 'Vendez vos produits agricoles directement aux consommateurs avec notre plateforme sécurisée et intuitive.',
      icon: <ShoppingCart className="w-12 h-12" />,
      features: [
        'Catalogue en ligne personnalisé',
        'Paiement sécurisé',
        'Gestion des commandes',
        'Suivi des ventes'
      ],
      color: 'bg-green-500'
    },
    {
      id: 2,
      title: 'Formations & Accompagnement',
      description: 'Développez vos compétences agricoles avec nos formations certifiantes et notre accompagnement personnalisé.',
      icon: <GraduationCap className="w-12 h-12" />,
      features: [
        'Formations pratiques',
        'Mentorat d\'experts',
        'Certifications reconnues',
        'Mise à jour continue'
      ],
      color: 'bg-blue-500'
    },
    {
      id: 3,
      title: 'Livraison & Distribution',
      description: 'Assurez une livraison rapide et fiable de vos produits grâce à notre réseau de distribution.',
      icon: <Truck className="w-12 h-12" />,
      features: [
        'Livraison express',
        'Réseau national',
        'Produits frais garantis',
        'Suivi en temps réel'
      ],
      color: 'bg-orange-500'
    }
  ];

  // Données des services complémentaires
  const additionalServices = [
    {
      id: 1,
      title: 'Communauté Agricole',
      description: 'Rejoignez une communauté active d\'agriculteurs et d\'experts pour échanger et apprendre.',
      icon: <Users className="w-8 h-8" />
    },
    {
      id: 2,
      title: 'Sécurité & Traçabilité',
      description: 'Garantissez la qualité et la sécurité de vos produits avec notre système de traçabilité.',
      icon: <Shield className="w-8 h-8" />
    },
    {
      id: 3,
      title: 'Support Client 24/7',
      description: 'Notre équipe est disponible 24h/24 et 7j/7 pour vous accompagner dans vos démarches.',
      icon: <Headphones className="w-8 h-8" />
    }
  ];

  // Données des témoignages
  const testimonials = [
    {
      id: 1,
      name: 'Moussa BA',
      role: 'Producteur de légumes',
      content: 'Grâce à AgriTeranga, j\'ai multiplié mes ventes par 3 en 6 mois. La plateforme est simple et efficace.',
      rating: 5
    },
    {
      id: 2,
      name: 'Aïda TRAORE',
      role: 'Éleveuse',
      content: 'Les formations m\'ont permis d\'améliorer considérablement la santé de mon élevage. Excellent support !',
      rating: 5
    },
    {
      id: 3,
      name: 'Ibrahim DIOP',
      role: 'Agriculteur bio',
      content: 'La livraison est rapide et mes clients apprécient la fraîcheur des produits. Je recommande vivement !',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
        <Header onRegisterClick={onOpenRegister} onLoginClick={onOpenLogin} />
      {/* Hero Section */}
      <section 
        className="relative h-96 bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.10), rgba(0, 0, 0, 0.10)), url('/src/assets/service.jpg')`
        }}
      >
        <div className="text-center text-white px-4">
          <h1 className="text-8xl font-bold mb-4">Découvrez nos Services</h1>
          <p className="text-2xl mb-8 max-w-2xl mx-auto">
            Découvrez l'ensemble de nos services conçus pour accompagner votre réussite agricole
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full transition-colors"
          >
            Nous contacter
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Services Principaux */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Services Principaux</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nous proposons une gamme complète de services pour répondre à tous vos besoins agricoles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainServices.map((service) => (
              <div key={service.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8 flex flex-col h-full">
                <div className={`${service.color} w-20 h-20 rounded-full flex items-center justify-center text-white mb-6`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6 flex-grow">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/contact?service=${encodeURIComponent(service.title)}`}
                  className="w-full inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors mt-auto"
                  aria-label={`En savoir plus sur ${service.title}`}
                >
                  En savoir plus
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Complémentaires */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Services Complémentaires</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Des services additionnels pour une expérience complète et réussie
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalServices.map((service) => (
              <div key={service.id} className="flex items-start space-x-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-green-100 p-3 rounded-full text-green-600 flex-shrink-0">
                  {service.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ce que disent nos clients</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Découvrez les témoignages de nos utilisateurs satisfaits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, index) => (
                    <Star key={index} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-green-600 rounded-lg text-white m-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez la révolution agricole avec AgriTeranga et transforms votre activité
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="inline-flex items-center bg-white text-green-800 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
            >
              S'inscrire gratuitement
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              to="/contact" 
              className="inline-flex items-center border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white hover:text-green-800 transition-colors"
            >
              Nous contacter
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;