import apiClient from './client'
import { Consulta, ConsultaDetalhada, ConsultaCreate, ConsultaUpdate } from '../types/consulta'

export const consultasApi = {
  listar: async (
    apenasAgendadas?: boolean,
    pacienteId?: string,
    medicoId?: string
  ): Promise<Consulta[]> => {
    const response = await apiClient.get('/consultas', {
      params: {
        apenas_agendadas: apenasAgendadas,
        paciente_id: pacienteId,
        medico_id: medicoId
      }
    })
    return response.data
  },

  buscar: async (id: string): Promise<ConsultaDetalhada> => {
    const response = await apiClient.get(`/consultas/${id}`)
    return response.data
  },

  criar: async (dados: ConsultaCreate): Promise<Consulta> => {
    const response = await apiClient.post('/consultas', dados)
    return response.data
  },

  atualizar: async (id: string, dados: ConsultaUpdate): Promise<Consulta> => {
    const response = await apiClient.put(`/consultas/${id}`, dados)
    return response.data
  },

  cancelar: async (id: string): Promise<Consulta> => {
    const response = await apiClient.post(`/consultas/${id}/cancelar`)
    return response.data
  },

  deletar: async (id: string): Promise<void> => {
    await apiClient.delete(`/consultas/${id}`)
  }
}
