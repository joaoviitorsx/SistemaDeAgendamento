import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { UserType } from '../types/auth.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedTypes: UserType[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedTypes }) => {
  const { isAuthenticated, user } = useAuthStore();

  console.log('ProtectedRoute:', { isAuthenticated, user, allowedTypes });

  if (!isAuthenticated || !user) {
    console.log('Não autenticado, redirecionando para /login');
    return <Navigate to="/login" replace />;
  }

  if (!allowedTypes.includes(user.tipo)) {
    console.log(`Tipo ${user.tipo} não permitido em ${allowedTypes}, redirecionando`);
    // Redireciona para a página apropriada do usuário
    if (user.tipo === 'paciente') {
      return <Navigate to="/paciente/home" replace />;
    } else {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  console.log('Acesso permitido, renderizando children');
  return <>{children}</>;
};

export default ProtectedRoute;
