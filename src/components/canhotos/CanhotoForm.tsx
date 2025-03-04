
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { toast } from "sonner";
import { Canhoto } from "@/types/canhoto";
import { supabase } from '@/integrations/supabase/client';
import { DatePicker } from "@/components/ui/date-picker";

interface CanhotoFormProps {
  dados?: Partial<Canhoto>;
  contratoId?: string;
  dataEntrega?: string;
  onSubmit: (data: Partial<Canhoto>) => Promise<void>;
  onCancel: () => void;
}

const CanhotoForm: React.FC<CanhotoFormProps> = ({
  dados,
  contratoId,
  dataEntrega,
  onSubmit,
  onCancel
}) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const [formData, setFormData] = useState<Partial<Canhoto>>({
    contrato_id: dados?.contrato_id || contratoId || '',
    cliente: dados?.cliente || '',
    motorista: dados?.motorista || '',
    numero_manifesto: dados?.numero_manifesto || '',
    numero_cte: dados?.numero_cte || '',
    numero_nota_fiscal: dados?.numero_nota_fiscal || '',
    data_entrega_cliente: dados?.data_entrega_cliente || dataEntrega || today,
    data_recebimento_canhoto: dados?.data_recebimento_canhoto || today,
    responsavel_recebimento: dados?.responsavel_recebimento || '',
    data_programada_pagamento: dados?.data_programada_pagamento || '',
    status: 'Recebido',
    data_recebimento_mercadoria: dados?.data_recebimento_mercadoria || '',
    data_recebimento_controladoria: dados?.data_recebimento_controladoria || today,
  });
  
  const [loadingContrato, setLoadingContrato] = useState(false);
  
  useEffect(() => {
    if ((contratoId || formData.contrato_id) && !dados) {
      carregarDadosContrato();
    }
  }, [contratoId, formData.contrato_id]);
  
  const carregarDadosContrato = async () => {
    const id = contratoId || formData.contrato_id;
    if (!id) return;
    
    setLoadingContrato(true);
    try {
      // Buscar dados do contrato
      const { data: contratoData, error: contratoError } = await supabase
        .from('Contratos')
        .select('*')
        .eq('id', parseInt(id.toString()))
        .single();
        
      if (contratoError) {
        throw contratoError;
      }
      
      if (contratoData) {
        // Buscar dados do motorista
        const { data: motoristaData } = await supabase
          .from('Motoristas')
          .select('nome')
          .eq('id', contratoData.motorista_id)
          .single();
          
        setFormData(prev => ({
          ...prev,
          cliente: contratoData.cliente_destino,
          motorista: motoristaData?.nome || 'Não identificado',
          proprietario_veiculo: contratoData.proprietario
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar dados do contrato:', error);
      toast.error('Erro ao carregar dados do contrato');
    } finally {
      setLoadingContrato(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDateChange = (field: string, date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        [field]: format(date, 'yyyy-MM-dd')
      }));
    }
  };
  
  const calculaSaldoPagar = () => {
    // Esta função seria implementada para calcular o saldo a pagar
    // baseando-se no contrato e outros parâmetros
    return 0; // Implementação simplificada
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.responsavel_recebimento) {
      toast.error("Informe o responsável pelo recebimento do canhoto");
      return;
    }
    
    if (!formData.data_recebimento_canhoto) {
      toast.error("Informe a data de recebimento do canhoto");
      return;
    }
    
    if (!formData.data_recebimento_mercadoria) {
      toast.error("Informe a data que o cliente recebeu a mercadoria");
      return;
    }
    
    if (!formData.data_recebimento_controladoria) {
      toast.error("Informe a data que a controladoria recebeu o canhoto");
      return;
    }
    
    // Calcular saldo a pagar se necessário
    if (!formData.saldo_a_pagar) {
      formData.saldo_a_pagar = calculaSaldoPagar();
    }
    
    // Liberar o saldo a pagar quando o canhoto é recebido
    if (formData.saldo_a_pagar && formData.saldo_a_pagar > 0) {
      try {
        const { data: saldoData, error: saldoError } = await supabase
          .from('Saldo a pagar')
          .select('*')
          .eq('contratos_associados', formData.contrato_id)
          .single();
          
        if (!saldoError && saldoData) {
          // Atualizar status do saldo para liberado para pagamento
          await supabase
            .from('Saldo a pagar')
            .update({ status: 'liberado' })
            .eq('id', saldoData.id);
            
          toast.success('Saldo a pagar liberado com sucesso!');
        }
      } catch (error) {
        console.error('Erro ao liberar saldo a pagar:', error);
      }
    }
    
    await onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contrato_id">Contrato</Label>
          <Input
            id="contrato_id"
            name="contrato_id"
            value={formData.contrato_id}
            onChange={handleChange}
            disabled={Boolean(dados) || Boolean(contratoId) || loadingContrato}
            placeholder={loadingContrato ? "Carregando..." : "Número do contrato"}
          />
        </div>
        
        <div>
          <Label htmlFor="cliente">Cliente</Label>
          <Input
            id="cliente"
            name="cliente"
            value={formData.cliente}
            onChange={handleChange}
            disabled={Boolean(dados) || loadingContrato}
            placeholder={loadingContrato ? "Carregando..." : "Cliente destinatário"}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="motorista">Motorista</Label>
          <Input
            id="motorista"
            name="motorista"
            value={formData.motorista}
            onChange={handleChange}
            disabled={Boolean(dados) || loadingContrato}
            placeholder={loadingContrato ? "Carregando..." : "Nome do motorista"}
          />
        </div>
        
        <div>
          <Label htmlFor="numero_manifesto">Número do Manifesto</Label>
          <Input
            id="numero_manifesto"
            name="numero_manifesto"
            value={formData.numero_manifesto}
            onChange={handleChange}
            placeholder="Número do manifesto (opcional)"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="numero_cte">Número do CT-e</Label>
          <Input
            id="numero_cte"
            name="numero_cte"
            value={formData.numero_cte}
            onChange={handleChange}
            placeholder="Número do CT-e (opcional)"
          />
        </div>
        
        <div>
          <Label htmlFor="numero_nota_fiscal">Número da Nota Fiscal</Label>
          <Input
            id="numero_nota_fiscal"
            name="numero_nota_fiscal"
            value={formData.numero_nota_fiscal}
            onChange={handleChange}
            placeholder="Número da nota fiscal (opcional)"
          />
        </div>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="data_recebimento_mercadoria">Data de Recebimento pelo Cliente</Label>
          <Input
            id="data_recebimento_mercadoria"
            name="data_recebimento_mercadoria"
            type="date"
            value={formData.data_recebimento_mercadoria}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="data_entrega_cliente">Data da Entrega ao Cliente</Label>
          <Input
            id="data_entrega_cliente"
            name="data_entrega_cliente"
            type="date"
            value={formData.data_entrega_cliente}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="data_recebimento_canhoto">Data do Recebimento do Canhoto</Label>
          <Input
            id="data_recebimento_canhoto"
            name="data_recebimento_canhoto"
            type="date"
            value={formData.data_recebimento_canhoto}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="data_recebimento_controladoria">Data de Recebimento na Controladoria</Label>
          <Input
            id="data_recebimento_controladoria"
            name="data_recebimento_controladoria"
            type="date"
            value={formData.data_recebimento_controladoria}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="responsavel_recebimento">Responsável pelo Recebimento</Label>
          <Input
            id="responsavel_recebimento"
            name="responsavel_recebimento"
            value={formData.responsavel_recebimento}
            onChange={handleChange}
            placeholder="Nome do responsável que recebeu o canhoto"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="data_programada_pagamento">Data Programada de Pagamento</Label>
          <Input
            id="data_programada_pagamento"
            name="data_programada_pagamento"
            type="date"
            value={formData.data_programada_pagamento}
            onChange={handleChange}
            placeholder="Data para pagamento do saldo ao parceiro (opcional)"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Registrar Canhoto
        </Button>
      </div>
    </form>
  );
};

export default CanhotoForm;
