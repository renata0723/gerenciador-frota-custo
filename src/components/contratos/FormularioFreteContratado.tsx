
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { ProprietarioData } from './CadastroProprietarioForm';

export interface FreteContratadoData {
  valorFreteContratado: number;
  valorAdiantamento: number;
  valorPedagio: number;
  saldoPagar: number;
  observacoes: string;
  gerarSaldoPagar: boolean;
  proprietarioInfo: ProprietarioData | null;
}

interface FormularioFreteContratadoProps {
  onSubmit: (data: FreteContratadoData) => void;
  onBack: () => void;
  onNext: () => void;
  initialData?: FreteContratadoData;
  dadosContrato?: any; // Recebe os dados do contrato com informações do proprietário e placas
}

export const FormularioFreteContratado: React.FC<FormularioFreteContratadoProps> = ({
  onSubmit,
  onBack,
  onNext,
  initialData,
  dadosContrato
}) => {
  const [formData, setFormData] = useState<FreteContratadoData>(
    initialData || {
      valorFreteContratado: 0,
      valorAdiantamento: 0,
      valorPedagio: 0,
      saldoPagar: 0,
      observacoes: '',
      gerarSaldoPagar: false,
      proprietarioInfo: null
    }
  );

  // Carregar informações do proprietário quando o componente montar ou quando dadosContrato mudar
  useEffect(() => {
    if (dadosContrato && dadosContrato.tipo === 'terceiro' && dadosContrato.proprietario) {
      // Se o proprietário já tiver informações detalhadas no dadosContrato, use-as
      if (dadosContrato.proprietarioInfo) {
        setFormData(prev => ({
          ...prev,
          proprietarioInfo: dadosContrato.proprietarioInfo as ProprietarioData,
          gerarSaldoPagar: true
        }));
      } else {
        // Simulação de busca de dados do proprietário se não estiver disponível
        const proprietarioInfo: ProprietarioData = {
          nome: dadosContrato.proprietario,
          documento: 'Documento do proprietário', // Simulado
          dadosBancarios: {
            banco: 'Banco do proprietário',
            agencia: '1234',
            conta: '56789-0',
            tipoConta: 'corrente'
          }
        };
        
        setFormData(prev => ({
          ...prev,
          proprietarioInfo: proprietarioInfo,
          gerarSaldoPagar: true
        }));
      }
    }
  }, [dadosContrato]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      const numValue = parseFloat(value);
      
      setFormData(prev => {
        const newData = {
          ...prev,
          [name]: isNaN(numValue) ? 0 : numValue
        };
        
        // Recalcular o saldo a pagar automaticamente
        if (name === 'valorFreteContratado' || name === 'valorAdiantamento' || name === 'valorPedagio') {
          newData.saldoPagar = newData.valorFreteContratado - newData.valorAdiantamento - newData.valorPedagio;
        }
        
        return newData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.valorFreteContratado <= 0) {
      toast.error('O valor do frete contratado deve ser maior que zero');
      return;
    }
    
    // Se for frete terceirizado e estiver marcado para gerar saldo a pagar
    if (dadosContrato?.tipo === 'terceiro' && formData.gerarSaldoPagar) {
      if (!formData.proprietarioInfo) {
        toast.error('Informações do proprietário são necessárias para gerar saldo a pagar');
        return;
      }
      
      // Aqui você poderia adicionar lógica para gerar o saldo a pagar
      // Esta lógica seria implementada no componente pai ou em um serviço
      console.log('Gerando saldo a pagar para o proprietário:', formData.proprietarioInfo.nome);
      toast.success(`Saldo a pagar será gerado para ${formData.proprietarioInfo.nome}`);
    }
    
    onSubmit(formData);
    onNext();
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Frete Contratado</h2>
      
      {dadosContrato && (
        <div className="text-sm text-gray-600 mb-4">
          <p><strong>Contrato:</strong> {dadosContrato.idContrato}</p>
          <p><strong>Tipo:</strong> {dadosContrato.tipo === 'frota' ? 'Frota Própria' : 'Terceirizado'}</p>
          <p><strong>Placa do Cavalo:</strong> {dadosContrato.placaCavalo}</p>
          {dadosContrato.proprietario && (
            <p><strong>Proprietário:</strong> {dadosContrato.proprietario}</p>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="valorFreteContratado">Valor do Frete Contratado (R$) *</Label>
            <Input
              id="valorFreteContratado"
              name="valorFreteContratado"
              type="number"
              step="0.01"
              min="0"
              value={formData.valorFreteContratado || ''}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="valorAdiantamento">Valor do Adiantamento (R$)</Label>
            <Input
              id="valorAdiantamento"
              name="valorAdiantamento"
              type="number"
              step="0.01"
              min="0"
              value={formData.valorAdiantamento || ''}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="valorPedagio">Valor do Pedágio (R$)</Label>
            <Input
              id="valorPedagio"
              name="valorPedagio"
              type="number"
              step="0.01"
              min="0"
              value={formData.valorPedagio || ''}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="saldoPagar">Saldo a Pagar (R$)</Label>
            <Input
              id="saldoPagar"
              name="saldoPagar"
              type="number"
              step="0.01"
              value={formData.saldoPagar || ''}
              readOnly
              className="bg-gray-100"
            />
          </div>
        </div>
        
        {dadosContrato?.tipo === 'terceiro' && (
          <Card className="p-4 mt-4">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="gerarSaldoPagar"
                name="gerarSaldoPagar"
                checked={formData.gerarSaldoPagar}
                onChange={handleCheckboxChange}
                className="mr-2 h-4 w-4"
              />
              <Label htmlFor="gerarSaldoPagar" className="cursor-pointer">
                Gerar saldo a pagar no sistema para o proprietário
              </Label>
            </div>
            
            {formData.gerarSaldoPagar && formData.proprietarioInfo && (
              <div className="space-y-3">
                <h3 className="font-medium text-sm">Dados do Proprietário</h3>
                <p className="text-sm"><strong>Nome:</strong> {formData.proprietarioInfo.nome}</p>
                <p className="text-sm"><strong>Documento:</strong> {formData.proprietarioInfo.documento}</p>
                
                <h3 className="font-medium text-sm mt-3">Dados Bancários</h3>
                <p className="text-sm"><strong>Banco:</strong> {formData.proprietarioInfo.dadosBancarios.banco}</p>
                <p className="text-sm"><strong>Agência:</strong> {formData.proprietarioInfo.dadosBancarios.agencia}</p>
                <p className="text-sm"><strong>Conta:</strong> {formData.proprietarioInfo.dadosBancarios.conta}</p>
                <p className="text-sm"><strong>Tipo de Conta:</strong> {formData.proprietarioInfo.dadosBancarios.tipoConta === 'corrente' ? 'Conta Corrente' : 'Conta Poupança'}</p>
              </div>
            )}
          </Card>
        )}
        
        <div>
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea
            id="observacoes"
            name="observacoes"
            value={formData.observacoes}
            onChange={handleChange}
            rows={3}
          />
        </div>
        
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Voltar
          </Button>
          <Button type="submit">
            Próximo
          </Button>
        </div>
      </form>
    </div>
  );
};
