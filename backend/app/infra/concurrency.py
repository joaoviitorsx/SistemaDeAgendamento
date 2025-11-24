"""
Gerenciamento de concorrência - threads e processos

Conceitos de SO demonstrados:
- ThreadPoolExecutor para operações I/O
- ProcessPoolExecutor para operações CPU-bound
- Controle de concorrência e sincronização
- Escalonamento de tarefas
"""

import asyncio
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
from typing import Callable, Any
import multiprocessing

from app.infra.logger import get_logger

logger = get_logger(__name__)


class ConcurrencyManager:
    """
    Gerenciador de pools de threads e processos
    """
    
    def __init__(self, max_workers: int = None):
        """
        Inicializa os pools
        
        Args:
            max_workers: Número máximo de workers (default: CPU count)
        """
        if max_workers is None:
            max_workers = multiprocessing.cpu_count()
        
        self.max_workers = max_workers
        self._thread_pool = ThreadPoolExecutor(max_workers=max_workers)
        self._process_pool = ProcessPoolExecutor(max_workers=max_workers)
        
        logger.info(f"ConcurrencyManager iniciado com {max_workers} workers")
    
    async def run_in_thread(self, func: Callable, *args, **kwargs) -> Any:
        """
        Executa função em thread separada (bom para I/O)
        
        Conceito: I/O assíncrono usando threads
        - Não bloqueia o event loop principal
        - Ideal para operações de arquivo, rede, etc.
        """
        loop = asyncio.get_event_loop()
        try:
            result = await loop.run_in_executor(
                self._thread_pool,
                lambda: func(*args, **kwargs)
            )
            return result
        except Exception as e:
            logger.error(f"Erro ao executar em thread: {e}")
            raise
    
    async def run_in_process(self, func: Callable, *args, **kwargs) -> Any:
        """
        Executa função em processo separado (bom para CPU-bound)
        
        Conceito: Processamento paralelo multi-processo
        - Contorna o GIL do Python
        - Ideal para operações pesadas de CPU
        """
        loop = asyncio.get_event_loop()
        try:
            result = await loop.run_in_executor(
                self._process_pool,
                lambda: func(*args, **kwargs)
            )
            return result
        except Exception as e:
            logger.error(f"Erro ao executar em processo: {e}")
            raise
    
    def shutdown(self, wait: bool = True):
        """Finaliza os pools de forma limpa"""
        logger.info("Encerrando pools de threads e processos...")
        self._thread_pool.shutdown(wait=wait)
        self._process_pool.shutdown(wait=wait)


# Instância singleton
_concurrency_manager: ConcurrencyManager | None = None


def get_concurrency_manager() -> ConcurrencyManager:
    """Retorna a instância do gerenciador de concorrência"""
    global _concurrency_manager
    if _concurrency_manager is None:
        _concurrency_manager = ConcurrencyManager()
    return _concurrency_manager
