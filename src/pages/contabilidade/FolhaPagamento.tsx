
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Users, Plus, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolhaPagamento as FolhaPagamentoType } from '@/types/contabilidade';
import { toast } from 'sonner';
import FolhaPagamentoTable from '@/components/folha-pagamento/FolhaPagamentoTable';
import FolhaPagamentoForm from '@/components/folha-pagamento/FolhaPagamentoForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { 
  listarFolhaPagamento,
  buscarFolhaPagamento,
  criarRegistroFolhaPagamento,
  atualizarRegistroFolhaPagamento,
  excluirRegistroFolhaPagamento
} from '@/services/folhaPagamentoService';

const FolhaPagamentoPage: React.FC = () => {
  const [registros, setRegistros] = useState<FolhaPagamentoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [registroAtual, setRegistroAtual] = useState<FolhaPagamentoType | null>(null);

  useEffect(() => {
    carregarRegistros();
  }, []);

  const carregarRegistros = async () => {
    setLoading(true);
    try {
      const data = await listarFolhaPagamento();
      setRegistros(data);
    } catch (error) {
      console.error('Erro ao carregar folha de pagamento:', error);
      toast.error('Erro ao carregar folha de pagamento');
    } finally {
      setLoading(false);
    }
  };

  const handleNovoRegistro = () => {
    setEditingId(null);
    setRegistroAtual(null);
    setDialogOpen(true);
  };

  const handleEditarRegistro = async (id: number) => {
    try {
      const registro = await buscarFolhaPagamento(id);
      if (registro) {
        setRegistroAtual(registro);
        setEditingId(id);
        setDialogOpen(true);
      }
    } catch (error) {
      console.error('Erro ao buscar registro para edição:', error);
      toast.error('Erro ao buscar registro para edição');
    }
  };

  const handleExcluirRegistro = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      try {
        const sucesso = await excluirRegistroFolhaPagamento(id);
        if (sucesso) {
          toast.success('Registro excluído com sucesso');
          carregarRegistros();
        } else {
          toast.error('Erro ao excluir registro');
        }
      } catch (error) {
        console.error('Erro ao excluir registro:', error);
        toast.error('Erro ao excluir registro');
      }
    }
  };

  const handleSalvarRegistro = async (dados: Partial<FolhaPagamentoType>) => {
    try {
      if (editingId) {
        await atualizarRegistroFolhaPagamento(editingId, dados);
        toast.success('Registro atualizado com sucesso');
      } else {
        await criarRegistroFolhaPagamento(dados);
        toast.success('Registro criado com sucesso');
      }
      setDialogOpen(false);
      carregarRegistros();
    } catch (error) {
      console.error('Erro ao salvar registro:', error);
      toast.error('Erro ao salvar registro');
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Folha de Pagamento"
        description="Gerenciamento de salários e encargos dos funcionários"
        icon={<Users className="h-6 w-6" />}
      />

      <div className="mb-6">
        <Button onClick={handleNovoRegistro}>
          <Plus className="mr-2 h-4 w-4" /> Novo Registro
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Folha de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p>Carregando registros...</p>
            </div>
          ) : registros.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                Nenhum registro encontrado
              </h3>
              <p className="mt-1 text-gray-500">
                Crie um novo registro para começar.
              </p>
            </div>
          ) : (
            <FolhaPagamentoTable 
              registros={registros} 
              onEditar={handleEditarRegistro}
              onExcluir={handleExcluirRegistro}
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl">
          <FolhaPagamentoForm 
            registro={registroAtual}
            onSubmit={handleSalvarRegistro}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default FolhaPagamentoPage;
