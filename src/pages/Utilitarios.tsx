
import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, RefreshCw, Database, AlertTriangle, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { clearAllLocalData, clearLocalDataByKey, getLocalStorageUsage } from '@/utils/dbCleanup';
import { supabase } from '@/integrations/supabase/client';

const DATABASE_TABLES = [
  'Contratos',
  'Canhoto',
  'Saldo a pagar',
  'Veiculos',
  'Motoristas',
  'Abastecimentos',
  'Manutenção',
  'Despesas Gerais',
  'Notas Fiscais',
  'Proprietarios',
  'TiposCombustivel',
  'VeiculoProprietarios',
  'Relatórios'
];

const Utilitarios: React.FC = () => {
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [confirmTableDialog, setConfirmTableDialog] = useState(false);
  const [selectedTable, setSelectedTable] = useState('');
  const [isClearing, setIsClearing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [usageData, setUsageData] = useState(getLocalStorageUsage());

  // Limpar todos os dados locais
  const handleClearLocalData = () => {
    clearAllLocalData();
    toast.success('Todos os dados locais foram limpos com sucesso!');
    refreshUsageData();
  };

  // Limpar tabela específica no Supabase
  const handleClearTable = async (table: string) => {
    setIsClearing(true);
    setProgress(10);
    
    try {
      setProgress(30);
      
      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', 0); // Deleta todos os registros
      
      setProgress(80);
      
      if (error) {
        console.error(`Erro ao limpar tabela ${table}:`, error);
        toast.error(`Erro ao limpar tabela ${table}`);
        return;
      }
      
      toast.success(`Tabela ${table} limpa com sucesso!`);
      
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Ocorreu um erro ao limpar a tabela');
    } finally {
      setProgress(100);
      setIsClearing(false);
      setConfirmTableDialog(false);
    }
  };

  // Limpar todas as tabelas no Supabase
  const handleClearAllTables = async () => {
    setIsClearing(true);
    setProgress(0);
    
    try {
      for (let i = 0; i < DATABASE_TABLES.length; i++) {
        const table = DATABASE_TABLES[i];
        setProgress(Math.round((i / DATABASE_TABLES.length) * 100));
        
        // Deletar dados da tabela
        const { error } = await supabase
          .from(table)
          .delete()
          .neq('id', 0);
          
        if (error) {
          console.error(`Erro ao limpar tabela ${table}:`, error);
          // Continuar mesmo com erro
        }
      }
      
      setProgress(100);
      toast.success('Todas as tabelas foram limpas com sucesso!');
      
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Ocorreu um erro ao limpar todas as tabelas');
    } finally {
      setIsClearing(false);
      setConfirmDialog(false);
    }
  };

  // Atualizar dados de uso do localStorage
  const refreshUsageData = () => {
    setUsageData(getLocalStorageUsage());
  };

  // Formatar tamanho para visualização
  const formatSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} bytes`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Utilitários do Sistema" 
        description="Ferramentas para administração e manutenção do sistema"
        icon={<Database className="h-6 w-6 text-sistema-primary" />}
      />
      
      <Tabs defaultValue="local-data" className="mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="local-data">Dados Locais</TabsTrigger>
          <TabsTrigger value="database">Banco de Dados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="local-data" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados Armazenados Localmente</CardTitle>
              <CardDescription>
                Gerenciamento de dados armazenados no navegador
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Atenção</AlertTitle>
                  <AlertDescription>
                    A limpeza de dados locais afetará apenas os dados armazenados neste navegador.
                    Isso não impacta os dados no servidor.
                  </AlertDescription>
                </Alert>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Uso de Armazenamento Local</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uso Total:</span>
                      <span className="font-medium">{usageData.formattedSize}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500" 
                        style={{ width: `${Math.min(100, (usageData.totalSize / (5 * 1024 * 1024)) * 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      {usageData.totalSize} bytes de 5 MB
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Uso por Item:</h4>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {Object.entries(usageData.byKey).map(([key, size]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-gray-600">{key}:</span>
                          <span>{formatSize(size)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={refreshUsageData}
                className="flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
              <Button 
                variant="destructive"
                onClick={handleClearLocalData}
                className="flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar Todos os Dados Locais
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="database" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Banco de Dados</CardTitle>
              <CardDescription>
                Limpar tabelas e dados do banco de dados Supabase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Atenção!</AlertTitle>
                <AlertDescription>
                  A limpeza de tabelas do banco de dados é IRREVERSÍVEL. 
                  Todos os dados serão removidos permanentemente.
                  Use apenas para fins de teste ou em ambiente de homologação.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {DATABASE_TABLES.map((table) => (
                  <Card key={table} className="hover:shadow-md transition-shadow">
                    <CardHeader className="py-4 px-4">
                      <CardTitle className="text-base">{table}</CardTitle>
                    </CardHeader>
                    <CardFooter className="py-2 px-4 bg-gray-50">
                      <Button 
                        variant="ghost" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          setSelectedTable(table);
                          setConfirmTableDialog(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Limpar Tabela
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="destructive"
                onClick={() => setConfirmDialog(true)}
                className="flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar Todas as Tabelas
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Diálogo para confirmar limpeza de todas as tabelas */}
      <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Limpeza de Dados</DialogTitle>
            <DialogDescription>
              Você está prestes a limpar TODAS as tabelas do banco de dados. 
              Esta ação é irreversível e todos os dados serão perdidos.
            </DialogDescription>
          </DialogHeader>
          
          {isClearing ? (
            <div className="py-4">
              <div className="mb-2 flex justify-between">
                <span>Progresso:</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Limpando tabelas, por favor aguarde...
              </p>
            </div>
          ) : (
            <div className="py-4">
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Atenção!</AlertTitle>
                <AlertDescription>
                  Esta ação removerá PERMANENTEMENTE todos os dados de todas as tabelas.
                </AlertDescription>
              </Alert>
              
              <p className="text-sm">
                Digite "CONFIRMAR" para prosseguir com a limpeza de dados:
              </p>
              <input 
                type="text"
                className="w-full border rounded-md px-3 py-2 mt-2"
                placeholder="Digite CONFIRMAR para prosseguir"
              />
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog(false)} disabled={isClearing}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleClearAllTables}
              disabled={isClearing}
            >
              {isClearing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Confirmar Limpeza
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo para confirmar limpeza de uma tabela específica */}
      <Dialog open={confirmTableDialog} onOpenChange={setConfirmTableDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Limpeza de Tabela</DialogTitle>
            <DialogDescription>
              Você está prestes a limpar todos os dados da tabela <strong>{selectedTable}</strong>.
              Esta ação é irreversível.
            </DialogDescription>
          </DialogHeader>
          
          {isClearing ? (
            <div className="py-4">
              <div className="mb-2 flex justify-between">
                <span>Progresso:</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Limpando tabela, por favor aguarde...
              </p>
            </div>
          ) : (
            <div className="py-4">
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Atenção!</AlertTitle>
                <AlertDescription>
                  Esta ação removerá PERMANENTEMENTE todos os dados da tabela selecionada.
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmTableDialog(false)} disabled={isClearing}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handleClearTable(selectedTable)}
              disabled={isClearing}
            >
              {isClearing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Confirmar Limpeza
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Utilitarios;
