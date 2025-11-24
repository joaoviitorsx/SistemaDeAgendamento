import apiClient from '../api/client';
import { Medico, CreateMedicoDTO, UpdateMedicoDTO } from '../types/medico.types';

export const medicosService = {
  async getAll(): Promise<Medico[]> {
    const response = await apiClient.get<Medico[]>('/medicos');
    return response.data;
  },

  async getById(id: string): Promise<Medico> {
    const response = await apiClient.get<Medico>(`/medicos/${id}`);
    return response.data;
  },

  async create(data: CreateMedicoDTO): Promise<Medico> {
    const response = await apiClient.post<Medico>('/medicos', data);
    return response.data;
  },

  async update(id: string, data: UpdateMedicoDTO): Promise<Medico> {
    const response = await apiClient.put<Medico>(`/medicos/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/medicos/${id}`);
  },
};

export default medicosService;
