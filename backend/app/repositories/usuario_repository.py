"""
Repository de Usuários
"""

from typing import List, Optional
from app.models.usuario import Usuario
from app.repositories.base_repository import BaseRepository


class UsuarioRepository(BaseRepository[Usuario]):
    """Repository para operações com Usuários"""
    
    def __init__(self):
        super().__init__("usuarios")
    
    def _to_entity(self, data: dict) -> Usuario:
        """Converte dicionário para Usuario"""
        return Usuario.from_dict(data)
    
    def _to_dict(self, entity: Usuario) -> dict:
        """Converte Usuario para dicionário"""
        return entity.to_dict()
    
    def _get_id(self, entity: Usuario) -> str:
        """Retorna o ID do usuário"""
        return entity.id
    
    def _set_id(self, entity: Usuario, entity_id: str):
        """Define o ID do usuário"""
        entity.id = entity_id
    
    async def find_by_username(self, username: str) -> Optional[Usuario]:
        """Busca usuário por username"""
        await self._load_cache()
        for usuario in self._cache:
            if usuario.username.lower() == username.lower():
                return usuario
        return None
    
    async def find_by_referencia(self, referencia_id: str) -> Optional[Usuario]:
        """Busca usuário por ID de referência (médico/paciente)"""
        await self._load_cache()
        for usuario in self._cache:
            if usuario.referencia_id == referencia_id:
                return usuario
        return None
