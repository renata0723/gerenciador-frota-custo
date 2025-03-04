
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Textarea } from '@/components/ui/textarea';

interface CadastroMotoristaFormProps {
  onSave: (data: { 
    nome: string; 
    cpf: string; 
    tipo: 'frota' | 'terceiro';
    tipoCadastro?: 'simples' | 'completo';
    telefone?: string;
    dataNascimento?: Date | null;
    endereco?: string;
    cnh?: string;
    categoriaCNH?: string;
    vencimentoCNH?: Date | null;
    dataContratacao?: Date | null;
    proprietarioVinculado?: string;
    observacoes?: string;
  }) => void;
  onCancel: () => void;
  motorista?: { 
    id?: number; 
    nome?: string; 
    cpf?: string; 
    tipo?: 'frota' | 'terceiro';
    tipo_cadastro?: 'simples' | 'completo';
    telefone?: string;
    data_nascimento?: string;
    endereco?: string;
    cnh?: string;
    categoria_cnh?: string;
    vencimento_cnh?: string;
    data_contratacao?: string;
    proprietario_vinculado?: string;
    observacoes?: string;
  };
}

const CadastroMotoristaForm: React.FC<CadastroMotoristaFormProps> = ({ 
  onSave, 
  onCancel,
  motorista
}) => {
  const [activeTab, setActiveTab] = useState<'simples' | 'completo'>(
    motorista?.tipo_cadastro === 'completo' ? 'completo' : 'simples'
  );
  const [nome, setNome] = useState(motorista?.nome || '');
  const [cpf, setCpf] = useState(motorista?.cpf || '');
  const [tipo, setTipo] = useState<'frota' | 'terceiro'>(motorista?.tipo || 'frota');
  const [telefone, setTelefone] = useState(motorista?.telefone || '');
  const [dataNascimento, setDataNascimento] = useState<Date | null>(
    motorista?.data_nascimento ? new Date(motorista.data_nascimento) : null
  );
  const [endereco, setEndereco] = useState(motorista?.endereco || '');
  const [cnh, setCnh] = useState(motorista?.cnh || '');
  const [categoriaCNH, setCategoriaCNH] = useState(motorista?.categoria_cnh || '');
  const [vencimentoCNH, setVencimentoCNH] = useState<Date | null>(
    motorista?.vencimento_cnh ? new Date(motorista.vencimento_cnh) : null
  );
  const [dataContratacao, setDataContratacao] = useState<Date | null>(
    motorista?.data_contratacao ? new Date(motorista.data_contratacao) : null
  );
  const [proprietarioVinculado, setProprietarioVinculado] = useState(motorista?.proprietario_vinculado || '');
  const [observacoes, setObservacoes] = useState(motorista?.observacoes || '');
  const [carregando, setCarregando] = useState(false);
  
  const isEditMode = !!motorista?.id;

  useEffect(() => {
    if (motorista) {
      setNome(motorista.nome || '');
      setCpf(motorista.cpf || '');
      setTipo(motorista.tipo || 'frota');
      
      // Dados do cadastro completo
      setTelefone(motorista.telefone || '');
      setEndereco(motorista.endereco || '');
      setCnh(motorista.cnh || '');
      setCategoriaCNH(motorista.categoria_cnh || '');
      setProprietarioVinculado(motorista.proprietario_vinculado || '');
      setObservacoes(motorista.observacoes || '');
      
      // Datas
      if (motorista.data_nascimento) {
        setDataNascimento(new Date(motorista.data_nascimento));
      }
      if (motorista.vencimento_cnh) {
        setVencimentoCNH(new Date(motorista.vencimento_cnh));
      }
      if (motorista.data_contratacao) {
        setDataContratacao(new Date(motorista.data_contratacao));
      }
    }
  }, [motorista]);

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

  const formatarTelefone = (tel: string) => {
    const numeros = tel.replace(/\D/g, '');
    
    if (numeros.length <= 2) {
      return `(${numeros}`;
    } else if (numeros.length <= 6) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    } else if (numeros.length <= 10) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
    } else {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatarCPF(e.target.value));
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelefone(formatarTelefone(e.target.value));
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

      if (!cpf || !validarCPF(cpf)) {
        toast.error('CPF inválido. Formato esperado: 000.000.000-00');
        setCarregando(false);
        return;
      }
      
      // Preparar dados para salvar, dependendo do tipo de cadastro
      const dadosSalvar: any = {
        nome: nome,
        cpf: cpf,
        tipo: tipo,
        tipo_cadastro: activeTab
      };
      
      // Adicionar campos do cadastro completo se estiver usando essa opção
      if (activeTab === 'completo') {
        dadosSalvar.telefone = telefone;
        dadosSalvar.endereco = endereco;
        dadosSalvar.cnh = cnh;
        dadosSalvar.categoria_cnh = categoriaCNH;
        dadosSalvar.proprietario_vinculado = proprietarioVinculado;
        dadosSalvar.observacoes = observacoes;
        
        // Converter datas para ISO string se existirem
        if (dataNascimento) dadosSalvar.data_nascimento = dataNascimento.toISOString().split('T')[0];
        if (vencimentoCNH) dadosSalvar.vencimento_cnh = vencimentoCNH.toISOString().split('T')[0];
        if (dataContratacao) dadosSalvar.data_contratacao = dataContratacao.toISOString().split('T')[0];
      }

      if (isEditMode) {
        // Atualizar motorista existente
        const { error } = await supabase
          .from('Motoristas')
          .update(dadosSalvar)
          .eq('id', motorista.id);

        if (error) {
          console.error('Erro ao atualizar motorista:', error);
          toast.error('Erro ao atualizar motorista');
          setCarregando(false);
          return;
        }

        toast.success('Motorista atualizado com sucesso!');
      } else {
        // Verificar se o motorista já existe
        const { data: motoristaExistente, error: errorVerificacao } = await supabase
          .from('Motoristas')
          .select('*')
          .eq('cpf', cpf);

        if (errorVerificacao) {
          console.error('Erro ao verificar motorista:', errorVerificacao);
          toast.error('Erro ao verificar motorista no sistema');
          setCarregando(false);
          return;
        }

        if (motoristaExistente && motoristaExistente.length > 0) {
          toast.error('Este CPF já está cadastrado no sistema');
          setCarregando(false);
          return;
        }

        // Adicionar status para novos cadastros
        dadosSalvar.status = 'active';
        
        // Inserir o motorista
        const { error } = await supabase
          .from('Motoristas')
          .insert(dadosSalvar);

        if (error) {
          console.error('Erro ao cadastrar motorista:', error);
          toast.error('Erro ao cadastrar motorista');
          setCarregando(false);
          return;
        }

        toast.success('Motorista cadastrado com sucesso!');
      }

      // Retornar dados para o componente pai
      const dadosRetorno: any = {
        nome,
        cpf,
        tipo,
        tipoCadastro: activeTab
      };
      
      // Adicionar campos do cadastro completo ao retorno se necessário
      if (activeTab === 'completo') {
        dadosRetorno.telefone = telefone;
        dadosRetorno.dataNascimento = dataNascimento;
        dadosRetorno.endereco = endereco;
        dadosRetorno.cnh = cnh;
        dadosRetorno.categoriaCNH = categoriaCNH;
        dadosRetorno.vencimentoCNH = vencimentoCNH;
        dadosRetorno.dataContratacao = dataContratacao;
        dadosRetorno.proprietarioVinculado = proprietarioVinculado;
        dadosRetorno.observacoes = observacoes;
      }
      
      onSave(dadosRetorno);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Ocorreu um erro ao processar a solicitação');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as 'simples' | 'completo')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="simples">Cadastro Simples</TabsTrigger>
          <TabsTrigger value="completo">Cadastro Completo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="simples" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-sm font-medium">Nome do Motorista *</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome completo"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cpf" className="text-sm font-medium">CPF *</Label>
            <Input
              id="cpf"
              value={cpf}
              onChange={handleCPFChange}
              placeholder="000.000.000-00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Tipo de Motorista *</Label>
            <RadioGroup 
              value={tipo} 
              onValueChange={(value) => setTipo(value as 'frota' | 'terceiro')}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="frota" id="tipo-frota" />
                <Label htmlFor="tipo-frota" className="cursor-pointer">Frota Própria</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="terceiro" id="tipo-terceiro" />
                <Label htmlFor="tipo-terceiro" className="cursor-pointer">Terceirizado</Label>
              </div>
            </RadioGroup>
          </div>
        </TabsContent>
        
        <TabsContent value="completo" className="space-y-4">
          {/* Campos básicos também são necessários no cadastro completo */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="text-md font-medium">Dados Básicos</h3>
              
              <div className="space-y-2">
                <Label htmlFor="nome-completo" className="text-sm font-medium">Nome do Motorista *</Label>
                <Input
                  id="nome-completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome completo"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cpf-completo" className="text-sm font-medium">CPF *</Label>
                <Input
                  id="cpf-completo"
                  value={cpf}
                  onChange={handleCPFChange}
                  placeholder="000.000.000-00"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone" className="text-sm font-medium">Telefone</Label>
                  <Input
                    id="telefone"
                    value={telefone}
                    onChange={handleTelefoneChange}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Data de Nascimento</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dataNascimento && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataNascimento ? (
                          format(dataNascimento, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione a data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dataNascimento || undefined}
                        onSelect={setDataNascimento}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endereco" className="text-sm font-medium">Endereço</Label>
                <Input
                  id="endereco"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Endereço completo"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="text-md font-medium">Dados da CNH</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cnh" className="text-sm font-medium">Número da CNH</Label>
                  <Input
                    id="cnh"
                    value={cnh}
                    onChange={(e) => setCnh(e.target.value)}
                    placeholder="Número da CNH"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="categoria-cnh" className="text-sm font-medium">Categoria</Label>
                  <Input
                    id="categoria-cnh"
                    value={categoriaCNH}
                    onChange={(e) => setCategoriaCNH(e.target.value)}
                    placeholder="Ex: AB, C, D, E"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Vencimento da CNH</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !vencimentoCNH && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {vencimentoCNH ? (
                        format(vencimentoCNH, "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        <span>Selecione a data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={vencimentoCNH || undefined}
                      onSelect={setVencimentoCNH}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="text-md font-medium">Dados de Vínculo</h3>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tipo de Motorista *</Label>
                <RadioGroup 
                  value={tipo} 
                  onValueChange={(value) => setTipo(value as 'frota' | 'terceiro')}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="frota" id="tipo-frota-completo" />
                    <Label htmlFor="tipo-frota-completo" className="cursor-pointer">Frota Própria</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="terceiro" id="tipo-terceiro-completo" />
                    <Label htmlFor="tipo-terceiro-completo" className="cursor-pointer">Terceirizado</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Data de Contratação</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dataContratacao && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataContratacao ? (
                        format(dataContratacao, "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        <span>Selecione a data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dataContratacao || undefined}
                      onSelect={setDataContratacao}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {tipo === 'terceiro' && (
                <div className="space-y-2">
                  <Label htmlFor="proprietario" className="text-sm font-medium">Proprietário Vinculado</Label>
                  <Input
                    id="proprietario"
                    value={proprietarioVinculado}
                    onChange={(e) => setProprietarioVinculado(e.target.value)}
                    placeholder="Nome do proprietário"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="observacoes" className="text-sm font-medium">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Observações adicionais"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={carregando}>
          {carregando ? 'Processando...' : isEditMode 
            ? 'Atualizar' 
            : activeTab === 'simples' 
              ? 'Salvar Cadastro Simples' 
              : 'Salvar Cadastro Completo'
          }
        </Button>
      </div>
    </form>
  );
};

export default CadastroMotoristaForm;
