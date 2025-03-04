
import React from 'react';
import { Button } from "@/components/ui/button";

interface FormNavigationProps {
  onBack?: () => void;
  onNext?: () => void;
}

const FormNavigation: React.FC<FormNavigationProps> = ({ onBack, onNext }) => {
  return (
    <div className="flex justify-between pt-4">
      {onBack && (
        <Button type="button" variant="outline" onClick={onBack}>
          Voltar
        </Button>
      )}
      <div className="flex space-x-2">
        {onNext && (
          <Button type="button" variant="outline" onClick={onNext}>
            Pular
          </Button>
        )}
        <Button type="submit">
          {onNext ? "Salvar e Continuar" : "Salvar"}
        </Button>
      </div>
    </div>
  );
};

export default FormNavigation;
