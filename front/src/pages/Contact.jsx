import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FreeMapComponent from '../components/FreeMapComponent';

const Contact = ({ onOpenRegister, onOpenLogin }) => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    date: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    nom: '',
    email: '',
    telephone: '',
    date: '',
    message: ''
  });

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const getToday = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const today = getToday();

  const formatDateFr = (yyyyMmDd) => {
    if (!yyyyMmDd) return '';
    const [y, m, d] = yyyyMmDd.split('-');
    return `${d}/${m}/${y}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation globale
    const newErrors = {
      nom: validateField('nom', formData.nom),
      email: validateField('email', formData.email),
      telephone: validateField('telephone', formData.telephone),
      date: validateField('date', formData.date),
      message: validateField('message', formData.message)
    };
    setErrors(newErrors);
    const hasError = Object.values(newErrors).some((v) => v);
    if (hasError) return;

    setIsSuccessModalOpen(true);
    setFormData({
      nom: '',
      email: '',
      telephone: '',
      date: '',
      message: ''
    });
  };

  const normalizePhone = (v) => v.replace(/[^\d]/g, '');
  const isValidSenegalPhone = (raw) => {
    const digits = normalizePhone(raw);
    let rest = digits;
    if (rest.startsWith('00221')) rest = rest.slice(5);
    else if (rest.startsWith('221')) rest = rest.slice(3);
    if (!/^\d{9}$/.test(rest)) return false;
    const prefix2 = rest.slice(0, 2);
    const prefixMobile = ['70', '75', '76', '77', '78'];
    if (prefix2 === '33') return true;
    return prefixMobile.includes(prefix2);
  };

  const isWeekend = (yyyyMmDd) => {
    const d = new Date(yyyyMmDd + 'T00:00:00');
    const day = d.getDay();
    return day === 0 || day === 6;
    };

  const fixedHolidays = new Set([
    '01-01',
    '04-04',
    '05-01',
    '08-15',
    '11-01',
    '12-25',
  ]);

  const isHoliday = (yyyyMmDd) => {
    if (!yyyyMmDd) return false;
    const [, mm, dd] = yyyyMmDd.split('-');
    return fixedHolidays.has(`${mm}-${dd}`);
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'nom':
        if (!value?.trim()) return 'Le nom est requis.';
        return '';
      case 'email':
        if (!value?.trim()) return "L'email est requis.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email invalide.";
        return '';
      case 'telephone':
        if (!value?.trim()) return 'Le numéro de téléphone est requis.';
        if (!isValidSenegalPhone(value)) return 'Numéro invalide. Exemple: +221 77 123 45 67 ou 33 8xx xx xx';
        return '';
      case 'date':
        if (!value) return 'La date est requise.';
        if (value < today) return `La date ${formatDateFr(value)} doit être aujourd'hui ou ultérieure.`;
        if (isWeekend(value)) return `Les rendez-vous ne sont pas disponibles le week-end (${formatDateFr(value)}).`;
        if (isHoliday(value)) return `Les rendez-vous ne sont pas disponibles les jours fériés (${formatDateFr(value)}).`;
        return '';
      case 'message':
        return '';
      default:
        return '';
    }
  };

  // Coordonnées de l'entreprise (Dakar, Sénégal)
  const companyLocation = {
    lat: 14.6937, // Latitude exacte de Dakar
    lng: -17.4441, // Longitude exacte de Dakar
    name: 'AgriTeranga',
    address: 'Dakar, Sénégal',
    phone: '+221 77 343 24 85',
    email: 'agriteranga@gmail.com'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header global */}
      <Header onRegisterClick={onOpenRegister} onLoginClick={onOpenLogin} />
      
      {/* Section Contact Améliorée */}
      <section
        className="relative h-[320px] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 60, 30, 0.6), rgba(0, 60, 30, 0.6)), url('/src/assets/contact.jpg')`,
        }}
      >
        <div className="text-center text-white px-6 md:px-12 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
           🌿 Entrons en contact 🌿
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Notre équipe passionnée est toujours ravie d’échanger avec vous.  
            Que ce soit pour une collaboration, une question ou un partenariat,  
            nous sommes à votre écoute à Dakar et en ligne.
          </p>
        </div>
      </section>

      {/* Section de Contact Principale */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Formulaire de Contact */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-green-800 mb-2">Restons en contact</h2>
              <p className="text-green-700 mb-8">Une question, un projet ? Notre équipe est à votre écoute.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Votre nom complet"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {errors.nom && (
                    <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse e-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Votre adresse e-mail"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de téléphone
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="telephone"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      placeholder="Votre numéro de téléphone"
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    {errors.telephone && (
                      <p className="mt-1 text-sm text-red-600">{errors.telephone}</p>
                    )}
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Date de rendez-vous souhaitée
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={today}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    {errors.date && (
                      <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                    )}
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Votre message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Écrivez votre message ici..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-800 hover:bg-green-900 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Envoyer le message
                </button>
              </form>
            </div>

            {/* Informations de Contact */}
            <div className="space-y-8">
              {/* Nos Coordonnées */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold text-green-800 mb-6">Nos Coordonnées</h3>
                
                <div className="space-y-4">
                  <button 
                    onClick={() => {
                      // Ouvrir la carte de localisation
                      const url = `https://www.openstreetmap.org/?mlat=${companyLocation.lat}&mlon=${companyLocation.lng}#map=15/${companyLocation.lat}/${companyLocation.lng}`;
                      window.open(url, '_blank');
                    }}
                    className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-green-50 transition-colors text-left group"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Adresse</p>
                      <p className="text-gray-600">{companyLocation.address}</p>
                      <p className="text-xs text-green-600 mt-1">Cliquer pour voir sur la carte →</p>
                    </div>
                  </button>

                  <a 
                    href={`tel:${companyLocation.phone}`}
                    className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-green-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Téléphone</p>
                      <p className="text-gray-600">{companyLocation.phone}</p>
                      <p className="text-xs text-green-600 mt-1">Cliquer pour appeler →</p>
                    </div>
                  </a>

                  <a 
                    href={`mailto:${companyLocation.email}?subject=Contact depuis AgriTeranga&body=Bonjour,`}
                    className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-green-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Email</p>
                      <p className="text-gray-600">{companyLocation.email}</p>
                      <p className="text-xs text-green-600 mt-1">Cliquer pour écrire →</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Horaires d'Ouverture */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold text-green-800 mb-6">Horaires d'Ouverture</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">Lundi - Vendredi</span>
                    <span className="font-medium text-gray-800">08:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">Samedi</span>
                    <span className="font-medium text-gray-800">09:00 - 13:00</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700">Dimanche</span>
                    <span className="font-medium text-gray-800">Fermé</span>
                  </div>
                </div>
              </div>

              {/* Réseaux Sociaux */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-bold text-green-800 mb-4">Suivez-nous</h3>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors">
                    <span className="text-green-600 font-bold">f</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.083.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors">
                    <span className="text-green-600 font-bold text-xs">in</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Carte - Où nous trouver */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-800 mb-4">Où nous trouver</h2>
            <p className="text-gray-600">Venez découvrir notre espace à Dakar et profitez d’une expérience unique au cœur de l’innovation agricole.</p>
          </div>
          
          {/* Carte GRATUITE OpenStreetMap */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <FreeMapComponent 
              location={companyLocation}
              height="400px"
              zoom={15}
              showDirections={true}
            />
          </div>
        </div>
      </section>
      
      {/* Footer global */}
      <Footer />

      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-green-800 mb-2">Message envoyé</h3>
            <p className="text-gray-700 mb-6">Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.</p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="bg-green-800 hover:bg-green-900 text-white px-4 py-2 rounded-lg"
                onClick={() => setIsSuccessModalOpen(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;