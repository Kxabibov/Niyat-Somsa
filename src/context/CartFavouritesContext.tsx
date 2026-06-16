import React, { createContext, useContext, useState, useEffect } from 'react';
import { useFirebase } from './FirebaseContext';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface CartItem {
  id: string;
  quantity: number;
}

interface CartFavouritesContextType {
  cart: CartItem[];
  favourites: string[];
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  decrementCartItem: (id: string) => void;
  clearCart: () => void;
  toggleFavourite: (id: string) => void;
  isFavourite: (id: string) => boolean;
}

const CartFavouritesContext = createContext<CartFavouritesContextType | undefined>(undefined);

export const CartFavouritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useFirebase();
  const [cart, setCart] = useState<CartItem[]>(() => {
    const local = localStorage.getItem('niyat_cart');
    return local ? JSON.parse(local) : [];
  });
  const [favourites, setFavourites] = useState<string[]>(() => {
    const local = localStorage.getItem('niyat_favourites');
    return local ? JSON.parse(local) : [];
  });

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('niyat_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('niyat_favourites', JSON.stringify(favourites));
  }, [favourites]);

  // Sync from Firestore when user logs in
  useEffect(() => {
    if (user) {
      const loadUserUserData = async () => {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            if (data.cart) setCart(data.cart);
            if (data.favourites) setFavourites(data.favourites);
          } else {
            // Document doesn't exist, create it with local data
            await setDoc(userDocRef, {
              uid: user.uid,
              email: user.email,
              role: 'user',
              cart,
              favourites,
            });
          }
        } catch (err) {
          console.warn('Error loading user data from Firestore:', err);
        }
      };
      loadUserUserData();
    }
  }, [user]);

  // Sync to Firestore on local state change (only when user is logged in)
  useEffect(() => {
    if (user) {
      const syncUserData = async () => {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          await updateDoc(userDocRef, { cart, favourites });
        } catch (err) {
          console.warn('Error syncing data to Firestore:', err);
        }
      };
      // Debounce sync slightly to avoid rapid calls during quantity changes
      const timeout = setTimeout(syncUserData, 1000);
      return () => clearTimeout(timeout);
    }
  }, [cart, favourites, user]);

  const addToCart = (id: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { id, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const decrementCartItem = (id: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        if (existing.quantity <= 1) {
          return prev.filter((item) => item.id !== id);
        }
        return prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item));
      }
      return prev;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleFavourite = (id: string) => {
    setFavourites((prev) => {
      if (prev.includes(id)) {
        return prev.filter((favId) => favId !== id);
      }
      return [...prev, id];
    });
  };

  const isFavourite = (id: string) => favourites.includes(id);

  return (
    <CartFavouritesContext.Provider
      value={{
        cart,
        favourites,
        addToCart,
        removeFromCart,
        decrementCartItem,
        clearCart,
        toggleFavourite,
        isFavourite,
      }}
    >
      {children}
    </CartFavouritesContext.Provider>
  );
};

export const useCartFavourites = () => {
  const context = useContext(CartFavouritesContext);
  if (context === undefined) {
    throw new Error('useCartFavourites must be used within a CartFavouritesProvider');
  }
  return context;
};
