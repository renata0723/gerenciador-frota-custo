
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/constants';

interface VeiculoRelatorio {
  id: string | number;
  placa: string;
  tipo: string;
  modelo?: string;
  ano?: number;
  status: string;
  frota: string;
  inativacao?: {
    data: string;
    motivo: string;
  } | null;
}

interface RelatorioVeiculosTableProps {
  veiculos: VeiculoRelatorio[];
  titulo: string;
  dataRelatorio?: string;
  filtroAtivo?: string;
  onExportar?: () => void;
  onImprimir?: () => void;
}

const RelatorioVeiculosTable = ({
  veiculos,
  titulo,
  dataRelatorio,
  filtroAtivo,
  onExportar,
  onImprimir
}: RelatorioVeiculosTableProps) => {

  // Formato PT-BR: dia/mês/ano
  const dataFormatada = dataRelatorio ? formatDate(dataRelatorio) : formatDate(new Date().toISOString());

  // Contagem por tipo de frota
  const totalProprios = veiculos.filter(v => v.frota === 'Própria' || v.frota === 'propria').length;
  const totalTerceirizados = veiculos.filter(v => v.frota === 'Terceirizada' || v.frota === 'terceirizada').length;
  
  // Contagem de status
  const totalAtivos = veiculos.filter(v => v.status === 'Ativo' || v.status === 'ativo').length;
  const totalInativos = veiculos.filter(v => v.status === 'Inativo' || v.status === 'inativo').length;

  return (
    <Card className="border rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{titulo}</h2>
            <p className="text-gray-500">Período: {dataFormatada}</p>
            {filtroAtivo && <p className="text-sm text-gray-500">Filtro ativo: {filtroAtivo}</p>}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onExportar}>
              <Download size={16} className="mr-2" />
              Exportar
            </Button>
            <Button variant="outline" size="sm" onClick={onImprimir}>
              <Printer size={16} className="mr-2" />
              Imprimir
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total de Veículos</p>
            <p className="text-2xl font-bold">{veiculos.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Frota Própria</p>
            <p className="text-2xl font-bold">{totalProprios}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Frota Terceirizada</p>
            <p className="text-2xl font-bold">{totalTerceirizados}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Veículos Ativos</p>
            <p className="text-2xl font-bold">{totalAtivos}</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Placa</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Ano</TableHead>
              <TableHead>Tipo de Frota</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data Inativação</TableHead>
              <TableHead>Motivo Inativação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {veiculos.map((veiculo) => (
              <TableRow key={veiculo.id}>
                <TableCell className="font-medium">{veiculo.placa}</TableCell>
                <TableCell>{veiculo.tipo}</TableCell>
                <TableCell>{veiculo.modelo || 'N/A'}</TableCell>
                <TableCell>{veiculo.ano || 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant={veiculo.frota.toLowerCase().includes('propria') ? "outline" : "secondary"}>
                    {veiculo.frota}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={veiculo.status === 'Ativo' || veiculo.status === 'ativo' ? "success" : "destructive"}>
                    {veiculo.status}
                  </Badge>
                </TableCell>
                <TableCell>{veiculo.inativacao?.data ? formatDate(veiculo.inativacao.data) : '-'}</TableCell>
                <TableCell className="max-w-xs truncate">{veiculo.inativacao?.motivo || '-'}</TableCell>
              </TableRow>
            ))}
            {veiculos.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  Nenhum veículo encontrado com os critérios de filtro atuais
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default RelatorioVeiculosTable;
