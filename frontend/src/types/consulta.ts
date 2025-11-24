export enum StatusConsulta {
  AGENDADA = 'agendada',
  REALIZADA = 'realizada',
  CANCELADA = 'cancelada',
  FALTOU = 'faltou'
}

export interface Consulta {
  id: string
  paciente_id: string
  medico_id: string
  data_hora: string
  duracao_minutos: number
  status: StatusConsulta
  observacoes?: string
}

export interface ConsultaDetalhada extends Consulta {
  paciente_nome?: string
  medico_nome?: string
  medico_especialidade?: string
}

export interface ConsultaCreate {
  paciente_id: string
  medico_id: string
  data_hora: string
  duracao_minutos?: number
  observacoes?: string
}

export interface ConsultaUpdate {
  data_hora?: string
  duracao_minutos?: number
  status?: StatusConsulta
  observacoes?: string
}
