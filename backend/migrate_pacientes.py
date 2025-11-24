"""
Script de migração: Converte endereços de pacientes de string para objeto estruturado
"""
import json
import os
from pathlib import Path

def migrate_pacientes():
    """Migra pacientes do formato antigo (endereco: string) para novo (endereco: objeto)"""
    # Determinar o caminho baseado no SO
    if os.name == 'nt':  # Windows
        base = Path(os.getenv("LOCALAPPDATA", Path.home() / "AppData" / "Local"))
    else:  # Linux, macOS
        base = Path.home() / ".local" / "share"
    
    storage_path = base / "SistemaAgendamento" / "data" / "pacientes.json"
    
    print(f"📁 Procurando em: {storage_path}")
    
    if not storage_path.exists():
        print("❌ Arquivo de pacientes não encontrado")
        print("ℹ️ Crie um paciente primeiro para inicializar o arquivo")
        return
    
    # Backup
    backup_path = storage_path.with_suffix('.json.backup')
    with open(storage_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    with open(backup_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Backup criado: {backup_path}")
    
    # Migrar
    migrated = 0
    for paciente in data:
        if isinstance(paciente.get('endereco'), str):
            old_endereco = paciente['endereco']
            paciente['endereco'] = {
                "rua": old_endereco,
                "numero": "S/N",
                "bairro": "Centro",
                "cidade": "Não informado",
                "estado": "--",
                "cep": "00000000"
            }
            migrated += 1
            print(f"✅ Migrado: {paciente['nome']} - {old_endereco}")
    
    # Salvar
    if migrated > 0:
        with open(storage_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"\n✅ {migrated} paciente(s) migrado(s) com sucesso!")
    else:
        print("ℹ️ Nenhum paciente precisa de migração")

if __name__ == '__main__':
    migrate_pacientes()
