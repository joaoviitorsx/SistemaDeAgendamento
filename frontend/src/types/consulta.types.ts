export type StatusConsulta = 'agendada' | 'confirmada' | 'realizada' | 'cancelada';

export interface Consulta {
  id: string;
  paciente_id: string;
  medico_id: string;
  data_hora: string;
  status: StatusConsulta;
  observacoes?: string;
  paciente_nome?: string;
  medico_nome?: string;
  especialidade?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ConsultaComDetalhes extends Consulta {
  paciente_nome?: string;
  medico_nome?: string;
  medico_especialidade?: string;
}

export interface CreateConsultaDTO {
  paciente_id: string;
  medico_id: string;
  data_hora: string;
  duracao_minutos?: number;
  observacoes?: string;
}

export interface UpdateConsultaDTO {
  status?: StatusConsulta;
  data_hora?: string;
  observacoes?: string;
}

export interface HorarioDisponivel {
  horario: string;
  disponivel: boolean;
}
