"""
Repository de Consultas
"""

from typing import List, Optional
from datetime import datetime, date
from app.models.consulta import Consulta, StatusConsulta
from app.repositories.base_repository import BaseRepository


class ConsultaRepository(BaseRepository[Consulta]):
    """Repository para operações com Consultas"""
    
    def __init__(self):
        super().__init__("consultas")
    
    def _to_entity(self, data: dict) -> Consulta:
        """Converte dicionário para Consulta"""
        return Consulta.from_dict(data)
    
    def _to_dict(self, entity: Consulta) -> dict:
        """Converte Consulta para dicionário"""
        return entity.to_dict()
    
    def _get_id(self, entity: Consulta) -> str:
        """Retorna o ID da consulta"""
        return entity.id
    
    def _set_id(self, entity: Consulta, entity_id: str):
        """Define o ID da consulta"""
        entity.id = entity_id
    
    async def find_by_paciente(self, paciente_id: str) -> List[Consulta]:
        """Busca consultas de um paciente"""
        await self._load_cache()
        return [c for c in self._cache if c.paciente_id == paciente_id]
    
    async def find_by_medico(self, medico_id: str) -> List[Consulta]:
        """Busca consultas de um médico"""
        await self._load_cache()
        return [c for c in self._cache if c.medico_id == medico_id]
    
    async def find_by_data(self, data: date) -> List[Consulta]:
        """Busca consultas em uma data específica"""
        await self._load_cache()
        return [c for c in self._cache if c.data_hora.date() == data]
    
    async def find_by_periodo(self, data_inicio: datetime, data_fim: datetime) -> List[Consulta]:
        """Busca consultas em um período"""
        await self._load_cache()
        return [
            c for c in self._cache 
            if data_inicio <= c.data_hora <= data_fim
        ]
    
    async def find_by_medico_data(self, medico_id: str, data: date) -> List[Consulta]:
        """Busca consultas de um médico em uma data específica"""
        await self._load_cache()
        return [c for c in self._cache if c.medico_id == medico_id and c.data_hora.date() == data]
    
    async def find_agendadas(self) -> List[Consulta]:
        """Retorna apenas consultas agendadas (não canceladas/realizadas)"""
        await self._load_cache()
        return [c for c in self._cache if c.status == StatusConsulta.AGENDADA]
