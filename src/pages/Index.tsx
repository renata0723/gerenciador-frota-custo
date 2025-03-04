
import React, { useEffect, useState } from 'react';
import NewPageLayout from '@/components/layout/NewPageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { LayoutDashboard, Calendar, Truck, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardStats from '@/components/dashboard/DashboardStats';
import LatestInvoicesTable from '@/components/dashboard/LatestInvoicesTable';
import LatestMaintenanceTable from '@/components/dashboard/LatestMaintenanceTable';
import FuelConsumptionCard from '@/components/dashboard/FuelConsumptionCard';
import MaintenanceTypesChart from '@/components/dashboard/MaintenanceTypesChart';
import ExpenseDistributionChart from '@/components/dashboard/ExpenseDistributionChart';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVeiculos: 0,
    notasFiscais: 0,
    totalMotoristas: 0,
    contratosAtivos: 0
  });
  const [ultimasNotas, setUltimasNotas] = useState([]);
  const [ultimasManutencoes, setUltimasManutencoes] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    
    try {
      // Carregar estatísticas
      const [veiculosResult, notasResult, motoristasResult, contratosResult] = await Promise.all([
        supabase.from('Veiculos').select('id', { count: 'exact', head: true }),
        supabase.from('NotasFiscais').select('id', { count: 'exact', head: true }),
        supabase.from('Motoristas').select('id', { count: 'exact', head: true }),
        supabase.from('Contratos').select('id').eq('status_contrato', 'Em Andamento').limit(0, { count: 'exact', head: true })
      ]);
      
      setStats({
        totalVeiculos: veiculosResult.count || 0,
        notasFiscais: notasResult.count || 0,
        totalMotoristas: motoristasResult.count || 0,
        contratosAtivos: contratosResult.count || 0
      });
      
      // Carregar últimas notas fiscais
      const { data: notasData } = await supabase
        .from('NotasFiscais')
        .select('*')
        .order('data_coleta', { ascending: false })
        .limit(5);
      
      setUltimasNotas(notasData || []);
      
      // Carregar últimas manutenções
      const { data: manutencoesData } = await supabase
        .from('Manutencoes')
        .select('*')
        .order('data_manutencao', { ascending: false })
        .limit(5);
      
      setUltimasManutencoes(manutencoesData || []);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <NewPageLayout>
      <PageHeader 
        title="Painel" 
        description="Visão geral do sistema de gerenciamento de frota"
        icon={<LayoutDashboard className="h-6 w-6" />}
        actions={
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Modo Projeção
          </Button>
        }
      />

      <div className="mt-6">
        <DashboardStats 
          loading={loading} 
          stats={[
            { 
              title: 'Total de Veículos', 
              value: stats.totalVeiculos, 
              icon: <Truck className="h-5 w-5" />, 
              trend: 12, 
              descriptor: 'vs. mês anterior' 
            },
            { 
              title: 'Notas Fiscais', 
              value: stats.notasFiscais, 
              icon: <BarChart3 className="h-5 w-5" />, 
              trend: 8, 
              descriptor: 'vs. mês anterior' 
            },
            { 
              title: 'Motoristas', 
              value: stats.totalMotoristas, 
              icon: <Users className="h-5 w-5" />, 
              trend: 0, 
              descriptor: 'vs. mês anterior' 
            },
            { 
              title: 'Contratos Ativos', 
              value: stats.contratosAtivos, 
              icon: <LayoutDashboard className="h-5 w-5" />, 
              trend: -5, 
              descriptor: 'vs. mês anterior',
              trendDown: true
            },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <LatestInvoicesTable 
          title="Últimas Notas Fiscais"
          loading={loading}
          data={ultimasNotas}
          viewAllUrl="/entrada-notas"
        />
        
        <LatestMaintenanceTable 
          title="Últimas Manutenções"
          loading={loading}
          data={ultimasManutencoes}
          viewAllUrl="/manutencao"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <FuelConsumptionCard loading={loading} />
        <MaintenanceTypesChart loading={loading} />
        <ExpenseDistributionChart loading={loading} />
      </div>
    </NewPageLayout>
  );
};

export default Index;
