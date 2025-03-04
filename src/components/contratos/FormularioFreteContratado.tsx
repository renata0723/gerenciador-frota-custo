
import React from 'react';
import { FreteContratadoFormData } from './FreteContratadoForm';

interface FormularioFreteContratadoProps {
  onSubmit: (data: FreteContratadoFormData) => void;
  onBack?: () => void;
  onNext?: () => void;
  initialData?: FreteContratadoFormData;
  dadosContrato?: any;
}

const FormularioFreteContratado: React.FC<FormularioFreteContratadoProps> = ({
  onSubmit,
  onBack,
  onNext,
  initialData,
  dadosContrato
}) => {
  const isTipoFrota = dadosContrato?.tipoFrota === 'frota' || dadosContrato?.tipo === 'frota';
  
  return (
    <FreteContratadoForm 
      isTipoFrota={isTipoFrota} 
      initialData={initialData}
      onSubmit={onSubmit}
      onBack={onBack}
      onNext={onNext}
    />
  );
};

export default FormularioFreteContratado;
