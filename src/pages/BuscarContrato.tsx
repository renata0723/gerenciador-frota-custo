
import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const BuscarContrato = () => {
  const [numeroContrato, setNumeroContrato] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!numeroContrato.trim()) {
      toast.error('Por favor, digite o número do contrato');
      return;
    }
    
    setIsLoading(true);
    
    // Simulando uma busca - aqui você implementaria a busca real no banco de dados
    setTimeout(() => {
      setIsLoading(false);
      
      // Simulação: se o número contiver "404", simula contrato não encontrado
      if (numeroContrato.includes('404')) {
        toast.error('Contrato não encontrado');
        return;
      }
      
      // Redireciona para a página de detalhes do contrato (que seria implementada posteriormente)
      // Ou redireciona para a página de edição de contrato existente
      toast.success('Contrato encontrado');
      navigate(`/contratos?id=${numeroContrato}`);
    }, 1500);
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Buscar Contrato" 
        description="Localize um contrato pelo seu número"
      />
      
      <div className="max-w-3xl mx-auto mt-8">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="numeroContrato">Número do Contrato</Label>
              <div className="flex space-x-2">
                <Input
                  id="numeroContrato"
                  placeholder="Digite o número do contrato"
                  value={numeroContrato}
                  onChange={(e) => setNumeroContrato(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  className="flex items-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'Buscando...' : (
                    <>
                      <Search size={18} />
                      Buscar
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md text-blue-800">
              <p className="text-sm">
                Digite o número do contrato fornecido pelo setor de operação para localizar e 
                abrir os detalhes do contrato.
              </p>
            </div>
          </form>
        </Card>
      </div>
    </PageLayout>
  );
};

export default BuscarContrato;
