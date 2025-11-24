import { useState, useEffect } from 'react'
import Layout from '../components/common/Layout'
import { relatoriosApi } from '../api/relatorios'
import { pacientesApi } from '../api/pacientes'
import { medicosApi } from '../api/medicos'
import { TipoRelatorio, FormatoRelatorio, RelatorioRequest } from '../types/relatorio'
import { Paciente } from '../types/paciente'
import { Medico } from '../types/medico'

export default function RelatoriosPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [formData, setFormData] = useState<RelatorioRequest>({
    tipo: TipoRelatorio.GERAL,
    formato: FormatoRelatorio.PDF
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  useEffect(() => {
    carregarDados()
  }, [])
  
  const carregarDados = async () => {
    try {
      const [pacientesData, medicosData] = await Promise.all([
        pacientesApi.listar(),
        medicosApi.listar()
      ])
      setPacientes(pacientesData)
      setMedicos(medicosData)
    } catch (err) {
      console.error('Erro ao carregar dados')
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const response = await relatoriosApi.gerar(formData)
      const downloadUrl = relatoriosApi.download(response.arquivo)
      
      // Abre em nova aba para download
      window.open(downloadUrl, '_blank')
      
      setSuccess(`Relatório gerado com sucesso: ${response.arquivo}`)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao gerar relatório')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Layout>
      <div className="card">
        <h2>Geração de Relatórios</h2>
        
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <div className="grid grid-2">
            <div className="form-group">
              <label>Tipo de Relatório</label>
              <select 
                value={formData.tipo}
                onChange={(e) => setFormData({...formData, tipo: e.target.value as TipoRelatorio})}
                required
              >
                <option value={TipoRelatorio.GERAL}>Relatório Geral</option>
                <option value={TipoRelatorio.POR_PACIENTE}>Por Paciente</option>
                <option value={TipoRelatorio.POR_MEDICO}>Por Médico</option>
                <option value={TipoRelatorio.POR_PERIODO}>Por Período</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Formato</label>
              <select 
                value={formData.formato}
                onChange={(e) => setFormData({...formData, formato: e.target.value as FormatoRelatorio})}
                required
              >
                <option value={FormatoRelatorio.PDF}>PDF</option>
                <option value={FormatoRelatorio.CSV}>CSV</option>
                <option value={FormatoRelatorio.EXCEL}>Excel</option>
              </select>
            </div>
          </div>
          
          {formData.tipo === TipoRelatorio.POR_PACIENTE && (
            <div className="form-group">
              <label>Paciente</label>
              <select 
                value={formData.paciente_id || ''}
                onChange={(e) => setFormData({...formData, paciente_id: e.target.value})}
                required
              >
                <option value="">Selecione um paciente</option>
                {pacientes.map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>
          )}
          
          {formData.tipo === TipoRelatorio.POR_MEDICO && (
            <div className="form-group">
              <label>Médico</label>
              <select 
                value={formData.medico_id || ''}
                onChange={(e) => setFormData({...formData, medico_id: e.target.value})}
                required
              >
                <option value="">Selecione um médico</option>
                {medicos.map(m => (
                  <option key={m.id} value={m.id}>{m.nome}</option>
                ))}
              </select>
            </div>
          )}
          
          {formData.tipo === TipoRelatorio.POR_PERIODO && (
            <div className="grid grid-2">
              <div className="form-group">
                <label>Data Início</label>
                <input 
                  type="date" 
                  value={formData.data_inicio || ''}
                  onChange={(e) => setFormData({...formData, data_inicio: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Data Fim</label>
                <input 
                  type="date" 
                  value={formData.data_fim || ''}
                  onChange={(e) => setFormData({...formData, data_fim: e.target.value})}
                  required
                />
              </div>
            </div>
          )}
          
          <button 
            type="submit" 
            className="button button-primary" 
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Gerando...' : 'Gerar Relatório'}
          </button>
        </form>
      </div>
    </Layout>
  )
}
