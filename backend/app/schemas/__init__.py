"""Schemas Pydantic - DTOs para validação"""

from app.schemas.paciente_schema import (
    PacienteCreate,
    PacienteUpdate,
    PacienteResponse
)
from app.schemas.medico_schema import (
    MedicoCreate,
    MedicoUpdate,
    MedicoResponse
)
from app.schemas.consulta_schema import (
    ConsultaCreate,
    ConsultaUpdate,
    ConsultaResponse,
    ConsultaDetalhada
)
from app.schemas.relatorio_schema import (
    RelatorioRequest,
    RelatorioResponse,
    TipoRelatorio,
    FormatoRelatorio
)

__all__ = [
    "PacienteCreate",
    "PacienteUpdate",
    "PacienteResponse",
    "MedicoCreate",
    "MedicoUpdate",
    "MedicoResponse",
    "ConsultaCreate",
    "ConsultaUpdate",
    "ConsultaResponse",
    "ConsultaDetalhada",
    "RelatorioRequest",
    "RelatorioResponse",
    "TipoRelatorio",
    "FormatoRelatorio",
]
