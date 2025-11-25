"""
Service de Consultas - lógica de negócio com validação de conflitos

Conceitos de SO demonstrados:
- Concorrência: validação de conflitos de agendamento
- Sincronização: locks para evitar race conditions
"""

from typing import List, Optional
from uuid import uuid4
from datetime import datetime, timedelta, date
from fastapi import HTTPException

from app.models.db_models import Consulta, StatusConsulta
from app.repositories.consulta_repository import ConsultaRepository
from app.repositories.paciente_repository import PacienteRepository
from app.repositories.medico_repository import MedicoRepository
from app.schemas.consulta_schema import ConsultaCreate, ConsultaUpdate, ConsultaDetalhada
from app.infra.logger import get_logger

logger = get_logger(__name__)


class ConsultaService:
    """
    Service para lógica de negócio de Consultas
    
    Implementa validação de conflitos de agendamento:
    - Médico não pode ter consultas no mesmo horário
    - Paciente não pode ter consultas no mesmo horário
    """
    
    def __init__(self):
        self.repository = ConsultaRepository()
        self.paciente_repo = PacienteRepository()
        self.medico_repo = MedicoRepository()
    
    async def listar_todas(self) -> List[Consulta]:
        """Lista todas as consultas"""
        logger.info("Listando todas as consultas")
        return await self.repository.find_all()
    
    async def listar_agendadas(self) -> List[Consulta]:
        """Lista consultas agendadas"""
        logger.info("Listando consultas agendadas")
        return await self.repository.find_agendadas()
    
    async def buscar_por_id(self, consulta_id: str) -> Optional[Consulta]:
        """Busca consulta por ID"""
        logger.info(f"Buscando consulta por ID: {consulta_id}")
        return await self.repository.find_by_id(consulta_id)
    
    async def buscar_detalhada(self, consulta_id: str) -> Optional[ConsultaDetalhada]:
        """Busca consulta com dados completos (join)"""
        consulta = await self.repository.find_by_id(consulta_id)
        if not consulta:
            return None
        
        paciente = await self.paciente_repo.find_by_id(consulta.paciente_id)
        medico = await self.medico_repo.find_by_id(consulta.medico_id)
        
        return ConsultaDetalhada(
            **consulta.to_dict(),
            paciente_nome=paciente.nome if paciente else None,
            medico_nome=medico.nome if medico else None,
            medico_especialidade=medico.especialidade if medico else None
        )
    
    async def listar_por_paciente(self, paciente_id: str) -> List[Consulta]:
        """Lista consultas de um paciente"""
        logger.info(f"Listando consultas do paciente: {paciente_id}")
        return await self.repository.find_by_paciente(paciente_id)
    
    async def listar_por_medico(self, medico_id: str) -> List[Consulta]:
        """Lista consultas de um médico"""
        logger.info(f"Listando consultas do médico: {medico_id}")
        return await self.repository.find_by_medico(medico_id)
    
    async def _validar_conflito(
        self, 
        medico_id: str, 
        data_hora: datetime, 
        duracao_minutos: int,
        consulta_id: Optional[str] = None
    ):
        """
        Valida conflitos de agendamento
        
        Conceito de SO: Controle de concorrência
        - Verifica se médico já tem consulta no horário
        - Considera sobreposição de horários
        """
        # Busca consultas do médico no mesmo dia
        consultas = await self.repository.find_by_medico_data(
            medico_id, 
            data_hora.date()
        )
        
        # Calcula horário de término da nova consulta
        fim_novo = data_hora + timedelta(minutes=duracao_minutos)
        
        for consulta in consultas:
            # Ignora a própria consulta (se for atualização)
            if consulta_id and consulta.id == consulta_id:
                continue
            
            # Ignora consultas canceladas
            if consulta.status == StatusConsulta.CANCELADA:
                continue
            
            # Verifica sobreposição de horários
            fim_existente = consulta.data_hora_fim
            
            # Há conflito se:
            # - Início da nova cai dentro da existente OU
            # - Fim da nova cai dentro da existente OU
            # - Nova consulta engloba a existente
            if (data_hora < fim_existente and fim_novo > consulta.data_hora):
                logger.warning(
                    f"Conflito de agendamento detectado: "
                    f"Médico {medico_id} já tem consulta às {consulta.data_hora}"
                )
                raise HTTPException(
                    status_code=409,
                    detail=f"Médico já possui consulta agendada às {consulta.data_hora.strftime('%H:%M')}"
                )
    
    async def criar(self, dados: ConsultaCreate) -> Consulta:
        """
        Cria nova consulta
        Valida existência de paciente e médico
        Valida conflitos de agendamento
        """
        logger.info(f"Criando consulta: Paciente {dados.paciente_id}, Médico {dados.medico_id}")
        
        # Valida paciente
        paciente = await self.paciente_repo.find_by_id(dados.paciente_id)
        if not paciente or not paciente.ativo:
            raise HTTPException(status_code=404, detail="Paciente não encontrado ou inativo")
        
        # Valida médico
        medico = await self.medico_repo.find_by_id(dados.medico_id)
        if not medico or not medico.ativo:
            raise HTTPException(status_code=404, detail="Médico não encontrado ou inativo")
        
        # Valida conflitos
        await self._validar_conflito(
            dados.medico_id,
            dados.data_hora,
            dados.duracao_minutos
        )
        
        # Cria a consulta
        consulta = Consulta(
            id=str(uuid4()),
            paciente_id=dados.paciente_id,
            medico_id=dados.medico_id,
            data_hora=dados.data_hora,
            duracao_minutos=dados.duracao_minutos,
            status=StatusConsulta.AGENDADA,
            observacoes=dados.observacoes
        )
        
        return await self.repository.create(consulta)
    
    async def atualizar(self, consulta_id: str, dados: ConsultaUpdate) -> Consulta:
        """Atualiza consulta existente"""
        logger.info(f"Atualizando consulta: {consulta_id}")
        
        consulta = await self.repository.find_by_id(consulta_id)
        if not consulta:
            raise HTTPException(status_code=404, detail="Consulta não encontrada")
        
        # Se alterando data/hora, valida conflitos
        if dados.data_hora is not None:
            duracao = dados.duracao_minutos or consulta.duracao_minutos
            await self._validar_conflito(
                consulta.medico_id,
                dados.data_hora,
                duracao,
                consulta_id
            )
            consulta.data_hora = dados.data_hora
        
        # Atualiza campos
        if dados.duracao_minutos is not None:
            consulta.duracao_minutos = dados.duracao_minutos
        if dados.status is not None:
            consulta.status = dados.status
        if dados.observacoes is not None:
            consulta.observacoes = dados.observacoes
        
        return await self.repository.update(consulta_id, consulta)
    
    async def cancelar(self, consulta_id: str) -> Consulta:
        """Cancela uma consulta"""
        logger.info(f"Cancelando consulta: {consulta_id}")
        
        consulta = await self.repository.find_by_id(consulta_id)
        if not consulta:
            raise HTTPException(status_code=404, detail="Consulta não encontrada")
        
        consulta.status = StatusConsulta.CANCELADA
        return await self.repository.update(consulta_id, consulta)
    
    async def deletar(self, consulta_id: str) -> bool:
        """Remove consulta"""
        logger.info(f"Deletando consulta: {consulta_id}")
        return await self.repository.delete(consulta_id)
    
    async def listar_horarios_disponiveis(
        self, 
        medico_id: str, 
        data: date
    ) -> List[str]:
        """
        Lista horários disponíveis para um médico em uma data específica
        
        Horário de funcionamento: 08:00 às 18:00
        Intervalos de 30 minutos
        """
        logger.info(f"Listando horários disponíveis - Médico: {medico_id}, Data: {data}")
        
        # Valida médico
        medico = await self.medico_repo.find_by_id(medico_id)
        if not medico or not medico.ativo:
            raise HTTPException(status_code=404, detail="Médico não encontrado ou inativo")
        
        # Busca consultas do médico nessa data
        consultas = await self.repository.find_by_medico_data(medico_id, data)
        
        # Gera todos os horários possíveis (08:00 - 18:00, intervalos de 30min)
        horarios_possiveis = []
        hora_inicio = 8
        hora_fim = 18
        
        for hora in range(hora_inicio, hora_fim):
            for minuto in [0, 30]:
                horarios_possiveis.append(f"{hora:02d}:{minuto:02d}")
        
        # Remove horários já ocupados
        horarios_ocupados = set()
        for consulta in consultas:
            if consulta.status == StatusConsulta.CANCELADA:
                continue
            
            # Adiciona horário da consulta e próximos slots baseado na duração
            hora_consulta = consulta.data_hora.strftime("%H:%M")
            horarios_ocupados.add(hora_consulta)
            
            # Se a consulta dura mais de 30min, marca próximos slots
            if consulta.duracao_minutos > 30:
                slots_ocupados = (consulta.duracao_minutos + 29) // 30  # Arredonda para cima
                hora_atual = consulta.data_hora
                for _ in range(1, slots_ocupados):
                    hora_atual += timedelta(minutes=30)
                    horarios_ocupados.add(hora_atual.strftime("%H:%M"))
        
        # Retorna horários disponíveis
        horarios_disponiveis = [h for h in horarios_possiveis if h not in horarios_ocupados]
        
        logger.info(f"Horários disponíveis encontrados: {len(horarios_disponiveis)}")
        return horarios_disponiveis
