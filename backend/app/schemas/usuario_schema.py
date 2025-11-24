"""
Schemas Pydantic para Usuario
Autenticação e credenciais
"""

from pydantic import BaseModel, Field
from typing import Optional
from app.models.usuario import TipoUsuario


class LoginRequest(BaseModel):
    """Schema para requisição de login"""
    username: str = Field(..., min_length=3, max_length=200)
    senha: str = Field(..., min_length=6, max_length=100)


class LoginResponse(BaseModel):
    """Schema de resposta do login"""
    id: str
    username: str
    tipo: TipoUsuario
    referencia_id: Optional[str] = None
    nome: Optional[str] = None  # Nome do médico/paciente


class UsuarioCreate(BaseModel):
    """Schema para criação de usuário"""
    username: str = Field(..., min_length=3, max_length=200)
    senha: str = Field(..., min_length=6, max_length=100)
    tipo: TipoUsuario
    referencia_id: Optional[str] = None


class UsuarioResponse(BaseModel):
    """Schema de resposta de usuário (sem senha)"""
    id: str
    username: str
    tipo: TipoUsuario
    referencia_id: Optional[str] = None
    ativo: bool
    
    class Config:
        from_attributes = True


class AlterarSenhaRequest(BaseModel):
    """Schema para alteração de senha"""
    senha_atual: str = Field(..., min_length=6, max_length=100)
    senha_nova: str = Field(..., min_length=6, max_length=100)
