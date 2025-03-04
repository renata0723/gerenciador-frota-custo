import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, FileSpreadsheet, FileText, Download } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { buscarPlanoContas, criarContaContabil } from '@/services/contabilidadeService';
import { ContaContabil } from '@/types/contabilidade';
import { gerarRelatorioPlanoConta } from '@/utils/pdfGenerator';

const PlanoContas = () => {
  const navigate = useNavigate();
  const [contas, setContas] = useState<ContaContabil[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [novaConta, setNovaConta] = useState<ContaContabil>({
    codigo: '',
    codigo_reduzido: '',
    nome: '',
    tipo: 'ativo',
    natureza: 'devedora',
    nivel: 1,
    status: 'ativo'
  });
  
  useEffect(() => {
    const carregarContas = async () => {
      try {
        setLoading(true);
        const data = await buscarPlanoContas();
        setContas(data);
      } catch (error) {
        console.error('Erro ao carregar plano de contas:', error);
        toast.error('Erro ao carregar plano de contas. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    carregarContas();
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setNovaConta(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) : value
    }));
  };
  
  const handleSelectChange = (field: string, value: string) => {
    setNovaConta(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const calcularNivel = (codigo: string) => {
    return (codigo.match(/\./g) || []).length + 1;
  };
  
  const calcularContaPai = (codigo: string) => {
    const partes = codigo.split('.');
    if (partes.length <= 1) return undefined;
    return partes.slice(0, -1).join('.');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!novaConta.codigo || !novaConta.codigo_reduzido || !novaConta.nome) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    const nivel = calcularNivel(novaConta.codigo);
    const conta_pai = calcularContaPai(novaConta.codigo);
    
    const contaAtualizada = {
      ...novaConta,
      nivel,
      conta_pai
    };
    
    try {
      const response = await criarContaContabil(contaAtualizada);
      
      if (response) {
        toast.success('Conta contábil registrada com sucesso.');
        
        setContas(prev => [...prev, response].sort((a, b) => a.codigo.localeCompare(b.codigo)));
        
        setNovaConta({
          codigo: '',
          codigo_reduzido: '',
          nome: '',
          tipo: 'ativo',
          natureza: 'devedora',
          nivel: 1,
          status: 'ativo'
        });
      } else {
        toast.error('Erro ao registrar conta. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao salvar conta:', error);
      toast.error('Erro ao salvar conta. Tente novamente mais tarde.');
    }
  };
  
  const getIndentClass = (nivel: number) => {
    switch (nivel) {
      case 1: return 'font-bold text-lg';
      case 2: return 'font-semibold text-md pl-4';
      case 3: return 'font-medium pl-8';
      case 4: return 'pl-12';
      case 5: return 'pl-16';
      default: return 'pl-20';
    }
  };
  
  const handleExportarPDF = () => {
    gerarRelatorioPlanoConta(contas);
    toast.success('Relatório PDF gerado com sucesso!');
  };
  
  return (
    <PageLayout>
      <PageHeader 
        title="Plano de Contas" 
        description="Gerencie o plano de contas contábil da empresa"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportarPDF}>
              <Download className="mr-2 h-4 w-4" />
              Exportar PDF
            </Button>
            <Button variant="ghost" onClick={() => navigate('/contabilidade')}>
              Voltar
            </Button>
          </div>
        }
      />
      
      <Tabs defaultValue="listar" className="mt-6">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="listar">Contas</TabsTrigger>
          <TabsTrigger value="nova">Nova Conta</TabsTrigger>
        </TabsList>
        
        <TabsContent value="listar">
          <Card className="p-6">
            {loading ? (
              <p className="text-center py-4">Carregando plano de contas...</p>
            ) : contas.length === 0 ? (
              <div className="text-center py-8">
                <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Nenhuma conta registrada</h3>
                <p className="mt-1 text-gray-500">Clique em "Nova Conta" para adicionar.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Código Reduzido</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Natureza</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contas.map((conta) => (
                      <TableRow key={conta.codigo}>
                        <TableCell className={getIndentClass(conta.nivel)}>
                          {conta.codigo}
                        </TableCell>
                        <TableCell>
                          {conta.codigo_reduzido}
                        </TableCell>
                        <TableCell className={getIndentClass(conta.nivel)}>
                          {conta.nome}
                        </TableCell>
                        <TableCell>{conta.tipo}</TableCell>
                        <TableCell>{conta.natureza}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="nova">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="codigo">Código da Conta</Label>
                  <Input
                    id="codigo"
                    name="codigo"
                    value={novaConta.codigo}
                    onChange={handleInputChange}
                    placeholder="Ex: 1.1.2.01"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use formato hierárquico (ex: 1.1.2.01)
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="codigo_reduzido">Código Reduzido</Label>
                  <Input
                    id="codigo_reduzido"
                    name="codigo_reduzido"
                    value={novaConta.codigo_reduzido}
                    onChange={handleInputChange}
                    placeholder="Ex: 11201"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Código simplificado para lançamentos
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="nome">Nome da Conta</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={novaConta.nome}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipo">Tipo da Conta</Label>
                  <Select 
                    value={novaConta.tipo}
                    onValueChange={(value) => handleSelectChange('tipo', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="passivo">Passivo</SelectItem>
                      <SelectItem value="patrimonio">Patrimônio Líquido</SelectItem>
                      <SelectItem value="receita">Receita</SelectItem>
                      <SelectItem value="despesa">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="natureza">Natureza da Conta</Label>
                  <Select 
                    value={novaConta.natureza}
                    onValueChange={(value) => handleSelectChange('natureza', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a natureza" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="devedora">Devedora</SelectItem>
                      <SelectItem value="credora">Credora</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Adicionar Conta
              </Button>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default PlanoContas;
