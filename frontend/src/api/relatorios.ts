import apiClient from './client'
import { RelatorioRequest, RelatorioResponse } from '../types/relatorio'

export const relatoriosApi = {
  gerar: async (request: RelatorioRequest): Promise<RelatorioResponse> => {
    const response = await apiClient.post('/relatorios/gerar', request)
    return response.data
  },

  download: (arquivo: string): string => {
    const baseUrl = apiClient.defaults.baseURL?.replace('/api/v1', '') || 'http://localhost:8000'
    return `${baseUrl}/api/v1/relatorios/download/${arquivo}`
  }
}
