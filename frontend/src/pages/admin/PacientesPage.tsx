import React, { useState } from 'react';
import LayoutAdmin from '../../components/layout/LayoutAdmin';
import Header from '../../components/layout/Header';
import { Card, Button, Modal, Input, Table, CredenciaisModal } from '../../components/common';
import { usePacientes } from '../../hooks/usePacientes';
import { Paciente } from '../../types/paciente.types';

const PacientesPage: React.FC = () => {
  const { pacientes, loading, createPaciente, updatePaciente, deletePaciente } = usePacientes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [credenciaisModalOpen, setCredenciaisModalOpen] = useState(false);
  const [credenciais, setCredenciais] = useState({ nome: '', username: '', senha: '' });
  const [editingPaciente, setEditingPaciente] = useState<Paciente | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    data_nascimento: '',
    telefone: '',
    email: '',
    endereco: {
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
    },
  });

  const filteredPacientes = pacientes.filter((p) =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.cpf.includes(searchTerm) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (paciente?: Paciente) => {
    if (paciente) {
      setEditingPaciente(paciente);
      setFormData({
        nome: paciente.nome,
        cpf: paciente.cpf,
        data_nascimento: paciente.data_nascimento,
        telefone: paciente.telefone,
        email: paciente.email,
        endereco: paciente.endereco,
      });
    } else {
      setEditingPaciente(null);
      setFormData({
        nome: '',
        cpf: '',
        data_nascimento: '',
        telefone: '',
        email: '',
        endereco: {
          rua: '',
          numero: '',
          bairro: '',
          cidade: '',
          estado: '',
          cep: '',
        },
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPaciente(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPaciente) {
        await updatePaciente(editingPaciente.id, formData);
      } else {
        const response: any = await createPaciente(formData);
        
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
      console.error('Erro ao salvar paciente:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePaciente(id);
    } catch (error) {
      console.error('Erro ao excluir paciente:', error);
    }
  };

  const columns = [
    {
      header: 'Nome',
      accessor: 'nome' as keyof Paciente,
      className: 'font-semibold text-neutral-900',
    },
    {
      header: 'CPF',
      accessor: 'cpf' as keyof Paciente,
    },
    {
      header: 'Telefone',
      accessor: 'telefone' as keyof Paciente,
    },
    {
      header: 'Email',
      accessor: 'email' as keyof Paciente,
      className: 'text-neutral-600',
    },
    {
      header: 'Ações',
      accessor: (paciente: Paciente) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleOpenModal(paciente);
            }}
          >
            Editar
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleDelete(paciente.id);
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
        title="Pacientes"
        subtitle="Gerenciamento de pacientes cadastrados"
        actions={
          <Button onClick={() => handleOpenModal()}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Paciente
          </Button>
        }
      />

      <div className="p-8">
        <Card>
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Buscar por nome, CPF ou email..."
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
            data={filteredPacientes}
            columns={columns}
            loading={loading}
            emptyMessage="Nenhum paciente encontrado"
          />
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPaciente ? 'Editar Paciente' : 'Novo Paciente'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nome Completo"
              type="text"
              value={formData.nome}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, nome: e.target.value })}
              required
            />
            <Input
              label="CPF"
              type="text"
              value={formData.cpf}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, cpf: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Data de Nascimento"
              type="date"
              value={formData.data_nascimento}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, data_nascimento: e.target.value })}
              required
            />
            <Input
              label="Telefone"
              type="tel"
              value={formData.telefone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, telefone: e.target.value })}
              required
            />
          </div>

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <div className="border-t pt-4 mt-4">
            <h4 className="font-semibold mb-3 text-gray-900">Endereço</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Input
                    label="Rua"
                    type="text"
                    value={formData.endereco.rua}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, endereco: { ...formData.endereco, rua: e.target.value } })
                    }
                    required
                  />
                </div>
                <Input
                  label="Número"
                  type="text"
                  value={formData.endereco.numero}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, endereco: { ...formData.endereco, numero: e.target.value } })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Bairro"
                  type="text"
                  value={formData.endereco.bairro}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, endereco: { ...formData.endereco, bairro: e.target.value } })
                  }
                  required
                />
                <Input
                  label="CEP"
                  type="text"
                  value={formData.endereco.cep}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, endereco: { ...formData.endereco, cep: e.target.value } })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Cidade"
                  type="text"
                  value={formData.endereco.cidade}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, endereco: { ...formData.endereco, cidade: e.target.value } })
                  }
                  required
                />
                <Input
                  label="Estado"
                  type="text"
                  value={formData.endereco.estado}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, endereco: { ...formData.endereco, estado: e.target.value } })
                  }
                  required
                  maxLength={2}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingPaciente ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </Modal>

      <CredenciaisModal
        isOpen={credenciaisModalOpen}
        onClose={() => setCredenciaisModalOpen(false)}
        tipo="paciente"
        nome={credenciais.nome}
        username={credenciais.username}
        senha={credenciais.senha}
      />
    </LayoutAdmin>
  );
};

export default PacientesPage;
