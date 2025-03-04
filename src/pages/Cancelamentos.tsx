
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, FileBadge, Ban } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import FormularioCancelamento from '@/components/contratos/FormularioCancelamento';
import Placeholder, { LoadingPlaceholder } from '@/components/ui/Placeholder';

const Cancelamentos = () => {
  const [cancelamentos, setCancelamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [tipoDocumentoCancelamento, setTipoDocumentoCancelamento] = useState('Contrato');
  const [numeroDocumentoCancelamento, setNumeroDocumentoCancelamento] = useState('');
  const [activeTab, setActiveTab] = useState('contratos');

  useEffect(() => {
    carregarCancelamentos();
  }, []);

  const carregarCancelamentos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Cancelamentos')
        .select('*')
        .order('data_cancelamento', { ascending: false });

      if (error) throw error;
      setCancelamentos(data || []);
    } catch (error) {
      console.error('Erro ao carregar cancelamentos:', error);
      toast.error('Erro ao carregar lista de cancelamentos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredCancelamentos = cancelamentos.filter(item => {
    const termLower = searchTerm.toLowerCase();
    const matchesSearch = 
      item.tipo_documento?.toLowerCase().includes(termLower) ||
      String(item.numero_documento).toLowerCase().includes(termLower) ||
      item.motivo?.toLowerCase().includes(termLower) ||
      item.responsavel?.toLowerCase().includes(termLower);
    
    if (activeTab === 'contratos') {
      return matchesSearch && item.tipo_documento === 'Contrato';
    } else if (activeTab === 'notas') {
      return matchesSearch && item.tipo_documento === 'Nota Fiscal';
    } else {
      return matchesSearch;
    }
  });

  const formatarData = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  const handleExibirFormulario = (tipo: string, numero: string) => {
    setTipoDocumentoCancelamento(tipo);
    setNumeroDocumentoCancelamento(numero);
    setShowForm(true);
  };

  const handleCancelamentoRealizado = () => {
    setShowForm(false);
    carregarCancelamentos();
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Cancelamentos" 
        description="Gerencie e visualize documentos cancelados"
        icon={<Ban size={26} className="text-red-500" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Cancelamentos' }
        ]}
      />

      {showForm ? (
        <div className="mt-6">
          <FormularioCancelamento 
            tipo={tipoDocumentoCancelamento}
            numeroDocumento={numeroDocumentoCancelamento}
            onBack={() => setShowForm(false)}
            onCancelamentoRealizado={handleCancelamentoRealizado}
            onCancel={() => setShowForm(false)}
          />
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="Buscar cancelamentos..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleExibirFormulario('Contrato', '')}
                  >
                    Cancelar Contrato
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleExibirFormulario('Nota Fiscal', '')}
                  >
                    Cancelar Nota Fiscal
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="todos">Todos</TabsTrigger>
                  <TabsTrigger value="contratos">Contratos</TabsTrigger>
                  <TabsTrigger value="notas">Notas Fiscais</TabsTrigger>
                </TabsList>

                <TabsContent value="todos" className="mt-0">
                  {renderCancelamentosTable(filteredCancelamentos)}
                </TabsContent>
                <TabsContent value="contratos" className="mt-0">
                  {renderCancelamentosTable(filteredCancelamentos)}
                </TabsContent>
                <TabsContent value="notas" className="mt-0">
                  {renderCancelamentosTable(filteredCancelamentos)}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </PageLayout>
  );

  function renderCancelamentosTable(data: any[]) {
    if (loading) {
      return <LoadingPlaceholder />;
    }

    if (data.length === 0) {
      return (
        <Placeholder 
          icon={<FileBadge className="w-12 h-12 text-gray-300" />}
          title="Nenhum cancelamento encontrado"
          description="Não há registros de cancelamentos que correspondam aos critérios de busca."
        />
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Número</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Motivo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell>
                  <Badge variant={item.tipo_documento === 'Contrato' ? 'outline' : 'secondary'}>
                    {item.tipo_documento}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{item.numero_documento}</TableCell>
                <TableCell>{formatarData(item.data_cancelamento)}</TableCell>
                <TableCell>{item.responsavel}</TableCell>
                <TableCell className="max-w-md truncate">{item.motivo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
};

export default Cancelamentos;
