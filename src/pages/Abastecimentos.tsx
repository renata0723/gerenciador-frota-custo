
import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/ui/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NovoAbastecimentoForm from '@/components/abastecimentos/NovoAbastecimentoForm';
import TipoCombustivelForm from '@/components/abastecimentos/TipoCombustivelForm';

const Abastecimentos = () => {
  const [tiposCombustivel, setTiposCombustivel] = useState([
    { id: 1, nome: 'Diesel S10' },
    { id: 2, nome: 'Diesel Comum' },
    { id: 3, nome: 'Arla 32' }
  ]);
  
  const handleSaveAbastecimento = (data) => {
    console.log('Abastecimento salvo:', data);
    // Implementar lógica para salvar o abastecimento
  };
  
  const handleSaveTipoCombustivel = (data) => {
    console.log('Tipo de combustível salvo:', data);
    const novoTipo = {
      id: tiposCombustivel.length + 1,
      nome: data.nome
    };
    setTiposCombustivel([...tiposCombustivel, novoTipo]);
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
            <h2 className="text-xl font-semibold mb-4">Abastecimentos Registrados</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Veículo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motorista</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Combustível</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Litros</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Km</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Dados serão carregados aqui */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan={8}>Nenhum registro encontrado</td>
                  </tr>
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
