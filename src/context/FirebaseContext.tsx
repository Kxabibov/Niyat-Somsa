import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface FirebaseContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signInError: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [signInError, setSignInError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        setUser(currentUser);
        if (currentUser) {
          // Determine admin status by email first (instant, no Firestore needed)
          const isDefaultAdmin = currentUser.email === 'someoneinteresting808@gmail.com' || currentUser.email === 'admin@niyatsomsa.com';
          setIsAdmin(isDefaultAdmin);

          // Sync user doc with Firestore in the background (non-blocking)
          try {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (userDoc.exists()) {
              setIsAdmin(userDoc.data().role === 'admin' || isDefaultAdmin);
            } else {
              setDoc(doc(db, 'users', currentUser.uid), {
                uid: currentUser.uid,
                email: currentUser.email,
                role: isDefaultAdmin ? 'admin' : 'user'
              }).catch((err) => console.warn('Could not create user profile:', err));
            }
          } catch (err) {
            console.warn('Firestore user lookup failed, using email fallback:', err);
          }
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setSignInError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      // Map Firebase error codes to friendly messages
      const code = err?.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setSignInError('Invalid email or password.');
      } else if (code === 'auth/too-many-requests') {
        setSignInError('Too many failed attempts. Try again later.');
      } else if (code === 'auth/user-disabled') {
        setSignInError('This account has been disabled.');
      } else {
        setSignInError('Sign-in failed: ' + (err?.message || 'Unknown error'));
      }
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    setSignInError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setSignInError(err?.message || 'Google sign-in failed.');
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <FirebaseContext.Provider value={{ user, isAdmin, loading, signInError, login, loginWithGoogle, logout }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
