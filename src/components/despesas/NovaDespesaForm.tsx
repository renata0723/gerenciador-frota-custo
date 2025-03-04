
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Switch } from '@/components/ui/switch';

interface NovaDespesaFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

const NovaDespesaForm: React.FC<NovaDespesaFormProps> = ({ onSave, onCancel }) => {
  const [dataDespesa, setDataDespesa] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [tipoDespesa, setTipoDespesa] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [contabilizado, setContabilizado] = useState(false);
  const [rateio, setRateio] = useState(false);
  const [contratoId, setContratoId] = useState('');
  const [contaContabil, setContaContabil] = useState('');
  
  const [tiposDespesa, setTiposDespesa] = useState<string[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [contas, setContas] = useState<any[]>([]);
  const [contratos, setContratos] = useState<any[]>([]);
  const [contratosSelecionados, setContratosSelecionados] = useState<string[]>([]);
  
  useEffect(() => {
    carregarDadosIniciais();
  }, []);
  
  const carregarDadosIniciais = async () => {
    try {
      // Carregar tipos de despesa
      setTiposDespesa([
        'Deslocamento', 'Alimentação', 'Hospedagem', 'Manutenção', 
        'Combustível', 'Pedágio', 'Administrativo', 'Descarga', 
        'Reentrega', 'No-show', 'Outros'
      ]);
      
      // Carregar categorias
      setCategorias([
        'Operacional', 'Administrativo', 'Financeiro', 
        'Comercial', 'Impostos', 'Outros'
      ]);
      
      // Carregar contas contábeis
      const { data: contasData, error: contasError } = await supabase
        .from('Plano_Contas')
        .select('codigo, nome')
        .eq('tipo', 'despesa')
        .eq('status', 'ativo');
        
      if (contasError) {
        console.error('Erro ao carregar contas contábeis:', contasError);
      } else if (contasData) {
        setContas(contasData);
      }
      
      // Carregar contratos ativos
      const { data: contratosData, error: contratosError } = await supabase
        .from('Contratos')
        .select('id, cliente_destino, cidade_destino')
        .eq('status_contrato', 'Em Andamento');
        
      if (contratosError) {
        console.error('Erro ao carregar contratos:', contratosError);
      } else if (contratosData) {
        setContratos(contratosData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dataDespesa || !tipoDespesa || !valor) {
      toast.error('Por favor, preencha os campos obrigatórios');
      return;
    }
    
    const valorNumerico = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorNumerico)) {
      toast.error('Valor inválido');
      return;
    }
    
    const dadosDespesa = {
      data_despesa: dataDespesa,
      tipo_despesa: tipoDespesa,
      descricao_detalhada: descricao,
      valor_despesa: valorNumerico,
      categoria,
      contabilizado,
      rateio,
      contrato_id: contratoId,
      conta_contabil: contaContabil
    };
    
    onSave(dadosDespesa);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dataDespesa">Data da Despesa *</Label>
          <Input
            id="dataDespesa"
            type="date"
            value={dataDespesa}
            onChange={(e) => setDataDespesa(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tipoDespesa">Tipo de Despesa *</Label>
          <Select 
            value={tipoDespesa} 
            onValueChange={setTipoDespesa}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {tiposDespesa.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="valor">Valor *</Label>
          <Input
            id="valor"
            type="text"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="0,00"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="categoria">Categoria</Label>
          <Select 
            value={categoria} 
            onValueChange={setCategoria}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {categorias.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contaContabil">Conta Contábil</Label>
          <Select 
            value={contaContabil} 
            onValueChange={setContaContabil}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a conta contábil" />
            </SelectTrigger>
            <SelectContent>
              {contas.map((conta) => (
                <SelectItem key={conta.codigo} value={conta.codigo}>
                  {conta.codigo} - {conta.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição Detalhada</Label>
        <Textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descreva os detalhes da despesa"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="contabilizado"
            checked={contabilizado}
            onCheckedChange={setContabilizado}
          />
          <Label htmlFor="contabilizado">Contabilizado</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="rateio"
            checked={rateio}
            onCheckedChange={setRateio}
          />
          <Label htmlFor="rateio">Rateio entre contratos</Label>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="contratoId">Contrato Relacionado</Label>
        <Select 
          value={contratoId} 
          onValueChange={setContratoId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o contrato (opcional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Nenhum contrato</SelectItem>
            {contratos.map((contrato) => (
              <SelectItem key={contrato.id} value={contrato.id.toString()}>
                #{contrato.id} - {contrato.cliente_destino} ({contrato.cidade_destino})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Salvar Despesa
        </Button>
      </div>
    </form>
  );
};

export default NovaDespesaForm;
