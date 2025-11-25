"""
Repository de Consultas - SQLAlchemy
"""

from typing import List, Optional
from datetime import datetime, date
from app.models.db_models import Consulta, StatusConsulta
from app.infra.database import get_db_session


class ConsultaRepository:
    """Repository para operações com Consultas usando SQLAlchemy"""
    
    async def create(self, consulta: Consulta) -> Consulta:
        """Cria nova consulta"""
        with get_db_session() as db:
            db.add(consulta)
            db.flush()
            db.refresh(consulta)
            db.expunge(consulta)
            return consulta
    
    async def find_by_id(self, consulta_id: str) -> Optional[Consulta]:
        """Busca consulta por ID"""
        with get_db_session() as db:
            consulta = db.query(Consulta).filter(Consulta.id == consulta_id).first()
            if consulta:
                db.expunge(consulta)
            return consulta
    
    async def find_by_paciente(self, paciente_id: str) -> List[Consulta]:
        """Busca consultas de um paciente"""
        with get_db_session() as db:
            consultas = db.query(Consulta).filter(Consulta.paciente_id == paciente_id).all()
            for c in consultas:
                db.expunge(c)
            return consultas
    
    async def find_by_medico(self, medico_id: str) -> List[Consulta]:
        """Busca consultas de um médico"""
        with get_db_session() as db:
            consultas = db.query(Consulta).filter(Consulta.medico_id == medico_id).all()
            for c in consultas:
                db.expunge(c)
            return consultas
    
    async def find_by_data(self, data: date) -> List[Consulta]:
        """Busca consultas em uma data específica"""
        with get_db_session() as db:
            start = datetime.combine(data, datetime.min.time())
            end = datetime.combine(data, datetime.max.time())
            consultas = db.query(Consulta).filter(
                Consulta.data_hora >= start,
                Consulta.data_hora <= end
            ).all()
            for c in consultas:
                db.expunge(c)
            return consultas
    
    async def find_by_periodo(self, data_inicio: datetime, data_fim: datetime) -> List[Consulta]:
        """Busca consultas em um período"""
        with get_db_session() as db:
            consultas = db.query(Consulta).filter(
                Consulta.data_hora >= data_inicio,
                Consulta.data_hora <= data_fim
            ).all()
            for c in consultas:
                db.expunge(c)
            return consultas
    
    async def find_by_medico_data(self, medico_id: str, data: date) -> List[Consulta]:
        """Busca consultas de um médico em uma data específica"""
        with get_db_session() as db:
            start = datetime.combine(data, datetime.min.time())
            end = datetime.combine(data, datetime.max.time())
            consultas = db.query(Consulta).filter(
                Consulta.medico_id == medico_id,
                Consulta.data_hora >= start,
                Consulta.data_hora <= end
            ).all()
            for c in consultas:
                db.expunge(c)
            return consultas
    
    async def find_agendadas(self) -> List[Consulta]:
        """Retorna apenas consultas agendadas (não canceladas/realizadas)"""
        with get_db_session() as db:
            consultas = db.query(Consulta).filter(Consulta.status == StatusConsulta.AGENDADA).all()
            for c in consultas:
                db.expunge(c)
            return consultas
    
    async def find_all(self) -> List[Consulta]:
        """Lista todas as consultas"""
        with get_db_session() as db:
            consultas = db.query(Consulta).all()
            for c in consultas:
                db.expunge(c)
            return consultas
    
    async def update(self, consulta_id: str, consulta: Consulta) -> Consulta:
        """Atualiza consulta"""
        with get_db_session() as db:
            db_consulta = db.query(Consulta).filter(Consulta.id == consulta_id).first()
            if db_consulta:
                db_consulta.paciente_id = consulta.paciente_id
                db_consulta.medico_id = consulta.medico_id
                db_consulta.data_hora = consulta.data_hora
                db_consulta.duracao_minutos = consulta.duracao_minutos
                db_consulta.status = consulta.status
                db_consulta.observacoes = consulta.observacoes
                db.flush()
                db.refresh(db_consulta)
                db.expunge(db_consulta)
                return db_consulta
            return None
    
    async def delete(self, consulta_id: str) -> bool:
        """Remove consulta"""
        with get_db_session() as db:
            db_consulta = db.query(Consulta).filter(Consulta.id == consulta_id).first()
            if db_consulta:
                db.delete(db_consulta)
                return True
            return False

