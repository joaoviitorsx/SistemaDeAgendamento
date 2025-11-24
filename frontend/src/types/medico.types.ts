export interface Medico {
  id: string;
  nome: string;
  crm: string;
  especialidade: string;
  telefone: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateMedicoDTO {
  nome: string;
  crm: string;
  especialidade: string;
  telefone: string;
  email: string;
}

export interface UpdateMedicoDTO extends Partial<CreateMedicoDTO> {
  id: string;
}
