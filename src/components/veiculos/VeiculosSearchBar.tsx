
import React from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface VeiculosSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const VeiculosSearchBar: React.FC<VeiculosSearchBarProps> = ({ 
  searchTerm, 
  onSearchChange 
}) => {
  return (
    <div className="p-5 border-b border-gray-100 dark:border-gray-800">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <Input
            type="text"
            className="pl-10 w-full"
            placeholder="Buscar veículos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="flex items-center">
            <Filter size={16} className="mr-2" />
            Filtrar
          </Button>
          <Button variant="outline" className="flex items-center">
            <Download size={16} className="mr-2" />
            Exportar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VeiculosSearchBar;
