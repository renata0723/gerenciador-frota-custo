
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CadastroMotoristaFormProps {
  onSave: (data: { nome: string; cpf: string }) => void;
  onCancel: () => void;
}

const CadastroMotoristaForm: React.FC<CadastroMotoristaFormProps> = ({ 
  onSave, 
  onCancel 
}) => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [carregando, setCarregando] = useState(false);

  const validarCPF = (cpf: string) => {
    // Remover caracteres especiais
    const cpfLimpo = cpf.replace(/[^\d]/g, '');
    
    // Verificar se tem 11 dígitos
    if (cpfLimpo.length !== 11) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpfLimpo)) return false;
    
    // Para uma validação completa seria necessário o algoritmo de validação do CPF,
    // mas para simplicidade, vamos apenas verificar o formato
    return cpfLimpo.length === 11;
  };

  const formatarCPF = (cpf: string) => {
    const cpfLimpo = cpf.replace(/[^\d]/g, '');
    
    if (cpfLimpo.length <= 3) {
      return cpfLimpo;
    } else if (cpfLimpo.length <= 6) {
      return `${cpfLimpo.slice(0, 3)}.${cpfLimpo.slice(3)}`;
    } else if (cpfLimpo.length <= 9) {
      return `${cpfLimpo.slice(0, 3)}.${cpfLimpo.slice(3, 6)}.${cpfLimpo.slice(6)}`;
    } else {
      return `${cpfLimpo.slice(0, 3)}.${cpfLimpo.slice(3, 6)}.${cpfLimpo.slice(6, 9)}-${cpfLimpo.slice(9, 11)}`;
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatarCPF(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    try {
      // Validações básicas
      if (!nome.trim()) {
        toast.error('O nome do motorista é obrigatório');
        setCarregando(false);
        return;
      }

      if (cpf && !validarCPF(cpf)) {
        toast.error('CPF inválido. Formato esperado: 000.000.000-00');
        setCarregando(false);
        return;
      }

      // Verificar se o motorista já existe
      const { data: motoristaExistente, error: errorVerificacao } = await supabase
        .from('Motoristas')
        .select('*')
        .eq('nome', nome);

      if (errorVerificacao) {
        console.error('Erro ao verificar motorista:', errorVerificacao);
        toast.error('Erro ao verificar motorista no sistema');
        setCarregando(false);
        return;
      }

      if (motoristaExistente && motoristaExistente.length > 0) {
        toast.error('Este motorista já está cadastrado no sistema');
        setCarregando(false);
        return;
      }

      // Inserir o motorista
      const { error } = await supabase
        .from('Motoristas')
        .insert({
          nome: nome,
          cpf: cpf || null,
          tipo_cadastro: 'simples',
          status: 'active'
        });

      if (error) {
        console.error('Erro ao cadastrar motorista:', error);
        toast.error('Erro ao cadastrar motorista');
        setCarregando(false);
        return;
      }

      toast.success('Motorista cadastrado com sucesso!');
      onSave({ nome, cpf });
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
        <Label htmlFor="nome">Nome do Motorista *</Label>
        <Input
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome completo"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="cpf">CPF (opcional)</Label>
        <Input
          id="cpf"
          value={cpf}
          onChange={handleCPFChange}
          placeholder="000.000.000-00"
        />
      </div>
      
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
