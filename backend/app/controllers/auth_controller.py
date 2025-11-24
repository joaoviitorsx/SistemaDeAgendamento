"""
Controller de Autenticação
Endpoints para login e gerenciamento de credenciais
"""

from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional

from app.schemas.usuario_schema import LoginRequest, LoginResponse, UsuarioCreate, UsuarioResponse, AlterarSenhaRequest
from app.services.auth_service import AuthService
from app.models.usuario import TipoUsuario
from app.infra.logger import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/auth", tags=["Autenticação"])


# Dependência para verificar token (simplificado)
async def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    """
    Verifica autenticação via header Authorization
    Formato: Bearer <user_id>:<tipo>
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Não autorizado")
    
    try:
        token = authorization.replace("Bearer ", "")
        user_id, tipo = token.split(":")
        return {"id": user_id, "tipo": TipoUsuario(tipo)}
    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido")


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    """Verifica se usuário é admin"""
    if user["tipo"] != TipoUsuario.ADMIN:
        raise HTTPException(status_code=403, detail="Acesso negado: apenas administradores")
    return user


@router.post("/login", response_model=LoginResponse)
async def login(dados: LoginRequest):
    """Login de usuário"""
    service = AuthService()
    return await service.login(dados)


@router.post("/usuarios", response_model=UsuarioResponse, dependencies=[Depends(require_admin)])
async def criar_usuario(dados: UsuarioCreate, user: dict = Depends(get_current_user)):
    """
    Criar novo usuário (apenas admin)
    """
    service = AuthService()
    usuario = await service.criar_usuario(dados, user["tipo"])
    
    return UsuarioResponse(
        id=usuario.id,
        username=usuario.username,
        tipo=usuario.tipo,
        referencia_id=usuario.referencia_id,
        ativo=usuario.ativo
    )


@router.post("/alterar-senha")
async def alterar_senha(dados: AlterarSenhaRequest, user: dict = Depends(get_current_user)):
    """Alterar senha do usuário logado"""
    service = AuthService()
    await service.alterar_senha(user["id"], dados)
    return {"message": "Senha alterada com sucesso"}


@router.get("/me", response_model=dict)
async def get_current_user_info(user: dict = Depends(get_current_user)):
    """Retorna informações do usuário logado"""
    return user
