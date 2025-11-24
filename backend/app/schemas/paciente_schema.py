"""
Schemas Pydantic para Paciente
Validação de dados de entrada/saída da API
"""

from pydantic import BaseModel, Field, field_validator
from datetime import date
from typing import Optional
import re


class EnderecoSchema(BaseModel):
    """Schema para endereço do paciente"""
    rua: str = Field(..., min_length=3, max_length=200)
    numero: str = Field(..., min_length=1, max_length=10)
    bairro: str = Field(..., min_length=2, max_length=100)
    cidade: str = Field(..., min_length=2, max_length=100)
    estado: str = Field(..., min_length=2, max_length=2)
    cep: str = Field(..., min_length=8, max_length=9)


class PacienteBase(BaseModel):
    """Campos base do paciente"""
    nome: str = Field(..., min_length=3, max_length=200)
    cpf: str = Field(..., pattern=r'^\d{11}$')
    data_nascimento: date
    telefone: str = Field(..., min_length=10, max_length=15)
    email: str = Field(..., pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$')
    endereco: EnderecoSchema
    
    @field_validator('cpf')
    @classmethod
    def validar_cpf(cls, v):
        """Valida formato do CPF (apenas dígitos)"""
        if not re.match(r'^\d{11}$', v):
            raise ValueError('CPF deve conter 11 dígitos numéricos')
        return v
    
    @field_validator('data_nascimento')
    @classmethod
    def validar_data_nascimento(cls, v):
        """Valida se a data de nascimento não é futura"""
        from datetime import date as date_type
        if v > date_type.today():
            raise ValueError('Data de nascimento não pode ser futura')
        return v


class PacienteCreate(PacienteBase):
    """Schema para criação de paciente"""
    pass


class PacienteUpdate(BaseModel):
    """Schema para atualização de paciente (campos opcionais)"""
    nome: Optional[str] = Field(None, min_length=3, max_length=200)
    telefone: Optional[str] = Field(None, min_length=10, max_length=15)
    email: Optional[str] = Field(None, pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$')
    endereco: Optional[EnderecoSchema] = None
    ativo: Optional[bool] = None


class PacienteResponse(PacienteBase):
    """Schema de resposta com ID"""
    id: str
    ativo: bool = True
    
    class Config:
        from_attributes = True


class PacienteCredenciaisResponse(BaseModel):
    """Response com dados do paciente + credenciais criadas"""
    paciente: PacienteResponse
    username: str
    senha_temporaria: str
    mensagem: str = "Credenciais criadas com sucesso. Altere a senha no primeiro acesso."
