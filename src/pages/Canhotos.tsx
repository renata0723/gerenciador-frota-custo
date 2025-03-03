
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CanhotoForm from '@/components/canhotos/CanhotoForm';
import PesquisaDocumentos from '@/components/canhotos/PesquisaDocumentos';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import PageHeader from '@/components/ui/PageHeader';
import { Canhoto, CanhotoPendente } from '@/types/canhoto';
import { CanhotoStatus } from '@/utils/constants';
import { Search, FileDown, FileUp, Download } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Canhotos: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pendentes');
  const [canhotos, setCanhotos] = useState<Canhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPesquisaDialogOpen, setIsPesquisaDialogOpen] = useState(false);
  const [selectedCanhoto, setSelectedCanhoto] = useState<Partial<Canhoto> | null>(null);
  const [canhotoPendente, setCanhotoPendente] = useState<CanhotoPendente | null>(null);

  const loadCanhotos = async () => {
    setIsLoading(true);
    
    try {
      const status = activeTab === 'pendentes' ? 'Pendente' : 'Recebido';
      
      const { data, error } = await supabase
        .from('Canhoto')
        .select('*')
        .eq('status', status);
        
      if (error) {
        console.error('Erro ao carregar canhotos:', error);
        toast.error('Erro ao carregar dados dos canhotos');
        return;
      }
      
      // Garantir que o status seja um tipo válido antes de definir o estado
      const validCanhotos = (data || []).map(canhoto => ({
        ...canhoto,
        status: canhoto.status as CanhotoStatus
      }));
      
      setCanhotos(validCanhotos);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Ocorreu um erro ao processar a solicitação');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCanhotos();
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleEditCanhoto = (canhoto: Canhoto) => {
    setSelectedCanhoto(canhoto);
    setIsDialogOpen(true);
  };

  const handleSaveCanhoto = async (data: Partial<Canhoto>) => {
    try {
      if (selectedCanhoto?.id) {
        // Atualização de canhoto existente
        const { error } = await supabase
          .from('Canhoto')
          .update({
            data_recebimento_canhoto: data.data_recebimento_canhoto,
            data_entrega_cliente: data.data_entrega_cliente,
            responsavel_recebimento: data.responsavel_recebimento,
            data_programada_pagamento: data.data_programada_pagamento,
            numero_nota_fiscal: data.numero_nota_fiscal,
            status: 'Recebido' as CanhotoStatus
          })
          .eq('id', selectedCanhoto.id);
          
        if (error) {
          console.error('Erro ao atualizar canhoto:', error);
          toast.error('Erro ao atualizar canhoto');
          return;
        }
        
        toast.success('Canhoto atualizado com sucesso!');
      } else if (canhotoPendente) {
        // Inserção de novo canhoto a partir de pesquisa
        const { error } = await supabase
          .from('Canhoto')
          .insert({
            contrato_id: canhotoPendente.contrato_id,
            cliente: canhotoPendente.cliente,
            motorista: canhotoPendente.motorista,
            data_entrega_cliente: data.data_entrega_cliente,
            data_recebimento_canhoto: data.data_recebimento_canhoto,
            responsavel_recebimento: data.responsavel_recebimento,
            data_programada_pagamento: data.data_programada_pagamento,
            numero_nota_fiscal: data.numero_nota_fiscal,
            status: 'Recebido' as CanhotoStatus
          });
          
        if (error) {
          console.error('Erro ao cadastrar canhoto:', error);
          toast.error('Erro ao cadastrar canhoto');
          return;
        }
        
        toast.success('Canhoto registrado com sucesso!');
      }
      
      setIsDialogOpen(false);
      setIsPesquisaDialogOpen(false);
      setSelectedCanhoto(null);
      setCanhotoPendente(null);
      loadCanhotos();
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Ocorreu um erro ao processar a solicitação');
    }
  };

  const handlePesquisaResult = (resultado: CanhotoPendente) => {
    setCanhotoPendente(resultado);
    setIsPesquisaDialogOpen(false);
    setIsDialogOpen(true);
  };

  const formatarData = (data: string | null | undefined) => {
    if (!data) return '-';
    try {
      return new Date(data).toLocaleDateString('pt-BR');
    } catch (e) {
      return data;
    }
  };

  const exportarParaPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Adicionar cabeçalho com logo e dados da empresa
      doc.setFontSize(20);
      doc.text('SSLOG Transportes LTDA', 105, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.text('CNPJ: 44.712.877/0001-80', 105, 30, { align: 'center' });
      doc.text('Rua Vagner Luis Boscardin, 7015 - Aguas Claras - Piraquara/PR', 105, 35, { align: 'center' });
      
      doc.setFontSize(16);
      doc.text('Relatório de Canhotos Recebidos', 105, 50, { align: 'center' });
      doc.setFontSize(10);
      doc.text(`Data de geração: ${new Date().toLocaleDateString('pt-BR')}`, 105, 55, { align: 'center' });
      
      // Converter os dados para o formato esperado pelo autoTable
      const tableData = canhotos.map(canhoto => [
        canhoto.contrato_id,
        canhoto.cliente,
        canhoto.motorista,
        canhoto.numero_nota_fiscal || '-',
        formatarData(canhoto.data_entrega_cliente),
        formatarData(canhoto.data_recebimento_canhoto),
        canhoto.responsavel_recebimento || '-'
      ]);
      
      // @ts-ignore - jsPDF-AutoTable é adicionado ao objeto jsPDF
      doc.autoTable({
        startY: 65,
        head: [['Contrato', 'Cliente', 'Motorista', 'Nota Fiscal', 'Data Entrega', 'Data Recebimento', 'Responsável']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [41, 80, 149], textColor: 255 }
      });
      
      // Adicionar rodapé
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Página ${i} de ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
        doc.text(`SSLOG Transportes LTDA - Sistema de Controle de Frotas e Logística`, 105, doc.internal.pageSize.height - 5, { align: 'center' });
      }
      
      // Salvar o PDF
      doc.save('canhotos-recebidos.pdf');
      toast.success('Relatório exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      toast.error('Erro ao gerar o relatório em PDF');
    }
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Canhotos" 
        description="Gerencie o recebimento de canhotos dos contratos"
      />
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1"></div>
        <Button 
          onClick={() => setIsPesquisaDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Search size={16} />
          Pesquisar por Documento
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
          <TabsTrigger value="recebidos">Recebidos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pendentes" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Canhotos Pendentes</h2>
            
            {isLoading ? (
              <p>Carregando...</p>
            ) : canhotos.length === 0 ? (
              <p>Nenhum canhoto pendente encontrado.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contrato</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motorista</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nota Fiscal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Entrega</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {canhotos.map((canhoto) => (
                      <tr key={canhoto.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{canhoto.contrato_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{canhoto.cliente}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{canhoto.motorista}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{canhoto.numero_nota_fiscal || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatarData(canhoto.data_entrega_cliente)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditCanhoto(canhoto)}
                            className="flex items-center gap-1"
                          >
                            <FileUp size={14} />
                            Registrar Recebimento
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="recebidos" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Canhotos Recebidos</h2>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={exportarParaPDF}
              >
                <FileDown size={16} />
                Exportar Relatório
              </Button>
            </div>
            
            {isLoading ? (
              <p>Carregando...</p>
            ) : canhotos.length === 0 ? (
              <p>Nenhum canhoto recebido encontrado.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contrato</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motorista</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nota Fiscal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Entrega</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Recebimento</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {canhotos.map((canhoto) => (
                      <tr key={canhoto.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{canhoto.contrato_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{canhoto.cliente}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{canhoto.motorista}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{canhoto.numero_nota_fiscal || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatarData(canhoto.data_entrega_cliente)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatarData(canhoto.data_recebimento_canhoto)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{canhoto.responsavel_recebimento || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Dialog para Registrar Recebimento */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Registrar Recebimento de Canhoto</DialogTitle>
          </DialogHeader>
          <CanhotoForm 
            dados={selectedCanhoto || undefined}
            contratoId={canhotoPendente?.contrato_id}
            dataEntrega={canhotoPendente?.data_entrega}
            onSubmit={handleSaveCanhoto}
            onCancel={() => {
              setIsDialogOpen(false);
              setSelectedCanhoto(null);
              setCanhotoPendente(null);
            }}
          />
        </DialogContent>
      </Dialog>
      
      {/* Dialog para Pesquisa de Documentos */}
      <Dialog open={isPesquisaDialogOpen} onOpenChange={setIsPesquisaDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Pesquisar Documento</DialogTitle>
          </DialogHeader>
          <div className="p-1">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Informe os dados do documento para registrar o recebimento do canhoto.
              Você só precisa preencher um dos campos para localizar o documento.
            </p>
            <PesquisaDocumentos onResultadoEncontrado={handlePesquisaResult} />
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Canhotos;
