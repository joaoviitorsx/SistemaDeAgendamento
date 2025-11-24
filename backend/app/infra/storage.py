"""
Abstração de persistência de dados

Conceitos de SO demonstrados:
- Abstração de I/O
- Operações de arquivo thread-safe
- Transações em arquivos (backup antes de escrever)
"""

from abc import ABC, abstractmethod
from pathlib import Path
from typing import List, Optional, Dict, Any
import shutil
from datetime import datetime

from app.infra.config import get_config
from app.infra.file_manager import FileManager
from app.infra.logger import get_logger

logger = get_logger(__name__)


class BaseStorage(ABC):
    """Interface base para storage"""
    
    @abstractmethod
    async def save(self, entity_type: str, data: List[Dict[str, Any]]):
        """Salva dados"""
        pass
    
    @abstractmethod
    async def load(self, entity_type: str) -> List[Dict[str, Any]]:
        """Carrega dados"""
        pass
    
    @abstractmethod
    async def backup(self, entity_type: str):
        """Cria backup dos dados"""
        pass


class JSONStorage(BaseStorage):
    """
    Implementação de storage em arquivos JSON
    
    Conceitos de SO:
    - Operações de I/O assíncronas
    - Backup de arquivos antes de sobrescrever
    - Tratamento de encoding
    """
    
    def __init__(self):
        self.config = get_config()
        self.file_manager = FileManager()
        self.data_dir = self.config.data_dir
    
    def _get_file_path(self, entity_type: str) -> Path:
        """Retorna o caminho do arquivo de dados"""
        return self.data_dir / f"{entity_type}.json"
    
    def _get_backup_path(self, entity_type: str) -> Path:
        """Retorna o caminho do arquivo de backup"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        return self.config.backup_dir / f"{entity_type}_{timestamp}.json"
    
    async def save(self, entity_type: str, data: List[Dict[str, Any]]):
        """
        Salva dados em arquivo JSON
        Cria backup antes de sobrescrever
        """
        file_path = self._get_file_path(entity_type)
        
        # Backup do arquivo existente
        if file_path.exists():
            await self.backup(entity_type)
        
        # Salva os novos dados
        await self.file_manager.write_json_async(file_path, data)
        logger.info(f"Dados salvos: {entity_type} ({len(data)} registros)")
    
    async def load(self, entity_type: str) -> List[Dict[str, Any]]:
        """Carrega dados do arquivo JSON"""
        file_path = self._get_file_path(entity_type)
        
        if not file_path.exists():
            logger.info(f"Arquivo não existe, retornando lista vazia: {entity_type}")
            return []
        
        data = await self.file_manager.read_json_async(file_path)
        logger.debug(f"Dados carregados: {entity_type} ({len(data) if data else 0} registros)")
        return data or []
    
    async def backup(self, entity_type: str):
        """
        Cria backup do arquivo de dados
        Conceito: Sistema de arquivos - cópia segura de dados
        """
        file_path = self._get_file_path(entity_type)
        
        if not file_path.exists():
            logger.warning(f"Arquivo não existe para backup: {entity_type}")
            return
        
        backup_path = self._get_backup_path(entity_type)
        backup_path.parent.mkdir(parents=True, exist_ok=True)
        
        try:
            shutil.copy2(file_path, backup_path)
            logger.info(f"Backup criado: {backup_path}")
        except Exception as e:
            logger.error(f"Erro ao criar backup de {entity_type}: {e}")
            raise


# Singleton
_storage: JSONStorage | None = None


def get_storage() -> JSONStorage:
    """Retorna a instância do storage"""
    global _storage
    if _storage is None:
        _storage = JSONStorage()
    return _storage
