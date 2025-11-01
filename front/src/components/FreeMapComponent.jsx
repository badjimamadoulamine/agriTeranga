import React from 'react';
import { MapPin, Navigation, ExternalLink, Phone, Mail } from 'lucide-react';

// Solution simple sans API - Cartes intégrées dans des iframes
const SimpleMapComponent = ({ location, height = '400px' }) => {
  const openInMaps = (provider) => {
    const coords = `${location.lat},${location.lng}`;
    const address = encodeURIComponent(location.address);
    
    const urls = {
      google: `https://www.google.com/maps/search/?api=1&query=${address}`,
      osm: `https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lng}#map=16/${location.lat}/${location.lng}`,
      apple: `https://maps.apple.com/?q=${address}&ll=${location.lat},${location.lng}`,
      waze: `https://waze.com/ul/hsv=${location.lat},${location.lng}`
    };
    
    window.open(urls[provider], '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Carte intégrée simple */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative">
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng-0.01}%2C${location.lat-0.01}%2C${location.lng+0.01}%2C${location.lat+0.01}&layer=mapnik&marker=${location.lat}%2C${location.lng}`}
            className="w-full border-0"
            style={{ height }}
            title={`Carte de ${location.name}`}
          />
         
        </div>
        
        {/* Actions */}
        <div className="p-4 bg-gray-50 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => openInMaps('google')}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <MapPin className="w-4 h-4" />
              Google Maps
            </button>
            
            <button
              onClick={() => openInMaps('osm')}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              OpenStreetMap
            </button>
            
            <a 
              href={`tel:${location.phone}`}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              <Phone className="w-4 h-4" />
              Appeler
            </a>
            
            <a 
              href={`mailto:${location.email}`}
              className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
            >
              <Mail className="w-4 h-4" />
              Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleMapComponent;