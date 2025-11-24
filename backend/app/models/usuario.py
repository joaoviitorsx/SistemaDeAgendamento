"""
Modelo de domínio: Usuário
Sistema de autenticação e autorização
"""

from dataclasses import dataclass
from enum import Enum
from typing import Optional
import hashlib


class TipoUsuario(str, Enum):
    """Tipos de usuário no sistema"""
    ADMIN = "admin"
    MEDICO = "medico"
    PACIENTE = "paciente"


@dataclass
class Usuario:
    """
    Entidade Usuário
    Gerencia credenciais e permissões de acesso
    """
    id: str
    username: str  # email ou CRM
    senha_hash: str
    tipo: TipoUsuario
    referencia_id: Optional[str] = None  # ID do médico ou paciente
    ativo: bool = True
    
    @staticmethod
    def hash_senha(senha: str) -> str:
        """Gera hash SHA-256 da senha"""
        return hashlib.sha256(senha.encode()).hexdigest()
    
    def verificar_senha(self, senha: str) -> bool:
        """Verifica se a senha está correta"""
        return self.senha_hash == self.hash_senha(senha)
    
    def to_dict(self) -> dict:
        """Converte para dicionário"""
        return {
            "id": self.id,
            "username": self.username,
            "senha_hash": self.senha_hash,
            "tipo": self.tipo.value,
            "referencia_id": self.referencia_id,
            "ativo": self.ativo
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> "Usuario":
        """Cria instância a partir de dicionário"""
        return cls(
            id=data["id"],
            username=data["username"],
            senha_hash=data["senha_hash"],
            tipo=TipoUsuario(data["tipo"]),
            referencia_id=data.get("referencia_id"),
            ativo=data.get("ativo", True)
        )
