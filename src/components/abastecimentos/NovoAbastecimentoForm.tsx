
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CONTAS_CONTABEIS } from '@/utils/constants';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import DatePicker from '@/components/ui/DatePicker';
import { AbastecimentoFormData, NovoAbastecimentoFormProps, TipoCombustivel } from '@/types/abastecimento';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/utils/constants';

const NovoAbastecimentoForm: React.FC<NovoAbastecimentoFormProps> = ({ 
  onSubmit, 
  onCancel,
  initialData,
  tiposCombustivel = []
}) => {
  const [valor, setValor] = useState(initialData?.valor || 0);
  const [quantidade, setQuantidade] = useState(initialData?.quantidade || 0);
  const [posto, setPosto] = useState(initialData?.posto || '');
  const [quilometragem, setQuilometragem] = useState<number | undefined>(initialData?.quilometragem);
  const [dataAbastecimento, setDataAbastecimento] = useState<Date>(
    initialData?.data_abastecimento ? new Date(initialData.data_abastecimento) : new Date()
  );
  const [responsavel, setResponsavel] = useState(initialData?.responsavel || '');
  const [motorista, setMotorista] = useState(initialData?.motorista || '');
  const [placa, setPlaca] = useState(initialData?.placa || '');
  const [tipoCombustivel, setTipoCombustivel] = useState(initialData?.tipo_combustivel || '');
  const [contabilizado, setContabilizado] = useState(initialData?.contabilizado || false);
  const [contaDebito, setContaDebito] = useState(initialData?.conta_debito || CONTAS_CONTABEIS.DESPESA_COMBUSTIVEL);
  const [contaCredito, setContaCredito] = useState(initialData?.conta_credito || CONTAS_CONTABEIS.CAIXA);
  const [itens, setItens] = useState(initialData?.itens || '');
  
  const [valorTotal, setValorTotal] = useState(0);
  const [listaTiposCombustivel, setListaTiposCombustivel] = useState<TipoCombustivel[]>(tiposCombustivel || []);
  const [placas, setPlacas] = useState<{placa_cavalo: string}[]>([]);
  
  // Buscar tipos de combustível e placas ao carregar o componente
  useEffect(() => {
    if (tiposCombustivel && tiposCombustivel.length > 0) {
      setListaTiposCombustivel(tiposCombustivel);
    } else {
      fetchTiposCombustivel();
    }
    fetchPlacas();
  }, [tiposCombustivel]);
  
  // Calcular valor total quando valor ou quantidade mudar
  useEffect(() => {
    setValorTotal(valor * quantidade);
  }, [valor, quantidade]);
  
  const fetchTiposCombustivel = async () => {
    try {
      const { data, error } = await supabase
        .from('TiposCombustivel')
        .select('id, nome');
      
      if (error) throw error;
      if (data) setListaTiposCombustivel(data);
    } catch (error) {
      console.error('Erro ao buscar tipos de combustível:', error);
      toast.error('Não foi possível carregar os tipos de combustível');
    }
  };
  
  const fetchPlacas = async () => {
    try {
      const { data, error } = await supabase
        .from('Veiculos')
        .select('placa_cavalo')
        .eq('status_veiculo', 'ativo');
      
      if (error) throw error;
      if (data) setPlacas(data);
    } catch (error) {
      console.error('Erro ao buscar placas:', error);
      toast.error('Não foi possível carregar as placas dos veículos');
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dataAbastecimento) {
      toast.error('Data de abastecimento é obrigatória');
      return;
    }
    
    if (!placa) {
      toast.error('Selecione a placa do veículo');
      return;
    }
    
    if (!tipoCombustivel) {
      toast.error('Selecione o tipo de combustível');
      return;
    }
    
    if (valor <= 0 || quantidade <= 0) {
      toast.error('Valor e quantidade devem ser maiores que zero');
      return;
    }
    
    const formattedData: AbastecimentoFormData = {
      valor,
      quantidade,
      contabilizado,
      conta_debito: contaDebito,
      conta_credito: contaCredito,
      data_abastecimento: dataAbastecimento.toISOString().split('T')[0],
      posto,
      quilometragem,
      responsavel,
      motorista,
      placa,
      tipo_combustivel: tipoCombustivel,
      itens
    };
    
    onSubmit(formattedData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Novo Abastecimento</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dataAbastecimento">Data do Abastecimento*</Label>
              <DatePicker
                value={dataAbastecimento}
                onChange={(date) => setDataAbastecimento(date)}
              />
            </div>
            
            <div>
              <Label htmlFor="placa">Placa do Veículo*</Label>
              <Select value={placa} onValueChange={setPlaca}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a placa" />
                </SelectTrigger>
                <SelectContent>
                  {placas.map((p) => (
                    <SelectItem key={p.placa_cavalo} value={p.placa_cavalo}>
                      {p.placa_cavalo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tipoCombustivel">Tipo de Combustível*</Label>
              <Select value={tipoCombustivel} onValueChange={setTipoCombustivel}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {listaTiposCombustivel.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id}>
                      {tipo.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="posto">Posto</Label>
              <Input
                id="posto"
                value={posto}
                onChange={(e) => setPosto(e.target.value)}
                placeholder="Nome do posto"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="valor">Valor Unitário (R$)*</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                min="0"
                value={valor}
                onChange={(e) => setValor(parseFloat(e.target.value) || 0)}
                placeholder="0,00"
              />
            </div>
            
            <div>
              <Label htmlFor="quantidade">Quantidade (L)*</Label>
              <Input
                id="quantidade"
                type="number"
                step="0.01"
                min="0"
                value={quantidade}
                onChange={(e) => setQuantidade(parseFloat(e.target.value) || 0)}
                placeholder="0,00"
              />
            </div>
            
            <div>
              <Label htmlFor="valorTotal">Valor Total</Label>
              <Input
                id="valorTotal"
                value={formatCurrency(valorTotal)}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quilometragem">Quilometragem</Label>
              <Input
                id="quilometragem"
                type="number"
                min="0"
                value={quilometragem || ''}
                onChange={(e) => setQuilometragem(parseInt(e.target.value) || undefined)}
                placeholder="Quilometragem atual"
              />
            </div>
            
            <div>
              <Label htmlFor="motorista">Motorista</Label>
              <Input
                id="motorista"
                value={motorista}
                onChange={(e) => setMotorista(e.target.value)}
                placeholder="Nome do motorista"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="responsavel">Responsável pela Autorização</Label>
            <Input
              id="responsavel"
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
              placeholder="Nome do responsável"
            />
          </div>
          
          <div>
            <Label htmlFor="itens">Itens Abastecidos</Label>
            <Textarea
              id="itens"
              value={itens}
              onChange={(e) => setItens(e.target.value)}
              placeholder="Diesel, Arla, etc."
              rows={2}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="contabilizado"
              checked={contabilizado}
              onCheckedChange={setContabilizado}
            />
            <Label htmlFor="contabilizado">Contabilizar abastecimento</Label>
          </div>
          
          {contabilizado && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md bg-gray-50">
              <div>
                <Label htmlFor="contaDebito">Conta Débito</Label>
                <Select value={contaDebito} onValueChange={setContaDebito}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a conta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CONTAS_CONTABEIS.DESPESA_COMBUSTIVEL}>Combustível (4.1.1.01)</SelectItem>
                    <SelectItem value={CONTAS_CONTABEIS.DESPESAS_VIAGEM}>Despesas de Viagem (4.1.4.01)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="contaCredito">Conta Crédito</Label>
                <Select value={contaCredito} onValueChange={setContaCredito}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a conta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CONTAS_CONTABEIS.CAIXA}>Caixa (1.1.1.01)</SelectItem>
                    <SelectItem value={CONTAS_CONTABEIS.BANCOS}>Bancos (1.1.1.02)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Abastecimento
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NovoAbastecimentoForm;
