
import React from 'react';
import FreteContratadoForm, { FreteContratadoFormData } from './FreteContratadoForm';

interface FormularioFreteContratadoProps {
  onSubmit: (data: FreteContratadoFormData) => void;
  onBack?: () => void;
  onNext?: () => void;
  initialData?: FreteContratadoFormData;
  dadosContrato?: any;
}

const FormularioFreteContratado: React.FC<FormularioFreteContratadoProps> = (props) => {
  const isTipoFrota = props.dadosContrato?.tipoFrota === 'frota';
  
  return (
    <FreteContratadoForm 
      isTipoFrota={isTipoFrota} 
      initialData={props.initialData}
      onSubmit={props.onSubmit}
      onBack={props.onBack}
      onNext={props.onNext}
    />
  );
};

export default FormularioFreteContratado;
