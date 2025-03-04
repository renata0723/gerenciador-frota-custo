
import React, { useState, useEffect } from 'react';
import NewPageLayout from '../components/layout/NewPageLayout';
import PageHeader from '../components/ui/PageHeader';
import { DollarSign, Plus, Search, Filter, Download, BarChart2, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/utils/formatters';
import Placeholder, { LoadingPlaceholder } from '@/components/ui/Placeholder';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const DespesasGerais = () => {
  const [despesas, setDespesas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [contabilizarDialogOpen, setContabilizarDialogOpen] = useState(false);
  const [despesaSelecionada, setDespesaSelecionada] = useState<any>(null);
  const [contaContabil, setContaContabil] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    carregarDespesas();
  }, []);

  const carregarDespesas = async () => {
    setLoading(true);
    try {
      console.log("Buscando despesas do banco...");
      const { data, error } = await supabase
        .from('Despesas Gerais')
        .select('*')
        .order('data_despesa', { ascending: false });

      if (error) {
        console.error("Erro ao carregar despesas:", error);
        toast.error("Erro ao carregar a lista de despesas");
        return;
      }

      console.log("Despesas carregadas:", data);
      setDespesas(data || []);
    } catch (error) {
      console.error("Erro ao processar dados:", error);
      toast.error("Ocorreu um erro ao processar os dados das despesas");
    } finally {
      setLoading(false);
    }
  };

  const handleContabilizar = async () => {
    if (!despesaSelecionada) return;
    
    if (!contaContabil) {
      toast.error("Por favor, informe a conta contábil para débito");
      return;
    }

    try {
      // Criar lançamento contábil
      const { error: contabilError } = await supabase
        .from('Lancamentos_Contabeis')
        .insert({
          data_lancamento: despesaSelecionada.data_despesa,
          data_competencia: despesaSelecionada.data_despesa,
          conta_debito: contaContabil,
          conta_credito: '11201', // Conta padrão de caixa/banco
          valor: despesaSelecionada.valor_despesa,
          historico: `Despesa ${despesaSelecionada.tipo_despesa} - ${despesaSelecionada.descricao_detalhada.substring(0, 50)}`,
          documento_referencia: despesaSelecionada.contrato_id || `Despesa ${despesaSelecionada.tipo_despesa}`,
          tipo_documento: 'DESPESA',
          status: 'ativo'
        });

      if (contabilError) {
        console.error('Erro ao criar lançamento contábil:', contabilError);
        toast.error('Erro ao contabilizar despesa');
        return;
      }

      // Atualizar status da despesa
      const { error: updateError } = await supabase
        .from('Despesas Gerais')
        .update({ 
          contabilizado: true,
          conta_contabil: contaContabil
        })
        .eq('id', despesaSelecionada.id);

      if (updateError) {
        console.error('Erro ao atualizar status da despesa:', updateError);
        toast.error('Erro ao atualizar status da despesa');
        return;
      }

      toast.success('Despesa contabilizada com sucesso!');
      setContabilizarDialogOpen(false);
      setContaContabil('');
      carregarDespesas();
    } catch (error) {
      console.error('Erro ao contabilizar despesa:', error);
      toast.error('Ocorreu um erro ao contabilizar a despesa');
    }
  };

  const abrirDialogContabilizacao = (despesa: any) => {
    setDespesaSelecionada(despesa);
    setContabilizarDialogOpen(true);
  };

  const filteredDespesas = despesas.filter(despesa => 
    (despesa.tipo_despesa?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (despesa.descricao_detalhada?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (despesa.categoria?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const totalDespesas = filteredDespesas.reduce((sum, despesa) => sum + (despesa.valor_despesa || 0), 0);
  const totalDespesasContabilizadas = filteredDespesas
    .filter(d => d.contabilizado)
    .reduce((sum, despesa) => sum + (despesa.valor_despesa || 0), 0);
  const totalDespesasPendentes = filteredDespesas
    .filter(d => !d.contabilizado)
    .reduce((sum, despesa) => sum + (despesa.valor_despesa || 0), 0);

  return (
    <NewPageLayout>
      <PageHeader 
        title="Despesas Gerais" 
        description="Gerencie as despesas da empresa"
        icon={<DollarSign size={26} className="text-red-500" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Despesas Gerais' }
        ]}
        actions={
          <Button onClick={() => navigate('/despesas/nova')}>
            <Plus size={16} className="mr-2" />
            Nova Despesa
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-6">
        <Card className="p-4 shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Total de Despesas</p>
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(totalDespesas)}</h3>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <DollarSign size={20} className="text-red-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4 shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Despesas Contabilizadas</p>
              <h3 className="text-2xl font-bold text-green-600">{formatCurrency(totalDespesasContabilizadas)}</h3>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <FileText size={20} className="text-green-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4 shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Despesas Pendentes</p>
              <h3 className="text-2xl font-bold text-yellow-600">{formatCurrency(totalDespesasPendentes)}</h3>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <DollarSign size={20} className="text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="shadow-sm border">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <Input
                type="text"
                className="pl-10 w-full"
                placeholder="Buscar despesas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="flex items-center">
                <Filter size={16} className="mr-2" />
                Filtrar
              </Button>
              <Button variant="outline" className="flex items-center">
                <Download size={16} className="mr-2" />
                Exportar
              </Button>
              <Button variant="outline" className="flex items-center">
                <BarChart2 size={16} className="mr-2" />
                Relatórios
              </Button>
            </div>
          </div>
        </div>
        
        {loading ? (
          <LoadingPlaceholder className="m-4" />
        ) : despesas.length === 0 ? (
          <Placeholder 
            title="Nenhuma despesa encontrada" 
            description="Você ainda não possui nenhuma despesa registrada. Clique no botão acima para adicionar."
            buttonText="Adicionar Nova Despesa"
            onButtonClick={() => navigate('/despesas/nova')}
            className="m-4"
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Conta Contábil</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDespesas.map((despesa) => (
                  <TableRow key={despesa.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell>{despesa.data_despesa}</TableCell>
                    <TableCell>{despesa.tipo_despesa}</TableCell>
                    <TableCell>{despesa.categoria || 'N/A'}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{despesa.descricao_detalhada}</TableCell>
                    <TableCell>{despesa.contrato_id || 'N/A'}</TableCell>
                    <TableCell>{despesa.conta_contabil || 'Não atribuído'}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(despesa.valor_despesa)}</TableCell>
                    <TableCell>
                      <div className={`px-2 py-1 text-xs rounded-full inline-flex items-center ${
                        despesa.contabilizado 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {despesa.contabilizado ? 'Contabilizado' : 'Pendente'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/despesas/editar/${despesa.id}`)}
                        >
                          Editar
                        </Button>
                        
                        {!despesa.contabilizado && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => abrirDialogContabilizacao(despesa)}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Contabilizar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        <div className="p-4 border-t flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Mostrando {filteredDespesas.length} de {despesas.length} despesas
          </p>
          <div className="flex space-x-2">
            <Button variant="outline" className="px-3 py-1" disabled>
              Anterior
            </Button>
            <Button className="px-3 py-1">
              1
            </Button>
            <Button variant="outline" className="px-3 py-1" disabled>
              Próximo
            </Button>
          </div>
        </div>
      </Card>

      {/* Dialog para contabilização */}
      <Dialog open={contabilizarDialogOpen} onOpenChange={setContabilizarDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contabilizar Despesa</DialogTitle>
          </DialogHeader>
          
          {despesaSelecionada && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Despesa</Label>
                  <p className="font-medium">{despesaSelecionada.tipo_despesa}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Valor</Label>
                  <p className="font-medium">{formatCurrency(despesaSelecionada.valor_despesa)}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm text-gray-500">Descrição</Label>
                <p className="font-medium">{despesaSelecionada.descricao_detalhada}</p>
              </div>
              
              <div>
                <Label htmlFor="contaContabil">Conta Contábil para Débito</Label>
                <Input 
                  id="contaContabil"
                  value={contaContabil}
                  onChange={(e) => setContaContabil(e.target.value)}
                  placeholder="Digite o código da conta (Ex: 31101)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  A conta de crédito será a conta de caixa/banco padrão (11201)
                </p>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setContabilizarDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleContabilizar}>
                  <FileText className="mr-2 h-4 w-4" />
                  Confirmar Contabilização
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </NewPageLayout>
  );
};

export default DespesasGerais;
