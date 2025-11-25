import React, { useEffect, useState } from 'react';
import { ChevronLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { format, addDays, startOfToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import medicosService from '../../services/medicos.service';
import consultasService from '../../services/consultas.service';
import { Medico } from '../../types/medico.types';
import { HorarioDisponivel } from '../../types/consulta.types';
import { Button, Card } from '../../components/common';
import LayoutPaciente from '../../components/layout/LayoutPaciente';

const STEPS = [
  { label: 'Escolha o Médico', key: 1 },
  { label: 'Escolha a Data', key: 2 },
  { label: 'Escolha o Horário', key: 3 },
];

const AgendarPage: React.FC = () => {
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [horarios, setHorarios] = useState<HorarioDisponivel[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [selectedMedico, setSelectedMedico] = useState<Medico | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHorario, setSelectedHorario] = useState<string | null>(null);
  const [observacoes, setObservacoes] = useState('');
  const [searchEspecialidade, setSearchEspecialidade] = useState('');

  useEffect(() => {
    fetchMedicos();
  }, []);

  const fetchMedicos = async () => {
    try {
      setLoading(true);
      const data = await medicosService.getAll();
      setMedicos(data);
    } catch {
      toast.error('Erro ao carregar médicos');
    } finally {
      setLoading(false);
    }
  };

  const fetchHorarios = async (medicoId: string, data: string) => {
    try {
      setLoading(true);
      const disponibilidade = await consultasService.getHorariosDisponiveis(medicoId, data);
      setHorarios(disponibilidade);
    } catch {
      toast.error('Erro ao carregar horários disponíveis');
      setHorarios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMedico = (medico: Medico) => {
    setSelectedMedico(medico);
    setSelectedDate(null);
    setSelectedHorario(null);
    setStep(2);
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setSelectedHorario(null);
    if (selectedMedico) {
      const dateStr = format(date, 'yyyy-MM-dd');
      fetchHorarios(selectedMedico.id, dateStr);
    }
    setStep(3);
  };

  const handleSelectHorario = (horario: string) => {
    setSelectedHorario(horario);
  };

  const handleSubmit = async () => {
    if (!selectedMedico || !selectedDate || !selectedHorario || !user) {
      toast.error('Preencha todos os campos');
      return;
    }
    try {
      setLoading(true);
      const dataHora = `${format(selectedDate, 'yyyy-MM-dd')}T${selectedHorario}:00`;
      const selectedDateTime = new Date(dataHora);
      if (selectedDateTime < new Date()) {
        toast.error('Não é possível agendar consultas no passado.');
        setLoading(false);
        return;
      }
      await consultasService.create({
        paciente_id: user.id,
        medico_id: selectedMedico.id,
        data_hora: dataHora,
        duracao_minutos: 30,
        observacoes: observacoes || undefined,
      });
      toast.success('Consulta agendada com sucesso!');
      setTimeout(() => {
        window.location.href = '/paciente/consultas';
      }, 1500);
    } catch (err: any) {
      let message = 'Erro ao agendar consulta';
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          message = detail.map((e: any) => e.msg ? e.msg.replace('Value error, ', '') : e.message || JSON.stringify(e)).join('; ');
        } else if (typeof detail === 'string') {
          message = detail;
        }
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const filteredMedicos = medicos.filter(m =>
    !searchEspecialidade ||
    m.especialidade.toLowerCase().includes(searchEspecialidade.toLowerCase())
  );

  const availableDates = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i));

  // UI helpers
  const renderStepHeader = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {STEPS.map((s, idx) => (
          <React.Fragment key={s.key}>
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step > idx ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
                {step > idx + 1 ? <CheckCircleIcon className="h-6 w-6" /> : idx + 1}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">{s.label}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className="flex-1 h-1 mx-4 bg-gray-200">
                <div className={`h-full ${step > idx + 1 ? 'bg-primary' : 'bg-gray-200'} transition-all`} style={{ width: step > idx + 1 ? '100%' : '0%' }}></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderSelectedInfo = () => (
    <div className="flex flex-wrap gap-3 mb-6">
      {selectedMedico && (
        <Card className="p-3 bg-primary-50 border border-primary-200 flex-1 min-w-[220px]">
          <span className="block text-xs text-gray-500 mb-1">Médico selecionado</span>
          <span className="font-semibold text-primary">{selectedMedico.nome}</span>
          <span className="block text-xs text-gray-600">{selectedMedico.especialidade}</span>
        </Card>
      )}
      {selectedDate && (
        <Card className="p-3 bg-primary-50 border border-primary-200 flex-1 min-w-[180px]">
          <span className="block text-xs text-gray-500 mb-1">Data</span>
          <span className="font-semibold text-primary">
            {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </span>
        </Card>
      )}
      {selectedHorario && (
        <Card className="p-3 bg-primary-50 border border-primary-200 flex-1 min-w-[120px]">
          <span className="block text-xs text-gray-500 mb-1">Horário</span>
          <span className="font-semibold text-primary">{selectedHorario}</span>
        </Card>
      )}
    </div>
  );

  return (
    <LayoutPaciente>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Agendar Consulta</h1>
        <p className="text-gray-600 mb-6">Siga os passos para agendar sua consulta médica.</p>
        {renderStepHeader()}
        {renderSelectedInfo()}

        {/* Step 1: Escolher Médico */}
        {step === 1 && (
          <div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar por especialidade ou nome do médico..."
                value={searchEspecialidade}
                onChange={(e) => setSearchEspecialidade(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                aria-label="Buscar médico"
              />
            </div>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMedicos.length === 0 ? (
                  <Card className="text-center py-8">Nenhum médico encontrado.</Card>
                ) : filteredMedicos.map((medico) => (
                  <Card
                    key={medico.id}
                    hover
                    onClick={() => handleSelectMedico(medico)}
                    className="cursor-pointer p-6 border-2 border-transparent hover:border-primary transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-primary-100 rounded-full w-10 h-10 flex items-center justify-center text-primary font-bold text-lg">
                        {medico.nome[0]}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Dr(a). {medico.nome}
                        </h3>
                        <p className="text-primary font-medium">{medico.especialidade}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="block">CRM: {medico.crm}</span>
                      {medico.telefone && <span className="block">Tel: {medico.telefone}</span>}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Escolher Data */}
        {step === 2 && (
          <div>
            <div className="mb-4 flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ChevronLeftIcon className="h-5 w-5 mr-1" />
                Voltar
              </Button>
            </div>
            <div className="mb-2 text-gray-700 font-medium">Selecione a data desejada:</div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {availableDates.map((date) => {
                const isToday = format(date, 'yyyy-MM-dd') === format(startOfToday(), 'yyyy-MM-dd');
                const isSelected = selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                return (
                  <Card
                    key={date.toISOString()}
                    hover
                    onClick={() => handleSelectDate(date)}
                    className={`cursor-pointer p-4 text-center border-2 transition-all ${
                      isSelected
                        ? 'border-primary bg-primary-50'
                        : 'border-transparent hover:border-primary'
                    }`}
                  >
                    <p className="text-xs text-gray-600 mb-1">
                      {format(date, 'EEE', { locale: ptBR })}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {format(date, 'd')}
                    </p>
                    <p className="text-xs text-gray-600">
                      {format(date, 'MMM', { locale: ptBR })}
                    </p>
                    {isToday && (
                      <span className="text-xs text-primary font-medium">Hoje</span>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Escolher Horário */}
        {step === 3 && (
          <div>
            <div className="mb-4 flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ChevronLeftIcon className="h-5 w-5 mr-1" />
                Voltar
              </Button>
            </div>
            <div className="mb-2 text-gray-700 font-medium">Selecione o horário disponível:</div>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : horarios.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-gray-600 mb-4">Nenhum horário disponível para esta data.</p>
                <Button onClick={() => setStep(2)}>
                  Escolher Outra Data
                </Button>
              </Card>
            ) : (
              <div>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
                  {horarios.map((horario) => {
                    const isSelected = selectedHorario === horario.horario;
                    return (
                      <button
                        key={horario.horario}
                        onClick={() => handleSelectHorario(horario.horario)}
                        disabled={!horario.disponivel}
                        className={`p-4 rounded-lg border font-medium transition-all cursor-pointer
                          ${!horario.disponivel
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            : isSelected
                            ? 'bg-primary text-black-400 border-primary shadow-lg ring-1 ring-primary hover:bg-gray-300'
                            : 'bg-white text-primary border-primary-200 hover:bg-primary-50 hover:border-primary'}
                        `}
                        aria-pressed={isSelected}
                        tabIndex={horario.disponivel ? 0 : -1}
                      >
                        {horario.horario}
                      </button>
                    );
                  })}
                </div>
                {selectedHorario && (
                  <Card className="p-6 mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Observações (opcional)
                    </h3>
                    <textarea
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      placeholder="Descreva seus sintomas ou motivo da consulta..."
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <div className="mt-6 flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setStep(2)}
                        disabled={loading}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        loading={loading}
                        disabled={loading}
                      >
                        Confirmar Agendamento
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </LayoutPaciente>
  );
};

export default AgendarPage;
