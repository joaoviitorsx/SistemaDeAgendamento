import { create } from 'zustand';
import { AuthState, LoginCredentials, User } from '../types/auth.types';
import { authApi } from '../api/auth';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await authApi.login({
        username: credentials.identifier,
        senha: credentials.senha,
      });

      console.log('Resposta da API:', response);

      // Mapeia tipo do backend para o frontend
      // Backend retorna em lowercase: "admin", "medico", "paciente"
      const tipoMap: Record<string, 'admin' | 'medico' | 'paciente'> = {
        'admin': 'admin',
        'medico': 'medico',
        'paciente': 'paciente',
        // Fallback para uppercase (caso backend mude)
        'ADMIN': 'admin',
        'MEDICO': 'medico',
        'PACIENTE': 'paciente',
      };

      console.log('Tipo recebido:', response.tipo, 'Tipo mapeado:', tipoMap[response.tipo]);

      const tipoMapeado = tipoMap[response.tipo];
      if (!tipoMapeado) {
        throw new Error(`Tipo de usuário inválido: ${response.tipo}`);
      }

      const user: User = {
        id: response.referencia_id || response.id, // usa referencia_id se disponível, senão user_id
        nome: response.nome || response.username,
        tipo: tipoMapeado,
        ...(tipoMapeado === 'medico' && { crm: response.username }),
        ...(tipoMapeado === 'paciente' && { email: response.username }),
      };

      console.log('Usuário criado:', user);

      // Armazena token simples (Bearer <user_id>:<tipo>)
      const token = `${response.id}:${response.tipo}`;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));

      console.log('User salvo no localStorage:', localStorage.getItem('user'));

      set({
        user,
        isAuthenticated: true,
      });

      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
    });
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },
}));

// Função para verificar se usuário está autenticado ao carregar a página
export const initAuth = () => {
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('auth_token');
  
  if (storedUser && storedToken) {
    const user: User = JSON.parse(storedUser);
    useAuthStore.setState({
      user,
      isAuthenticated: true,
    });
  }
};
