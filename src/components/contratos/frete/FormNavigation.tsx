
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormNavigationProps {
  onBack: () => void;
  onSave: () => void;
  isValid: boolean;
}

const FormNavigation: React.FC<FormNavigationProps> = ({ onBack, onSave, isValid }) => {
  return (
    <div className="flex justify-between mt-6">
      <Button type="button" variant="outline" onClick={onBack}>
        Voltar
      </Button>
      <Button 
        type="button" 
        onClick={onSave}
        disabled={!isValid}
      >
        Salvar e Continuar
      </Button>
    </div>
  );
};

export default FormNavigation;
