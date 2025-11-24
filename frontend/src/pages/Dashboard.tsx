import { useEffect, useState } from 'react'
import Layout from '../components/common/Layout'

export default function Dashboard() {
  const [stats, setStats] = useState({
    pacientes: 0,
    medicos: 0,
    consultas: 0,
    consultasHoje: 0
  })
  const [systemInfo, setSystemInfo] = useState<any>(null)
  
  useEffect(() => {
    // Buscar estatísticas
    fetchStats()
    fetchSystemInfo()
  }, [])
  
  const fetchStats = async () => {
    // TODO: Implementar busca de estatísticas
    setStats({
      pacientes: 0,
      medicos: 0,
      consultas: 0,
      consultasHoje: 0
    })
  }
  
  const fetchSystemInfo = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/sistema/info')
      const data = await response.json()
      setSystemInfo(data)
    } catch (error) {
      console.error('Erro ao buscar info do sistema:', error)
    }
  }
  
  return (
    <Layout>
      <div className="card">
        <h2>Dashboard</h2>
        <div className="grid grid-3" style={{ marginTop: '2rem' }}>
          <div className="card" style={{ textAlign: 'center', background: '#3498db', color: 'white' }}>
            <h3>{stats.pacientes}</h3>
            <p>Pacientes Cadastrados</p>
          </div>
          <div className="card" style={{ textAlign: 'center', background: '#2ecc71', color: 'white' }}>
            <h3>{stats.medicos}</h3>
            <p>Médicos Ativos</p>
          </div>
          <div className="card" style={{ textAlign: 'center', background: '#e74c3c', color: 'white' }}>
            <h3>{stats.consultasHoje}</h3>
            <p>Consultas Hoje</p>
          </div>
        </div>
      </div>
      
      {systemInfo && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <h2>Informações do Sistema</h2>
          <div style={{ marginTop: '1rem' }}>
            <p><strong>Sistema Operacional:</strong> {systemInfo.sistema_operacional?.nome} {systemInfo.sistema_operacional?.versao}</p>
            <p><strong>Arquitetura:</strong> {systemInfo.sistema_operacional?.arquitetura}</p>
            <p><strong>Encoding:</strong> {systemInfo.sistema_operacional?.encoding}</p>
            <p><strong>Diretório de Dados:</strong> {systemInfo.diretorios?.dados}</p>
            <p><strong>Diretório de Logs:</strong> {systemInfo.diretorios?.logs}</p>
            <p><strong>Diretório de Relatórios:</strong> {systemInfo.diretorios?.relatorios}</p>
          </div>
        </div>
      )}
    </Layout>
  )
}
