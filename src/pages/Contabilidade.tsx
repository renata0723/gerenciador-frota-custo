
import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, BookOpen, LineChart, BarChart4, PiggyBank } from 'lucide-react';

const Contabilidade = () => {
  return (
    <PageLayout>
      <PageHeader 
        title="Contabilidade" 
        description="Gerenciamento contábil e fiscal - Regime de Competência (Lucro Real)"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
        <Link to="/contabilidade/lancamentos">
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="mr-2 h-6 w-6 text-blue-600" />
                Lançamentos Contábeis
              </CardTitle>
              <CardDescription>
                Registre e consulte todos os lançamentos contábeis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Realize lançamentos de débito e crédito nas contas contábeis, com histórico e referência documental.
              </p>
              <Button className="mt-4 w-full" variant="outline">Acessar</Button>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/contabilidade/plano-contas">
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-6 w-6 text-green-600" />
                Plano de Contas
              </CardTitle>
              <CardDescription>
                Gerencie o plano de contas da empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Configure e mantenha atualizado o plano de contas contábil, com hierarquia e classificações.
              </p>
              <Button className="mt-4 w-full" variant="outline">Acessar</Button>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/contabilidade/livro-caixa">
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PiggyBank className="mr-2 h-6 w-6 text-purple-600" />
                Livro Caixa
              </CardTitle>
              <CardDescription>
                Controle de entradas e saídas financeiras
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Registre movimentações financeiras e acompanhe o fluxo de caixa da empresa.
              </p>
              <Button className="mt-4 w-full" variant="outline">Acessar</Button>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/contabilidade/dre">
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="mr-2 h-6 w-6 text-red-600" />
                DRE
              </CardTitle>
              <CardDescription>
                Demonstração do Resultado do Exercício
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Gere e analise relatórios de resultado com receitas, custos e despesas por período.
              </p>
              <Button className="mt-4 w-full" variant="outline">Acessar</Button>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/contabilidade/balanco">
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart4 className="mr-2 h-6 w-6 text-amber-600" />
                Balanço Patrimonial
              </CardTitle>
              <CardDescription>
                Posição patrimonial da empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Consulte a posição patrimonial com ativos, passivos e patrimônio líquido.
              </p>
              <Button className="mt-4 w-full" variant="outline">Acessar</Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </PageLayout>
  );
};

export default Contabilidade;
