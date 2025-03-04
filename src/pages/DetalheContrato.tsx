
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, FileText, AlertTriangle, Ban, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import FormularioCancelamento from '@/components/contratos/FormularioCancelamento';
import FormularioRejeicaoContrato from '@/components/contratos/FormularioRejeicaoContrato';
import { formatCurrency } from '@/utils/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const DetalheContrato = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contrato, setContrato] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  
  // Estados para dialogs
  const [showCancelamentoDialog, setShowCancelamentoDialog] = useState(false);
  const [showRejeicaoDialog, setShowRejeicaoDialog] = useState(false);
  
  // Estado para controle de abas
  const [activeTab, setActiveTab] = useState('detalhes');
  
  useEffect(() => {
    if (id) {
      carregarContrato(id);
    }
  }, [id]);
  
  const carregarContrato = async (contratoId: string) => {
    setCarregando(true);
    try {
      const { data, error } = await supabase
        .from('Contratos')
        .select('*')
        .eq('id', contratoId)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setContrato(data);
      } else {
        setErro('Contrato não encontrado');
      }
    } catch (error) {
      console.error('Erro ao carregar contrato:', error);
      setErro('Ocorreu um erro ao carregar os dados do contrato');
    } finally {
      setCarregando(false);
    }
  };
  
  const handleCancelamento = () => {
    setShowCancelamentoDialog(true);
  };
  
  const handleRejeicao = () => {
    setShowRejeicaoDialog(true);
  };
  
  const handleCancelamentoRealizado = () => {
    setShowCancelamentoDialog(false);
    toast.success('Contrato cancelado com sucesso');
    carregarContrato(id as string);
  };
  
  const handleRejeicaoRealizada = () => {
    setShowRejeicaoDialog(false);
    toast.success('Contrato rejeitado com sucesso');
    carregarContrato(id as string);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Em Andamento':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Em Andamento</Badge>;
      case 'Concluído':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Concluído</Badge>;
      case 'Cancelado':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Cancelado</Badge>;
      case 'Rejeitado':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  if (carregando) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center min-h-[500px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </PageLayout>
    );
  }
  
  if (erro || !contrato) {
    return (
      <PageLayout>
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{erro || 'Contrato não encontrado'}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => navigate('/contratos')}>Voltar para Contratos</Button>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <PageHeader
        title={`Contrato #${contrato.id}`}
        description={`${contrato.cidade_origem} para ${contrato.cidade_destino} - ${contrato.cliente_destino}`}
        icon={<FileText size={26} className="text-blue-500" />}
        backButton={true}
        backLink="/contratos"
      >
        <div className="flex space-x-2">
          {getStatusBadge(contrato.status_contrato)}
          {contrato.tipo_frota === 'frota' ? (
            <Badge variant="secondary">Frota Própria</Badge>
          ) : (
            <Badge variant="secondary">Frota Terceirizada</Badge>
          )}
        </div>
      </PageHeader>
      
      <div className="mt-4 flex justify-end space-x-2">
        <Button
          variant="destructive"
          onClick={handleCancelamento}
          disabled={contrato.status_contrato === 'Cancelado' || contrato.status_contrato === 'Rejeitado'}
          className="flex items-center"
        >
          <Ban className="mr-2 h-4 w-4" />
          Cancelar Contrato
        </Button>
        <Button
          variant="outline"
          onClick={handleRejeicao}
          disabled={contrato.status_contrato === 'Cancelado' || contrato.status_contrato === 'Rejeitado'}
          className="flex items-center text-orange-600 border-orange-600 hover:bg-orange-50"
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Rejeitar Contrato
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate(`/contratos/editar/${contrato.id}`)}
          disabled={contrato.status_contrato === 'Cancelado' || contrato.status_contrato === 'Rejeitado'}
          className="flex items-center"
        >
          Editar
        </Button>
      </div>
      
      <div className="mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="detalhes" className="flex-1">Detalhes</TabsTrigger>
            <TabsTrigger value="documentos" className="flex-1">Documentos</TabsTrigger>
            <TabsTrigger value="financeiro" className="flex-1">Financeiro</TabsTrigger>
            <TabsTrigger value="canhoto" className="flex-1">Canhoto</TabsTrigger>
          </TabsList>
          
          <TabsContent value="detalhes" className="p-6 bg-white rounded-lg shadow mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">Informações do Contrato</h3>
                  <div className="mt-2 space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Número do Contrato:</span>
                      <span className="font-medium">{contrato.id}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Data de Saída:</span>
                      <span className="font-medium">{contrato.data_saida}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Status:</span>
                      <span>{getStatusBadge(contrato.status_contrato)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Tipo de Frota:</span>
                      <span className="font-medium capitalize">{contrato.tipo_frota === 'frota' ? 'Própria' : 'Terceirizada'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">Trajeto</h3>
                  <div className="mt-2 space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Origem:</span>
                      <span className="font-medium">{contrato.cidade_origem}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Destino:</span>
                      <span className="font-medium">{contrato.cidade_destino}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Cliente:</span>
                      <span className="font-medium">{contrato.cliente_destino}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">Veículo e Motorista</h3>
                  <div className="mt-2 space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Placa Cavalo:</span>
                      <span className="font-medium">{contrato.placa_cavalo}</span>
                    </div>
                    {contrato.placa_carreta && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Placa Carreta:</span>
                        <span className="font-medium">{contrato.placa_carreta}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Motorista:</span>
                      <span className="font-medium">{contrato.motorista_id || 'Não informado'}</span>
                    </div>
                    {contrato.proprietario && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Proprietário:</span>
                        <span className="font-medium">{contrato.proprietario}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">Informações Financeiras</h3>
                  <div className="mt-2 space-y-3">
                    {contrato.valor_frete && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Valor do Frete:</span>
                        <span className="font-medium">{formatCurrency(contrato.valor_frete)}</span>
                      </div>
                    )}
                    {contrato.valor_carga && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Valor da Carga:</span>
                        <span className="font-medium">{formatCurrency(contrato.valor_carga)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {contrato.status_contrato === 'Cancelado' && (
                  <Card className="bg-red-50 border-red-200">
                    <CardContent className="p-4">
                      <h3 className="text-md font-semibold text-red-700 flex items-center">
                        <Ban className="mr-2 h-4 w-4" />
                        Informações de Cancelamento
                      </h3>
                      <div className="mt-2 space-y-2 text-sm text-red-700">
                        <div>
                          <span className="font-medium">Motivo:</span> {contrato.motivo_cancelamento || 'Não informado'}
                        </div>
                        <div>
                          <span className="font-medium">Data:</span> {contrato.data_cancelamento || 'Não informada'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {contrato.status_contrato === 'Rejeitado' && (
                  <Card className="bg-orange-50 border-orange-200">
                    <CardContent className="p-4">
                      <h3 className="text-md font-semibold text-orange-700 flex items-center">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Informações de Rejeição
                      </h3>
                      <div className="mt-2 space-y-2 text-sm text-orange-700">
                        <div>
                          <span className="font-medium">Motivo:</span> {contrato.motivo_rejeicao || 'Não informado'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="documentos" className="p-6 bg-white rounded-lg shadow mt-4">
            {/* Conteúdo da aba de documentos */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Documentos do Contrato</h3>
              <p className="text-gray-500">Informações sobre CT-e, Manifesto e Notas Fiscais associadas a este contrato.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="financeiro" className="p-6 bg-white rounded-lg shadow mt-4">
            {/* Conteúdo da aba financeira */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Informações Financeiras</h3>
              <p className="text-gray-500">Detalhes financeiros do contrato, incluindo frete, adiantamento e saldo a pagar.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="canhoto" className="p-6 bg-white rounded-lg shadow mt-4">
            {/* Conteúdo da aba de canhoto */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Status do Canhoto</h3>
              <p className="text-gray-500">Informações sobre o recebimento do canhoto e comprovantes de entrega.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Dialog de Cancelamento */}
      <Dialog open={showCancelamentoDialog} onOpenChange={setShowCancelamentoDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <FormularioCancelamento
            tipo="Contrato"
            numeroDocumento={contrato.id.toString()}
            onBack={() => setShowCancelamentoDialog(false)}
            onCancelamentoRealizado={handleCancelamentoRealizado}
            onCancel={() => setShowCancelamentoDialog(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Dialog de Rejeição */}
      <Dialog open={showRejeicaoDialog} onOpenChange={setShowRejeicaoDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <FormularioRejeicaoContrato
            contrato={contrato}
            onSave={handleRejeicaoRealizada}
            onBack={() => setShowRejeicaoDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default DetalheContrato;
