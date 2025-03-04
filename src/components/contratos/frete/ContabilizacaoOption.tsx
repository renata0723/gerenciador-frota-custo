
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { CONTAS_CONTABEIS } from '@/utils/constants';

interface ContabilizacaoOptionProps {
  isContabilizado: boolean;
  setIsContabilizado: (value: boolean) => void;
  contaDebito?: string;
  setContaDebito?: (value: string) => void;
  contaCredito?: string;
  setContaCredito?: (value: string) => void;
  centroCusto?: string;
  setCentroCusto?: (value: string) => void;
  descricaoLancamento?: string;
  setDescricaoLancamento?: (value: string) => void;
}

const ContabilizacaoOption: React.FC<ContabilizacaoOptionProps> = ({ 
  isContabilizado, 
  setIsContabilizado,
  contaDebito = CONTAS_CONTABEIS.CAIXA,
  setContaDebito = () => {},
  contaCredito = CONTAS_CONTABEIS.RECEITA_FRETE,
  setContaCredito = () => {},
  centroCusto = '',
  setCentroCusto = () => {},
  descricaoLancamento = '',
  setDescricaoLancamento = () => {}
}) => {
  const [mostrarDetalhes, setMostrarDetalhes] = useState(isContabilizado);

  const handleContabilizadoChange = (checked: boolean) => {
    setIsContabilizado(checked);
    setMostrarDetalhes(checked);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Contabilização</CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Contabilizado</Label>
              <p className="text-sm text-gray-500 mt-1">
                Marque esta opção para registrar na contabilidade
              </p>
            </div>
            <Switch 
              checked={isContabilizado} 
              onCheckedChange={handleContabilizadoChange} 
            />
          </div>

          {mostrarDetalhes && (
            <div className="space-y-4 pt-3 border-t border-gray-200 mt-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contaDebito">Conta Débito</Label>
                  <Select
                    value={contaDebito}
                    onValueChange={setContaDebito}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione a conta de débito" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CONTAS_CONTABEIS.CAIXA}>Caixa (1.1.1.01)</SelectItem>
                      <SelectItem value={CONTAS_CONTABEIS.BANCOS}>Bancos (1.1.1.02)</SelectItem>
                      <SelectItem value={CONTAS_CONTABEIS.CLIENTES}>Clientes (1.1.2.01)</SelectItem>
                      <SelectItem value={CONTAS_CONTABEIS.ADIANTAMENTO_FORNECEDORES}>Adiantamento a Fornecedores (1.1.5.01)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="contaCredito">Conta Crédito</Label>
                  <Select
                    value={contaCredito}
                    onValueChange={setContaCredito}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione a conta de crédito" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CONTAS_CONTABEIS.RECEITA_FRETE}>Receita de Fretes (3.1.1.01)</SelectItem>
                      <SelectItem value={CONTAS_CONTABEIS.FORNECEDORES}>Fornecedores (2.1.1.01)</SelectItem>
                      <SelectItem value={CONTAS_CONTABEIS.IMPOSTOS_A_RECOLHER}>Impostos a Recolher (2.1.2.01)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="centroCusto">Centro de Custo</Label>
                <Input
                  id="centroCusto"
                  value={centroCusto}
                  onChange={(e) => setCentroCusto(e.target.value)}
                  placeholder="Centro de custo (opcional)"
                />
              </div>

              <div>
                <Label htmlFor="descricaoLancamento">Descrição do Lançamento</Label>
                <Input
                  id="descricaoLancamento"
                  value={descricaoLancamento}
                  onChange={(e) => setDescricaoLancamento(e.target.value)}
                  placeholder="Ex: Receita de frete - CT-e 123456"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContabilizacaoOption;
