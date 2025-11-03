import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import apiService from '../services/apiService';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart doit être utilisé dans un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const { user, isAuthenticated } = useAuth();

  const mapServerCartToClient = (cart) => {
    if (!cart || !Array.isArray(cart.items)) return [];
    return cart.items.map((it) => {
      const p = it.product || {};
      return {
        id: p._id || p.id,
        nom: p.name,
        name: p.name,
        prix: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
        price: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
        unite: p.unit,
        unit: p.unit,
        quantity: it.quantity || 1,
        image: Array.isArray(p.images) && p.images[0] ? p.images[0] : (p.imageUrl || p.image)
      };
    });
  };

  // Charger le panier: depuis l'API si authentifié, sinon localStorage
  useEffect(() => {
    const load = async () => {
      if (isAuthenticated) {
        try {
          const resp = await apiService.getCart();
          const payload = resp || {};
          const cart = (payload.data && (payload.data.cart || payload.data)) || payload.cart;
          const items = mapServerCartToClient(cart);
          setCartItems(items);
        } catch (e) {
          // fallback local si erreur API
          const saved = localStorage.getItem('cart');
          if (saved) {
            try { setCartItems(JSON.parse(saved)); } catch { setCartItems([]); }
          }
        }
      } else {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            setCartItems(parsedCart);
          } catch {
            localStorage.removeItem('cart');
          }
        } else {
          setCartItems([]);
        }
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id]);

  // Mettre à jour le cartCount et sauvegarder à chaque changement de cartItems
  useEffect(() => {
    const totalCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
    setCartCount(totalCount);
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (product) => {
    if (isAuthenticated) {
      try {
        const productId = product._id || product.id;
        const resp = await apiService.addToCart(productId, 1);
        const payload = resp || {};
        const cart = (payload.data && (payload.data.cart || payload.data)) || payload.cart;
        setCartItems(mapServerCartToClient(cart));
        return;
      } catch (e) {
        // si échec API, on tombe sur la logique locale
      }
    }
    // Local fallback (invités ou erreur API)
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === (product._id || product.id));
      if (existingItem) {
        return prevItems.map(item =>
          item.id === (product._id || product.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { 
          ...product, 
          id: product._id || product.id,
          nom: product.nom || product.name,
          prix: product.prix ?? product.price,
          unite: product.unite ?? product.unit,
          quantity: 1,
          addedAt: new Date().toISOString()
        }];
      }
    });
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        await apiService.removeFromCart(productId);
        const resp = await apiService.getCart();
        const payload = resp || {};
        const cart = (payload.data && (payload.data.cart || payload.data)) || payload.cart;
        setCartItems(mapServerCartToClient(cart));
        return;
      } catch {}
    }
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    if (isAuthenticated) {
      try {
        await apiService.updateCartItem(productId, newQuantity);
        const resp = await apiService.getCart();
        const payload = resp || {};
        const cart = (payload.data && (payload.data.cart || payload.data)) || payload.cart;
        setCartItems(mapServerCartToClient(cart));
        return;
      } catch {}
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await apiService.clearCart();
        setCartItems([]);
        return;
      } catch {}
    }
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + ((item.prix ?? item.price ?? 0) * (item.quantity || 1)), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getCartItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};