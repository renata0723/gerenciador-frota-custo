
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { FileText, PlusCircle, Search, Filter, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/utils/formatters';
import { Balancete } from '@/types/contabilidade';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import BalanceteForm from '@/components/contabilidade/BalanceteForm';

const BalancetePage: React.FC = () => {
  const [balancetes, setBalancetes] = useState<Balancete[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBalancetes();
  }, []);

  const fetchBalancetes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('balancete')
        .select('*')
        .order('periodo_fim', { ascending: false });

      if (error) throw error;

      setBalancetes(data as Balancete[] || []);
    } catch (error) {
      console.error('Erro ao buscar balancetes:', error);
      toast.error('Erro ao carregar balancetes');
    } finally {
      setLoading(false);
    }
  };

  const filteredBalancetes = balancetes.filter(
    (balancete) =>
      balancete.conta_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      balancete.conta_codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout>
      <PageHeader
        title="Balancete"
        description="Gerenciamento de balancetes contábeis"
        icon={<FileText className="h-6 w-6" />}
      />

      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-6">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Buscar por conta..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filtrar
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" /> Exportar
          </Button>
          <Button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-sistema-primary hover:bg-sistema-primary-dark"
          >
            <PlusCircle className="h-4 w-4" /> Novo Balancete
          </Button>
        </div>
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
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold">Balancetes</CardTitle>
          <CardDescription>Lista de todos os balancetes contábeis da empresa</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="spinner"></div>
              <p className="ml-2">Carregando balancetes...</p>
            </div>
          ) : filteredBalancetes.length === 0 ? (
            <div className="text-center py-10 border rounded-lg bg-gray-50">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                {searchTerm ? 'Nenhum resultado encontrado' : 'Nenhum balancete encontrado'}
              </h3>
              <p className="mt-1 text-gray-500">
                {searchTerm 
                  ? 'Tente usar outros termos de busca ou limpe o filtro.'
                  : 'Crie um novo balancete para começar a gerenciar suas contas.'}
              </p>
              {searchTerm && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSearchTerm('')}
                >
                  Limpar filtro
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:-mx-6">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="font-semibold text-gray-600">Período</TableHead>
                        <TableHead className="font-semibold text-gray-600">Código</TableHead>
                        <TableHead className="font-semibold text-gray-600">Conta</TableHead>
                        <TableHead className="font-semibold text-gray-600">Saldo Anterior</TableHead>
                        <TableHead className="font-semibold text-gray-600">Débitos</TableHead>
                        <TableHead className="font-semibold text-gray-600">Créditos</TableHead>
                        <TableHead className="font-semibold text-gray-600">Saldo Atual</TableHead>
                        <TableHead className="font-semibold text-gray-600">Status</TableHead>
                        <TableHead className="text-right font-semibold text-gray-600">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBalancetes.map((balancete) => (
                        <TableRow key={balancete.id} className="hover:bg-gray-50">
                          <TableCell className="whitespace-nowrap">
                            {new Date(balancete.periodo_inicio).toLocaleDateString()} - 
                            {new Date(balancete.periodo_fim).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="font-medium">{balancete.conta_codigo}</TableCell>
                          <TableCell>{balancete.conta_nome}</TableCell>
                          <TableCell>{formatCurrency(balancete.saldo_anterior)}</TableCell>
                          <TableCell className="text-green-600">{formatCurrency(balancete.debitos)}</TableCell>
                          <TableCell className="text-red-600">{formatCurrency(balancete.creditos)}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(balancete.saldo_atual)}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              balancete.status === 'ativo'
                                ? 'bg-green-100 text-green-800'
                                : balancete.status === 'fechado'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {balancete.status === 'ativo' ? 'Ativo' : 
                               balancete.status === 'fechado' ? 'Fechado' : 
                               balancete.status === 'pendente' ? 'Pendente' : 'Inativo'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-sistema-primary hover:text-sistema-primary-dark hover:bg-sistema-primary/10"
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
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default BalancetePage;
