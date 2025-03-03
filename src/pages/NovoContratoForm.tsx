
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import ContratoFormCompleto from '@/components/contratos/ContratoFormCompleto';
import { useNavigate, useParams } from 'react-router-dom';

const NovoContratoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const handleBack = () => {
    navigate('/contratos');
  };

  return (
    <PageLayout>
      <PageHeader 
        title={isEditing ? "Editar Contrato" : "Novo Contrato"} 
        description={isEditing 
          ? `Editando detalhes do contrato #${id}` 
          : "Registre um novo contrato de transporte"
        }
        backButton={true}
        onBackClick={handleBack}
      />
      
      <div className="mt-6">
        <ContratoFormCompleto contratoId={id} />
      </div>
    </PageLayout>
  );
};

export default NovoContratoForm;
