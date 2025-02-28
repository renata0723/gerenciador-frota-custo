
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardCard from './DashboardCard';

interface MaintenanceItem {
  id: string;
  vehicle: string;
  type: string;
  status: string;
}

const LatestMaintenanceTable: React.FC = () => {
  // Dados simulados para tabelas
  const latestMaintenance: MaintenanceItem[] = [
    { id: 'MAN-001', vehicle: 'ABC-1234', type: 'Preventiva', status: 'Concluída' },
    { id: 'MAN-002', vehicle: 'DEF-5678', type: 'Corretiva', status: 'Em andamento' },
    { id: 'MAN-003', vehicle: 'GHI-9012', type: 'Preventiva', status: 'Agendada' },
  ];

  return (
    <DashboardCard 
      title="Últimas Manutenções" 
      action={
        <Link to="/manutencao" className="text-sistema-primary text-xs font-medium flex items-center hover:text-sistema-primary-dark transition-colors duration-200">
          Ver todas <ArrowRight size={14} className="ml-1" />
        </Link>
      }
    >
      <div className="table-container">
        <table className="table-default">
          <thead className="table-head">
            <tr>
              <th className="table-header-cell">ID</th>
              <th className="table-header-cell">Veículo</th>
              <th className="table-header-cell">Tipo</th>
              <th className="table-header-cell">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {latestMaintenance.map((maintenance) => (
              <tr key={maintenance.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                <td className="table-cell font-medium">{maintenance.id}</td>
                <td className="table-cell">{maintenance.vehicle}</td>
                <td className="table-cell">{maintenance.type}</td>
                <td className="table-cell">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    maintenance.status === 'Concluída' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : maintenance.status === 'Em andamento'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {maintenance.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
};

export default LatestMaintenanceTable;
