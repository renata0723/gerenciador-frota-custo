
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, CheckCircle2, FileCheck, FileSearch, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import PesquisaDocumentos from './PesquisaDocumentos';
import { useNavigate } from 'react-router-dom';
import { logOperation } from '@/utils/logOperations';

// Interface para os dados do formulário
interface FormData {
  contratos: string[];
  manifestos: string[];
  ctes: string[];
  notasFiscais: string[];
  dataRecebimento: Date | undefined;
  responsavelRecebimento: string;
  dataEntregaCliente: Date | undefined;
  observacoes?: string;
}

const CanhotoForm = () => {
  const [formData, setFormData] = useState<FormData>({
    contratos: [],
    manifestos: [],
    ctes: [],
    notasFiscais: [],
    dataRecebimento: undefined,
    responsavelRecebimento: '',
    dataEntregaCliente: undefined,
    observacoes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [pesquisaAberta, setPesquisaAberta] = useState(false);
  const navigate = useNavigate();
  
  // Estado para controlar a abertura dos calendários
  const [dataRecebimentoAberta, setDataRecebimentoAberta] = useState(false);
  const [dataEntregaClienteAberta, setDataEntregaClienteAberta] = useState(false);
  
  const [canhotos, setCanhotos] = useState<any[]>([]);

  // Buscar canhotos pendentes ao carregar o componente
  useEffect(() => {
    const fetchPendingCanhotos = async () => {
      try {
        const { data, error } = await supabase
          .from('Canhoto')
          .select('*')
          .eq('status', 'Pendente');
          
        if (error) throw error;
        
        if (data) {
          setCanhotos(data);
        }
      } catch (err) {
        console.error('Erro ao buscar canhotos pendentes:', err);
        toast.error('Erro ao carregar dados pendentes');
      }
    };
    
    fetchPendingCanhotos();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDocumentosSelecionados = (tipo: 'contratos' | 'manifestos' | 'ctes' | 'notasFiscais', documentos: string[]) => {
    setFormData(prev => ({
      ...prev,
      [tipo]: documentos
    }));
    
    // Se tivermos 1 contrato selecionado, buscar seus dados
    if (tipo === 'contratos' && documentos.length === 1) {
      buscarDadosContrato(documentos[0]);
    }
    
    setPesquisaAberta(false);
  };

  const buscarDadosContrato = async (contratoId: string) => {
    try {
      // Buscar informações de canhoto pendente para esse contrato
      const { data, error } = await supabase
        .from('Canhoto')
        .select('*')
        .eq('contrato_id', contratoId)
        .maybeSingle();
        
      if (error) throw error;
      
      if (data) {
        // Se já temos dados do canhoto, preencher os campos
        setFormData(prev => ({
          ...prev,
          manifestos: data.numero_manifesto ? [data.numero_manifesto] : [],
          ctes: data.numero_cte ? [data.numero_cte] : [],
          notasFiscais: data.numero_nota_fiscal ? [data.numero_nota_fiscal] : []
        }));
      }
      
    } catch (err) {
      console.error('Erro ao buscar dados do contrato:', err);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.dataRecebimento) {
      toast.error('A data de recebimento do canhoto é obrigatória');
      return false;
    }
    
    if (!formData.responsavelRecebimento) {
      toast.error('O responsável pelo recebimento é obrigatório');
      return false;
    }
    
    if (!formData.dataEntregaCliente) {
      toast.error('A data de entrega ao cliente é obrigatória');
      return false;
    }
    
    if (formData.contratos.length === 0) {
      toast.error('Selecione pelo menos um contrato');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      // Para cada contrato selecionado, atualizar o registro do canhoto
      for (const contratoId of formData.contratos) {
        // Verificar se o canhoto existe
        const { data: existingCanhoto, error: errorBusca } = await supabase
          .from('Canhoto')
          .select('*')
          .eq('contrato_id', contratoId)
          .maybeSingle();
          
        if (errorBusca) throw errorBusca;
        
        // Se não existir canhoto para este contrato, continue para o próximo
        if (!existingCanhoto) {
          console.warn(`Canhoto não encontrado para o contrato ${contratoId}`);
          continue;
        }
        
        // Atualizar o canhoto
        const { error: updateError } = await supabase
          .from('Canhoto')
          .update({
            data_recebimento_canhoto: formData.dataRecebimento ? format(formData.dataRecebimento, 'yyyy-MM-dd') : null,
            responsavel_recebimento: formData.responsavelRecebimento,
            data_entrega_cliente: formData.dataEntregaCliente ? format(formData.dataEntregaCliente, 'yyyy-MM-dd') : null,
            status: 'Recebido'
          })
          .eq('contrato_id', contratoId);
          
        if (updateError) throw updateError;
        
        // Verificar se tem saldo a pagar e atualizar o status do contrato
        if (existingCanhoto.saldo_a_pagar && existingCanhoto.saldo_a_pagar > 0) {
          // Atualizar também o status do contrato
          const { error: contratoError } = await supabase
            .from('Contratos')
            .update({
              status_contrato: 'Aguardando Pagamento'
            })
            .eq('id', contratoId);
            
          if (contratoError) {
            console.error(`Erro ao atualizar status do contrato ${contratoId}:`, contratoError);
          }
        } else {
          // Se não tem saldo a pagar, atualizar para concluído
          const { error: contratoError } = await supabase
            .from('Contratos')
            .update({
              status_contrato: 'Concluído'
            })
            .eq('id', contratoId);
            
          if (contratoError) {
            console.error(`Erro ao atualizar status do contrato ${contratoId}:`, contratoError);
          }
        }
        
        // Registrar a operação
        logOperation(
          'Canhotos',
          'Recebimento de canhoto',
          `Contrato: ${contratoId}, Responsável: ${formData.responsavelRecebimento}`
        );
      }
      
      toast.success('Canhoto registrado com sucesso!');
      
      // Resetar o formulário e redirecionar
      setTimeout(() => {
        navigate('/canhotos');
      }, 1500);
      
    } catch (error) {
      console.error('Erro ao registrar canhoto:', error);
      toast.error('Ocorreu um erro ao registrar o canhoto');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="documentos" className="text-base font-medium">
                Documentos Relacionados
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPesquisaAberta(true)}
                className="flex items-center gap-1"
              >
                <Search className="h-4 w-4" />
                Pesquisar Documentos
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <Label className="text-sm text-gray-500">Contratos Selecionados</Label>
                <div className="border rounded-md p-2 min-h-[60px] bg-gray-50">
                  {formData.contratos.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {formData.contratos.map((contrato, index) => (
                        <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                          <span>{contrato}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">Nenhum contrato selecionado</div>
                  )}
                </div>
              </div>
              
              <div>
                <Label className="text-sm text-gray-500">Manifestos / CTe</Label>
                <div className="border rounded-md p-2 min-h-[60px] bg-gray-50">
                  {formData.manifestos.length > 0 || formData.ctes.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {formData.manifestos.map((manifesto, index) => (
                        <div key={`m-${index}`} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
                          <span>Manif. {manifesto}</span>
                        </div>
                      ))}
                      {formData.ctes.map((cte, index) => (
                        <div key={`c-${index}`} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center">
                          <span>CTe {cte}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">Nenhum documento selecionado</div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-2">
              <Label className="text-sm text-gray-500">Notas Fiscais</Label>
              <div className="border rounded-md p-2 min-h-[60px] bg-gray-50">
                {formData.notasFiscais.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.notasFiscais.map((nota, index) => (
                      <div key={index} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm flex items-center">
                        <span>NF {nota}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">Nenhuma nota fiscal selecionada</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label htmlFor="dataRecebimento" className="text-base font-medium">
                Data de Recebimento do Canhoto *
              </Label>
              <Popover open={dataRecebimentoAberta} onOpenChange={setDataRecebimentoAberta}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dataRecebimento ? (
                      format(formData.dataRecebimento, 'dd/MM/yyyy')
                    ) : (
                      <span className="text-gray-400">Selecione a data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dataRecebimento}
                    onSelect={(date) => {
                      setFormData({ ...formData, dataRecebimento: date });
                      setDataRecebimentoAberta(false);
                    }}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="responsavelRecebimento" className="text-base font-medium">
                Responsável pelo Recebimento *
              </Label>
              <Input
                id="responsavelRecebimento"
                name="responsavelRecebimento"
                placeholder="Nome de quem recebeu o canhoto"
                value={formData.responsavelRecebimento}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="dataEntregaCliente" className="text-base font-medium">
              Data de Entrega ao Cliente *
            </Label>
            <Popover open={dataEntregaClienteAberta} onOpenChange={setDataEntregaClienteAberta}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dataEntregaCliente ? (
                    format(formData.dataEntregaCliente, 'dd/MM/yyyy')
                  ) : (
                    <span className="text-gray-400">Selecione a data de entrega</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dataEntregaCliente}
                  onSelect={(date) => {
                    setFormData({ ...formData, dataEntregaCliente: date });
                    setDataEntregaClienteAberta(false);
                  }}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="observacoes" className="text-base font-medium">
              Observações
            </Label>
            <textarea
              id="observacoes"
              name="observacoes"
              className="w-full border border-gray-300 rounded-md p-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Informações adicionais sobre o recebimento do canhoto"
              value={formData.observacoes}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/canhotos')}>
              Cancelar
            </Button>
            <Button type="submit" className="gap-2" disabled={submitting}>
              <FileCheck className="h-4 w-4" />
              {submitting ? 'Registrando...' : 'Registrar Canhoto'}
            </Button>
          </div>
        </form>
      </CardContent>
      
      {pesquisaAberta && (
        <PesquisaDocumentos
          onClose={() => setPesquisaAberta(false)}
          onSelecionarDocumentos={handleDocumentosSelecionados}
          canhotosExistentes={canhotos}
        />
      )}
    </Card>
  );
};

export default CanhotoForm;
