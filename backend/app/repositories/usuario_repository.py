"""
Repository de Usuários - SQLAlchemy
"""

from typing import List, Optional
from sqlalchemy import select
from app.models.db_models import Usuario
from app.infra.database import get_db_session


class UsuarioRepository:
    """Repository para operações com Usuários usando SQLAlchemy"""
    
    async def create(self, usuario: Usuario) -> Usuario:
        """Cria novo usuário"""
        with get_db_session() as db:
            db.add(usuario)
            db.flush()
            db.refresh(usuario)
            return usuario
    
    async def find_by_id(self, usuario_id: str) -> Optional[Usuario]:
        """Busca usuário por ID"""
        with get_db_session() as db:
            usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
            if usuario:
                db.expunge(usuario)
            return usuario
    
    async def find_by_username(self, username: str) -> Optional[Usuario]:
        """Busca usuário por username"""
        with get_db_session() as db:
            usuario = db.query(Usuario).filter(Usuario.username == username).first()
            if usuario:
                db.expunge(usuario)
            return usuario
    
    async def find_by_referencia(self, referencia_id: str) -> Optional[Usuario]:
        """Busca usuário por ID de referência (médico/paciente)"""
        with get_db_session() as db:
            usuario = db.query(Usuario).filter(Usuario.referencia_id == referencia_id).first()
            if usuario:
                db.expunge(usuario)
            return usuario
    
    async def find_all(self) -> List[Usuario]:
        """Lista todos os usuários"""
        with get_db_session() as db:
            usuarios = db.query(Usuario).all()
            for u in usuarios:
                db.expunge(u)
            return usuarios
    
    async def update(self, usuario_id: str, usuario: Usuario) -> Usuario:
        """Atualiza usuário"""
        with get_db_session() as db:
            db_usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
            if db_usuario:
                db_usuario.username = usuario.username
                db_usuario.senha_hash = usuario.senha_hash
                db_usuario.tipo = usuario.tipo
                db_usuario.referencia_id = usuario.referencia_id
                db_usuario.ativo = usuario.ativo
                db.flush()
                db.refresh(db_usuario)
                return db_usuario
            return None
    
    async def delete(self, usuario_id: str) -> bool:
        """Remove usuário"""
        with get_db_session() as db:
            db_usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
            if db_usuario:
                db.delete(db_usuario)
                return True
            return False

