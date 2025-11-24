"""
Controller do Sistema - operações de sistema

Endpoints para backup, cache, logs, informações do SO, etc.
"""

from fastapi import APIRouter
from datetime import datetime

from app.services.backup_service import get_backup_service
from app.services.cache_service import get_cache_service
from app.infra.config import get_config
from app.infra.file_manager import FileManager
from app.infra.logger import get_logger

logger = get_logger(__name__)
router = APIRouter()


@router.get("/sistema/info")
async def info_sistema():
    """
    Informações do sistema operacional e aplicação
    
    Conceito de SO: Detecção de SO e recursos do sistema
    """
    config = get_config()
    file_manager = FileManager()
    
    return {
        "sistema_operacional": {
            "nome": config.os_info.system,
            "versao": config.os_info.release,
            "arquitetura": config.os_info.machine,
            "processador": config.os_info.processor,
            "encoding": config.os_info.encoding,
            "separador_path": config.os_info.path_separator
        },
        "aplicacao": {
            "nome": config.app_name,
            "versao": config.app_version,
            "ambiente": config.environment
        },
        "diretorios": {
            "dados": str(config.data_dir),
            "logs": str(config.logs_dir),
            "relatorios": str(config.reports_dir),
            "backups": str(config.backup_dir),
            "temp": str(config.temp_dir)
        },
        "tamanhos": {
            "dados_mb": round(file_manager.get_directory_size(config.data_dir) / 1024 / 1024, 2),
            "logs_mb": round(file_manager.get_directory_size(config.logs_dir) / 1024 / 1024, 2),
            "relatorios_mb": round(file_manager.get_directory_size(config.reports_dir) / 1024 / 1024, 2)
        }
    }


@router.post("/sistema/backup")
async def executar_backup():
    """
    Executa backup manual de todos os dados
    
    Conceito de SO: Operações de I/O, cópia de arquivos
    """
    service = get_backup_service()
    resultado = await service.backup_all()
    return resultado


@router.get("/sistema/backups")
async def listar_backups():
    """Lista todos os backups disponíveis"""
    service = get_backup_service()
    backups = service.list_backups()
    return {"backups": backups, "total": len(backups)}


@router.post("/sistema/backups/limpar")
async def limpar_backups(manter_ultimos: int = 10):
    """
    Remove backups antigos
    
    Conceito de SO: Gerenciamento de disco
    """
    service = get_backup_service()
    removidos = await service.cleanup_old_backups(manter_ultimos)
    return {"removidos": removidos}


@router.get("/sistema/cache/stats")
async def stats_cache():
    """
    Estatísticas do cache em memória
    
    Conceito de SO: Gerenciamento de memória
    """
    service = get_cache_service()
    stats = service.get_stats()
    return stats


@router.post("/sistema/cache/limpar")
async def limpar_cache():
    """
    Limpa todo o cache
    
    Conceito de SO: Liberação de memória
    """
    service = get_cache_service()
    service.clear()
    return {"mensagem": "Cache limpo com sucesso"}


@router.post("/sistema/temp/limpar")
async def limpar_temporarios(horas: int = 24):
    """
    Remove arquivos temporários antigos
    
    Conceito de SO: Limpeza de disco
    """
    file_manager = FileManager()
    file_manager.cleanup_temp_files(older_than_hours=horas)
    return {"mensagem": f"Arquivos temporários com mais de {horas}h removidos"}


@router.get("/sistema/saude")
async def health_check():
    """Health check detalhado"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "componentes": {
            "api": "ok",
            "storage": "ok",
            "cache": "ok"
        }
    }
