
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Minus, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CODIGOS_REDUZIDOS } from '@/utils/constants';
import { format } from 'date-fns';

interface LancamentoItem {
  tipo: 'debito' | 'credito';
  conta: string;
  valor: number;
  centroCusto?: string;
}

interface LancamentoContabilFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  contas: any[];
  centrosCusto: any[];
  initialData?: any;
}

const LancamentoContabilForm: React.FC<LancamentoContabilFormProps> = ({
  onSubmit,
  onCancel,
  contas,
  centrosCusto,
  initialData
}) => {
  const [dataLancamento, setDataLancamento] = useState(
    initialData?.data_lancamento || format(new Date(), 'yyyy-MM-dd')
  );
  const [dataCompetencia, setDataCompetencia] = useState(
    initialData?.data_competencia || format(new Date(), 'yyyy-MM-dd')
  );
  
  const [historico, setHistorico] = useState(initialData?.historico || '');
  const [documentoReferencia, setDocumentoReferencia] = useState(initialData?.documento_referencia || '');
  const [tipoDocumento, setTipoDocumento] = useState(initialData?.tipo_documento || '');
  
  const [lancamentos, setLancamentos] = useState<LancamentoItem[]>([
    { tipo: 'debito', conta: initialData?.conta_debito || '', valor: initialData?.valor || 0 },
    { tipo: 'credito', conta: initialData?.conta_credito || '', valor: initialData?.valor || 0 }
  ]);
  
  const [erro, setErro] = useState<string | null>(null);
  const [codigoReduzido, setCodigoReduzido] = useState('');
  
  const buscarContaPorCodigoReduzido = () => {
    if (!codigoReduzido) return;
    
    // Converter para código completo
    const entrada = codigoReduzido.trim();
    let contaEncontrada = '';
    
    // Procurar o código reduzido nas constantes
    Object.entries(CODIGOS_REDUZIDOS).forEach(([chave, valor]) => {
      if (valor === entrada) {
        // Mapear para o código da conta no plano de contas
        const conta = contas.find(c => c.nome.toLowerCase().includes(chave.toLowerCase()));
        if (conta) {
          contaEncontrada = conta.codigo;
        }
      }
    });
    
    // Se não encontrou por código reduzido, procura diretamente nas contas
    if (!contaEncontrada) {
      const conta = contas.find(c => 
        c.codigo.includes(entrada) || 
        c.codigo_reduzido === entrada
      );
      
      if (conta) {
        contaEncontrada = conta.codigo;
      }
    }
    
    if (contaEncontrada) {
      // Adicionar ao primeiro lançamento sem conta preenchida
      const index = lancamentos.findIndex(l => !l.conta);
      if (index >= 0) {
        const novosLancamentos = [...lancamentos];
        novosLancamentos[index].conta = contaEncontrada;
        setLancamentos(novosLancamentos);
      }
      setCodigoReduzido('');
    } else {
      setErro(`Código reduzido ${codigoReduzido} não encontrado`);
      setTimeout(() => setErro(null), 3000);
    }
  };
  
  const adicionarLancamento = (tipo: 'debito' | 'credito') => {
    setLancamentos([...lancamentos, { tipo, conta: '', valor: 0 }]);
  };
  
  const removerLancamento = (index: number) => {
    if (lancamentos.length <= 2) {
      setErro('É necessário ter pelo menos um débito e um crédito');
      setTimeout(() => setErro(null), 3000);
      return;
    }
    
    setLancamentos(lancamentos.filter((_, i) => i !== index));
  };
  
  const atualizarLancamento = (index: number, campo: keyof LancamentoItem, valor: any) => {
    const novosLancamentos = [...lancamentos];
    novosLancamentos[index] = { ...novosLancamentos[index], [campo]: valor };
    setLancamentos(novosLancamentos);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    
    // Validações
    if (!dataLancamento || !dataCompetencia || !historico) {
      setErro('Preencha todos os campos obrigatórios');
      return;
    }
    
    // Verificar se todos os lançamentos têm conta e valor
    const lancamentoInvalido = lancamentos.some(l => !l.conta || l.valor <= 0);
    if (lancamentoInvalido) {
      setErro('Todos os lançamentos devem ter conta e valor maior que zero');
      return;
    }
    
    // Verificar se os totais de débito e crédito são iguais
    const totalDebito = lancamentos
      .filter(l => l.tipo === 'debito')
      .reduce((sum, l) => sum + l.valor, 0);
      
    const totalCredito = lancamentos
      .filter(l => l.tipo === 'credito')
      .reduce((sum, l) => sum + l.valor, 0);
      
    if (totalDebito !== totalCredito) {
      setErro('Os totais de débito e crédito devem ser iguais');
      return;
    }
    
    // Preparar dados para envio
    const dados = {
      data_lancamento: dataLancamento,
      data_competencia: dataCompetencia,
      historico,
      documento_referencia: documentoReferencia,
      tipo_documento: tipoDocumento,
      valor: totalDebito, // Valor total da operação
      lancamentos, // Array com todos os lançamentos
      
      // Manter compatibilidade com formato antigo
      conta_debito: lancamentos.find(l => l.tipo === 'debito')?.conta || '',
      conta_credito: lancamentos.find(l => l.tipo === 'credito')?.conta || '',
      
      // Campo para identificar que é partida múltipla
      partida_multipla: lancamentos.length > 2
    };
    
    onSubmit(dados);
  };
  
  const totalDebito = lancamentos
    .filter(l => l.tipo === 'debito')
    .reduce((sum, l) => sum + (parseFloat(l.valor.toString()) || 0), 0);
    
  const totalCredito = lancamentos
    .filter(l => l.tipo === 'credito')
    .reduce((sum, l) => sum + (parseFloat(l.valor.toString()) || 0), 0);
  
  const diferenca = Math.abs(totalDebito - totalCredito);
  const isTotalIgual = diferenca < 0.01; // Tolerância para erros de arredondamento
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {erro && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{erro}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dataLancamento">Data do Lançamento*</Label>
          <Input
            id="dataLancamento"
            type="date"
            value={dataLancamento}
            onChange={(e) => setDataLancamento(e.target.value)}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="dataCompetencia">Data de Competência*</Label>
          <Input
            id="dataCompetencia"
            type="date"
            value={dataCompetencia}
            onChange={(e) => setDataCompetencia(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="historico">Histórico do Lançamento*</Label>
        <Textarea
          id="historico"
          value={historico}
          onChange={(e) => setHistorico(e.target.value)}
          placeholder="Descreva o lançamento contábil"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="documentoReferencia">Documento de Referência</Label>
          <Input
            id="documentoReferencia"
            value={documentoReferencia}
            onChange={(e) => setDocumentoReferencia(e.target.value)}
            placeholder="Número de documento/contrato"
          />
        </div>
        
        <div>
          <Label htmlFor="tipoDocumento">Tipo de Documento</Label>
          <Select value={tipoDocumento} onValueChange={setTipoDocumento}>
            <SelectTrigger id="tipoDocumento">
              <SelectValue placeholder="Selecione o tipo (opcional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NF">Nota Fiscal</SelectItem>
              <SelectItem value="FAT">Fatura</SelectItem>
              <SelectItem value="REC">Recibo</SelectItem>
              <SelectItem value="CTR">Contrato</SelectItem>
              <SelectItem value="OUT">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="border p-4 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Lançamentos</h3>
          
          <div className="space-x-2">
            <Button type="button" size="sm" variant="outline" onClick={() => adicionarLancamento('debito')}>
              <Plus size={14} className="mr-1" />
              Débito
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => adicionarLancamento('credito')}>
              <Plus size={14} className="mr-1" />
              Crédito
            </Button>
          </div>
        </div>
        
        <div className="mb-4">
          <Label htmlFor="codigoReduzido">Código Reduzido</Label>
          <div className="flex gap-2">
            <Input
              id="codigoReduzido"
              value={codigoReduzido}
              onChange={(e) => setCodigoReduzido(e.target.value)}
              placeholder="Digite o código reduzido da conta"
            />
            <Button type="button" variant="outline" onClick={buscarContaPorCodigoReduzido}>
              Buscar
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Atalho para encontrar contas rapidamente pelo código reduzido
          </p>
        </div>
        
        {lancamentos.map((lancamento, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 mb-3 items-end">
            <div className="col-span-2">
              <Label className="text-xs">{lancamento.tipo === 'debito' ? 'Débito' : 'Crédito'}</Label>
              <div className="h-10 flex items-center">
                {lancamento.tipo === 'debito' ? (
                  <div className="bg-blue-100 text-blue-700 font-medium px-2 py-1 rounded text-xs">DÉBITO</div>
                ) : (
                  <div className="bg-green-100 text-green-700 font-medium px-2 py-1 rounded text-xs">CRÉDITO</div>
                )}
              </div>
            </div>
            
            <div className="col-span-6">
              <Label className="text-xs" htmlFor={`conta-${index}`}>Conta</Label>
              <Select
                value={lancamento.conta}
                onValueChange={(value) => atualizarLancamento(index, 'conta', value)}
              >
                <SelectTrigger id={`conta-${index}`}>
                  <SelectValue placeholder="Selecione a conta" />
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
            
            <div className="col-span-3">
              <Label className="text-xs" htmlFor={`valor-${index}`}>Valor</Label>
              <Input
                id={`valor-${index}`}
                type="number"
                step="0.01"
                min="0.01"
                value={lancamento.valor}
                onChange={(e) => atualizarLancamento(index, 'valor', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div className="col-span-1 flex justify-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-700"
                onClick={() => removerLancamento(index)}
              >
                <Minus size={16} />
              </Button>
            </div>
          </div>
        ))}
        
        <div className="border-t pt-3 mt-3 grid grid-cols-2 gap-4">
          <div className="text-right">
            <span className="text-sm font-medium">Total Débitos:</span>
            <div className={`text-lg font-bold ${!isTotalIgual ? 'text-red-500' : ''}`}>
              R$ {totalDebito.toFixed(2)}
            </div>
          </div>
          
          <div className="text-right">
            <span className="text-sm font-medium">Total Créditos:</span>
            <div className={`text-lg font-bold ${!isTotalIgual ? 'text-red-500' : ''}`}>
              R$ {totalCredito.toFixed(2)}
            </div>
          </div>
        </div>
        
        {!isTotalIgual && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            <span className="font-medium">Diferença:</span> R$ {diferenca.toFixed(2)} - Os valores de débito e crédito devem ser iguais.
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!isTotalIgual}>
          Registrar Lançamento
        </Button>
      </div>
    </form>
  );
};

export default LancamentoContabilForm;
