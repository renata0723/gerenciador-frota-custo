
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, FileSpreadsheet, AlignJustify, FileDown, Printer } from 'lucide-react';
import FolhaPagamentoForm from '@/components/folha-pagamento/FolhaPagamentoForm';
import FolhaPagamentoTable from '@/components/folha-pagamento/FolhaPagamentoTable';
import { 
  buscarFolhaPagamento, 
  atualizarRegistroFolhaPagamento, 
  excluirRegistroFolhaPagamento, 
  FolhaPagamento as FolhaPagamentoType 
} from '@/services/contabilidadeService';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoadingPlaceholder } from '@/components/ui/Placeholder';

const FolhaPagamento = () => {
  const navigate = useNavigate();
  const [folhasPagamento, setFolhasPagamento] = useState<FolhaPagamentoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('listar');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: number | null }>({
    open: false,
    id: null
  });
  const [viewDialog, setViewDialog] = useState<{ open: boolean; folha: FolhaPagamentoType | null }>({
    open: false,
    folha: null
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const data = await buscarFolhaPagamento();
      setFolhasPagamento(data);
    } catch (error) {
      console.error('Erro ao carregar folhas de pagamento:', error);
      toast.error('Erro ao carregar dados. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFolha = (folha: FolhaPagamentoType) => {
    setFolhasPagamento(prev => [folha, ...prev]);
    setActiveTab('listar');
  };

  const handleEdit = (folha: FolhaPagamentoType) => {
    // Em uma implementação completa, abriria um dialog de edição
    toast.info('Funcionalidade de edição será implementada em breve.');
  };

  const handleView = (folha: FolhaPagamentoType) => {
    setViewDialog({ open: true, folha });
  };

  const handleDelete = (id: number) => {
    setDeleteDialog({ open: true, id });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.id) return;
    
    try {
      const success = await excluirRegistroFolhaPagamento(deleteDialog.id);
      
      if (success) {
        toast.success('Registro excluído com sucesso.');
        setFolhasPagamento(prev => prev.filter(item => item.id !== deleteDialog.id));
      } else {
        toast.error('Erro ao excluir registro.');
      }
    } catch (error) {
      console.error('Erro ao excluir folha de pagamento:', error);
      toast.error('Erro ao excluir registro. Tente novamente.');
    } finally {
      setDeleteDialog({ open: false, id: null });
    }
  };

  const formatarValor = (valor: number | undefined) => {
    if (valor === undefined) return 'R$ 0,00';
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Folha de Pagamento" 
        description="Gerenciamento de folha de pagamento dos funcionários"
        actions={
          <Button variant="ghost" onClick={() => navigate('/contabilidade')}>
            Voltar
          </Button>
        }
      />
      
      <Tabs defaultValue="listar" value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="listar">Registros</TabsTrigger>
          <TabsTrigger value="novo">Novo Registro</TabsTrigger>
        </TabsList>
        
        <TabsContent value="listar">
          <Card>
            <CardContent className="p-6">
              {loading ? (
                <LoadingPlaceholder message="Carregando registros de folha de pagamento..." />
              ) : (
                <>
                  <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Users className="mr-2 h-5 w-5" />
                      Registros de Folha de Pagamento
                    </h3>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <FileDown className="mr-2 h-4 w-4" />
                        Exportar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimir
                      </Button>
                    </div>
                  </div>
                  
                  <FolhaPagamentoTable 
                    data={folhasPagamento}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="novo">
          <div className="mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <FileSpreadsheet className="mr-2 h-5 w-5" />
              Novo Registro de Folha de Pagamento
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Preencha os dados para criar um novo registro de folha de pagamento
            </p>
          </div>
          
          <FolhaPagamentoForm onSave={handleSaveFolha} />
        </TabsContent>
      </Tabs>
      
      {/* Dialog de confirmação de exclusão */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este registro de folha de pagamento? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, id: null })}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog de visualização detalhada */}
      <Dialog open={viewDialog.open} onOpenChange={(open) => setViewDialog({ ...viewDialog, open })}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Folha de Pagamento</DialogTitle>
            <DialogDescription>
              Informações completas do registro de folha de pagamento
            </DialogDescription>
          </DialogHeader>
          
          {viewDialog.folha && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500">Funcionário</h4>
                    <p className="text-lg">{viewDialog.folha.funcionario_nome}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500">CPF</h4>
                    <p className="text-lg">{viewDialog.folha.cpf || 'Não informado'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500">Cargo</h4>
                    <p>{viewDialog.folha.cargo || 'Não informado'}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500">Data de Pagamento</h4>
                    <p>{viewDialog.folha.data_pagamento}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500">Período</h4>
                    <p>
                      {capitalizeFirstLetter(viewDialog.folha.mes_referencia)}/{viewDialog.folha.ano_referencia}
                    </p>
                  </div>
                </div>
                
                <Alert>
                  <AlignJustify className="h-4 w-4" />
                  <AlertTitle>Resumo financeiro</AlertTitle>
                  <AlertDescription>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <span className="text-sm text-gray-500">Salário Base:</span>
                        <span className="block font-semibold">{formatarValor(viewDialog.folha.salario_base)}</span>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-500">Valor Líquido:</span>
                        <span className="block font-semibold text-green-600">{formatarValor(viewDialog.folha.valor_total)}</span>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
                
                <div className="border-t pt-4">
                  <h4 className="text-md font-semibold mb-3">Proventos</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h5 className="text-sm font-semibold text-gray-500">Horas Extras</h5>
                      <p>{viewDialog.folha.horas_extras || 0} horas x {formatarValor(viewDialog.folha.valor_hora_extra)} = {formatarValor((viewDialog.folha.horas_extras || 0) * (viewDialog.folha.valor_hora_extra || 0))}</p>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-semibold text-gray-500">Adicional de Periculosidade</h5>
                      <p>{formatarValor(viewDialog.folha.adicional_periculosidade)}</p>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-semibold text-gray-500">Adicional de Insalubridade</h5>
                      <p>{formatarValor(viewDialog.folha.adicional_insalubridade)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <h5 className="text-sm font-semibold text-gray-500">Outros Adicionais</h5>
                    <p>{formatarValor(viewDialog.folha.outros_adicionais)}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="text-md font-semibold mb-3">Descontos</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h5 className="text-sm font-semibold text-gray-500">INSS</h5>
                      <p className="text-red-500">-{formatarValor(viewDialog.folha.desconto_inss)}</p>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-semibold text-gray-500">IRRF</h5>
                      <p className="text-red-500">-{formatarValor(viewDialog.folha.desconto_irrf)}</p>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-semibold text-gray-500">Outros Descontos</h5>
                      <p className="text-red-500">-{formatarValor(viewDialog.folha.outros_descontos)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-b py-4 mt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-lg font-semibold">Total a Receber:</span>
                    </div>
                    <div>
                      <span className="text-2xl font-bold text-green-600">
                        {formatarValor(viewDialog.folha.valor_total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          
          <DialogFooter>
            <Button onClick={() => setViewDialog({ open: false, folha: null })}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default FolhaPagamento;
