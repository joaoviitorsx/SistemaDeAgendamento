"""
Schemas Pydantic para Consulta
Validação de dados de entrada/saída da API
"""

from pydantic import BaseModel, Field, field_validator
from datetime import datetime, timedelta
from typing import Optional
from app.models.consulta import StatusConsulta


class ConsultaBase(BaseModel):
    """Campos base da consulta"""
    paciente_id: str
    medico_id: str
    data_hora: datetime
    duracao_minutos: int = Field(default=30, ge=15, le=240)
    observacoes: Optional[str] = Field(None, max_length=1000)
    
    @field_validator('data_hora')
    @classmethod
    def validar_data_hora(cls, v):
        """Valida se a data/hora não é no passado (margem de 1 hora)"""
        # Remove timezone info se presente
        now = datetime.now()
        check_time = v.replace(tzinfo=None) if v.tzinfo else v
        
        # Permite margem de 1 hora para evitar problemas de timezone
        if check_time < (now - timedelta(hours=1)):
            raise ValueError('Não é possível agendar consultas no passado')
        return v


class ConsultaCreate(ConsultaBase):
    """Schema para criação de consulta"""
    pass


class ConsultaUpdate(BaseModel):
    """Schema para atualização de consulta"""
    data_hora: Optional[datetime] = None
    duracao_minutos: Optional[int] = Field(None, ge=15, le=240)
    status: Optional[StatusConsulta] = None
    observacoes: Optional[str] = Field(None, max_length=1000)


class ConsultaResponse(ConsultaBase):
    """Schema de resposta básica"""
    id: str
    status: StatusConsulta
    
    class Config:
        from_attributes = True


class ConsultaDetalhada(ConsultaResponse):
    """Schema de resposta com dados completos (join)"""
    paciente_nome: Optional[str] = None
    medico_nome: Optional[str] = None
    medico_especialidade: Optional[str] = None
