import { useState, useEffect } from 'react';
import { Medico } from '../types/medico.types';
import { medicosService } from '../services/medicos.service';
import toast from 'react-hot-toast';

export const useMedicos = () => {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedicos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await medicosService.getAll();
      setMedicos(data);
    } catch (err) {
      const message = 'Erro ao carregar médicos';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const createMedico = async (data: any) => {
    setLoading(true);
    try {
      const response: any = await medicosService.create(data);
      
      // Response agora inclui { medico, username, senha_temporaria, mensagem }
      const newMedico = response.medico || response;
      setMedicos([...medicos, newMedico]);
      
      toast.success('Médico cadastrado com sucesso!');
      
      // Retorna a resposta completa com credenciais
      return response;
    } catch (err: any) {
      let message = 'Erro ao cadastrar médico';
      
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          message = detail.map((e: any) => {
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

  const updateMedico = async (id: string, data: any) => {
    setLoading(true);
    try {
      const updated = await medicosService.update(id, data);
      setMedicos(medicos.map((m) => (m.id === id ? updated : m)));
      toast.success('Médico atualizado com sucesso!');
      return updated;
    } catch (err: any) {
      let message = 'Erro ao atualizar médico';
      
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          message = detail.map((e: any) => {
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

  const deleteMedico = async (id: string) => {
    if (!confirm('Deseja realmente excluir este médico?')) return;
    
    setLoading(true);
    try {
      await medicosService.delete(id);
      setMedicos(medicos.filter((m) => m.id !== id));
      toast.success('Médico excluído com sucesso!');
    } catch (err: any) {
      let message = 'Erro ao excluir médico';
      
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          message = detail.map((e: any) => {
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
    fetchMedicos();
  }, []);

  return {
    medicos,
    loading,
    error,
    fetchMedicos,
    createMedico,
    updateMedico,
    deleteMedico,
  };
};
