"""
Modelo de domínio: Consulta
"""

from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Optional


class StatusConsulta(str, Enum):
    """Status possíveis de uma consulta"""
    AGENDADA = "agendada"
    CONFIRMADA = "confirmada"
    REALIZADA = "realizada"
    CANCELADA = "cancelada"
    FALTOU = "faltou"


@dataclass
class Consulta:
    """
    Entidade Consulta
    
    Representa um agendamento de consulta médica
    """
    id: str
    paciente_id: str
    medico_id: str
    data_hora: datetime
    duracao_minutos: int
    status: StatusConsulta
    observacoes: Optional[str] = None
    
    def to_dict(self) -> dict:
        """Converte para dicionário (para serialização)"""
        return {
            "id": self.id,
            "paciente_id": self.paciente_id,
            "medico_id": self.medico_id,
            "data_hora": self.data_hora.isoformat(),
            "duracao_minutos": self.duracao_minutos,
            "status": self.status.value if isinstance(self.status, StatusConsulta) else self.status,
            "observacoes": self.observacoes
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> "Consulta":
        """Cria instância a partir de dicionário"""
        data_hora = data["data_hora"]
        if isinstance(data_hora, str):
            data_hora = datetime.fromisoformat(data_hora)
        
        status = data["status"]
        if isinstance(status, str):
            status = StatusConsulta(status)
        
        return cls(
            id=data["id"],
            paciente_id=data["paciente_id"],
            medico_id=data["medico_id"],
            data_hora=data_hora,
            duracao_minutos=data["duracao_minutos"],
            status=status,
            observacoes=data.get("observacoes")
        )
    
    @property
    def data_hora_fim(self) -> datetime:
        """Calcula o horário de término da consulta"""
        from datetime import timedelta
        return self.data_hora + timedelta(minutes=self.duracao_minutos)
