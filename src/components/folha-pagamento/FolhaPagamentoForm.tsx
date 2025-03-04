
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { criarRegistroFolhaPagamento, FolhaPagamento } from '@/services/contabilidadeService';

interface FolhaPagamentoFormProps {
  onSave: (folha: FolhaPagamento) => void;
}

const FolhaPagamentoForm: React.FC<FolhaPagamentoFormProps> = ({ onSave }) => {
  const [formData, setFormData] = useState<FolhaPagamento>({
    funcionario_nome: '',
    cargo: '',
    cpf: '',
    salario_base: 0,
    data_pagamento: format(new Date(), 'yyyy-MM-dd'),
    mes_referencia: format(new Date(), 'MMMM', { locale: ptBR }),
    ano_referencia: new Date().getFullYear(),
    desconto_inss: 0,
    desconto_irrf: 0,
    outros_descontos: 0,
    horas_extras: 0,
    valor_hora_extra: 0,
    adicional_periculosidade: 0,
    adicional_insalubridade: 0,
    outros_adicionais: 0,
    valor_total: 0
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isCalculating, setIsCalculating] = useState(false);

  // Atualiza o valor total quando os campos relacionados mudam
  useEffect(() => {
    calcularValorTotal();
  }, [
    formData.salario_base, 
    formData.desconto_inss, 
    formData.desconto_irrf, 
    formData.outros_descontos,
    formData.horas_extras,
    formData.valor_hora_extra,
    formData.adicional_periculosidade,
    formData.adicional_insalubridade,
    formData.outros_adicionais
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cpf') {
      // Formata CPF: 000.000.000-00
      const cpfValue = value.replace(/\D/g, '').slice(0, 11);
      const formattedCpf = cpfValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      setFormData(prev => ({ ...prev, [name]: formattedCpf }));
    } else if (['salario_base', 'desconto_inss', 'desconto_irrf', 'outros_descontos', 
                'horas_extras', 'valor_hora_extra', 'adicional_periculosidade', 
                'adicional_insalubridade', 'outros_adicionais'].includes(name)) {
      // Campos numéricos
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      // Campos de texto
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setFormData(prev => ({
        ...prev,
        data_pagamento: format(date, 'yyyy-MM-dd'),
        mes_referencia: format(date, 'MMMM', { locale: ptBR }),
        ano_referencia: date.getFullYear()
      }));
    }
  };

  const handleMesChange = (mes: string) => {
    setFormData(prev => ({ ...prev, mes_referencia: mes }));
  };

  const calcularValorTotal = () => {
    // Calcula proventos
    const proventos = formData.salario_base + 
                     (formData.horas_extras || 0) * (formData.valor_hora_extra || 0) +
                     (formData.adicional_periculosidade || 0) +
                     (formData.adicional_insalubridade || 0) +
                     (formData.outros_adicionais || 0);
    
    // Calcula descontos
    const descontos = (formData.desconto_inss || 0) +
                      (formData.desconto_irrf || 0) +
                      (formData.outros_descontos || 0);
    
    // Valor líquido
    const valorTotal = proventos - descontos;
    
    setFormData(prev => ({ ...prev, valor_total: valorTotal }));
  };

  const calcularInssIrrf = () => {
    setIsCalculating(true);
    
    // Simulação de cálculo de INSS (valores de 2023)
    const salarioBase = formData.salario_base;
    let inss = 0;
    
    if (salarioBase <= 1320) {
      inss = salarioBase * 0.075;
    } else if (salarioBase <= 2571.29) {
      inss = 1320 * 0.075 + (salarioBase - 1320) * 0.09;
    } else if (salarioBase <= 3856.94) {
      inss = 1320 * 0.075 + (2571.29 - 1320) * 0.09 + (salarioBase - 2571.29) * 0.12;
    } else if (salarioBase <= 7507.49) {
      inss = 1320 * 0.075 + (2571.29 - 1320) * 0.09 + (3856.94 - 2571.29) * 0.12 + (salarioBase - 3856.94) * 0.14;
    } else {
      inss = 877.24; // Teto de contribuição
    }
    
    // Simulação básica de cálculo de IRRF
    const baseIrrf = salarioBase - inss;
    let irrf = 0;
    
    if (baseIrrf <= 2112) {
      irrf = 0;
    } else if (baseIrrf <= 2826.65) {
      irrf = (baseIrrf * 0.075) - 158.40;
    } else if (baseIrrf <= 3751.05) {
      irrf = (baseIrrf * 0.15) - 370.40;
    } else if (baseIrrf <= 4664.68) {
      irrf = (baseIrrf * 0.225) - 651.73;
    } else {
      irrf = (baseIrrf * 0.275) - 884.96;
    }
    
    // Atualiza os valores calculados
    setFormData(prev => ({
      ...prev,
      desconto_inss: parseFloat(inss.toFixed(2)),
      desconto_irrf: parseFloat(irrf.toFixed(2))
    }));
    
    setTimeout(() => {
      setIsCalculating(false);
      toast.success('INSS e IRRF calculados com sucesso!');
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.funcionario_nome) {
      toast.error('O nome do funcionário é obrigatório');
      return;
    }
    
    if (formData.salario_base <= 0) {
      toast.error('O salário base deve ser maior que zero');
      return;
    }
    
    try {
      const response = await criarRegistroFolhaPagamento(formData);
      
      if (response) {
        toast.success('Registro de folha de pagamento salvo com sucesso!');
        onSave(response);
        
        // Limpa o formulário
        setFormData({
          funcionario_nome: '',
          cargo: '',
          cpf: '',
          salario_base: 0,
          data_pagamento: format(new Date(), 'yyyy-MM-dd'),
          mes_referencia: format(new Date(), 'MMMM', { locale: ptBR }),
          ano_referencia: new Date().getFullYear(),
          desconto_inss: 0,
          desconto_irrf: 0,
          outros_descontos: 0,
          horas_extras: 0,
          valor_hora_extra: 0,
          adicional_periculosidade: 0,
          adicional_insalubridade: 0,
          outros_adicionais: 0,
          valor_total: 0
        });
        setSelectedDate(new Date());
      }
    } catch (error) {
      console.error('Erro ao salvar folha de pagamento:', error);
      toast.error('Erro ao salvar registro. Tente novamente.');
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label htmlFor="funcionario_nome">Nome do Funcionário *</Label>
              <Input
                id="funcionario_nome"
                name="funcionario_nome"
                value={formData.funcionario_nome}
                onChange={handleInputChange}
                placeholder="Nome completo"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                placeholder="000.000.000-00"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                name="cargo"
                value={formData.cargo}
                onChange={handleInputChange}
                placeholder="Cargo do funcionário"
              />
            </div>
            
            <div>
              <Label htmlFor="data_pagamento">Data de Pagamento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="mes_referencia">Mês de Referência</Label>
              <Select value={formData.mes_referencia} onValueChange={handleMesChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o mês" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="janeiro">Janeiro</SelectItem>
                  <SelectItem value="fevereiro">Fevereiro</SelectItem>
                  <SelectItem value="março">Março</SelectItem>
                  <SelectItem value="abril">Abril</SelectItem>
                  <SelectItem value="maio">Maio</SelectItem>
                  <SelectItem value="junho">Junho</SelectItem>
                  <SelectItem value="julho">Julho</SelectItem>
                  <SelectItem value="agosto">Agosto</SelectItem>
                  <SelectItem value="setembro">Setembro</SelectItem>
                  <SelectItem value="outubro">Outubro</SelectItem>
                  <SelectItem value="novembro">Novembro</SelectItem>
                  <SelectItem value="dezembro">Dezembro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-4">Proventos e Descontos</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salario_base">Salário Base (R$) *</Label>
                <Input
                  id="salario_base"
                  name="salario_base"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.salario_base}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="flex items-end space-x-2">
                <div className="flex-grow">
                  <Label htmlFor="desconto_inss">Desconto INSS (R$)</Label>
                  <Input
                    id="desconto_inss"
                    name="desconto_inss"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.desconto_inss}
                    onChange={handleInputChange}
                  />
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={calcularInssIrrf}
                  disabled={isCalculating || formData.salario_base <= 0}
                  className="mb-[2px]"
                >
                  {isCalculating ? 'Calculando...' : 'Calcular'}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="horas_extras">Horas Extras</Label>
                <Input
                  id="horas_extras"
                  name="horas_extras"
                  type="number"
                  step="0.5"
                  min="0"
                  value={formData.horas_extras}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="valor_hora_extra">Valor Hora Extra (R$)</Label>
                <Input
                  id="valor_hora_extra"
                  name="valor_hora_extra"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.valor_hora_extra}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <Label htmlFor="adicional_periculosidade">Adicional de Periculosidade (R$)</Label>
                <Input
                  id="adicional_periculosidade"
                  name="adicional_periculosidade"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.adicional_periculosidade}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="adicional_insalubridade">Adicional de Insalubridade (R$)</Label>
                <Input
                  id="adicional_insalubridade"
                  name="adicional_insalubridade"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.adicional_insalubridade}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="outros_adicionais">Outros Adicionais (R$)</Label>
                <Input
                  id="outros_adicionais"
                  name="outros_adicionais"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.outros_adicionais}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="desconto_irrf">Desconto IRRF (R$)</Label>
                <Input
                  id="desconto_irrf"
                  name="desconto_irrf"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.desconto_irrf}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="outros_descontos">Outros Descontos (R$)</Label>
                <Input
                  id="outros_descontos"
                  name="outros_descontos"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.outros_descontos}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          
          <div className="border-t border-b py-4 my-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-lg font-semibold">Valor Total Líquido:</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-green-600">
                  R$ {formData.valor_total.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" className="w-full md:w-auto">
              Salvar Folha de Pagamento
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FolhaPagamentoForm;
