
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CheckCircle, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface DialogContabilizacaoProps {
  titulo: string;
  documentoId: string;
  tipoDocumento: 'contrato' | 'manutencao' | 'abastecimento' | 'despesa';
  valor: number;
  descricao: string;
  onContabilizado?: (contabilizado: boolean, contaContabil?: string) => void;
  children?: React.ReactNode;
}

const DialogContabilizacao: React.FC<DialogContabilizacaoProps> = ({
  titulo,
  documentoId,
  tipoDocumento,
  valor,
  descricao,
  onContabilizado,
  children
}) => {
  const [open, setOpen] = useState(false);
  const [contabilizar, setContabilizar] = useState(true);
  const [contaDebito, setContaDebito] = useState('');
  const [contaCredito, setContaCredito] = useState('');
  const [centroCusto, setCentroCusto] = useState('');
  const [historico, setHistorico] = useState(descricao || '');
  const [dataContabil, setDataContabil] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  // Opções simuladas para demonstração
  const contas = [
    { id: '1.1.1', nome: 'Caixa' },
    { id: '1.1.2', nome: 'Bancos' },
    { id: '1.2.1', nome: 'Clientes' },
    { id: '2.1.1', nome: 'Fornecedores' },
    { id: '3.1.1', nome: 'Despesas Operacionais' },
    { id: '3.1.2', nome: 'Despesas Administrativas' },
    { id: '3.1.3', nome: 'Despesas com Viagens' },
    { id: '3.1.4', nome: 'Despesas com Manutenção' },
    { id: '3.1.5', nome: 'Despesas com Combustíveis' },
    { id: '4.1.1', nome: 'Receitas de Fretes' }
  ];
  
  const centrosCusto = [
    { id: '01', nome: 'Administrativo' },
    { id: '02', nome: 'Operacional' },
    { id: '03', nome: 'Comercial' },
    { id: '04', nome: 'Viagens' },
    { id: '05', nome: 'Manutenção' }
  ];
  
  // Sugestões de contas baseadas no tipo de documento
  React.useEffect(() => {
    switch (tipoDocumento) {
      case 'contrato':
        setContaDebito('1.2.1'); // Clientes
        setContaCredito('4.1.1'); // Receitas de Fretes
        setCentroCusto('02'); // Operacional
        break;
      case 'manutencao':
        setContaDebito('3.1.4'); // Despesas com Manutenção
        setContaCredito('1.1.2'); // Bancos
        setCentroCusto('05'); // Manutenção
        break;
      case 'abastecimento':
        setContaDebito('3.1.5'); // Despesas com Combustíveis
        setContaCredito('1.1.2'); // Bancos
        setCentroCusto('04'); // Viagens
        break;
      case 'despesa':
        setContaDebito('3.1.3'); // Despesas com Viagens
        setContaCredito('1.1.2'); // Bancos
        setCentroCusto('04'); // Viagens
        break;
    }
  }, [tipoDocumento]);
  
  const handleContabilizar = () => {
    if (contabilizar && (!contaDebito || !contaCredito || !centroCusto)) {
      toast.error('Preencha todas as informações contábeis');
      return;
    }
    
    // Aqui você enviaria os dados para sua API/banco de dados
    // Simularemos o sucesso para demonstração
    
    if (contabilizar) {
      toast.success('Documento contabilizado com sucesso!');
      if (onContabilizado) {
        onContabilizado(true, contaDebito);
      }
    } else {
      toast.info('Documento finalizado sem contabilização');
      if (onContabilizado) {
        onContabilizado(false);
      }
    }
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Finalizar e Contabilizar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            {titulo || 'Contabilização de Documento'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-medium">Contabilizar este documento?</span>
              <span className="text-sm text-gray-500">
                {contabilizar 
                  ? 'O documento será registrado na contabilidade' 
                  : 'O documento será finalizado sem contabilização'}
              </span>
            </div>
            <Switch 
              checked={contabilizar} 
              onCheckedChange={setContabilizar} 
            />
          </div>
          
          {contabilizar && (
            <>
              <div>
                <Label>Documento</Label>
                <div className="flex items-center mt-1 p-2 bg-gray-50 rounded-md">
                  <div className="flex-1">
                    <div className="font-medium">{tipoDocumento.charAt(0).toUpperCase() + tipoDocumento.slice(1)} #{documentoId}</div>
                    <div className="text-sm text-gray-500">{descricao}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">R$ {valor.toFixed(2)}</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dataContabil">Data</Label>
                  <Input
                    id="dataContabil"
                    type="date"
                    value={dataContabil}
                    onChange={(e) => setDataContabil(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="centroCusto">Centro de Custo</Label>
                  <Select
                    value={centroCusto}
                    onValueChange={setCentroCusto}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o centro de custo" />
                    </SelectTrigger>
                    <SelectContent>
                      {centrosCusto.map((centro) => (
                        <SelectItem key={centro.id} value={centro.id}>
                          {centro.id} - {centro.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="contaDebito">Conta Débito</Label>
                  <Select
                    value={contaDebito}
                    onValueChange={setContaDebito}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a conta de débito" />
                    </SelectTrigger>
                    <SelectContent>
                      {contas.map((conta) => (
                        <SelectItem key={conta.id} value={conta.id}>
                          {conta.id} - {conta.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="contaCredito">Conta Crédito</Label>
                  <Select
                    value={contaCredito}
                    onValueChange={setContaCredito}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a conta de crédito" />
                    </SelectTrigger>
                    <SelectContent>
                      {contas.map((conta) => (
                        <SelectItem key={conta.id} value={conta.id}>
                          {conta.id} - {conta.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="historico">Histórico</Label>
                <Input
                  id="historico"
                  value={historico}
                  onChange={(e) => setHistorico(e.target.value)}
                  placeholder="Descrição da operação contábil"
                />
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button 
            type="button" 
            onClick={handleContabilizar}
            className="flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            {contabilizar ? 'Contabilizar e Finalizar' : 'Finalizar sem Contabilizar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogContabilizacao;
