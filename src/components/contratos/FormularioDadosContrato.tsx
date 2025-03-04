import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Truck, User, Plus, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import CadastroPlacaForm from './CadastroPlacaForm';
import CadastroMotoristaForm from './CadastroMotoristaForm';
import { formatarPlaca } from '@/utils/veiculoUtils';

// Schema de validação dos dados
export const dadosContratoSchema = z.object({
  idContrato: z.string(),
  dataSaida: z.string().min(1, 'Data de saída é obrigatória'),
  cidadeOrigem: z.string().min(1, 'Cidade de origem é obrigatória'),
  estadoOrigem: z.string().min(1, 'Estado de origem é obrigatório').default(''),
  cidadeDestino: z.string().min(1, 'Cidade de destino é obrigatória'),
  estadoDestino: z.string().min(1, 'Estado de destino é obrigatório').default(''),
  clienteDestino: z.string().min(1, 'Cliente de destino é obrigatório'),
  tipo: z.enum(['frota', 'terceiro']),
  placaCavalo: z.string().min(1, 'Placa do cavalo é obrigatória'),
  placaCarreta: z.string().optional(),
  motorista: z.string().optional(),
  proprietario: z.string().optional(),
});

export type DadosContratoFormData = z.infer<typeof dadosContratoSchema>;

interface FormularioDadosContratoProps {
  onSave: (data: DadosContratoFormData) => void;
  initialData?: Partial<DadosContratoFormData>;
  onCancel?: () => void;
}

interface Motorista {
  id: number;
  nome: string;
}

interface CidadeEstado {
  cidade: string;
  estado: string;
}

