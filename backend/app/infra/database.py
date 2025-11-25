"""
Configuração do Banco de Dados SQLAlchemy
Gerencia conexão, sessões e modelos ORM
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from contextlib import contextmanager
from typing import Generator
import os
from pathlib import Path

from app.infra.config import get_config

# Base para os modelos ORM
Base = declarative_base()

# Engine e SessionLocal
_engine = None
_SessionLocal = None


def get_database_url() -> str:
    """Retorna URL do banco de dados SQLite"""
    # Banco na pasta do projeto: backend/banco/database.db
    project_root = Path(__file__).parent.parent.parent  # volta para backend/
    db_dir = project_root / "banco"
    db_dir.mkdir(exist_ok=True)  # Cria pasta se não existir
    db_path = db_dir / "database.db"
    return f"sqlite:///{db_path}"


def init_database():
    """Inicializa o banco de dados"""
    global _engine, _SessionLocal
    
    if _engine is None:
        database_url = get_database_url()
        _engine = create_engine(
            database_url,
            connect_args={"check_same_thread": False},  # Necessário para SQLite
            echo=False  # True para debug SQL
        )
        _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=_engine)
    
    return _engine


def get_engine():
    """Retorna engine do banco de dados"""
    if _engine is None:
        init_database()
    return _engine


def get_session_local():
    """Retorna SessionLocal"""
    if _SessionLocal is None:
        init_database()
    return _SessionLocal


@contextmanager
def get_db_session() -> Generator[Session, None, None]:
    """
    Context manager para obter sessão do banco
    Uso:
        with get_db_session() as db:
            user = db.query(Usuario).first()
    """
    SessionLocal = get_session_local()
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def create_tables():
    """Cria todas as tabelas do banco de dados"""
    from app.models.db_models import Usuario, Medico, Paciente, Consulta
    
    engine = get_engine()
    Base.metadata.create_all(bind=engine)


def drop_tables():
    """Remove todas as tabelas (usar com cuidado!)"""
    engine = get_engine()
    Base.metadata.drop_all(bind=engine)
