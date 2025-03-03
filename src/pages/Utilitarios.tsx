
import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Database, FileCog, FileWarning, HardDrive, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { calculateLocalStorageSize, cleanupAllTables } from '@/utils/dbCleanup';
import { logOperation } from '@/utils/logOperations';

const Utilitarios = () => {
  const [localStorageSize, setLocalStorageSize] = useState<{ totalSize: string, items: { key: string, size: string }[] } | null>(null);
  const [showCleanupDialog, setShowCleanupDialog] = useState(false);
  
  useEffect(() => {
    refreshStorageSize();
  }, []);
  
  const refreshStorageSize = () => {
    const size = calculateLocalStorageSize();
    setLocalStorageSize(size);
  };
  
  const handleCleanAllData = () => {
    try {
      cleanupAllTables();
      toast.success('Todos os dados foram limpos com sucesso!');
      logOperation('Utilitários', 'Limpeza completa de dados', true);
      refreshStorageSize();
      setShowCleanupDialog(false);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Ocorreu um erro ao limpar os dados');
      logOperation('Utilitários', 'Erro na limpeza de dados', String(error));
    }
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Utilitários do Sistema" 
        description="Ferramentas de manutenção e suporte do sistema"
        icon={<FileCog size={26} className="text-sistema-primary" />}
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HardDrive className="mr-2 h-5 w-5" />
              Armazenamento Local
            </CardTitle>
            <CardDescription>
              Dados armazenados no navegador
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tamanho total:</span>
                <Badge variant="outline" className="text-lg py-1 px-3">
                  {localStorageSize?.totalSize || '0 B'}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Por tabela:</h4>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {localStorageSize?.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm px-2 py-1 rounded even:bg-muted/30">
                      <span className="truncate max-w-[170px]">{item.key}</span>
                      <span className="text-right">{item.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={refreshStorageSize}
              className="gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
            
            <Dialog open={showCleanupDialog} onOpenChange={setShowCleanupDialog}>
              <DialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Limpar Tudo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar limpeza de dados</DialogTitle>
                  <DialogDescription>
                    Esta ação irá apagar todos os dados armazenados localmente e não pode ser desfeita.
                  </DialogDescription>
                </DialogHeader>
                
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Atenção!</AlertTitle>
                  <AlertDescription>
                    Todos os dados do sistema serão excluídos permanentemente. 
                    Use esta função apenas para fins de teste ou quando orientado pelo suporte técnico.
                  </AlertDescription>
                </Alert>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCleanupDialog(false)}>
                    Cancelar
                  </Button>
                  <Button variant="destructive" onClick={handleCleanAllData}>
                    Sim, limpar todos os dados
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Cache do Sistema
            </CardTitle>
            <CardDescription>
              Gerenciamento de cache do navegador
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Limpar o cache pode resolver problemas de exibição ou comportamento 
              inesperado do sistema.
            </p>
            
            <Alert>
              <FileWarning className="h-4 w-4" />
              <AlertTitle>Informação</AlertTitle>
              <AlertDescription>
                A limpeza do cache não afeta seus dados, apenas recarrega componentes do sistema.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button 
              variant="secondary" 
              className="w-full gap-1"
              onClick={() => {
                window.location.reload();
                logOperation('Utilitários', 'Recarga da aplicação', true);
              }}
            >
              <RefreshCw className="h-4 w-4" />
              Recarregar Aplicação
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Utilitarios;
