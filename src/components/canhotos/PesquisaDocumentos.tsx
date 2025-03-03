
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface PesquisaDocumentosProps {
  onSearch: (tipo: string, valor: string) => void;
}

const PesquisaDocumentos: React.FC<PesquisaDocumentosProps> = ({ onSearch }) => {
  const [tipoDocumento, setTipoDocumento] = useState('numero_nota_fiscal');
  const [valorDocumento, setValorDocumento] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (valorDocumento.trim()) {
      onSearch(tipoDocumento, valorDocumento.trim());
    }
  };

  const getPlaceholder = () => {
    switch (tipoDocumento) {
      case 'numero_nota_fiscal': return 'Digite o número da nota fiscal';
      case 'numero_cte': return 'Digite o número do CTe';
      case 'numero_manifesto': return 'Digite o número do manifesto';
      case 'contrato_id': return 'Digite o número do contrato';
      default: return 'Digite o número do documento';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <Label htmlFor="tipo-documento">Tipo de documento</Label>
          <Select value={tipoDocumento} onValueChange={setTipoDocumento}>
            <SelectTrigger id="tipo-documento">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="numero_nota_fiscal">Nota Fiscal</SelectItem>
              <SelectItem value="numero_cte">CTe</SelectItem>
              <SelectItem value="numero_manifesto">Manifesto</SelectItem>
              <SelectItem value="contrato_id">Contrato</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-3">
          <Label htmlFor="valor-documento">Número do documento</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                id="valor-documento"
                placeholder={getPlaceholder()}
                value={valorDocumento}
                onChange={(e) => setValorDocumento(e.target.value)}
                className="pl-10"
                autoComplete="off"
              />
            </div>
            <Button type="submit" className="flex gap-1 items-center">
              <Search size={16} />
              <span>Buscar</span>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PesquisaDocumentos;
