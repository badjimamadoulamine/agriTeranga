import { useState } from 'react';

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    appointmentDate: '',
    appointmentTime: '',
    comments: ''
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    appointmentDate: '',
    appointmentTime: '',
    comments: ''
  });

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const getToday = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  const today = getToday();

  const formatDateFr = (yyyyMmDd) => {
    if (!yyyyMmDd) return '';
    const [y, m, d] = yyyyMmDd.split('-');
    return `${d}/${m}/${y}`;
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

  const fixedHolidays = new Set(['01-01','04-04','05-01','08-15','11-01','12-25']);
  const isHoliday = (yyyyMmDd) => {
    if (!yyyyMmDd) return false;
    const [, mm, dd] = yyyyMmDd.split('-');
    return fixedHolidays.has(`${mm}-${dd}`);
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        if (!value?.trim()) return 'Le nom complet est requis.';
        return '';
      case 'email':
        if (!value?.trim()) return "L'email est requis.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email invalide.';
        return '';
      case 'phone':
        if (!value?.trim()) return 'Le numéro de téléphone est requis.';
        if (!isValidSenegalPhone(value)) return 'Numéro invalide. Exemple: +221 77 123 45 67 ou 33 8xx xx xx';
        return '';
      case 'appointmentDate':
        if (!value) return 'La date est requise.';
        if (value < today) return `La date ${formatDateFr(value)} doit être aujourd'hui ou ultérieure.`;
        if (isWeekend(value)) return `Les rendez-vous ne sont pas disponibles le week-end (${formatDateFr(value)}).`;
        if (isHoliday(value)) return `Les rendez-vous ne sont pas disponibles les jours fériés (${formatDateFr(value)}).`;
        return '';
      case 'appointmentTime':
        if (!value) return "L'heure du rendez-vous est requise.";
        return '';
      case 'comments':
        return '';
      default:
        return '';
    }
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
    const newErrors = {
      fullName: validateField('fullName', formData.fullName),
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone),
      appointmentDate: validateField('appointmentDate', formData.appointmentDate),
      appointmentTime: validateField('appointmentTime', formData.appointmentTime),
      comments: validateField('comments', formData.comments),
    };
    setErrors(newErrors);
    const hasError = Object.values(newErrors).some(Boolean);
    if (hasError) return;
    setIsSuccessModalOpen(true);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      appointmentDate: '',
      appointmentTime: '',
      comments: ''
    });
  };

  return (
    <>
    <section className="min-h-screen relative flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-3/5 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1600)',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-6 bg-white lg:bg-white">
        <div 
          className="w-full max-w-lg bg-white rounded-xl p-12 shadow-2xl"
          style={{
            boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.12)'
          }}
        >
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'rgba(0, 0, 0, 0.87)' }}>
            Prendre un rendez-vous
          </h2>
          
          <p className="text-base mb-5 leading-relaxed" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
            Vous souhaitez discuter avec un producteur, visiter une ferme ou passer une commande spéciale ?
          </p>
          
          <p className="text-base mb-8 leading-relaxed" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
            Remplissez simplement le formulaire ci-dessous et nous vous recontacterons rapidement.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                style={{ 
                  borderColor: '#EEEEEE',
                  color: 'rgba(0, 0, 0, 0.87)'
                }}
                placeholder="Nom complet"
                required
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                style={{ 
                  borderColor: '#EEEEEE',
                  color: 'rgba(0, 0, 0, 0.87)'
                }}
                placeholder="Boîte de réservation"
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                style={{ 
                  borderColor: '#EEEEEE',
                  color: 'rgba(0, 0, 0, 0.87)'
                }}
                placeholder="Numéro de téléphone"
                required
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <input
                  type="date"
                  id="appointmentDate"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-md text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  style={{ 
                    borderColor: '#EEEEEE',
                    color: 'rgba(0, 0, 0, 0.87)'
                  }}
                  placeholder="Date du rendez-vous"
                  min={today}
                  required
                />
                {errors.appointmentDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.appointmentDate}</p>
                )}
              </div>
              <div>
                <input
                  type="time"
                  id="appointmentTime"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-md text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  style={{ 
                    borderColor: '#EEEEEE',
                    color: 'rgba(0, 0, 0, 0.87)'
                  }}
                  placeholder="Heure du rendez-vous"
                  required
                />
                {errors.appointmentTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.appointmentTime}</p>
                )}
              </div>
            </div>

            <div>
              <textarea
                id="comments"
                name="comments"
                rows="5"
                value={formData.comments}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-vertical"
                style={{ 
                  borderColor: '#EEEEEE',
                  color: 'rgba(0, 0, 0, 0.87)'
                }}
                placeholder="Commentaires"
              ></textarea>
              {errors.comments && (
                <p className="mt-1 text-sm text-red-600">{errors.comments}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-md font-semibold text-lg transition-all duration-200 hover:shadow-lg"
              style={{
                backgroundColor: '#FFC107',
                color: 'rgba(0, 0, 0, 0.87)',
                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#FFD54F';
                e.target.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.15)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#FFC107';
                e.target.style.boxShadow = '0px 2px 5px rgba(0, 0, 0, 0.1)';
              }}
            >
              Envoyer le message
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Background Image */}
      <div 
        className="lg:hidden absolute inset-0 bg-cover bg-center -z-10"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1600)',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
    </section>
    {isSuccessModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h3 className="text-xl font-semibold text-green-800 mb-2">Rendez-vous envoyé</h3>
          <p className="text-gray-700 mb-6">Votre demande de rendez-vous a été envoyée avec succès. Nous vous contacterons rapidement.</p>
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
    </>
  );
};

export default AppointmentForm;