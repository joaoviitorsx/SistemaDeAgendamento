export interface Medico {
  id: string
  nome: string
  crm: string
  especialidade: string
  telefone: string
  email: string
  ativo: boolean
}

export interface MedicoCreate {
  nome: string
  crm: string
  especialidade: string
  telefone: string
  email: string
}

export interface MedicoUpdate {
  nome?: string
  especialidade?: string
  telefone?: string
  email?: string
  ativo?: boolean
}
