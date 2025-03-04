
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import { Truck, ChevronLeft, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useVeiculoForm } from "@/hooks/useVeiculoForm";
import VeiculoDadosGerais from "@/components/veiculos/VeiculoDadosGerais";
import VeiculoDadosEspecificosCavalo from "@/components/veiculos/VeiculoDadosEspecificosCavalo";
import VeiculoDadosEspecificosCarreta from "@/components/veiculos/VeiculoDadosEspecificosCarreta";

const NovoVeiculoForm = () => {
  const navigate = useNavigate();
  const { 
    formData, 
    isEditMode, 
    handleChange, 
    handleSelectChange, 
    handleSubmit,
    handleCancel 
  } = useVeiculoForm();

  return (
    <PageLayout>
      <PageHeader 
        title={isEditMode ? "Editar Veículo" : "Novo Veículo"} 
        description={isEditMode ? "Atualize os dados do veículo" : "Cadastre um novo veículo na frota"}
        icon={<Truck size={26} className="text-sistema-primary" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Veículos', href: '/veiculos' },
          { label: isEditMode ? 'Editar' : 'Novo' }
        ]}
        actions={
          <Button variant="outline" onClick={() => navigate('/veiculos')}>
            <ChevronLeft size={16} className="mr-2" />
            Voltar
          </Button>
        }
      />

      <div className="bg-white dark:bg-sistema-dark rounded-xl shadow-card border border-gray-100 dark:border-gray-800 p-6 mb-8 animate-fade-in">
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="geral" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6 w-96">
              <TabsTrigger value="geral">Dados Gerais</TabsTrigger>
              <TabsTrigger value="especifico">Dados Específicos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="geral">
              <VeiculoDadosGerais 
                formData={formData} 
                handleChange={handleChange} 
                handleSelectChange={handleSelectChange} 
              />
            </TabsContent>
            
            <TabsContent value="especifico" className="space-y-6">
              {formData.tipo === 'cavalo' ? (
                <VeiculoDadosEspecificosCavalo 
                  formData={formData} 
                  handleChange={handleChange} 
                />
              ) : (
                <VeiculoDadosEspecificosCarreta 
                  formData={formData} 
                  handleChange={handleChange} 
                  handleSelectChange={handleSelectChange} 
                />
              )}
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 flex justify-end">
            <Button type="button" variant="outline" className="mr-2" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              <Save size={16} className="mr-2" />
              {isEditMode ? "Atualizar" : "Cadastrar"} Veículo
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};

export default NovoVeiculoForm;
