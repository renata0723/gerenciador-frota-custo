
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NewPageLayout from '@/components/layout/NewPageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { ArrowLeft, CalendarIcon, Clipboard, Eye, Pencil, Truck, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { toast } from 'sonner';
import { LoadingPlaceholder } from '@/components/ui/Placeholder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContratoCompleto } from '@/types/contrato';

const DetalheContrato = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contrato, setContrato] = useState<ContratoCompleto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  
  useEffect(() => {
    if (id) {
      carregarContrato(id);
    }
  }, [id]);
  
  const carregarContrato = async (contratoId: string) => {
    setCarregando(true);
    setErro(null);
    
    try {
      // Buscar dados do contrato
      const { data: contratoData, error: contratoError } = await supabase
        .from('Contratos')
        .select('*')
        .eq('id', parseInt(contratoId))
        .single();
        
      if (contratoError) throw contratoError;
      
      if (!contratoData) {
        setErro('Contrato não encontrado');
        return;
      }
      
      // Buscar informações de canhoto relacionadas ao contrato
      const { data: canhotoData } = await supabase
        .from('Canhoto')
        .select('*')
        .eq('contrato_id', contratoId)
        .single();
      
      // Montar o objeto completo do contrato
      const contratoCompleto: ContratoCompleto = {
        ...contratoData,
        canhoto: canhotoData || null
      };
      
      setContrato(contratoCompleto);
    } catch (error) {
      console.error('Erro ao carregar contrato:', error);
      setErro('Ocorreu um erro ao carregar os dados do contrato');
      toast.error('Erro ao carregar dados do contrato');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <NewPageLayout>
      <PageHeader
        title={carregando ? 'Carregando Contrato...' : `Contrato #${id}`}
        description="Visualize os detalhes completos do contrato"
        icon={<Clipboard size={24} className="text-blue-500" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Contratos', href: '/contratos' },
          { label: `Contrato #${id}` }
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/contratos')}>
              <ArrowLeft size={16} className="mr-1" />
              Voltar
            </Button>
            <Button onClick={() => navigate(`/contratos/editar/${id}`)}>
              <Pencil size={16} className="mr-1" />
              Editar
            </Button>
          </div>
        }
      />
      
      {carregando ? (
        <LoadingPlaceholder className="m-4" />
      ) : erro ? (
        <Card className="m-4">
          <CardContent className="p-8 text-center">
            <p className="text-red-500 mb-4">{erro}</p>
            <Button onClick={() => navigate('/contratos')}>Voltar para Contratos</Button>
          </CardContent>
        </Card>
      ) : contrato ? (
        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center 
                  ${contrato.status_contrato === 'Em Andamento' ? 'bg-blue-100 text-blue-800' : 
                    contrato.status_contrato === 'Concluído' ? 'bg-green-100 text-green-800' : 
                    contrato.status_contrato === 'Cancelado' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'}`}>
                  {contrato.status_contrato || 'Pendente'}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md">Data de Saída</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center">
                <CalendarIcon size={18} className="mr-2 text-gray-500" />
                <span>{formatDate(contrato.dataSaida)}</span>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md">Valores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Valor Frete:</span>
                    <span className="font-medium">{formatCurrency(contrato.valor_frete || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Valor Carga:</span>
                    <span className="font-medium">{formatCurrency(contrato.valor_carga || 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="detalhes">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
              <TabsTrigger value="veiculo">Veículo/Motorista</TabsTrigger>
              <TabsTrigger value="canhoto">Canhoto</TabsTrigger>
            </TabsList>
            
            <TabsContent value="detalhes" className="p-1">
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Contrato</CardTitle>
                  <CardDescription>Informações completas sobre o contrato</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Origem</h3>
                      <p className="text-lg">{contrato.cidade_origem}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Destino</h3>
                      <p className="text-lg">{contrato.cidade_destino}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Cliente Destinatário</h3>
                      <p className="text-lg">{contrato.cliente_destino}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Tipo de Frete</h3>
                      <p className="text-lg capitalize">{contrato.tipo_frota}</p>
                    </div>
                    
                    {contrato.proprietario && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Proprietário</h3>
                        <p className="text-lg">{contrato.proprietario}</p>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Observações</h3>
                      <p className="text-sm text-gray-700">{contrato.observacoes || 'Sem observações'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documentos" className="p-1">
              <Card>
                <CardHeader>
                  <CardTitle>Documentos</CardTitle>
                  <CardDescription>Documentos relacionados ao contrato</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Manifestos</h3>
                    {contrato.manifestos && contrato.manifestos.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {contrato.manifestos.map((manifesto, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {manifesto}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Nenhum manifesto registrado</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">CTes</h3>
                    {contrato.ctes && contrato.ctes.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {contrato.ctes.map((cte, idx) => (
                          <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            {cte}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Nenhum CTe registrado</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Notas Fiscais</h3>
                    {contrato.notasFiscais && contrato.notasFiscais.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {contrato.notasFiscais.map((nf, idx) => (
                          <div key={idx} className="flex justify-between items-center border p-2 rounded">
                            <span>NF #{nf.numero}</span>
                            <span className="font-medium">{formatCurrency(nf.valor)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Nenhuma nota fiscal registrada</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="veiculo" className="p-1">
              <Card>
                <CardHeader>
                  <CardTitle>Veículo e Motorista</CardTitle>
                  <CardDescription>Detalhes do veículo e motorista responsável</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Placa do Cavalo</h3>
                      <div className="flex items-center mt-1">
                        <Truck className="h-5 w-5 mr-2 text-blue-500" />
                        <p className="text-lg uppercase">{contrato.placa_cavalo}</p>
                      </div>
                    </div>
                    
                    {contrato.placa_carreta && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Placa da Carreta</h3>
                        <p className="text-lg uppercase">{contrato.placa_carreta}</p>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Tipo</h3>
                      <p className="text-lg capitalize">
                        {contrato.tipo_frota === 'frota' ? 'Frota Própria' : 'Terceirizado'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Motorista</h3>
                      <p className="text-lg">{contrato.motorista || 'Não informado'}</p>
                    </div>
                    
                    {contrato.proprietario && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Proprietário</h3>
                        <p className="text-lg">{contrato.proprietario}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" size="sm" className="ml-auto">
                    <Eye size={16} className="mr-1" />
                    Ver Histórico do Veículo
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="canhoto" className="p-1">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Canhoto</CardTitle>
                  <CardDescription>Situação da entrega e canhoto</CardDescription>
                </CardHeader>
                <CardContent>
                  {contrato.canhoto ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Status</h3>
                          <div className={`px-3 py-1.5 mt-1 rounded-full text-sm font-medium inline-flex items-center 
                            ${contrato.canhoto.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : 
                              contrato.canhoto.status === 'Recebido' ? 'bg-green-100 text-green-800' : 
                              'bg-blue-100 text-blue-800'}`}>
                            {contrato.canhoto.status}
                          </div>
                        </div>
                        
                        {contrato.canhoto.data_entrega_cliente && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Data de Entrega ao Cliente</h3>
                            <p>{formatDate(contrato.canhoto.data_entrega_cliente)}</p>
                          </div>
                        )}
                        
                        {contrato.canhoto.data_recebimento_canhoto && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Data de Recebimento do Canhoto</h3>
                            <p>{formatDate(contrato.canhoto.data_recebimento_canhoto)}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        {contrato.canhoto.responsavel_recebimento && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Responsável pelo Recebimento</h3>
                            <p>{contrato.canhoto.responsavel_recebimento}</p>
                          </div>
                        )}
                        
                        {contrato.tipo_frota === 'terceiro' && contrato.canhoto.saldo_a_pagar && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Saldo a Pagar</h3>
                            <p className="text-lg font-medium text-blue-600">
                              {formatCurrency(contrato.canhoto.saldo_a_pagar)}
                            </p>
                            
                            {contrato.canhoto.data_programada_pagamento && (
                              <p className="text-sm text-gray-500">
                                Vencimento: {formatDate(contrato.canhoto.data_programada_pagamento)}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <FileText className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">Nenhuma informação de canhoto registrada para este contrato</p>
                      <Button variant="outline" onClick={() => navigate('/canhotos/novo')}>
                        Registrar Canhoto
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : null}
    </NewPageLayout>
  );
};

export default DetalheContrato;
