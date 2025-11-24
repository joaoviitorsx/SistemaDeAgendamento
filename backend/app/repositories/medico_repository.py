"""
Repository de Médicos
"""

from typing import List, Optional
from app.models.medico import Medico
from app.repositories.base_repository import BaseRepository


class MedicoRepository(BaseRepository[Medico]):
    """Repository para operações com Médicos"""
    
    def __init__(self):
        super().__init__("medicos")
    
    def _to_entity(self, data: dict) -> Medico:
        """Converte dicionário para Médico"""
        return Medico.from_dict(data)
    
    def _to_dict(self, entity: Medico) -> dict:
        """Converte Médico para dicionário"""
        return entity.to_dict()
    
    def _get_id(self, entity: Medico) -> str:
        """Retorna o ID do médico"""
        return entity.id
    
    def _set_id(self, entity: Medico, entity_id: str):
        """Define o ID do médico"""
        entity.id = entity_id
    
    async def find_by_crm(self, crm: str) -> Optional[Medico]:
        """Busca médico por CRM"""
        await self._load_cache()
        for medico in self._cache:
            if medico.crm == crm:
                return medico
        return None
    
    async def find_by_especialidade(self, especialidade: str) -> List[Medico]:
        """Busca médicos por especialidade"""
        await self._load_cache()
        return [m for m in self._cache if m.especialidade.lower() == especialidade.lower() and m.ativo]
    
    async def find_ativos(self) -> List[Medico]:
        """Retorna apenas médicos ativos"""
        await self._load_cache()
        return [m for m in self._cache if m.ativo]
