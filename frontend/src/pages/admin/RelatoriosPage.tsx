import React, { useState } from 'react';
import { DocumentArrowDownIcon, ChartBarIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Button, Card } from '../../components/common';
import LayoutAdmin from '../../components/layout/LayoutAdmin';

type TipoRelatorio = 'consultas' | 'pacientes' | 'medicos' | 'financeiro';
type Formato = 'pdf' | 'csv' | 'excel';

const RelatoriosPage: React.FC = () => {
  const [tipoRelatorio, setTipoRelatorio] = useState<TipoRelatorio>('consultas');
  const [formato, setFormato] = useState<Formato>('pdf');
  const [dataInicio, setDataInicio] = useState(format(new Date(), 'yyyy-MM-01'));
  const [dataFim, setDataFim] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(false);

  const tiposRelatorio = [
    {
      id: 'consultas' as TipoRelatorio,
      nome: 'Consultas',
      descricao: 'Relatório de consultas agendadas, realizadas e canceladas',
      icon: CalendarIcon,
    },
    {
      id: 'pacientes' as TipoRelatorio,
      nome: 'Pacientes',
      descricao: 'Lista completa de pacientes cadastrados',
      icon: ChartBarIcon,
    },
    {
      id: 'medicos' as TipoRelatorio,
      nome: 'Médicos',
      descricao: 'Lista de médicos e suas especialidades',
      icon: ChartBarIcon,
    },
    {
      id: 'financeiro' as TipoRelatorio,
      nome: 'Financeiro',
      descricao: 'Relatório de faturamento e receitas',
      icon: ChartBarIcon,
    },
  ];

  const handleGerarRelatorio = async () => {
    if (!dataInicio || !dataFim) {
      toast.error('Selecione o período do relatório');
      return;
    }

    if (new Date(dataInicio) > new Date(dataFim)) {
      toast.error('Data inicial não pode ser maior que data final');
      return;
    }

    try {
      setLoading(true);

      // TODO: Implementar endpoint no backend
      // const response = await relatoriosService.gerar({
      //   tipo: tipoRelatorio,
      //   formato,
      //   data_inicio: dataInicio,
      //   data_fim: dataFim,
      // });

      // Simulação de download
      toast.success(`Gerando relatório ${formato.toUpperCase()}...`);
      
      // Simular download após 2 segundos
      setTimeout(() => {
        toast.success('Relatório gerado com sucesso!');
        // const blob = new Blob([response.data], { type: 'application/pdf' });
        // const url = window.URL.createObjectURL(blob);
        // const a = document.createElement('a');
        // a.href = url;
        // a.download = `relatorio-${tipoRelatorio}-${format(new Date(), 'yyyy-MM-dd')}.${formato}`;
        // a.click();
      }, 2000);

    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Erro ao gerar relatório');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <LayoutAdmin>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Relatórios</h1>
          <p className="text-gray-600">Gere relatórios personalizados em diversos formatos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuração do Relatório */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tipo de Relatório */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Tipo de Relatório
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tiposRelatorio.map((tipo) => {
                  const Icon = tipo.icon;
                  return (
                    <button
                      key={tipo.id}
                      onClick={() => setTipoRelatorio(tipo.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        tipoRelatorio === tipo.id
                          ? 'border-primary bg-primary-50'
                          : 'border-gray-200 hover:border-primary-200'
                      }`}
                    >
                      <Icon className={`h-8 w-8 mb-2 ${
                        tipoRelatorio === tipo.id ? 'text-primary' : 'text-gray-400'
                      }`} />
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {tipo.nome}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {tipo.descricao}
                      </p>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Período */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Período
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Inicial
                  </label>
                  <input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Final
                  </label>
                  <input
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Atalhos de período */}
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDataInicio(format(new Date(), 'yyyy-MM-01'));
                    setDataFim(format(new Date(), 'yyyy-MM-dd'));
                  }}
                >
                  Mês Atual
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const hoje = new Date();
                    const mesPassado = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
                    const ultimoDiaMesPassado = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
                    setDataInicio(format(mesPassado, 'yyyy-MM-dd'));
                    setDataFim(format(ultimoDiaMesPassado, 'yyyy-MM-dd'));
                  }}
                >
                  Mês Passado
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const hoje = new Date();
                    const inicio = new Date(hoje.getFullYear(), 0, 1);
                    setDataInicio(format(inicio, 'yyyy-MM-dd'));
                    setDataFim(format(hoje, 'yyyy-MM-dd'));
                  }}
                >
                  Ano Atual
                </Button>
              </div>
            </Card>

            {/* Formato */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Formato de Exportação
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => setFormato('pdf')}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    formato === 'pdf'
                      ? 'border-primary bg-primary-50'
                      : 'border-gray-200 hover:border-primary-200'
                  }`}
                >
                  <DocumentArrowDownIcon className={`h-8 w-8 mx-auto mb-2 ${
                    formato === 'pdf' ? 'text-primary' : 'text-gray-400'
                  }`} />
                  <p className="font-medium text-gray-900">PDF</p>
                </button>

                <button
                  onClick={() => setFormato('csv')}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    formato === 'csv'
                      ? 'border-primary bg-primary-50'
                      : 'border-gray-200 hover:border-primary-200'
                  }`}
                >
                  <DocumentArrowDownIcon className={`h-8 w-8 mx-auto mb-2 ${
                    formato === 'csv' ? 'text-primary' : 'text-gray-400'
                  }`} />
                  <p className="font-medium text-gray-900">CSV</p>
                </button>

                <button
                  onClick={() => setFormato('excel')}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    formato === 'excel'
                      ? 'border-primary bg-primary-50'
                      : 'border-gray-200 hover:border-primary-200'
                  }`}
                >
                  <DocumentArrowDownIcon className={`h-8 w-8 mx-auto mb-2 ${
                    formato === 'excel' ? 'text-primary' : 'text-gray-400'
                  }`} />
                  <p className="font-medium text-gray-900">Excel</p>
                </button>
              </div>
            </Card>
          </div>

          {/* Resumo e Ação */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Resumo
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Tipo</p>
                  <p className="font-medium text-gray-900">
                    {tiposRelatorio.find(t => t.id === tipoRelatorio)?.nome}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Período</p>
                  <p className="font-medium text-gray-900">
                    {format(new Date(dataInicio), 'dd/MM/yyyy')} até{' '}
                    {format(new Date(dataFim), 'dd/MM/yyyy')}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Formato</p>
                  <p className="font-medium text-gray-900 uppercase">
                    {formato}
                  </p>
                </div>
              </div>

              <Button
                fullWidth
                onClick={handleGerarRelatorio}
                loading={loading}
              >
                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                Gerar Relatório
              </Button>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">💡 Dica:</span> Relatórios em PDF são ideais 
                  para impressão, enquanto CSV e Excel são melhores para análise de dados.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Relatórios Recentes */}
        <Card className="mt-8 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Relatórios Gerados Recentemente
          </h2>
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum relatório gerado ainda</p>
            <p className="text-sm mt-2">
              Os relatórios gerados aparecerão aqui para download posterior
            </p>
          </div>
        </Card>
      </div>
    </LayoutAdmin>
  );
};

export default RelatoriosPage;
