
import React from 'react';
import { Truck } from 'lucide-react';

const VeiculoTableEmpty: React.FC = () => {
  return (
    <tr>
      <td colSpan={7} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
        <div className="flex flex-col items-center justify-center">
          <Truck size={32} className="mb-2 text-gray-400" />
          <p>Nenhum veículo encontrado</p>
        </div>
      </td>
    </tr>
  );
};

export default VeiculoTableEmpty;
