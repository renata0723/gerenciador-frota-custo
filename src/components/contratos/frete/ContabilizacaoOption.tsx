
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface ContabilizacaoOptionProps {
  isContabilizado: boolean;
  setIsContabilizado: (value: boolean) => void;
}

const ContabilizacaoOption: React.FC<ContabilizacaoOptionProps> = ({ 
  isContabilizado, 
  setIsContabilizado 
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-lg font-semibold">Contabilizado</Label>
            <p className="text-sm text-gray-500 mt-1">
              Marque esta opção se o valor já foi contabilizado no sistema
            </p>
          </div>
          <Switch 
            checked={isContabilizado} 
            onCheckedChange={setIsContabilizado} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ContabilizacaoOption;
