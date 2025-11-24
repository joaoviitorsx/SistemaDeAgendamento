"""
Service de Relatórios - geração de PDFs e CSVs

Conceitos de SO demonstrados:
- Operações de I/O em threads separadas
- Geração de arquivos
- Paths específicos por SO
"""

import csv
from datetime import datetime, date
from pathlib import Path
from typing import List
from uuid import uuid4

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer

from app.repositories.consulta_repository import ConsultaRepository
from app.repositories.paciente_repository import PacienteRepository
from app.repositories.medico_repository import MedicoRepository
from app.schemas.relatorio_schema import RelatorioRequest, RelatorioResponse, TipoRelatorio, FormatoRelatorio
from app.infra.config import get_config
from app.infra.logger import get_logger
from app.infra.concurrency import get_concurrency_manager

logger = get_logger(__name__)


class RelatorioService:
    """
    Service para geração de relatórios
    
    Conceitos de SO:
    - Operações de I/O pesadas em threads
    - Sistema de arquivos (criação em paths específicos)
    - Encoding apropriado
    """
    
    def __init__(self):
        self.config = get_config()
        self.consulta_repo = ConsultaRepository()
        self.paciente_repo = PacienteRepository()
        self.medico_repo = MedicoRepository()
        self.concurrency = get_concurrency_manager()
    
    async def gerar_relatorio(self, request: RelatorioRequest) -> RelatorioResponse:
        """
        Gera relatório conforme especificação
        Usa thread pool para não bloquear
        """
        logger.info(f"Gerando relatório: {request.tipo.value} - Formato: {request.formato.value}")
        
        # Valida filtros
        request.validate_filters()
        
        # Busca dados
        consultas = await self._buscar_consultas(request)
        
        # Gera arquivo em thread separada (I/O pesado)
        if request.formato == FormatoRelatorio.PDF:
            file_path = await self.concurrency.run_in_thread(
                self._gerar_pdf, request, consultas
            )
        elif request.formato == FormatoRelatorio.CSV:
            file_path = await self.concurrency.run_in_thread(
                self._gerar_csv, request, consultas
            )
        else:
            file_path = await self.concurrency.run_in_thread(
                self._gerar_excel, request, consultas
            )
        
        # Informações do arquivo
        stat = file_path.stat()
        
        return RelatorioResponse(
            arquivo=file_path.name,
            caminho=str(file_path),
            tipo=request.tipo,
            formato=request.formato,
            data_geracao=datetime.now(),
            tamanho_bytes=stat.st_size
        )
    
    async def _buscar_consultas(self, request: RelatorioRequest):
        """Busca consultas conforme filtros"""
        if request.tipo == TipoRelatorio.POR_PACIENTE:
            return await self.consulta_repo.find_by_paciente(request.paciente_id)
        
        elif request.tipo == TipoRelatorio.POR_MEDICO:
            return await self.consulta_repo.find_by_medico(request.medico_id)
        
        elif request.tipo == TipoRelatorio.POR_PERIODO:
            data_inicio = datetime.combine(request.data_inicio, datetime.min.time())
            data_fim = datetime.combine(request.data_fim, datetime.max.time())
            return await self.consulta_repo.find_by_periodo(data_inicio, data_fim)
        
        else:  # GERAL
            return await self.consulta_repo.find_all()
    
    def _gerar_pdf(self, request: RelatorioRequest, consultas: list) -> Path:
        """Gera relatório em PDF"""
        # Nome do arquivo
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"relatorio_{request.tipo.value}_{timestamp}.pdf"
        file_path = self.config.reports_dir / filename
        
        # Garante que diretório existe
        file_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Cria documento
        doc = SimpleDocTemplate(str(file_path), pagesize=A4)
        elements = []
        styles = getSampleStyleSheet()
        
        # Título
        title = Paragraph(f"<b>Relatório de Consultas - {request.tipo.value.replace('_', ' ').title()}</b>", styles['Title'])
        elements.append(title)
        elements.append(Spacer(1, 12))
        
        # Data de geração
        data_text = Paragraph(f"Gerado em: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}", styles['Normal'])
        elements.append(data_text)
        elements.append(Spacer(1, 12))
        
        # Tabela de dados
        data = [["ID", "Paciente", "Médico", "Data/Hora", "Status"]]
        
        for consulta in consultas:
            data.append([
                consulta.id[:8],
                consulta.paciente_id[:8],
                consulta.medico_id[:8],
                consulta.data_hora.strftime("%d/%m/%Y %H:%M"),
                consulta.status.value
            ])
        
        table = Table(data)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        elements.append(table)
        
        # Gera PDF
        doc.build(elements)
        
        logger.info(f"PDF gerado: {file_path}")
        return file_path
    
    def _gerar_csv(self, request: RelatorioRequest, consultas: list) -> Path:
        """Gera relatório em CSV"""
        # Nome do arquivo
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"relatorio_{request.tipo.value}_{timestamp}.csv"
        file_path = self.config.reports_dir / filename
        
        # Garante que diretório existe
        file_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Escreve CSV
        with open(file_path, 'w', newline='', encoding=self.config.file_encoding) as csvfile:
            writer = csv.writer(csvfile)
            
            # Cabeçalho
            writer.writerow(['ID', 'Paciente ID', 'Médico ID', 'Data/Hora', 'Duração (min)', 'Status', 'Observações'])
            
            # Dados
            for consulta in consultas:
                writer.writerow([
                    consulta.id,
                    consulta.paciente_id,
                    consulta.medico_id,
                    consulta.data_hora.isoformat(),
                    consulta.duracao_minutos,
                    consulta.status.value,
                    consulta.observacoes or ''
                ])
        
        logger.info(f"CSV gerado: {file_path}")
        return file_path
    
    def _gerar_excel(self, request: RelatorioRequest, consultas: list) -> Path:
        """Gera relatório em Excel"""
        from openpyxl import Workbook
        
        # Nome do arquivo
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"relatorio_{request.tipo.value}_{timestamp}.xlsx"
        file_path = self.config.reports_dir / filename
        
        # Garante que diretório existe
        file_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Cria workbook
        wb = Workbook()
        ws = wb.active
        ws.title = "Consultas"
        
        # Cabeçalho
        ws.append(['ID', 'Paciente ID', 'Médico ID', 'Data/Hora', 'Duração (min)', 'Status', 'Observações'])
        
        # Dados
        for consulta in consultas:
            ws.append([
                consulta.id,
                consulta.paciente_id,
                consulta.medico_id,
                consulta.data_hora.strftime("%d/%m/%Y %H:%M"),
                consulta.duracao_minutos,
                consulta.status.value,
                consulta.observacoes or ''
            ])
        
        # Salva
        wb.save(file_path)
        
        logger.info(f"Excel gerado: {file_path}")
        return file_path


# Singleton
_relatorio_service: RelatorioService | None = None


def get_relatorio_service() -> RelatorioService:
    """Retorna a instância do relatório service"""
    global _relatorio_service
    if _relatorio_service is None:
        _relatorio_service = RelatorioService()
    return _relatorio_service
