import React, { useState } from 'react';
import LayoutAdmin from '../../components/layout/LayoutAdmin';
import Header from '../../components/layout/Header';
import { Card, Button, Modal, Input, Table, CredenciaisModal } from '../../components/common';
import { useMedicos } from '../../hooks/useMedicos';
import { Medico } from '../../types/medico.types';

const MedicosPage: React.FC = () => {
  const { medicos, loading, createMedico, updateMedico, deleteMedico } = useMedicos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [credenciaisModalOpen, setCredenciaisModalOpen] = useState(false);
  const [credenciais, setCredenciais] = useState({ nome: '', username: '', senha: '' });
  const [editingMedico, setEditingMedico] = useState<Medico | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    crm: '',
    especialidade: '',
    telefone: '',
    email: '',
  });

  const filteredMedicos = medicos.filter((m) =>
    m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.crm.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.especialidade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (medico?: Medico) => {
    if (medico) {
      setEditingMedico(medico);
      setFormData({
        nome: medico.nome,
        crm: medico.crm,
        especialidade: medico.especialidade,
        telefone: medico.telefone,
        email: medico.email,
      });
    } else {
      setEditingMedico(null);
      setFormData({
        nome: '',
        crm: '',
        especialidade: '',
        telefone: '',
        email: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMedico(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMedico) {
        await updateMedico(editingMedico.id, formData);
      } else {
        const response: any = await createMedico(formData);
        
        // Se a resposta tem credenciais, exibir modal
        if (response.username && response.senha_temporaria) {
          setCredenciais({
            nome: formData.nome,
            username: response.username,
            senha: response.senha_temporaria
          });
          setCredenciaisModalOpen(true);
        }
      }
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar médico:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMedico(id);
    } catch (error) {
      console.error('Erro ao excluir médico:', error);
    }
  };

  const columns = [
    {
      header: 'Nome',
      accessor: 'nome' as keyof Medico,
      className: 'font-semibold text-neutral-900',
    },
    {
      header: 'CRM',
      accessor: 'crm' as keyof Medico,
      className: 'text-neutral-700',
    },
    {
      header: 'Especialidade',
      accessor: 'especialidade' as keyof Medico,
      className: 'text-primary-700 font-medium',
    },
    {
      header: 'Telefone',
      accessor: 'telefone' as keyof Medico,
      className: 'text-neutral-700',
    },
    {
      header: 'Email',
      accessor: 'email' as keyof Medico,
      className: 'text-neutral-600',
    },
    {
      header: 'Ações',
      accessor: (medico: Medico) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleOpenModal(medico);
            }}
          >
            Editar
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleDelete(medico.id);
            }}
          >
            Excluir
          </Button>
        </div>
      ),
    },
  ];

  return (
    <LayoutAdmin>
      <Header
        title="Médicos"
        subtitle="Gerenciamento de médicos do sistema"
        actions={
          <Button onClick={() => handleOpenModal()}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Médico
          </Button>
        }
      />

      <div className="p-8">
        <Card>
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Buscar por nome, CRM ou especialidade..."
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
            data={filteredMedicos}
            columns={columns}
            loading={loading}
            emptyMessage="Nenhum médico encontrado"
          />
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingMedico ? 'Editar Médico' : 'Novo Médico'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome Completo"
            type="text"
            value={formData.nome}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, nome: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="CRM"
              type="text"
              value={formData.crm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, crm: e.target.value })}
              required
            />
            <Input
              label="Especialidade"
              type="text"
              value={formData.especialidade}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, especialidade: e.target.value })}
              required
            />
          </div>

          <Input
            label="Telefone"
            type="tel"
            value={formData.telefone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, telefone: e.target.value })}
            required
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingMedico ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </Modal>

      <CredenciaisModal
        isOpen={credenciaisModalOpen}
        onClose={() => setCredenciaisModalOpen(false)}
        tipo="medico"
        nome={credenciais.nome}
        username={credenciais.username}
        senha={credenciais.senha}
      />
    </LayoutAdmin>
  );
};

export default MedicosPage;
