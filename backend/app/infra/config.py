"""
Configuração da aplicação dependente do Sistema Operacional

Conceitos de SO demonstrados:
- Detecção de SO (platform.system())
- Paths específicos por plataforma (pathlib.Path)
- Variáveis de ambiente do sistema
- Encoding apropriado por SO
"""

import platform
import os
import sys
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings
from dataclasses import dataclass


@dataclass
class OSInfo:
    """Informações do Sistema Operacional"""
    system: str  # Windows, Linux, Darwin (macOS)
    release: str
    version: str
    machine: str
    processor: str
    encoding: str
    path_separator: str
    
    @classmethod
    def detect(cls):
        """Detecta informações do SO atual"""
        return cls(
            system=platform.system(),
            release=platform.release(),
            version=platform.version(),
            machine=platform.machine(),
            processor=platform.processor() or "Unknown",
            encoding=sys.getdefaultencoding(),
            path_separator=os.sep
        )


class Settings(BaseSettings):
    """
    Configurações da aplicação
    Carrega de variáveis de ambiente ou .env
    """
    # Informações básicas
    app_name: str = "Sistema de Agendamento"
    app_version: str = "1.0.0"
    environment: str = "development"
    debug: bool = True
    
    # API
    api_prefix: str = "/api/v1"
    cors_origins: List[str] = ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"]
    
    # Logging
    log_level: str = "INFO"
    log_file_max_bytes: int = 10_485_760  # 10MB
    log_file_backup_count: int = 5
    
    # Cache
    cache_max_size: int = 100
    cache_ttl_seconds: int = 300  # 5 minutos
    
    # Backup
    backup_enabled: bool = True
    backup_interval_hours: int = 24
    
    class Config:
        env_file = ".env"
        case_sensitive = False
    
    # Informações do SO
    os_info: OSInfo = OSInfo.detect()
    
    @property
    def base_dir(self) -> Path:
        """Diretório base do projeto"""
        return Path(__file__).parent.parent.parent
    
    @property
    def data_dir(self) -> Path:
        """
        Diretório de dados - específico por SO
        
        Windows: %LOCALAPPDATA%/SistemaAgendamento/data
        Linux/macOS: ~/.local/share/SistemaAgendamento/data
        """
        system = self.os_info.system
        
        if system == "Windows":
            base = Path(os.getenv("LOCALAPPDATA", Path.home() / "AppData" / "Local"))
        else:  # Linux, Darwin (macOS)
            base = Path.home() / ".local" / "share"
        
        return base / "SistemaAgendamento" / "data"
    
    @property
    def logs_dir(self) -> Path:
        """
        Diretório de logs - específico por SO
        
        Windows: %LOCALAPPDATA%/SistemaAgendamento/logs
        Linux/macOS: ~/.local/share/SistemaAgendamento/logs
        """
        system = self.os_info.system
        
        if system == "Windows":
            base = Path(os.getenv("LOCALAPPDATA", Path.home() / "AppData" / "Local"))
        else:
            base = Path.home() / ".local" / "share"
        
        return base / "SistemaAgendamento" / "logs"
    
    @property
    def reports_dir(self) -> Path:
        """
        Diretório de relatórios - específico por SO
        
        Windows: %USERPROFILE%/Documents/SistemaAgendamento/relatorios
        Linux/macOS: ~/Documents/SistemaAgendamento/relatorios
        """
        docs = Path.home() / "Documents"
        return docs / "SistemaAgendamento" / "relatorios"
    
    @property
    def backup_dir(self) -> Path:
        """Diretório de backups"""
        return self.data_dir / "backups"
    
    @property
    def temp_dir(self) -> Path:
        """Diretório temporário para operações"""
        return self.data_dir / "temp"
    
    @property
    def file_encoding(self) -> str:
        """Encoding padrão para arquivos (UTF-8 em todos os SOs)"""
        return "utf-8"


# Singleton da configuração
_config: Settings | None = None


def get_config() -> Settings:
    """Retorna a instância única da configuração"""
    global _config
    if _config is None:
        _config = Settings()
    return _config
