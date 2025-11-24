"""
Script para criar usuários para médicos e pacientes existentes
"""

import asyncio
import sys
from pathlib import Path

# Adiciona o diretório raiz ao PYTHONPATH
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from app.repositories.medico_repository import MedicoRepository
from app.repositories.paciente_repository import PacienteRepository
from app.repositories.usuario_repository import UsuarioRepository
from app.models.usuario import Usuario, TipoUsuario
from uuid import uuid4


async def main():
    print("👥 Criando usuários para médicos e pacientes existentes\n")
    
    medico_repo = MedicoRepository()
    paciente_repo = PacienteRepository()
    usuario_repo = UsuarioRepository()
    
    # 1. Criar usuários para médicos
    print("1️⃣  Processando médicos...")
    medicos = await medico_repo.find_all()
    print(f"   Encontrados {len(medicos)} médicos")
    
    for medico in medicos:
        # Verifica se já existe usuário para este médico
        usuario_existente = await usuario_repo.find_by_referencia(medico.id)
        if usuario_existente:
            print(f"   ⏭️  Dr(a). {medico.nome} já tem usuário: {usuario_existente.username}")
            continue
        
        # Cria username baseado no CRM
        username = medico.crm.lower().replace(" ", "")
        senha_padrao = "medico123"
        
        # Verifica se username já existe
        if await usuario_repo.find_by_username(username):
            print(f"   ⚠️  Username {username} já existe, pulando...")
            continue
        
        # Cria usuário
        usuario = Usuario(
            id=str(uuid4()),
            username=username,
            senha_hash=Usuario.hash_senha(senha_padrao),
            tipo=TipoUsuario.MEDICO,
            referencia_id=medico.id,
            ativo=True
        )
        
        await usuario_repo.create(usuario)
        print(f"   ✅ Criado usuário para Dr(a). {medico.nome}")
        print(f"      Username: {username}")
        print(f"      Senha: {senha_padrao}")
    
    print()
    
    # 2. Criar usuários para pacientes
    print("2️⃣  Processando pacientes...")
    pacientes = await paciente_repo.find_all()
    print(f"   Encontrados {len(pacientes)} pacientes")
    
    for paciente in pacientes:
        # Verifica se já existe usuário para este paciente
        usuario_existente = await usuario_repo.find_by_referencia(paciente.id)
        if usuario_existente:
            print(f"   ⏭️  {paciente.nome} já tem usuário: {usuario_existente.username}")
            continue
        
        # Cria username baseado no email (se tiver) ou CPF
        if paciente.email:
            username = paciente.email.lower()
        else:
            username = f"paciente_{paciente.cpf}"
        
        senha_padrao = "paciente123"
        
        # Verifica se username já existe
        if await usuario_repo.find_by_username(username):
            print(f"   ⚠️  Username {username} já existe, pulando...")
            continue
        
        # Cria usuário
        usuario = Usuario(
            id=str(uuid4()),
            username=username,
            senha_hash=Usuario.hash_senha(senha_padrao),
            tipo=TipoUsuario.PACIENTE,
            referencia_id=paciente.id,
            ativo=True
        )
        
        await usuario_repo.create(usuario)
        print(f"   ✅ Criado usuário para {paciente.nome}")
        print(f"      Username: {username}")
        print(f"      Senha: {senha_padrao}")
    
    print()
    print("✅ Processo concluído!")
    print("\n💡 Senhas padrão:")
    print("   Médicos: medico123")
    print("   Pacientes: paciente123")
    print("   Admin: admin123")


if __name__ == "__main__":
    asyncio.run(main())
