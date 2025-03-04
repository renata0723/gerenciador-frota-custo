
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/ui/PageHeader";
import { Truck, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface VeiculosErrorProps {
  error: string;
  onRetry: () => void;
}

const VeiculosError: React.FC<VeiculosErrorProps> = ({ error, onRetry }) => {
  return (
    <>
      <PageHeader 
        title="Veículos" 
        description="Gerencie sua frota de veículos"
        icon={<Truck size={26} className="text-blue-500" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Veículos' }
        ]}
        actions={
          <Link to="/veiculos/novo">
            <Button>
              <Plus size={16} className="mr-2" />
              Novo Veículo
            </Button>
          </Link>
        }
      />
      
      <div className="bg-white rounded-xl shadow-card border border-gray-100 p-6 mb-8">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
            <span className="text-lg font-medium">{error}</span>
          </div>
          <Button onClick={onRetry}>Tentar novamente</Button>
        </div>
      </div>
    </>
  );
};

export default VeiculosError;
