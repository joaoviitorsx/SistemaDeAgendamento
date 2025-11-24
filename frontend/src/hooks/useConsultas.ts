import { useState, useEffect } from 'react';
import { Consulta } from '../types/consulta.types';
import { consultasService } from '../services/consultas.service';
import toast from 'react-hot-toast';

export const useConsultas = () => {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConsultas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await consultasService.getAll();
      setConsultas(data);
    } catch (err) {
      const message = 'Erro ao carregar consultas';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const createConsulta = async (data: any) => {
    setLoading(true);
    try {
      const newConsulta = await consultasService.create(data);
      setConsultas([...consultas, newConsulta]);
      toast.success('Consulta agendada com sucesso!');
      return newConsulta;
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
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateConsulta = async (id: string, data: any) => {
    setLoading(true);
    try {
      const updated = await consultasService.update(id, data);
      setConsultas(consultas.map((c) => (c.id === id ? updated : c)));
      toast.success('Consulta atualizada com sucesso!');
      return updated;
    } finally {
      setLoading(false);
    }
  };

  const deleteConsulta = async (id: string) => {
    if (!confirm('Deseja realmente cancelar esta consulta?')) return;
    
    setLoading(true);
    try {
      await consultasService.delete(id);
      setConsultas(consultas.filter((c) => c.id !== id));
      toast.success('Consulta cancelada com sucesso!');
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Erro ao cancelar consulta';
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultas();
  }, []);

  return {
    consultas,
    loading,
    error,
    fetchConsultas,
    createConsulta,
    updateConsulta,
    deleteConsulta,
  };
};
