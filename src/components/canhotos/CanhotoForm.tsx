
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { format, addDays } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Info } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CanhotoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  canhotoData: {
    id: string;
    contrato_id: string;
    cliente: string;
    motorista: string;
    proprietario_veiculo?: string;
  };
}

const CanhotoForm: React.FC<CanhotoFormProps> = ({ isOpen, onClose, onSuccess, canhotoData }) => {
  const [dataEntrega, setDataEntrega] = useState<Date | undefined>(undefined);
  const [dataRecebimento, setDataRecebimento] = useState<Date | undefined>(new Date());
  const [responsavelRecebimento, setResponsavelRecebimento] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calcular data de pagamento programado (10 dias após recebimento)
  const dataPagamentoProgramado = dataRecebimento ? format(addDays(dataRecebimento, 10), 'yyyy-MM-dd') : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dataEntrega) {
      toast.error('Por favor, informe a data de entrega ao cliente');
      return;
    }
    
    if (!dataRecebimento) {
      toast.error('Por favor, informe a data de recebimento na controladoria');
      return;
    }
    
    if (!responsavelRecebimento.trim()) {
      toast.error('Por favor, informe o responsável pelo recebimento');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Formatar as datas para armazenamento
      const formattedDataEntrega = format(dataEntrega, 'yyyy-MM-dd');
      const formattedDataRecebimento = format(dataRecebimento, 'yyyy-MM-dd');
      
      // Atualizar o canhoto no banco de dados
      const { error } = await supabase
        .from('Canhoto')
        .update({
          data_entrega_cliente: formattedDataEntrega,
          data_recebimento_canhoto: formattedDataRecebimento,
          responsavel_recebimento: responsavelRecebimento,
          data_programada_pagamento: dataPagamentoProgramado,
          status: 'Recebido'
        })
        .eq('id', canhotoData.id);
      
      if (error) {
        throw error;
      }
      
      // Se o proprietário do veículo estiver disponível, programar o saldo a pagar
      if (canhotoData.proprietario_veiculo) {
        // Verificar se já existe um registro de saldo a pagar para este contrato
        const { data: saldoExistente } = await supabase
          .from('Saldo a pagar')
          .select('*')
          .eq('contratos_associados', canhotoData.contrato_id);
        
        if (!saldoExistente || saldoExistente.length === 0) {
          // Buscar informações do contrato para obter o valor do frete
          const { data: contratoData } = await supabase
            .from('Contratos')
            .select('valor_frete')
            .eq('id', canhotoData.contrato_id)
            .single();
          
          if (contratoData) {
            // Criar registro de saldo a pagar
            await supabase
              .from('Saldo a pagar')
              .insert({
                parceiro: canhotoData.proprietario_veiculo,
                valor_total: contratoData.valor_frete,
                contratos_associados: canhotoData.contrato_id,
                data_pagamento: dataPagamentoProgramado
              });
          }
        }
      }
      
      toast.success('Canhoto registrado com sucesso!');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Erro ao registrar canhoto:', error);
      toast.error(`Erro ao registrar canhoto: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Recebimento de Canhoto</DialogTitle>
          <DialogDescription>
            Registre as informações de recebimento do canhoto para o contrato {canhotoData.contrato_id}.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="cliente">Cliente</Label>
              <Input id="cliente" value={canhotoData.cliente} disabled className="bg-gray-100" />
            </div>
            
            <div>
              <Label htmlFor="motorista">Motorista</Label>
              <Input id="motorista" value={canhotoData.motorista} disabled className="bg-gray-100" />
            </div>
            
            <div>
              <Label htmlFor="dataEntrega">Data de Entrega ao Cliente</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${!dataEntrega ? 'text-muted-foreground' : ''}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataEntrega ? format(dataEntrega, 'dd/MM/yyyy') : 'Selecione uma data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dataEntrega}
                    onSelect={setDataEntrega}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="dataRecebimento">Data de Recebimento na Controladoria</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${!dataRecebimento ? 'text-muted-foreground' : ''}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataRecebimento ? format(dataRecebimento, 'dd/MM/yyyy') : 'Selecione uma data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dataRecebimento}
                    onSelect={setDataRecebimento}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="responsavelRecebimento">Responsável pelo Recebimento</Label>
              <Input 
                id="responsavelRecebimento" 
                value={responsavelRecebimento} 
                onChange={(e) => setResponsavelRecebimento(e.target.value)}
                placeholder="Nome do responsável pelo recebimento" 
                required
              />
            </div>
            
            {canhotoData.proprietario_veiculo && (
              <div className="bg-blue-50 p-3 rounded-md">
                <div className="flex items-start gap-2">
                  <Info size={18} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-700 font-medium">Pagamento ao proprietário</p>
                    <p className="text-xs text-blue-600">
                      Será programado para: {dataPagamentoProgramado ? format(new Date(dataPagamentoProgramado), 'dd/MM/yyyy') : 'Data não definida'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Registrando...' : 'Registrar Canhoto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CanhotoForm;
