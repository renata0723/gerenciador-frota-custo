
import React from 'react';
import NewPageLayout from '@/components/layout/NewPageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ContratosPagina from '@/components/contratos/ContratosPagina';

const Contratos = () => {
  return (
    <NewPageLayout>
      <PageHeader 
        title="Contratos" 
        description="Gerencie os contratos de frete"
        icon={<FileText size={26} className="text-blue-500" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Contratos' }
        ]}
        actions={
          <Link to="/contratos/novo">
            <Button>
              <Plus size={16} className="mr-2" />
              Novo Contrato
            </Button>
          </Link>
        }
      />

      <div className="mt-6 bg-white rounded-lg shadow">
        <ContratosPagina />
      </div>
    </NewPageLayout>
  );
};

export default Contratos;
