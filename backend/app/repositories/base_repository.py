"""
Repository base - classe abstrata para operações CRUD

Conceitos de SO:
- Abstração de I/O
- Operações assíncronas
"""

from abc import ABC, abstractmethod
from typing import List, Optional, TypeVar, Generic
from uuid import uuid4

from app.infra.storage import get_storage
from app.infra.logger import get_logger

T = TypeVar('T')
logger = get_logger(__name__)


class BaseRepository(ABC, Generic[T]):
    """
    Repository base genérico
    Implementa operações CRUD básicas
    """
    
    def __init__(self, entity_type: str):
        """
        Args:
            entity_type: Nome da entidade (usado como nome do arquivo)
        """
        self.entity_type = entity_type
        self.storage = get_storage()
        self._cache: List[T] = []
        self._cache_loaded = False
    
    @abstractmethod
    def _to_entity(self, data: dict) -> T:
        """Converte dicionário para entidade"""
        pass
    
    @abstractmethod
    def _to_dict(self, entity: T) -> dict:
        """Converte entidade para dicionário"""
        pass
    
    async def _load_cache(self):
        """Carrega dados do arquivo para cache em memória"""
        if not self._cache_loaded:
            data = await self.storage.load(self.entity_type)
            self._cache = [self._to_entity(item) for item in data]
            self._cache_loaded = True
            logger.debug(f"Cache carregado: {self.entity_type} ({len(self._cache)} itens)")
    
    async def _save_cache(self):
        """Salva cache em memória para arquivo"""
        data = [self._to_dict(item) for item in self._cache]
        await self.storage.save(self.entity_type, data)
        logger.debug(f"Cache salvo: {self.entity_type} ({len(data)} itens)")
    
    async def find_all(self) -> List[T]:
        """Retorna todas as entidades"""
        await self._load_cache()
        return self._cache.copy()
    
    async def find_by_id(self, entity_id: str) -> Optional[T]:
        """Busca entidade por ID"""
        await self._load_cache()
        for item in self._cache:
            if self._get_id(item) == entity_id:
                return item
        return None
    
    async def create(self, entity: T) -> T:
        """Cria nova entidade"""
        await self._load_cache()
        
        # Gera ID se não existir
        if not self._get_id(entity):
            self._set_id(entity, str(uuid4()))
        
        self._cache.append(entity)
        await self._save_cache()
        
        logger.info(f"Entidade criada: {self.entity_type} - ID: {self._get_id(entity)}")
        return entity
    
    async def update(self, entity_id: str, entity: T) -> Optional[T]:
        """Atualiza entidade existente"""
        await self._load_cache()
        
        for i, item in enumerate(self._cache):
            if self._get_id(item) == entity_id:
                self._set_id(entity, entity_id)
                self._cache[i] = entity
                await self._save_cache()
                logger.info(f"Entidade atualizada: {self.entity_type} - ID: {entity_id}")
                return entity
        
        return None
    
    async def delete(self, entity_id: str) -> bool:
        """Remove entidade"""
        await self._load_cache()
        
        for i, item in enumerate(self._cache):
            if self._get_id(item) == entity_id:
                self._cache.pop(i)
                await self._save_cache()
                logger.info(f"Entidade removida: {self.entity_type} - ID: {entity_id}")
                return True
        
        return False
    
    @abstractmethod
    def _get_id(self, entity: T) -> str:
        """Retorna o ID da entidade"""
        pass
    
    @abstractmethod
    def _set_id(self, entity: T, entity_id: str):
        """Define o ID da entidade"""
        pass
    
    def clear_cache(self):
        """Limpa o cache (força recarregar do arquivo)"""
        self._cache = []
        self._cache_loaded = False
        logger.debug(f"Cache limpo: {self.entity_type}")
