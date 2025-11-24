import { apiClient } from './client';

export interface LoginRequest {
  username: string;
  senha: string;
}

export interface LoginResponse {
  id: string;
  username: string;
  tipo: 'ADMIN' | 'MEDICO' | 'PACIENTE';
  referencia_id?: string;
  nome?: string;
}

export interface AlterarSenhaRequest {
  senha_atual: string;
  senha_nova: string;
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  alterarSenha: async (dados: AlterarSenhaRequest): Promise<void> => {
    await apiClient.post('/auth/alterar-senha', dados);
  },
};
