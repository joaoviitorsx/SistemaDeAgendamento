"""
Gerenciador de arquivos e diretórios

Conceitos de SO demonstrados:
- Criação e manipulação de diretórios
- Operações de I/O (leitura/escrita)
- File locks para controle de concorrência
- Limpeza de arquivos temporários
- Permissões de arquivo (quando aplicável)
"""

import os
import json
import asyncio
import aiofiles
import platform
from pathlib import Path
from typing import Any, Dict
from datetime import datetime, timedelta

from app.infra.config import get_config
from app.infra.logger import get_logger

logger = get_logger(__name__)


class FileManager:
    """
    Gerenciador centralizado de operações com arquivos
    Garante criação de diretórios e acesso thread-safe
    """
    
    def __init__(self):
        self.config = get_config()
        self._locks: Dict[str, asyncio.Lock] = {}
    
    def ensure_directories(self):
        """
        Cria todos os diretórios necessários
        Conceito: Operações de sistema de arquivos
        """
        directories = [
            self.config.data_dir,
            self.config.logs_dir,
            self.config.reports_dir,
            self.config.backup_dir,
            self.config.temp_dir,
        ]
        
        for directory in directories:
            directory.mkdir(parents=True, exist_ok=True)
            logger.info(f"Diretório verificado/criado: {directory}")
            
            # Define permissões (apenas Unix-like)
            if platform.system() != "Windows":
                try:
                    os.chmod(directory, 0o755)
                except Exception as e:
                    logger.warning(f"Não foi possível definir permissões: {e}")
    
    def _get_lock(self, file_path: str) -> asyncio.Lock:
        """Retorna um lock para o arquivo especificado"""
        if file_path not in self._locks:
            self._locks[file_path] = asyncio.Lock()
        return self._locks[file_path]
    
    async def read_json_async(self, file_path: Path) -> Any:
        """
        Lê arquivo JSON de forma assíncrona
        Conceito: I/O assíncrono, não bloqueia outras operações
        """
        lock = self._get_lock(str(file_path))
        
        async with lock:
            if not file_path.exists():
                return None
            
            try:
                async with aiofiles.open(
                    file_path, 
                    mode='r', 
                    encoding=self.config.file_encoding
                ) as f:
                    content = await f.read()
                    return json.loads(content)
            except Exception as e:
                logger.error(f"Erro ao ler arquivo {file_path}: {e}")
                raise
    
    async def write_json_async(self, file_path: Path, data: Any):
        """
        Escreve arquivo JSON de forma assíncrona
        Conceito: I/O assíncrono com lock para evitar race conditions
        """
        lock = self._get_lock(str(file_path))
        
        async with lock:
            try:
                # Garante que o diretório existe
                file_path.parent.mkdir(parents=True, exist_ok=True)
                
                async with aiofiles.open(
                    file_path, 
                    mode='w', 
                    encoding=self.config.file_encoding
                ) as f:
                    content = json.dumps(data, indent=2, ensure_ascii=False, default=str)
                    await f.write(content)
                
                logger.debug(f"Arquivo escrito: {file_path}")
            except Exception as e:
                logger.error(f"Erro ao escrever arquivo {file_path}: {e}")
                raise
    
    def read_json_sync(self, file_path: Path) -> Any:
        """
        Lê arquivo JSON de forma síncrona
        Usado quando async não é necessário
        """
        if not file_path.exists():
            return None
        
        try:
            with open(file_path, 'r', encoding=self.config.file_encoding) as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Erro ao ler arquivo {file_path}: {e}")
            raise
    
    def write_json_sync(self, file_path: Path, data: Any):
        """Escreve arquivo JSON de forma síncrona"""
        try:
            file_path.parent.mkdir(parents=True, exist_ok=True)
            
            with open(file_path, 'w', encoding=self.config.file_encoding) as f:
                json.dump(data, f, indent=2, ensure_ascii=False, default=str)
            
            logger.debug(f"Arquivo escrito: {file_path}")
        except Exception as e:
            logger.error(f"Erro ao escrever arquivo {file_path}: {e}")
            raise
    
    def cleanup_temp_files(self, older_than_hours: int = 24):
        """
        Remove arquivos temporários antigos
        Conceito: Gerenciamento de memória/disco - libera espaço
        """
        temp_dir = self.config.temp_dir
        if not temp_dir.exists():
            return
        
        now = datetime.now()
        cutoff = now - timedelta(hours=older_than_hours)
        removed_count = 0
        
        try:
            for file_path in temp_dir.rglob("*"):
                if file_path.is_file():
                    file_time = datetime.fromtimestamp(file_path.stat().st_mtime)
                    if file_time < cutoff:
                        file_path.unlink()
                        removed_count += 1
                        logger.debug(f"Arquivo temporário removido: {file_path}")
            
            logger.info(f"Limpeza de arquivos temporários: {removed_count} arquivo(s) removido(s)")
        except Exception as e:
            logger.error(f"Erro ao limpar arquivos temporários: {e}")
    
    def get_file_size(self, file_path: Path) -> int:
        """Retorna o tamanho do arquivo em bytes"""
        if file_path.exists() and file_path.is_file():
            return file_path.stat().st_size
        return 0
    
    def get_directory_size(self, directory: Path) -> int:
        """Retorna o tamanho total de um diretório em bytes"""
        total_size = 0
        try:
            for file_path in directory.rglob("*"):
                if file_path.is_file():
                    total_size += file_path.stat().st_size
        except Exception as e:
            logger.error(f"Erro ao calcular tamanho do diretório {directory}: {e}")
        return total_size
