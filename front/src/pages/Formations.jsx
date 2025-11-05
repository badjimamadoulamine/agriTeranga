import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ArrowRight, Play } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Formations = ({ onOpenRegister, onOpenLogin }) => {
  // Données des tutoriels vidéo
  const videoTutorials = [
    {
      id: 1,
      title: 'Techniques de compostage',
      description: 'Apprenez à créer votre propre compost pour enrichir naturellement vos sols agricoles.',
      image: '🌱',
    },
    {
      id: 2,
      title: 'Irrigation goutte à goutte',
      description: 'Optimisez l\'utilisation de l\'eau avec des techniques d\'irrigation modernes et efficaces.',
      image: '💧',
    },
    {
      id: 3,
      title: 'Lutte intégrée contre les ravageurs',
      description: 'Découvrez les méthodes naturelles pour protéger vos cultures des insects nuisibles.',
      image: '🛡️',
    },
  ];

  // Données des fiches pratiques
  const practicalGuides = [
    {
      id: 1,
      title: 'Calendrier des semis',
      description: 'Planifiez vos plantations tout au long de l\'année selon les saisons et les conditions climatiques.',
      image: '📅',
    },
    {
      id: 2,
      title: 'Analyse et amendement du sol',
      description: 'Comprenez la composition de votre sol et apprenez à l\'améliorer pour une meilleure productivité.',
      image: '🔬',
    },
    {
      id: 3,
      title: 'Gestion financière d\'une exploitation',
      description: 'Maîtrisez les aspects économiques et financiers de votre activité agricole.',
      image: '💰',
    },
  ];

  // Données des webinaires
  const webinars = [
    {
      id: 1,
      title: 'Transition vers l\'agriculture bio',
      description: 'Guide complet pour convertir votre exploitation vers l\'agriculture biologique.',
      image: '🌿',
    },
    {
      id: 2,
      title: 'Agrovoltaïsme: Énergie et culture',
      description: 'Découvrez comment combiner production énergétique et agricole de manière synergique.',
      image: '☀️',
    },
    {
      id: 3,
      title: 'Les drones au service de l\'agriculture',
      description: 'Explorez les applications des drones dans la surveillance et l\'optimisation des cultures.',
      image: '🚁',
    },
  ];

  // Données des quiz
  const quizzes = [
    {
      id: 1,
      title: 'Quiz sur la santé des sols',
      description: 'Testez vos connaissances sur la composition, la structure et la santé des sols agricoles.',
      image: '🌍',
    },
    {
      id: 2,
      title: 'Quiz sur les cultures maraîchères',
      description: 'Évaluez votre expertise sur la culture des légumes et les techniques de production.',
      image: '🥬',
    },
    {
      id: 3,
      title: 'Quiz sur la biodiversité',
      description: 'Découvrez vos acquis sur la biodiversité agricole et son importance écosystémique.',
      image: '🦋',
    },
  ];

  const ContentCard = ({ item }) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col h-full">
      <div className="text-center mb-4">
        <div className="text-4xl mb-3">{item.image}</div>
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">{item.title}</h3>
      <p className="text-gray-600 text-sm mb-6 text-center leading-relaxed flex-grow">{item.description}</p>
      <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium mt-auto">
        Accéder <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Header global */}
        <Header onRegisterClick={onOpenRegister} onLoginClick={onOpenLogin} />
      {/* Hero Section */}
      <section 
        className="relative h-96 flex items-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/src/assets/form.jpg')`
        }}
      >
        <div className="container mx-auto px-2">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Développez vos compétences agricoles
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white">
              Des formations conçues par des experts pour vous aider à réussir dans le monde agricole moderne.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Bar */}
      <section className="bg-green-100 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-700 mb-4">
            Commencez gratuitement et débloquez des contenus exclusifs avec notre abonnement premium pour un apprentissage approfondi.
          </p>
          <button className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors">
            Voir les offres
          </button>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        {/* Tutoriels Vidéo */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Tutoriels Vidéo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videoTutorials.map((tutorial) => (
              <ContentCard key={tutorial.id} item={tutorial} />
            ))}
          </div>
        </section>

        {/* Fiches Pratiques */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Fiches Pratiques</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {practicalGuides.map((guide) => (
              <ContentCard key={guide.id} item={guide} />
            ))}
          </div>
        </section>

        {/* Webinaires à venir */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Webinaires à venir</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {webinars.map((webinar) => (
              <ContentCard key={webinar.id} item={webinar} />
            ))}
          </div>
        </section>

        {/* Testez vos connaissances */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Testez vos connaissances</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <ContentCard key={quiz.id} item={quiz} />
            ))}
          </div>
        </section>
      </main>

      {/* ✅ Footer global */}
      <Footer />
    </div>
  );
};

export default Formations;