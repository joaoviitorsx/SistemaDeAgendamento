"""Controllers - rotas da API"""

from app.controllers import (
    paciente_controller,
    medico_controller,
    consulta_controller,
    relatorio_controller,
    sistema_controller
)

__all__ = [
    "paciente_controller",
    "medico_controller",
    "consulta_controller",
    "relatorio_controller",
    "sistema_controller",
]
