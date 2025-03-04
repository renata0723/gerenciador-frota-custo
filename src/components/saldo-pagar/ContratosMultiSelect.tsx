
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { formatCurrency } from '@/utils/formatters';
import { CalendarIcon, DollarSign, FileText, X } from 'lucide-react';

export interface ContratoItem {
  id: string;
  cliente_destino: string;
  valor_frete: number;
  status_contrato: string;
  selecionado: boolean;
}

interface ContratosMultiSelectProps {
  contratos: ContratoItem[];
  onContratoToggle: (id: string) => void;
  valorTotal: number;
  onLimparSelecao: () => void;
}

const ContratosMultiSelect: React.FC<ContratosMultiSelectProps> = ({ 
  contratos, 
  onContratoToggle, 
  valorTotal,
  onLimparSelecao
}) => {
  const contratosSelecionados = contratos.filter(c => c.selecionado);
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">
          Contratos do Parceiro
        </CardTitle>
        
        {contratosSelecionados.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onLimparSelecao}
            className="h-8 px-2 text-sm"
          >
            <X size={14} className="mr-1" />
            Limpar seleção
          </Button>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {contratos.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <FileText className="mx-auto h-10 w-10 text-gray-300 mb-2" />
              <p>Nenhum contrato encontrado para este parceiro</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {contratos.map((contrato) => (
                  <div 
                    key={contrato.id}
                    className={`
                      border rounded-md p-3 cursor-pointer transition-all
                      ${contrato.selecionado ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
                    `}
                    onClick={() => onContratoToggle(contrato.id)}
                  >
                    <div className="flex items-start gap-2">
                      <Checkbox 
                        checked={contrato.selecionado}
                        onCheckedChange={() => onContratoToggle(contrato.id)}
                        id={`contrato-${contrato.id}`}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label 
                          htmlFor={`contrato-${contrato.id}`}
                          className="font-medium cursor-pointer text-sm"
                        >
                          Contrato #{contrato.id}
                        </label>
                        <div className="text-sm text-gray-500 mt-1">
                          {contrato.cliente_destino}
                        </div>
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <DollarSign size={14} className="text-green-600 mr-1" />
                          {formatCurrency(contrato.valor_frete)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {contratosSelecionados.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Contratos selecionados:</span>
                    <span className="font-medium">{contratosSelecionados.length}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-medium">Valor Total:</span>
                    <span className="font-bold text-lg text-green-600">{formatCurrency(valorTotal)}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContratosMultiSelect;
