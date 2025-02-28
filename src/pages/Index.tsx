
import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import DashboardStats from '../components/dashboard/DashboardStats';
import LatestInvoicesTable from '../components/dashboard/LatestInvoicesTable';
import LatestMaintenanceTable from '../components/dashboard/LatestMaintenanceTable';
import FuelConsumptionCard from '../components/dashboard/FuelConsumptionCard';
import MaintenanceTypesChart from '../components/dashboard/MaintenanceTypesChart';
import ExpenseDistributionChart from '../components/dashboard/ExpenseDistributionChart';

const Index = () => {
  return (
    <PageLayout>
      <PageHeader 
        title="Dashboard" 
        description="Visão geral do sistema de gerenciamento de frota"
      />

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <LatestInvoicesTable />
        <LatestMaintenanceTable />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FuelConsumptionCard />
        <MaintenanceTypesChart />
        <ExpenseDistributionChart />
      </div>
    </PageLayout>
  );
};

export default Index;
