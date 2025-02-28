
import React from 'react';
import { Fuel } from 'lucide-react';
import DashboardCard from './DashboardCard';
import { logOperation } from '@/utils/logOperations';

interface FuelItem {
  vehicle: string;
  lastFuel: string;
  avgConsumption: string;
}

const FuelConsumptionCard: React.FC = () => {
  const fuelConsumption: FuelItem[] = [
    { vehicle: 'ABC-1234', lastFuel: '250 L', avgConsumption: '2,8 km/L' },
    { vehicle: 'DEF-5678', lastFuel: '180 L', avgConsumption: '3,2 km/L' },
    { vehicle: 'GHI-9012', lastFuel: '220 L', avgConsumption: '2,5 km/L' },
  ];

  const handleVehicleClick = (vehicle: string) => {
    logOperation('Visualização de Veículo', `Informações de combustível para: ${vehicle}`);
  };

  return (
    <DashboardCard title="Consumo de Combustível">
      <div className="space-y-4">
        {fuelConsumption.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center p-3 border border-gray-100 dark:border-gray-800 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
            onClick={() => handleVehicleClick(item.vehicle)}
          >
            <div className="w-10 h-10 rounded-full bg-sistema-primary/10 dark:bg-sistema-primary/20 flex items-center justify-center">
              <Fuel className="text-sistema-primary" size={20} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{item.vehicle}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Média: {item.avgConsumption}</p>
            </div>
            <div className="ml-auto">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{item.lastFuel}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Último abast.</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};

export default FuelConsumptionCard;
