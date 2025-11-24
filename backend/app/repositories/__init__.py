"""Repositories - camada de acesso a dados"""

from app.repositories.base_repository import BaseRepository
from app.repositories.paciente_repository import PacienteRepository
from app.repositories.medico_repository import MedicoRepository
from app.repositories.consulta_repository import ConsultaRepository

__all__ = [
    "BaseRepository",
    "PacienteRepository",
    "MedicoRepository",
    "ConsultaRepository",
]
