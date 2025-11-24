export type UserType = 'paciente' | 'medico' | 'admin';

export interface User {
  id: string;
  nome: string;
  email?: string;
  crm?: string;
  tipo: UserType;
}

export interface LoginCredentials {
  identifier: string; // email ou CRM
  senha: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}
