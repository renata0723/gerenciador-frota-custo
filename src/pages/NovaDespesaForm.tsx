
import React from 'react';
import NewPageLayout from '@/components/layout/NewPageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { ArrowLeft, DollarSign } from 'lucide-react';
import NovaDespesaFormComponent from '@/components/despesas/NovaDespesaForm';
import { useNavigate } from 'react-router-dom';

const NovaDespesaForm: React.FC = () => {
  const navigate = useNavigate();
  
  const handleDespesaAdicionada = () => {
    navigate('/despesas');
  };

  return (
    <NewPageLayout>
      <PageHeader 
        title="Nova Despesa" 
        description="Registre uma nova despesa geral"
        backButton={true}
        backLink="/despesas"
        icon={<DollarSign size={26} className="text-blue-500" />}
      />
      
      <div className="mt-6">
        <NovaDespesaFormComponent 
          onDespesaAdicionada={handleDespesaAdicionada} 
        />
      </div>
    </NewPageLayout>
  );
};

export default NovaDespesaForm;
