
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { CanhotoDados, ContratoCompleto } from '@/types/contrato';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { formatarData, formatCurrency } from '@/utils/formatters';
import { Switch } from '@/components/ui/switch';

interface CanhotoFormProps {
  contrato: ContratoCompleto;
  onSubmit: (data: Partial<CanhotoDados>) => void;
  onCancel: () => void;
}

const CanhotoForm: React.FC<CanhotoFormProps> = ({ contrato, onSubmit, onCancel }) => {
  const [dataRecebimento, setDataRecebimento] = useState<Date | undefined>(
    contrato.canhoto?.data_recebimento_canhoto ? new Date(contrato.canhoto.data_recebimento_canhoto) : new Date()
  );
  const [dataEntrega, setDataEntrega] = useState<Date | undefined>(
    contrato.canhoto?.data_entrega_cliente ? new Date(contrato.canhoto.data_entrega_cliente) : undefined
  );
  const [dataPagamento, setDataPagamento] = useState<Date | undefined>(
    contrato.canhoto?.data_programada_pagamento ? new Date(contrato.canhoto.data_programada_pagamento) : undefined
  );
  const [responsavel, setResponsavel] = useState(contrato.canhoto?.responsavel_recebimento || '');
  const [liberarSaldoPagar, setLiberarSaldoPagar] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dadosCanhoto: Partial<CanhotoDados> = {
      data_recebimento_canhoto: dataRecebimento ? formatarData(dataRecebimento) : undefined,
      data_entrega_cliente: dataEntrega ? formatarData(dataEntrega) : undefined,
      data_programada_pagamento: dataPagamento ? formatarData(dataPagamento) : undefined,
      responsavel_recebimento: responsavel,
      status: liberarSaldoPagar ? 'liberado' : 'recebido',
      saldo_a_pagar: liberarSaldoPagar && contrato.tipo === 'terceiro' ? contrato.valorSaldoPagar || 0 : undefined
    };
    
    onSubmit(dadosCanhoto);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Alert className="bg-blue-50">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          Registre o recebimento do canhoto para o contrato #{contrato.idContrato}
        </AlertDescription>
      </Alert>
      
      <div className="p-4 bg-gray-50 rounded-md">
        <h3 className="font-medium mb-2">Informações do Contrato</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <p><span className="font-medium">Cliente:</span> {contrato.clienteDestino}</p>
          <p><span className="font-medium">Destino:</span> {contrato.cidadeDestino}/{contrato.estadoDestino}</p>
          <p><span className="font-medium">Placa:</span> {contrato.placaCavalo}</p>
          <p><span className="font-medium">Motorista:</span> {contrato.motorista}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dataRecebimento">Data de Recebimento do Canhoto*</Label>
          <DatePicker 
            value={dataRecebimento} 
            onChange={setDataRecebimento} 
            placeholder="Selecione a data" 
          />
        </div>
        
        <div>
          <Label htmlFor="responsavel">Responsável pelo Recebimento*</Label>
          <Input
            id="responsavel"
            value={responsavel}
            onChange={(e) => setResponsavel(e.target.value)}
            placeholder="Nome do responsável"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dataEntrega">Data de Entrega ao Cliente</Label>
          <DatePicker 
            value={dataEntrega} 
            onChange={setDataEntrega} 
            placeholder="Selecione a data" 
          />
        </div>
        
        <div>
          <Label htmlFor="dataPagamento">Data Programada para Pagamento</Label>
          <DatePicker 
            value={dataPagamento} 
            onChange={setDataPagamento} 
            placeholder="Selecione a data" 
          />
        </div>
      </div>
      
      {contrato.tipo === 'terceiro' && contrato.valorSaldoPagar > 0 && (
        <div className="p-4 border rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Saldo a Pagar ao Parceiro</h3>
              <p className="text-sm text-gray-600 mt-1">
                Valor pendente: {formatCurrency(contrato.valorSaldoPagar)}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={liberarSaldoPagar} 
                onCheckedChange={setLiberarSaldoPagar} 
                id="liberarSaldo"
              />
              <Label htmlFor="liberarSaldo">Liberar para pagamento</Label>
            </div>
          </div>
        </div>
      )}
      
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
