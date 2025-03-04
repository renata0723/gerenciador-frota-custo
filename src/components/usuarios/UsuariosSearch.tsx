
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UsuariosSearchProps {
  filtro: string;
  setFiltro: (value: string) => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const UsuariosSearch: React.FC<UsuariosSearchProps> = ({
  filtro,
  setFiltro,
  activeTab,
  setActiveTab
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="relative w-full sm:w-80">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <Input 
          placeholder="Buscar usuário por nome, e-mail ou cargo..." 
          className="pl-10"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="ativo">Ativos</TabsTrigger>
          <TabsTrigger value="inativo">Inativos</TabsTrigger>
          <TabsTrigger value="bloqueado">Bloqueados</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default UsuariosSearch;
