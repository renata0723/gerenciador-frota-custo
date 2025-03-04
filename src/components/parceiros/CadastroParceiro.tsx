
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ParceiroInfo, DadosBancarios } from '@/types/saldoPagar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CadastroParceiroProps {
  onSave: (parceiro: ParceiroInfo) => void;
  onCancel: () => void;
  initialData?: Partial<ParceiroInfo>;
}

const CadastroParceiro: React.FC<CadastroParceiroProps> = ({ onSave, onCancel, initialData }) => {
  const [nome, setNome] = useState(initialData?.nome || '');
  const [documento, setDocumento] = useState(initialData?.documento || '');
  const [banco, setBanco] = useState('');
  const [agencia, setAgencia] = useState('');
  const [conta, setConta] = useState('');
  const [tipoConta, setTipoConta] = useState('corrente');
  const [pix, setPix] = useState('');
  const [activeTab, setActiveTab] = useState('dados');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome) {
      toast.error('O nome do parceiro é obrigatório');
      return;
    }

    setCarregando(true);

    try {
      const dadosBancarios: DadosBancarios = {
        banco,
        agencia,
        conta,
        tipo_conta: tipoConta,
        pix
      };

      // Se temos dados iniciais, é uma edição, senão é um novo cadastro
      if (initialData && initialData.id) {
        const { error } = await supabase
          .from('Proprietarios')
          .update({
            nome,
            documento,
            dados_bancarios: JSON.stringify(dadosBancarios)
          })
          .eq('id', initialData.id);

        if (error) throw error;
        toast.success('Parceiro atualizado com sucesso');
      } else {
        // Verificar se já existe um parceiro com o mesmo nome
        const { data: existingPartner } = await supabase
          .from('Proprietarios')
          .select('*')
          .eq('nome', nome)
          .maybeSingle();

        if (existingPartner) {
          toast.error('Já existe um parceiro com este nome');
          setCarregando(false);
          return;
        }

        const { data, error } = await supabase
          .from('Proprietarios')
          .insert({
            nome,
            documento,
            dados_bancarios: JSON.stringify(dadosBancarios)
          })
          .select();

        if (error) throw error;
        toast.success('Parceiro cadastrado com sucesso');
        onSave(data[0] as ParceiroInfo);
      }
    } catch (error) {
      console.error('Erro ao salvar parceiro:', error);
      toast.error('Erro ao salvar parceiro. Por favor, tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  // Se temos dados iniciais e dados bancários, vamos carregar eles
  React.useEffect(() => {
    if (initialData && initialData.dadosBancarios) {
      if (typeof initialData.dadosBancarios === 'string') {
        try {
          const dadosBancariosObj = JSON.parse(initialData.dadosBancarios);
          setBanco(dadosBancariosObj.banco || '');
          setAgencia(dadosBancariosObj.agencia || '');
          setConta(dadosBancariosObj.conta || '');
          setTipoConta(dadosBancariosObj.tipo_conta || 'corrente');
          setPix(dadosBancariosObj.pix || '');
        } catch (e) {
          console.error('Erro ao fazer parse dos dados bancários:', e);
        }
      } else {
        const dadosBancariosObj = initialData.dadosBancarios as DadosBancarios;
        setBanco(dadosBancariosObj.banco || '');
        setAgencia(dadosBancariosObj.agencia || '');
        setConta(dadosBancariosObj.conta || '');
        setTipoConta(dadosBancariosObj.tipo_conta || 'corrente');
        setPix(dadosBancariosObj.pix || '');
      }
    }
  }, [initialData]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle>{initialData?.id ? 'Editar Parceiro' : 'Novo Parceiro'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dados">Dados do Parceiro</TabsTrigger>
            <TabsTrigger value="bancarios">Dados Bancários</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dados" className="pt-4 space-y-4">
            <div>
              <Label htmlFor="nome">Nome do Parceiro*</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome completo do parceiro"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="documento">CPF/CNPJ</Label>
              <Input
                id="documento"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                placeholder="CPF ou CNPJ do parceiro"
                className="mt-1"
              />
            </div>
            
            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button onClick={() => setActiveTab('bancarios')}>
                Próximo
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="bancarios" className="pt-4 space-y-4">
            <div>
              <Label htmlFor="banco">Banco</Label>
              <Input
                id="banco"
                value={banco}
                onChange={(e) => setBanco(e.target.value)}
                placeholder="Nome do banco"
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="agencia">Agência</Label>
                <Input
                  id="agencia"
                  value={agencia}
                  onChange={(e) => setAgencia(e.target.value)}
                  placeholder="Número da agência"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="conta">Conta</Label>
                <Input
                  id="conta"
                  value={conta}
                  onChange={(e) => setConta(e.target.value)}
                  placeholder="Número da conta"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="tipoConta">Tipo de Conta</Label>
              <Select value={tipoConta} onValueChange={setTipoConta}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione o tipo de conta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corrente">Conta Corrente</SelectItem>
                  <SelectItem value="poupanca">Conta Poupança</SelectItem>
                  <SelectItem value="salario">Conta Salário</SelectItem>
                  <SelectItem value="pagamento">Conta Pagamento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="pix">Chave PIX</Label>
              <Input
                id="pix"
                value={pix}
                onChange={(e) => setPix(e.target.value)}
                placeholder="Chave PIX (CPF, e-mail, telefone ou chave aleatória)"
                className="mt-1"
              />
            </div>
            
            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={() => setActiveTab('dados')}>
                Voltar
              </Button>
              <Button onClick={handleSubmit} disabled={carregando}>
                {carregando ? 'Salvando...' : (initialData?.id ? 'Atualizar' : 'Cadastrar')}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CadastroParceiro;
