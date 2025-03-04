
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { logOperation } from '@/utils/logOperations';
import { formatarCPF } from '@/utils/formatters';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CadastroMotoristaFormProps {
  onSave: (data: { 
    id: number;
    nome: string;
    cpf?: string;
    tipo_cadastro: 'simples' | 'completo';
  }) => void;
  onCancel: () => void;
}

const CadastroMotoristaForm: React.FC<CadastroMotoristaFormProps> = ({ 
  onSave, 
  onCancel
}) => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [tipoCadastro, setTipoCadastro] = useState<'simples' | 'completo'>('simples');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro(null);

    try {
      // Validar nome
      if (!nome.trim()) {
        setErro('Por favor, informe o nome do motorista');
        setCarregando(false);
        return;
      }

      // Se for cadastro completo, validar CPF
      if (tipoCadastro === 'completo' && !cpf.trim()) {
        setErro('Para cadastro completo, o CPF é obrigatório');
        setCarregando(false);
        return;
      }

      // Inserir o motorista
      const { data, error } = await supabase
        .from('Motoristas')
        .insert({
          nome: nome.trim(),
          cpf: cpf.trim() || null,
          tipo_cadastro: tipoCadastro,
          status: 'active',
          data_contratacao: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao cadastrar motorista:', error);
        setErro('Erro ao cadastrar motorista. Por favor, verifique as permissões ou tente novamente.');
        logOperation('Motoristas', 'Erro ao cadastrar motorista', 'false');
        setCarregando(false);
        return;
      }

      logOperation('Motoristas', 'Cadastro de motorista', 'true');
      toast.success('Motorista cadastrado com sucesso!');
      
      onSave({
        id: data.id,
        nome: data.nome,
        cpf: data.cpf,
        tipo_cadastro: data.tipo_cadastro as 'simples' | 'completo'
      });
    } catch (error) {
      console.error('Erro:', error);
      setErro('Ocorreu um erro ao processar a solicitação');
      toast.error('Ocorreu um erro ao processar a solicitação');
    } finally {
      setCarregando(false);
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remover tudo que não for número
    const onlyNums = e.target.value.replace(/\D/g, '');
    
    // Limitar a 11 dígitos
    const limitedCPF = onlyNums.slice(0, 11);
    
    // Formatar o CPF
    let formattedCPF = '';
    if (limitedCPF.length <= 3) {
      formattedCPF = limitedCPF;
    } else if (limitedCPF.length <= 6) {
      formattedCPF = `${limitedCPF.slice(0, 3)}.${limitedCPF.slice(3)}`;
    } else if (limitedCPF.length <= 9) {
      formattedCPF = `${limitedCPF.slice(0, 3)}.${limitedCPF.slice(3, 6)}.${limitedCPF.slice(6)}`;
    } else {
      formattedCPF = `${limitedCPF.slice(0, 3)}.${limitedCPF.slice(3, 6)}.${limitedCPF.slice(6, 9)}-${limitedCPF.slice(9)}`;
    }
    
    setCpf(formattedCPF);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      {erro && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{erro}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="nome">Nome do Motorista *</Label>
        <Input
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome completo do motorista"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label>Tipo de Cadastro *</Label>
        <Select 
          value={tipoCadastro} 
          onValueChange={(value) => setTipoCadastro(value as 'simples' | 'completo')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de cadastro" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="simples">Simples (apenas nome)</SelectItem>
            <SelectItem value="completo">Completo (com CPF)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {tipoCadastro === 'completo' && (
        <div className="space-y-2">
          <Label htmlFor="cpf">CPF *</Label>
          <Input
            id="cpf"
            value={cpf}
            onChange={handleCPFChange}
            placeholder="000.000.000-00"
            required={tipoCadastro === 'completo'}
          />
        </div>
      )}
      
      <div className="flex justify-end space-x-2 pt-2">
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

export default CadastroMotoristaForm;
