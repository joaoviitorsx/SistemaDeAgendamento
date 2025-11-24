"""
Modelo de domínio: Médico
"""

from dataclasses import dataclass
from typing import Optional


@dataclass
class Medico:
    """
    Entidade Médico
    
    Representa um médico no sistema de agendamento
    """
    id: str
    nome: str
    crm: str
    especialidade: str
    telefone: str
    email: str
    ativo: bool = True
    
    def to_dict(self) -> dict:
        """Converte para dicionário (para serialização)"""
        return {
            "id": self.id,
            "nome": self.nome,
            "crm": self.crm,
            "especialidade": self.especialidade,
            "telefone": self.telefone,
            "email": self.email,
            "ativo": self.ativo
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> "Medico":
        """Cria instância a partir de dicionário"""
        return cls(
            id=data["id"],
            nome=data["nome"],
            crm=data["crm"],
            especialidade=data["especialidade"],
            telefone=data["telefone"],
            email=data["email"],
            ativo=data.get("ativo", True)
        )
