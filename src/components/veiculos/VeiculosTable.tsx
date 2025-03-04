
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, AlertTriangle } from 'lucide-react';
import { VeiculoData } from '@/types/veiculo';
import { useNavigate } from 'react-router-dom';

export interface VeiculosTableProps {
  veiculos: VeiculoData[];
  onExcluir: (placa: string) => Promise<void>;
  onReload: () => Promise<void>;
}

const VeiculosTable: React.FC<VeiculosTableProps> = ({ veiculos, onExcluir, onReload }) => {
  const navigate = useNavigate();

  if (veiculos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">Nenhum veículo encontrado</h3>
        <p className="text-gray-500 mb-4 text-center">Não foram encontrados veículos com os filtros atuais.</p>
        <Button onClick={onReload} variant="outline">Atualizar lista</Button>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Placa (Cavalo)</TableHead>
            <TableHead>Placa (Carreta)</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {veiculos.map((veiculo) => (
            <TableRow key={veiculo.placa_cavalo}>
              <TableCell>{veiculo.placa_cavalo}</TableCell>
              <TableCell>{veiculo.placa_carreta || "N/A"}</TableCell>
              <TableCell>
                <Badge variant={veiculo.tipo_frota === 'propria' ? "default" : "outline"}>
                  {veiculo.tipo_frota === 'propria' ? 'Frota Própria' : 'Terceirizado'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={veiculo.status_veiculo === 'ativo' ? "success" : "destructive"}>
                  {veiculo.status_veiculo === 'ativo' ? 'Ativo' : 'Inativo'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => navigate(`/veiculos/visualizar/${veiculo.placa_cavalo}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => navigate(`/veiculos/editar/${veiculo.placa_cavalo}`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => onExcluir(veiculo.placa_cavalo)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VeiculosTable;
