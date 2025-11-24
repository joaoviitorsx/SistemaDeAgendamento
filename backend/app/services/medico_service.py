"""
Service de Médicos - lógica de negócio
"""

from typing import List, Optional
from uuid import uuid4
from fastapi import HTTPException

from app.models.medico import Medico
from app.models.usuario import Usuario, TipoUsuario
from app.repositories.medico_repository import MedicoRepository
from app.repositories.usuario_repository import UsuarioRepository
from app.schemas.medico_schema import MedicoCreate, MedicoUpdate
from app.infra.logger import get_logger

logger = get_logger(__name__)


class MedicoService:
    """Service para lógica de negócio de Médicos"""
    
    def __init__(self):
        self.repository = MedicoRepository()
        self.usuario_repository = UsuarioRepository()
    
    async def listar_todos(self) -> List[Medico]:
        """Lista todos os médicos"""
        logger.info("Listando todos os médicos")
        return await self.repository.find_all()
    
    async def listar_ativos(self) -> List[Medico]:
        """Lista apenas médicos ativos"""
        logger.info("Listando médicos ativos")
        return await self.repository.find_ativos()
    
    async def buscar_por_id(self, medico_id: str) -> Optional[Medico]:
        """Busca médico por ID"""
        logger.info(f"Buscando médico por ID: {medico_id}")
        medico = await self.repository.find_by_id(medico_id)
        if not medico:
            logger.warning(f"Médico não encontrado: {medico_id}")
        return medico
    
    async def buscar_por_especialidade(self, especialidade: str) -> List[Medico]:
        """Busca médicos por especialidade"""
        logger.info(f"Buscando médicos por especialidade: {especialidade}")
        return await self.repository.find_by_especialidade(especialidade)
    
    async def criar(self, dados: MedicoCreate) -> tuple[Medico, str, str]:
        """
        Cria novo médico
        Valida CRM único
        Cria automaticamente usuário para login
        Retorna: (medico, username, senha_temporaria)
        """
        logger.info(f"Criando médico: {dados.nome}")
        
        # Verifica se CRM já existe
        existente = await self.repository.find_by_crm(dados.crm)
        if existente:
            logger.error(f"CRM já cadastrado: {dados.crm}")
            raise HTTPException(status_code=400, detail="CRM já cadastrado")
        
        # Cria o médico
        medico = Medico(
            id=str(uuid4()),
            nome=dados.nome,
            crm=dados.crm,
            especialidade=dados.especialidade,
            telefone=dados.telefone,
            email=dados.email,
            ativo=True
        )
        
        medico_criado = await self.repository.create(medico)
        
        # Cria automaticamente o usuário para login
        username = dados.crm.lower().replace(" ", "")
        senha_padrao = "medico123"
        
        # Verifica se username já existe
        usuario_existente = await self.usuario_repository.find_by_username(username)
        if not usuario_existente:
            usuario = Usuario(
                id=str(uuid4()),
                username=username,
                senha_hash=Usuario.hash_senha(senha_padrao),
                tipo=TipoUsuario.MEDICO,
                referencia_id=medico.id,
                ativo=True
            )
            await self.usuario_repository.create(usuario)
            logger.info(f"Usuário criado para médico {dados.nome}: username={username}, senha={senha_padrao}")
        
        return medico_criado, username, senha_padrao
    
    async def atualizar(self, medico_id: str, dados: MedicoUpdate) -> Medico:
        """Atualiza médico existente"""
        logger.info(f"Atualizando médico: {medico_id}")
        
        medico = await self.repository.find_by_id(medico_id)
        if not medico:
            logger.error(f"Médico não encontrado para atualização: {medico_id}")
            raise HTTPException(status_code=404, detail="Médico não encontrado")
        
        # Atualiza apenas os campos fornecidos
        if dados.nome is not None:
            medico.nome = dados.nome
        if dados.especialidade is not None:
            medico.especialidade = dados.especialidade
        if dados.telefone is not None:
            medico.telefone = dados.telefone
        if dados.email is not None:
            medico.email = dados.email
        if dados.ativo is not None:
            medico.ativo = dados.ativo
        
        return await self.repository.update(medico_id, medico)
    
    async def deletar(self, medico_id: str) -> bool:
        """Remove médico (soft delete - marca como inativo)"""
        logger.info(f"Deletando médico: {medico_id}")
        
        medico = await self.repository.find_by_id(medico_id)
        if not medico:
            logger.error(f"Médico não encontrado para exclusão: {medico_id}")
            raise HTTPException(status_code=404, detail="Médico não encontrado")
        
        # Soft delete
        medico.ativo = False
        await self.repository.update(medico_id, medico)
        return True
