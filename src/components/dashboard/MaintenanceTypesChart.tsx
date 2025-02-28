
import React from 'react';
import DashboardCard from './DashboardCard';

const MaintenanceTypesChart: React.FC = () => {
  return (
    <DashboardCard title="Manutenções Por Tipo">
      <div className="h-48 flex items-center justify-center">
        <div className="flex space-x-6">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-8 border-sistema-primary flex items-center justify-center">
              <p className="text-xl font-bold">65%</p>
            </div>
            <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Preventiva</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-8 border-gray-300 flex items-center justify-center">
              <p className="text-xl font-bold">35%</p>
            </div>
            <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Corretiva</p>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default MaintenanceTypesChart;
