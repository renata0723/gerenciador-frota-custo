
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  CanhotoPendente, 
  Canhoto,
  CanhotoFiltro 
} from '@/types/canhoto';
import CanhotoForm from '@/components/canhotos/CanhotoForm';
import { Plus, Search, CalendarCheck, Filter, RefreshCw, Truck, DownloadCloud } from 'lucide-react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const Canhotos = () => {
  const [activeTab, setActiveTab] = useState('pendentes');
  const [canhotos, setCanhotos] = useState<CanhotoPendente[]>([]);
  const [dialogCanhoto, setDialogCanhoto] = useState(false);
  const [dialogFiltro, setDialogFiltro] = useState(false);
  const [canhotoSelecionado, setCanhotoSelecionado] = useState<CanhotoPendente | null>(null);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState<CanhotoFiltro>({
    status: activeTab === 'pendentes' ? 'Pendente' : ''
  });
  
  // Para o formulário de registro
  const [contratoId, setContratoId] = useState('');
  
  useEffect(() => {
    buscarCanhotos();
  }, [activeTab]);
  
  const buscarCanhotos = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('Canhoto')
        .select('*');
      
      // Filtro por status baseado na aba ativa
      if (activeTab === 'pendentes') {
        query = query.eq('status', 'Pendente');
      } else if (activeTab === 'recebidos') {
        query = query.eq('status', 'Recebido');
      } else if (filtro.status) {
        query = query.eq('status', filtro.status);
      }
      
      // Aplicar outros filtros se existirem
      if (filtro.cliente) {
        query = query.ilike('cliente', `%${filtro.cliente}%`);
      }
      
      if (filtro.motorista) {
        query = query.ilike('motorista', `%${filtro.motorista}%`);
      }
      
      if (filtro.contrato_id) {
        query = query.eq('contrato_id', filtro.contrato_id);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setCanhotos(data || []);
    } catch (error) {
      console.error('Erro ao buscar canhotos:', error);
      toast.error('Erro ao buscar canhotos');
    } finally {
      setLoading(false);
    }
  };
  
  const abrirDialogRegistro = (canhoto: CanhotoPendente) => {
    setCanhotoSelecionado(canhoto);
    setDialogCanhoto(true);
  };
  
  const registrarCanhoto = async (data: Partial<Canhoto>) => {
    if (!canhotoSelecionado) return;
    
    try {
      const { error } = await supabase
        .from('Canhoto')
        .update({
          data_recebimento_canhoto: data.data_recebimento_canhoto,
          data_entrega_cliente: data.data_entrega_cliente,
          responsavel_recebimento: data.responsavel_recebimento,
          status: 'Recebido',
          data_programada_pagamento: data.data_programada_pagamento
        })
        .eq('id', canhotoSelecionado.id);
        
      if (error) {
        throw error;
      }
      
      toast.success('Canhoto registrado com sucesso!');
      setDialogCanhoto(false);
      buscarCanhotos();
      
      // Se tem saldo a pagar, atualizar o status do saldo correspondente
      if (canhotoSelecionado.saldo_a_pagar && canhotoSelecionado.saldo_a_pagar > 0) {
        try {
          const { error: saldoError } = await supabase
            .from('Saldo a pagar')
            .update({
              status: 'pendente',
              data_pagamento: data.data_programada_pagamento
            })
            .eq('contratos_associados', canhotoSelecionado.contrato_id);
            
          if (saldoError) {
            console.error('Erro ao atualizar saldo a pagar:', saldoError);
          }
        } catch (e) {
          console.error('Erro ao processar saldo a pagar:', e);
        }
      }
    } catch (error) {
      console.error('Erro ao registrar canhoto:', error);
      toast.error('Erro ao registrar canhoto');
    }
  };
  
  const abrirDialogFiltro = () => {
    setDialogFiltro(true);
  };
  
  const aplicarFiltro = () => {
    buscarCanhotos();
    setDialogFiltro(false);
  };
  
  const limparFiltro = () => {
    setFiltro({
      status: activeTab === 'pendentes' ? 'Pendente' : ''
    });
    buscarCanhotos();
    setDialogFiltro(false);
  };
  
  const baixarRelatorio = () => {
    // Implementação do relatório
    toast.info('Funcionalidade de relatório em desenvolvimento');
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Recebido':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  return (
    <PageLayout>
      <PageHeader 
        title="Canhotos" 
        description="Gestão de recebimento de canhotos de entrega"
      >
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={abrirDialogFiltro}>
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
          <Button variant="outline" size="sm" onClick={buscarCanhotos}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm" onClick={baixarRelatorio}>
            <DownloadCloud className="mr-2 h-4 w-4" />
            Relatório
          </Button>
        </div>
      </PageHeader>
      
      <div className="mt-6">
        <Tabs 
          defaultValue="pendentes" 
          value={activeTab} 
          onValueChange={(value) => {
            setActiveTab(value);
            setFiltro({
              ...filtro,
              status: value === 'pendentes' ? 'Pendente' : value === 'recebidos' ? 'Recebido' : ''
            });
          }}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
            <TabsTrigger value="recebidos">Recebidos</TabsTrigger>
            <TabsTrigger value="todos">Todos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pendentes">
            <Card>
              <CardContent className="p-6">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin h-8 w-8 border-b-2 border-blue-700 rounded-full"></div>
                  </div>
                ) : (
                  <div className="relative overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Contrato</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Motorista</TableHead>
                          <TableHead>Documentos</TableHead>
                          <TableHead>Proprietário</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {canhotos.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                              <div className="flex flex-col items-center justify-center">
                                <CalendarCheck className="h-12 w-12 text-gray-300 mb-2" />
                                <p>Nenhum canhoto pendente encontrado</p>
                                <p className="text-sm">Todos os canhotos foram recebidos ou ainda não há contratos finalizados.</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          canhotos.map((canhoto) => (
                            <TableRow key={canhoto.id}>
                              <TableCell className="font-medium">{canhoto.contrato_id}</TableCell>
                              <TableCell>{canhoto.cliente}</TableCell>
                              <TableCell>{canhoto.motorista}</TableCell>
                              <TableCell>
                                {canhoto.numero_cte && (
                                  <div className="text-xs text-gray-600">
                                    CT-e: {canhoto.numero_cte}
                                  </div>
                                )}
                                {canhoto.numero_manifesto && (
                                  <div className="text-xs text-gray-600">
                                    Manifesto: {canhoto.numero_manifesto}
                                  </div>
                                )}
                                {canhoto.numero_nota_fiscal && (
                                  <div className="text-xs text-gray-600">
                                    NF: {canhoto.numero_nota_fiscal}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>{canhoto.proprietario_veiculo || '-'}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(canhoto.status || 'Pendente')}>
                                  {canhoto.status || 'Pendente'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => abrirDialogRegistro(canhoto)}
                                >
                                  <Plus className="mr-1 h-4 w-4" />
                                  Registrar
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recebidos">
            <Card>
              <CardContent className="p-6">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin h-8 w-8 border-b-2 border-blue-700 rounded-full"></div>
                  </div>
                ) : (
                  <div className="relative overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Contrato</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Data Entrega</TableHead>
                          <TableHead>Data Recebimento</TableHead>
                          <TableHead>Responsável</TableHead>
                          <TableHead>Pgto. Programado</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {canhotos.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                              <div className="flex flex-col items-center justify-center">
                                <Truck className="h-12 w-12 text-gray-300 mb-2" />
                                <p>Nenhum canhoto recebido encontrado</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          canhotos.map((canhoto) => (
                            <TableRow key={canhoto.id}>
                              <TableCell className="font-medium">{canhoto.contrato_id}</TableCell>
                              <TableCell>{canhoto.cliente}</TableCell>
                              <TableCell>
                                {canhoto.data_entrega_cliente ? format(new Date(canhoto.data_entrega_cliente), 'dd/MM/yyyy') : '-'}
                              </TableCell>
                              <TableCell>
                                {canhoto.data_recebimento_canhoto ? format(new Date(canhoto.data_recebimento_canhoto), 'dd/MM/yyyy') : '-'}
                              </TableCell>
                              <TableCell>{canhoto.responsavel_recebimento || '-'}</TableCell>
                              <TableCell>
                                {canhoto.data_programada_pagamento ? format(new Date(canhoto.data_programada_pagamento), 'dd/MM/yyyy') : '-'}
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(canhoto.status || 'Pendente')}>
                                  {canhoto.status || 'Pendente'}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="todos">
            <Card>
              <CardContent className="p-6">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin h-8 w-8 border-b-2 border-blue-700 rounded-full"></div>
                  </div>
                ) : (
                  <div className="relative overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Contrato</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Documentos</TableHead>
                          <TableHead>Data Entrega</TableHead>
                          <TableHead>Data Recebimento</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {canhotos.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                              <div className="flex flex-col items-center justify-center">
                                <Search className="h-12 w-12 text-gray-300 mb-2" />
                                <p>Nenhum canhoto encontrado</p>
                                <p className="text-sm">Tente ajustar os filtros de busca.</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          canhotos.map((canhoto) => (
                            <TableRow key={canhoto.id}>
                              <TableCell className="font-medium">{canhoto.contrato_id}</TableCell>
                              <TableCell>{canhoto.cliente}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(canhoto.status || 'Pendente')}>
                                  {canhoto.status || 'Pendente'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {canhoto.numero_cte && (
                                  <div className="text-xs text-gray-600">
                                    CT-e: {canhoto.numero_cte}
                                  </div>
                                )}
                                {canhoto.numero_nota_fiscal && (
                                  <div className="text-xs text-gray-600">
                                    NF: {canhoto.numero_nota_fiscal}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                {canhoto.data_entrega_cliente ? format(new Date(canhoto.data_entrega_cliente), 'dd/MM/yyyy') : '-'}
                              </TableCell>
                              <TableCell>
                                {canhoto.data_recebimento_canhoto ? format(new Date(canhoto.data_recebimento_canhoto), 'dd/MM/yyyy') : '-'}
                              </TableCell>
                              <TableCell>
                                {canhoto.status === 'Pendente' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => abrirDialogRegistro(canhoto)}
                                  >
                                    <Plus className="mr-1 h-4 w-4" />
                                    Registrar
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Dialog para registrar canhoto */}
      <Dialog open={dialogCanhoto} onOpenChange={setDialogCanhoto}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Registrar Recebimento de Canhoto</DialogTitle>
            <DialogDescription>
              Informe os dados do recebimento do canhoto.
            </DialogDescription>
          </DialogHeader>
          
          {canhotoSelecionado && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium mb-1">Contrato</p>
                  <p className="text-sm">{canhotoSelecionado.contrato_id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Cliente</p>
                  <p className="text-sm">{canhotoSelecionado.cliente}</p>
                </div>
              </div>
              
              <Separator className="my-2" />
              
              <CanhotoForm
                dados={canhotoSelecionado}
                onSubmit={registrarCanhoto}
                onCancel={() => setDialogCanhoto(false)}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Dialog para filtrar canhotos */}
      <Dialog open={dialogFiltro} onOpenChange={setDialogFiltro}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Filtrar Canhotos</DialogTitle>
            <DialogDescription>
              Defina os critérios de filtragem para a lista de canhotos.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="filtroStatus">Status</Label>
              <Select 
                value={filtro.status || ''} 
                onValueChange={(value) => setFiltro({...filtro, status: value})}
              >
                <SelectTrigger id="filtroStatus">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Recebido">Recebido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="filtroCliente">Cliente</Label>
              <Input
                id="filtroCliente"
                type="text"
                placeholder="Digite o nome do cliente"
                value={filtro.cliente || ''}
                onChange={(e) => setFiltro({...filtro, cliente: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="filtroMotorista">Motorista</Label>
              <Input
                id="filtroMotorista"
                type="text"
                placeholder="Digite o nome do motorista"
                value={filtro.motorista || ''}
                onChange={(e) => setFiltro({...filtro, motorista: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="filtroContrato">Contrato</Label>
              <Input
                id="filtroContrato"
                type="text"
                placeholder="Digite o número do contrato"
                value={filtro.contrato_id || ''}
                onChange={(e) => setFiltro({...filtro, contrato_id: e.target.value})}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={limparFiltro}>
                Limpar
              </Button>
              <Button type="button" onClick={aplicarFiltro}>
                Aplicar Filtro
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Canhotos;
