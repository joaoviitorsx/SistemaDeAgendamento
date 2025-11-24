"""
Controller de Médicos - rotas HTTP
"""

from typing import List
from fastapi import APIRouter, HTTPException, Query, status, Request
from fastapi.exceptions import RequestValidationError

from app.schemas.medico_schema import MedicoCreate, MedicoUpdate, MedicoResponse, MedicoCredenciaisResponse
from app.services.medico_service import MedicoService
from app.infra.logger import get_logger

logger = get_logger(__name__)
router = APIRouter()
service = MedicoService()


@router.get("/medicos", response_model=List[MedicoResponse])
async def listar_medicos(
    apenas_ativos: bool = True,
    especialidade: str = Query(None, description="Filtrar por especialidade")
):
    """Lista todos os médicos, com filtro opcional por especialidade"""
    if especialidade:
        medicos = await service.buscar_por_especialidade(especialidade)
    elif apenas_ativos:
        medicos = await service.listar_ativos()
    else:
        medicos = await service.listar_todos()
    
    return [MedicoResponse(**m.to_dict()) for m in medicos]


@router.get("/medicos/{medico_id}", response_model=MedicoResponse)
async def buscar_medico(medico_id: str):
    """Busca médico por ID"""
    medico = await service.buscar_por_id(medico_id)
    if not medico:
        raise HTTPException(status_code=404, detail="Médico não encontrado")
    
    return MedicoResponse(**medico.to_dict())


@router.post("/medicos", response_model=MedicoCredenciaisResponse, status_code=status.HTTP_201_CREATED)
async def criar_medico(dados: MedicoCreate):
    """Cria novo médico e retorna as credenciais de acesso"""
    try:
        logger.info(f"Recebendo dados para criar médico: {dados.model_dump()}")
        medico, username, senha = await service.criar(dados)
        
        return MedicoCredenciaisResponse(
            medico=MedicoResponse(**medico.to_dict()),
            username=username,
            senha_temporaria=senha
        )
    except Exception as e:
        logger.error(f"Erro ao criar médico: {e}")
        raise


@router.put("/medicos/{medico_id}", response_model=MedicoResponse)
async def atualizar_medico(medico_id: str, dados: MedicoUpdate):
    """Atualiza médico existente"""
    medico = await service.atualizar(medico_id, dados)
    return MedicoResponse(**medico.to_dict())


@router.delete("/medicos/{medico_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deletar_medico(medico_id: str):
    """Remove médico (soft delete)"""
    await service.deletar(medico_id)
    return None
