"""
Service de Cache - gerenciamento de cache em memória

Conceitos de SO demonstrados:
- Gerenciamento de memória
- Estruturas de dados dinâmicas
- TTL (Time To Live) para evitar consumo excessivo
"""

from typing import Any, Optional, Dict
from datetime import datetime, timedelta
from dataclasses import dataclass

from app.infra.logger import get_logger
from app.infra.config import get_config

logger = get_logger(__name__)


@dataclass
class CacheEntry:
    """Entrada do cache com TTL"""
    value: Any
    expires_at: datetime


class CacheService:
    """
    Service de cache em memória
    
    Conceito de SO: Gerenciamento de memória
    - Cache LRU-like (limitado por tamanho)
    - TTL para expiração automática
    - Limpeza periódica de dados expirados
    """
    
    def __init__(self):
        self.config = get_config()
        self._cache: Dict[str, CacheEntry] = {}
        self.max_size = self.config.cache_max_size
        self.ttl_seconds = self.config.cache_ttl_seconds
        logger.info(f"CacheService iniciado - Max: {self.max_size}, TTL: {self.ttl_seconds}s")
    
    def _is_expired(self, entry: CacheEntry) -> bool:
        """Verifica se entrada está expirada"""
        return datetime.now() > entry.expires_at
    
    def _cleanup_expired(self):
        """
        Remove entradas expiradas
        Conceito: Liberação de memória
        """
        expired_keys = [
            key for key, entry in self._cache.items() 
            if self._is_expired(entry)
        ]
        
        for key in expired_keys:
            del self._cache[key]
        
        if expired_keys:
            logger.debug(f"Cache: {len(expired_keys)} entradas expiradas removidas")
    
    def _evict_oldest(self):
        """
        Remove entrada mais antiga se cache estiver cheio
        Conceito: Gerenciamento de memória limitada
        """
        if len(self._cache) >= self.max_size:
            oldest_key = min(
                self._cache.keys(),
                key=lambda k: self._cache[k].expires_at
            )
            del self._cache[oldest_key]
            logger.debug(f"Cache: Entrada mais antiga removida (key={oldest_key})")
    
    def get(self, key: str) -> Optional[Any]:
        """
        Busca valor no cache
        Retorna None se não encontrado ou expirado
        """
        if key not in self._cache:
            logger.debug(f"Cache MISS: {key}")
            return None
        
        entry = self._cache[key]
        
        if self._is_expired(entry):
            del self._cache[key]
            logger.debug(f"Cache EXPIRED: {key}")
            return None
        
        logger.debug(f"Cache HIT: {key}")
        return entry.value
    
    def set(self, key: str, value: Any, ttl_seconds: Optional[int] = None):
        """
        Armazena valor no cache com TTL
        """
        # Limpeza antes de adicionar
        self._cleanup_expired()
        
        # Evict se necessário
        if key not in self._cache:
            self._evict_oldest()
        
        # Calcula expiração
        ttl = ttl_seconds or self.ttl_seconds
        expires_at = datetime.now() + timedelta(seconds=ttl)
        
        # Armazena
        self._cache[key] = CacheEntry(value=value, expires_at=expires_at)
        logger.debug(f"Cache SET: {key} (TTL={ttl}s)")
    
    def delete(self, key: str) -> bool:
        """Remove entrada do cache"""
        if key in self._cache:
            del self._cache[key]
            logger.debug(f"Cache DELETE: {key}")
            return True
        return False
    
    def clear(self):
        """
        Limpa todo o cache
        Conceito: Liberação de memória
        """
        size = len(self._cache)
        self._cache.clear()
        logger.info(f"Cache limpo: {size} entradas removidas")
    
    def get_stats(self) -> dict:
        """Retorna estatísticas do cache"""
        total = len(self._cache)
        expired = sum(1 for e in self._cache.values() if self._is_expired(e))
        
        return {
            "total_entries": total,
            "expired_entries": expired,
            "active_entries": total - expired,
            "max_size": self.max_size,
            "ttl_seconds": self.ttl_seconds
        }


# Singleton
_cache_service: CacheService | None = None


def get_cache_service() -> CacheService:
    """Retorna a instância do cache service"""
    global _cache_service
    if _cache_service is None:
        _cache_service = CacheService()
    return _cache_service
