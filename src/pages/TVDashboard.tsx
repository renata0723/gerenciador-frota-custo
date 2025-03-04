
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Grid, MonitorSmartphone, AlertTriangle, TrendingUp } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardStats from '@/components/dashboard/DashboardStats';
import ExpenseDistributionChart from '@/components/dashboard/ExpenseDistributionChart';
import MaintenanceTypesChart from '@/components/dashboard/MaintenanceTypesChart';

const TVDashboard = () => {
  const [totalVeiculos, setTotalVeiculos] = useState(0);
  const [totalMotoristas, setTotalMotoristas] = useState(0);
  const [notasAtivas, setNotasAtivas] = useState(0);
  const [manutencoesPendentes, setManutencoesPendentes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Buscar total de veículos
        const { data: veiculos, error: veiculosError } = await supabase
          .from('Veiculos')
          .select('*')
          .eq('status_veiculo', 'Ativo');
        
        if (veiculosError) throw veiculosError;
        
        // Buscar total de motoristas
        const { data: motoristas, error: motoristasError } = await supabase
          .from('Motoristas')
          .select('*')
          .eq('status', 'active');
        
        if (motoristasError) throw motoristasError;
        
        // Buscar notas ativas
        const { data: notas, error: notasError } = await supabase
          .from('Notas Fiscais')
          .select('*')
          .in('status_nota', ['aguardando_saida', 'em_transito']);
        
        if (notasError) throw notasError;
        
        // Buscar manutenções pendentes
        const { data: manutencoes, error: manutencoesError } = await supabase
          .from('Manutenção')
          .select('*')
          .is('data_conclusao', null);
        
        if (manutencoesError) throw manutencoesError;
        
        // Atualizar estados
        setTotalVeiculos(veiculos?.length || 0);
        setTotalMotoristas(motoristas?.length || 0);
        setNotasAtivas(notas?.length || 0);
        setManutencoesPendentes(manutencoes?.length || 0);
        
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        setError('Ocorreu um erro ao carregar os dados do dashboard.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
    
    // Configurar atualização automática a cada 5 minutos
    const intervalId = setInterval(fetchDashboardData, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <PageLayout fullWidth>
      <PageHeader 
        title="Painel de Controle" 
        description="Visão Geral da Operação"
        icon={<Grid size={26} className="text-blue-600" />}
      />
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Veículos Ativos"
          value={totalVeiculos}
          icon={<TrendingUp size={20} />}
          description="Total de veículos em operação"
          loading={loading}
        />
        <StatCard 
          title="Motoristas Ativos"
          value={totalMotoristas}
          icon={<TrendingUp size={20} />}
          description="Total de motoristas disponíveis"
          loading={loading}
        />
        <StatCard 
          title="Notas em Andamento"
          value={notasAtivas}
          icon={<TrendingUp size={20} />}
          description="Notas aguardando ou em trânsito"
          loading={loading}
        />
        <StatCard 
          title="Manutenções Pendentes"
          value={manutencoesPendentes}
          icon={<TrendingUp size={20} />}
          description="Manutenções em andamento"
          loading={loading}
          trend={{
            value: manutencoesPendentes > 5 ? "alta" : "baixa",
            direction: manutencoesPendentes > 5 ? "up" : "down"
          }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseDistributionChart />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Manutenção</CardTitle>
          </CardHeader>
          <CardContent>
            <MaintenanceTypesChart />
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas da Frota</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardStats />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default TVDashboard;
