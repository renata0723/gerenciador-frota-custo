
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { bancos } from '@/utils/constants';
import { ProprietarioFormValues } from '@/types/saldoPagar';

const formSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  documento: z.string().min(11, "CPF/CNPJ deve ter pelo menos 11 caracteres"),
  tipoConta: z.string().min(1, "Tipo de conta é obrigatório"),
  banco: z.string().min(1, "Banco é obrigatório"),
  agencia: z.string().min(1, "Agência é obrigatória"),
  conta: z.string().min(1, "Conta é obrigatória"),
  pix: z.string().optional(),
});

interface CadastroProprietarioFormProps {
  onSave: (data: ProprietarioFormValues) => void;
  onCancel: () => void;
  initialData?: Partial<ProprietarioFormValues>;
}

const CadastroProprietarioForm: React.FC<CadastroProprietarioFormProps> = ({ 
  onSave, 
  onCancel,
  initialData
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ProprietarioFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: initialData?.nome || '',
      documento: initialData?.documento || '',
      tipoConta: initialData?.tipoConta || 'corrente',
      banco: initialData?.banco || '',
      agencia: initialData?.agencia || '',
      conta: initialData?.conta || '',
      pix: initialData?.pix || '',
    }
  });

  const handleDocumentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remover tudo que não for número
    const onlyNums = e.target.value.replace(/\D/g, '');
    
    form.setValue('documento', onlyNums);
  };

  const onSubmit = async (data: ProprietarioFormValues) => {
    setLoading(true);
    setError(null);
    
    try {
      // Criar objeto com dados bancários para armazenar como JSON
      const dadosBancarios = {
        tipoConta: data.tipoConta,
        banco: data.banco,
        agencia: data.agencia,
        conta: data.conta,
        pix: data.pix
      };
      
      // Salvar no banco de dados
      const { error: dbError } = await supabase
        .from('Proprietarios')
        .insert({
          nome: data.nome,
          documento: data.documento,
          dados_bancarios: JSON.stringify(dadosBancarios)
        });
        
      if (dbError) {
        throw dbError;
      }
      
      toast.success('Proprietário cadastrado com sucesso!');
      
      // Chamar callback
      onSave(data);
    } catch (err) {
      console.error('Erro ao salvar proprietário:', err);
      setError('Ocorreu um erro ao salvar os dados do proprietário');
      toast.error('Ocorreu um erro ao salvar os dados');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="border-0 shadow-none">
          <CardContent className="px-0 space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Proprietário</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome completo" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="documento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF/CNPJ</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Apenas números" 
                        onChange={handleDocumentoChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="pt-2">
              <h3 className="text-lg font-medium mb-4">Dados Bancários</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tipoConta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Conta</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de conta" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="corrente">Conta Corrente</SelectItem>
                          <SelectItem value="poupanca">Conta Poupança</SelectItem>
                          <SelectItem value="pagamento">Conta de Pagamento</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="banco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banco</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o banco" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[200px]">
                          {bancos.map((banco) => (
                            <SelectItem key={banco.codigo} value={banco.codigo}>
                              {banco.codigo} - {banco.nome}
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
                  name="agencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agência</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Número da agência" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="conta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conta</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Número da conta com dígito" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="pix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chave PIX (opcional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Chave PIX" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="px-0 flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={loading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={loading}
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Processando..." : "Salvar Proprietário"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default CadastroProprietarioForm;
