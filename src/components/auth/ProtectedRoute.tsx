import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Componente de Ordem Superior (HOC) para proteger rotas privadas.
 */
export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  // Enquanto o estado está sendo carregado do localStorage/RxJS
  if (loading) return null; 

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};