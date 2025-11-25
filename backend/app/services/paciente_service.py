"""
Service de Pacientes - lógica de negócio
"""

from typing import List, Optional
from uuid import uuid4
from fastapi import HTTPException
import json

from app.models.db_models import Paciente, Usuario, TipoUsuario
from app.repositories.paciente_repository import PacienteRepository
from app.repositories.usuario_repository import UsuarioRepository
from app.schemas.paciente_schema import PacienteCreate, PacienteUpdate
from app.infra.logger import get_logger

logger = get_logger(__name__)


class PacienteService:
    """Service para lógica de negócio de Pacientes"""
    
    def __init__(self):
        self.repository = PacienteRepository()
        self.usuario_repository = UsuarioRepository()
    
    async def listar_todos(self) -> List[Paciente]:
        """Lista todos os pacientes"""
        logger.info("Listando todos os pacientes")
        return await self.repository.find_all()
    
    async def listar_ativos(self) -> List[Paciente]:
        """Lista apenas pacientes ativos"""
        logger.info("Listando pacientes ativos")
        return await self.repository.find_ativos()
    
    async def buscar_por_id(self, paciente_id: str) -> Optional[Paciente]:
        """Busca paciente por ID"""
        logger.info(f"Buscando paciente por ID: {paciente_id}")
        paciente = await self.repository.find_by_id(paciente_id)
        if not paciente:
            logger.warning(f"Paciente não encontrado: {paciente_id}")
        return paciente
    
    async def criar(self, dados: PacienteCreate) -> tuple[Paciente, str, str]:
        """
        Cria novo paciente
        Valida CPF único
        Cria automaticamente usuário para login
        Retorna: (paciente, username, senha_temporaria)
        """
        logger.info(f"Criando paciente: {dados.nome}")
        
        # Verifica se CPF já existe
        existente = await self.repository.find_by_cpf(dados.cpf)
        if existente:
            logger.error(f"CPF já cadastrado: {dados.cpf}")
            raise HTTPException(status_code=400, detail="CPF já cadastrado")
        
        # Cria o paciente
        endereco_json = json.dumps({
            "rua": dados.endereco.rua,
            "numero": dados.endereco.numero,
            "bairro": dados.endereco.bairro,
            "cidade": dados.endereco.cidade,
            "estado": dados.endereco.estado,
            "cep": dados.endereco.cep
        })
        
        paciente = Paciente(
            id=str(uuid4()),
            nome=dados.nome,
            cpf=dados.cpf,
            data_nascimento=dados.data_nascimento,
            telefone=dados.telefone,
            email=dados.email,
            endereco=endereco_json,
            ativo=True
        )
        
        paciente_criado = await self.repository.create(paciente)
        
        # Cria automaticamente o usuário para login
        username = dados.email.lower() if dados.email else f"paciente_{dados.cpf}"
        senha_padrao = "paciente123"
        
        # Verifica se username já existe
        usuario_existente = await self.usuario_repository.find_by_username(username)
        if not usuario_existente:
            usuario = Usuario(
                id=str(uuid4()),
                username=username,
                senha_hash=Usuario.hash_senha(senha_padrao),
                tipo=TipoUsuario.PACIENTE,
                referencia_id=paciente.id,
                ativo=True
            )
            await self.usuario_repository.create(usuario)
            logger.info(f"Usuário criado para paciente {dados.nome}: username={username}, senha={senha_padrao}")
        
        return paciente_criado, username, senha_padrao
    
    async def atualizar(self, paciente_id: str, dados: PacienteUpdate) -> Paciente:
        """Atualiza paciente existente"""
        logger.info(f"Atualizando paciente: {paciente_id}")
        
        paciente = await self.repository.find_by_id(paciente_id)
        if not paciente:
            logger.error(f"Paciente não encontrado para atualização: {paciente_id}")
            raise HTTPException(status_code=404, detail="Paciente não encontrado")
        
        # Atualiza apenas os campos fornecidos
        if dados.nome is not None:
            paciente.nome = dados.nome
        if dados.telefone is not None:
            paciente.telefone = dados.telefone
        if dados.email is not None:
            paciente.email = dados.email
        if dados.endereco is not None:
            paciente.endereco = json.dumps({
                "rua": dados.endereco.rua,
                "numero": dados.endereco.numero,
                "bairro": dados.endereco.bairro,
                "cidade": dados.endereco.cidade,
                "estado": dados.endereco.estado,
                "cep": dados.endereco.cep
            })
        if dados.ativo is not None:
            paciente.ativo = dados.ativo
        
        return await self.repository.update(paciente_id, paciente)
    
    async def deletar(self, paciente_id: str) -> bool:
        """Remove paciente (soft delete - marca como inativo)"""
        logger.info(f"Deletando paciente: {paciente_id}")
        
        paciente = await self.repository.find_by_id(paciente_id)
        if not paciente:
            logger.error(f"Paciente não encontrado para exclusão: {paciente_id}")
            raise HTTPException(status_code=404, detail="Paciente não encontrado")
        
        # Soft delete
        paciente.ativo = False
        await self.repository.update(paciente_id, paciente)
        return True
