import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

interface LayoutPacienteProps {
  children: React.ReactNode;
}

const LayoutPaciente: React.FC<LayoutPacienteProps> = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const menuItems = [
    {
      path: "/paciente/home",
      label: "Início",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      path: "/paciente/consultas",
      label: "Minhas Consultas",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white">
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-2">
                <svg
                  className="w-8 h-8 text-primary-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" strokeWidth={2.5} />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M8 12h8M12 8v8"
                  />
                </svg>
                <span className="text-2xl font-bold font-heading bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent tracking-tight">
                  Sistema Médico
                </span>
              </div>
              <nav className="hidden md:flex gap-1">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-md font-medium
                        transition-all duration-150
                        ${
                          isActive
                            ? "bg-primary-600 text-white shadow-sm"
                            : "text-neutral-600 hover:text-primary-700 hover:bg-primary-50"
                        }
                      `}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end px-4 py-2">
                <span className="text-sm font-semibold text-neutral-900 truncate max-w-[120px]">
                  {user?.nome}
                </span>
                <span className="text-xs text-primary-600 font-medium">
                  Paciente
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-danger-50 hover:border-danger-200 transition-all duration-150 group cursor-pointer shadow-sm"
                title="Sair"
              >
                <svg
                  className="w-5 h-5 text-neutral-500 group-hover:text-danger-600 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="hidden sm:inline text-danger-700 font-medium">
                  Sair
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default LayoutPaciente;
