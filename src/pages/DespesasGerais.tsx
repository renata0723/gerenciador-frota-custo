
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/ui/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NovaDespesaForm from '@/components/despesas/NovaDespesaForm';

const DespesasGerais = () => {
  const handleSaveDespesa = (data) => {
    console.log('Despesa salva:', data);
    // Implementar lógica para salvar a despesa
  };
  
  return (
    <PageLayout>
      <PageHeader 
        title="Despesas Gerais" 
        description="Gerenciamento de despesas de viagem e outras despesas"
      />
      
      <Tabs defaultValue="registros" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="registros">Registros</TabsTrigger>
          <TabsTrigger value="novo">Nova Despesa</TabsTrigger>
        </TabsList>
        
        <TabsContent value="registros" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Despesas Registradas</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contrato</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Dados serão carregados aqui */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan={6}>Nenhum registro encontrado</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="novo">
          <NovaDespesaForm onSave={handleSaveDespesa} />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default DespesasGerais;
