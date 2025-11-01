import React, { useState, useEffect } from 'react';

const TestimonialsSection = () => {
  const testimonials = [
    // Groupe 1
    {
      quote: "Grâce à AgriTeranga, je peux vendre ma production directement aux consommateurs. C'est une vraie révolution pour nous, les petits producteurs !",
      name: 'Aissatou Sow',
      role: 'Étudiante',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
    },
    {
      quote: "J'ai accès à des produits frais et locaux chaque semaine. La qualité est exceptionnelle et je soutiens directement nos agriculteurs locaux.",
      name: 'Mamadou Fall',
      role: 'Consommateur',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
    },
    {
      quote: "En tant que livreur sur la plateforme, je participe à une économie locale et durable. C'est valorisant et les revenus sont intéressants.",
      name: 'Ousmane Diop',
      role: 'Livreur',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'
    },
    // Groupe 2 (nouveaux témoignages)
    {
      quote: "La plateforme m'a permis de développer mon business de maraîchage. Je vends maintenant 3 fois plus qu'avant grâce à la visibilité offerte.",
      name: 'Fatou Diop',
      role: 'Productrice',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
    },
    {
      quote: "Livraison rapide et produits de qualité. Je recommande AgriTeranga à tous mes amis qui veulent manger sain et soutenir l'agriculture locale.",
      name: 'Ibrahim Ndiaye',
      role: 'Client fidèle',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
    },
    {
      quote: "Travailler avec cette plateforme a transformé ma façon de consommer. Je découvre de nouveaux producteurs chaque semaine !",
      name: 'Marie Gomis',
      role: 'Acheteuse régulière',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Carrousel automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 2); // 2 groupes (0 et 1)
    }, 3000); // Change toutes les 5 secondes

    return () => clearInterval(interval);
  }, []);

  // Afficher 3 témoignages par groupe
  const getVisibleTestimonials = () => {
    const groupSize = 3;
    const startIndex = currentIndex * groupSize;
    return testimonials.slice(startIndex, startIndex + groupSize);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-script text-gray-800 mb-3">
            Témoignages de nos clients
          </h2>
          <p className="text-gray-600 text-lg">
            Ce que disent nos clients
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {getVisibleTestimonials().map((testimonial, index) => (
            <div key={`${currentIndex}-${index}`} className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-shadow">
              <div className="mb-6">
                <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {testimonial.quote}
              </p>
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-gray-800">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-3 mt-8">
          <div className={`w-4 h-4 rounded-full transition-colors duration-300 ${
            currentIndex === 0 ? 'bg-green-600' : 'bg-gray-300'
          }`}></div>
          <div className={`w-4 h-4 rounded-full transition-colors duration-300 ${
            currentIndex === 1 ? 'bg-green-600' : 'bg-gray-300'
          }`}></div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;