import React from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutPaciente from '../../components/layout/LayoutPaciente';
import { Card, Button } from '../../components/common';
import { useAuthStore } from '../../store/authStore';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <LayoutPaciente>
      <div className="space-y-6">
        {/* Boas-vindas */}
        <Card className="border border-neutral-200 bg-gradient-to-br from-white to-primary-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-heading font-bold text-neutral-900">
                Bem-vindo(a), {user?.nome}!
              </h2>
              <p className="text-neutral-600 mt-2 font-medium">
                Gerencie suas consultas médicas de forma prática
              </p>
            </div>
            <div className="hidden md:block">
              <svg className="w-20 h-20 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </Card>

        {/* Ações rápidas */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card hover className="cursor-pointer border border-neutral-200 hover:border-primary-300 transition-all duration-200" onClick={() => navigate('/paciente/agendar')}>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-md">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold text-neutral-900">
                  Agendar Consulta
                </h3>
                <p className="text-neutral-600 text-sm font-medium">
                  Marque uma nova consulta
                </p>
              </div>
            </div>
          </Card>

          <Card hover className="cursor-pointer border border-neutral-200 hover:border-success-300 transition-all duration-200" onClick={() => navigate('/paciente/consultas')}>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-success-500 to-success-600 rounded-xl shadow-md">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold text-neutral-900">
                  Minhas Consultas
                </h3>
                <p className="text-neutral-600 text-sm font-medium">
                  Veja suas consultas agendadas
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Próximas Consultas */}
        <Card className="border border-neutral-200">
          <h3 className="text-xl font-heading font-bold text-neutral-900 mb-6">
            Próximas Consultas
          </h3>
          <div className="text-center py-12">
            <svg className="w-20 h-20 mx-auto mb-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-neutral-600 font-medium mb-4">Você não tem consultas agendadas</p>
            <Button
              variant="outline"
              onClick={() => navigate('/paciente/agendar')}
            >
              Agendar Primeira Consulta
            </Button>
          </div>
        </Card>
      </div>
    </LayoutPaciente>
  );
};

export default HomePage;
