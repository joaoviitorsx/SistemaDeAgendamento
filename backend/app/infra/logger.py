"""
Sistema de Logging com rotação de arquivos

Conceitos de SO demonstrados:
- Operações de I/O em arquivos
- Timestamp com fuso horário do sistema
- Rotação de logs (gerenciamento de arquivos)
- Níveis de log (DEBUG, INFO, WARNING, ERROR, CRITICAL)
"""

import logging
import logging.handlers
from pathlib import Path
from datetime import datetime
import sys

from app.infra.config import get_config


def setup_logging():
    """
    Configura o sistema de logging
    
    - Logs vão para arquivo E console
    - Rotação automática de arquivos (tamanho máximo)
    - Formato com timestamp, nível e mensagem
    """
    config = get_config()
    
    # Cria diretório de logs se não existir
    config.logs_dir.mkdir(parents=True, exist_ok=True)
    
    # Arquivo de log
    log_file = config.logs_dir / f"app_{datetime.now().strftime('%Y%m%d')}.log"
    
    # Formato do log
    log_format = "%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s"
    date_format = "%Y-%m-%d %H:%M:%S"
    
    # Handler para arquivo com rotação
    file_handler = logging.handlers.RotatingFileHandler(
        filename=log_file,
        maxBytes=config.log_file_max_bytes,
        backupCount=config.log_file_backup_count,
        encoding=config.file_encoding
    )
    file_handler.setLevel(getattr(logging, config.log_level))
    file_handler.setFormatter(logging.Formatter(log_format, date_format))
    
    # Handler para console
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(logging.Formatter(log_format, date_format))
    
    # Configuração do logger raiz
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.DEBUG if config.debug else logging.INFO)
    root_logger.addHandler(file_handler)
    root_logger.addHandler(console_handler)
    
    # Silencia logs muito verbosos de bibliotecas
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    
    return root_logger


def get_logger(name: str) -> logging.Logger:
    """
    Retorna um logger com nome específico
    
    Usage:
        logger = get_logger(__name__)
        logger.info("Mensagem de log")
    """
    return logging.getLogger(name)
