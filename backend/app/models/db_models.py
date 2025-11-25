"""
Modelos ORM do SQLAlchemy
Define a estrutura das tabelas do banco de dados
"""

from sqlalchemy import Column, String, Integer, Boolean, DateTime, Enum as SQLEnum, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import hashlib
import enum

from app.infra.database import Base


class TipoUsuario(str, enum.Enum):
    """Tipos de usuário no sistema"""
    ADMIN = "admin"
    MEDICO = "medico"
    PACIENTE = "paciente"


class StatusConsulta(str, enum.Enum):
    """Status possíveis de uma consulta"""
    AGENDADA = "agendada"
    CONFIRMADA = "confirmada"
    REALIZADA = "realizada"
    CANCELADA = "cancelada"


class Usuario(Base):
    """Tabela de usuários do sistema"""
    __tablename__ = "usuarios"
    
    id = Column(String(36), primary_key=True)
    username = Column(String(200), unique=True, nullable=False, index=True)
    senha_hash = Column(String(64), nullable=False)
    tipo = Column(SQLEnum(TipoUsuario), nullable=False)
    referencia_id = Column(String(36), nullable=True)
    ativo = Column(Boolean, default=True, nullable=False)
    
    @staticmethod
    def hash_senha(senha: str) -> str:
        """Gera hash SHA-256 da senha"""
        return hashlib.sha256(senha.encode()).hexdigest()
    
    def verificar_senha(self, senha: str) -> bool:
        """Verifica se a senha está correta"""
        return self.senha_hash == self.hash_senha(senha)
    
    def to_dict(self):
        """Converte para dicionário"""
        return {
            "id": self.id,
            "username": self.username,
            "senha_hash": self.senha_hash,
            "tipo": self.tipo.value,
            "referencia_id": self.referencia_id,
            "ativo": self.ativo
        }


class Medico(Base):
    """Tabela de médicos"""
    __tablename__ = "medicos"
    
    id = Column(String(36), primary_key=True)
    nome = Column(String(200), nullable=False)
    crm = Column(String(20), unique=True, nullable=False, index=True)
    especialidade = Column(String(100), nullable=False)
    telefone = Column(String(20), nullable=False)
    email = Column(String(200), nullable=False)
    ativo = Column(Boolean, default=True, nullable=False)
    
    # Horários de atendimento (armazenados como JSON string)
    horarios_atendimento = Column(Text, nullable=True)
    
    # Relacionamentos
    consultas = relationship("Consulta", back_populates="medico", foreign_keys="Consulta.medico_id")
    
    def to_dict(self):
        """Converte para dicionário"""
        import json
        return {
            "id": self.id,
            "nome": self.nome,
            "crm": self.crm,
            "especialidade": self.especialidade,
            "telefone": self.telefone,
            "email": self.email,
            "ativo": self.ativo,
            "horarios_atendimento": json.loads(self.horarios_atendimento) if self.horarios_atendimento else None
        }


class Paciente(Base):
    """Tabela de pacientes"""
    __tablename__ = "pacientes"
    
    id = Column(String(36), primary_key=True)
    nome = Column(String(200), nullable=False)
    cpf = Column(String(14), unique=True, nullable=False, index=True)
    data_nascimento = Column(String(10), nullable=False)  # formato YYYY-MM-DD
    telefone = Column(String(20), nullable=False)
    email = Column(String(200), nullable=False)
    ativo = Column(Boolean, default=True, nullable=False)
    
    # Endereço (armazenado como JSON string)
    endereco = Column(Text, nullable=True)
    
    # Relacionamentos
    consultas = relationship("Consulta", back_populates="paciente", foreign_keys="Consulta.paciente_id")
    
    def to_dict(self):
        """Converte para dicionário"""
        import json
        return {
            "id": self.id,
            "nome": self.nome,
            "cpf": self.cpf,
            "data_nascimento": self.data_nascimento,
            "telefone": self.telefone,
            "email": self.email,
            "ativo": self.ativo,
            "endereco": json.loads(self.endereco) if self.endereco else None
        }


class Consulta(Base):
    """Tabela de consultas"""
    __tablename__ = "consultas"
    
    id = Column(String(36), primary_key=True)
    paciente_id = Column(String(36), ForeignKey("pacientes.id"), nullable=False, index=True)
    medico_id = Column(String(36), ForeignKey("medicos.id"), nullable=False, index=True)
    data_hora = Column(DateTime, nullable=False, index=True)
    duracao_minutos = Column(Integer, nullable=False, default=30)
    status = Column(SQLEnum(StatusConsulta), nullable=False, default=StatusConsulta.AGENDADA)
    observacoes = Column(Text, nullable=True)
    
    # Relacionamentos
    paciente = relationship("Paciente", back_populates="consultas", foreign_keys=[paciente_id])
    medico = relationship("Medico", back_populates="consultas", foreign_keys=[medico_id])
    
    def to_dict(self):
        """Converte para dicionário"""
        from datetime import timedelta
        return {
            "id": self.id,
            "paciente_id": self.paciente_id,
            "medico_id": self.medico_id,
            "data_hora": self.data_hora.isoformat() if self.data_hora else None,
            "data_hora_fim": (self.data_hora + timedelta(minutes=self.duracao_minutos)).isoformat() if self.data_hora else None,
            "duracao_minutos": self.duracao_minutos,
            "status": self.status.value,
            "observacoes": self.observacoes
        }
