import React, { useEffect, useState } from 'react';
import { CalendarIcon, ClockIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import medicosService from '../../services/medicos.service';
import { Medico } from '../../types/medico.types';
import { Button, Card, Modal } from '../../components/common';
import LayoutAdmin from '../../components/layout/LayoutAdmin';

interface HorarioConfig {
  id: string;
  medico_id: string;
  dia_semana: number; // 0-6 (domingo-sábado)
  horario_inicio: string;
  horario_fim: string;
  duracao_consulta: number; // em minutos
}

const HorariosPage: React.FC = () => {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [selectedMedico, setSelectedMedico] = useState<Medico | null>(null);
  const [horarios, setHorarios] = useState<HorarioConfig[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    dia_semana: 1,
    horario_inicio: '08:00',
    horario_fim: '18:00',
    duracao_consulta: 30,
  });

  const diasSemana = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];

  useEffect(() => {
    fetchMedicos();
  }, []);

  const fetchMedicos = async () => {
    try {
      setLoading(true);
      const data = await medicosService.getAll();
      setMedicos(data);
      if (data.length > 0 && !selectedMedico) {
        setSelectedMedico(data[0]);
      }
    } catch (err) {
      toast.error('Erro ao carregar médicos');
    } finally {
      setLoading(false);
    }
  };

  const fetchHorarios = async (medicoId: string) => {
    try {
      setLoading(true);
      // TODO: Implementar endpoint no backend
      // const data = await horariosService.getByMedico(medicoId);
      // setHorarios(data);
      
      // Mock data temporário
      setHorarios([
        {
          id: '1',
          medico_id: medicoId,
          dia_semana: 1,
          horario_inicio: '08:00',
          horario_fim: '12:00',
          duracao_consulta: 30,
        },
        {
          id: '2',
          medico_id: medicoId,
          dia_semana: 1,
          horario_inicio: '14:00',
          horario_fim: '18:00',
          duracao_consulta: 30,
        },
        {
          id: '3',
          medico_id: medicoId,
          dia_semana: 3,
          horario_inicio: '08:00',
          horario_fim: '17:00',
          duracao_consulta: 30,
        },
      ]);
    } catch (err) {
      toast.error('Erro ao carregar horários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMedico) {
      fetchHorarios(selectedMedico.id);
    }
  }, [selectedMedico]);

  const handleCreate = async () => {
    if (!selectedMedico) {
      toast.error('Selecione um médico');
      return;
    }

    try {
      setLoading(true);
      // TODO: Implementar endpoint no backend
      // await horariosService.create({
      //   medico_id: selectedMedico.id,
      //   ...formData,
      // });

      // Simulação temporária
      const newHorario: HorarioConfig = {
        id: String(Date.now()),
        medico_id: selectedMedico.id,
        ...formData,
      };
      setHorarios([...horarios, newHorario]);

      toast.success('Horário criado com sucesso');
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Erro ao criar horário');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este horário?')) return;

    try {
      setLoading(true);
      // TODO: Implementar endpoint no backend
      // await horariosService.delete(id);

      setHorarios(horarios.filter(h => h.id !== id));
      toast.success('Horário excluído com sucesso');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Erro ao excluir horário');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      dia_semana: 1,
      horario_inicio: '08:00',
      horario_fim: '18:00',
      duracao_consulta: 30,
    });
  };

  const generateTimeSlots = (inicio: string, fim: string, duracao: number) => {
    const slots: string[] = [];
    const [horaInicio, minInicio] = inicio.split(':').map(Number);
    const [horaFim, minFim] = fim.split(':').map(Number);
    
    let currentMin = horaInicio * 60 + minInicio;
    const endMin = horaFim * 60 + minFim;
    
    while (currentMin < endMin) {
      const h = Math.floor(currentMin / 60);
      const m = currentMin % 60;
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      currentMin += duracao;
    }
    
    return slots;
  };

  // Agrupar horários por dia da semana
  const horariosPorDia = horarios.reduce((acc, horario) => {
    if (!acc[horario.dia_semana]) {
      acc[horario.dia_semana] = [];
    }
    acc[horario.dia_semana].push(horario);
    return acc;
  }, {} as Record<number, HorarioConfig[]>);

  return (
    <LayoutAdmin>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciar Horários</h1>
            <p className="text-gray-600">Configure os horários de atendimento dos médicos</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Horário
          </Button>
        </div>

        {/* Seleção de Médico */}
        <Card className="mb-6 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Médico
          </label>
          <select
            value={selectedMedico?.id || ''}
            onChange={(e) => {
              const medico = medicos.find(m => m.id === e.target.value);
              setSelectedMedico(medico || null);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Selecione um médico</option>
            {medicos.map((medico) => (
              <option key={medico.id} value={medico.id}>
                Dr(a). {medico.nome} - {medico.especialidade}
              </option>
            ))}
          </select>
        </Card>

        {/* Grade de Horários */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : !selectedMedico ? (
          <Card className="text-center py-12">
            <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Selecione um médico para gerenciar os horários</p>
          </Card>
        ) : horarios.length === 0 ? (
          <Card className="text-center py-12">
            <ClockIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum horário configurado
            </h3>
            <p className="text-gray-600 mb-6">
              Configure os horários de atendimento para este médico
            </p>
            <Button onClick={() => setIsModalOpen(true)}>
              Adicionar Primeiro Horário
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {diasSemana.map((dia, index) => {
              const horariosdia = horariosPorDia[index] || [];
              
              if (horariosdia.length === 0) return null;

              return (
                <Card key={index} className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {dia}
                  </h3>
                  
                  <div className="space-y-4">
                    {horariosdia.map((horario) => {
                      const slots = generateTimeSlots(
                        horario.horario_inicio,
                        horario.horario_fim,
                        horario.duracao_consulta
                      );

                      return (
                        <div
                          key={horario.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-medium text-gray-900">
                                {horario.horario_inicio} - {horario.horario_fim}
                              </p>
                              <p className="text-sm text-gray-600">
                                Consultas de {horario.duracao_consulta} minutos
                              </p>
                            </div>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(horario.id)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {slots.map((slot) => (
                              <span
                                key={slot}
                                className="px-3 py-1 bg-primary-50 text-primary-700 rounded-md text-sm font-medium"
                              >
                                {slot}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Modal de Criação */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title="Novo Horário de Atendimento"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dia da Semana
              </label>
              <select
                value={formData.dia_semana}
                onChange={(e) => setFormData({ ...formData, dia_semana: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {diasSemana.map((dia, index) => (
                  <option key={index} value={index}>
                    {dia}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horário Início
                </label>
                <input
                  type="time"
                  value={formData.horario_inicio}
                  onChange={(e) => setFormData({ ...formData, horario_inicio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horário Fim
                </label>
                <input
                  type="time"
                  value={formData.horario_fim}
                  onChange={(e) => setFormData({ ...formData, horario_fim: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duração da Consulta (minutos)
              </label>
              <select
                value={formData.duracao_consulta}
                onChange={(e) => setFormData({ ...formData, duracao_consulta: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value={15}>15 minutos</option>
                <option value={30}>30 minutos</option>
                <option value={45}>45 minutos</option>
                <option value={60}>60 minutos</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreate} loading={loading}>
                Criar Horário
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </LayoutAdmin>
  );
};

export default HorariosPage;
