import React, { useState } from 'react';
import toast from 'react-hot-toast';
import LayoutAdmin from '../../components/layout/LayoutAdmin';
import Header from '../../components/layout/Header';
import { Card, Button, Modal, Input, Table, DateTimePicker } from '../../components/common';
import { useConsultas } from '../../hooks/useConsultas';
import { useMedicos } from '../../hooks/useMedicos';
import { usePacientes } from '../../hooks/usePacientes';
import { Consulta, StatusConsulta } from '../../types/consulta.types';

const ConsultasPage: React.FC = () => {
  const { consultas, loading, createConsulta, updateConsulta, deleteConsulta } = useConsultas();
  const { medicos } = useMedicos();
  const { pacientes } = usePacientes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConsulta, setEditingConsulta] = useState<Consulta | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    paciente_id: '',
    medico_id: '',
    data_hora: '',
    duracao_minutos: 30,
    observacoes: '',
  });

  const filteredConsultas = consultas.filter((c) => {
    const paciente = pacientes.find((p) => p.id === c.paciente_id);
    const medico = medicos.find((m) => m.id === c.medico_id);
    const searchLower = searchTerm.toLowerCase();
    
    return (
      paciente?.nome.toLowerCase().includes(searchLower) ||
      medico?.nome.toLowerCase().includes(searchLower) ||
      c.status.toLowerCase().includes(searchLower)
    );
  });

  const handleOpenModal = (consulta?: Consulta) => {
    if (consulta) {
      setEditingConsulta(consulta);
      const date = new Date(consulta.data_hora);
      setDateValue(date);
      setFormData({
        paciente_id: consulta.paciente_id,
        medico_id: consulta.medico_id,
        data_hora: consulta.data_hora,
        duracao_minutos: 30,
        observacoes: consulta.observacoes || '',
      });
    } else {
      setEditingConsulta(null);
      setDateValue(null);
      setFormData({
        paciente_id: '',
        medico_id: '',
        data_hora: '',
        duracao_minutos: 30,
        observacoes: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingConsulta(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validar se a data não é no passado
      const selectedDateTime = new Date(formData.data_hora);
      const now = new Date();
      
      if (selectedDateTime < now) {
        toast.error('Não é possível agendar consultas no passado. Selecione uma data e hora futuras.');
        return;
      }
      
      // Formatar data_hora para ISO8601 se necessário
      const dataToSend = {
        ...formData,
        data_hora: formData.data_hora.includes('T') 
          ? formData.data_hora + ':00' // Adiciona segundos se não tiver
          : formData.data_hora,
      };
      
      if (editingConsulta) {
        await updateConsulta(editingConsulta.id, dataToSend);
      } else {
        await createConsulta(dataToSend);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar consulta:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteConsulta(id);
    } catch (error) {
      console.error('Erro ao cancelar consulta:', error);
    }
  };

  const handleStatusChange = async (consulta: Consulta, newStatus: StatusConsulta) => {
    try {
      await updateConsulta(consulta.id, { status: newStatus });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const getStatusBadge = (status: StatusConsulta) => {
    const styles = {
      agendada: 'bg-info-100 text-info-800 border border-info-200',
      confirmada: 'bg-success-100 text-success-800 border border-success-200',
      realizada: 'bg-neutral-100 text-neutral-800 border border-neutral-200',
      cancelada: 'bg-danger-100 text-danger-800 border border-danger-200',
    };

    return (
      <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const columns = [
    {
      header: 'Paciente',
      accessor: (consulta: Consulta) => {
        const paciente = pacientes.find((p) => p.id === consulta.paciente_id);
        return paciente?.nome || 'N/A';
      },
      className: 'font-semibold text-neutral-900',
    },
    {
      header: 'Médico',
      accessor: (consulta: Consulta) => {
        const medico = medicos.find((m) => m.id === consulta.medico_id);
        return medico?.nome || 'N/A';
      },
    },
    {
      header: 'Data/Hora',
      accessor: (consulta: Consulta) => {
        const date = new Date(consulta.data_hora);
        return date.toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      },
    },
    {
      header: 'Status',
      accessor: (consulta: Consulta) => getStatusBadge(consulta.status),
    },
    {
      header: 'Ações',
      accessor: (consulta: Consulta) => (
        <div className="flex gap-2">
          {consulta.status === 'agendada' && (
            <Button
              size="sm"
              variant="secondary"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                handleStatusChange(consulta, 'confirmada');
              }}
            >
              Confirmar
            </Button>
          )}
          {consulta.status === 'confirmada' && (
            <Button
              size="sm"
              variant="secondary"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                handleStatusChange(consulta, 'realizada');
              }}
            >
              Finalizar
            </Button>
          )}
          <Button
            size="sm"
            variant="danger"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleDelete(consulta.id);
            }}
          >
            Cancelar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <LayoutAdmin>
      <Header
        title="Consultas"
        subtitle="Gerenciamento de consultas agendadas"
        actions={
          <Button onClick={() => handleOpenModal()}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova Consulta
          </Button>
        }
      />

      <div className="p-8">
        <Card>
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Buscar por paciente, médico ou status..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>

          <Table
            data={filteredConsultas}
            columns={columns}
            loading={loading}
            emptyMessage="Nenhuma consulta encontrada"
          />
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingConsulta ? 'Editar Consulta' : 'Nova Consulta'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              value={formData.paciente_id}
              onChange={(e) => setFormData({ ...formData, paciente_id: e.target.value })}
              required
            >
              <option value="">Selecione um paciente</option>
              {pacientes.map((paciente) => (
                <option key={paciente.id} value={paciente.id}>
                  {paciente.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Médico</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              value={formData.medico_id}
              onChange={(e) => setFormData({ ...formData, medico_id: e.target.value })}
              required
            >
              <option value="">Selecione um médico</option>
              {medicos.map((medico) => (
                <option key={medico.id} value={medico.id}>
                  {medico.nome} - {medico.especialidade}
                </option>
              ))}
            </select>
          </div>

          <DateTimePicker
            label="Data e Hora"
            value={dateValue}
            onChange={(date) => {
              setDateValue(date);
              if (date) {
                const isoString = date.toISOString();
                setFormData({ ...formData, data_hora: isoString.slice(0, 16).replace('T', 'T') });
              } else {
                setFormData({ ...formData, data_hora: '' });
              }
            }}
            minDate={new Date()}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              rows={3}
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Observações adicionais (opcional)"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingConsulta ? 'Atualizar' : 'Agendar'}
            </Button>
          </div>
        </form>
      </Modal>
    </LayoutAdmin>
  );
};

export default ConsultasPage;
