
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, Filter, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Canhoto } from '@/types/canhoto';
import { supabase } from '@/integrations/supabase/client';
import { formatDate } from '@/utils/constants';

interface PesquisaDocumentosProps {
  onSelect: (documento: Canhoto) => void;
  initialFilter?: string;
}

const PesquisaDocumentos: React.FC<PesquisaDocumentosProps> = ({ onSelect, initialFilter }) => {
  const [searchTerm, setSearchTerm] = useState(initialFilter || '');
  const [documentos, setDocumentos] = useState<Canhoto[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.warning('Digite um termo para pesquisar');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Canhoto')
        .select('*')
        .or(`contrato_id.ilike.%${searchTerm}%,numero_nota_fiscal.ilike.%${searchTerm}%,numero_manifesto.ilike.%${searchTerm}%,numero_cte.ilike.%${searchTerm}%,cliente.ilike.%${searchTerm}%`);

      if (error) {
        throw error;
      }

      // Converter os IDs para número de forma segura
      const formattedData = (data || []).map(doc => ({
        ...doc,
        id: typeof doc.id === 'string' ? parseInt(doc.id, 10) : doc.id
      }));

      setDocumentos(formattedData);
      if (formattedData.length === 0) {
        toast.info('Nenhum documento encontrado com os critérios informados');
      }
    } catch (error) {
      console.error('Erro ao pesquisar documentos:', error);
      toast.error('Erro ao pesquisar documentos');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelectDocumento = (documento: Canhoto) => {
    if (typeof documento.id === 'string') {
      documento.id = parseInt(documento.id, 10);
    }
    onSelect(documento);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5 text-sistema-primary" />
          Pesquisa de Documentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Buscar por Nº Nota, Contrato, CTe, Manifesto ou Cliente..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Button 
            variant="default" 
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Buscando..." : "Buscar"}
          </Button>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contrato</TableHead>
                <TableHead>Nota Fiscal</TableHead>
                <TableHead>CTe</TableHead>
                <TableHead>Manifesto</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                    {loading ? 'Carregando...' : 'Nenhum documento encontrado'}
                  </TableCell>
                </TableRow>
              ) : (
                documentos.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{doc.contrato_id || '—'}</TableCell>
                    <TableCell>{doc.numero_nota_fiscal || '—'}</TableCell>
                    <TableCell>{doc.numero_cte || '—'}</TableCell>
                    <TableCell>{doc.numero_manifesto || '—'}</TableCell>
                    <TableCell>{doc.cliente || '—'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        doc.status === 'Recebido' 
                          ? 'bg-green-100 text-green-800' 
                          : doc.status === 'Cancelado'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {doc.status || 'Pendente'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleSelectDocumento(doc)}
                      >
                        Selecionar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PesquisaDocumentos;
