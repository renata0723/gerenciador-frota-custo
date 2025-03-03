
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { Canhoto } from '@/types/canhoto';
import { CanhotoStatus } from '@/utils/constants';
import { supabase } from '@/integrations/supabase/client';

interface CanhotoFormProps {
  dados?: Partial<Canhoto>;
  onSubmit: (dados: Partial<Canhoto>) => void;
  onCancel?: () => void;
  contratoId?: string;
  dataEntrega?: string;
}

const CanhotoForm: React.FC<CanhotoFormProps> = ({ dados, onSubmit, onCancel, contratoId, dataEntrega }) => {
  const [dataEntregaState, setDataEntregaState] = useState<Date | undefined>(
    dataEntrega ? new Date(dataEntrega) : 
    dados?.data_entrega_cliente ? new Date(dados.data_entrega_cliente) : undefined
  );
  
  const [dataRecebimento, setDataRecebimento] = useState<Date | undefined>(
    dados?.data_recebimento_canhoto ? new Date(dados.data_recebimento_canhoto) : new Date()
  );

  const [responsavel, setResponsavel] = useState(dados?.responsavel_recebimento || '');
  const [numeroNotaFiscal, setNumeroNotaFiscal] = useState(dados?.numero_nota_fiscal || '');
  const [notasFiscais, setNotasFiscais] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(false);
  
  useEffect(() => {
    if (contratoId) {
      carregarNotasFiscais(contratoId);
    }
  }, [contratoId]);

  const carregarNotasFiscais = async (idContrato: string) => {
    setCarregando(true);
    try {
      const { data, error } = await supabase
        .from('Contratos')
        .select('notas_fiscais')
        .eq('id', idContrato)
        .single();
        
      if (error) {
        console.error('Erro ao carregar notas fiscais:', error);
        return;
      }
      
      if (data && data.notas_fiscais) {
        // Supondo que as notas fiscais estejam armazenadas como string separada por vírgulas
        const notasArray = data.notas_fiscais.split(',').map((nf: string) => nf.trim());
        setNotasFiscais(notasArray);
      }
    } catch (error) {
      console.error('Erro ao processar dados:', error);
    } finally {
      setCarregando(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dataEntregaState) {
      toast.error("Por favor, informe a data de entrega ao cliente");
      return;
    }
    
    if (!dataRecebimento) {
      toast.error("Por favor, informe a data de recebimento do canhoto");
      return;
    }
    
    if (!responsavel) {
      toast.error("Por favor, informe o responsável pelo recebimento");
      return;
    }
    
    // Calcular data programada de pagamento (10 dias após o recebimento)
    const dataProgramadaPagamento = addDays(dataRecebimento, 10);
    
    const canhotoData: Partial<Canhoto> = {
      ...dados,
      contrato_id: contratoId || dados?.contrato_id || '',
      data_entrega_cliente: format(dataEntregaState, 'yyyy-MM-dd'),
      data_recebimento_canhoto: format(dataRecebimento, 'yyyy-MM-dd'),
      responsavel_recebimento: responsavel,
      data_programada_pagamento: format(dataProgramadaPagamento, 'yyyy-MM-dd'),
      numero_nota_fiscal: numeroNotaFiscal,
      status: "Recebido" as CanhotoStatus
    };
    
    onSubmit(canhotoData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dataEntrega">Data da entrega ao cliente *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full flex justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dataEntregaState ? (
                  format(dataEntregaState, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                ) : (
                  <span>Selecione a data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dataEntregaState}
                onSelect={setDataEntregaState}
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dataRecebimento">Data do recebimento do canhoto *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full flex justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dataRecebimento ? (
                  format(dataRecebimento, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                ) : (
                  <span>Selecione a data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dataRecebimento}
                onSelect={setDataRecebimento}
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="numeroNotaFiscal">Nota Fiscal</Label>
        <div className="relative">
          <Input
            id="numeroNotaFiscal"
            value={numeroNotaFiscal}
            onChange={(e) => setNumeroNotaFiscal(e.target.value)}
            placeholder="Número da nota fiscal"
            list="notas-fiscais"
          />
          <datalist id="notas-fiscais">
            {notasFiscais.map((nf, index) => (
              <option key={index} value={nf} />
            ))}
          </datalist>
        </div>
        {notasFiscais.length > 0 && (
          <p className="text-xs text-gray-500">
            {notasFiscais.length} nota(s) fiscal(is) vinculada(s) a este contrato
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="responsavel">Responsável pelo recebimento *</Label>
        <Input
          id="responsavel"
          value={responsavel}
          onChange={(e) => setResponsavel(e.target.value)}
          placeholder="Nome do responsável que recebeu o canhoto"
          required
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" className="bg-blue-600 text-white">
          Registrar Recebimento
        </Button>
      </div>
    </form>
  );
};

export default CanhotoForm;
