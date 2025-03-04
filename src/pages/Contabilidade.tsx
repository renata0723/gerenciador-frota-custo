
import React from 'react';
import NewPageLayout from '@/components/layout/NewPageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileText,
  BarChart2,
  BookOpen,
  DollarSign,
  CreditCard,
  Calculator,
  TrendingUp,
  FilePlus,
  Users,
  FileSpreadsheet,
  Lock,
  CalendarRange,
  Percent
} from 'lucide-react';

const Contabilidade = () => {
  const navigate = (path: string) => {
    window.location.href = path;
  };

  const menuItems = [
    {
      title: 'Plano de Contas',
      description: 'Gerencie o plano de contas contábil da empresa',
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      onClick: () => navigate('/contabilidade/plano-contas')
    },
    {
      title: 'Lançamentos Contábeis',
      description: 'Registre e consulte lançamentos contábeis',
      icon: <FileText className="h-8 w-8 text-indigo-500" />,
      onClick: () => navigate('/contabilidade/lancamentos')
    },
    {
      title: 'Livro Caixa',
      description: 'Movimentações de entrada e saída do caixa',
      icon: <CreditCard className="h-8 w-8 text-emerald-500" />,
      onClick: () => navigate('/contabilidade/livro-caixa')
    },
    {
      title: 'DRE',
      description: 'Demonstração do Resultado do Exercício',
      icon: <BarChart2 className="h-8 w-8 text-purple-500" />,
      onClick: () => navigate('/contabilidade/dre')
    },
    {
      title: 'Apuração de Custos e Resultados',
      description: 'Análise detalhada de custos, receitas e resultados',
      icon: <Calculator className="h-8 w-8 text-rose-500" />,
      onClick: () => navigate('/contabilidade/apuracao-custo-resultado')
    },
    {
      title: 'Apuração de Impostos',
      description: 'Cálculo e controle de tributos para Lucro Real',
      icon: <Percent className="h-8 w-8 text-orange-500" />,
      onClick: () => navigate('/contabilidade/apuracao-impostos')
    },
    {
      title: 'Balanço Patrimonial',
      description: 'Visualize ativos, passivos e patrimônio líquido',
      icon: <TrendingUp className="h-8 w-8 text-amber-500" />,
      onClick: () => navigate('/contabilidade/balanco')
    },
    {
      title: 'Folha de Pagamento',
      description: 'Gerencie salários e encargos dos funcionários',
      icon: <Users className="h-8 w-8 text-cyan-500" />,
      onClick: () => navigate('/contabilidade/folha-pagamento')
    },
    {
      title: 'Relatórios',
      description: 'Acesse e gere relatórios contábeis',
      icon: <FileSpreadsheet className="h-8 w-8 text-orange-500" />,
      onClick: () => navigate('/contabilidade/relatorios')
    },
    {
      title: 'Balancete',
      description: 'Visualize e gerencie os balancetes contábeis',
      icon: <FileText className="h-8 w-8 text-teal-500" />,
      onClick: () => navigate('/contabilidade/balancete')
    },
    {
      title: 'Fechamento Fiscal',
      description: 'Realize o fechamento de períodos fiscais',
      icon: <Lock className="h-8 w-8 text-red-500" />,
      onClick: () => navigate('/contabilidade/fechamento-fiscal')
    },
    {
      title: 'Conciliação Bancária',
      description: 'Concilie transações bancárias com o sistema',
      icon: <CreditCard className="h-8 w-8 text-blue-600" />,
      onClick: () => navigate('/contabilidade/conciliacao-bancaria')
    },
    {
      title: 'Agenda Fiscal',
      description: 'Calendário de obrigações fiscais e tributárias',
      icon: <CalendarRange className="h-8 w-8 text-green-600" />,
      onClick: () => navigate('/contabilidade/agenda-fiscal')
    }
  ];

  return (
    <NewPageLayout>
      <PageHeader
        title="Controladoria de Custo"
        description="Gestão financeira e controle contábil da empresa"
        icon={<DollarSign className="h-6 w-6" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {menuItems.map((item, index) => (
          <Card 
            key={index} 
            className="hover:shadow-md transition-shadow cursor-pointer border border-gray-200 overflow-hidden"
            onClick={item.onClick}
          >
            <CardHeader className="pb-2 flex flex-row items-center justify-between bg-gray-50 border-b">
              <div>
                <CardTitle className="text-lg font-medium">{item.title}</CardTitle>
                <CardDescription className="text-sm mt-1">{item.description}</CardDescription>
              </div>
              <div className="ml-4 p-2 rounded-lg bg-white shadow-sm">
                {item.icon}
              </div>
            </CardHeader>
            <CardContent className="pt-4 pb-4">
              <Button 
                variant="ghost" 
                className="text-sistema-primary hover:bg-sistema-primary/10 flex items-center"
              >
                Acessar <FilePlus className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </NewPageLayout>
  );
};

export default Contabilidade;
