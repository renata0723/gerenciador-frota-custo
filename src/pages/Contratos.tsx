
import React, { useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ContratosPagina from '@/components/contratos/ContratosPagina';

const Contratos = () => {
  // Adicionando logs para debug
  useEffect(() => {
    console.log('Página de Contratos carregada');
    
    // Verificar se o usuário está autenticado
    const authUser = localStorage.getItem('auth_user');
    console.log('Auth user:', authUser ? 'Autenticado' : 'Não autenticado');
    
    return () => {
      console.log('Componente Contratos desmontado');
    };
  }, []);

  return (
    <PageLayout>
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

      <div className="mt-6">
        <ContratosPagina />
      </div>
    </PageLayout>
  );
};

export default Contratos;
