"""
Schemas para geração de relatórios
"""

from pydantic import BaseModel, Field
from datetime import datetime, date
from typing import Optional
from enum import Enum


class TipoRelatorio(str, Enum):
    """Tipos de relatório disponíveis"""
    POR_PACIENTE = "por_paciente"
    POR_MEDICO = "por_medico"
    POR_PERIODO = "por_periodo"
    GERAL = "geral"


class FormatoRelatorio(str, Enum):
    """Formatos de saída do relatório"""
    PDF = "pdf"
    CSV = "csv"
    EXCEL = "excel"


class RelatorioRequest(BaseModel):
    """Request para geração de relatório"""
    tipo: TipoRelatorio
    formato: FormatoRelatorio = FormatoRelatorio.PDF
    
    # Filtros opcionais
    paciente_id: Optional[str] = None
    medico_id: Optional[str] = None
    data_inicio: Optional[date] = None
    data_fim: Optional[date] = None
    
    def validate_filters(self):
        """Valida se os filtros necessários foram fornecidos"""
        if self.tipo == TipoRelatorio.POR_PACIENTE and not self.paciente_id:
            raise ValueError("paciente_id é obrigatório para relatório por paciente")
        if self.tipo == TipoRelatorio.POR_MEDICO and not self.medico_id:
            raise ValueError("medico_id é obrigatório para relatório por médico")
        if self.tipo == TipoRelatorio.POR_PERIODO:
            if not self.data_inicio or not self.data_fim:
                raise ValueError("data_inicio e data_fim são obrigatórios para relatório por período")


class RelatorioResponse(BaseModel):
    """Resposta da geração de relatório"""
    arquivo: str  # Nome do arquivo gerado
    caminho: str  # Caminho completo do arquivo
    tipo: TipoRelatorio
    formato: FormatoRelatorio
    data_geracao: datetime
    tamanho_bytes: int
    
    class Config:
        from_attributes = True
