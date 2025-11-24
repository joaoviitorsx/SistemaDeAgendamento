"""Models - entidades de domínio"""

from app.models.paciente import Paciente
from app.models.medico import Medico
from app.models.consulta import Consulta, StatusConsulta

__all__ = [
    "Paciente",
    "Medico",
    "Consulta",
    "StatusConsulta",
]
