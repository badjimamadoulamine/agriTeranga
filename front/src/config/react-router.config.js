// Configuration des future flags de React Router v7
// Pour éliminer les warnings de dépréciation

import React from 'react';

// Configuration des future flags pour React Router v7
export const reactRouterConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
};

// Fonction pour obtenir la configuration
export const getReactRouterConfig = () => {
  return reactRouterConfig;
};

// Hook pour appliquer la configuration au démarrage de l'app
export const useReactRouterConfig = () => {
  React.useEffect(() => {
    console.log('✅ React Router v7 future flags configurés');
    console.log('   - v7_startTransition: true');
    console.log('   - v7_relativeSplatPath: true');
  }, []);
};