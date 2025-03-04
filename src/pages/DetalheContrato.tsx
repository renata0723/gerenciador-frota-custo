
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, ArrowLeft, Truck, User, DollarSign, MapPin, Calendar, FileCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Placeholder, { LoadingPlaceholder } from '@/components/ui/Placeholder';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency, formatDate } from '@/utils/constants';

const DetalheContrato = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contrato, setContrato] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarContrato = async () => {
      setLoading(true);
      try {
        if (!id) {
          setError('ID do contrato não fornecido');
          return;
        }
        
        // Convertemos o id para string para a consulta no Supabase
        const { data, error } = await supabase
          .from('Contratos')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (!data) {
          setError('Contrato não encontrado');
          return;
        }
        
        setContrato(data);
      } catch (err) {
        console.error('Erro ao carregar contrato:', err);
        setError('Erro ao carregar os dados do contrato');
      } finally {
        setLoading(false);
      }
    };
    
    carregarContrato();
  }, [id]);

  if (loading) {
    return (
      <PageLayout>
        <PageHeader 
          title="Detalhes do Contrato" 
          description="Carregando informações..."
          backButton
          backLink="/contratos"
        />
        <LoadingPlaceholder className="mt-6" />
      </PageLayout>
    );
  }
  
  if (error || !contrato) {
    return (
      <PageLayout>
        <PageHeader 
          title="Detalhes do Contrato" 
          description={error || 'Ocorreu um erro'}
          backButton
          backLink="/contratos"
        />
        <Placeholder 
          title="Erro ao carregar contrato"
          description={error || "Não foi possível encontrar os dados deste contrato."}
          buttonText="Voltar para a lista"
          onButtonClick={() => navigate('/contratos')}
          className="mt-6"
        />
      </PageLayout>
    );
  }
  
  const statusColor = {
    'Em Andamento': 'bg-blue-100 text-blue-800',
    'Concluído': 'bg-green-100 text-green-800',
    'Cancelado': 'bg-red-100 text-red-800',
    'Aguardando Canhoto': 'bg-yellow-100 text-yellow-800',
  };

  return (
    <PageLayout>
      <PageHeader 
        title={`Contrato #${contrato.id}`} 
        description={`Detalhes do contrato de frete para ${contrato.cliente_destino || 'Cliente'}`}
        backButton
        backLink="/contratos"
      />
      
      <div className="mt-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Badge 
                className={`text-xs py-1 ${statusColor[contrato.status_contrato] || 'bg-gray-100'}`}
              >
                {contrato.status_contrato || 'Pendente'}
              </Badge>
              
              <Badge variant="outline" className="text-xs py-1">
                ID: {contrato.identificador || contrato.id}
              </Badge>
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              Data de Saída: {formatDate(contrato.data_saida)}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => navigate(`/contratos/editar/${contrato.id}`)}>
              Editar Contrato
            </Button>
            <Button variant="default" onClick={() => navigate(`/contratos/canhoto/${contrato.id}`)}>
              Registrar Canhoto
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações do Cliente e Rota */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-3">
                <MapPin className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-medium">Rota e Cliente</h3>
              </div>
              
              <Separator className="mb-4" />
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Cliente Destinatário</p>
                  <p className="font-medium">{contrato.cliente_destino || 'N/A'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Origem</p>
                    <p className="font-medium">{contrato.cidade_origem || 'N/A'}, {contrato.estado_origem || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Destino</p>
                    <p className="font-medium">{contrato.cidade_destino || 'N/A'}, {contrato.estado_destino || 'N/A'}</p>
                  </div>
                </div>
                
                {contrato.cte_numero && (
                  <div>
                    <p className="text-sm text-gray-500">Número do CT-e</p>
                    <p className="font-medium">{contrato.cte_numero}</p>
                  </div>
                )}
                
                {contrato.manifesto_numero && (
                  <div>
                    <p className="text-sm text-gray-500">Número do Manifesto</p>
                    <p className="font-medium">{contrato.manifesto_numero}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Informações do Veículo e Motorista */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-3">
                <Truck className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-medium">Veículo e Motorista</h3>
              </div>
              
              <Separator className="mb-4" />
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Placa Cavalo</p>
                    <p className="font-medium">{contrato.placa_cavalo || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Placa Carreta</p>
                    <p className="font-medium">{contrato.placa_carreta || 'N/A'}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Motorista</p>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1 text-gray-400" />
                    <p className="font-medium">{contrato.motorista || 'N/A'}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Tipo de Frota</p>
                  <Badge variant={contrato.tipo_frota === 'frota' ? 'outline' : 'secondary'}>
                    {contrato.tipo_frota === 'frota' ? 'Própria' : 'Terceirizada'}
                  </Badge>
                </div>
                
                {contrato.tipo_frota === 'terceiro' && (
                  <div>
                    <p className="text-sm text-gray-500">Proprietário</p>
                    <p className="font-medium">{contrato.proprietario || 'N/A'}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Informações Financeiras */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-3">
                <DollarSign className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-medium">Informações Financeiras</h3>
              </div>
              
              <Separator className="mb-4" />
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Valor do Frete</p>
                  <p className="text-lg font-medium text-green-700">
                    {formatCurrency(contrato.valor_frete || 0)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Valor da Carga</p>
                  <p className="font-medium">
                    {formatCurrency(contrato.valor_carga || 0)}
                  </p>
                </div>
                
                {contrato.tipo_frota === 'terceiro' && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Valor do Adiantamento</p>
                      <p className="font-medium">
                        {formatCurrency(contrato.valor_adiantamento || 0)}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Valor do Pedágio</p>
                      <p className="font-medium">
                        {formatCurrency(contrato.valor_pedagio || 0)}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Saldo a Pagar</p>
                      <p className="font-medium">
                        {formatCurrency(contrato.saldo_pagar || 0)}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Observações e Detalhes Adicionais */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-3">
                <FileCheck className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-medium">Observações e Status</h3>
              </div>
              
              <Separator className="mb-4" />
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Status do Contrato</p>
                  <Badge 
                    className={`mt-1 ${statusColor[contrato.status_contrato] || 'bg-gray-100'}`}
                  >
                    {contrato.status_contrato || 'Pendente'}
                  </Badge>
                </div>
                
                {contrato.data_entrega_canhoto && (
                  <div>
                    <p className="text-sm text-gray-500">Data de Entrega do Canhoto</p>
                    <p className="font-medium">{formatDate(contrato.data_entrega_canhoto)}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-500">Observações</p>
                  <p className="text-sm mt-1 text-gray-700 bg-gray-50 p-2 rounded min-h-[80px]">
                    {contrato.observacoes || 'Nenhuma observação registrada.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default DetalheContrato;
