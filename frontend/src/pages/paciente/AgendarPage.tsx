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
    } catch (err) {
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
    } catch (err) {
      toast.error('Erro ao carregar horários disponíveis');
      setHorarios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMedico = (medico: Medico) => {
    setSelectedMedico(medico);
    setStep(2);
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
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
      
      // Validar se a data não é no passado
      const selectedDateTime = new Date(dataHora);
      const now = new Date();
      
      if (selectedDateTime < now) {
        toast.error('Não é possível agendar consultas no passado. Selecione uma data e hora futuras.');
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
      
      // Redirect após 1.5s
      setTimeout(() => {
        window.location.href = '/paciente/consultas';
      }, 1500);
    } catch (err: any) {
      let message = 'Erro ao agendar consulta';
      
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        // Se for array de erros de validação do Pydantic
        if (Array.isArray(detail)) {
          message = detail.map((e: any) => {
            // Extrair mensagem de erro do Pydantic v2
            if (e.msg) {
              return e.msg.replace('Value error, ', '');
            }
            return e.message || JSON.stringify(e);
          }).join('; ');
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

  // Gerar próximos 14 dias
  const availableDates = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i));

  return (
    <LayoutPaciente>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agendar Consulta</h1>
          <p className="text-gray-600">Escolha o médico, data e horário para sua consulta</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
                {step > 1 ? <CheckCircleIcon className="h-6 w-6" /> : '1'}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">Médico</span>
            </div>

            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div className={`h-full ${step >= 2 ? 'bg-primary' : 'bg-gray-200'} transition-all`} style={{ width: step >= 2 ? '100%' : '0%' }}></div>
            </div>

            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
                {step > 2 ? <CheckCircleIcon className="h-6 w-6" /> : '2'}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">Data</span>
            </div>

            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div className={`h-full ${step >= 3 ? 'bg-primary' : 'bg-gray-200'} transition-all`} style={{ width: step >= 3 ? '100%' : '0%' }}></div>
            </div>

            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">Horário</span>
            </div>
          </div>
        </div>

        {/* Step 1: Escolher Médico */}
        {step === 1 && (
          <div>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Buscar por especialidade..."
                value={searchEspecialidade}
                onChange={(e) => setSearchEspecialidade(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMedicos.map((medico) => (
                  <Card
                    key={medico.id}
                    hover
                    onClick={() => handleSelectMedico(medico)}
                    className="cursor-pointer p-6 border-2 border-transparent hover:border-primary"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Dr(a). {medico.nome}
                    </h3>
                    <p className="text-primary font-medium mb-2">{medico.especialidade}</p>
                    <p className="text-sm text-gray-600">CRM: {medico.crm}</p>
                    {medico.telefone && (
                      <p className="text-sm text-gray-600">{medico.telefone}</p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Escolher Data */}
        {step === 2 && (
          <div>
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
              >
                <ChevronLeftIcon className="h-5 w-5 mr-1" />
                Voltar
              </Button>
            </div>

            {selectedMedico && (
              <Card className="mb-6 p-4 bg-primary-50 border border-primary-200">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Médico selecionado:</span> Dr(a). {selectedMedico.nome} - {selectedMedico.especialidade}
                </p>
              </Card>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {availableDates.map((date) => {
                const isToday = format(date, 'yyyy-MM-dd') === format(startOfToday(), 'yyyy-MM-dd');
                const isSelected = selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                
                return (
                  <Card
                    key={date.toISOString()}
                    hover
                    onClick={() => handleSelectDate(date)}
                    className={`cursor-pointer p-4 text-center border-2 ${
                      isSelected 
                        ? 'border-primary bg-primary-50' 
                        : 'border-transparent'
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
            <div className="mb-6 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
              >
                <ChevronLeftIcon className="h-5 w-5 mr-1" />
                Voltar
              </Button>
            </div>

            {selectedMedico && selectedDate && (
              <Card className="mb-6 p-4 bg-primary-50 border border-primary-200">
                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-medium">Médico:</span> Dr(a). {selectedMedico.nome} - {selectedMedico.especialidade}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Data:</span> {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </Card>
            )}

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : horarios.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-gray-600 mb-4">Nenhum horário disponível para esta data</p>
                <Button onClick={() => setStep(2)}>
                  Escolher Outra Data
                </Button>
              </Card>
            ) : (
              <div>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
                  {horarios.map((horario) => (
                    <button
                      key={horario.horario}
                      onClick={() => handleSelectHorario(horario.horario)}
                      disabled={!horario.disponivel}
                      className={`p-4 rounded-lg border-2 font-medium transition-all ${
                        !horario.disponivel
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          : selectedHorario === horario.horario
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-gray-900 border-gray-300 hover:border-primary'
                      }`}
                    >
                      {horario.horario}
                    </button>
                  ))}
                </div>

                {selectedHorario && (
                  <Card className="p-6">
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
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        loading={loading}
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
