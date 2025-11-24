import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore, initAuth } from '../store/authStore';
import ProtectedRoute from './ProtectedRoute';

// Auth
import LoginPage from '../pages/auth/LoginPage';

// Paciente
import HomePage from '../pages/paciente/HomePage';
import AgendarPage from '../pages/paciente/AgendarPage';
import MinhasConsultasPage from '../pages/paciente/MinhasConsultasPage';

// Admin
import DashboardPage from '../pages/admin/DashboardPage';
import PacientesPage from '../pages/admin/PacientesPage';
import MedicosPage from '../pages/admin/MedicosPage';
import ConsultasPage from '../pages/admin/ConsultasPage';
import HorariosPage from '../pages/admin/HorariosPage';
import RelatoriosPage from '../pages/admin/RelatoriosPage';

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, []);

  return (
    <Routes>
      {/* Login */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            user?.tipo === 'paciente' ? (
              <Navigate to="/paciente/home" replace />
            ) : (
              <Navigate to="/admin/dashboard" replace />
            )
          ) : (
            <LoginPage />
          )
        }
      />

      {/* Redirect root */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            user?.tipo === 'paciente' ? (
              <Navigate to="/paciente/home" replace />
            ) : (
              <Navigate to="/admin/dashboard" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Rotas do Paciente */}
      <Route
        path="/paciente/home"
        element={
          <ProtectedRoute allowedTypes={['paciente']}>
            <HomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/paciente/consultas"
        element={
          <ProtectedRoute allowedTypes={['paciente']}>
            <MinhasConsultasPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/paciente/agendar"
        element={
          <ProtectedRoute allowedTypes={['paciente']}>
            <AgendarPage />
          </ProtectedRoute>
        }
      />

      {/* Rotas Admin/Médico */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedTypes={['medico', 'admin']}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/pacientes"
        element={
          <ProtectedRoute allowedTypes={['medico', 'admin']}>
            <PacientesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/medicos"
        element={
          <ProtectedRoute allowedTypes={['admin']}>
            <MedicosPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/consultas"
        element={
          <ProtectedRoute allowedTypes={['medico', 'admin']}>
            <ConsultasPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/horarios"
        element={
          <ProtectedRoute allowedTypes={['medico', 'admin']}>
            <HorariosPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/relatorios"
        element={
          <ProtectedRoute allowedTypes={['medico', 'admin']}>
            <RelatoriosPage />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
