import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface SidebarItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const menuItems: SidebarItem[] = [
    {
      path: '/admin/dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      path: '/admin/pacientes',
      label: 'Pacientes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      path: '/admin/medicos',
      label: 'Médicos',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      adminOnly: true,
    },
    {
      path: '/admin/consultas',
      label: 'Consultas',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      path: '/admin/horarios',
      label: 'Horários',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      path: '/admin/relatorios',
      label: 'Relatórios',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  const filteredItems = menuItems.filter(
    (item) => !item.adminOnly || user?.tipo === 'admin'
  );

  return (
    <div className="w-64 bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900 text-white min-h-screen flex flex-col shadow-2xl">
      <div className="p-6 border-b border-neutral-700 bg-gradient-to-br from-primary-600 to-primary-700">
      <h1 className="text-xl font-heading font-bold text-white">
        Sistema Médico
      </h1>
      <p className="text-sm text-primary-100 mt-1 font-medium">{user?.nome}</p>
      </div>

      <nav className="flex-1 py-4 px-2">
      {filteredItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
        <Link
          key={item.path}
          to={item.path}
          className={`
          flex items-center gap-3 px-4 py-3 mb-1 rounded-lg
          transition-all duration-200 font-medium
          ${
            isActive
            ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg scale-[1.02]'
            : 'text-neutral-300 hover:bg-neutral-700 hover:text-white hover:shadow-md'
          }
          `}>
          {item.icon}
          <span>{item.label}</span>
        </Link>
        );
      })}
      </nav>

      <div className="p-4 border-t border-neutral-700 sticky bottom-0 bg-neutral-900 z-10">
      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-danger-600 to-danger-500 hover:from-danger-700 hover:to-danger-600 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl active:scale-[0.98] cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Sair
      </button>
      </div>
    </div>
  );
};

export default Sidebar;
