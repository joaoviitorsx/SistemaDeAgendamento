"""
Script de teste para o sistema de autenticação
Cria usuário admin inicial e testa login
"""

import asyncio
import sys
from pathlib import Path

# Adiciona o diretório raiz ao PYTHONPATH
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from app.services.auth_service import AuthService
from app.schemas.usuario_schema import LoginRequest


async def main():
    print("🔐 Testando Sistema de Autenticação\n")
    
    service = AuthService()
    
    # 1. Cria admin inicial
    print("1️⃣  Criando usuário admin inicial...")
    await service.criar_usuario_admin_inicial()
    print("   ✅ Admin criado/verificado\n")
    
    # 2. Testa login com credenciais corretas
    print("2️⃣  Testando login com credenciais corretas...")
    try:
        resultado = await service.login(LoginRequest(username="admin", senha="admin123"))
        print(f"   ✅ Login bem-sucedido!")
        print(f"      ID: {resultado.id}")
        print(f"      Username: {resultado.username}")
        print(f"      Tipo: {resultado.tipo}")
        print(f"      Nome: {resultado.nome}\n")
    except Exception as e:
        print(f"   ❌ Erro: {e}\n")
    
    # 3. Testa login com senha incorreta
    print("3️⃣  Testando login com senha incorreta...")
    try:
        await service.login(LoginRequest(username="admin", senha="senha_errada"))
        print("   ❌ Login deveria ter falho!\n")
    except Exception as e:
        print(f"   ✅ Login falhou como esperado: {e}\n")
    
    # 4. Testa login com usuário inexistente
    print("4️⃣  Testando login com usuário inexistente...")
    try:
        await service.login(LoginRequest(username="inexistente", senha="123"))
        print("   ❌ Login deveria ter falho!\n")
    except Exception as e:
        print(f"   ✅ Login falhou como esperado: {e}\n")
    
    print("✅ Todos os testes concluídos!")
    print("\n💡 Credenciais do admin:")
    print("   Username: admin")
    print("   Senha: admin123")


if __name__ == "__main__":
    asyncio.run(main())
