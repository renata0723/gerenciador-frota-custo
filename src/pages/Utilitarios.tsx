
import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trash2, Database, Download, FileWarning } from 'lucide-react';
import { toast } from 'sonner';
import { clearAllLocalData, clearLocalDataByKey, getLocalStorageUsage, clearAllSupabaseTables, clearSupabaseTable } from '@/utils/dbCleanup';
import { SUPABASE_TABLES } from '@/utils/constants';

const Utilitarios = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTable, setDialogTable] = useState('');
  const [dialogAction, setDialogAction] = useState<'limpar' | 'resetar' | 'limparTudo'>('limpar');
  const [selectedTable, setSelectedTable] = useState('');
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCheckStorage = () => {
    const storageUsage = getLocalStorageUsage();
    setUsage(storageUsage);
    toast.info(`Tamanho total dos dados: ${storageUsage.formattedSize}`);
  };

  const handleClearTableConfirm = () => {
    setDialogOpen(false);
    setLoading(true);

    if (dialogAction === 'limparTudo') {
      clearAllLocalData();
      toast.success('Todos os dados locais foram removidos');
      setLoading(false);
      return;
    }

    if (!selectedTable) {
      toast.error('Selecione uma tabela para limpar');
      setLoading(false);
      return;
    }

    const success = clearLocalDataByKey(selectedTable);
    
    if (success) {
      toast.success(`Dados de ${selectedTable} removidos com sucesso`);
    } else {
      toast.error(`Erro ao remover dados de ${selectedTable}`);
    }
    
    setLoading(false);
  };

  const handleClearTable = (table: string) => {
    setSelectedTable(table);
    setDialogTable(table);
    setDialogAction('limpar');
    setDialogOpen(true);
  };

  const handleClearAllTables = () => {
    setDialogAction('limparTudo');
    setDialogOpen(true);
  };

  const handleClearSupabaseTable = async (tableName: string) => {
    setLoading(true);
    const result = await clearSupabaseTable(tableName as any);
    
    if (result) {
      toast.success(`Tabela ${tableName} limpa com sucesso no Supabase`);
    } else {
      toast.error(`Erro ao limpar tabela ${tableName} no Supabase`);
    }
    
    setLoading(false);
  };

  const handleClearAllSupabaseTables = async () => {
    setLoading(true);
    const result = await clearAllSupabaseTables();
    setLoading(false);
    
    if (result) {
      toast.success('Todas as tabelas do Supabase foram limpas com sucesso');
    }
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Utilitários de Sistema" 
        description="Ferramentas para manutenção e limpeza de dados"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Limpeza de Dados Locais
            </CardTitle>
            <CardDescription>
              Remova dados armazenados no navegador para limpar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="table-select">Selecione a tabela para limpar</Label>
              <Select value={selectedTable} onValueChange={setSelectedTable}>
                <SelectTrigger id="table-select">
                  <SelectValue placeholder="Selecione uma tabela" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="controlfrota_notas_fiscais">Notas Fiscais</SelectItem>
                  <SelectItem value="contratos">Contratos</SelectItem>
                  <SelectItem value="canhotos">Canhotos</SelectItem>
                  <SelectItem value="motoristas">Motoristas</SelectItem>
                  <SelectItem value="proprietarios">Proprietários</SelectItem>
                  <SelectItem value="veiculos">Veículos</SelectItem>
                  <SelectItem value="abastecimentos">Abastecimentos</SelectItem>
                  <SelectItem value="manutencoes">Manutenções</SelectItem>
                  <SelectItem value="despesas">Despesas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="destructive" 
              className="w-full" 
              disabled={!selectedTable || loading}
              onClick={() => handleClearTable(selectedTable)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Limpar Tabela Selecionada
            </Button>
            
            <Button 
              variant="destructive" 
              className="w-full" 
              disabled={loading}
              onClick={handleClearAllTables}
            >
              <FileWarning className="mr-2 h-4 w-4" />
              Limpar Todos os Dados
            </Button>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleCheckStorage}
            >
              <Download className="mr-2 h-4 w-4" />
              Verificar Uso de Armazenamento
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Limpeza de Dados no Supabase
            </CardTitle>
            <CardDescription>
              Remova dados armazenados no servidor para limpar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="supabase-table-select">Selecione a tabela para limpar</Label>
              <Select value={selectedTable} onValueChange={setSelectedTable}>
                <SelectTrigger id="supabase-table-select">
                  <SelectValue placeholder="Selecione uma tabela" />
                </SelectTrigger>
                <SelectContent>
                  {SUPABASE_TABLES.map((table) => (
                    <SelectItem key={table} value={table}>{table}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="destructive" 
              className="w-full" 
              disabled={!selectedTable || loading}
              onClick={() => handleClearSupabaseTable(selectedTable)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Limpar Tabela Selecionada no Supabase
            </Button>
            
            <Button 
              variant="destructive" 
              className="w-full" 
              disabled={loading}
              onClick={handleClearAllSupabaseTables}
            >
              <FileWarning className="mr-2 h-4 w-4" />
              Limpar Todas as Tabelas no Supabase
            </Button>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-gray-500 italic">
              Atenção: A limpeza de dados no servidor é permanente e não pode ser desfeita.
              Tenha certeza antes de prosseguir.
            </p>
          </CardFooter>
        </Card>
      </div>
      
      {usage && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Uso de Armazenamento Local</CardTitle>
            <CardDescription>
              Tamanho total dos dados: {usage.formattedSize}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(usage.byKey).map(([key, size]: [string, any]) => (
                <div key={key} className="flex justify-between items-center border-b pb-2">
                  <span>{key}</span>
                  <span>{(size / 1024).toFixed(2)} KB</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar limpeza de dados</DialogTitle>
            <DialogDescription>
              {dialogAction === 'limparTudo' 
                ? 'Você tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.'
                : `Você tem certeza que deseja limpar os dados da tabela ${dialogTable}? Esta ação não pode ser desfeita.`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleClearTableConfirm}>
              Limpar Dados
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Utilitarios;
