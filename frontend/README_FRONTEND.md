# 🏥 Sistema de Agendamento Médico - Frontend

> Interface moderna e responsiva para sistema de agendamento de consultas médicas, desenvolvida com React + TypeScript + Vite + Tailwind CSS

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Design System](#design-system)
- [Instalação](#instalação)
- [Uso](#uso)
- [Perfis e Autenticação](#perfis-e-autenticação)
- [Rotas](#rotas)
- [Componentes](#componentes)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Fluxo de Telas](#fluxo-de-telas)

---

## 🎯 Sobre o Projeto

Sistema completo de agendamento médico com **dois perfis distintos de usuário**:

### 👤 Perfil Paciente
- Visualizar consultas agendadas
- Agendar novas consultas
- Cancelar consultas
- Baixar comprovantes

### 👨‍⚕️ Perfil Médico/Admin
- Dashboard com estatísticas
- CRUD completo de Pacientes
- CRUD de Médicos (apenas Admin)
- Gerenciamento de Consultas
- Liberação de horários
- Geração de relatórios (PDF/CSV)

---

## 🚀 Tecnologias

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **React** | 18.2.0 | Biblioteca UI |
| **TypeScript** | 5.3.2 | Tipagem estática |
| **Vite** | 5.0.5 | Build tool |
| **Tailwind CSS** | 4.x | Framework CSS |
| **React Router** | 6.x | Roteamento |
| **Zustand** | 4.x | Gerenciamento de estado |
| **Axios** | 1.x | Cliente HTTP |
| **React Hot Toast** | 2.x | Notificações |
| **date-fns** | 3.x | Manipulação de datas |

---

## 🏗️ Arquitetura

```
frontend/
├── src/
│   ├── api/
│   │   └── client.ts                 # Axios instance
│   ├── components/
│   │   ├── common/                   # Componentes reutilizáveis
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── index.ts
│   │   ├── layout/                   # Layouts da aplicação
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── LayoutPaciente.tsx
│   │   │   └── LayoutAdmin.tsx
│   │   └── features/                 # Componentes específicos
│   ├── hooks/                        # Custom hooks
│   ├── pages/
│   │   ├── auth/
│   │   │   └── LoginPage.tsx         # Tela de login
│   │   ├── paciente/
│   │   │   ├── HomePage.tsx
│   │   │   ├── AgendarPage.tsx
│   │   │   └── MinhasConsultasPage.tsx
│   │   └── admin/
│   │       ├── DashboardPage.tsx
│   │       ├── PacientesPage.tsx
│   │       ├── MedicosPage.tsx
│   │       ├── ConsultasPage.tsx
│   │       ├── HorariosPage.tsx
│   │       └── RelatoriosPage.tsx
│   ├── routes/
│   │   ├── AppRoutes.tsx             # Configuração de rotas
│   │   └── ProtectedRoute.tsx        # HOC para rotas protegidas
│   ├── store/
│   │   └── authStore.ts              # Zustand store (autenticação)
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── paciente.types.ts
│   │   ├── medico.types.ts
│   │   └── consulta.types.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css                     # Tailwind + estilos globais
├── tailwind.config.js                # Configuração Tailwind
├── postcss.config.js                 # PostCSS config
├── package.json
└── tsconfig.json
```

---

## 🎨 Design System

### Paleta de Cores

```css
Primary (Azul):
- DEFAULT: #1E88E5
- Dark: #1565C0
- Light: #64B5F6

Success (Verde):
- DEFAULT: #43A047
- Dark: #2E7D32
- Light: #66BB6A

Danger (Vermelho):
- DEFAULT: #E53935

Warning (Laranja):
- DEFAULT: #FB8C00

Info (Azul Claro):
- DEFAULT: #039BE5
```

### Tipografia

- **Fontes:**
  - Títulos: **Poppins** (400, 500, 600, 700, 800)
  - Texto: **Inter** (300, 400, 500, 600, 700)

### Componentes Base

#### Button
```tsx
<Button variant="primary" size="md" fullWidth loading={false}>
  Texto do Botão
</Button>
```

**Variantes:** `primary`, `secondary`, `outline`, `ghost`, `danger`  
**Tamanhos:** `sm`, `md`, `lg`

#### Input
```tsx
<Input
  label="Email"
  type="email"
  placeholder="seu@email.com"
  error="Mensagem de erro"
  icon={<IconComponent />}
/>
```

#### Card
```tsx
<Card hover padding="md">
  Conteúdo do card
</Card>
```

**Padding:** `sm`, `md`, `lg`

#### Modal
```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Título do Modal"
  size="md"
>
  Conteúdo do modal
</Modal>
```

**Tamanhos:** `sm`, `md`, `lg`, `xl`

---

## 📦 Instalação

### Pré-requisitos

- Node.js >= 18.x
- npm ou yarn

### Passos

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>

# 2. Entre na pasta do frontend
cd frontend

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev

# 5. Acesse no navegador
http://localhost:5174
```

---

## 🎮 Uso

### Desenvolvimento

```bash
npm run dev       # Inicia servidor de desenvolvimento
npm run build     # Build para produção
npm run preview   # Preview do build
npm run lint      # Lint com ESLint
```

---

## 🔐 Perfis e Autenticação

### Sistema de Login MOCKADO

O sistema possui **3 usuários de teste**:

#### 1. Paciente
```
Email: ana.souza@example.com
Senha: 123456
```
**Acesso:** Telas de agendamento e visualização de consultas

#### 2. Médico
```
CRM: crm123
Senha: 123456
```
**Acesso:** Dashboard e gerenciamento completo (exceto CRUD de médicos)

#### 3. Admin (Médico Chefe)
```
CRM: admin.crm
Senha: admin123
```
**Acesso:** TODAS as funcionalidades incluindo CRUD de médicos

### Fluxo de Autenticação

1. Usuário acessa `/login`
2. Insere credenciais (email/CRM + senha)
3. Sistema valida credenciais mockadas
4. Armazena dados no `localStorage` via Zustand
5. Redireciona baseado no tipo:
   - **Paciente** → `/paciente/home`
   - **Médico/Admin** → `/admin/dashboard`

---

## 🛣️ Rotas

### Públicas

| Rota | Descrição |
|------|-----------|
| `/login` | Tela de login |

### Paciente (Protegidas)

| Rota | Descrição |
|------|-----------|
| `/paciente/home` | Home do paciente |
| `/paciente/agendar` | Agendar consulta |
| `/paciente/consultas` | Minhas consultas |

### Admin/Médico (Protegidas)

| Rota | Descrição | Acesso |
|------|-----------|--------|
| `/admin/dashboard` | Dashboard com estatísticas | Médico + Admin |
| `/admin/pacientes` | CRUD de pacientes | Médico + Admin |
| `/admin/medicos` | CRUD de médicos | **Apenas Admin** |
| `/admin/consultas` | Gerenciamento de consultas | Médico + Admin |
| `/admin/horarios` | Liberação de horários | Médico + Admin |
| `/admin/relatorios` | Geração de relatórios | Médico + Admin |

---

## 🧩 Componentes

### Componentes Comuns

- **Button**: Botões com variantes (primary, secondary, outline, ghost, danger)
- **Input**: Inputs com label, erro, ícone
- **Card**: Cartões com shadow, hover, padding customizável
- **Modal**: Modal responsivo com overlay

### Layouts

#### LayoutPaciente
- Header horizontal com navegação
- Logo + menu + perfil + logout
- Design minimalista

#### LayoutAdmin
- Sidebar vertical escura
- Navegação com ícones
- Header com breadcrumb
- Conteúdo responsivo

### Rotas Protegidas

```tsx
<ProtectedRoute allowedTypes={['medico', 'admin']}>
  <DashboardPage />
</ProtectedRoute>
```

---

## 📂 Estrutura de Pastas

```
src/
├── api/              # Cliente HTTP (Axios)
├── components/       # Componentes React
│   ├── common/       # Reutilizáveis (Button, Input, Card, Modal)
│   ├── layout/       # Layouts (Sidebar, Header, LayoutPaciente, LayoutAdmin)
│   └── features/     # Componentes específicos
├── hooks/            # Custom hooks
├── pages/            # Páginas da aplicação
│   ├── auth/         # Login
│   ├── paciente/     # Home, Agendar, Consultas
│   └── admin/        # Dashboard, CRUDs, Relatórios
├── routes/           # Configuração de rotas + ProtectedRoute
├── store/            # Zustand (authStore)
├── types/            # TypeScript interfaces
├── App.tsx           # Componente raiz
├── main.tsx          # Entry point
└── index.css         # Tailwind + estilos globais
```

---

## 🖼️ Fluxo de Telas

### 1. Login
- Campos: Email/CRM + Senha
- Botão "Entrar"
- Cards com usuários de teste
- Validação mockada

### 2. Home do Paciente
- **Boas-vindas** personalizadas
- **Ações Rápidas:**
  - Agendar Consulta (card clicável)
  - Minhas Consultas (card clicável)
- **Próximas Consultas** (lista vazia inicialmente)

### 3. Dashboard Admin
- **4 Cards de Estatísticas:**
  - Consultas Hoje
  - Total de Pacientes
  - Médicos Ativos
  - Consultas do Mês
- **Tabela** de consultas do dia
- **Cards** de atividades recentes

### 4. Agendamento (Em Desenvolvimento)
- Passo 1: Selecionar médico
- Passo 2: Escolher data
- Passo 3: Selecionar horário
- Passo 4: Confirmação

### 5. CRUD (Em Desenvolvimento)
- Tabela com busca/filtro
- Botões: Novo, Editar, Excluir
- Modal para cadastro/edição
- Validação de formulários

### 6. Relatórios (Em Desenvolvimento)
- Filtros: Data, Médico, Tipo
- Botões: Gerar PDF, Exportar CSV
- Preview de dados

---

## 🎯 Próximos Passos

### Funcionalidades Pendentes

- [ ] Página de agendamento completa
- [ ] CRUD de pacientes
- [ ] CRUD de médicos (admin)
- [ ] Gerenciamento de consultas
- [ ] Liberação de horários
- [ ] Geração de relatórios (PDF/CSV)
- [ ] Integração com backend (atualmente mockado)
- [ ] Testes unitários (Jest + React Testing Library)
- [ ] Testes E2E (Cypress ou Playwright)

---

## 👥 Perfis de Usuário

### Paciente
- ✅ Login
- ✅ Home com ações rápidas
- ⏳ Agendar consulta
- ⏳ Visualizar consultas
- ⏳ Cancelar consulta
- ⏳ Baixar comprovante

### Médico
- ✅ Login
- ✅ Dashboard
- ⏳ Gerenciar pacientes
- ⏳ Gerenciar consultas
- ⏳ Liberar horários
- ⏳ Gerar relatórios

### Admin (Médico Chefe)
- ✅ Login
- ✅ Dashboard
- ⏳ Todas as funcionalidades do Médico
- ⏳ CRUD de médicos

---

## 📝 Notas Técnicas

### Autenticação
- **Implementação:** Mockada com Zustand
- **Persistência:** LocalStorage
- **Validação:** Comparação direta de credenciais

### Rotas Protegidas
- **HOC:** `ProtectedRoute`
- **Validação:** Tipo de usuário + autenticação
- **Redirecionamento:** Automático baseado em permissões

### Estado Global
- **Biblioteca:** Zustand
- **Stores:** authStore (autenticação)
- **Futuros:** consultasStore, pacientesStore, medicosStore

### Integração Backend
- **Cliente HTTP:** Axios (configurado em `api/client.ts`)
- **Base URL:** Configurável via variáveis de ambiente
- **Interceptors:** Prontos para autenticação por token

---

## 🛠️ Tecnologias Auxiliares

- **PostCSS**: Processamento de CSS
- **Autoprefixer**: Prefixos CSS automáticos
- **ESLint**: Linting de código
- **TypeScript**: Tipagem estática
- **Vite**: Build extremamente rápido

---

## 🎨 Cores em Ação

### Primária (Azul)
- Botões principais
- Links ativos
- Destaques importantes

### Sucesso (Verde)
- Confirmações
- Status positivos
- Botões secundários

### Perigo (Vermelho)
- Exclusões
- Erros
- Alertas críticos

### Aviso (Laranja)
- Avisos
- Ações pendentes

---

## 📌 Convenções de Código

### TypeScript
- Interfaces com `I` opcional
- Types para unions
- Props sempre tipadas

### React
- Functional Components
- Hooks para estado e efeitos
- Props destructuring

### CSS (Tailwind)
- Classes utilitárias
- Componentes com `@apply`
- Responsive-first

### Arquivos
- PascalCase para componentes
- camelCase para utils/hooks
- kebab-case para CSS

---

## 🚀 Deploy

### Build para Produção

```bash
npm run build
```

Gera pasta `dist/` com arquivos otimizados.

### Preview Local

```bash
npm run preview
```

### Variáveis de Ambiente

Crie `.env.production`:

```env
VITE_API_URL=https://api.seudominio.com
VITE_APP_NAME=Sistema de Agendamento
```

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais.

---

## ✨ Autores

Desenvolvido como parte do projeto de Sistema Operacional da faculdade.

---

**Status:** 🚧 Em Desenvolvimento Ativo

**Última Atualização:** Novembro 2025
