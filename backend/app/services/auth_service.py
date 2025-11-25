"""
Service de Autenticação
Gerencia login, criação de usuários e permissões
"""

from typing import Optional
from uuid import uuid4
from fastapi import HTTPException

from app.models.db_models import Usuario, TipoUsuario
from app.repositories.usuario_repository import UsuarioRepository
from app.repositories.medico_repository import MedicoRepository
from app.repositories.paciente_repository import PacienteRepository
from app.schemas.usuario_schema import UsuarioCreate, LoginRequest, LoginResponse, AlterarSenhaRequest
from app.infra.logger import get_logger

logger = get_logger(__name__)


class AuthService:
    """Service para autenticação e gerenciamento de usuários"""
    
    def __init__(self):
        self.repository = UsuarioRepository()
        self.medico_repo = MedicoRepository()
        self.paciente_repo = PacienteRepository()
    
    async def login(self, dados: LoginRequest) -> LoginResponse:
        """Autentica usuário e retorna dados"""
        logger.info(f"Tentativa de login: {dados.username}")
        
        usuario = await self.repository.find_by_username(dados.username)
        if not usuario or not usuario.ativo:
            logger.warning(f"Usuário não encontrado ou inativo: {dados.username}")
            raise HTTPException(status_code=401, detail="Credenciais inválidas")
        
        if not usuario.verificar_senha(dados.senha):
            logger.warning(f"Senha incorreta para usuário: {dados.username}")
            raise HTTPException(status_code=401, detail="Credenciais inválidas")
        
        # Buscar nome do médico/paciente
        nome = None
        if usuario.tipo == TipoUsuario.MEDICO and usuario.referencia_id:
            medico = await self.medico_repo.find_by_id(usuario.referencia_id)
            nome = medico.nome if medico else None
        elif usuario.tipo == TipoUsuario.PACIENTE and usuario.referencia_id:
            paciente = await self.paciente_repo.find_by_id(usuario.referencia_id)
            nome = paciente.nome if paciente else None
        elif usuario.tipo == TipoUsuario.ADMIN:
            nome = "Administrador"
        
        logger.info(f"Login bem-sucedido: {dados.username}")
        
        return LoginResponse(
            id=usuario.id,
            username=usuario.username,
            tipo=usuario.tipo,
            referencia_id=usuario.referencia_id,
            nome=nome
        )
    
    async def criar_usuario(self, dados: UsuarioCreate, criador_tipo: TipoUsuario) -> Usuario:
        """
        Cria novo usuário
        Apenas admins podem criar usuários
        """
        if criador_tipo != TipoUsuario.ADMIN:
            raise HTTPException(status_code=403, detail="Apenas administradores podem criar usuários")
        
        logger.info(f"Criando usuário: {dados.username}")
        
        # Verifica se username já existe
        existente = await self.repository.find_by_username(dados.username)
        if existente:
            raise HTTPException(status_code=400, detail="Username já cadastrado")
        
        # Valida referência se for médico ou paciente
        if dados.tipo == TipoUsuario.MEDICO and dados.referencia_id:
            medico = await self.medico_repo.find_by_id(dados.referencia_id)
            if not medico:
                raise HTTPException(status_code=404, detail="Médico não encontrado")
        elif dados.tipo == TipoUsuario.PACIENTE and dados.referencia_id:
            paciente = await self.paciente_repo.find_by_id(dados.referencia_id)
            if not paciente:
                raise HTTPException(status_code=404, detail="Paciente não encontrado")
        
        # Cria usuário
        usuario = Usuario(
            id=str(uuid4()),
            username=dados.username,
            senha_hash=Usuario.hash_senha(dados.senha),
            tipo=dados.tipo,
            referencia_id=dados.referencia_id,
            ativo=True
        )
        
        return await self.repository.create(usuario)
    
    async def alterar_senha(self, usuario_id: str, dados: AlterarSenhaRequest) -> bool:
        """Altera senha do usuário"""
        logger.info(f"Alterando senha do usuário: {usuario_id}")
        
        usuario = await self.repository.find_by_id(usuario_id)
        if not usuario:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        
        if not usuario.verificar_senha(dados.senha_atual):
            raise HTTPException(status_code=400, detail="Senha atual incorreta")
        
        usuario.senha_hash = Usuario.hash_senha(dados.senha_nova)
        await self.repository.update(usuario_id, usuario)
        
        logger.info(f"Senha alterada com sucesso: {usuario_id}")
        return True
    
    async def criar_usuario_admin_inicial(self):
        """Cria usuário admin inicial se não existir"""
        admin = await self.repository.find_by_username("admin")
        if not admin:
            admin = Usuario(
                id=str(uuid4()),
                username="admin",
                senha_hash=Usuario.hash_senha("admin123"),
                tipo=TipoUsuario.ADMIN,
                ativo=True
            )
            await self.repository.create(admin)
            logger.info("Usuário admin inicial criado")
