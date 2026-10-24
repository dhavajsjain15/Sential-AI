'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { subscribeToAuthChanges, loginWithEmail, signupWithEmail, logoutUser } from './auth';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<{ error: string | null }>;
  signOutUser: () => Promise<void>;
  isDemoMode: boolean;
  setDemoMode: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithEmail: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null }),
  signOutUser: async () => {},
  isDemoMode: true,
  setDemoMode: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setDemoMode] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    const res = await loginWithEmail(email, pass);
    return { error: res.error };
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const res = await signupWithEmail(email, pass, name);
    return { error: res.error };
  };

  const signOutUser = async () => {
    await logoutUser();
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithEmail, signUpWithEmail, signOutUser, isDemoMode, setDemoMode }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
