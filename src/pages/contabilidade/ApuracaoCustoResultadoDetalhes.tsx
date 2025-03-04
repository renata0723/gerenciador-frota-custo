
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, FileBarChart, Calculator } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/utils/formatters";
import { ApuracaoCustoResultado } from "@/types/contabilidade";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ApuracaoCustoResultadoDetalhes: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apuracao, setApuracao] = useState<ApuracaoCustoResultado | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchApuracao(parseInt(id));
    }
  }, [id]);

  const fetchApuracao = async (apuracaoId: number) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("Apuracao_Custo_Resultado")
        .select("*")
        .eq("id", apuracaoId)
        .single();

      if (error) {
        throw error;
      }

      setApuracao(data as ApuracaoCustoResultado);
    } catch (error) {
      console.error("Erro ao buscar apuração:", error);
      toast.error("Erro ao carregar dados da apuração");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (!apuracao) return;
    
    setApuracao({
      ...apuracao,
      [name]: name === "observacoes" ? value : Number(value) || 0
    });
  };

  const calcularResultados = () => {
    if (!apuracao) return;

    // Soma todos os custos
    const custoTotal = 
      (apuracao.custo_combustivel || 0) +
      (apuracao.custo_manutencao || 0) +
      (apuracao.custo_pneus || 0) +
      (apuracao.custo_salarios || 0) +
      (apuracao.despesas_administrativas || 0) +
      (apuracao.despesas_financeiras || 0) +
      (apuracao.outros_custos || 0);

    // Calcula resultado bruto e líquido
    const resultadoBruto = apuracao.receita_fretes - custoTotal;
    const resultadoLiquido = resultadoBruto;
    
    // Calcula margem de lucro
    const margemLucro = apuracao.receita_fretes > 0 
      ? resultadoLiquido / apuracao.receita_fretes
      : 0;
    
    // Calcula custo por km
    const custoKm = apuracao.km_rodados > 0
      ? custoTotal / apuracao.km_rodados
      : 0;

    setApuracao({
      ...apuracao,
      resultado_bruto: resultadoBruto,
      resultado_liquido: resultadoLiquido,
      margem_lucro: margemLucro,
      custo_km: custoKm
    });

    toast.success("Cálculos realizados com sucesso");
  };

  const handleSave = async () => {
    if (!apuracao) return;
    
    try {
      setSaving(true);
      
      // Calcula os resultados antes de salvar
      calcularResultados();

      const { error } = await supabase
        .from("Apuracao_Custo_Resultado")
        .update({
          periodo_inicio: apuracao.periodo_inicio,
          periodo_fim: apuracao.periodo_fim,
          receita_fretes: apuracao.receita_fretes,
          custo_combustivel: apuracao.custo_combustivel,
          custo_manutencao: apuracao.custo_manutencao,
          custo_pneus: apuracao.custo_pneus,
          custo_salarios: apuracao.custo_salarios,
          despesas_administrativas: apuracao.despesas_administrativas,
          despesas_financeiras: apuracao.despesas_financeiras,
          outros_custos: apuracao.outros_custos,
          resultado_bruto: apuracao.resultado_bruto,
          resultado_liquido: apuracao.resultado_liquido,
          margem_lucro: apuracao.margem_lucro,
          custo_km: apuracao.custo_km,
          km_rodados: apuracao.km_rodados,
          observacoes: apuracao.observacoes,
          status: apuracao.status,
        })
        .eq("id", apuracao.id);

      if (error) {
        throw error;
      }

      toast.success("Apuração salva com sucesso");
    } catch (error) {
      console.error("Erro ao salvar apuração:", error);
      toast.error("Erro ao salvar apuração");
    } finally {
      setSaving(false);
    }
  };

  const handleChangeStatus = async (newStatus: 'aberto' | 'fechado' | 'cancelado') => {
    if (!apuracao) return;
    
    try {
      const { error } = await supabase
        .from("Apuracao_Custo_Resultado")
        .update({ status: newStatus })
        .eq("id", apuracao.id);

      if (error) {
        throw error;
      }

      setApuracao({ ...apuracao, status: newStatus });
      toast.success(`Status alterado para ${newStatus}`);
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      toast.error("Erro ao alterar status da apuração");
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-64">
          <p>Carregando...</p>
        </div>
      </PageLayout>
    );
  }

  if (!apuracao) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-64">
          <p>Apuração não encontrada</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title="Detalhes da Apuração"
        description={`Apuração de custos e resultados do período: ${
          apuracao.periodo_inicio && apuracao.periodo_fim
            ? `${format(new Date(apuracao.periodo_inicio), 'dd/MM/yyyy')} - ${format(new Date(apuracao.periodo_fim), 'dd/MM/yyyy')}`
            : "Período não definido"
        }`}
        icon={<FileBarChart className="h-6 w-6" />}
      />

      <div className="mb-6 flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate("/contabilidade/apuracao-custo-resultado")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        
        <div className="flex gap-2">
          <Button variant="default" onClick={calcularResultados}>
            <Calculator className="mr-2 h-4 w-4" /> Calcular Resultados
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" /> {saving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Período da Apuração</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="periodo_inicio">Data Inicial</Label>
                <Input
                  id="periodo_inicio"
                  name="periodo_inicio"
                  type="date"
                  value={apuracao.periodo_inicio}
                  onChange={handleInputChange}
                  disabled={apuracao.status !== "aberto"}
                />
              </div>
              <div>
                <Label htmlFor="periodo_fim">Data Final</Label>
                <Input
                  id="periodo_fim"
                  name="periodo_fim"
                  type="date"
                  value={apuracao.periodo_fim}
                  onChange={handleInputChange}
                  disabled={apuracao.status !== "aberto"}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <div className="flex gap-2 mt-2">
                  <Button 
                    size="sm" 
                    variant={apuracao.status === "aberto" ? "default" : "outline"}
                    onClick={() => handleChangeStatus("aberto")}
                    className={apuracao.status === "aberto" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                  >
                    Aberto
                  </Button>
                  <Button 
                    size="sm" 
                    variant={apuracao.status === "fechado" ? "default" : "outline"}
                    onClick={() => handleChangeStatus("fechado")}
                    className={apuracao.status === "fechado" ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    Fechado
                  </Button>
                  <Button 
                    size="sm" 
                    variant={apuracao.status === "cancelado" ? "default" : "outline"}
                    onClick={() => handleChangeStatus("cancelado")}
                    className={apuracao.status === "cancelado" ? "bg-red-500 hover:bg-red-600" : ""}
                  >
                    Cancelado
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receitas e Quilometragem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="receita_fretes">Receita de Fretes (R$)</Label>
                <Input
                  id="receita_fretes"
                  name="receita_fretes"
                  type="number"
                  value={apuracao.receita_fretes}
                  onChange={handleInputChange}
                  disabled={apuracao.status !== "aberto"}
                />
              </div>
              <div>
                <Label htmlFor="km_rodados">Quilômetros Rodados</Label>
                <Input
                  id="km_rodados"
                  name="km_rodados"
                  type="number"
                  value={apuracao.km_rodados}
                  onChange={handleInputChange}
                  disabled={apuracao.status !== "aberto"}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resultados Calculados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Resultado Bruto</Label>
                <p className="text-lg font-semibold mt-1">
                  {formatCurrency(apuracao.resultado_bruto || 0)}
                </p>
              </div>
              <div>
                <Label>Resultado Líquido</Label>
                <p className={`text-lg font-semibold mt-1 ${(apuracao.resultado_liquido || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(apuracao.resultado_liquido || 0)}
                </p>
              </div>
              <div>
                <Label>Margem de Lucro</Label>
                <p className="text-lg font-semibold mt-1">
                  {apuracao.margem_lucro ? `${(apuracao.margem_lucro * 100).toFixed(2)}%` : "-"}
                </p>
              </div>
              <div>
                <Label>Custo por Km</Label>
                <p className="text-lg font-semibold mt-1">
                  {apuracao.custo_km ? formatCurrency(apuracao.custo_km) : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Custos Operacionais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="custo_combustivel">Combustível (R$)</Label>
                <Input
                  id="custo_combustivel"
                  name="custo_combustivel"
                  type="number"
                  value={apuracao.custo_combustivel}
                  onChange={handleInputChange}
                  disabled={apuracao.status !== "aberto"}
                />
              </div>
              <div>
                <Label htmlFor="custo_manutencao">Manutenção (R$)</Label>
                <Input
                  id="custo_manutencao"
                  name="custo_manutencao"
                  type="number"
                  value={apuracao.custo_manutencao}
                  onChange={handleInputChange}
                  disabled={apuracao.status !== "aberto"}
                />
              </div>
              <div>
                <Label htmlFor="custo_pneus">Pneus (R$)</Label>
                <Input
                  id="custo_pneus"
                  name="custo_pneus"
                  type="number"
                  value={apuracao.custo_pneus}
                  onChange={handleInputChange}
                  disabled={apuracao.status !== "aberto"}
                />
              </div>
              <div>
                <Label htmlFor="custo_salarios">Salários (R$)</Label>
                <Input
                  id="custo_salarios"
                  name="custo_salarios"
                  type="number"
                  value={apuracao.custo_salarios}
                  onChange={handleInputChange}
                  disabled={apuracao.status !== "aberto"}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Despesas e Outros Custos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="despesas_administrativas">Despesas Administrativas (R$)</Label>
                <Input
                  id="despesas_administrativas"
                  name="despesas_administrativas"
                  type="number"
                  value={apuracao.despesas_administrativas}
                  onChange={handleInputChange}
                  disabled={apuracao.status !== "aberto"}
                />
              </div>
              <div>
                <Label htmlFor="despesas_financeiras">Despesas Financeiras (R$)</Label>
                <Input
                  id="despesas_financeiras"
                  name="despesas_financeiras"
                  type="number"
                  value={apuracao.despesas_financeiras}
                  onChange={handleInputChange}
                  disabled={apuracao.status !== "aberto"}
                />
              </div>
              <div>
                <Label htmlFor="outros_custos">Outros Custos (R$)</Label>
                <Input
                  id="outros_custos"
                  name="outros_custos"
                  type="number"
                  value={apuracao.outros_custos}
                  onChange={handleInputChange}
                  disabled={apuracao.status !== "aberto"}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Observações</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id="observacoes"
            name="observacoes"
            rows={5}
            value={apuracao.observacoes || ""}
            onChange={handleInputChange}
            disabled={apuracao.status !== "aberto"}
            placeholder="Insira aqui observações relevantes sobre esta apuração..."
          />
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default ApuracaoCustoResultadoDetalhes;
