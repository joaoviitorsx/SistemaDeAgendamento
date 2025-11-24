"""
Controller de Consultas - rotas HTTP
"""

from typing import List
from datetime import datetime
from fastapi import APIRouter, HTTPException, Query, status

from app.schemas.consulta_schema import (
    ConsultaCreate, 
    ConsultaUpdate, 
    ConsultaResponse,
    ConsultaDetalhada
)
from app.services.consulta_service import ConsultaService
from app.infra.logger import get_logger

logger = get_logger(__name__)
router = APIRouter()
service = ConsultaService()


@router.get("/consultas", response_model=List[ConsultaResponse])
async def listar_consultas(
    apenas_agendadas: bool = Query(False, description="Apenas consultas agendadas"),
    paciente_id: str = Query(None, description="Filtrar por paciente"),
    medico_id: str = Query(None, description="Filtrar por médico")
):
    """Lista consultas com filtros opcionais"""
    if paciente_id:
        consultas = await service.listar_por_paciente(paciente_id)
    elif medico_id:
        consultas = await service.listar_por_medico(medico_id)
    elif apenas_agendadas:
        consultas = await service.listar_agendadas()
    else:
        consultas = await service.listar_todas()
    
    return [ConsultaResponse(**c.to_dict()) for c in consultas]


@router.get("/consultas/{consulta_id}", response_model=ConsultaDetalhada)
async def buscar_consulta(consulta_id: str):
    """Busca consulta por ID com detalhes completos"""
    consulta = await service.buscar_detalhada(consulta_id)
    if not consulta:
        raise HTTPException(status_code=404, detail="Consulta não encontrada")
    
    return consulta


@router.post("/consultas", response_model=ConsultaResponse, status_code=status.HTTP_201_CREATED)
async def criar_consulta(dados: ConsultaCreate):
    """
    Cria nova consulta
    Valida conflitos de agendamento automaticamente
    """
    consulta = await service.criar(dados)
    return ConsultaResponse(**consulta.to_dict())


@router.put("/consultas/{consulta_id}", response_model=ConsultaResponse)
async def atualizar_consulta(consulta_id: str, dados: ConsultaUpdate):
    """Atualiza consulta existente"""
    consulta = await service.atualizar(consulta_id, dados)
    return ConsultaResponse(**consulta.to_dict())


@router.post("/consultas/{consulta_id}/cancelar", response_model=ConsultaResponse)
async def cancelar_consulta(consulta_id: str):
    """Cancela uma consulta"""
    consulta = await service.cancelar(consulta_id)
    return ConsultaResponse(**consulta.to_dict())


@router.delete("/consultas/{consulta_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deletar_consulta(consulta_id: str):
    """Remove consulta permanentemente"""
    await service.deletar(consulta_id)
    return None


@router.get("/consultas/horarios-disponiveis/{medico_id}/{data}", response_model=List[str])
async def listar_horarios_disponiveis(medico_id: str, data: str):
    """
    Lista horários disponíveis para um médico em uma data específica
    
    Args:
        medico_id: ID do médico
        data: Data no formato YYYY-MM-DD
        
    Returns:
        Lista de horários disponíveis no formato HH:MM
    """
    try:
        # Converte string para date
        data_obj = datetime.strptime(data, "%Y-%m-%d").date()
        horarios = await service.listar_horarios_disponiveis(medico_id, data_obj)
        return horarios
    except ValueError:
        raise HTTPException(
            status_code=400, 
            detail="Formato de data inválido. Use YYYY-MM-DD"
        )
