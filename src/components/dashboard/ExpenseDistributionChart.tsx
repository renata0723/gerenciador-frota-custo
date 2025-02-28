
import React from 'react';
import DashboardCard from './DashboardCard';

interface ExpenseItem {
  label: string;
  percentage: number;
}

const ExpenseDistributionChart: React.FC = () => {
  const expenses: ExpenseItem[] = [
    { label: 'Combustível', percentage: 45 },
    { label: 'Manutenção', percentage: 30 },
    { label: 'Motoristas', percentage: 15 },
    { label: 'Outros', percentage: 10 },
  ];

  return (
    <DashboardCard title="Distribuição de Despesas">
      <div className="space-y-4">
        {expenses.map((expense, index) => (
          <div key={index}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">{expense.label}</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{expense.percentage}%</p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-sistema-primary h-2 rounded-full" style={{ width: `${expense.percentage}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};

export default ExpenseDistributionChart;
