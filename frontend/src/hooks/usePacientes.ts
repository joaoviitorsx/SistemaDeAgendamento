import { useState, useEffect } from 'react';
import { Paciente } from '../types/paciente.types';
import { pacientesService } from '../services/pacientes.service';
import toast from 'react-hot-toast';

export const usePacientes = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPacientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pacientesService.getAll();
      setPacientes(data);
    } catch (err) {
      const message = 'Erro ao carregar pacientes';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const createPaciente = async (data: any) => {
    setLoading(true);
    try {
      const response: any = await pacientesService.create(data);
      
      // Response agora inclui { paciente, username, senha_temporaria, mensagem }
      const newPaciente = response.paciente || response;
      setPacientes([...pacientes, newPaciente]);
      
      toast.success('Paciente cadastrado com sucesso!');
      
      // Retorna a resposta completa com credenciais
      return response;
    } catch (err: any) {
      let message = 'Erro ao cadastrar paciente';
      
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
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePaciente = async (id: string, data: any) => {
    setLoading(true);
    try {
      const updated = await pacientesService.update(id, data);
      setPacientes(pacientes.map((p) => (p.id === id ? updated : p)));
      toast.success('Paciente atualizado com sucesso!');
      return updated;
    } catch (err: any) {
      let message = 'Erro ao atualizar paciente';
      
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
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePaciente = async (id: string) => {
    if (!confirm('Deseja realmente excluir este paciente?')) return;
    
    setLoading(true);
    try {
      await pacientesService.delete(id);
      setPacientes(pacientes.filter((p) => p.id !== id));
      toast.success('Paciente excluído com sucesso!');
    } catch (err: any) {
      let message = 'Erro ao excluir paciente';
      
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
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  return {
    pacientes,
    loading,
    error,
    fetchPacientes,
    createPaciente,
    updatePaciente,
    deletePaciente,
  };
};
