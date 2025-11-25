# Guia de Instalação - Sistema de Agendamento

## 🚀 Início Rápido

### Requisitos
- Python 3.11+
- Node.js 18+
- npm 9+

## 📦 Instalação Backend (FastAPI + SQLite)

1. **Clone o repositório e acesse a pasta backend:**
   ```bash
   cd backend
   ```

2. **(Opcional) Crie um ambiente virtual:**
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   source .venv/bin/activate  # Linux/Mac
   ```

3. **Instale as dependências:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Inicie o servidor:**
   ```bash
   python app/main.py
   ```
   
   ✅ Backend rodando em: **http://localhost:8000**  
   📚 Documentação da API: **http://localhost:8000/docs**

## 🎨 Instalação Frontend (React + Vite)

1. **Acesse a pasta frontend:**
   ```bash
   cd frontend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   
   ✅ Frontend rodando em: **http://localhost:5174**

## 👤 Primeiro Acesso

O sistema cria automaticamente um usuário administrador:

- **Usuário:** `admin`
- **Senha:** `admin123`

## 📝 Fluxo de Uso

### 1️⃣ Login como Admin
- Acesse http://localhost:5174
- Entre com `admin` / `admin123`

### 2️⃣ Cadastrar Médicos
- Menu "Médicos" → "Novo Médico"
- Preencha os dados
- **IMPORTANTE:** Um modal exibirá as credenciais:
  - Username: CRM do médico
  - Senha: `medico123`
- Copie e compartilhe com o médico

### 3️⃣ Cadastrar Pacientes
- Menu "Pacientes" → "Novo Paciente"
- Preencha os dados
- **IMPORTANTE:** Um modal exibirá as credenciais:
  - Username: Email do paciente
  - Senha: `paciente123`
- Copie e compartilhe com o paciente

### 4️⃣ Agendamentos
- Pacientes podem fazer login e agendar consultas
- Médicos podem visualizar suas consultas
- Admin tem acesso completo

## 💾 Banco de Dados

**Tipo:** SQLite  
**Localização:** `%LOCALAPPDATA%/SistemaAgendamento/data/database.db` (Windows)

O banco é criado automaticamente na primeira execução com as seguintes tabelas:
- `usuarios` - Autenticação
- `medicos` - Cadastro de médicos
- `pacientes` - Cadastro de pacientes
- `consultas` - Agendamentos

## 🔧 Troubleshooting

### ❌ Erro "Paciente não encontrado"
**Causa:** Tentando agendar consulta sem ter criado médicos/pacientes  
**Solução:** Crie médicos e pacientes primeiro via painel admin

### ❌ Tela branca após login
**Causa:** Cache antigo no localStorage  
**Solução:** 
1. F12 → Application → Local Storage
2. Clear All
3. Refresh (F5)

### ❌ CORS Error
**Causa:** Backend/Frontend em portas diferentes  
**Solução:**
- Backend deve estar em `http://localhost:8000`
- Frontend deve estar em `http://localhost:5174`
- Reinicie ambos os servidores

### ❌ Erro ao instalar dependências Python
**Solução:**
```bash
python -m pip install --upgrade pip
pip install -r requirements.txt --no-cache-dir
```

## 🔄 Resetar Sistema

Para começar do zero (apagar todos os dados):

**Windows:**
```powershell
Remove-Item "$env:LOCALAPPDATA\SistemaAgendamento\data\database.db"
```

**Linux/Mac:**
```bash
rm ~/.local/share/SistemaAgendamento/data/database.db
```

Reinicie o backend - um novo banco será criado automaticamente.

## 📚 Tecnologias

### Backend
- FastAPI 0.104.1
- SQLAlchemy 2.0.23 (ORM)
- SQLite (Banco de dados)
- Pydantic v2 (Validação)
- Uvicorn (Servidor ASGI)

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS v3
- Zustand (Estado global)
- React Router

## 🎯 Funcionalidades por Perfil

| Funcionalidade | Admin | Médico | Paciente |
|---|:---:|:---:|:---:|
| Criar/Editar Médicos | ✅ | ❌ | ❌ |
| Criar/Editar Pacientes | ✅ | ❌ | ❌ |
| Visualizar Todas Consultas | ✅ | ❌ | ❌ |
| Visualizar Próprias Consultas | ✅ | ✅ | ✅ |
| Agendar Consultas | ✅ | ❌ | ✅ |
| Gerenciar Horários | ✅ | ✅* | ❌ |
| Gerar Relatórios | ✅ | ❌ | ❌ |

*Médico só pode gerenciar seus próprios horários

## 🔒 Segurança

- ✅ Senhas com hash SHA-256
- ✅ Autenticação via Bearer Token
- ✅ RBAC (Role-Based Access Control)
- ✅ Validação de dados (Pydantic v2)
- ✅ CORS configurado

## 📞 Suporte

Problemas? Abra uma issue no repositório!
