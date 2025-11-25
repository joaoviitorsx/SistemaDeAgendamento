"""
Repository de Médicos - SQLAlchemy
"""

from typing import List, Optional
import json
from app.models.db_models import Medico
from app.infra.database import get_db_session


class MedicoRepository:
    """Repository para operações com Médicos usando SQLAlchemy"""
    
    async def create(self, medico: Medico) -> Medico:
        """Cria novo médico"""
        with get_db_session() as db:
            db.add(medico)
            db.flush()
            db.refresh(medico)
            db.expunge(medico)
            return medico
    
    async def find_by_id(self, medico_id: str) -> Optional[Medico]:
        """Busca médico por ID"""
        with get_db_session() as db:
            medico = db.query(Medico).filter(Medico.id == medico_id).first()
            if medico:
                db.expunge(medico)
            return medico
    
    async def find_by_crm(self, crm: str) -> Optional[Medico]:
        """Busca médico por CRM"""
        with get_db_session() as db:
            medico = db.query(Medico).filter(Medico.crm == crm).first()
            if medico:
                db.expunge(medico)
            return medico
    
    async def find_by_especialidade(self, especialidade: str) -> List[Medico]:
        """Busca médicos por especialidade"""
        with get_db_session() as db:
            medicos = db.query(Medico).filter(
                Medico.especialidade == especialidade,
                Medico.ativo == True
            ).all()
            for m in medicos:
                db.expunge(m)
            return medicos
    
    async def find_ativos(self) -> List[Medico]:
        """Retorna apenas médicos ativos"""
        with get_db_session() as db:
            medicos = db.query(Medico).filter(Medico.ativo == True).all()
            for m in medicos:
                db.expunge(m)
            return medicos
    
    async def find_all(self) -> List[Medico]:
        """Lista todos os médicos"""
        with get_db_session() as db:
            medicos = db.query(Medico).all()
            for m in medicos:
                db.expunge(m)
            return medicos
    
    async def update(self, medico_id: str, medico: Medico) -> Medico:
        """Atualiza médico"""
        with get_db_session() as db:
            db_medico = db.query(Medico).filter(Medico.id == medico_id).first()
            if db_medico:
                db_medico.nome = medico.nome
                db_medico.crm = medico.crm
                db_medico.especialidade = medico.especialidade
                db_medico.telefone = medico.telefone
                db_medico.email = medico.email
                db_medico.ativo = medico.ativo
                db_medico.horarios_atendimento = medico.horarios_atendimento
                db.flush()
                db.refresh(db_medico)
                db.expunge(db_medico)
                return db_medico
            return None
    
    async def delete(self, medico_id: str) -> bool:
        """Remove médico"""
        with get_db_session() as db:
            db_medico = db.query(Medico).filter(Medico.id == medico_id).first()
            if db_medico:
                db.delete(db_medico)
                return True
            return False

