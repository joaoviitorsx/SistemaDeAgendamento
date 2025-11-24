"""
Controller de Pacientes - rotas HTTP
"""

from typing import List
from fastapi import APIRouter, HTTPException, status

from app.schemas.paciente_schema import PacienteCreate, PacienteUpdate, PacienteResponse, PacienteCredenciaisResponse
from app.services.paciente_service import PacienteService
from app.infra.logger import get_logger

logger = get_logger(__name__)
router = APIRouter()
service = PacienteService()


@router.get("/pacientes", response_model=List[PacienteResponse])
async def listar_pacientes(apenas_ativos: bool = True):
    """Lista todos os pacientes"""
    if apenas_ativos:
        pacientes = await service.listar_ativos()
    else:
        pacientes = await service.listar_todos()
    
    return [PacienteResponse(**p.to_dict()) for p in pacientes]


@router.get("/pacientes/{paciente_id}", response_model=PacienteResponse)
async def buscar_paciente(paciente_id: str):
    """Busca paciente por ID"""
    paciente = await service.buscar_por_id(paciente_id)
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    
    return PacienteResponse(**paciente.to_dict())


@router.post("/pacientes", response_model=PacienteCredenciaisResponse, status_code=status.HTTP_201_CREATED)
async def criar_paciente(dados: PacienteCreate):
    """Cria novo paciente e retorna as credenciais de acesso"""
    paciente, username, senha = await service.criar(dados)
    
    return PacienteCredenciaisResponse(
        paciente=PacienteResponse(**paciente.to_dict()),
        username=username,
        senha_temporaria=senha
    )


@router.put("/pacientes/{paciente_id}", response_model=PacienteResponse)
async def atualizar_paciente(paciente_id: str, dados: PacienteUpdate):
    """Atualiza paciente existente"""
    paciente = await service.atualizar(paciente_id, dados)
    return PacienteResponse(**paciente.to_dict())


@router.delete("/pacientes/{paciente_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deletar_paciente(paciente_id: str):
    """Remove paciente (soft delete)"""
    await service.deletar(paciente_id)
    return None
