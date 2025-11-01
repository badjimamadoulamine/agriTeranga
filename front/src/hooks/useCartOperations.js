import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

export const useCartOperations = () => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (product, showAlert = true) => {
    // Vérifier si l'utilisateur est connecté
    if (!isAuthenticated) {
      // Rediriger vers la page de connexion avec le produit en paramètre
      navigate('/connexion', { 
        state: { 
          redirectTo: `/produit/${product.id}`,
          productName: product.nom 
        } 
      });
      return false;
    }

    // Ajouter le produit au panier
    addToCart(product);
    
    if (showAlert) {
    
    }
    
    return true;
  };

  return {
    handleAddToCart,
    isAuthenticated
  };
};