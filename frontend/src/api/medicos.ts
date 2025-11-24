import apiClient from './client'
import { Medico, MedicoCreate, MedicoUpdate } from '../types/medico'

export const medicosApi = {
  listar: async (apenasAtivos: boolean = true, especialidade?: string): Promise<Medico[]> => {
    const response = await apiClient.get('/medicos', {
      params: { 
        apenas_ativos: apenasAtivos,
        especialidade 
      }
    })
    return response.data
  },

  buscar: async (id: string): Promise<Medico> => {
    const response = await apiClient.get(`/medicos/${id}`)
    return response.data
  },

  criar: async (dados: MedicoCreate): Promise<Medico> => {
    const response = await apiClient.post('/medicos', dados)
    return response.data
  },

  atualizar: async (id: string, dados: MedicoUpdate): Promise<Medico> => {
    const response = await apiClient.put(`/medicos/${id}`, dados)
    return response.data
  },

  deletar: async (id: string): Promise<void> => {
    await apiClient.delete(`/medicos/${id}`)
  }
}
