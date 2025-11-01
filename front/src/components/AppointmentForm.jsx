import { useState } from 'react';

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    appointmentTime: '',
    comments: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Appointment submitted:', formData);
    // Handle form submission
  };

  return (
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
            </div>

            <div className="grid grid-cols-2 gap-5">
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
  );
};

export default AppointmentForm;