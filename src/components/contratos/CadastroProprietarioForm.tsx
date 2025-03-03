import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ProprietarioData {
  nome: string;
  documento: string;
  dadosBancarios: {
    banco: string;
    agencia: string;
    conta: string;
    tipoConta: 'corrente' | 'poupanca';
    pix?: string;
  };
}

interface CadastroProprietarioFormProps {
  onSave: (data: ProprietarioData) => void;
  onCancel: () => void;
}

const CadastroProprietarioForm: React.FC<CadastroProprietarioFormProps> = ({
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<ProprietarioData>({
    nome: '',
    documento: '',
    dadosBancarios: {
      banco: '',
      agencia: '',
      conta: '',
      tipoConta: 'corrente',
      pix: ''
    }
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('banco.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        dadosBancarios: {
          ...prev.dadosBancarios,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.Event) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Verificar se o proprietário já existe
      const { data, error } = await supabase.rpc('check_proprietario_exists', {
        nome_proprietario: formData.nome
      });
      
      // Corrigindo o tipo do retorno da função RPC
      const result = data as { exists: boolean };
      
      if (error) {
        console.error('Erro ao verificar proprietário:', error);
        toast.error('Erro ao verificar se o proprietário já existe');
        setLoading(false);
        return;
      }
      
      if (result && result.exists) {
        toast.error('Este proprietário já está cadastrado');
        setLoading(false);
        return;
      }
      
      // Inserir novo proprietário
      const { error: insertError } = await supabase
        .from('Proprietarios')
        .insert({
          nome: formData.nome,
          documento: formData.documento,
          dados_bancarios: JSON.stringify(formData.dadosBancarios)
        });
        
      if (insertError) {
        console.error('Erro ao cadastrar proprietário:', insertError);
        toast.error('Erro ao cadastrar proprietário');
        setLoading(false);
        return;
      }
      
      toast.success('Proprietário cadastrado com sucesso!');
      onSave(formData);
    } catch (error) {
      console.error('Erro ao processar cadastro:', error);
      toast.error('Ocorreu um erro ao processar o cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nome">Nome</Label>
        <Input
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="documento">Documento (CPF/CNPJ)</Label>
        <Input
          id="documento"
          name="documento"
          value={formData.documento}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="banco">Banco</Label>
        <Input
          id="banco"
          name="banco.banco"
          value={formData.dadosBancarios.banco}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="agencia">Agência</Label>
          <Input
            id="agencia"
            name="banco.agencia"
            value={formData.dadosBancarios.agencia}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="conta">Conta</Label>
          <Input
            id="conta"
            name="banco.conta"
            value={formData.dadosBancarios.conta}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="tipoConta">Tipo de Conta</Label>
        <select
          id="tipoConta"
          name="banco.tipoConta"
          value={formData.dadosBancarios.tipoConta}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setFormData(prev => ({
              ...prev,
              dadosBancarios: {
                ...prev.dadosBancarios,
                tipoConta: e.target.value as 'corrente' | 'poupanca'
              }
            }));
          }}
          className="w-full px-3 py-2 border rounded-md"
          required
        >
          <option value="corrente">Corrente</option>
          <option value="poupanca">Poupança</option>
        </select>
      </div>
      
      <div>
        <Label htmlFor="pix">Chave PIX (Opcional)</Label>
        <Input
          id="pix"
          name="banco.pix"
          value={formData.dadosBancarios.pix || ''}
          onChange={handleChange}
        />
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Proprietário'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default CadastroProprietarioForm;
