import { useState, useEffect } from 'react';
import { authState$ } from '../state/auth.state';
import { authFacade } from '../facades/auth.facade';
import type { AuthState } from '../models/auth.model';

export const useAuth = () => {
  const [state, setState] = useState<AuthState>(authState$.getValue());

  useEffect(() => {
    const subscription = authState$.subscribe((newState) => {
      setState(newState);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    currentView: state.currentView,
    loading: state.loading,    
    error: state.error,           
    
    login: authFacade.login,
    logout: authFacade.logout,
    setView: authFacade.setView,
    refresh: authFacade.refreshToken 
  };
};