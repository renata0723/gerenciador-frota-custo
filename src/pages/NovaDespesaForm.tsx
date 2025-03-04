
import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import { DollarSign, ChevronLeft } from 'lucide-react';
import NovaDespesaFormComponent from '@/components/despesas/NovaDespesaForm';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const NovaDespesaForm = () => {
  const navigate = useNavigate();

  const handleDespesaAdicionada = () => {
    toast.success("Despesa registrada com sucesso!");
    navigate('/despesas'); 
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Nova Despesa" 
        description="Registre uma nova despesa no sistema"
        icon={<DollarSign size={26} className="text-red-500" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Despesas Gerais', href: '/despesas' },
          { label: 'Nova Despesa' }
        ]}
        actions={
          <Button variant="outline" onClick={() => navigate('/despesas')}>
            <ChevronLeft size={16} className="mr-2" />
            Voltar
          </Button>
        }
      />

      <Card className="p-6 mb-6 bg-white shadow-sm">
        <h2 className="text-xl font-bold mb-4">Formulário de Registro de Despesa</h2>
        <NovaDespesaFormComponent 
          onDespesaAdicionada={handleDespesaAdicionada} 
        />
      </Card>
    </PageLayout>
  );
};

export default NovaDespesaForm;
