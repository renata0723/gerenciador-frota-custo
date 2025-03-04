
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { FolhaPagamento } from '@/types/contabilidade';
import { criarRegistroFolhaPagamento, atualizarRegistroFolhaPagamento } from '@/services/folhaPagamentoService';

export interface FolhaPagamentoFormProps {
  dados?: Partial<FolhaPagamento>;
  onSubmit: (dados: Partial<FolhaPagamento>) => Promise<void>;
  onCancel: () => void;
}

const FolhaPagamentoForm: React.FC<FolhaPagamentoFormProps> = ({ dados, onSubmit, onCancel }) => {
  const [funcionarioNome, setFuncionarioNome] = useState(dados?.funcionario_nome || '');
  const [salarioBase, setSalarioBase] = useState(dados?.salario_base?.toString() || '');
  const [dataPagamento, setDataPagamento] = useState<Date | undefined>(
    dados?.data_pagamento ? new Date(dados.data_pagamento) : new Date()
  );
  const [mesReferencia, setMesReferencia] = useState(dados?.mes_referencia || format(new Date(), 'MM'));
  const [anoReferencia, setAnoReferencia] = useState(dados?.ano_referencia || format(new Date(), 'yyyy'));
  const [inss, setInss] = useState(dados?.inss?.toString() || '');
  const [fgts, setFgts] = useState(dados?.fgts?.toString() || '');
  const [ir, setIr] = useState(dados?.ir?.toString() || '');
  const [valeTransporte, setValeTransporte] = useState(dados?.vale_transporte?.toString() || '');
  const [valeRefeicao, setValeRefeicao] = useState(dados?.vale_refeicao?.toString() || '');
  const [outrosDescontos, setOutrosDescontos] = useState(dados?.outros_descontos?.toString() || '');
  const [outrosBeneficios, setOutrosBeneficios] = useState(dados?.outros_beneficios?.toString() || '');
  const [valorLiquido, setValorLiquido] = useState(dados?.valor_liquido?.toString() || '');
  const [observacoes, setObservacoes] = useState(dados?.observacoes || '');
  const [isProcessing, setIsProcessing] = useState(false);

  // Calcular valor líquido automaticamente
  useEffect(() => {
    try {
      const salario = parseFloat(salarioBase || '0');
      const inssValor = parseFloat(inss || '0');
      const fgtsValor = parseFloat(fgts || '0');
      const irValor = parseFloat(ir || '0');
      const valeTransporteValor = parseFloat(valeTransporte || '0');
      const valeRefeicaoValor = parseFloat(valeRefeicao || '0');
      const outrosDescontosValor = parseFloat(outrosDescontos || '0');
      const outrosBeneficiosValor = parseFloat(outrosBeneficios || '0');

      const liquido = salario - inssValor - irValor - valeTransporteValor 
                     - valeRefeicaoValor - outrosDescontosValor + outrosBeneficiosValor;
      
      setValorLiquido(liquido.toFixed(2));
    } catch (err) {
      // Ignora erros de conversão
    }
  }, [salarioBase, inss, fgts, ir, valeTransporte, valeRefeicao, outrosDescontos, outrosBeneficios]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!funcionarioNome) {
      toast.error('Nome do funcionário é obrigatório');
      return;
    }
    
    if (!salarioBase || isNaN(parseFloat(salarioBase)) || parseFloat(salarioBase) <= 0) {
      toast.error('Salário base deve ser um valor positivo');
      return;
    }
    
    if (!dataPagamento) {
      toast.error('Data de pagamento é obrigatória');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const folhaPagamentoData: Partial<FolhaPagamento> = {
        funcionario_nome: funcionarioNome,
        salario_base: parseFloat(salarioBase),
        data_pagamento: format(dataPagamento, 'yyyy-MM-dd'),
        mes_referencia: mesReferencia,
        ano_referencia: anoReferencia,
        inss: inss ? parseFloat(inss) : undefined,
        fgts: fgts ? parseFloat(fgts) : undefined,
        ir: ir ? parseFloat(ir) : undefined,
        vale_transporte: valeTransporte ? parseFloat(valeTransporte) : undefined,
        vale_refeicao: valeRefeicao ? parseFloat(valeRefeicao) : undefined,
        outros_descontos: outrosDescontos ? parseFloat(outrosDescontos) : undefined,
        outros_beneficios: outrosBeneficios ? parseFloat(outrosBeneficios) : undefined,
        valor_liquido: parseFloat(valorLiquido),
        observacoes
      };
      
      await onSubmit(folhaPagamentoData);
    } catch (error) {
      console.error('Erro ao processar formulário:', error);
      toast.error('Ocorreu um erro ao salvar os dados');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{dados?.id ? 'Editar' : 'Novo'} Registro de Folha de Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="funcionarioNome">Nome do Funcionário</Label>
              <Input
                id="funcionarioNome"
                value={funcionarioNome}
                onChange={(e) => setFuncionarioNome(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salarioBase">Salário Base</Label>
              <Input
                id="salarioBase"
                type="number"
                step="0.01"
                value={salarioBase}
                onChange={(e) => setSalarioBase(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dataPagamento">Data de Pagamento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataPagamento && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataPagamento ? format(dataPagamento, "dd/MM/yyyy") : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dataPagamento}
                    onSelect={setDataPagamento}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="mesReferencia">Mês Referência</Label>
                <Input
                  id="mesReferencia"
                  value={mesReferencia}
                  onChange={(e) => setMesReferencia(e.target.value)}
                  required
                  placeholder="MM"
                  maxLength={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="anoReferencia">Ano Referência</Label>
                <Input
                  id="anoReferencia"
                  value={anoReferencia}
                  onChange={(e) => setAnoReferencia(e.target.value)}
                  required
                  placeholder="YYYY"
                  maxLength={4}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="inss">INSS</Label>
              <Input
                id="inss"
                type="number"
                step="0.01"
                value={inss}
                onChange={(e) => setInss(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fgts">FGTS</Label>
              <Input
                id="fgts"
                type="number"
                step="0.01"
                value={fgts}
                onChange={(e) => setFgts(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ir">IR</Label>
              <Input
                id="ir"
                type="number"
                step="0.01"
                value={ir}
                onChange={(e) => setIr(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="valeTransporte">Vale Transporte</Label>
              <Input
                id="valeTransporte"
                type="number"
                step="0.01"
                value={valeTransporte}
                onChange={(e) => setValeTransporte(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="valeRefeicao">Vale Refeição</Label>
              <Input
                id="valeRefeicao"
                type="number"
                step="0.01"
                value={valeRefeicao}
                onChange={(e) => setValeRefeicao(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="outrosDescontos">Outros Descontos</Label>
              <Input
                id="outrosDescontos"
                type="number"
                step="0.01"
                value={outrosDescontos}
                onChange={(e) => setOutrosDescontos(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="outrosBeneficios">Outros Benefícios</Label>
              <Input
                id="outrosBeneficios"
                type="number"
                step="0.01"
                value={outrosBeneficios}
                onChange={(e) => setOutrosBeneficios(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="valorLiquido">Valor Líquido</Label>
              <Input
                id="valorLiquido"
                type="number"
                step="0.01"
                value={valorLiquido}
                onChange={(e) => setValorLiquido(e.target.value)}
                readOnly
                className="bg-gray-100"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Input
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processando...' : dados?.id ? 'Atualizar' : 'Salvar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FolhaPagamentoForm;
