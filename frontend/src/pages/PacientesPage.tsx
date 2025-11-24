import { useEffect, useState } from 'react'
import Layout from '../components/common/Layout'
import Loading from '../components/common/Loading'
import Modal from '../components/common/Modal'
import { pacientesApi } from '../api/pacientes'
import { Paciente, PacienteCreate } from '../types/paciente'

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState<PacienteCreate>({
    nome: '',
    cpf: '',
    data_nascimento: '',
    telefone: '',
    email: '',
    endereco: ''
  })
  const [error, setError] = useState('')
  
  useEffect(() => {
    carregarPacientes()
  }, [])
  
  const carregarPacientes = async () => {
    try {
      setLoading(true)
      const data = await pacientesApi.listar()
      setPacientes(data)
    } catch (err) {
      setError('Erro ao carregar pacientes')
    } finally {
      setLoading(false)
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await pacientesApi.criar(formData)
      setModalOpen(false)
      setFormData({
        nome: '',
        cpf: '',
        data_nascimento: '',
        telefone: '',
        email: '',
        endereco: ''
      })
      carregarPacientes()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao criar paciente')
    }
  }
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Deseja realmente excluir este paciente?')) {
      try {
        await pacientesApi.deletar(id)
        carregarPacientes()
      } catch (err) {
        setError('Erro ao excluir paciente')
      }
    }
  }
  
  if (loading) return <Layout><Loading /></Layout>
  
  return (
    <Layout>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Pacientes</h2>
          <button className="button button-primary" onClick={() => setModalOpen(true)}>
            + Novo Paciente
          </button>
        </div>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <table style={{ marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map(paciente => (
              <tr key={paciente.id}>
                <td>{paciente.nome}</td>
                <td>{paciente.cpf}</td>
                <td>{paciente.telefone}</td>
                <td>{paciente.email}</td>
                <td>
                  <button 
                    className="button button-danger" 
                    style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                    onClick={() => handleDelete(paciente.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Novo Paciente">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome</label>
            <input 
              type="text" 
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>CPF (apenas números)</label>
            <input 
              type="text" 
              value={formData.cpf}
              onChange={(e) => setFormData({...formData, cpf: e.target.value})}
              pattern="\d{11}"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Data de Nascimento</label>
            <input 
              type="date" 
              value={formData.data_nascimento}
              onChange={(e) => setFormData({...formData, data_nascimento: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Telefone</label>
            <input 
              type="text" 
              value={formData.telefone}
              onChange={(e) => setFormData({...formData, telefone: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Endereço</label>
            <textarea 
              value={formData.endereco}
              onChange={(e) => setFormData({...formData, endereco: e.target.value})}
              required
            />
          </div>
          
          <button type="submit" className="button button-primary" style={{ width: '100%' }}>
            Salvar
          </button>
        </form>
      </Modal>
    </Layout>
  )
}
