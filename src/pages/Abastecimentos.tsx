
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, LogOut } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PageHeader from '@/components/ui/PageHeader';
import NovoAbastecimentoForm from '@/components/abastecimentos/NovoAbastecimentoForm';
import TipoCombustivelForm from '@/components/abastecimentos/TipoCombustivelForm';
import { AbastecimentoItem, TipoCombustivel } from '@/types/abastecimento';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DialogContabilizacao } from '@/components/contabilidade/DialogContabilizacao';

const Abastecimentos = () => {
  const navigate = useNavigate();
  const [abastecimentos, setAbastecimentos] = useState<AbastecimentoItem[]>([]);
  const [tiposCombustivel, setTiposCombustivel] = useState<TipoCombustivel[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAbastecimentoOpen, setModalAbastecimentoOpen] = useState(false);
  const [modalContabilizacaoOpen, setModalContabilizacaoOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [operacaoConcluida, setOperacaoConcluida] = useState<{tipo: string, dados: any} | null>(null);

  useEffect(() => {
    carregarAbastecimentos();
    carregarTiposCombustivel();
  }, []);

  const carregarAbastecimentos = async () => {
    try {
      const { data, error } = await supabase
        .from('Abastecimentos')
        .select('*')
        .order('data_abastecimento', { ascending: false });

      if (error) {
        console.error('Erro ao carregar abastecimentos:', error);
        return;
      }

      const abastecimentosFormatados: AbastecimentoItem[] = (data || []).map(item => ({
        id: item.id,
        data_abastecimento: item.data_abastecimento,
        placa_veiculo: item.placa_veiculo,
        quilometragem: item.quilometragem,
        tipo_combustivel: item.tipo_combustivel,
        posto: item.posto,
        motorista_solicitante: item.motorista_solicitante,
        responsavel_autorizacao: item.responsavel_autorizacao,
        valor_total: item.valor_total,
        quantidade: item.quantidade || 0
      }));

      setAbastecimentos(abastecimentosFormatados);
    } catch (error) {
      console.error('Erro ao processar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarTiposCombustivel = async () => {
    try {
      const { data, error } = await supabase
        .from('TiposCombustivel')
        .select('*');

      if (error) {
        console.error('Erro ao carregar tipos de combustível:', error);
        return;
      }

      setTiposCombustivel(data || []);
    } catch (error) {
      console.error('Erro ao processar dados:', error);
    }
  };

  const handleSalvarAbastecimento = async (dados: any) => {
    try {
      const novoAbastecimento = {
        data_abastecimento: dados.data,
        placa_veiculo: dados.placa,
        quilometragem: dados.quilometragem,
        tipo_combustivel: dados.tipoCombustivel,
        posto: dados.posto,
        motorista_solicitante: dados.motorista,
        responsavel_autorizacao: dados.responsavel,
        valor_total: dados.valor,
        quantidade: dados.quantidade
      };

      const { error } = await supabase
        .from('Abastecimentos')
        .insert([novoAbastecimento]);

      if (error) {
        console.error('Erro ao salvar abastecimento:', error);
        toast.error('Erro ao salvar o abastecimento');
        return;
      }

      toast.success('Abastecimento registrado com sucesso!');
      carregarAbastecimentos();
      setModalAbastecimentoOpen(false);
      
      // Armazenar informações da operação para possível contabilização
      setOperacaoConcluida({
        tipo: 'abastecimento',
        dados: novoAbastecimento
      });
      
      // Perguntar se deseja contabilizar
      setModalContabilizacaoOpen(true);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Ocorreu um erro ao registrar o abastecimento');
    }
  };

  const handleCadastrarTipoCombustivel = async (tipo: TipoCombustivel) => {
    try {
      const { error } = await supabase
        .from('TiposCombustivel')
        .insert([tipo]);

      if (error) {
        console.error('Erro ao cadastrar tipo de combustível:', error);
        toast.error('Erro ao cadastrar tipo de combustível');
        return;
      }

      toast.success('Tipo de combustível cadastrado com sucesso!');
      carregarTiposCombustivel();
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Ocorreu um erro ao cadastrar o tipo de combustível');
    }
  };

  const formatarData = (dataString: string | null) => {
    if (!dataString) return '';
    try {
      return format(parseISO(dataString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return dataString;
    }
  };

  const formatarValor = (valor: number | null) => {
    if (valor === null) return '';
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };
  
  const handleVoltarMenu = () => {
    navigate('/');
  };
  
  const filteredAbastecimentos = abastecimentos.filter(item => {
    const termo = searchTerm.toLowerCase();
    return (
      item.placa_veiculo?.toLowerCase().includes(termo) ||
      item.motorista_solicitante?.toLowerCase().includes(termo) ||
      item.posto?.toLowerCase().includes(termo) ||
      item.data_abastecimento?.includes(termo)
    );
  });

  return (
    <PageLayout>
      <div className="grid grid-cols-[240px_1fr] h-full">
        {/* Sidebar */}
        <div className="bg-slate-900 text-white p-4">
          <h3 className="font-semibold text-xl mb-6">Menu</h3>
          <nav className="space-y-2">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-slate-800 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/abastecimentos')}
              className="flex items-center gap-2 w-full px-3 py-2 rounded bg-slate-800 transition-colors"
            >
              Abastecimentos
            </button>
            <button
              onClick={() => navigate('/manutencao')}
              className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-slate-800 transition-colors"
            >
              Manutenção
            </button>
            <button
              onClick={() => navigate('/despesas-gerais')}
              className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-slate-800 transition-colors"
            >
              Despesas Gerais
            </button>
            <hr className="my-4 border-slate-700" />
            <button
              onClick={handleVoltarMenu}
              className="flex items-center gap-2 text-red-400 w-full px-3 py-2 rounded hover:bg-slate-800 transition-colors"
            >
              <LogOut size={16} />
              Voltar ao Menu
            </button>
          </nav>
        </div>

        {/* Conteúdo principal */}
        <div className="p-6">
          <PageHeader 
            title="Gerenciamento de Abastecimentos" 
            description="Registro e controle de abastecimentos da frota"
            actions={
              <Button onClick={handleVoltarMenu}>Voltar ao Menu Principal</Button>
            }
          />

          <Tabs defaultValue="abastecimentos" className="w-full mt-6">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="abastecimentos">Abastecimentos</TabsTrigger>
              <TabsTrigger value="tiposCombustivel">Tipos de Combustível</TabsTrigger>
            </TabsList>

            <TabsContent value="abastecimentos" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex-1 mr-4">
                  <Input
                    placeholder="Buscar por placa, motorista ou data..."
                    className="max-w-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    prefix={<Search className="h-4 w-4 text-gray-500 mr-2" />}
                  />
                </div>
                <Button onClick={() => setModalAbastecimentoOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Novo Abastecimento
                </Button>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Abastecimentos Registrados</h2>

                {loading ? (
                  <p className="text-center py-4">Carregando dados...</p>
                ) : filteredAbastecimentos.length === 0 ? (
                  <p className="text-center py-4">Nenhum abastecimento registrado.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Placa</TableHead>
                          <TableHead>Combustível</TableHead>
                          <TableHead>Posto</TableHead>
                          <TableHead>Motorista</TableHead>
                          <TableHead>Quilometragem</TableHead>
                          <TableHead>Quantidade (L)</TableHead>
                          <TableHead>Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAbastecimentos.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{formatarData(item.data_abastecimento)}</TableCell>
                            <TableCell>{item.placa_veiculo}</TableCell>
                            <TableCell>{item.tipo_combustivel}</TableCell>
                            <TableCell>{item.posto}</TableCell>
                            <TableCell>{item.motorista_solicitante}</TableCell>
                            <TableCell>{item.quilometragem} km</TableCell>
                            <TableCell>{item.quantidade} L</TableCell>
                            <TableCell>{formatarValor(item.valor_total)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="tiposCombustivel" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Cadastrar Novo Tipo</h2>
                  <TipoCombustivelForm onSubmit={handleCadastrarTipoCombustivel} />
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Tipos Cadastrados</h2>
                  {tiposCombustivel.length === 0 ? (
                    <p className="text-center py-4">Nenhum tipo cadastrado.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Descrição</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tiposCombustivel.map((tipo) => (
                            <TableRow key={tipo.id}>
                              <TableCell className="font-medium">{tipo.nome}</TableCell>
                              <TableCell>{tipo.descricao || '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modal para novo abastecimento */}
      <Dialog open={modalAbastecimentoOpen} onOpenChange={setModalAbastecimentoOpen}>
        <DialogContent className="max-w-3xl">
          <NovoAbastecimentoForm 
            onSave={handleSalvarAbastecimento} 
            tiposCombustivel={tiposCombustivel}
          />
        </DialogContent>
      </Dialog>
      
      {/* Modal de contabilização */}
      <DialogContabilizacao 
        open={modalContabilizacaoOpen} 
        onOpenChange={setModalContabilizacaoOpen}
        tipo={operacaoConcluida?.tipo}
        dados={operacaoConcluida?.dados}
        onContabilizar={(contabilizado) => {
          if (contabilizado) {
            toast.success("Operação contabilizada com sucesso!");
          }
          setModalContabilizacaoOpen(false);
          // Perguntar se deseja voltar ao menu principal
          const deveVoltar = window.confirm('Deseja voltar ao menu principal?');
          if (deveVoltar) {
            navigate('/');
          }
        }}
      />
    </PageLayout>
  );
};

export default Abastecimentos;
