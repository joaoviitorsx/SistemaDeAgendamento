export interface Paciente {
  id: string
  nome: string
  cpf: string
  data_nascimento: string
  telefone: string
  email: string
  endereco: string
  ativo: boolean
}

export interface PacienteCreate {
  nome: string
  cpf: string
  data_nascimento: string
  telefone: string
  email: string
  endereco: string
}

export interface PacienteUpdate {
  nome?: string
  telefone?: string
  email?: string
  endereco?: string
  ativo?: boolean
}
