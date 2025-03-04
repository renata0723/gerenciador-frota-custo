
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, Save } from 'lucide-react';
import { NovoAbastecimentoFormProps } from '@/types/abastecimento';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ContabilizacaoOption from '../contratos/frete/ContabilizacaoOption';

const formSchema = z.object({
  data: z.string().min(1, "Data é obrigatória"),
  placa: z.string().min(1, "Placa é obrigatória"),
  motorista: z.string().min(1, "Motorista é obrigatório"),
  tipoCombustivel: z.string().min(1, "Tipo de combustível é obrigatório"),
  valor: z.number().min(0.01, "Valor deve ser maior que zero"),
  quantidade: z.number().min(0.01, "Quantidade deve ser maior que zero"),
  quilometragem: z.number().min(1, "Quilometragem é obrigatória"),
  posto: z.string().min(1, "Posto é obrigatório"),
  responsavel: z.string().min(1, "Responsável é obrigatório"),
  itens: z.string(),
  contrato_id: z.string().optional(),
  contabilizado: z.boolean().default(false),
  conta_debito: z.string().optional(),
  conta_credito: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const NovoAbastecimentoForm: React.FC<NovoAbastecimentoFormProps> = ({ 
  tiposCombustivel, 
  onSave, 
  initialData,
  onCancel
}) => {
  const [loading, setLoading] = useState(false);
  const [isContabilizado, setIsContabilizado] = useState(initialData?.contabilizado || false);
  const [contratos, setContratos] = useState<{ id: string; origem_destino: string }[]>([]);
  const [planoContas, setPlanoContas] = useState<{ codigo: string; nome: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Carregar contratos ativos
    const carregarContratos = async () => {
      try {
        const { data, error } = await supabase
          .from('Contratos')
          .select('id, cidade_origem, cidade_destino')
          .eq('status_contrato', 'Em Andamento')
          .order('id', { ascending: false });

        if (error) throw error;

        if (data) {
          const contratosFormatados = data.map(contrato => ({
            id: contrato.id.toString(),
            origem_destino: `${contrato.id} - ${contrato.cidade_origem} → ${contrato.cidade_destino}`
          }));
          setContratos(contratosFormatados);
        }
      } catch (err) {
        console.error('Erro ao carregar contratos:', err);
      }
    };

    // Carregar plano de contas (contas de despesa)
    const carregarPlanoContas = async () => {
      try {
        const { data, error } = await supabase
          .from('Plano_Contas')
          .select('codigo, nome')
          .eq('tipo', 'Despesa')
          .order('codigo');

        if (error) throw error;

        if (data) {
          setPlanoContas(data);
        }
      } catch (err) {
        console.error('Erro ao carregar plano de contas:', err);
      }
    };

    carregarContratos();
    carregarPlanoContas();
  }, []);

  const defaultValues: Partial<FormData> = {
    data: initialData?.data || new Date().toISOString().split('T')[0],
    placa: initialData?.placa || '',
    motorista: initialData?.motorista || '',
    tipoCombustivel: initialData?.tipoCombustivel || '',
    valor: initialData?.valor || 0,
    quantidade: initialData?.quantidade || 0,
    quilometragem: initialData?.quilometragem || 0,
    posto: initialData?.posto || '',
    responsavel: initialData?.responsavel || '',
    itens: initialData?.itens || '',
    contrato_id: initialData?.contrato_id || '',
    contabilizado: initialData?.contabilizado || false,
    conta_debito: initialData?.conta_debito || '',
    conta_credito: initialData?.conta_credito || '',
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const valorWatch = form.watch('valor');
  const quantidadeWatch = form.watch('quantidade');

  // Calcular valor total quando valor ou quantidade mudar
  useEffect(() => {
    if (valorWatch && quantidadeWatch) {
      const valorTotal = valorWatch * quantidadeWatch;
      // Atualizar o campo de itens com o valor calculado
      form.setValue('itens', `Combustível: ${quantidadeWatch} litros = R$ ${valorTotal.toFixed(2)}`);
    }
  }, [valorWatch, quantidadeWatch, form]);

  const onSubmit = (data: FormData) => {
    setLoading(true);
    setError(null);
    
    // Validar contas contábeis se estiver contabilizado
    if (data.contabilizado) {
      if (!data.conta_debito) {
        setError('É necessário informar a conta de débito para contabilização');
        setLoading(false);
        return;
      }
      if (!data.conta_credito) {
        setError('É necessário informar a conta de crédito para contabilização');
        setLoading(false);
        return;
      }
    }
    
    try {
      // Calcular valor total
      const valorTotal = data.valor * data.quantidade;
      
      onSave({
        ...data,
        valor: data.valor,
        quantidade: data.quantidade, 
        contabilizado: isContabilizado,
        conta_debito: isContabilizado ? data.conta_debito : undefined,
        conta_credito: isContabilizado ? data.conta_credito : undefined
      });
    } catch (err) {
      console.error('Erro ao processar formulário:', err);
      setError('Ocorreu um erro ao processar o formulário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Dados do Abastecimento</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data do Abastecimento</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={(date) => {
                          if (date) {
                            field.onChange(date);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contrato_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contrato / Viagem (Opcional)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o contrato" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Nenhum contrato</SelectItem>
                        {contratos.map((contrato) => (
                          <SelectItem key={contrato.id} value={contrato.id}>
                            {contrato.origem_destino}
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
                name="placa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placa do Veículo</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: ABC-1234" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="motorista"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motorista Solicitante</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome do motorista" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="quilometragem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quilometragem</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        placeholder="Km atual do veículo"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="posto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Posto</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome do posto" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="responsavel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável pela Autorização</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Quem autorizou" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tipoCombustivel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Combustível</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o combustível" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tiposCombustivel.map((tipo) => (
                          <SelectItem key={tipo.id} value={tipo.id}>
                            {tipo.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Unitário (R$/L)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="quantidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade (Litros)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="itens"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição do Abastecimento</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Descrição dos itens abastecidos"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="border-t pt-6">
              <ContabilizacaoOption
                isContabilizado={isContabilizado}
                setIsContabilizado={setIsContabilizado}
              />
              
              {isContabilizado && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="conta_debito"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conta Débito</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a conta de débito" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {planoContas.map((conta) => (
                              <SelectItem key={conta.codigo} value={conta.codigo}>
                                {conta.codigo} - {conta.nome}
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
                    name="conta_credito"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conta Crédito</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a conta de crédito" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {planoContas.map((conta) => (
                              <SelectItem key={conta.codigo} value={conta.codigo}>
                                {conta.codigo} - {conta.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={loading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Button 
              type="submit"
              disabled={loading}
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Processando..." : "Salvar Abastecimento"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default NovoAbastecimentoForm;
