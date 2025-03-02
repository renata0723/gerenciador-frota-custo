
import React, { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, DollarSign, Plus, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import NovaDespesaForm from "@/components/despesas/NovaDespesaForm";

// Tipo de dados para despesa
interface Despesa {
  id: string;
  data: string;
  tipo: "descarga" | "reentrega" | "no-show" | "outros";
  descricao: string;
  valor: number;
}

const DespesasGerais: React.FC = () => {
  const [despesas, setDespesas] = useState<Despesa[]>([
    {
      id: "1",
      data: "2023-06-10",
      tipo: "descarga",
      descricao: "Taxa de descarga no cliente ABC",
      valor: 350.00
    },
    {
      id: "2",
      data: "2023-06-15",
      tipo: "reentrega",
      descricao: "Reentrega por endereço incorreto",
      valor: 500.00
    },
    {
      id: "3",
      data: "2023-06-20",
      tipo: "no-show",
      descricao: "Cliente não recebeu a carga na data agendada",
      valor: 750.00
    }
  ]);

  // Função para adicionar uma nova despesa
  const addDespesa = (despesa: Omit<Despesa, "id">) => {
    const newDespesa = {
      ...despesa,
      id: Date.now().toString()
    };
    setDespesas([...despesas, newDespesa]);
  };

  // Cálculo da média das despesas
  const mediaDespesas = despesas.length > 0
    ? despesas.reduce((acc, despesa) => acc + despesa.valor, 0) / despesas.length
    : 0;

  return (
    <PageLayout>
      <div className="container mx-auto py-6">
        <PageHeader 
          title="Módulo de Despesas Gerais" 
          description="Gerencie todas as despesas de viagem e operacionais" 
        />

        <div className="flex justify-end mb-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Despesa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <NovaDespesaForm onSave={addDespesa} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {despesas.reduce((acc, despesa) => acc + despesa.valor, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Média por Despesa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mediaDespesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Registros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{despesas.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registro de Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><Calendar className="h-4 w-4 mr-2" />Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead><FileText className="h-4 w-4 mr-2" />Descrição</TableHead>
                    <TableHead><DollarSign className="h-4 w-4 mr-2" />Valor (R$)</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {despesas.map((despesa) => (
                    <TableRow key={despesa.id}>
                      <TableCell>{new Date(despesa.data).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {despesa.tipo === "descarga" ? "Descarga" : 
                           despesa.tipo === "reentrega" ? "Reentrega" : 
                           despesa.tipo === "no-show" ? "No-Show" : "Outros"}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{despesa.descricao}</TableCell>
                      <TableCell>{despesa.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Detalhes</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default DespesasGerais;
