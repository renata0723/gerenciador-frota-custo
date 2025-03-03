
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileDown, Search, Calendar, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import PesquisaDocumentos from '@/components/canhotos/PesquisaDocumentos';
import CanhotoForm from '@/components/canhotos/CanhotoForm';
import { supabase } from '@/integrations/supabase/client';
import { Canhoto } from '@/types/canhoto';

const Canhotos = () => {
  const [canhotos, setCanhotos] = useState<Canhoto[]>([]);
  const [canhotosRecebidos, setCanhotosRecebidos] = useState<Canhoto[]>([]);
  const [canhotoSelecionado, setCanhotoSelecionado] = useState<Partial<Canhoto> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pendentes");

  useEffect(() => {
    carregarCanhotos();
  }, []);

  const carregarCanhotos = async () => {
    setIsLoading(true);
    try {
      const { data: canhotosData, error } = await supabase
        .from('Canhoto')
        .select('*');

      if (error) {
        console.error('Erro ao carregar canhotos:', error);
        toast.error('Erro ao carregar dados dos canhotos');
        return;
      }

      const canhotosFormatados = canhotosData.map(canhoto => ({
        ...canhoto,
        id: String(canhoto.id) // Converter ID para string para compatibilidade com o tipo
      }));

      // Separar canhotos pendentes e recebidos
      const pendentes = canhotosFormatados.filter(c => c.status === 'Pendente');
      const recebidos = canhotosFormatados.filter(c => c.status === 'Recebido');

      setCanhotos(pendentes);
      setCanhotosRecebidos(recebidos);
    } catch (error) {
      console.error('Erro ao processar dados:', error);
      toast.error('Erro ao processar dados dos canhotos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (tipo: string, valor: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('Canhoto')
        .select('*')
        .eq(tipo, valor);

      if (error) {
        console.error('Erro na busca:', error);
        toast.error('Erro ao buscar documento');
        return;
      }

      if (data.length === 0) {
        toast.info('Nenhum canhoto encontrado com este documento');
        return;
      }

      const canhotosFormatados = data.map(canhoto => ({
        ...canhoto,
        id: String(canhoto.id) // Converter ID para string
      }));

      // Separar canhotos pendentes e recebidos
      const pendentes = canhotosFormatados.filter(c => c.status === 'Pendente');
      const recebidos = canhotosFormatados.filter(c => c.status === 'Recebido');

      setCanhotos(pendentes);
      setCanhotosRecebidos(recebidos);
      
      toast.success(`${canhotosFormatados.length} canhoto(s) encontrado(s)`);

      // Se encontrou apenas um canhoto pendente, seleciona automaticamente
      if (pendentes.length === 1) {
        handleRegistrarCanhoto(pendentes[0]);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      toast.error('Erro ao processar a busca');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrarCanhoto = (canhoto: Canhoto) => {
    setCanhotoSelecionado(canhoto);
    setDialogOpen(true);
  };

  const handleSalvarCanhoto = async (dados: Partial<Canhoto>) => {
    try {
      if (!canhotoSelecionado?.id) {
        toast.error('ID do canhoto não encontrado');
        return;
      }

      // Assegurar que o status seja do tipo correto
      const dadosAtualizados: Partial<Canhoto> = {
        ...dados,
        status: "Recebido" as const
      };

      const { error } = await supabase
        .from('Canhoto')
        .update(dadosAtualizados)
        .eq('id', canhotoSelecionado.id);

      if (error) {
        console.error('Erro ao atualizar canhoto:', error);
        toast.error('Erro ao salvar os dados do canhoto');
        return;
      }

      toast.success('Canhoto registrado com sucesso!');
      setDialogOpen(false);
      carregarCanhotos(); // Recarregar os dados

      // Verificar se precisamos gerar saldo a pagar
      if (dadosAtualizados.proprietario_veiculo && dadosAtualizados.saldo_a_pagar) {
        toast.success(`Saldo a pagar de R$ ${dadosAtualizados.saldo_a_pagar.toFixed(2)} programado para ${format(parseISO(dadosAtualizados.data_programada_pagamento!), "dd/MM/yyyy")}`);
      }
    } catch (error) {
      console.error('Erro ao processar:', error);
      toast.error('Erro ao processar a atualização do canhoto');
    }
  };

  const formatarData = (dataString?: string) => {
    if (!dataString) return 'Não informada';
    try {
      return format(parseISO(dataString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return dataString;
    }
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Canhotos" 
        description="Gerenciamento de canhotos de entrega"
      />

      <div className="mb-6 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Buscar Canhoto</h3>
        <PesquisaDocumentos onSearch={handleSearch} />
      </div>
      
      <div className="flex justify-between mb-6">
        <Button variant="outline" className="flex items-center gap-2">
          <FileDown size={18} />
          Exportar Relatório
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Registrar Recebimento de Canhoto</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-500">Cliente</span>
                <p className="font-medium">{canhotoSelecionado?.cliente || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Motorista</span>
                <p className="font-medium">{canhotoSelecionado?.motorista || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Nota Fiscal</span>
                <p className="font-medium">{canhotoSelecionado?.numero_nota_fiscal || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">CTe</span>
                <p className="font-medium">{canhotoSelecionado?.numero_cte || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Manifesto</span>
                <p className="font-medium">{canhotoSelecionado?.numero_manifesto || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Contrato</span>
                <p className="font-medium">{canhotoSelecionado?.contrato_id || '-'}</p>
              </div>
            </div>
          </div>
          <CanhotoForm 
            dados={canhotoSelecionado || undefined} 
            onSubmit={handleSalvarCanhoto} 
            onCancel={() => setDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
          <TabsTrigger value="recebidos">Recebidos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pendentes" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Canhotos Pendentes</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documentos</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motorista</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan={5}>Carregando...</td>
                    </tr>
                  ) : canhotos.length === 0 ? (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan={5}>Nenhum canhoto pendente encontrado</td>
                    </tr>
                  ) : (
                    canhotos.map((canhoto) => (
                      <tr key={canhoto.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{canhoto.cliente}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>NF: {canhoto.numero_nota_fiscal || 'N/A'}</div>
                          <div>CTe: {canhoto.numero_cte || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{canhoto.motorista}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            Pendente
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button size="sm" onClick={() => handleRegistrarCanhoto(canhoto)}>
                            <Check className="h-4 w-4 mr-1" />
                            Registrar
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="recebidos">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Canhotos Recebidos</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documentos</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Recebimento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pagamento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan={6}>Carregando...</td>
                    </tr>
                  ) : canhotosRecebidos.length === 0 ? (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan={6}>Nenhum canhoto recebido encontrado</td>
                    </tr>
                  ) : (
                    canhotosRecebidos.map((canhoto) => (
                      <tr key={canhoto.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{canhoto.cliente}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>NF: {canhoto.numero_nota_fiscal || 'N/A'}</div>
                          <div>CTe: {canhoto.numero_cte || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatarData(canhoto.data_recebimento_canhoto)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {canhoto.responsavel_recebimento}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>Programado: {formatarData(canhoto.data_programada_pagamento)}</div>
                          <div>Valor: R$ {canhoto.saldo_a_pagar?.toFixed(2) || '0.00'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            Recebido
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Canhotos;
