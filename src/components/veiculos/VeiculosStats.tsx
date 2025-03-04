
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VeiculoData } from '@/types/veiculo';

export interface VeiculosStatsProps {
  veiculos: VeiculoData[];
}

const VeiculosStats: React.FC<VeiculosStatsProps> = ({ veiculos }) => {
  const totalVeiculos = veiculos.length;
  const veiculosAtivos = veiculos.filter(v => v.status_veiculo === 'ativo').length;
  const veiculosInativos = veiculos.filter(v => v.status_veiculo === 'inativo').length;
  const veiculosFrota = veiculos.filter(v => v.tipo_frota === 'propria').length;
  const veiculosTerceiros = veiculos.filter(v => v.tipo_frota === 'terceiro').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Total de Veículos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalVeiculos}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Veículos Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{veiculosAtivos}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Veículos Inativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{veiculosInativos}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Frota Própria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{veiculosFrota}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Terceirizados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600">{veiculosTerceiros}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VeiculosStats;
