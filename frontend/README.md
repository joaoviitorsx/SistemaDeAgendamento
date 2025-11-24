# Frontend - Sistema de Agendamento

Frontend moderno e responsivo do Sistema de Agendamento de Consultas Médicas.

## 🚀 Stack Tecnológico

- **React 18.2.0** - Biblioteca JavaScript para construção de UIs
- **TypeScript 5.3.2** - Superset tipado do JavaScript
- **Vite 5.0.5** - Build tool de última geração
- **Tailwind CSS 4.x** - Framework CSS utility-first
- **React Router 6.x** - Roteamento client-side
- **Zustand 4.x** - Gerenciamento de estado
- **Axios 1.x** - Cliente HTTP
- **React Hot Toast 2.x** - Notificações
- **date-fns 3.x** - Manipulação de datas
- **@heroicons/react** - Biblioteca de ícones

## 📁 Estrutura de Diretórios

```
src/
├── api/                    # Configuração do cliente HTTP
│   └── client.ts          # Axios instance com interceptors
├── components/
│   ├── common/            # Componentes reutilizáveis
│   │   ├── Button.tsx     # Botão com variantes
│   │   ├── Input.tsx      # Input com label e validação
│   │   ├── Card.tsx       # Container com sombra
│   │   ├── Modal.tsx      # Modal/Dialog
│   │   ├── Table.tsx      # Tabela genérica (TypeScript generics)
│   │   └── index.ts       # Barrel export
│   └── layout/            # Componentes de layout
│       ├── Header.tsx     # Cabeçalho de página
│       ├── Sidebar.tsx    # Menu lateral (Admin)
│       ├── LayoutPaciente.tsx
│       └── LayoutAdmin.tsx
├── hooks/                 # Custom hooks
│   ├── usePacientes.ts   # Hook com CRUD de pacientes
│   ├── useMedicos.ts     # Hook com CRUD de médicos
│   └── useConsultas.ts   # Hook com CRUD de consultas
├── pages/
│   ├── auth/
│   │   └── LoginPage.tsx
│   ├── paciente/
│   │   ├── HomePage.tsx          # Dashboard do paciente
│   │   ├── AgendarPage.tsx       # Wizard de agendamento (3 etapas)
│   │   └── MinhasConsultasPage.tsx
│   └── admin/
│       ├── DashboardPage.tsx     # Dashboard administrativo
│       ├── PacientesPage.tsx     # CRUD de pacientes
│       ├── MedicosPage.tsx       # CRUD de médicos
│       ├── ConsultasPage.tsx     # Gestão de consultas
│       ├── HorariosPage.tsx      # Configuração de horários
│       └── RelatoriosPage.tsx    # Geração de relatórios
├── routes/
│   ├── AppRoutes.tsx      # Configuração de rotas
│   └── ProtectedRoute.tsx # HOC de proteção de rotas
├── services/              # Camada de serviços (API)
│   ├── pacientes.service.ts
│   ├── medicos.service.ts
│   └── consultas.service.ts
├── store/
│   └── authStore.ts       # Zustand store de autenticação
├── types/                 # TypeScript interfaces
│   ├── auth.types.ts
│   ├── paciente.types.ts
│   ├── medico.types.ts
│   └── consulta.types.ts
├── App.tsx               # Componente raiz
├── main.tsx             # Entry point
└── index.css            # Tailwind imports
```

## 🎨 Design System

### Paleta de Cores

```javascript
colors: {
  primary: {
    DEFAULT: '#1E88E5',  // Blue
    dark: '#1565C0',
    light: '#64B5F6',
    50: '#E3F2FD',
    // ... 100-900
  },
  success: {
    DEFAULT: '#43A047',  // Green
    dark: '#2E7D32',
    // ... shades
  },
  danger: '#E53935',     // Red
  warning: '#FB8C00',    // Orange
  info: '#039BE5',       // Light Blue
}
```

### Tipografia

```javascript
fontFamily: {
  heading: ['Poppins', 'sans-serif'],  // Títulos
  body: ['Inter', 'sans-serif'],       // Corpo do texto
}
```

### Componentes Base

#### Button Component
```tsx
<Button variant="primary" size="md" fullWidth loading>
  Salvar
</Button>
```

**Variantes**: primary, secondary, outline, ghost, danger
**Tamanhos**: sm, md, lg
**Props**: fullWidth, loading, disabled

#### Input Component
```tsx
<Input
  label="Email"
  type="email"
  error="Email inválido"
  helperText="Digite seu email"
  icon={<MailIcon />}
/>
```

#### Card Component
```tsx
<Card hover padding="lg" onClick={handleClick}>
  Conteúdo do card
</Card>
```

#### Modal Component
```tsx
<Modal isOpen={open} onClose={close} title="Título" size="lg">
  Conteúdo do modal
</Modal>
```

#### Table Component
```tsx
<Table<Paciente>
  columns={[
    { header: 'Nome', accessor: 'nome' },
    { header: 'CPF', accessor: 'cpf' },
  ]}
  data={pacientes}
  loading={loading}
  onRowClick={(item) => console.log(item)}
/>
```

## 🔐 Autenticação

Sistema mockado com localStorage:

