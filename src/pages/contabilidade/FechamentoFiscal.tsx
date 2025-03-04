
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, FileLock2, ArrowLeft, CalendarRange, FileCheck } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const FechamentoFiscal = () => {
  const navigate = useNavigate();
  const [periodoReferencia, setPeriodoReferencia] = useState(`${new Date().getFullYear()}-${String(new Date().getMonth()).padStart(2, '0')}`);
  const [loading, setLoading] = useState(false);
  const [statusVerificacao, setStatusVerificacao] = useState<'pendente' | 'concluido' | 'erro' | null>(null);
  
  const [periodosFechados, setPeriodosFechados] = useState([
    { id: 1, periodo: '2023-10', dataFechamento: '2023-11-05', responsavel: 'João Silva', status: 'fechado' },
    { id: 2, periodo: '2023-11', dataFechamento: '2023-12-07', responsavel: 'Maria Oliveira', status: 'fechado' },
    { id: 3, periodo: '2023-12', dataFechamento: '2024-01-10', responsavel: 'Carlos Santos', status: 'fechado' },
    { id: 4, periodo: '2024-01', dataFechamento: '2024-02-08', responsavel: 'Ana Lima', status: 'fechado' },
  ]);

  const handleVerificarInconsistencias = () => {
    setLoading(true);
    setStatusVerificacao(null);
    
    // Simulando verificação
    setTimeout(() => {
      const random = Math.random();
      if (random > 0.7) {
        setStatusVerificacao('erro');
        toast.error('Foram encontradas inconsistências no período!');
      } else {
        setStatusVerificacao('concluido');
        toast.success('Verificação concluída! Nenhuma inconsistência encontrada.');
      }
      setLoading(false);
    }, 2000);
  };

  const handleFechamentoPeriodo = () => {
    setLoading(true);
    
    // Simulando fechamento
    setTimeout(() => {
      const novoPeriodoFechado = {
        id: periodosFechados.length + 1,
        periodo: periodoReferencia,
        dataFechamento: format(new Date(), 'yyyy-MM-dd'),
        responsavel: 'Usuário Atual',
        status: 'fechado'
      };
      
      setPeriodosFechados([novoPeriodoFechado, ...periodosFechados]);
      toast.success('Período fechado com sucesso!');
      setLoading(false);
    }, 3000);
  };

  const renderPeriodoLabel = (periodo: string) => {
    const [ano, mes] = periodo.split('-');
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    return `${meses[parseInt(mes, 10)]} de ${ano}`;
  };

  return (
    <PageLayout>
      <PageHeader
        title="Fechamento Fiscal"
        description="Fechamento de períodos contábeis e fiscais"
        icon={<FileLock2 size={24} />}
        actions={
          <Button variant="outline" onClick={() => navigate('/contabilidade')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        }
      />

      <div className="grid grid-cols-1 mt-6 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Fechamento de Período</CardTitle>
            <CardDescription>
              Realize o fechamento do período fiscal e contábil
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="periodo-referencia">Período de Referência</Label>
                <Input
                  id="periodo-referencia"
                  type="month"
                  value={periodoReferencia}
                  onChange={(e) => setPeriodoReferencia(e.target.value)}
                />
              </div>
            </div>
            
            {statusVerificacao === 'erro' && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Foram encontradas inconsistências que impedem o fechamento do período.
                  Por favor, verifique os lançamentos contábeis, conciliações e relatórios.
                </AlertDescription>
              </Alert>
            )}
            
            {statusVerificacao === 'concluido' && (
              <Alert className="mt-4 border-green-500 text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Verificação concluída com sucesso! O período está pronto para ser fechado.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end pt-0">
            <Button 
              variant="outline" 
              onClick={handleVerificarInconsistencias}
              disabled={loading}
            >
              <FileCheck className="mr-2 h-4 w-4" /> 
              {loading && statusVerificacao === null ? 'Verificando...' : 'Verificar Inconsistências'}
            </Button>
            <Button 
              onClick={handleFechamentoPeriodo}
              disabled={loading || statusVerificacao !== 'concluido'}
              className="bg-sistema-primary hover:bg-sistema-primary-dark"
            >
              <FileLock2 className="mr-2 h-4 w-4" /> 
              {loading && statusVerificacao === 'concluido' ? 'Processando...' : 'Fechar Período'}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Períodos Fechados</CardTitle>
            <CardDescription>
              Histórico de fechamentos fiscais realizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Período</TableHead>
                    <TableHead>Data de Fechamento</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {periodosFechados.map((periodo) => (
                    <TableRow key={periodo.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <CalendarRange className="mr-2 h-4 w-4 text-gray-500" />
                          {renderPeriodoLabel(periodo.periodo)}
                        </div>
                      </TableCell>
                      <TableCell>{periodo.dataFechamento}</TableCell>
                      <TableCell>{periodo.responsavel}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Fechado</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Visualizar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default FechamentoFiscal;
