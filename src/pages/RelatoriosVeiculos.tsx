
import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import { useNavigate } from 'react-router-dom';
import { FileText, ChevronLeft, Search, Filter, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { ANO_ATUAL } from '@/utils/constants';
import RelatorioVeiculosTable from '@/components/veiculos/RelatorioVeiculosTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const RelatoriosVeiculos = () => {
  const navigate = useNavigate();
  const [veiculosData, setVeiculosData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState({
    tipoFrota: 'todos',
    status: 'todos',
    tipoVeiculo: 'todos',
    dataInicial: `${ANO_ATUAL}-01-01`,
    dataFinal: `${ANO_ATUAL}-12-31`,
  });
  const [filtroDescricao, setFiltroDescricao] = useState('');

  useEffect(() => {
    carregarVeiculos();
  }, []);

  const carregarVeiculos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Veiculos')
        .select('*');

      if (error) {
        console.error("Erro ao carregar veículos:", error);
        toast.error("Erro ao carregar a lista de veículos");
        return;
      }

      // Mapear dados para o formato esperado pelo componente
      const veiculosFormatados = (data || []).map(veiculo => ({
        id: (veiculo as any).id || Math.random().toString(36).substr(2, 9),
        placa: (veiculo as any).placa_cavalo || (veiculo as any).placa_carreta || 'Sem placa',
        tipo: (veiculo as any).placa_cavalo ? 'Cavalo' : 'Carreta',
        modelo: 'Não especificado', // Valor padrão
        ano: ANO_ATUAL, // Valor padrão
        status: (veiculo as any).status_veiculo || 'Ativo',
        frota: (veiculo as any).tipo_frota || 'Própria',
        inativacao: (veiculo as any).status_veiculo === 'Inativo' ? {
          data: (veiculo as any).data_inativacao || `${ANO_ATUAL}-01-01`,
          motivo: (veiculo as any).motivo_inativacao || 'Não especificado'
        } : null
      }));

      setVeiculosData(veiculosFormatados);
    } catch (error) {
      console.error("Erro ao processar dados:", error);
      toast.error("Ocorreu um erro ao processar os dados dos veículos");
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltro(prev => ({ ...prev, [campo]: valor }));
  };

  const aplicarFiltro = () => {
    let descricao = 'Filtros: ';
    
    if (filtro.tipoFrota !== 'todos') {
      descricao += `Frota ${filtro.tipoFrota}, `;
    }
    
    if (filtro.status !== 'todos') {
      descricao += `Status ${filtro.status}, `;
    }
    
    if (filtro.tipoVeiculo !== 'todos') {
      descricao += `Tipo ${filtro.tipoVeiculo}, `;
    }
    
    descricao += `Período ${filtro.dataInicial} a ${filtro.dataFinal}`;
    
    setFiltroDescricao(descricao);
    toast.success("Filtro aplicado com sucesso!");
  };

  const limparFiltro = () => {
    setFiltro({
      tipoFrota: 'todos',
      status: 'todos',
      tipoVeiculo: 'todos',
      dataInicial: `${ANO_ATUAL}-01-01`,
      dataFinal: `${ANO_ATUAL}-12-31`,
    });
    setFiltroDescricao('');
    toast.info("Filtros resetados");
  };

  // Aplicar filtros
  const veiculosFiltrados = veiculosData.filter(veiculo => {
    if (filtro.tipoFrota !== 'todos' && veiculo.frota.toLowerCase() !== filtro.tipoFrota) {
      return false;
    }
    
    if (filtro.status !== 'todos' && veiculo.status.toLowerCase() !== filtro.status) {
      return false;
    }
    
    if (filtro.tipoVeiculo !== 'todos' && veiculo.tipo.toLowerCase() !== filtro.tipoVeiculo) {
      return false;
    }
    
    return true;
  });

  // Separar veículos por tipo de frota para o relatório específico
  const veiculosFrotaPropria = veiculosData.filter(v => 
    v.frota.toLowerCase() === 'propria' || v.frota.toLowerCase() === 'própria'
  );
  
  const veiculosFrotaTerceirizada = veiculosData.filter(v => 
    v.frota.toLowerCase() === 'terceirizada'
  );

  const handleExportar = () => {
    toast.success("Relatório exportado com sucesso!");
  };

  const handleImprimir = () => {
    window.print();
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Relatórios de Veículos" 
        description="Análise completa da frota"
        icon={<FileText size={26} className="text-blue-500" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Veículos', href: '/veiculos' },
          { label: 'Relatórios' }
        ]}
        actions={
          <Button variant="outline" onClick={() => navigate('/veiculos')}>
            <ChevronLeft size={16} className="mr-2" />
            Voltar para Veículos
          </Button>
        }
      />

      <Tabs defaultValue="geral">
        <TabsList className="mb-6">
          <TabsTrigger value="geral">Relatório Geral</TabsTrigger>
          <TabsTrigger value="frota">Por Tipo de Frota</TabsTrigger>
          <TabsTrigger value="filtros">Filtros Avançados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="geral">
          <RelatorioVeiculosTable 
            veiculos={veiculosData}
            titulo="Relatório Geral de Veículos"
            onExportar={handleExportar}
            onImprimir={handleImprimir}
          />
        </TabsContent>
        
        <TabsContent value="frota">
          <div className="space-y-6">
            <RelatorioVeiculosTable 
              veiculos={veiculosFrotaPropria}
              titulo="Relatório de Veículos - Frota Própria"
              onExportar={handleExportar}
              onImprimir={handleImprimir}
            />
            
            <RelatorioVeiculosTable 
              veiculos={veiculosFrotaTerceirizada}
              titulo="Relatório de Veículos - Frota Terceirizada"
              onExportar={handleExportar}
              onImprimir={handleImprimir}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="filtros">
          <div className="grid grid-cols-1 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Filtros Avançados</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Tipo de Frota</Label>
                  <Select
                    value={filtro.tipoFrota}
                    onValueChange={(value) => handleFiltroChange('tipoFrota', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="propria">Própria</SelectItem>
                      <SelectItem value="terceirizada">Terceirizada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={filtro.status}
                    onValueChange={(value) => handleFiltroChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Tipo de Veículo</Label>
                  <Select
                    value={filtro.tipoVeiculo}
                    onValueChange={(value) => handleFiltroChange('tipoVeiculo', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="cavalo">Cavalo</SelectItem>
                      <SelectItem value="carreta">Carreta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-2">
                  <Label>Data Inicial</Label>
                  <Input
                    type="date"
                    value={filtro.dataInicial}
                    onChange={(e) => handleFiltroChange('dataInicial', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Data Final</Label>
                  <Input
                    type="date"
                    value={filtro.dataFinal}
                    onChange={(e) => handleFiltroChange('dataFinal', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <Button type="button" variant="outline" onClick={limparFiltro}>
                  Limpar Filtros
                </Button>
                <Button type="button" onClick={aplicarFiltro}>
                  Aplicar Filtros
                </Button>
              </div>
            </Card>
            
            {filtroDescricao && (
              <RelatorioVeiculosTable 
                veiculos={veiculosFiltrados}
                titulo="Relatório de Veículos Filtrado"
                filtroAtivo={filtroDescricao}
                onExportar={handleExportar}
                onImprimir={handleImprimir}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default RelatoriosVeiculos;
