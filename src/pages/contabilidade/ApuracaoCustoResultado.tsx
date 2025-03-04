
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, FileBarChart, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/utils/formatters";
import { ApuracaoCustoResultado } from "@/types/contabilidade";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ApuracaoCustoResultadoPage: React.FC = () => {
  const navigate = useNavigate();
  const [apuracoes, setApuracoes] = useState<ApuracaoCustoResultado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApuracoes();
  }, []);

  const fetchApuracoes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("Apuracao_Custo_Resultado")
        .select("*")
        .order("periodo_fim", { ascending: false });

      if (error) {
        throw error;
      }

      const formattedData = data.map(item => ({
        ...item,
        periodo_inicio: item.periodo_inicio,
        periodo_fim: item.periodo_fim,
        status: item.status
      })) as ApuracaoCustoResultado[];

      setApuracoes(formattedData);
    } catch (error) {
      console.error("Erro ao buscar apurações:", error);
      toast.error("Erro ao carregar dados de apuração de custos e resultados");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = async () => {
    try {
      const novaApuracao: Omit<ApuracaoCustoResultado, 'id'> = {
        periodo_inicio: new Date().toISOString().split('T')[0],
        periodo_fim: new Date().toISOString().split('T')[0],
        receita_fretes: 0,
        custo_combustivel: 0,
        custo_manutencao: 0,
        custo_pneus: 0,
        custo_salarios: 0,
        despesas_administrativas: 0,
        despesas_financeiras: 0,
        outros_custos: 0,
        km_rodados: 0,
        status: "aberto"
      };

      const { data, error } = await supabase
        .from("Apuracao_Custo_Resultado")
        .insert([novaApuracao])
        .select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setApuracoes(prev => [data[0] as ApuracaoCustoResultado, ...prev]);
        
        // Navegar para a página de detalhes da nova apuração
        navigate(`/contabilidade/apuracao/${data[0].id}`);
        toast.success("Nova apuração de custos e resultados criada com sucesso");
      }
    } catch (error) {
      console.error("Erro ao criar nova apuração:", error);
      toast.error("Erro ao criar nova apuração de custos e resultados");
    }
  };

  const formatarPeriodo = (inicio: string, fim: string) => {
    try {
      const dataInicio = new Date(inicio);
      const dataFim = new Date(fim);
      return `${format(dataInicio, 'dd/MM/yyyy')} - ${format(dataFim, 'dd/MM/yyyy')}`;
    } catch (error) {
      return `${inicio} - ${fim}`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aberto":
        return "text-yellow-500";
      case "fechado":
        return "text-green-500";
      case "cancelado":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Apuração de Custos e Resultados"
        description="Gerenciar apurações de custos e resultados operacionais"
        icon={<FileBarChart className="h-6 w-6" />}
      />

      <div className="mb-6">
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" /> Nova Apuração
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Apurações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p>Carregando apurações...</p>
            </div>
          ) : apuracoes.length === 0 ? (
            <div className="text-center py-8">
              <FileBarChart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                Nenhuma apuração de custos e resultados encontrada
              </h3>
              <p className="mt-1 text-gray-500">
                Crie uma nova apuração para começar a analisar seus resultados.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Período</TableHead>
                    <TableHead>Receita</TableHead>
                    <TableHead>Custos Totais</TableHead>
                    <TableHead>Resultado</TableHead>
                    <TableHead>Margem</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apuracoes.map((apuracao) => {
                    const custoTotal = 
                      (apuracao.custo_combustivel || 0) + 
                      (apuracao.custo_manutencao || 0) + 
                      (apuracao.custo_pneus || 0) + 
                      (apuracao.custo_salarios || 0) + 
                      (apuracao.despesas_administrativas || 0) + 
                      (apuracao.despesas_financeiras || 0) + 
                      (apuracao.outros_custos || 0);
                    
                    return (
                      <TableRow key={apuracao.id}>
                        <TableCell>{formatarPeriodo(apuracao.periodo_inicio, apuracao.periodo_fim)}</TableCell>
                        <TableCell>{formatCurrency(apuracao.receita_fretes)}</TableCell>
                        <TableCell>{formatCurrency(custoTotal)}</TableCell>
                        <TableCell>{formatCurrency(apuracao.resultado_liquido || 0)}</TableCell>
                        <TableCell>
                          {apuracao.margem_lucro 
                            ? `${(apuracao.margem_lucro * 100).toFixed(2)}%` 
                            : "-"}
                        </TableCell>
                        <TableCell className={getStatusColor(apuracao.status)}>
                          {apuracao.status === "aberto" ? "Aberto" : 
                           apuracao.status === "fechado" ? "Fechado" : 
                           apuracao.status === "cancelado" ? "Cancelado" : 
                           apuracao.status}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => navigate(`/contabilidade/apuracao/${apuracao.id}`)}
                          >
                            Detalhes <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default ApuracaoCustoResultadoPage;
