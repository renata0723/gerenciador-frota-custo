
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export interface VeiculosSearchBarProps {
  value: string;
  onSearch: (value: string) => void;
}

const VeiculosSearchBar: React.FC<VeiculosSearchBarProps> = ({ value, onSearch }) => {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        type="search"
        placeholder="Buscar por placa..."
        className="pl-8"
        value={value}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default VeiculosSearchBar;
