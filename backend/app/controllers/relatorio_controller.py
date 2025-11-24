"""
Controller de Relatórios - rotas HTTP
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.schemas.relatorio_schema import RelatorioRequest, RelatorioResponse
from app.services.relatorio_service import get_relatorio_service
from app.infra.logger import get_logger

logger = get_logger(__name__)
router = APIRouter()


@router.post("/relatorios/gerar", response_model=RelatorioResponse)
async def gerar_relatorio(request: RelatorioRequest):
    """
    Gera relatório conforme especificação
    
    Conceito de SO: Operação de I/O pesada executada em thread separada
    """
    service = get_relatorio_service()
    
    try:
        relatorio = await service.gerar_relatorio(request)
        return relatorio
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Erro ao gerar relatório: {e}")
        raise HTTPException(status_code=500, detail="Erro ao gerar relatório")


@router.get("/relatorios/download/{arquivo}")
async def download_relatorio(arquivo: str):
    """
    Download de relatório gerado
    
    Retorna o arquivo para download no frontend
    """
    from app.infra.config import get_config
    
    config = get_config()
    file_path = config.reports_dir / arquivo
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Relatório não encontrado")
    
    # Determina media type
    media_type = "application/pdf" if arquivo.endswith(".pdf") else "text/csv"
    
    return FileResponse(
        path=str(file_path),
        filename=arquivo,
        media_type=media_type
    )
