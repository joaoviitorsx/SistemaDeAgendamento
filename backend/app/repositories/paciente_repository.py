"""
Repository de Pacientes - SQLAlchemy
"""

from typing import List, Optional
from app.models.db_models import Paciente
from app.infra.database import get_db_session


class PacienteRepository:
    """Repository para operações com Pacientes usando SQLAlchemy"""
    
    async def create(self, paciente: Paciente) -> Paciente:
        """Cria novo paciente"""
        with get_db_session() as db:
            db.add(paciente)
            db.flush()
            db.refresh(paciente)
            db.expunge(paciente)
            return paciente
    
    async def find_by_id(self, paciente_id: str) -> Optional[Paciente]:
        """Busca paciente por ID"""
        with get_db_session() as db:
            paciente = db.query(Paciente).filter(Paciente.id == paciente_id).first()
            if paciente:
                db.expunge(paciente)
            return paciente
    
    async def find_by_cpf(self, cpf: str) -> Optional[Paciente]:
        """Busca paciente por CPF"""
        with get_db_session() as db:
            paciente = db.query(Paciente).filter(Paciente.cpf == cpf).first()
            if paciente:
                db.expunge(paciente)
            return paciente
    
    async def find_ativos(self) -> List[Paciente]:
        """Retorna apenas pacientes ativos"""
        with get_db_session() as db:
            pacientes = db.query(Paciente).filter(Paciente.ativo == True).all()
            for p in pacientes:
                db.expunge(p)
            return pacientes
    
    async def find_all(self) -> List[Paciente]:
        """Lista todos os pacientes"""
        with get_db_session() as db:
            pacientes = db.query(Paciente).all()
            for p in pacientes:
                db.expunge(p)
            return pacientes
    
    async def update(self, paciente_id: str, paciente: Paciente) -> Paciente:
        """Atualiza paciente"""
        with get_db_session() as db:
            db_paciente = db.query(Paciente).filter(Paciente.id == paciente_id).first()
            if db_paciente:
                db_paciente.nome = paciente.nome
                db_paciente.cpf = paciente.cpf
                db_paciente.data_nascimento = paciente.data_nascimento
                db_paciente.telefone = paciente.telefone
                db_paciente.email = paciente.email
                db_paciente.ativo = paciente.ativo
                db_paciente.endereco = paciente.endereco
                db.flush()
                db.refresh(db_paciente)
                db.expunge(db_paciente)
                return db_paciente
            return None
    
    async def delete(self, paciente_id: str) -> bool:
        """Remove paciente"""
        with get_db_session() as db:
            db_paciente = db.query(Paciente).filter(Paciente.id == paciente_id).first()
            if db_paciente:
                db.delete(db_paciente)
                return True
            return False

