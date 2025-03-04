
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";

interface ContabilizacaoOptionProps {
  contabilizarFrete: boolean;
  setContabilizarFrete: (checked: boolean) => void;
  isTipoFrota: boolean;
}

const ContabilizacaoOption: React.FC<ContabilizacaoOptionProps> = ({
  contabilizarFrete,
  setContabilizarFrete,
  isTipoFrota
}) => {
  return (
    <div className="border rounded-md p-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="contabilizarFrete"
          checked={contabilizarFrete}
          onCheckedChange={(checked) => {
            const isChecked = checked === true;
            setContabilizarFrete(isChecked);
          }}
          disabled={isTipoFrota}
        />
        <label
          htmlFor="contabilizarFrete"
          className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
            isTipoFrota ? 'text-gray-400' : ''
          }`}
        >
          Contabilizar frete automaticamente
        </label>
      </div>
      {contabilizarFrete && (
        <p className="text-xs text-gray-500 mt-2 ml-6">
          Será gerado lançamento contábil de receita de frete automaticamente quando o contrato for salvo.
        </p>
      )}
    </div>
  );
};

export default ContabilizacaoOption;
