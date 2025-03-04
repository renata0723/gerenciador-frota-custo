
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/utils/formatters';
import { Balancete } from '@/types/contabilidade';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import BalanceteForm from '@/components/contabilidade/BalanceteForm';

const BalancetePage: React.FC = () => {
  const [balancetes, setBalancetes] = useState<Balancete[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBalancetes();
  }, []);

  const fetchBalancetes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Balancete')
        .select('*')
        .order('periodo_fim', { ascending: false });

      if (error) throw error;

      setBalancetes(data || []);
    } catch (error) {
      console.error('Erro ao buscar balancetes:', error);
      toast.error('Erro ao carregar balancetes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Balancete"
        description="Gerenciamento de balancetes contábeis"
        icon={<FileText className="h-6 w-6" />}
      />

      <div className="mb-6">
        <Button onClick={() => setShowForm(true)}>
          Novo Balancete
        </Button>
      </div>

      {showForm && (
        <BalanceteForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchBalancetes();
          }}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Balancetes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p>Carregando balancetes...</p>
            </div>
          ) : balancetes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                Nenhum balancete encontrado
              </h3>
              <p className="mt-1 text-gray-500">
                Crie um novo balancete para começar.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Período</TableHead>
                    <TableHead>Conta</TableHead>
                    <TableHead>Saldo Anterior</TableHead>
                    <TableHead>Débitos</TableHead>
                    <TableHead>Créditos</TableHead>
                    <TableHead>Saldo Atual</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {balancetes.map((balancete) => (
                    <TableRow key={balancete.id}>
                      <TableCell>
                        {new Date(balancete.periodo_inicio).toLocaleDateString()} - 
                        {new Date(balancete.periodo_fim).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{balancete.conta_nome}</TableCell>
                      <TableCell>{formatCurrency(balancete.saldo_anterior)}</TableCell>
                      <TableCell>{formatCurrency(balancete.debitos)}</TableCell>
                      <TableCell>{formatCurrency(balancete.creditos)}</TableCell>
                      <TableCell>{formatCurrency(balancete.saldo_atual)}</TableCell>
                      <TableCell>{balancete.status}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/contabilidade/balancete/${balancete.id}`)}
                        >
                          Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default BalancetePage;
