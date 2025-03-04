
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';
import FolhaPagamentoTable from '@/components/folha-pagamento/FolhaPagamentoTable';
import FolhaPagamentoForm from '@/components/folha-pagamento/FolhaPagamentoForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { FolhaPagamento } from '@/types/contabilidade';
import { toast } from 'sonner';
import { 
  listarFolhaPagamento, 
  buscarFolhaPagamento, 
  criarRegistroFolhaPagamento, 
  atualizarRegistroFolhaPagamento, 
  excluirRegistroFolhaPagamento 
} from '@/services/folhaPagamentoService';

const FolhaPagamentoPage: React.FC = () => {
  const [dadosFolhaPagamento, setDadosFolhaPagamento] = useState<FolhaPagamento[]>([]);
  const [filteredDados, setFilteredDados] = useState<FolhaPagamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [currentFolhaPagamento, setCurrentFolhaPagamento] = useState<Partial<FolhaPagamento> | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [itemToView, setItemToView] = useState<FolhaPagamento | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = dadosFolhaPagamento.filter(item => 
        item.funcionario_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${item.mes_referencia}/${item.ano_referencia}`.includes(searchTerm)
      );
      setFilteredDados(filtered);
    } else {
      setFilteredDados(dadosFolhaPagamento);
    }
  }, [searchTerm, dadosFolhaPagamento]);

  const carregarDados = async () => {
    setIsLoading(true);
    try {
      const dados = await listarFolhaPagamento();
      setDadosFolhaPagamento(dados);
      setFilteredDados(dados);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados de folha de pagamento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = async (id: number) => {
    try {
      const item = await buscarFolhaPagamento(id);
      if (item) {
        setItemToView(item);
        setIsViewDialogOpen(true);
      } else {
        toast.error('Registro não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar registro:', error);
      toast.error('Erro ao buscar detalhes do registro');
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const item = await buscarFolhaPagamento(id);
      if (item) {
        setCurrentFolhaPagamento(item);
        setIsFormDialogOpen(true);
      } else {
        toast.error('Registro não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar registro:', error);
      toast.error('Erro ao buscar dados para edição');
    }
  };

  const handleDelete = (id: number) => {
    setItemToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      const success = await excluirRegistroFolhaPagamento(itemToDelete);
      if (success) {
        carregarDados();
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error('Erro ao excluir registro:', error);
      toast.error('Erro ao excluir registro');
    }
  };

  const handleFormSubmit = async (dados: Partial<FolhaPagamento>) => {
    try {
      if (currentFolhaPagamento?.id) {
        // Atualizar existente
        await atualizarRegistroFolhaPagamento(currentFolhaPagamento.id, dados);
      } else {
        // Criar novo
        await criarRegistroFolhaPagamento(dados);
      }
      
      setIsFormDialogOpen(false);
      setCurrentFolhaPagamento(null);
      carregarDados();
    } catch (error) {
      console.error('Erro ao salvar registro:', error);
      toast.error('Erro ao salvar registro');
    }
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Folha de Pagamento" 
        description="Gerenciamento de folha de pagamento dos funcionários"
        icon={<Calendar size={24} />}
      />
      
      <div className="mt-6 flex justify-between items-center">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Buscar por funcionário ou referência..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setCurrentFolhaPagamento(null)}>
              Novo Registro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>
                {currentFolhaPagamento?.id ? 'Editar' : 'Novo'} Registro de Folha de Pagamento
              </DialogTitle>
            </DialogHeader>
            <FolhaPagamentoForm 
              dados={currentFolhaPagamento || undefined}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsFormDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Registros de Folha de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <FolhaPagamentoTable 
              dados={filteredDados}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>
      
      {/* Dialog para visualizar detalhes */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Folha de Pagamento</DialogTitle>
          </DialogHeader>
          {itemToView && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Funcionário</h3>
                <p className="mt-1">{itemToView.funcionario_nome}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Referência</h3>
                <p className="mt-1">{itemToView.mes_referencia}/{itemToView.ano_referencia}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Salário Base</h3>
                <p className="mt-1">{typeof itemToView.salario_base === 'number' 
                  ? itemToView.salario_base.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) 
                  : itemToView.salario_base}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Data de Pagamento</h3>
                <p className="mt-1">{new Date(itemToView.data_pagamento).toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">INSS</h3>
                <p className="mt-1">{typeof itemToView.inss === 'number' 
                  ? itemToView.inss.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) 
                  : 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">FGTS</h3>
                <p className="mt-1">{typeof itemToView.fgts === 'number' 
                  ? itemToView.fgts.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) 
                  : 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">IR</h3>
                <p className="mt-1">{typeof itemToView.ir === 'number' 
                  ? itemToView.ir.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) 
                  : 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Vale Transporte</h3>
                <p className="mt-1">{typeof itemToView.vale_transporte === 'number' 
                  ? itemToView.vale_transporte.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) 
                  : 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Vale Refeição</h3>
                <p className="mt-1">{typeof itemToView.vale_refeicao === 'number' 
                  ? itemToView.vale_refeicao.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) 
                  : 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Outros Descontos</h3>
                <p className="mt-1">{typeof itemToView.outros_descontos === 'number' 
                  ? itemToView.outros_descontos.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) 
                  : 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Outros Benefícios</h3>
                <p className="mt-1">{typeof itemToView.outros_beneficios === 'number' 
                  ? itemToView.outros_beneficios.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) 
                  : 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Valor Líquido</h3>
                <p className="mt-1 font-bold">{typeof itemToView.valor_liquido === 'number' 
                  ? itemToView.valor_liquido.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) 
                  : itemToView.valor_liquido}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <p className="mt-1">{itemToView.status}</p>
              </div>
              {itemToView.observacoes && (
                <div className="col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">Observações</h3>
                  <p className="mt-1">{itemToView.observacoes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este registro de folha de pagamento? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
};

export default FolhaPagamentoPage;
