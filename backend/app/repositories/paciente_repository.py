"""
Repository de Pacientes
"""

from typing import List, Optional
from app.models.paciente import Paciente
from app.repositories.base_repository import BaseRepository


class PacienteRepository(BaseRepository[Paciente]):
    """Repository para operações com Pacientes"""
    
    def __init__(self):
        super().__init__("pacientes")
    
    def _to_entity(self, data: dict) -> Paciente:
        """Converte dicionário para Paciente"""
        return Paciente.from_dict(data)
    
    def _to_dict(self, entity: Paciente) -> dict:
        """Converte Paciente para dicionário"""
        return entity.to_dict()
    
    def _get_id(self, entity: Paciente) -> str:
        """Retorna o ID do paciente"""
        return entity.id
    
    def _set_id(self, entity: Paciente, entity_id: str):
        """Define o ID do paciente"""
        entity.id = entity_id
    
    async def find_by_cpf(self, cpf: str) -> Optional[Paciente]:
        """Busca paciente por CPF"""
        await self._load_cache()
        for paciente in self._cache:
            if paciente.cpf == cpf:
                return paciente
        return None
    
    async def find_ativos(self) -> List[Paciente]:
        """Retorna apenas pacientes ativos"""
        await self._load_cache()
        return [p for p in self._cache if p.ativo]