```typescript
// Usuários de teste
{
  paciente: { email: 'ana.souza@example.com', senha: '123456' }
  medico: { crm: 'crm123', senha: '123456' }
  admin: { crm: 'admin.crm', senha: 'admin123' }
}
```

### Zustand Store
```typescript
const { user, isAuthenticated, login, logout } = useAuthStore();
```

## 🛣️ Rotas

### Paciente
- `/paciente/home` - Dashboard
- `/paciente/agendar` - Agendar consulta (wizard)
- `/paciente/consultas` - Minhas consultas

### Admin/Médico
- `/admin/dashboard` - Dashboard
- `/admin/pacientes` - CRUD de pacientes
- `/admin/medicos` - CRUD de médicos (apenas admin)
- `/admin/consultas` - Gestão de consultas
- `/admin/horarios` - Configurar horários
- `/admin/relatorios` - Gerar relatórios

### Proteção de Rotas
```tsx
<ProtectedRoute allowedTypes={['medico', 'admin']}>
  <DashboardPage />
</ProtectedRoute>
```

## 📦 Services Layer

Todos os services seguem o padrão:

```typescript
const service = {
  async getAll(): Promise<T[]> { },
  async getById(id: string): Promise<T> { },
  async create(data: CreateDTO): Promise<T> { },
  async update(id: string, data: UpdateDTO): Promise<T> { },
  async delete(id: string): Promise<void> { },
};
```

### Exemplos

```typescript
// Pacientes
await pacientesService.create({
  nome: 'João Silva',
  cpf: '123.456.789-00',
  // ...
});

// Consultas
await consultasService.update(id, {
  status: 'confirmada'
});
```

## 🪝 Custom Hooks

### usePacientes
```typescript
const {
  pacientes,
  loading,
  error,
  fetchPacientes,
  createPaciente,
  updatePaciente,
  deletePaciente,
} = usePacientes();
```

### useMedicos
```typescript
const {
  medicos,
  loading,
  fetchMedicos,
  createMedico,
  // ...
} = useMedicos();
```

### useConsultas
```typescript
const {
  consultas,
  loading,
  fetchConsultas,
  createConsulta,
  updateConsulta,
  deleteConsulta,
} = useConsultas();
```

## 🎯 Features Implementadas

### CRUD Completo
✅ Pacientes (com endereço completo)
✅ Médicos (CRM, especialidade)
✅ Consultas (status workflow)

### Gestão de Consultas
✅ Status: agendada → confirmada → realizada
✅ Cancelamento de consultas
✅ Busca e filtros
✅ Visualização por paciente/médico

### Agendamento (Wizard)
✅ Etapa 1: Escolher médico
✅ Etapa 2: Escolher data
✅ Etapa 3: Escolher horário
✅ Observações opcionais
✅ Confirmação

### UI/UX
✅ Toasts de sucesso/erro
✅ Loading states
✅ Empty states
✅ Modais de confirmação
✅ Formulários validados
✅ Tabelas responsivas
✅ Busca em tempo real

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build
npm run build

# Preview da build
npm run preview

# Lint
npm run lint
```

O projeto estará disponível em: **http://localhost:5173**

## 🔧 Configuração

### Tailwind Config
`tailwind.config.js` - Personalização de cores, fontes, sombras

### PostCSS Config
`postcss.config.js` - Plugin do Tailwind CSS v4

### Vite Config
`vite.config.ts` - Configuração do build tool

### TypeScript Config
`tsconfig.json` - Configurações do TypeScript

## 📝 Padrões de Código

### Imports
```typescript
// Ordem recomendada
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '@/components/common';
import { usePacientes } from '@/hooks';
import { Paciente } from '@/types';
```

### Nomenclatura
- **Componentes**: PascalCase (`LoginPage.tsx`)
- **Hooks**: camelCase com prefixo `use` (`usePacientes.ts`)
- **Services**: camelCase com sufixo `.service` (`pacientes.service.ts`)
- **Types**: PascalCase com sufixo `.types` (`auth.types.ts`)

### Estrutura de Componente
```typescript
import React from 'react';

interface Props {
  // props
}

const Component: React.FC<Props> = ({ prop }) => {
  // hooks
  // state
  // effects
  // handlers
  // render
  return <div></div>;
};

export default Component;
```

## 🐛 Troubleshooting

### Problema: CSS não está carregando
**Solução**: Reinicie o servidor dev (`npm run dev`)

### Problema: Erro 404 nas rotas
**Solução**: Verifique se `BrowserRouter` está configurado no `main.tsx`

### Problema: Imports não encontrados
**Solução**: Verifique os caminhos relativos ou configure path aliases no `vite.config.ts`

## 📱 Responsividade

Breakpoints do Tailwind:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

Uso:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

## 🎓 Boas Práticas

1. **Sempre tipar** props e estados
2. **Usar hooks customizados** para lógica complexa
3. **Componentizar** código repetido
4. **Validar** formulários antes de enviar
5. **Tratar erros** com try/catch e toasts
6. **Loading states** em operações assíncronas
7. **Empty states** quando não há dados
8. **Confirmação** antes de deletar

## 📚 Recursos

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Docs](https://vitejs.dev)
- [React Router Docs](https://reactrouter.com)
- [Zustand Docs](https://zustand-demo.pmnd.rs)

---

**Status**: ✅ 100% Completo

Todas as páginas implementadas e funcionais!
