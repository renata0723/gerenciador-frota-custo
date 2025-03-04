
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, XCircle, Percent, Plus, FilePlus } from 'lucide-react';

import { 
  buscarCreditosTributarios,
  salvarCreditoTributario
} from '@/services/impostoService';
import { CreditoTributario } from '@/types/contabilidade';
import { formatCurrency } from '@/utils/constants';

const CreditosTributarios = () => {
  const navigate = useNavigate();
  const [creditos, setCreditos] = useState<CreditoTributario[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState({
    tipo: '',
    status: '',
    periodo: ''
  });
  
  // Dados do novo crédito
  const [novoCredito, setNovoCredito] = useState<Partial<CreditoTributario>>({
    tipo_credito: 'pis',
    descricao: '',
    valor: 0,
    data_aquisicao: format(new Date(), 'yyyy-MM-dd'),
    periodo_apuracao: format(new Date(), 'yyyy-MM'),
    status: 'disponivel'
  });
  
  useEffect(() => {
    carregarCreditos();
  }, []);
  
  const carregarCreditos = async (filtros = {}) => {
    setLoading(true);
    try {
      const { tipo, status, periodo } = { ...filtro, ...filtros };
      const data = await buscarCreditosTributarios(tipo, status, periodo);
      setCreditos(data);
    } catch (error) {
      console.error('Erro ao carregar créditos:', error);
      toast.error('Erro ao carregar créditos tributários. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setNovoCredito(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };
  
  const handleSelectChange = (field: string, value: string) => {
    setNovoCredito(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleFiltroChange = (field: string, value: string) => {
    const novoFiltro = { ...filtro, [field]: value };
    setFiltro(novoFiltro);
    carregarCreditos(novoFiltro);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!novoCredito.descricao || !novoCredito.valor || novoCredito.valor <= 0) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    setLoading(true);
    try {
      const resultado = await salvarCreditoTributario(novoCredito);
      
      if (resultado) {
        toast.success('Crédito tributário registrado com sucesso.');
        setCreditos(prev => [resultado, ...prev]);
        
        // Limpar formulário
        setNovoCredito({
          tipo_credito: 'pis',
          descricao: '',
          valor: 0,
          data_aquisicao: format(new Date(), 'yyyy-MM-dd'),
          periodo_apuracao: format(new Date(), 'yyyy-MM'),
          status: 'disponivel'
        });
      } else {
        toast.error('Erro ao registrar crédito tributário. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao salvar crédito:', error);
      toast.error('Erro ao salvar crédito tributário. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  const formatarData = (dataString: string) => {
    try {
      return format(parseISO(dataString), 'dd/MM/yyyy');
    } catch (error) {
      return dataString;
    }
  };
  
  return (
    <PageLayout>
      <PageHeader 
        title="Créditos Tributários" 
        description="Gerenciamento de créditos para utilização na apuração de impostos"
        icon={<Percent className="h-6 w-6" />}
        actions={
          <Button variant="ghost" onClick={() => navigate('/contabilidade/apuracao-impostos')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Novo Crédito Tributário</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="tipo_credito">Tipo de Crédito</Label>
                  <Select 
                    value={novoCredito.tipo_credito}
                    onValueChange={(value) => handleSelectChange('tipo_credito', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pis">PIS</SelectItem>
                      <SelectItem value="cofins">COFINS</SelectItem>
                      <SelectItem value="irpj">IRPJ</SelectItem>
                      <SelectItem value="csll">CSLL</SelectItem>
                      <SelectItem value="icms">ICMS</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input
                    id="descricao"
                    name="descricao"
                    value={novoCredito.descricao}
                    onChange={handleInputChange}
                    placeholder="Descreva a origem do crédito"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="valor">Valor (R$)</Label>
                  <Input
                    id="valor"
                    name="valor"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={novoCredito.valor}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="data_aquisicao">Data de Aquisição</Label>
                  <Input
                    id="data_aquisicao"
                    name="data_aquisicao"
                    type="date"
                    value={novoCredito.data_aquisicao}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="periodo_apuracao">Período de Apuração</Label>
                  <Input
                    id="periodo_apuracao"
                    name="periodo_apuracao"
                    type="month"
                    value={novoCredito.periodo_apuracao}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Mês/Ano para utilização do crédito
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="documento_referencia">Documento de Referência</Label>
                  <Input
                    id="documento_referencia"
                    name="documento_referencia"
                    value={novoCredito.documento_referencia || ''}
                    onChange={handleInputChange}
                    placeholder="Nº da Nota Fiscal, CTe, etc."
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  <Plus className="mr-2 h-4 w-4" />
                  {loading ? 'Salvando...' : 'Adicionar Crédito'}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tipo-filtro">Tipo de Crédito</Label>
                <Select 
                  value={filtro.tipo}
                  onValueChange={(value) => handleFiltroChange('tipo', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="pis">PIS</SelectItem>
                    <SelectItem value="cofins">COFINS</SelectItem>
                    <SelectItem value="irpj">IRPJ</SelectItem>
                    <SelectItem value="csll">CSLL</SelectItem>
                    <SelectItem value="icms">ICMS</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="status-filtro">Status</Label>
                <Select 
                  value={filtro.status}
                  onValueChange={(value) => handleFiltroChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="disponivel">Disponível</SelectItem>
                    <SelectItem value="utilizado">Utilizado</SelectItem>
                    <SelectItem value="expirado">Expirado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="periodo-filtro">Período de Apuração</Label>
                <Input
                  id="periodo-filtro"
                  type="month"
                  value={filtro.periodo}
                  onChange={(e) => handleFiltroChange('periodo', e.target.value)}
                />
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setFiltro({ tipo: '', status: '', periodo: '' });
                  carregarCreditos({ tipo: '', status: '', periodo: '' });
                }}
              >
                Limpar Filtros
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-1 lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Créditos Tributários</CardTitle>
              <Button 
                variant="outline" 
                onClick={() => carregarCreditos()}
                disabled={loading}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Atualizar
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center py-4">Carregando créditos tributários...</p>
              ) : creditos.length === 0 ? (
                <div className="text-center py-8">
                  <Percent className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">Nenhum crédito encontrado</h3>
                  <p className="mt-1 text-gray-500">
                    {Object.values(filtro).some(v => v !== '') 
                      ? 'Tente alterar os filtros ou adicionar um novo crédito.' 
                      : 'Adicione um novo crédito usando o formulário ao lado.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Período</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Referência</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {creditos.map((credito) => (
                        <TableRow key={credito.id}>
                          <TableCell className="font-medium uppercase">
                            {credito.tipo_credito}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {credito.descricao}
                          </TableCell>
                          <TableCell>{formatCurrency(credito.valor)}</TableCell>
                          <TableCell>{formatarData(credito.data_aquisicao)}</TableCell>
                          <TableCell>{credito.periodo_apuracao}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {credito.status === 'disponivel' ? (
                                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                              ) : credito.status === 'utilizado' ? (
                                <FilePlus className="h-4 w-4 text-blue-500 mr-1" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500 mr-1" />
                              )}
                              <span className={
                                credito.status === 'disponivel' 
                                  ? 'text-green-600' 
                                  : credito.status === 'utilizado'
                                  ? 'text-blue-600'
                                  : 'text-red-600'
                              }>
                                {credito.status === 'disponivel' 
                                  ? 'Disponível' 
                                  : credito.status === 'utilizado'
                                  ? 'Utilizado'
                                  : 'Expirado'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {credito.documento_referencia || '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default CreditosTributarios;
