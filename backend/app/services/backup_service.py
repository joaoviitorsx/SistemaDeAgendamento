"""
Service de Backup - backup automático de dados

Conceitos de SO demonstrados:
- Operações de I/O em background
- Threading para tarefas assíncronas
- Cópia de arquivos
"""

import asyncio
from datetime import datetime
from pathlib import Path

from app.infra.config import get_config
from app.infra.storage import get_storage
from app.infra.logger import get_logger
from app.infra.concurrency import get_concurrency_manager

logger = get_logger(__name__)


class BackupService:
    """
    Service para backup automático de dados
    
    Conceitos de SO:
    - Background tasks (threads)
    - Operações de I/O assíncronas
    - Gerenciamento de diretórios
    """
    
    def __init__(self):
        self.config = get_config()
        self.storage = get_storage()
        self.concurrency = get_concurrency_manager()
        self._backup_task: asyncio.Task | None = None
    
    async def backup_all(self) -> dict:
        """
        Executa backup de todas as entidades
        
        Conceito: I/O em background usando threads
        """
        logger.info("Iniciando backup de todos os dados...")
        
        entities = ["pacientes", "medicos", "consultas"]
        results = {}
        
        for entity in entities:
            try:
                await self.storage.backup(entity)
                results[entity] = "success"
                logger.info(f"Backup concluído: {entity}")
            except Exception as e:
                results[entity] = f"error: {str(e)}"
                logger.error(f"Erro no backup de {entity}: {e}")
        
        return {
            "timestamp": datetime.now().isoformat(),
            "results": results,
            "backup_dir": str(self.config.backup_dir)
        }
    
    async def backup_entity(self, entity_type: str) -> bool:
        """Backup de uma entidade específica"""
        logger.info(f"Executando backup: {entity_type}")
        
        try:
            await self.storage.backup(entity_type)
            return True
        except Exception as e:
            logger.error(f"Erro no backup de {entity_type}: {e}")
            return False
    
    def list_backups(self) -> list:
        """Lista todos os arquivos de backup"""
        backup_dir = self.config.backup_dir
        
        if not backup_dir.exists():
            return []
        
        backups = []
        for file_path in backup_dir.glob("*.json"):
            stat = file_path.stat()
            backups.append({
                "filename": file_path.name,
                "path": str(file_path),
                "size_bytes": stat.st_size,
                "created_at": datetime.fromtimestamp(stat.st_ctime).isoformat()
            })
        
        # Ordena por data (mais recente primeiro)
        backups.sort(key=lambda x: x["created_at"], reverse=True)
        
        return backups
    
    async def cleanup_old_backups(self, keep_last: int = 10):
        """
        Remove backups antigos, mantendo apenas os N mais recentes
        
        Conceito: Gerenciamento de espaço em disco
        """
        logger.info(f"Limpando backups antigos (mantendo últimos {keep_last})...")
        
        backups = self.list_backups()
        
        if len(backups) <= keep_last:
            logger.info("Nenhum backup para remover")
            return 0
        
        to_remove = backups[keep_last:]
        removed_count = 0
        
        for backup in to_remove:
            try:
                Path(backup["path"]).unlink()
                removed_count += 1
                logger.debug(f"Backup removido: {backup['filename']}")
            except Exception as e:
                logger.error(f"Erro ao remover backup {backup['filename']}: {e}")
        
        logger.info(f"Backups removidos: {removed_count}")
        return removed_count


# Singleton
_backup_service: BackupService | None = None


def get_backup_service() -> BackupService:
    """Retorna a instância do backup service"""
    global _backup_service
    if _backup_service is None:
        _backup_service = BackupService()
    return _backup_service
