import apiClient from '../api/client';
import { Paciente, CreatePacienteDTO, UpdatePacienteDTO } from '../types/paciente.types';

export const pacientesService = {
  async getAll(): Promise<Paciente[]> {
    const response = await apiClient.get<Paciente[]>('/pacientes');
    return response.data;
  },

  async getById(id: string): Promise<Paciente> {
    const response = await apiClient.get<Paciente>(`/pacientes/${id}`);
    return response.data;
  },

  async create(data: CreatePacienteDTO): Promise<Paciente> {
    const response = await apiClient.post<Paciente>('/pacientes', data);
    return response.data;
  },

  async update(id: string, data: UpdatePacienteDTO): Promise<Paciente> {
    const response = await apiClient.put<Paciente>(`/pacientes/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/pacientes/${id}`);
  },
};

export default pacientesService;
