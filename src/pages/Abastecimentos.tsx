
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { TipoCombustivel, TipoCombustivelFormData, AbastecimentoFormData, Abastecimento } from '@/types/abastecimento';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { logOperation } from '@/utils/logOperations';

const Abastecimentos: React.FC = () => {
  // Estados para gerenciar tipos de combustível
  const [tiposCombustivel, setTiposCombustivel] = useState<TipoCombustivel[]>([]);
  const [isNewTypeDialogOpen, setIsNewTypeDialogOpen] = useState(false);
  const [newTipoCombustivel, setNewTipoCombustivel] = useState<TipoCombustivelFormData>({ nome: '', descricao: '' });
  
  // Estados para gerenciar abastecimentos
  const [abastecimentos, setAbastecimentos] = useState<Abastecimento[]>([]);
  const [isNewAbastecimentoDialogOpen, setIsNewAbastecimentoDialogOpen] = useState(false);
  const [placasDisponiveis, setPlacasDisponiveis] = useState<{placa_cavalo: string}[]>([]);
  const [motoristasDisponiveis, setMotoristasDisponiveis] = useState<{nome: string}[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Formulário de abastecimento
  const [formData, setFormData] = useState<AbastecimentoFormData>({
    data: format(new Date(), 'yyyy-MM-dd'),
    placa: '',
    motorista: '',
    tipoCombustivel: '',
    quantidade: 0,
    valor: 0,
    posto: '',
    responsavel: '',
    quilometragem: 0
  });

  useEffect(() => {
    loadTiposCombustivel();
    loadAbastecimentos();
    loadPlacas();
    loadMotoristas();
  }, []);

  // Carregar tipos de combustível
  const loadTiposCombustivel = async () => {
    try {
      const { data, error } = await supabase
        .from('TiposCombustivel')
        .select('*');
        
      if (error) {
        console.error('Erro ao carregar tipos de combustível:', error);
        toast.error('Erro ao carregar tipos de combustível');
        return;
      }
      
      setTiposCombustivel(data || []);
    } catch (err) {
      console.error('Erro ao processar dados:', err);
      toast.error('Erro ao carregar tipos de combustível');
    }
  };

  // Carregar abastecimentos
  const loadAbastecimentos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Abastecimentos')
        .select('*')
        .order('data_abastecimento', { ascending: false });
        
      if (error) {
        console.error('Erro ao carregar abastecimentos:', error);
        toast.error('Erro ao carregar abastecimentos');
        return;
      }
      
      setAbastecimentos(data || []);
    } catch (err) {
      console.error('Erro ao processar dados de abastecimentos:', err);
      toast.error('Erro ao carregar abastecimentos');
    } finally {
      setLoading(false);
    }
  };

  // Carregar placas disponíveis
  const loadPlacas = async () => {
    try {
      const { data, error } = await supabase
        .from('Veiculos')
        .select('placa_cavalo')
        .eq('status_veiculo', 'Ativo');

      if (error) {
        console.error('Erro ao carregar placas:', error);
        return;
      }

      setPlacasDisponiveis(data || []);
    } catch (error) {
      console.error('Erro ao processar placas:', error);
    }
  };

  // Carregar motoristas disponíveis
  const loadMotoristas = async () => {
    try {
      const { data, error } = await supabase
        .from('Motorista')
        .select('nome');

      if (error) {
        console.error('Erro ao carregar motoristas:', error);
        
        // Carregar da tabela Motoristas caso a outra falhe
        const { data: altData, error: altError } = await supabase
          .from('Motoristas')
          .select('nome');
          
        if (altError) {
          console.error('Erro ao carregar da tabela alternativa:', altError);
          setMotoristasDisponiveis([
            { nome: 'João Silva' },
            { nome: 'Maria Oliveira' },
            { nome: 'Pedro Santos' }
          ]);
          return;
        }
        
        setMotoristasDisponiveis(altData || []);
        return;
      }

      setMotoristasDisponiveis(data || []);
    } catch (error) {
      console.error('Erro ao processar motoristas:', error);
    }
  };

  // Salvar novo tipo de combustível
  const handleSaveFuelType = async (data: TipoCombustivelFormData) => {
    setIsNewTypeDialogOpen(false);
    
    try {
      // Criar um ID para o novo tipo
      const tipoCombustivelData: TipoCombustivel = {
        id: `tipo-${Date.now()}`, // Gerando um ID único
        nome: data.nome,
        descricao: data.descricao
      };
      
      const { error } = await supabase
        .from('TiposCombustivel')
        .insert(tipoCombustivelData);
        
      if (error) {
        console.error('Erro ao salvar tipo de combustível:', error);
        toast.error('Erro ao salvar tipo de combustível');
        return;
      }
      
      // Adicionar à lista local
      setTiposCombustivel([...tiposCombustivel, tipoCombustivelData]);
      toast.success(`Tipo de combustível ${data.nome} adicionado com sucesso!`);
      
      // Log de operação
      logOperation('Abastecimentos', `Adicionado novo tipo de combustível: ${data.nome}`);
    } catch (error) {
      console.error('Erro ao processar:', error);
      toast.error('Ocorreu um erro ao salvar o tipo de combustível');
    }
  };

  // Handles para o formulário de abastecimento
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseFloat(value) : value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Salvar novo abastecimento
  const handleSaveAbastecimento = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.data || !formData.placa || !formData.tipoCombustivel || formData.quantidade <= 0 || formData.valor <= 0) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    
    try {
      // Preparar os itens abastecidos
      const itensAbastecidos = [{
        tipo: formData.tipoCombustivel,
        quantidade: formData.quantidade
      }];
      
      const abastecimentoData = {
        data_abastecimento: formData.data,
        placa_veiculo: formData.placa,
        motorista_solicitante: formData.motorista,
        tipo_combustivel: formData.tipoCombustivel,
        valor_abastecimento: formData.valor,
        valor_total: formData.valor,
        posto: formData.posto,
        responsavel_autorizacao: formData.responsavel,
        quilometragem: formData.quilometragem,
        itens_abastecidos: JSON.stringify(itensAbastecidos)
      };
      
      const { error } = await supabase
        .from('Abastecimentos')
        .insert(abastecimentoData);
        
      if (error) {
        console.error('Erro ao registrar abastecimento:', error);
        toast.error('Erro ao registrar abastecimento');
        return;
      }
      
      toast.success('Abastecimento registrado com sucesso!');
      setIsNewAbastecimentoDialogOpen(false);
      
      // Limpar formulário
      setFormData({
        data: format(new Date(), 'yyyy-MM-dd'),
        placa: '',
        motorista: '',
        tipoCombustivel: '',
        quantidade: 0,
        valor: 0,
        posto: '',
        responsavel: '',
        quilometragem: 0
      });
      
      // Recarregar abastecimentos
      loadAbastecimentos();
      
      // Log de operação
      logOperation('Abastecimentos', `Registrado abastecimento para veículo: ${formData.placa}`);
    } catch (error) {
      console.error('Erro ao processar:', error);
      toast.error('Ocorreu um erro ao registrar o abastecimento');
    }
  };

  // Formatador de data para exibição
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Abastecimentos</h1>
      
      <Tabs defaultValue="abastecimentos" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="abastecimentos">Abastecimentos</TabsTrigger>
          <TabsTrigger value="tipos">Tipos de Combustível</TabsTrigger>
        </TabsList>
        
        <TabsContent value="abastecimentos">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Abastecimentos Registrados</CardTitle>
              <Button onClick={() => setIsNewAbastecimentoDialogOpen(true)}>Novo Abastecimento</Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Carregando abastecimentos...</p>
              ) : abastecimentos.length === 0 ? (
                <p>Nenhum abastecimento registrado.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Placa</TableHead>
                        <TableHead>Motorista</TableHead>
                        <TableHead>Combustível</TableHead>
                        <TableHead>Posto</TableHead>
                        <TableHead>Quilometragem</TableHead>
                        <TableHead>Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {abastecimentos.map((abastecimento) => (
                        <TableRow key={abastecimento.id}>
                          <TableCell>{formatDate(abastecimento.data_abastecimento)}</TableCell>
                          <TableCell>{abastecimento.placa_veiculo}</TableCell>
                          <TableCell>{abastecimento.motorista_solicitante}</TableCell>
                          <TableCell>{abastecimento.tipo_combustivel}</TableCell>
                          <TableCell>{abastecimento.posto}</TableCell>
                          <TableCell>{abastecimento.quilometragem?.toLocaleString() || 'N/A'}</TableCell>
                          <TableCell>R$ {abastecimento.valor_total?.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '0,00'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tipos">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Tipos de Combustível</CardTitle>
              <Button onClick={() => setIsNewTypeDialogOpen(true)}>Adicionar Tipo</Button>
            </CardHeader>
            <CardContent>
              {tiposCombustivel.length === 0 ? (
                <p>Nenhum tipo de combustível cadastrado.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tiposCombustivel.map(tipo => (
                    <Card key={tipo.id} className="p-4">
                      <h3 className="font-bold">{tipo.nome}</h3>
                      <p className="text-sm text-gray-600">{tipo.descricao || 'Sem descrição'}</p>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo para adicionar novo tipo de combustível */}
      <Dialog open={isNewTypeDialogOpen} onOpenChange={setIsNewTypeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Tipo de Combustível</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={newTipoCombustivel.nome}
              onChange={(e) => setNewTipoCombustivel({ ...newTipoCombustivel, nome: e.target.value })}
            />
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              value={newTipoCombustivel.descricao || ''}
              onChange={(e) => setNewTipoCombustivel({ ...newTipoCombustivel, descricao: e.target.value })}
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setIsNewTypeDialogOpen(false)} className="mr-2">Cancelar</Button>
            <Button onClick={() => handleSaveFuelType(newTipoCombustivel)}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo para adicionar novo abastecimento */}
      <Dialog open={isNewAbastecimentoDialogOpen} onOpenChange={setIsNewAbastecimentoDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Registrar Novo Abastecimento</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveAbastecimento} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="data">Data *</Label>
                <Input
                  id="data"
                  name="data"
                  type="date"
                  value={formData.data}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="placa">Placa do Veículo *</Label>
                <Select 
                  value={formData.placa} 
                  onValueChange={(value) => handleSelectChange("placa", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a placa" />
                  </SelectTrigger>
                  <SelectContent>
                    {placasDisponiveis.map((veiculo) => (
                      <SelectItem key={veiculo.placa_cavalo} value={veiculo.placa_cavalo}>
                        {veiculo.placa_cavalo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="quilometragem">Quilometragem *</Label>
                <Input
                  id="quilometragem"
                  name="quilometragem"
                  type="number"
                  value={formData.quilometragem}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="motorista">Motorista *</Label>
                <Select 
                  value={formData.motorista} 
                  onValueChange={(value) => handleSelectChange("motorista", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o motorista" />
                  </SelectTrigger>
                  <SelectContent>
                    {motoristasDisponiveis.map((motorista) => (
                      <SelectItem key={motorista.nome} value={motorista.nome}>
                        {motorista.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="tipoCombustivel">Tipo de Combustível *</Label>
                <Select 
                  value={formData.tipoCombustivel} 
                  onValueChange={(value) => handleSelectChange("tipoCombustivel", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de combustível" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposCombustivel.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.nome}>
                        {tipo.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="quantidade">Quantidade (L) *</Label>
                <Input
                  id="quantidade"
                  name="quantidade"
                  type="number"
                  step="0.01"
                  value={formData.quantidade}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="valor">Valor Total (R$) *</Label>
                <Input
                  id="valor"
                  name="valor"
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="posto">Posto *</Label>
                <Input
                  id="posto"
                  name="posto"
                  value={formData.posto}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="responsavel">Responsável pela Autorização *</Label>
                <Input
                  id="responsavel"
                  name="responsavel"
                  value={formData.responsavel}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="button" variant="outline" onClick={() => setIsNewAbastecimentoDialogOpen(false)} className="mr-2">
                Cancelar
              </Button>
              <Button type="submit">Registrar Abastecimento</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Abastecimentos;
