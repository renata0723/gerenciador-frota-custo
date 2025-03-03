
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export interface MotoristaData {
  nome: string;
  cpf: string;
  cnh: string;
  categoriaCnh: string;
  vencimentoCnh: string;
  telefone: string;
  endereco: string;
  dataNascimento: string;
  dataContratacao: string;
  status: 'active' | 'inactive';
  tipo: 'frota' | 'parceiro';
  proprietarioVinculado?: string;
  observacoes: string;
  tipoCadastro: 'simples' | 'completo';
}

interface MotoristaFormProps {
  onSave: (data: MotoristaData) => void;
  onCancel: () => void;
  initialData?: Partial<MotoristaData>;
}

// Interface para proprietários
interface Proprietario {
  nome: string;
}

const MotoristaForm: React.FC<MotoristaFormProps> = ({
  onSave,
  onCancel,
  initialData
}) => {
  const [formData, setFormData] = useState<MotoristaData>({
    nome: initialData?.nome || '',
    cpf: initialData?.cpf || '',
    cnh: initialData?.cnh || '',
    categoriaCnh: initialData?.categoriaCnh || 'E',
    vencimentoCnh: initialData?.vencimentoCnh || '',
    telefone: initialData?.telefone || '',
    endereco: initialData?.endereco || '',
    dataNascimento: initialData?.dataNascimento || '',
    dataContratacao: initialData?.dataContratacao || '',
    status: initialData?.status || 'active',
    tipo: initialData?.tipo || 'frota',
    proprietarioVinculado: initialData?.proprietarioVinculado || '',
    observacoes: initialData?.observacoes || '',
    tipoCadastro: 'simples'
  });

  const [tipoFormulario, setTipoFormulario] = useState<'simples' | 'completo'>('simples');
  const [loading, setLoading] = useState(false);
  const [proprietarios, setProprietarios] = useState<Proprietario[]>([]);
  const [carregandoProprietarios, setCarregandoProprietarios] = useState(false);

  // Carregar proprietários quando o tipo for 'parceiro'
  useEffect(() => {
    if (formData.tipo === 'parceiro') {
      carregarProprietarios();
    }
  }, [formData.tipo]);

  const carregarProprietarios = async () => {
    setCarregandoProprietarios(true);
    try {
      // Usando função SQL personalizada para evitar erros de tipo
      const { data, error } = await supabase
        .from('Proprietarios')
        .select('nome');
      
      if (error) {
        console.error('Erro ao carregar proprietários:', error);
        
        // Mock data para desenvolvimento
        setProprietarios([
          { nome: 'Transportadora Silva' },
          { nome: 'Logística Expressa' },
          { nome: 'Transportes Rápidos' }
        ]);
      } else if (data) {
        setProprietarios(data);
      }
    } catch (error) {
      console.error('Erro ao processar proprietários:', error);
      // Mock data como último recurso
      setProprietarios([
        { nome: 'Transportadora Silva' },
        { nome: 'Logística Expressa' },
        { nome: 'Transportes Rápidos' }
      ]);
    } finally {
      setCarregandoProprietarios(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: keyof MotoristaData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Validação básica
    if (!formData.nome || !formData.cpf) {
      toast.error('Nome e CPF são campos obrigatórios');
      setLoading(false);
      return;
    }
    
    if (tipoFormulario === 'completo' && (!formData.cnh || !formData.vencimentoCnh)) {
      toast.error('CNH e data de vencimento são obrigatórios no cadastro completo');
      setLoading(false);
      return;
    }

    // Atualizar o tipo de cadastro
    const motoristaDados = {
      ...formData,
      tipoCadastro: tipoFormulario
    };
    
    try {
      // Verificar se o motorista já existe
      const { data: existingMotorista, error: checkError } = await supabase
        .from('Motoristas')
        .select('*')
        .eq('cpf', formData.cpf)
        .maybeSingle();
        
      if (checkError && checkError.code !== 'PGRST116') {
        toast.error('Erro ao verificar CPF existente');
        console.error(checkError);
        setLoading(false);
        return;
      }
      
      if (existingMotorista) {
        toast.error('Este CPF já está cadastrado no sistema');
        setLoading(false);
        return;
      }
      
      // Inserir novo motorista
      const { error } = await supabase
        .from('Motoristas')
        .insert({
          nome: motoristaDados.nome,
          cpf: motoristaDados.cpf,
          cnh: motoristaDados.cnh,
          categoria_cnh: motoristaDados.categoriaCnh,
          vencimento_cnh: motoristaDados.vencimentoCnh ? new Date(motoristaDados.vencimentoCnh).toISOString() : null,
          telefone: motoristaDados.telefone,
          endereco: motoristaDados.endereco,
          data_nascimento: motoristaDados.dataNascimento ? new Date(motoristaDados.dataNascimento).toISOString() : null,
          data_contratacao: motoristaDados.dataContratacao ? new Date(motoristaDados.dataContratacao).toISOString() : null,
          status: motoristaDados.status,
          tipo: motoristaDados.tipo,
          proprietario_vinculado: motoristaDados.tipo === 'parceiro' ? motoristaDados.proprietarioVinculado : null,
          observacoes: motoristaDados.observacoes,
          tipo_cadastro: motoristaDados.tipoCadastro
        });
        
      if (error) {
        toast.error('Erro ao cadastrar motorista');
        console.error(error);
        setLoading(false);
        return;
      }
      
      toast.success('Motorista cadastrado com sucesso!');
      onSave(motoristaDados);
    } catch (error) {
      console.error('Erro ao processar:', error);
      toast.error('Ocorreu um erro ao processar o cadastro');
    } finally {
      setLoading(false);
    }
  };

  // Formatação de CPF
  const formatarCPF = (cpf: string) => {
    // Remove caracteres não numéricos
    const numerosApenas = cpf.replace(/\D/g, '');
    
    if (numerosApenas.length <= 3) {
      return numerosApenas;
    } else if (numerosApenas.length <= 6) {
      return `${numerosApenas.slice(0, 3)}.${numerosApenas.slice(3)}`;
    } else if (numerosApenas.length <= 9) {
      return `${numerosApenas.slice(0, 3)}.${numerosApenas.slice(3, 6)}.${numerosApenas.slice(6)}`;
    } else {
      return `${numerosApenas.slice(0, 3)}.${numerosApenas.slice(3, 6)}.${numerosApenas.slice(6, 9)}-${numerosApenas.slice(9, 11)}`;
    }
  };

  // Handler para formatar o CPF quando o usuário digitar
  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCPF = formatarCPF(e.target.value);
    setFormData(prev => ({
      ...prev,
      cpf: formattedCPF
    }));
  };

  return (
    <div className="space-y-4">
      <Tabs 
        defaultValue="simples" 
        value={tipoFormulario} 
        onValueChange={(value) => setTipoFormulario(value as 'simples' | 'completo')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="simples">Cadastro Simples</TabsTrigger>
          <TabsTrigger value="completo">Cadastro Completo</TabsTrigger>
        </TabsList>
        
        <form onSubmit={handleSubmit}>
          <TabsContent value="simples" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleCPFChange}
                  placeholder="000.000.000-00"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Tipo de Motorista *</Label>
                <RadioGroup 
                  value={formData.tipo} 
                  onValueChange={(value) => handleSelectChange('tipo', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="frota" id="tipo-frota" />
                    <Label htmlFor="tipo-frota" className="cursor-pointer">Frota Própria</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="parceiro" id="tipo-parceiro" />
                    <Label htmlFor="tipo-parceiro" className="cursor-pointer">Terceirizado</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {formData.tipo === 'parceiro' && (
                <div>
                  <Label htmlFor="proprietarioVinculado">Proprietário Vinculado *</Label>
                  <Select 
                    value={formData.proprietarioVinculado} 
                    onValueChange={(value) => handleSelectChange('proprietarioVinculado', value)}
                    disabled={carregandoProprietarios}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={carregandoProprietarios ? "Carregando..." : "Selecione o proprietário"} />
                    </SelectTrigger>
                    <SelectContent>
                      {proprietarios.map(prop => (
                        <SelectItem key={prop.nome} value={prop.nome}>{prop.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="completo" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleCPFChange}
                  placeholder="000.000.000-00"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="cnh">CNH *</Label>
                <Input
                  id="cnh"
                  name="cnh"
                  value={formData.cnh}
                  onChange={handleChange}
                  required={tipoFormulario === 'completo'}
                />
              </div>
              
              <div>
                <Label htmlFor="categoriaCnh">Categoria CNH *</Label>
                <Select 
                  value={formData.categoriaCnh} 
                  onValueChange={(value) => handleSelectChange('categoriaCnh', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                    <SelectItem value="AB">AB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="vencimentoCnh">Vencimento CNH *</Label>
                <Input
                  id="vencimentoCnh"
                  name="vencimentoCnh"
                  type="date"
                  value={formData.vencimentoCnh}
                  onChange={handleChange}
                  required={tipoFormulario === 'completo'}
                />
              </div>
              
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                />
              </div>
              
              <div>
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  name="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <Label htmlFor="dataContratacao">Data de Contratação</Label>
                <Input
                  id="dataContratacao"
                  name="dataContratacao"
                  type="date"
                  value={formData.dataContratacao}
                  onChange={handleChange}
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="endereco">Endereço Completo</Label>
                <Input
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Tipo de Motorista *</Label>
                <RadioGroup 
                  value={formData.tipo} 
                  onValueChange={(value) => handleSelectChange('tipo', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="frota" id="tipo-frota-completo" />
                    <Label htmlFor="tipo-frota-completo" className="cursor-pointer">Frota Própria</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="parceiro" id="tipo-parceiro-completo" />
                    <Label htmlFor="tipo-parceiro-completo" className="cursor-pointer">Terceirizado</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {formData.tipo === 'parceiro' && (
                <div>
                  <Label htmlFor="proprietarioVinculado">Proprietário Vinculado *</Label>
                  <Select 
                    value={formData.proprietarioVinculado} 
                    onValueChange={(value) => handleSelectChange('proprietarioVinculado', value)}
                    disabled={carregandoProprietarios}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={carregandoProprietarios ? "Carregando..." : "Selecione o proprietário"} />
                    </SelectTrigger>
                    <SelectContent>
                      {proprietarios.map(prop => (
                        <SelectItem key={prop.nome} value={prop.nome}>{prop.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange('status', value as 'active' | 'inactive')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  name="observacoes"
                  rows={3}
                  value={formData.observacoes}
                  onChange={handleChange}
                />
              </div>
            </div>
          </TabsContent>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : tipoFormulario === 'simples' ? 'Salvar Cadastro Simples' : 'Salvar Cadastro Completo'}
            </Button>
          </DialogFooter>
        </form>
      </Tabs>
    </div>
  );
};

export default MotoristaForm;
