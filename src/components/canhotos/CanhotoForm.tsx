
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface CanhotoFormProps {
  contrato_id?: string;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
}

const CanhotoForm: React.FC<CanhotoFormProps> = ({ contrato_id, onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    responsavel_recebimento: '',
    data_recebimento: '',
    data_recebimento_mercadoria: '',
    data_recebimento_controladoria: '',
    saldo_a_pagar: 0,
    contrato_id: contrato_id || '',
    observacoes: '',
    ...initialData
  });

  // Update just the specific function with issues
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
    
    if (!formData.data_recebimento) {
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
      setFormData({...formData, saldo_a_pagar: calculaSaldoPagar()});
    }
    
    // Liberar o saldo a pagar quando o canhoto é recebido
    if (formData.saldo_a_pagar && formData.saldo_a_pagar > 0) {
      try {
        const { data: saldoData, error: saldoError } = await supabase
          .from('Saldo a pagar')
          .select('*')
          .eq('contratos_associados', formData.contrato_id?.toString())
          .single();
          
        if (!saldoError && saldoData) {
          // Atualizar status do saldo para liberado para pagamento
          await supabase
            .from('Saldo a pagar')
            .update({ 
              status: 'Liberado para pagamento'
            })
            .eq('id', saldoData.id);
            
          toast.success('Saldo a pagar liberado com sucesso!');
        }
      } catch (error) {
        console.error('Erro ao liberar saldo a pagar:', error);
      }
    }
    
    await onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Formulário com campos apropriados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="responsavel_recebimento" className="block text-sm font-medium mb-1">
            Responsável pelo Recebimento
          </label>
          <input
            id="responsavel_recebimento"
            name="responsavel_recebimento"
            type="text"
            value={formData.responsavel_recebimento}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label htmlFor="data_recebimento" className="block text-sm font-medium mb-1">
            Data de Recebimento
          </label>
          <input
            id="data_recebimento"
            name="data_recebimento"
            type="date"
            value={formData.data_recebimento}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="data_recebimento_mercadoria" className="block text-sm font-medium mb-1">
            Data que o Cliente Recebeu a Mercadoria
          </label>
          <input
            id="data_recebimento_mercadoria"
            name="data_recebimento_mercadoria"
            type="date"
            value={formData.data_recebimento_mercadoria}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label htmlFor="data_recebimento_controladoria" className="block text-sm font-medium mb-1">
            Data que a Controladoria Recebeu
          </label>
          <input
            id="data_recebimento_controladoria"
            name="data_recebimento_controladoria"
            type="date"
            value={formData.data_recebimento_controladoria}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="observacoes" className="block text-sm font-medium mb-1">
          Observações
        </label>
        <textarea
          id="observacoes"
          name="observacoes"
          value={formData.observacoes}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={3}
        ></textarea>
      </div>

      <Button type="submit" className="w-full">
        Salvar Informações do Canhoto
      </Button>
    </form>
  );
};

export default CanhotoForm;
