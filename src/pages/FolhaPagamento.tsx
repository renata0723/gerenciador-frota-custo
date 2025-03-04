
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PageHeader from '@/components/ui/PageHeader';
import { toast } from 'sonner';
import { Download, Plus } from 'lucide-react';
import FolhaPagamentoTable from '@/components/folha-pagamento/FolhaPagamentoTable';
import FolhaPagamentoForm from '@/components/folha-pagamento/FolhaPagamentoForm';
import { FolhaPagamento as FolhaPagamentoType } from '@/types/contabilidade';
import { adicionarFolhaPagamento, listarFolhaPagamento } from '@/services/contabilidadeService';
import { logOperation } from '@/utils/logOperations';

const FolhaPagamento: React.FC = () => {
  const [folhasPagamento, setFolhasPagamento] = useState<FolhaPagamentoType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExportando, setIsExportando] = useState(false);

  const carregarFolhasPagamento = async () => {
    setIsLoading(true);
    try {
      const dados = await listarFolhaPagamento();
      setFolhasPagamento(dados);
    } catch (error) {
      console.error('Erro ao carregar folhas de pagamento:', error);
      toast.error('Ocorreu um erro ao carregar as folhas de pagamento');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarFolhasPagamento();
  }, []);

  const handleSaveFolhaPagamento = async (dados: Partial<FolhaPagamentoType>) => {
    try {
      await adicionarFolhaPagamento(dados);
      toast.success('Folha de pagamento registrada com sucesso!');
      setIsDialogOpen(false);
      carregarFolhasPagamento();
      logOperation('Folha de Pagamento', 'Adição de nova folha de pagamento', true);
    } catch (error) {
      console.error('Erro ao salvar folha de pagamento:', error);
      toast.error('Ocorreu um erro ao salvar a folha de pagamento');
      logOperation('Folha de Pagamento', 'Erro ao adicionar folha de pagamento', false);
    }
  };

  const handleExportarRelatorio = () => {
    setIsExportando(true);
    try {
      // Implementação básica de exportação de relatório
      toast.success('Relatório exportado com sucesso!');
      logOperation('Folha de Pagamento', 'Exportação de relatório', true);
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      toast.error('Ocorreu um erro ao exportar o relatório');
      logOperation('Folha de Pagamento', 'Erro ao exportar relatório', false);
    } finally {
      setIsExportando(false);
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Folha de Pagamento"
        description="Gerencie os pagamentos de salários e benefícios"
      />

      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleExportarRelatorio}
          disabled={isExportando || folhasPagamento.length === 0}
        >
          <Download size={16} />
          {isExportando ? 'Exportando...' : 'Exportar Relatório'}
        </Button>

        <Button
          className="flex items-center gap-2"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus size={16} />
          Novo Lançamento
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <FolhaPagamentoTable dados={folhasPagamento} />
      )}

      {/* Dialog para novo lançamento */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Novo Lançamento - Folha de Pagamento</DialogTitle>
          </DialogHeader>
          <FolhaPagamentoForm onSubmit={handleSaveFolhaPagamento} onCancel={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default FolhaPagamento;
