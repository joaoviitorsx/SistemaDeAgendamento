"""
Modelo de domínio: Paciente
"""

from dataclasses import dataclass
from datetime import date
from typing import Optional, Dict


@dataclass
class Endereco:
    """Endereço estruturado"""
    rua: str
    numero: str
    bairro: str
    cidade: str
    estado: str
    cep: str
    
    def to_dict(self) -> dict:
        return {
            "rua": self.rua,
            "numero": self.numero,
            "bairro": self.bairro,
            "cidade": self.cidade,
            "estado": self.estado,
            "cep": self.cep
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> "Endereco":
        return cls(
            rua=data["rua"],
            numero=data["numero"],
            bairro=data["bairro"],
            cidade=data["cidade"],
            estado=data["estado"],
            cep=data["cep"]
        )


@dataclass
class Paciente:
    """
    Entidade Paciente
    
    Representa um paciente no sistema de agendamento
    """
    id: str
    nome: str
    cpf: str
    data_nascimento: date
    telefone: str
    email: str
    endereco: Endereco
    ativo: bool = True
    
    def to_dict(self) -> dict:
        """Converte para dicionário (para serialização)"""
        return {
            "id": self.id,
            "nome": self.nome,
            "cpf": self.cpf,
            "data_nascimento": self.data_nascimento.isoformat(),
            "telefone": self.telefone,
            "email": self.email,
            "endereco": self.endereco.to_dict() if isinstance(self.endereco, Endereco) else self.endereco,
            "ativo": self.ativo
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> "Paciente":
        """Cria instância a partir de dicionário"""
        from datetime import date as date_type
        
        data_nasc = data["data_nascimento"]
        if isinstance(data_nasc, str):
            data_nasc = date_type.fromisoformat(data_nasc)
        
        endereco = data["endereco"]
        # Migração automática: converte string para objeto estruturado
        if isinstance(endereco, str):
            # Cria um endereço padrão quando é string legada
            endereco = Endereco(
                rua=endereco,
                numero="S/N",
                bairro="Centro",
                cidade="Não informado",
                estado="--",
                cep="00000000"
            )
        elif isinstance(endereco, dict):
            endereco = Endereco.from_dict(endereco)
        
        return cls(
            id=data["id"],
            nome=data["nome"],
            cpf=data["cpf"],
            data_nascimento=data_nasc,
            telefone=data["telefone"],
            email=data["email"],
            endereco=endereco,
            ativo=data.get("ativo", True)
        )

