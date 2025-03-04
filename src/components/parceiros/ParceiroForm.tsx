
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ParceiroInfo } from '@/types/saldoPagar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ParceiroFormProps {
  initialData?: Partial<ParceiroInfo>;
  onSave: (data: ParceiroInfo) => void;
}

const tiposConta = [
  { value: 'corrente', label: 'Conta Corrente' },
  { value: 'poupanca', label: 'Conta Poupança' }
];

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

const ParceiroForm: React.FC<ParceiroFormProps> = ({ initialData, onSave }) => {
  const [formData, setFormData] = useState<ParceiroInfo>({
    nome: initialData?.nome || '',
    documento: initialData?.documento || '',
    dados_bancarios: initialData?.dados_bancarios || {
      banco: '',
      agencia: '',
      conta: '',
      tipo_conta: 'corrente',
      pix: ''
    }
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleBancoChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      dados_bancarios: {
        ...prev.dados_bancarios!,
        [name]: value
      }
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!formData.nome) {
        throw new Error('O nome do parceiro é obrigatório');
      }
      
      if (!formData.documento) {
        throw new Error('O documento (CPF/CNPJ) é obrigatório');
      }
      
      // Verificar se o parceiro já existe
      const { data: existingData, error: checkError } = await supabase
        .from('Proprietarios')
        .select('*')
        .eq('nome', formData.nome)
        .single();
        
      if (existingData && !initialData?.id) {
        toast.error('Este parceiro já está cadastrado');
        return;
      }
      
      // Salvar ou atualizar o parceiro
      const dadosBancariosJSON = formData.dados_bancarios 
        ? JSON.stringify(formData.dados_bancarios)
        : null;
        
      if (initialData?.id) {
        // Atualizar
        const { error } = await supabase
          .from('Proprietarios')
          .update({
            nome: formData.nome,
            documento: formData.documento,
            dados_bancarios: dadosBancariosJSON
          })
          .eq('id', initialData.id);
          
        if (error) throw error;
        
        toast.success('Parceiro atualizado com sucesso!');
      } else {
        // Criar novo
        const { data, error } = await supabase
          .from('Proprietarios')
          .insert({
            nome: formData.nome,
            documento: formData.documento,
            dados_bancarios: dadosBancariosJSON
          })
          .select();
          
        if (error) throw error;
        
        formData.id = data?.[0]?.id;
        toast.success('Parceiro cadastrado com sucesso!');
      }
      
      onSave(formData);
    } catch (error: any) {
      console.error('Erro ao salvar parceiro:', error);
      toast.error(error.message || 'Erro ao salvar dados do parceiro');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="nome">Nome do Parceiro</Label>
            <Input
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Nome completo ou razão social"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="documento">CPF/CNPJ</Label>
            <Input
              id="documento"
              name="documento"
              value={formData.documento}
              onChange={handleChange}
              placeholder="Digite apenas os números"
              required
            />
          </div>
        </div>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-base">Dados Bancários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="banco">Banco</Label>
                <Select
                  value={formData.dados_bancarios?.banco || ''}
                  onValueChange={(value) => handleBancoChange('banco', value)}
                >
                  <SelectTrigger id="banco">
                    <SelectValue placeholder="Selecione o banco" />
                  </SelectTrigger>
                  <SelectContent>
                    {bancos.map(banco => (
                      <SelectItem key={banco} value={banco}>{banco}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="agencia">Agência</Label>
                <Input
                  id="agencia"
                  value={formData.dados_bancarios?.agencia || ''}
                  onChange={(e) => handleBancoChange('agencia', e.target.value)}
                  placeholder="Número da agência"
                />
              </div>
              
              <div>
                <Label htmlFor="conta">Conta</Label>
                <Input
                  id="conta"
                  value={formData.dados_bancarios?.conta || ''}
                  onChange={(e) => handleBancoChange('conta', e.target.value)}
                  placeholder="Número da conta com dígito"
                />
              </div>
              
              <div>
                <Label htmlFor="tipo_conta">Tipo de Conta</Label>
                <Select
                  value={formData.dados_bancarios?.tipo_conta || 'corrente'}
                  onValueChange={(value) => handleBancoChange('tipo_conta', value)}
                >
                  <SelectTrigger id="tipo_conta">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposConta.map(tipo => (
                      <SelectItem key={tipo.value} value={tipo.value}>{tipo.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="pix">Chave PIX (opcional)</Label>
                <Input
                  id="pix"
                  value={formData.dados_bancarios?.pix || ''}
                  onChange={(e) => handleBancoChange('pix', e.target.value)}
                  placeholder="Chave PIX (CPF, E-mail, Telefone ou Chave Aleatória)"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : initialData?.id ? 'Atualizar Parceiro' : 'Cadastrar Parceiro'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ParceiroForm;
