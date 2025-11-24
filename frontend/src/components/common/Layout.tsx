import { Link, useLocation } from 'react-router-dom'

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  
  const isActive = (path: string) => location.pathname === path ? 'active' : ''
  
  return (
    <div className="page">
      <nav className="navbar">
        <h1>Sistema de Agendamento de Consultas</h1>
        <nav>
          <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
          <Link to="/pacientes" className={isActive('/pacientes')}>Pacientes</Link>
          <Link to="/medicos" className={isActive('/medicos')}>Médicos</Link>
          <Link to="/agenda" className={isActive('/agenda')}>Agenda</Link>
          <Link to="/relatorios" className={isActive('/relatorios')}>Relatórios</Link>
        </nav>
      </nav>
      <div className="container">
        {children}
      </div>
    </div>
  )
}
