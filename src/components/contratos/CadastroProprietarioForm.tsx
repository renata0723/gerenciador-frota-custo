
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface ProprietarioData {
  nome: string;
  documento: string;
  dadosBancarios: {
    banco: string;
    agencia: string;
    conta: string;
    tipoConta: 'corrente' | 'poupanca';
  };
}

interface CadastroProprietarioFormProps {
  onSave: (data: ProprietarioData) => void;
  onCancel: () => void;
}

const CadastroProprietarioForm: React.FC<CadastroProprietarioFormProps> = ({ onSave, onCancel }) => {
  const [nome, setNome] = useState('');
  const [documento, setDocumento] = useState('');
  const [banco, setBanco] = useState('');
  const [agencia, setAgencia] = useState('');
  const [conta, setConta] = useState('');
  const [tipoConta, setTipoConta] = useState<'corrente' | 'poupanca'>('corrente');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome) {
      toast.error('Nome do proprietário é obrigatório');
      return;
    }
    
    setCarregando(true);

    try {
      // Montar objeto de dados bancários
      const dadosBancarios = {
        banco,
        agencia,
        conta,
        tipoConta
      };
      
      // Verificar se o proprietário já existe
      const { data: proprietarioExistente, error: errorVerificacao } = await supabase
        .from('Proprietarios')
        .select('*')
        .eq('nome', nome);

      if (errorVerificacao) {
        console.error('Erro ao verificar proprietário:', errorVerificacao);
        toast.error('Erro ao verificar cadastro de proprietário');
        return;
      }

      if (proprietarioExistente && proprietarioExistente.length > 0) {
        toast.error('Este proprietário já está cadastrado no sistema');
        return;
      }

      // Inserir novo proprietário
      const { error } = await supabase
        .from('Proprietarios')
        .insert({
          nome,
          documento,
          dados_bancarios: JSON.stringify(dadosBancarios)
        });

      if (error) {
        console.error('Erro ao cadastrar proprietário:', error);
        toast.error('Erro ao cadastrar proprietário');
        return;
      }

      // Retornar dados para o componente pai
      const proprietarioData: ProprietarioData = {
        nome,
        documento,
        dadosBancarios: {
          banco,
          agencia,
          conta,
          tipoConta
        }
      };
      
      toast.success('Proprietário cadastrado com sucesso!');
      onSave(proprietarioData);
      
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Ocorreu um erro ao processar a solicitação');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome do Proprietário *</Label>
        <Input
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome completo do proprietário"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="documento">CPF/CNPJ</Label>
        <Input
          id="documento"
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
          placeholder="CPF ou CNPJ do proprietário"
        />
      </div>
      
      <div className="border-t pt-4 mt-4">
        <h3 className="font-medium mb-2">Dados Bancários</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="banco">Banco</Label>
            <Input
              id="banco"
              value={banco}
              onChange={(e) => setBanco(e.target.value)}
              placeholder="Nome do banco"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="agencia">Agência</Label>
              <Input
                id="agencia"
                value={agencia}
                onChange={(e) => setAgencia(e.target.value)}
                placeholder="Número da agência"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="conta">Conta</Label>
              <Input
                id="conta"
                value={conta}
                onChange={(e) => setConta(e.target.value)}
                placeholder="Número da conta"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tipoConta">Tipo de Conta</Label>
            <Select 
              value={tipoConta} 
              onValueChange={(value) => setTipoConta(value as 'corrente' | 'poupanca')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de conta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="corrente">Conta Corrente</SelectItem>
                <SelectItem value="poupanca">Conta Poupança</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={carregando}>
          {carregando ? 'Processando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  );
};

export default CadastroProprietarioForm;
