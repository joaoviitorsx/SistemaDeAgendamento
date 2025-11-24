import { useEffect, useState } from 'react'
import Layout from '../components/common/Layout'
import Loading from '../components/common/Loading'
import Modal from '../components/common/Modal'
import { consultasApi } from '../api/consultas'
import { pacientesApi } from '../api/pacientes'
import { medicosApi } from '../api/medicos'
import { ConsultaDetalhada, ConsultaCreate } from '../types/consulta'
import { Paciente } from '../types/paciente'
import { Medico } from '../types/medico'

export default function AgendaPage() {
  const [consultas, setConsultas] = useState<ConsultaDetalhada[]>([])
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState<ConsultaCreate>({
    paciente_id: '',
    medico_id: '',
    data_hora: '',
    duracao_minutos: 30,
    observacoes: ''
  })
  const [error, setError] = useState('')
  
  useEffect(() => {
    carregarDados()
  }, [])
  
  const carregarDados = async () => {
    try {
      setLoading(true)
      const [consultasData, pacientesData, medicosData] = await Promise.all([
        consultasApi.listar(),
        pacientesApi.listar(),
        medicosApi.listar()
      ])
      
      // Buscar detalhes de cada consulta
      const consultasDetalhadas = await Promise.all(
        consultasData.map(c => consultasApi.buscar(c.id))
      )
      
      setConsultas(consultasDetalhadas)
      setPacientes(pacientesData)
      setMedicos(medicosData)
    } catch (err) {
      setError('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await consultasApi.criar(formData)
      setModalOpen(false)
      setFormData({
        paciente_id: '',
        medico_id: '',
        data_hora: '',
        duracao_minutos: 30,
        observacoes: ''
      })
      setError('')
      carregarDados()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao criar consulta')
    }
  }
  
  const handleCancelar = async (id: string) => {
    if (window.confirm('Deseja realmente cancelar esta consulta?')) {
      try {
        await consultasApi.cancelar(id)
        carregarDados()
      } catch (err) {
        setError('Erro ao cancelar consulta')
      }
    }
  }
  
  if (loading) return <Layout><Loading /></Layout>
  
  return (
    <Layout>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Agenda de Consultas</h2>
          <button className="button button-success" onClick={() => setModalOpen(true)}>
            + Nova Consulta
          </button>
        </div>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <table style={{ marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Especialidade</th>
              <th>Data/Hora</th>
              <th>Duração</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {consultas.map(consulta => (
              <tr key={consulta.id}>
                <td>{consulta.paciente_nome || 'N/A'}</td>
                <td>{consulta.medico_nome || 'N/A'}</td>
                <td>{consulta.medico_especialidade || 'N/A'}</td>
                <td>{new Date(consulta.data_hora).toLocaleString('pt-BR')}</td>
                <td>{consulta.duracao_minutos} min</td>
                <td>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '4px',
                    background: consulta.status === 'agendada' ? '#2ecc71' : '#e74c3c',
                    color: 'white'
                  }}>
                    {consulta.status}
                  </span>
                </td>
                <td>
                  {consulta.status === 'agendada' && (
                    <button 
                      className="button button-danger"
                      style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                      onClick={() => handleCancelar(consulta.id)}
                    >
                      Cancelar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nova Consulta">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Paciente</label>
            <select 
              value={formData.paciente_id}
              onChange={(e) => setFormData({...formData, paciente_id: e.target.value})}
              required
            >
              <option value="">Selecione um paciente</option>
              {pacientes.map(p => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Médico</label>
            <select 
              value={formData.medico_id}
              onChange={(e) => setFormData({...formData, medico_id: e.target.value})}
              required
            >
              <option value="">Selecione um médico</option>
              {medicos.map(m => (
                <option key={m.id} value={m.id}>{m.nome} - {m.especialidade}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Data e Hora</label>
            <input 
              type="datetime-local" 
              value={formData.data_hora}
              onChange={(e) => setFormData({...formData, data_hora: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Duração (minutos)</label>
            <input 
              type="number" 
              value={formData.duracao_minutos}
              onChange={(e) => setFormData({...formData, duracao_minutos: parseInt(e.target.value)})}
              min="15"
              max="240"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Observações</label>
            <textarea 
              value={formData.observacoes}
              onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
            />
          </div>
          
          <button type="submit" className="button button-success" style={{ width: '100%' }}>
            Agendar Consulta
          </button>
        </form>
      </Modal>
    </Layout>
  )
}
