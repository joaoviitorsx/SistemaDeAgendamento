import apiClient from './client'
import { Paciente, PacienteCreate, PacienteUpdate } from '../types/paciente'

export const pacientesApi = {
  listar: async (apenasAtivos: boolean = true): Promise<Paciente[]> => {
    const response = await apiClient.get('/pacientes', {
      params: { apenas_ativos: apenasAtivos }
    })
    return response.data
  },

  buscar: async (id: string): Promise<Paciente> => {
    const response = await apiClient.get(`/pacientes/${id}`)
    return response.data
  },

  criar: async (dados: PacienteCreate): Promise<Paciente> => {
    const response = await apiClient.post('/pacientes', dados)
    return response.data
  },

  atualizar: async (id: string, dados: PacienteUpdate): Promise<Paciente> => {
    const response = await apiClient.put(`/pacientes/${id}`, dados)
    return response.data
  },

  deletar: async (id: string): Promise<void> => {
    await apiClient.delete(`/pacientes/${id}`)
  }
}
