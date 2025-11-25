"""
Entry point da aplicação FastAPI

Conceitos de SO demonstrados:
- Inicialização de recursos do sistema (logging, diretórios)
- Configuração dependente de SO (paths, encoding)
- Gerenciamento de ciclo de vida da aplicação
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.infra.config import get_config
from app.infra.logger import setup_logging, get_logger
from app.infra.file_manager import FileManager
from app.controllers import (
    paciente_controller,
    medico_controller,
    consulta_controller,
    relatorio_controller,
    sistema_controller,
    auth_controller
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Gerencia o ciclo de vida da aplicação
    - Startup: inicializa logging, diretórios, cache, banco de dados
    - Shutdown: limpa recursos, fecha arquivos
    """
    config = get_config()
    logger = get_logger(__name__)
    
    # Startup
    logger.info("Iniciando aplicação...")
    logger.info(f"Sistema Operacional: {config.os_info.system}")
    logger.info(f"Diretório de dados: {config.data_dir}")
    
    # Cria estrutura de diretórios
    file_manager = FileManager()
    file_manager.ensure_directories()
    logger.info("Estrutura de diretórios criada/verificada")
    
    # Inicializa banco de dados SQLite
    from app.infra.database import init_database, create_tables
    init_database()
    create_tables()
    logger.info("Banco de dados SQLite inicializado")
    
    # Cria usuário admin inicial se não existir
    from app.services.auth_service import AuthService
    auth_service = AuthService()
    await auth_service.criar_usuario_admin_inicial()
    logger.info("Verificação de usuário admin concluída")
    
    yield
    
    # Shutdown
    logger.info("Encerrando aplicação...")
    logger.info("Recursos liberados")


# Cria a aplicação FastAPI
app = FastAPI(
    title="Sistema de Agendamento de Consultas",
    description="Sistema completo com conceitos de Sistemas Operacionais",
    version="1.0.0",
    lifespan=lifespan
)

# Configuração de CORS
config = get_config()
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registra os controllers (routers)
app.include_router(auth_controller.router, prefix="/api/v1", tags=["Autenticação"])
app.include_router(paciente_controller.router, prefix="/api/v1", tags=["Pacientes"])
app.include_router(medico_controller.router, prefix="/api/v1", tags=["Médicos"])
app.include_router(consulta_controller.router, prefix="/api/v1", tags=["Consultas"])
app.include_router(relatorio_controller.router, prefix="/api/v1", tags=["Relatórios"])
app.include_router(sistema_controller.router, prefix="/api/v1", tags=["Sistema"])


@app.get("/")
async def root():
    """Endpoint raiz - informações do sistema"""
    return {
        "app": "Sistema de Agendamento de Consultas",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "os": config.os_info.system
    }


@app.get("/health")
async def health_check():
    """Health check da aplicação"""
    return {"status": "healthy"}


if __name__ == "__main__":
    # Setup logging antes de iniciar
    setup_logging()
    
    # Inicia o servidor
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
