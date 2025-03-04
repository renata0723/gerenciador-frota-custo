
import React, { useState, useEffect } from 'react';
import NewPageLayout from '@/components/layout/NewPageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Users, Plus, Search, Edit, UserCheck, Trash2, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ParceiroInfo } from '@/types/saldoPagar';
import CadastroParceiro from '@/components/parceiros/CadastroParceiro';
import Placeholder, { LoadingPlaceholder } from '@/components/ui/Placeholder';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import DadosBancariosParceiro from '@/components/saldo-pagar/DadosBancariosParceiro';

const Parceiros = () => {
  const [parceiros, setParceiros] = useState<ParceiroInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [parceiroSelecionado, setParceiroSelecionado] = useState<ParceiroInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [parceiroParaExcluir, setParceiroParaExcluir] = useState<ParceiroInfo | null>(null);
  const [verDetalhesOpen, setVerDetalhesOpen] = useState(false);

  useEffect(() => {
    carregarParceiros();
  }, []);

  const carregarParceiros = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Proprietarios')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;
      setParceiros(data || []);
    } catch (error) {
      console.error('Erro ao carregar parceiros:', error);
      toast.error('Erro ao carregar a lista de parceiros');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveParceiro = (parceiro: ParceiroInfo) => {
    carregarParceiros();
    setDialogOpen(false);
    setParceiroSelecionado(null);
  };

  const handleEditParceiro = (parceiro: ParceiroInfo) => {
    setParceiroSelecionado(parceiro);
    setDialogOpen(true);
  };

  const handleExcluirParceiro = (parceiro: ParceiroInfo) => {
    setParceiroParaExcluir(parceiro);
    setConfirmDeleteOpen(true);
  };

  const confirmarExclusao = async () => {
    if (!parceiroParaExcluir) return;
    
    try {
      const { error } = await supabase
        .from('Proprietarios')
        .delete()
        .eq('id', parceiroParaExcluir.id);

      if (error) throw error;

      toast.success('Parceiro excluído com sucesso');
      carregarParceiros();
    } catch (error) {
      console.error('Erro ao excluir parceiro:', error);
      toast.error('Não foi possível excluir o parceiro. Ele pode estar vinculado a outros registros.');
    } finally {
      setConfirmDeleteOpen(false);
      setParceiroParaExcluir(null);
    }
  };

  const handleVerDetalhes = (parceiro: ParceiroInfo) => {
    setParceiroSelecionado(parceiro);
    setVerDetalhesOpen(true);
  };

  const filteredParceiros = parceiros.filter(parceiro => 
    parceiro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (parceiro.documento && parceiro.documento.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <NewPageLayout>
      <PageHeader 
        title="Parceiros" 
        description="Gerencie os parceiros da empresa"
        icon={<Users size={26} className="text-blue-500" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Parceiros' }
        ]}
        actions={
          <Button onClick={() => { setParceiroSelecionado(null); setDialogOpen(true); }}>
            <Plus size={16} className="mr-2" />
            Novo Parceiro
          </Button>
        }
      />

      <Card className="mt-6 p-4 border shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              className="pl-10"
              placeholder="Buscar parceiros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Exportar
          </Button>
        </div>

        {loading ? (
          <LoadingPlaceholder />
        ) : filteredParceiros.length === 0 ? (
          <Placeholder 
            title="Nenhum parceiro encontrado" 
            description="Você ainda não tem parceiros cadastrados ou nenhum resultado corresponde à busca."
            buttonText="Adicionar Parceiro"
            onButtonClick={() => { setParceiroSelecionado(null); setDialogOpen(true); }}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF/CNPJ</TableHead>
                  <TableHead>Detalhes Bancários</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParceiros.map((parceiro) => (
                  <TableRow key={parceiro.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{parceiro.nome}</TableCell>
                    <TableCell>{parceiro.documento || 'Não informado'}</TableCell>
                    <TableCell>
                      {parceiro.dadosBancarios ? (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleVerDetalhes(parceiro)}
                        >
                          <UserCheck size={16} className="mr-1 text-green-600" />
                          Ver detalhes
                        </Button>
                      ) : (
                        <span className="text-gray-500 text-sm">Não cadastrados</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditParceiro(parceiro)}
                        >
                          <Edit size={14} className="mr-1" />
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleExcluirParceiro(parceiro)}
                        >
                          <Trash2 size={14} className="mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Dialog para adicionar/editar parceiro */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <CadastroParceiro 
            onSave={handleSaveParceiro}
            onCancel={() => setDialogOpen(false)}
            initialData={parceiroSelecionado || undefined}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog para ver detalhes bancários */}
      <Dialog open={verDetalhesOpen} onOpenChange={setVerDetalhesOpen}>
        <DialogContent className="max-w-md">
          {parceiroSelecionado && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">{parceiroSelecionado.nome}</h2>
              {parceiroSelecionado.documento && (
                <p className="text-gray-600">CPF/CNPJ: {parceiroSelecionado.documento}</p>
              )}
              <DadosBancariosParceiro parceiro={parceiroSelecionado} />
              <div className="pt-3 flex justify-end">
                <Button onClick={() => setVerDetalhesOpen(false)}>Fechar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação para excluir */}
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isto irá permanentemente excluir o parceiro
              <strong> {parceiroParaExcluir?.nome}</strong> e remover seus dados do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarExclusao} className="bg-red-500 hover:bg-red-600">
              Sim, excluir parceiro
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </NewPageLayout>
  );
};

export default Parceiros;
