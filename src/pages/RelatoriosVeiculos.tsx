
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  TrendingUp, 
  Activity, 
  Calendar, 
  Building,
  Truck as TruckIcon
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

// Dados mockados para os gráficos
const frotaData = [
  { name: 'Janeiro', propria: 12, terceirizada: 8 },
  { name: 'Fevereiro', propria: 13, terceirizada: 8 },
  { name: 'Março', propria: 15, terceirizada: 9 },
  { name: 'Abril', propria: 14, terceirizada: 11 },
  { name: 'Maio', propria: 16, terceirizada: 12 },
  { name: 'Junho', propria: 18, terceirizada: 10 },
];

const statusData = [
  { name: 'Ativos', value: 35 },
  { name: 'Inativos', value: 15 },
];

const tiposVeiculosData = [
  { name: 'Caminhão 3/4', value: 10 },
  { name: 'Caminhão Toco', value: 15 },
  { name: 'Caminhão Truck', value: 8 },
  { name: 'Carreta Simples', value: 12 },
  { name: 'Bitrem', value: 5 },
];

const inativacaoData = [
  { name: 'Janeiro', manutencao: 3, vendido: 1, outro: 0 },
  { name: 'Fevereiro', manutencao: 2, vendido: 0, outro: 1 },
  { name: 'Março', manutencao: 4, vendido: 2, outro: 0 },
  { name: 'Abril', manutencao: 1, vendido: 1, outro: 2 },
  { name: 'Maio', manutencao: 3, vendido: 0, outro: 1 },
  { name: 'Junho', manutencao: 2, vendido: 3, outro: 0 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const RelatoriosVeiculos = () => {
  const [reportNotes, setReportNotes] = useState('');

  return (
    <PageLayout>
      <PageHeader
        title="Relatórios de Veículos"
        subtitle="Analise o desempenho da sua frota"
        icon={<FileText className="h-6 w-6 text-sistema-primary" />}
      />

      <Tabs defaultValue="frota" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="frota">
            <Building className="mr-2 h-4 w-4" />
            Própria vs. Terceirizada
          </TabsTrigger>
          <TabsTrigger value="status">
            <Activity className="mr-2 h-4 w-4" />
            Ativos vs. Inativos
          </TabsTrigger>
          <TabsTrigger value="tipos">
            <TruckIcon className="mr-2 h-4 w-4" />
            Tipos de Veículos
          </TabsTrigger>
          <TabsTrigger value="inativacao">
            <Calendar className="mr-2 h-4 w-4" />
            Histórico de Inativação
          </TabsTrigger>
        </TabsList>

        <TabsContent value="frota" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Evolução de Veículos: Frota Própria vs. Terceirizada</CardTitle>
              <CardDescription>
                Comparativo mensal da quantidade de veículos próprios e terceirizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={frotaData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="propria" name="Frota Própria" fill="#3B82F6" />
                    <Bar dataKey="terceirizada" name="Frota Terceirizada" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Veículos por Status</CardTitle>
              <CardDescription>
                Percentual de veículos ativos e inativos na frota
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10B981' : '#EF4444'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tipos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Tipos de Veículos</CardTitle>
              <CardDescription>
                Quantidade de veículos registrados por categoria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tiposVeiculosData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {tiposVeiculosData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inativacao" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Inativação de Veículos</CardTitle>
              <CardDescription>
                Motivos de inativação de veículos ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={inativacaoData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="manutencao" name="Em Manutenção" fill="#F59E0B" />
                    <Bar dataKey="vendido" name="Vendido" fill="#8B5CF6" />
                    <Bar dataKey="outro" name="Outros Motivos" fill="#EC4899" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-2">Anotações do Relatório</h3>
        <Textarea
          placeholder="Adicione suas observações sobre estes relatórios..."
          className="min-h-[120px]"
          value={reportNotes}
          onChange={(e) => setReportNotes(e.target.value)}
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline">Limpar</Button>
          <Button>Salvar Anotações</Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default RelatoriosVeiculos;
