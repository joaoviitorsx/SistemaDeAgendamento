import apiClient from '../api/client';
import { Consulta, CreateConsultaDTO, UpdateConsultaDTO, HorarioDisponivel } from '../types/consulta.types';

export const consultasService = {
  async getAll(): Promise<Consulta[]> {
    const response = await apiClient.get<Consulta[]>('/consultas');
    return response.data;
  },

  async getById(id: string): Promise<Consulta> {
    const response = await apiClient.get<Consulta>(`/consultas/${id}`);
    return response.data;
  },

  async create(data: CreateConsultaDTO): Promise<Consulta> {
    const response = await apiClient.post<Consulta>('/consultas', data);
    return response.data;
  },

  async update(id: string, data: UpdateConsultaDTO): Promise<Consulta> {
    const response = await apiClient.put<Consulta>(`/consultas/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/consultas/${id}`);
  },

  async getHorariosDisponiveis(medicoId: string, data: string): Promise<HorarioDisponivel[]> {
    const response = await apiClient.get<string[]>(
      `/consultas/horarios-disponiveis/${medicoId}/${data}`
    );
    // Converte array de strings para array de objetos HorarioDisponivel
    return response.data.map(horario => ({
      horario,
      disponivel: true
    }));
  },
};

export default consultasService;
