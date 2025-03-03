
import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { 
  Trash2, 
  RefreshCw, 
  AlertTriangle,
  Database,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { clearAllLocalData, getLocalStorageUsage } from '@/utils/dbCleanup';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { clearAllLogs } from '@/utils/logOperations';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Utilitarios = () => {
  const [isClearing, setIsClearing] = useState(false);
  const [storageInfo, setStorageInfo] = useState(() => getLocalStorageUsage());
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [actionPending, setActionPending] = useState<string | null>(null);
  const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  // Verificar conexão com Supabase ao carregar
  React.useEffect(() => {
    checkSupabaseConnection();
  }, []);

  const checkSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from('Motoristas').select('count', { count: 'exact', head: true });
      if (error) throw error;
      setSupabaseStatus('connected');
    } catch (err) {
      console.error('Erro ao conectar com Supabase:', err);
      setSupabaseStatus('error');
    }
  };

  const handleClearLocalData = () => {
    setActionPending('clearLocal');
    setIsConfirmDialogOpen(true);
  };

  const handleResetSupabaseData = () => {
    setActionPending('resetSupabase');
    setIsConfirmDialogOpen(true);
  };

  const performAction = async () => {
    if (actionPending === 'clearLocal') {
      await clearLocalStorage();
    } else if (actionPending === 'resetSupabase') {
      await resetSupabaseData();
    }
    
    setActionPending(null);
  };

  const clearLocalStorage = async () => {
    setIsClearing(true);
    try {
      clearAllLocalData();
      clearAllLogs();
      toast.success('Todos os dados locais foram limpos com sucesso');
      
      // Atualizar informações de armazenamento
      setStorageInfo(getLocalStorageUsage());
      
      // Atualizar a página após 2 segundos para refletir as mudanças
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      toast.error('Ocorreu um erro ao limpar os dados locais');
    } finally {
      setIsClearing(false);
    }
  };

  const resetSupabaseData = async () => {
    setIsClearing(true);
    try {
      if (supabaseStatus !== 'connected') {
        throw new Error('Não foi possível conectar ao Supabase');
      }
      
      // Tentar limpar dados de várias tabelas
      const tables = [
        'Motoristas',
        'Veiculos',
        'Contratos',
        'Proprietarios',
        'Notas Fiscais',
        'Abastecimentos',
        'Manutenção',
        'Canhoto',
        'Despesas Gerais',
        'Saldo a pagar',
        'TiposCombustivel',
        'VeiculoProprietarios'
      ];
      
      for (const table of tables) {
        const { error } = await supabase.from(table).delete().neq('id', -1);
        if (error && error.code !== '42P01') {  // Ignora erros de tabela não existente
          console.error(`Erro ao limpar tabela ${table}:`, error);
        }
      }
      
      toast.success('Dados do Supabase foram reiniciados com sucesso');
      
      // Limpar também o localStorage para consistência
      clearAllLocalData();
      clearAllLogs();
      
      // Atualizar informações de armazenamento
      setStorageInfo(getLocalStorageUsage());
      
      // Atualizar a página após 2 segundos para refletir as mudanças
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Erro ao resetar dados do Supabase:', error);
      toast.error(`Erro ao resetar dados do Supabase: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Utilitários do Sistema" 
        description="Ferramentas de manutenção e controle do sistema"
        icon={<Database className="h-8 w-8 text-sistema-primary" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Utilitários' }
        ]}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-sistema-primary" /> 
              Armazenamento Local
            </CardTitle>
            <CardDescription>
              Gerenciamento de dados armazenados no navegador
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Uso total:</span>
                  <span className="text-sm">{storageInfo.formattedSize}</span>
                </div>
                <Progress value={Math.min(storageInfo.totalSize / 5000000 * 100, 100)} className="h-2" />
              </div>
              
              <div className="border rounded-md p-3 space-y-2">
                <h4 className="text-sm font-medium">Detalhes por categoria:</h4>
                {Object.entries(storageInfo.byKey).map(([key, size]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span>{key}:</span>
                    <span>{(size / 1024).toFixed(2)} KB</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="destructive" 
              onClick={handleClearLocalData}
              disabled={isClearing}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar Dados Locais
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setStorageInfo(getLocalStorageUsage());
                toast.info('Informações de armazenamento atualizadas');
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" /> 
              Reiniciar Sistema
            </CardTitle>
            <CardDescription>
              Limpar todos os dados e reiniciar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-md p-4 bg-amber-50 dark:bg-amber-950/20">
                <h4 className="font-medium text-amber-800 dark:text-amber-400 mb-2">Atenção!</h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Esta operação irá limpar todos os dados no banco de dados Supabase e também os dados locais.
                  Use esta opção apenas quando necessário, pois a ação não pode ser desfeita.
                </p>
              </div>
              
              <div className="flex items-center p-3 border rounded-md">
                <div className="mr-3">
                  {supabaseStatus === 'checking' && (
                    <RefreshCw className="h-5 w-5 text-gray-400 animate-spin" />
                  )}
                  {supabaseStatus === 'connected' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {supabaseStatus === 'error' && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium">Status da Conexão:</h4>
                  <p className="text-xs text-gray-500">
                    {supabaseStatus === 'checking' && 'Verificando conexão com o banco de dados...'}
                    {supabaseStatus === 'connected' && 'Conectado ao banco de dados Supabase'}
                    {supabaseStatus === 'error' && 'Erro ao conectar com o banco de dados Supabase'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={handleResetSupabaseData}
              disabled={isClearing || supabaseStatus !== 'connected'}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reiniciar Todos os Dados
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Operação</AlertDialogTitle>
            <AlertDialogDescription>
              {actionPending === 'clearLocal' ? 
                'Tem certeza que deseja limpar todos os dados locais? Esta ação não pode ser desfeita.' :
                'Tem certeza que deseja reiniciar todos os dados do sistema? Esta operação irá limpar tanto os dados locais quanto os dados no banco de dados Supabase. Esta ação não pode ser desfeita.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={performAction} className="bg-red-600 hover:bg-red-700">
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
};

export default Utilitarios;
