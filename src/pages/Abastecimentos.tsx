
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import NovoAbastecimentoForm from '@/components/abastecimentos/NovoAbastecimentoForm';
import TipoCombustivelForm from '@/components/abastecimentos/TipoCombustivelForm';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Abastecimento, TipoCombustivel } from '@/types/abastecimento';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Fuel, CalendarDays, Truck, User, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Abastecimentos = () => {
  const [abastecimentos, setAbastecimentos] = useState<Abastecimento[]>([]);
  const [tiposCombustivel, setTiposCombustivel] = useState<TipoCombustivel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    await Promise.all([
      carregarAbastecimentos(),
      carregarTiposCombustivel()
    ]);
    setLoading(false);
  };

  const carregarAbastecimentos = async () => {
    try {
      const { data, error } = await supabase
        .from('Abastecimentos')
        .select('*')
        .order('data_abastecimento', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      const abastecimentosFormatados = data?.map((item): Abastecimento => ({
        id: item.id || 0,
        placa_veiculo: item.placa_veiculo || '',
        data_abastecimento: item.data_abastecimento || '',
        tipo_combustivel: item.tipo_combustivel || '',
        quilometragem: item.quilometragem || 0,
        valor_abastecimento: item.valor_abastecimento || 0,
        valor_total: item.valor_total || 0,
        itens_abastecidos: item.itens_abastecidos || '',
        motorista_solicitante: item.motorista_solicitante || '',
        responsavel_autorizacao: item.responsavel_autorizacao || '',
        posto: item.posto || ''
      })) || [];
      
      setAbastecimentos(abastecimentosFormatados);
    } catch (error) {
      console.error('Erro ao carregar abastecimentos:', error);
      toast.error('Erro ao carregar dados de abastecimentos');
    }
  };

  const carregarTiposCombustivel = async () => {
    try {
      const { data, error } = await supabase
        .from('TiposCombustivel')
        .select('*')
        .order('nome', { ascending: true });
        
      if (error) {
        throw error;
      }
      
      setTiposCombustivel(data || []);
    } catch (error) {
      console.error('Erro ao carregar tipos de combustível:', error);
      toast.error('Erro ao carregar tipos de combustível');
    }
  };

  const handleSalvarAbastecimento = async (dados: Abastecimento) => {
    try {
      const { error } = await supabase
        .from('Abastecimentos')
        .insert({
          placa_veiculo: dados.placa_veiculo,
          data_abastecimento: dados.data_abastecimento,
          tipo_combustivel: dados.tipo_combustivel,
          quilometragem: dados.quilometragem,
          valor_abastecimento: dados.valor_abastecimento,
          valor_total: dados.valor_total,
          itens_abastecidos: dados.itens_abastecidos,
          motorista_solicitante: dados.motorista_solicitante,
          responsavel_autorizacao: dados.responsavel_autorizacao,
          posto: dados.posto
        });
        
      if (error) {
        throw error;
      }
      
      toast.success('Abastecimento registrado com sucesso!');
      await carregarAbastecimentos();
    } catch (error) {
      console.error('Erro ao salvar abastecimento:', error);
      toast.error('Erro ao registrar abastecimento');
    }
  };

  const handleSalvarTipoCombustivel = async (tipoCombustivel: TipoCombustivel) => {
    try {
      const { error } = await supabase
        .from('TiposCombustivel')
        .insert({
          id: tipoCombustivel.id,
          nome: tipoCombustivel.nome,
          descricao: tipoCombustivel.descricao
        });
        
      if (error) {
        throw error;
      }
      
      toast.success('Tipo de combustível registrado com sucesso!');
      await carregarTiposCombustivel();
    } catch (error) {
      console.error('Erro ao salvar tipo de combustível:', error);
      toast.error('Erro ao registrar tipo de combustível');
    }
  };

  const filteredAbastecimentos = abastecimentos.filter(item => {
    const searchLower = search.toLowerCase();
    return (
      (item.placa_veiculo?.toLowerCase().includes(searchLower)) ||
      (item.motorista_solicitante?.toLowerCase().includes(searchLower)) ||
      (item.tipo_combustivel?.toLowerCase().includes(searchLower)) ||
      (item.posto?.toLowerCase().includes(searchLower)) ||
      (item.data_abastecimento?.toLowerCase().includes(searchLower))
    );
  });

  const formatarData = (dataString: string | null) => {
    if (!dataString) return 'N/A';
    try {
      return format(new Date(dataString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return dataString;
    }
  };

  const formatarValor = (valor: number | null) => {
    if (valor === null || valor === undefined) return 'R$ 0,00';
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleVoltarMenu = () => {
    navigate('/');
  };

  // Calcular estatísticas
  const totalAbastecimentos = abastecimentos.length;
  const valorTotalAbastecimentos = abastecimentos.reduce((acc, item) => acc + (item.valor_total || 0), 0);
  const mediaValorAbastecimento = totalAbastecimentos > 0 
    ? valorTotalAbastecimentos / totalAbastecimentos 
    : 0;

  return (
    <PageLayout>
      <div className="bg-white py-6 px-8 border-b shadow-sm w-full mb-6">
        <div className="flex justify-between items-center max-w-screen-xl mx-auto">
          <div className="flex items-center gap-4">
            <Fuel size={32} className="text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Abastecimentos</h1>
              <p className="text-gray-500 mt-1">Registro e controle de abastecimentos da frota</p>
            </div>
          </div>
          
          <Button variant="outline" onClick={handleVoltarMenu}>
            Voltar ao Menu Principal
          </Button>
        </div>
      </div>
      
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Fuel className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Abastecimentos</p>
                <h3 className="text-2xl font-bold">{totalAbastecimentos}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Valor Total</p>
                <h3 className="text-2xl font-bold">{formatarValor(valorTotalAbastecimentos)}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <CalendarDays className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Valor Médio</p>
                <h3 className="text-2xl font-bold">{formatarValor(mediaValorAbastecimento)}</h3>
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="registros" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="registros">Abastecimentos</TabsTrigger>
            <TabsTrigger value="novo">Novo Abastecimento</TabsTrigger>
            <TabsTrigger value="tipos">Tipos de Combustível</TabsTrigger>
          </TabsList>
          
          <TabsContent value="registros" className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Abastecimentos Registrados</h2>
                <div className="w-1/3">
                  <Input
                    placeholder="Buscar por placa, motorista ou data..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <p>Carregando abastecimentos...</p>
                </div>
              ) : filteredAbastecimentos.length === 0 ? (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium">Nenhum abastecimento encontrado</h3>
                  <p className="text-gray-500 mt-2">
                    {search 
                      ? "Nenhum resultado para a sua busca."
                      : "Registre um novo abastecimento na aba 'Novo Abastecimento'"
                    }
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Placa</TableHead>
                        <TableHead>Motorista</TableHead>
                        <TableHead>Combustível</TableHead>
                        <TableHead>KM</TableHead>
                        <TableHead>Posto</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAbastecimentos.map((item) => (
                        <TableRow key={item.id} className="hover:bg-gray-50">
                          <TableCell>{formatarData(item.data_abastecimento)}</TableCell>
                          <TableCell>{item.placa_veiculo}</TableCell>
                          <TableCell>{item.motorista_solicitante}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.tipo_combustivel}</Badge>
                          </TableCell>
                          <TableCell>{item.quilometragem}</TableCell>
                          <TableCell>{item.posto}</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatarValor(item.valor_total)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="novo">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-6">Registrar Novo Abastecimento</h2>
              <NovoAbastecimentoForm 
                tiposCombustivel={tiposCombustivel}
                onSave={handleSalvarAbastecimento}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="tipos">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-6">Gerenciar Tipos de Combustível</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Cadastrar Novo</h3>
                  <TipoCombustivelForm onSave={handleSalvarTipoCombustivel} />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Tipos Cadastrados</h3>
                  {tiposCombustivel.length === 0 ? (
                    <p className="text-gray-500">Nenhum tipo de combustível cadastrado.</p>
                  ) : (
                    <div className="space-y-2">
                      {tiposCombustivel.map((tipo) => (
                        <div key={tipo.id} className="p-3 border rounded-md">
                          <div className="font-medium">{tipo.nome}</div>
                          {tipo.descricao && (
                            <div className="text-sm text-gray-500">{tipo.descricao}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Abastecimentos;
