
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { FolhaPagamento } from '@/types/folhaPagamento';
import { 
  listarFolhasPagamento, 
  buscarFolhaPagamento, 
  criarFolhaPagamento, 
  atualizarFolhaPagamento, 
  excluirFolhaPagamento 
} from '@/services/folhaPagamentoService';
import FolhaPagamentoForm from '@/components/folha-pagamento/FolhaPagamentoForm';
import FolhaPagamentoTable from '@/components/folha-pagamento/FolhaPagamentoTable';

const FolhaPagamentoPage = () => {
  const [registros, setRegistros] = useState<FolhaPagamento[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registroAtual, setRegistroAtual] = useState<FolhaPagamento | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  useEffect(() => {
    carregarFolhasPagamento();
  }, []);
  
  const carregarFolhasPagamento = async () => {
    setLoading(true);
    try {
      const data = await listarFolhasPagamento();
      setRegistros(data);
    } catch (error) {
      console.error('Erro ao carregar folhas de pagamento:', error);
      toast.error('Erro ao carregar folhas de pagamento');
    } finally {
      setLoading(false);
    }
  };
  
  const abrirModalCriacao = () => {
    setRegistroAtual(null);
    setModalMode('create');
    setDialogOpen(true);
  };
  
  const abrirModalEdicao = async (id: number) => {
    setLoading(true);
    try {
      const registro = await buscarFolhaPagamento(id);
      if (registro) {
        setRegistroAtual(registro);
        setModalMode('edit');
        setDialogOpen(true);
      } else {
        toast.error('Registro não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar registro:', error);
      toast.error('Erro ao buscar registro');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSalvar = async (data: Partial<FolhaPagamento>) => {
    try {
      if (modalMode === 'create') {
        // Garantir que o status está definido
        const novaFolha: FolhaPagamento = {
          ...data as FolhaPagamento,
          status: data.status || 'concluido'
        };
        
        await criarFolhaPagamento(novaFolha);
        toast.success('Folha de pagamento registrada com sucesso');
      } else if (registroAtual?.id) {
        await atualizarFolhaPagamento(registroAtual.id, data);
        toast.success('Folha de pagamento atualizada com sucesso');
      }
      
      setDialogOpen(false);
      carregarFolhasPagamento();
    } catch (error) {
      console.error('Erro ao salvar folha de pagamento:', error);
      toast.error('Erro ao salvar folha de pagamento');
    }
  };
  
  const handleExcluir = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este registro?')) {
      return;
    }
    
    try {
      await excluirFolhaPagamento(id);
      toast.success('Registro excluído com sucesso');
      carregarFolhasPagamento();
    } catch (error) {
      console.error('Erro ao excluir registro:', error);
      toast.error('Erro ao excluir registro');
    }
  };
  
  return (
    <PageLayout>
      <PageHeader 
        title="Folha de Pagamento" 
        description="Gerenciamento de folhas de pagamento dos funcionários"
      >
        <Button onClick={abrirModalCriacao} className="gap-1">
          <PlusCircle size={16} />
          Novo Registro
        </Button>
      </PageHeader>
      
      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-b-2 border-blue-700 rounded-full"></div>
          </div>
        ) : (
          <>
            <FolhaPagamentoTable 
              data={registros}
              onEditar={abrirModalEdicao}
              onExcluir={handleExcluir}
            />
          </>
        )}
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText size={18} />
              {modalMode === 'create' ? 'Novo Registro de Folha' : 'Editar Registro de Folha'}
            </DialogTitle>
          </DialogHeader>
          
          <FolhaPagamentoForm
            initialData={registroAtual || undefined}
            onSubmit={handleSalvar}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default FolhaPagamentoPage;