const FormularioDadosContrato: React.FC<FormularioDadosContratoProps> = ({ 
  onSave,
  initialData,
  onCancel 
}) => {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    initialData?.dataSaida ? new Date(initialData.dataSaida) : new Date()
  );
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [placasCavalo, setPlacasCavalo] = useState<string[]>([]);
  const [placasCarreta, setPlacasCarreta] = useState<string[]>([]);
  const [dialogPlacaCavalo, setDialogPlacaCavalo] = useState(false);
  const [dialogPlacaCarreta, setDialogPlacaCarreta] = useState(false);
  const [dialogMotorista, setDialogMotorista] = useState(false);
  const [cidadesOrigem, setCidadesOrigem] = useState<CidadeEstado[]>([]);
  const [cidadesDestino, setCidadesDestino] = useState<CidadeEstado[]>([]);
  const [proprietarioInfo, setProprietarioInfo] = useState<any>(null);
  const [erro, setErro] = useState<string | null>(null);
  
  // Gerar um novo ID de contrato se não existir
  const gerarIdContrato = async () => {
    if (initialData?.idContrato) return initialData.idContrato;
    
    try {
      // Pegar o último contrato
      const { data, error } = await supabase
        .from('Contratos')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const ultimoId = parseInt(data[0].id);
        return (ultimoId + 1).toString();
      } else {
        return "1";
      }
    } catch (error) {
      console.error('Erro ao gerar ID:', error);
      return (new Date().getTime()).toString();
    }
  };
  
  const form = useForm<DadosContratoFormData>({
    resolver: zodResolver(dadosContratoSchema),
    defaultValues: async () => {
      const idContrato = await gerarIdContrato();
      return {
        idContrato,
        dataSaida: initialData?.dataSaida || format(new Date(), 'yyyy-MM-dd'),
        cidadeOrigem: initialData?.cidadeOrigem || '',
        estadoOrigem: initialData?.estadoOrigem || '',
        cidadeDestino: initialData?.cidadeDestino || '',
        estadoDestino: initialData?.estadoDestino || '',
        clienteDestino: initialData?.clienteDestino || '',
        tipo: initialData?.tipo || 'frota',
        placaCavalo: initialData?.placaCavalo || '',
        placaCarreta: initialData?.placaCarreta || '',
        motorista: initialData?.motorista || '',
        proprietario: initialData?.proprietario || '',
      };
    }
  });
  
  const tipoFrota = form.watch('tipo');
  const placaCavaloValue = form.watch('placaCavalo');
  
  // Carregar listas de cidades (simulado)
  useEffect(() => {
    // Aqui você carregaria de uma API real
    const todasCidades: CidadeEstado[] = [
      { cidade: 'São Paulo', estado: 'SP' },
      { cidade: 'Rio de Janeiro', estado: 'RJ' },
      { cidade: 'Belo Horizonte', estado: 'MG' },
      { cidade: 'Curitiba', estado: 'PR' },
      { cidade: 'Porto Alegre', estado: 'RS' },
      { cidade: 'Salvador', estado: 'BA' },
      { cidade: 'Recife', estado: 'PE' },
      { cidade: 'Fortaleza', estado: 'CE' }
    ];
    
    setCidadesOrigem(todasCidades);
    setCidadesDestino(todasCidades);
  }, []);
  
  // Carregar dados iniciais
  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        // Carregar motoristas
        const { data: motoristasData, error: motoristasError } = await supabase
          .from('Motoristas')
          .select('id, nome')
          .eq('status', 'active');
          
        if (motoristasError) throw motoristasError;
        
        if (motoristasData) {
          setMotoristas(motoristasData);
        }
        
        // Carregar placas de cavalo
        const { data: cavalosData, error: cavalosError } = await supabase
          .from('Veiculos')
          .select('placa_cavalo')
          .eq('status_veiculo', 'Ativo');
          
        if (cavalosError) throw cavalosError;
        
        if (cavalosData) {
          const placas = cavalosData.map(v => v.placa_cavalo).filter(Boolean);
          setPlacasCavalo(placas);
        }
        
        // Carregar placas de carreta
        const { data: carretasData, error: carretasError } = await supabase
          .from('Veiculos')
          .select('placa_carreta')
          .not('placa_carreta', 'is', null);
          
        if (carretasError) throw carretasError;
        
        if (carretasData) {
          const placas = carretasData.map(v => v.placa_carreta).filter(Boolean);
          setPlacasCarreta(placas);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados necessários');
      } finally {
        setLoading(false);
      }
    };
    
    carregarDados();
  }, []);
  
  // Buscar proprietário da placa quando a placa do cavalo mudar (para frete terceirizado)
  useEffect(() => {
    const buscarProprietario = async () => {
      if (!placaCavaloValue || tipoFrota !== 'terceiro') return;
      
      try {
        // Buscar associação veículo-proprietário
        const { data: proprietarioData, error: proprietarioError } = await supabase
          .from('VeiculoProprietarios')
          .select('proprietario_nome')
          .eq('placa_cavalo', placaCavaloValue)
          .single();
          
        if (proprietarioError) {
          if (proprietarioError.code !== 'PGRST116') { // Não é erro "no rows" 
            console.error('Erro ao buscar proprietário:', proprietarioError);
          }
          return;
        }
        
        if (proprietarioData && proprietarioData.proprietario_nome) {
          form.setValue('proprietario', proprietarioData.proprietario_nome);
          
          // Buscar dados completos do proprietário
          const { data: propInfo, error: propError } = await supabase
            .from('Proprietarios')
            .select('*')
            .eq('nome', proprietarioData.proprietario_nome)
            .single();
            
          if (!propError && propInfo) {
            setProprietarioInfo(propInfo);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar proprietário:', error);
      }
    };
    
    buscarProprietario();
  }, [placaCavaloValue, tipoFrota, form]);
  
  // Atualizar estado automaticamente quando cidade for selecionada
  const handleCidadeOrigemChange = (cidade: string) => {
    form.setValue('cidadeOrigem', cidade);
    
    // Encontrar o estado correspondente
    const cidadeInfo = cidadesOrigem.find(c => c.cidade === cidade);
    if (cidadeInfo) {
      form.setValue('estadoOrigem', cidadeInfo.estado);
    }
  };
  
  const handleCidadeDestinoChange = (cidade: string) => {
    form.setValue('cidadeDestino', cidade);
    
    // Encontrar o estado correspondente
    const cidadeInfo = cidadesDestino.find(c => c.cidade === cidade);
    if (cidadeInfo) {
      form.setValue('estadoDestino', cidadeInfo.estado);
    }
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      form.setValue('dataSaida', format(date, 'yyyy-MM-dd'));
    }
  };
  
  const handlePlacaCavaloSaved = (data: { 
    placaCavalo?: string; 
    tipoFrota: 'frota' | 'terceiro'; 
    proprietario?: string;
    proprietarioInfo?: any;
  }) => {
    if (data.placaCavalo) {
      form.setValue('placaCavalo', data.placaCavalo);
      
      // Atualizar tipo de frota se necessário
      if (data.tipoFrota === 'terceiro' && data.proprietario) {
        form.setValue('tipo', 'terceiro');
        form.setValue('proprietario', data.proprietario);
        
        if (data.proprietarioInfo) {
          setProprietarioInfo(data.proprietarioInfo);
        }
      } else {
        // Se não for terceirizado, limpar proprietário
        form.setValue('proprietario', '');
      }
      
      // Recarregar placas de cavalo
      setPlacasCavalo(prev => [...prev, data.placaCavalo!]);
    }
    
    setDialogPlacaCavalo(false);
  };
  
  const handlePlacaCarretaSaved = (data: any) => {
    if (data.placaCarreta) {
      form.setValue('placaCarreta', data.placaCarreta);
      // Recarregar placas de carreta
      setPlacasCarreta(prev => [...prev, data.placaCarreta]);
    }
    
    setDialogPlacaCarreta(false);
  };
  
  const handleMotoristaSaved = (data: any) => {
    if (data && data.id && data.nome) {
      form.setValue('motorista', data.id.toString());
      setMotoristas(prev => [...prev, { id: data.id, nome: data.nome }]);
    }
    
    setDialogMotorista(false);
  };
  
  const onSubmit = async (data: DadosContratoFormData) => {
    setLoading(true);
    setErro(null);
    
    try {
      if (tipoFrota === 'terceiro' && !data.proprietario) {
        setErro('Para frota terceirizada, é obrigatório informar o proprietário');
        setLoading(false);
        return;
      }
      
      // Formatar placa do cavalo
      if (data.placaCavalo) {
        data.placaCavalo = formatarPlaca(data.placaCavalo);
      }
      
      // Formatar placa da carreta
      if (data.placaCarreta) {
        data.placaCarreta = formatarPlaca(data.placaCarreta);
      }
      
      // Adicionar proprietarioInfo para ser usado no próximo passo
      const dataCompleta = {
        ...data,
        proprietarioInfo
      };
      
      onSave(dataCompleta);
    } catch (error) {
      console.error('Erro ao processar dados:', error);
      setErro('Ocorreu um erro ao processar os dados do contrato');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {erro && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{erro}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="idContrato"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número do Contrato</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dataSaida"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Saída</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(new Date(field.value), "dd/MM/yyyy") : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={handleDateSelect}
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cidadeOrigem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade de Origem</FormLabel>
                    <Select
                      onValueChange={handleCidadeOrigemChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a cidade de origem" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cidadesOrigem.map((cidade) => (
                          <SelectItem key={cidade.cidade} value={cidade.cidade}>
                            {cidade.cidade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="estadoOrigem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado de Origem</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cidadeDestino"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade de Destino</FormLabel>
                    <Select
                      onValueChange={handleCidadeDestinoChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a cidade de destino" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cidadesDestino.map((cidade) => (
                          <SelectItem key={cidade.cidade} value={cidade.cidade}>
                            {cidade.cidade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="estadoDestino"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado de Destino</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="clienteDestino"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente Destinatário</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome do cliente destinatário" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Tipo de Frota</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="frota" id="frota" />
                          <FormLabel htmlFor="frota" className="font-normal cursor-pointer">
                            Própria
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="terceiro" id="terceiro" />
                          <FormLabel htmlFor="terceiro" className="font-normal cursor-pointer">
                            Terceirizada
                          </FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="border-t border-gray-200 pt-6 my-6"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <FormLabel>Placa do Cavalo</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDialogPlacaCavalo(true)}
                  >
                    <Plus size={14} className="mr-1" />
                    Nova Placa
                  </Button>
                </div>
                
                <FormField
                  control={form.control}
                  name="placaCavalo"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a placa do cavalo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {placasCavalo.map((placa) => (
                            <SelectItem key={placa} value={placa}>
                              {placa}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <FormLabel>Placa da Carreta</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDialogPlacaCarreta(true)}
                  >
                    <Plus size={14} className="mr-1" />
                    Nova Placa
                  </Button>
                </div>
                
                <FormField
                  control={form.control}
                  name="placaCarreta"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a placa da carreta (opcional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {placasCarreta.map((placa) => (
                            <SelectItem key={placa} value={placa}>
                              {placa}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <FormLabel>Motorista</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDialogMotorista(true)}
                  >
                    <Plus size={14} className="mr-1" />
                    Novo Motorista
                  </Button>
                </div>
                
                <FormField
                  control={form.control}
                  name="motorista"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o motorista" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {motoristas.map((motorista) => (
                            <SelectItem key={motorista.id} value={motorista.id.toString()}>
                              {motorista.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {tipoFrota === 'terceiro' && (
                <FormField
                  control={form.control}
                  name="proprietario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proprietário</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!!placaCavaloValue} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            
            <div className="flex justify-between pt-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? "Processando..." : "Avançar"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      
      {/* Dialog para cadastro de nova placa de cavalo */}
      <Dialog open={dialogPlacaCavalo} onOpenChange={setDialogPlacaCavalo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar Nova Placa de Cavalo</DialogTitle>
          </DialogHeader>
          <CadastroPlacaForm 
            onSave={handlePlacaCavaloSaved}
            onCancel={() => setDialogPlacaCavalo(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Dialog para cadastro de nova placa de carreta */}
      <Dialog open={dialogPlacaCarreta} onOpenChange={setDialogPlacaCarreta}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar Nova Placa de Carreta</DialogTitle>
          </DialogHeader>
          {/* Implementar o form de cadastro de carreta */}
          <div className="py-4">
            <p>Funcionalidade em desenvolvimento</p>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Dialog para cadastro de novo motorista */}
      <Dialog open={dialogMotorista} onOpenChange={setDialogMotorista}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Motorista</DialogTitle>
          </DialogHeader>
          <CadastroMotoristaForm 
            onSave={handleMotoristaSaved}
            onCancel={() => setDialogMotorista(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default FormularioDadosContrato;
