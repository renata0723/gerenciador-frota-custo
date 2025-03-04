
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { CanhotoBusca } from '@/types/canhoto';

interface CanhotoPesquisaProps {
  onSearch: (filtro: CanhotoBusca) => void;
}

const CanhotoPesquisa: React.FC<CanhotoPesquisaProps> = ({ onSearch }) => {
  const [termoBusca, setTermoBusca] = useState('');
  const [tipoBusca, setTipoBusca] = useState('todos');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let filtro: CanhotoBusca = {};
    
    // Definir critério de busca baseado no tipo selecionado
    if (tipoBusca === 'contrato') {
      filtro.contrato_id = termoBusca;
    } else if (tipoBusca === 'cliente') {
      filtro.cliente = termoBusca;
    } else if (tipoBusca === 'cte') {
      filtro.numero_cte = termoBusca;
    } else if (tipoBusca === 'manifesto') {
      filtro.numero_manifesto = termoBusca;
    } else if (tipoBusca === 'nota') {
      filtro.numero_nota_fiscal = termoBusca;
    }
    
    onSearch(filtro);
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 mb-4">
      <div className="flex-1 flex space-x-2">
        <Select 
          value={tipoBusca} 
          onValueChange={setTipoBusca}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo de busca" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="contrato">Contrato</SelectItem>
            <SelectItem value="cliente">Cliente</SelectItem>
            <SelectItem value="cte">CT-e</SelectItem>
            <SelectItem value="manifesto">Manifesto</SelectItem>
            <SelectItem value="nota">Nota Fiscal</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            className="pl-8"
            placeholder={`Buscar por ${tipoBusca === 'todos' ? 'termo' : tipoBusca}...`}
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
        </div>
      </div>
      
      <Button variant="outline" type="submit" className="gap-2">
        <Search size={16} />
        <span>Buscar</span>
      </Button>
      
      <Button variant="outline" type="button" className="gap-2">
        <Filter size={16} />
        <span>Filtros Avançados</span>
      </Button>
    </form>
  );
};

export default CanhotoPesquisa;
