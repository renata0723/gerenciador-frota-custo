
import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import { CreditCard, Search, Filter, Download, BarChart2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { formataMoeda } from '@/utils/constants';
import { SaldoPagarItem } from '@/types/contabilidade';
import Placeholder, { LoadingPlaceholder } from '@/components/ui/Placeholder';

const SaldoPagar = () => {
  const [saldosList, setSaldosList] = useState<SaldoPagarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    carregarSaldos();
  }, []);

  const carregarSaldos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Saldo a pagar')
        .select('*');

      if (error) {
        console.error("Erro ao carregar saldos a pagar:", error);
        toast.error("Erro ao carregar a lista de saldos a pagar");
        return;
      }

      // Mapear os dados para incluir o status
      const dadosFormatados = (data || []).map(item => ({
        ...item,
        status: item.valor_pago && item.valor_total 
          ? item.valor_pago >= item.valor_total 
            ? 'Pago' 
            : 'Parcial'
          : 'Pendente'
      })) as SaldoPagarItem[];

      setSaldosList(dadosFormatados);
    } catch (error) {
      console.error("Erro ao processar dados:", error);
      toast.error("Ocorreu um erro ao processar os dados dos saldos");
    } finally {
      setLoading(false);
    }
  };

  const efetuarPagamento = async (id: string | number) => {
    try {
      const { error } = await supabase
        .from('Saldo a pagar')
        .update({
          valor_pago: saldosList.find(s => s.id === id)?.valor_total || 0,
          data_pagamento: new Date().toISOString().split('T')[0]
        })
        .eq('id', Number(id));

      if (error) {
        console.error("Erro ao efetuar pagamento:", error);
        toast.error("Erro ao registrar o pagamento");
        return;
      }

      // Atualizar estado local
      setSaldosList(saldos => saldos.map(saldo => {
        if (saldo.id === id) {
          return {
            ...saldo,
            valor_pago: saldo.valor_total,
            status: 'Pago',
            data_pagamento: new Date().toISOString().split('T')[0]
          };
        }
        return saldo;
      }));
      
      toast.success("Pagamento efetuado com sucesso!");
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      toast.error("Ocorreu um erro ao efetuar o pagamento");
    }
  };

  const filteredSaldos = saldosList.filter(saldo => 
    saldo.parceiro.toLowerCase().includes(searchTerm.toLowerCase()) ||
    saldo.contratos_associados.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPendente = filteredSaldos
    .filter(saldo => saldo.status !== 'Pago')
    .reduce((sum, saldo) => sum + (saldo.valor_total - (saldo.valor_pago || 0)), 0);

  return (
    <PageLayout>
      <PageHeader 
        title="Saldo a Pagar" 
        description="Gerencie os saldos a pagar para parceiros"
        icon={<CreditCard size={26} className="text-red-500" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Saldo a Pagar' }
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Pendente</p>
              <h3 className="text-2xl font-bold text-gray-900">{formataMoeda(totalPendente)}</h3>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <CreditCard size={20} className="text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="shadow-sm border">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <Input
                type="text"
                className="pl-10 w-full"
                placeholder="Buscar por parceiro ou contrato..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="flex items-center">
                <Filter size={16} className="mr-2" />
                Filtrar
              </Button>
              <Button variant="outline" className="flex items-center">
                <Download size={16} className="mr-2" />
                Exportar
              </Button>
              <Button variant="outline" className="flex items-center">
                <BarChart2 size={16} className="mr-2" />
                Relatórios
              </Button>
            </div>
          </div>
        </div>
        
        {loading ? (
          <LoadingPlaceholder className="m-4" />
        ) : saldosList.length === 0 ? (
          <Placeholder 
            title="Nenhum saldo a pagar encontrado" 
            description="Não há registros de saldos a pagar no momento."
            className="m-4"
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parceiro</TableHead>
                  <TableHead>Contratos</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Valor Pago</TableHead>
                  <TableHead>Saldo Restante</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSaldos.map((saldo) => (
                  <TableRow key={saldo.id}>
                    <TableCell className="font-medium">{saldo.parceiro}</TableCell>
                    <TableCell>{saldo.contratos_associados}</TableCell>
                    <TableCell>{formataMoeda(saldo.valor_total)}</TableCell>
                    <TableCell>{formataMoeda(saldo.valor_pago || 0)}</TableCell>
                    <TableCell>{formataMoeda(saldo.valor_total - (saldo.valor_pago || 0))}</TableCell>
                    <TableCell>{saldo.vencimento || 'N/A'}</TableCell>
                    <TableCell>
                      <div className={`px-2 py-1 text-xs rounded-full inline-flex items-center ${
                        saldo.status === 'Pago' 
                          ? 'bg-green-100 text-green-800' 
                          : saldo.status === 'Parcial'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {saldo.status}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {saldo.status !== 'Pago' && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => efetuarPagamento(saldo.id)}
                          className="text-green-600 hover:text-green-800 hover:bg-green-100"
                        >
                          <Check size={16} className="mr-1" />
                          Pagar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        <div className="p-4 border-t flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Mostrando {filteredSaldos.length} de {saldosList.length} saldos
          </p>
          <div className="flex space-x-2">
            <Button variant="outline" className="px-3 py-1" disabled>
              Anterior
            </Button>
            <Button className="px-3 py-1">
              1
            </Button>
            <Button variant="outline" className="px-3 py-1" disabled>
              Próximo
            </Button>
          </div>
        </div>
      </Card>
    </PageLayout>
  );
};

export default SaldoPagar;
