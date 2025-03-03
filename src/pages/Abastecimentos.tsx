
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/ui/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NovoAbastecimentoForm from '@/components/abastecimentos/NovoAbastecimentoForm';
import TipoCombustivelForm from '@/components/abastecimentos/TipoCombustivelForm';
import { TipoCombustivel, AbastecimentoFormData } from '@/types/abastecimento';
import { cadastrarAbastecimento, buscarAbastecimentos, buscarTiposCombustivel, cadastrarTipoCombustivel } from '@/services/abastecimentoService';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

type AbastecimentoRecord = {
  id: number;
  data_abastecimento: string;
  placa_veiculo: string;
  motorista_solicitante: string;
  tipo_combustivel: string;
  valor_abastecimento: number;
  valor_total: number;
  quilometragem: number;
  posto: string;
  responsavel_autorizacao: string;
  itens_abastecidos: string;
};

const Abastecimentos = () => {
  const [tiposCombustivel, setTiposCombustivel] = useState<TipoCombustivel[]>([]);
  const [registros, setRegistros] = useState<AbastecimentoRecord[]>([]);
  const [carregando, setCarregando] = useState(false);
  
  useEffect(() => {
    carregarTiposCombustivel();
    carregarAbastecimentos();
  }, []);
  
  const carregarTiposCombustivel = async () => {
    const tipos = await buscarTiposCombustivel();
    setTiposCombustivel(tipos);
  };
  
  const carregarAbastecimentos = async () => {
    setCarregando(true);
    try {
      const resultado = await buscarAbastecimentos();
      if (resultado.success && resultado.data) {
        setRegistros(resultado.data);
      } else {
        toast.error('Erro ao carregar abastecimentos');
      }
    } catch (error) {
      console.error('Erro ao processar abastecimentos:', error);
      toast.error('Erro ao processar dados de abastecimentos');
    } finally {
      setCarregando(false);
    }
  };
  
  const handleSaveAbastecimento = async (data: AbastecimentoFormData) => {
    try {
      const resultado = await cadastrarAbastecimento(data);
      if (resultado.success) {
        toast.success('Abastecimento registrado com sucesso!');
        carregarAbastecimentos();
      } else {
        toast.error('Erro ao registrar abastecimento');
      }
    } catch (error) {
      console.error('Erro ao processar abastecimento:', error);
      toast.error('Ocorreu um erro ao processar o abastecimento');
    }
  };
  
  const handleSaveTipoCombustivel = async (data: TipoCombustivel) => {
    try {
      const resultado = await cadastrarTipoCombustivel(data);
      if (resultado.success) {
        const novoTipo: TipoCombustivel = {
          id: resultado.id,
          nome: data.nome,
          descricao: data.descricao || ''
        };
        setTiposCombustivel([...tiposCombustivel, novoTipo]);
        toast.success('Tipo de combustível cadastrado com sucesso!');
      } else {
        toast.error('Erro ao cadastrar tipo de combustível');
      }
    } catch (error) {
      console.error('Erro ao processar tipo de combustível:', error);
      toast.error('Ocorreu um erro ao processar o tipo de combustível');
    }
  };
  
  const formatarData = (dataString: string | null) => {
    if (!dataString) return 'Data não informada';
    try {
      const data = new Date(dataString);
      return format(data, 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return dataString;
    }
  };
  
  const formatarValor = (valor: number | null) => {
    if (valor === null || valor === undefined) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };
  
  return (
    <PageLayout>
      <PageHeader 
        title="Abastecimentos" 
        description="Gerenciamento de abastecimentos da frota"
      />
      
      <Tabs defaultValue="registros" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="registros">Registros</TabsTrigger>
          <TabsTrigger value="novo">Novo Abastecimento</TabsTrigger>
          <TabsTrigger value="tipos">Tipos de Combustível</TabsTrigger>
        </TabsList>
        
        <TabsContent value="registros" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Abastecimentos Registrados</h2>
              <Button size="sm" onClick={carregarAbastecimentos} disabled={carregando}>
                {carregando ? 'Carregando...' : 'Atualizar'}
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Veículo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motorista</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Combustível</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Km</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {registros.length === 0 ? (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan={8}>
                        {carregando ? 'Carregando abastecimentos...' : 'Nenhum registro encontrado'}
                      </td>
                    </tr>
                  ) : (
                    registros.map((registro) => (
                      <tr key={registro.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatarData(registro.data_abastecimento)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {registro.placa_veiculo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {registro.motorista_solicitante}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Badge variant="success">
                            {registro.tipo_combustivel}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {registro.quilometragem?.toLocaleString() || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {registro.posto}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                          {formatarValor(registro.valor_total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {registro.responsavel_autorizacao}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="novo">
          <NovoAbastecimentoForm 
            onSave={handleSaveAbastecimento} 
            tiposCombustivel={tiposCombustivel} 
          />
        </TabsContent>
        
        <TabsContent value="tipos">
          <TipoCombustivelForm 
            onSave={handleSaveTipoCombustivel} 
          />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Abastecimentos;
