import React, { useEffect, useState } from 'react';
import { CalendarIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import consultasService from '../../services/consultas.service';
import { Consulta } from '../../types/consulta.types';
import { Button, Card } from '../../components/common';
import LayoutPaciente from '../../components/layout/LayoutPaciente';

const MinhasConsultasPage: React.FC = () => {
  const { user } = useAuthStore();
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'todas' | 'agendadas' | 'realizadas'>('todas');

  useEffect(() => {
    fetchConsultas();
  }, []);

  const fetchConsultas = async () => {
    try {
      setLoading(true);
      const data = await consultasService.getAll();
      // Filtrar apenas consultas do paciente logado
      const minhasConsultas = data.filter(c => c.paciente_id === user?.id);
      setConsultas(minhasConsultas);
    } catch (err: any) {
      toast.error('Erro ao carregar suas consultas');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (id: string) => {
    if (!confirm('Deseja realmente cancelar esta consulta?')) return;

    try {
      await consultasService.update(id, { status: 'cancelada' });
      toast.success('Consulta cancelada com sucesso');
      fetchConsultas();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Erro ao cancelar consulta');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      agendada: 'bg-blue-100 text-blue-800',
      confirmada: 'bg-green-100 text-green-800',
      realizada: 'bg-gray-100 text-gray-800',
      cancelada: 'bg-red-100 text-red-800',
    };

    const labels = {
      agendada: 'Agendada',
      confirmada: 'Confirmada',
      realizada: 'Realizada',
      cancelada: 'Cancelada',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const filteredConsultas = consultas.filter(c => {
    if (filter === 'todas') return true;
    if (filter === 'agendadas') return c.status === 'agendada' || c.status === 'confirmada';
    if (filter === 'realizadas') return c.status === 'realizada' || c.status === 'cancelada';
    return true;
  });

  return (
    <LayoutPaciente>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Minhas Consultas</h1>
          <p className="text-gray-600">Visualize e gerencie suas consultas médicas</p>
        </div>

        {/* Filtros */}
        <div className="flex gap-3 mb-6">
          <Button
            variant={filter === 'todas' ? 'primary' : 'outline'}
            onClick={() => setFilter('todas')}
          >
            Todas
          </Button>
          <Button
            variant={filter === 'agendadas' ? 'primary' : 'outline'}
            onClick={() => setFilter('agendadas')}
          >
            Agendadas
          </Button>
          <Button
            variant={filter === 'realizadas' ? 'primary' : 'outline'}
            onClick={() => setFilter('realizadas')}
          >
            Histórico
          </Button>
        </div>

        {/* Lista de Consultas */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredConsultas.length === 0 ? (
          <Card className="text-center py-12">
            <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhuma consulta encontrada
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'todas' 
                ? 'Você ainda não possui consultas agendadas'
                : filter === 'agendadas'
                ? 'Você não possui consultas agendadas no momento'
                : 'Você ainda não possui histórico de consultas'}
            </p>
            <Button onClick={() => window.location.href = '/paciente/agendar'}>
              Agendar Nova Consulta
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredConsultas.map((consulta) => (
              <Card key={consulta.id} hover className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {/* Cabeçalho */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Dr(a). {consulta.medico_nome || 'Médico'}
                          </h3>
                          {getStatusBadge(consulta.status)}
                        </div>
                        <p className="text-sm text-gray-600">
                          {consulta.especialidade || 'Clínico Geral'}
                        </p>
                      </div>
                    </div>

                    {/* Informações */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <CalendarIcon className="h-5 w-5 text-primary" />
                        <span className="text-sm">
                          {format(new Date(consulta.data_hora), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <ClockIcon className="h-5 w-5 text-primary" />
                        <span className="text-sm">
                          {format(new Date(consulta.data_hora), 'HH:mm')}
                        </span>
                      </div>
                    </div>

                    {/* Observações */}
                    {consulta.observacoes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Observações:</span> {consulta.observacoes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="ml-4">
                    {(consulta.status === 'agendada' || consulta.status === 'confirmada') && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleCancelar(consulta.id)}
                      >
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Botão de Ação Flutuante */}
        {filteredConsultas.length > 0 && (
          <div className="fixed bottom-8 right-8">
            <Button
              size="lg"
              onClick={() => window.location.href = '/paciente/agendar'}
              className="shadow-lg hover:shadow-xl"
            >
              + Nova Consulta
            </Button>
          </div>
        )}
      </div>
    </LayoutPaciente>
  );
};

export default MinhasConsultasPage;
