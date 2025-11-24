"""
Schemas Pydantic para Médico
Validação de dados de entrada/saída da API
"""

from pydantic import BaseModel, Field, validator
from typing import Optional
import re


class MedicoBase(BaseModel):
    """Campos base do médico"""
    nome: str = Field(..., min_length=3, max_length=100)
    crm: str = Field(..., min_length=4, max_length=10)
    especialidade: str = Field(..., min_length=3, max_length=50)
    telefone: str = Field(..., min_length=10, max_length=15)
    email: str = Field(..., pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$')
    
    @validator('crm')
    def validar_crm(cls, v):
        """Valida formato básico do CRM"""
        if not re.match(r'^[A-Z0-9/-]+$', v.upper()):
            raise ValueError('CRM deve conter apenas letras, números, "/" e "-"')
        return v.upper()


class MedicoCreate(MedicoBase):
    """Schema para criação de médico"""
    pass


class MedicoUpdate(BaseModel):
    """Schema para atualização de médico (campos opcionais)"""
    nome: Optional[str] = Field(None, min_length=3, max_length=200)
    especialidade: Optional[str] = Field(None, min_length=3, max_length=100)
    telefone: Optional[str] = Field(None, min_length=10, max_length=15)
    email: Optional[str] = Field(None, pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$')
    ativo: Optional[bool] = None


class MedicoResponse(MedicoBase):
    """Schema de resposta com ID"""
    id: str
    ativo: bool = True
    
    class Config:
        from_attributes = True


class MedicoCredenciaisResponse(BaseModel):
    """Response com dados do médico + credenciais criadas"""
    medico: MedicoResponse
    username: str
    senha_temporaria: str
    mensagem: str = "Credenciais criadas com sucesso. Altere a senha no primeiro acesso."
