
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardCard from './DashboardCard';

interface InvoiceItem {
  id: string;
  client: string;
  destination: string;
  value: string;
}

const LatestInvoicesTable: React.FC = () => {
  // Dados simulados para tabelas
  const latestNotes: InvoiceItem[] = [
    { id: 'NF-12345', client: 'Empresa ABC Ltda', destination: 'São Paulo, SP', value: 'R$ 15.450,00' },
    { id: 'NF-12346', client: 'Distribuidora XYZ', destination: 'Rio de Janeiro, RJ', value: 'R$ 8.720,50' },
    { id: 'NF-12347', client: 'Indústria MNO', destination: 'Curitiba, PR', value: 'R$ 22.150,00' },
    { id: 'NF-12348', client: 'Comércio RST', destination: 'Belo Horizonte, MG', value: 'R$ 5.890,75' },
  ];

  return (
    <DashboardCard 
      title="Últimas Notas Fiscais" 
      action={
        <Link to="/entrada-notas" className="text-sistema-primary text-xs font-medium flex items-center hover:text-sistema-primary-dark transition-colors duration-200">
          Ver todas <ArrowRight size={14} className="ml-1" />
        </Link>
      }
    >
      <div className="table-container">
        <table className="table-default">
          <thead className="table-head">
            <tr>
              <th className="table-header-cell">Nº Nota</th>
              <th className="table-header-cell">Cliente</th>
              <th className="table-header-cell">Destino</th>
              <th className="table-header-cell">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {latestNotes.map((note) => (
              <tr key={note.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                <td className="table-cell font-medium">
                  <Link 
                    to={`/entrada-notas/editar/${note.id}`} 
                    className="text-sistema-primary hover:underline"
                  >
                    {note.id}
                  </Link>
                </td>
                <td className="table-cell">{note.client}</td>
                <td className="table-cell">{note.destination}</td>
                <td className="table-cell">{note.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
};

export default LatestInvoicesTable;
