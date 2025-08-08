import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { User, AuthState } from '../types/auth.types';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setAuthState({
        user: session?.user ? mapSupabaseUser(session.user) : null,
        isLoading: false,
        isAuthenticated: !!session?.user,
      });
    };

    getInitialSession();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState({
          user: session?.user ? mapSupabaseUser(session.user) : null,
          isLoading: false,
          isAuthenticated: !!session?.user,
        });
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const mapSupabaseUser = (user: any): User => ({
    id: user.id,
    email: user.email,
    name: user.user_metadata?.name || user.email,
    role: user.user_metadata?.role || 'teacher',
    avatar: user.user_metadata?.avatar,
    createdAt: user.created_at,
  });

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return {
    ...authState,
    login,
    logout,
  };
};