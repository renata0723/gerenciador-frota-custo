
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calculator, ChevronLeft, FileText, Printer, BarChart2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ApuracaoCustoResultado } from '@/types/contabilidade';
import { formatCurrency } from '@/utils/formatters';

const ApuracaoCustoResultadoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apuracao, setApuracao] = useState<ApuracaoCustoResultado | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarApuracao = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('Apuracao_Custo_Resultado')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) {
          throw error;
        }
        
        setApuracao(data);
      } catch (error) {
        console.error('Erro ao carregar detalhes da apuração:', error);
        toast.error('Erro ao carregar detalhes. Verifique se o registro existe.');
        navigate('/contabilidade/apuracao-custo-resultado');
      } finally {
        setLoading(false);
      }
    };
    
    carregarApuracao();
  }, [id, navigate]);

  const formatarData = (dataString?: string) => {
    if (!dataString) return '';
    try {
      return format(parseISO(dataString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return dataString;
    }
  };
  
  const obterClasseResultado = (valor: number = 0) => {
    return valor < 0 ? 'text-red-600' : 'text-green-600';
  };
  
  const handleImprimir = () => {
    window.print();
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="py-12 text-center">
          <p>Carregando detalhes da apuração...</p>
        </div>
      </PageLayout>
    );
  }

  if (!apuracao) {
    return (
      <PageLayout>
        <div className="py-12 text-center">
          <p>Apuração não encontrada.</p>
          <Button 
            variant="link" 
            className="mt-4"
            onClick={() => navigate('/contabilidade/apuracao-custo-resultado')}
          >
            Voltar para lista de apurações
          </Button>
        </div>
      </PageLayout>
    );
  }

  // Calcular totais
  const custoTotal = 
    (apuracao.custo_combustivel || 0) + 
    (apuracao.custo_manutencao || 0) + 
    (apuracao.custo_pneus || 0) + 
    (apuracao.custo_salarios || 0) + 
    (apuracao.outros_custos || 0);
    
  const despesasTotal = 
    (apuracao.despesas_administrativas || 0) + 
    (apuracao.despesas_financeiras || 0);

  return (
    <PageLayout>
      <PageHeader 
        title="Detalhes da Apuração de Custos e Resultados" 
        description={`Período: ${formatarData(apuracao.periodo_inicio)} a ${formatarData(apuracao.periodo_fim)}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleImprimir}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            <Button variant="ghost" onClick={() => navigate('/contabilidade/apuracao-custo-resultado')}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Receita Total</p>
                <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(apuracao.receita_fretes)}</h3>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <FileText size={20} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Custos + Despesas</p>
                <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(custoTotal + despesasTotal)}</h3>
              </div>
              <div className="p-3 rounded-full bg-red-100">
                <Calculator size={20} className="text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Resultado Líquido</p>
                <h3 className={`text-2xl font-bold ${obterClasseResultado(apuracao.resultado_liquido)}`}>
                  {formatCurrency(apuracao.resultado_liquido || 0)}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <BarChart2 size={20} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Receitas e Indicadores</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Receita de Fretes</span>
                <span className="font-semibold">{formatCurrency(apuracao.receita_fretes)}</span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Quilômetros Rodados</span>
                <span className="font-semibold">{apuracao.km_rodados.toLocaleString('pt-BR')} km</span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Receita por Km</span>
                <span className="font-semibold">
                  {apuracao.km_rodados > 0 
                    ? `R$ ${(apuracao.receita_fretes / apuracao.km_rodados).toFixed(2)}/km` 
                    : 'R$ 0,00/km'}
                </span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Custo por Km</span>
                <span className="font-semibold">
                  {apuracao.custo_km ? `R$ ${apuracao.custo_km.toFixed(2)}/km` : 'R$ 0,00/km'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Lucro por Km</span>
                <span className={`font-semibold ${obterClasseResultado((apuracao.receita_fretes / apuracao.km_rodados) - (apuracao.custo_km || 0))}`}>
                  {apuracao.km_rodados > 0 
                    ? `R$ ${((apuracao.receita_fretes / apuracao.km_rodados) - (apuracao.custo_km || 0)).toFixed(2)}/km` 
                    : 'R$ 0,00/km'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Resultados</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Resultado Bruto</span>
                <span className={`font-semibold ${obterClasseResultado(apuracao.resultado_bruto)}`}>
                  {formatCurrency(apuracao.resultado_bruto || 0)}
                </span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Resultado Líquido</span>
                <span className={`font-semibold ${obterClasseResultado(apuracao.resultado_liquido)}`}>
                  {formatCurrency(apuracao.resultado_liquido || 0)}
                </span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Margem de Lucro</span>
                <span className={`font-semibold ${obterClasseResultado(apuracao.margem_lucro)}`}>
                  {apuracao.margem_lucro ? apuracao.margem_lucro.toFixed(2) : '0.00'}%
                </span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  apuracao.status === 'fechado' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {apuracao.status === 'fechado' ? 'Fechado' : 'Aberto'}
                </span>
              </div>
              
              {apuracao.observacoes && (
                <div className="pt-2">
                  <span className="text-gray-600 block mb-1">Observações:</span>
                  <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{apuracao.observacoes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Detalhamento de Custos e Despesas</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-medium mb-3 text-gray-700">Custos Diretos</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Combustível</span>
                  <span className="font-semibold">{formatCurrency(apuracao.custo_combustivel)}</span>
                </div>
                
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Manutenção</span>
                  <span className="font-semibold">{formatCurrency(apuracao.custo_manutencao)}</span>
                </div>
                
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Pneus</span>
                  <span className="font-semibold">{formatCurrency(apuracao.custo_pneus)}</span>
                </div>
                
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Salários Motoristas</span>
                  <span className="font-semibold">{formatCurrency(apuracao.custo_salarios)}</span>
                </div>
                
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Outros Custos</span>
                  <span className="font-semibold">{formatCurrency(apuracao.outros_custos)}</span>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-800 font-medium">Total Custos</span>
                  <span className="font-bold">{formatCurrency(custoTotal)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-medium mb-3 text-gray-700">Despesas</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Despesas Administrativas</span>
                  <span className="font-semibold">{formatCurrency(apuracao.despesas_administrativas)}</span>
                </div>
                
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Despesas Financeiras</span>
                  <span className="font-semibold">{formatCurrency(apuracao.despesas_financeiras)}</span>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-800 font-medium">Total Despesas</span>
                  <span className="font-bold">{formatCurrency(despesasTotal)}</span>
                </div>
                
                <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-300">
                  <span className="text-gray-800 font-medium">Custos + Despesas</span>
                  <span className="font-bold">{formatCurrency(custoTotal + despesasTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default ApuracaoCustoResultadoDetalhes;
