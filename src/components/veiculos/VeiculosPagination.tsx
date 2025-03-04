
import React from 'react';
import { Button } from "@/components/ui/button";

interface VeiculosPaginationProps {
  totalItems: number;
  filteredItems: number;
}

const VeiculosPagination: React.FC<VeiculosPaginationProps> = ({ 
  totalItems, 
  filteredItems 
}) => {
  return (
    <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Mostrando {filteredItems} de {totalItems} veículos
        </p>
      </div>
      
      <div className="flex space-x-2">
        <Button variant="outline" className="px-3 py-1" disabled>
          Anterior
        </Button>
        <Button className="px-3 py-1">
          1
        </Button>
        <Button variant="outline" className="px-3 py-1" disabled>
          Próximo
        </Button>
      </div>
    </div>
  );
};

export default VeiculosPagination;
