import { useEffect, useState } from 'react'
import Layout from '../components/common/Layout'
import Loading from '../components/common/Loading'
import Modal from '../components/common/Modal'
import CredenciaisModal from '../components/common/CredenciaisModal'
import { medicosApi } from '../api/medicos'
import { Medico, MedicoCreate } from '../types/medico'

export default function MedicosPage() {
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [credenciaisModalOpen, setCredenciaisModalOpen] = useState(false)
  const [credenciais, setCredenciais] = useState({ nome: '', username: '', senha: '' })
  const [formData, setFormData] = useState<MedicoCreate>({
    nome: '',
    crm: '',
    especialidade: '',
    telefone: '',
    email: ''
  })
  const [error, setError] = useState('')
  
  useEffect(() => {
    carregarMedicos()
  }, [])
  
  const carregarMedicos = async () => {
    try {
      setLoading(true)
      const data = await medicosApi.listar()
      setMedicos(data)
    } catch (err) {
      setError('Erro ao carregar médicos')
    } finally {
      setLoading(false)
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log('Enviando dados:', formData)
      const response: any = await medicosApi.criar(formData)
      
      // Se a resposta tem credenciais, exibir modal
      if (response.username && response.senha_temporaria) {
        setCredenciais({
          nome: formData.nome,
          username: response.username,
          senha: response.senha_temporaria
        })
        setCredenciaisModalOpen(true)
      }
      
      setModalOpen(false)
      setFormData({
        nome: '',
        crm: '',
        especialidade: '',
        telefone: '',
        email: ''
      })
      carregarMedicos()
    } catch (err: any) {
      console.error('Erro completo:', err.response?.data)
      const errorMsg = err.response?.data?.detail 
        ? (Array.isArray(err.response.data.detail) 
            ? err.response.data.detail.map((e: any) => `${e.loc.join('.')}: ${e.msg}`).join(', ')
            : err.response.data.detail)
        : 'Erro ao criar médico'
      setError(errorMsg)
    }
  }
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Deseja realmente excluir este médico?')) {
      try {
        await medicosApi.deletar(id)
        carregarMedicos()
      } catch (err) {
        setError('Erro ao excluir médico')
      }
    }
  }
  
  if (loading) return <Layout><Loading /></Layout>
  
  return (
    <Layout>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Médicos</h2>
          <button className="button button-primary" onClick={() => setModalOpen(true)}>
            + Novo Médico
          </button>
        </div>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <table style={{ marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CRM</th>
              <th>Especialidade</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {medicos.map(medico => (
              <tr key={medico.id}>
                <td>{medico.nome}</td>
                <td>{medico.crm}</td>
                <td>{medico.especialidade}</td>
                <td>{medico.telefone}</td>
                <td>{medico.email}</td>
                <td>
                  <button 
                    className="button button-danger"
                    style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                    onClick={() => handleDelete(medico.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Novo Médico">
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
            <label>CRM</label>
            <input 
              type="text" 
              value={formData.crm}
              onChange={(e) => setFormData({...formData, crm: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Especialidade</label>
            <input 
              type="text" 
              value={formData.especialidade}
              onChange={(e) => setFormData({...formData, especialidade: e.target.value})}
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
          
          <button type="submit" className="button button-primary" style={{ width: '100%' }}>
            Salvar
          </button>
        </form>
      </Modal>

      <CredenciaisModal
        isOpen={credenciaisModalOpen}
        onClose={() => setCredenciaisModalOpen(false)}
        tipo="medico"
        nome={credenciais.nome}
        username={credenciais.username}
        senha={credenciais.senha}
      />
    </Layout>
  )
}
