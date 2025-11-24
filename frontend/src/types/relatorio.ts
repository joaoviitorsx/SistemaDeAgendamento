export enum TipoRelatorio {
  POR_PACIENTE = 'por_paciente',
  POR_MEDICO = 'por_medico',
  POR_PERIODO = 'por_periodo',
  GERAL = 'geral'
}

export enum FormatoRelatorio {
  PDF = 'pdf',
  CSV = 'csv',
  EXCEL = 'excel'
}

export interface RelatorioRequest {
  tipo: TipoRelatorio
  formato: FormatoRelatorio
  paciente_id?: string
  medico_id?: string
  data_inicio?: string
  data_fim?: string
}

export interface RelatorioResponse {
  arquivo: string
  caminho: string
  tipo: TipoRelatorio
  formato: FormatoRelatorio
  data_geracao: string
  tamanho_bytes: number
}
