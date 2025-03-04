
import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, AlertCircle, Trash } from 'lucide-react';

interface VeiculoData {
  id: string | number;
  placa: string;
  tipo: string;
  modelo: string;
  ano: number;
  status: 'Ativo' | 'Inativo';
  frota: string;
}

interface VeiculoTableRowProps {
  veiculo: VeiculoData;
  onEdit: (veiculo: VeiculoData) => void;
  onInativar: (id: number | string) => void;
  onDelete: (id: number | string) => void;
}

const VeiculoTableRow: React.FC<VeiculoTableRowProps> = ({
  veiculo,
  onEdit,
  onInativar,
  onDelete
}) => {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
        <Link
          to={`/veiculos/editar/${veiculo.id}`}
          state={{ veiculoData: veiculo }}
          className="text-sistema-primary hover:underline"
        >
          {veiculo.placa}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{veiculo.tipo}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{veiculo.modelo}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{veiculo.ano}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <span className={`px-2 py-1 text-xs rounded-full ${
          veiculo.frota === 'Própria' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
            : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
        }`}>
          {veiculo.frota}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <span className={`px-2 py-1 text-xs rounded-full ${
          veiculo.status === 'Ativo' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {veiculo.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
        <div className="flex items-center justify-end space-x-3">
          <button 
            onClick={() => onEdit(veiculo)}
            className="text-gray-500 hover:text-sistema-primary transition-colors duration-200" 
            title="Editar"
          >
            <Edit size={18} />
          </button>

          {veiculo.status === 'Ativo' && (
            <button 
              onClick={() => onInativar(veiculo.id)}
              className="text-yellow-500 hover:text-yellow-600 transition-colors duration-200" 
              title="Inativar"
            >
              <AlertCircle size={18} />
            </button>
          )}

          <button 
            onClick={() => onDelete(veiculo.id)} 
            className="text-gray-500 hover:text-red-500 transition-colors duration-200" 
            title="Excluir"
          >
            <Trash size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default VeiculoTableRow;
