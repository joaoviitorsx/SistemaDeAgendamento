import React from 'react';
import LayoutAdmin from '../../components/layout/LayoutAdmin';
import Header from '../../components/layout/Header';
import { Card } from '../../components/common';

const DashboardPage: React.FC = () => {
  const stats = [
    {
      title: 'Consultas Hoje',
      value: '8',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'primary',
    },
    {
      title: 'Total de Pacientes',
      value: '156',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'success',
    },
    {
      title: 'Médicos Ativos',
      value: '12',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'info',
    },
    {
      title: 'Consultas Mês',
      value: '347',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'warning',
    },
  ];

  return (
    <LayoutAdmin>
      <Header
        title="Dashboard"
        subtitle="Visão geral do sistema"
      />

      <div className="p-8 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const colorClasses = {
              primary: 'bg-gradient-to-br from-primary-50 to-primary-100 text-primary-700',
              success: 'bg-gradient-to-br from-success-50 to-success-100 text-success-700',
              info: 'bg-gradient-to-br from-info-50 to-info-100 text-info-700',
              warning: 'bg-gradient-to-br from-warning-50 to-warning-100 text-warning-700',
            };
            return (
              <Card key={index} padding="md" hover className="border border-neutral-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 mb-2 font-semibold uppercase tracking-wide">{stat.title}</p>
                    <p className="text-3xl font-heading font-bold text-neutral-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl shadow-md ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                    {stat.icon}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Consultas de Hoje */}
        <Card className="border border-neutral-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-heading font-bold text-neutral-900">
              Consultas de Hoje
            </h3>
            <span className="text-sm text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-lg font-medium">
              {new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-neutral-200">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wide">
                    Horário
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wide">
                    Paciente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wide">
                    Médico
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wide">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-100">
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-neutral-500 font-medium">Nenhuma consulta agendada para hoje</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Atividades Recentes */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border border-neutral-200">
            <h3 className="text-xl font-heading font-bold text-neutral-900 mb-4">
              Últimos Pacientes Cadastrados
            </h3>
            <div className="space-y-3">
              <div className="text-center py-8">
                <svg className="w-16 h-16 mx-auto mb-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p className="text-neutral-500 font-medium">Nenhum paciente cadastrado recentemente</p>
              </div>
            </div>
          </Card>

          <Card className="border border-neutral-200">
            <h3 className="text-xl font-heading font-bold text-neutral-900 mb-4">
              Atividades Recentes
            </h3>
            <div className="space-y-3">
              <div className="text-center py-8">
                <svg className="w-16 h-16 mx-auto mb-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-neutral-500 font-medium">Nenhuma atividade recente</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default DashboardPage;
