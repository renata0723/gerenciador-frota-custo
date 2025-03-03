
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface DadosBancarios {
  banco: string;
  agencia: string;
  conta: string;
  tipoConta: 'corrente' | 'poupanca';
}

export interface ProprietarioData {
  nome: string;
  documento: string;
  dadosBancarios: DadosBancarios;
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
  const [loading, setLoading] = useState(false);

  // Lista de bancos mais comuns no Brasil
  const bancos = [
    'Banco do Brasil',
    'Caixa Econômica Federal',
    'Bradesco',
    'Itaú',
    'Santander',
    'Nubank',
    'Inter',
    'Sicoob',
    'Sicredi',
    'Outro'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || !documento) {
      toast.error('Nome e documento são obrigatórios');
      return;
    }
    
    if (!banco || !agencia || !conta) {
      toast.error('Dados bancários completos são obrigatórios');
      return;
    }
    
    setLoading(true);
    
    try {
      // Verificar se o proprietário já existe
      const { data: existingOwner, error: checkError } = await supabase
        .from('Proprietarios')
        .select('*')
        .eq('nome', nome)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') {
        console.error(checkError);
        toast.error('Erro ao verificar cadastro existente');
        return;
      }
      
      if (existingOwner) {
        toast.error('Este proprietário já está cadastrado no sistema');
        return;
      }
      
      // Formatar dados bancários como JSON
      const dadosBancariosJSON = JSON.stringify({
        banco,
        agencia,
        conta,
        tipoConta
      });
      
      // Inserir novo proprietário
      const { error } = await supabase
        .from('Proprietarios')
        .insert({
          nome,
          documento,
          dados_bancarios: dadosBancariosJSON
        });
        
      if (error) {
        console.error(error);
        toast.error('Erro ao cadastrar proprietário');
        return;
      }
      
      toast.success('Proprietário cadastrado com sucesso!');
      
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
      
      onSave(proprietarioData);
    } catch (error) {
      console.error('Erro ao processar:', error);
      toast.error('Ocorreu um erro ao processar o cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nome">Nome do Proprietário *</Label>
        <Input
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="documento">CPF/CNPJ *</Label>
        <Input
          id="documento"
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
          placeholder="000.000.000-00 ou 00.000.000/0000-00"
          required
        />
      </div>
      
      <div className="pt-2">
        <h3 className="text-base font-medium mb-2">Dados Bancários</h3>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="banco">Banco *</Label>
            <Select
              value={banco}
              onValueChange={setBanco}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o banco" />
              </SelectTrigger>
              <SelectContent>
                {bancos.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="agencia">Agência *</Label>
              <Input
                id="agencia"
                value={agencia}
                onChange={(e) => setAgencia(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="conta">Conta *</Label>
              <Input
                id="conta"
                value={conta}
                onChange={(e) => setConta(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="tipoConta">Tipo de Conta *</Label>
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
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  );
};

export default CadastroProprietarioForm;
