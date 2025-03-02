
import React, { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Truck, Calendar, DollarSign, Plus, FileText, Wrench } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import NovaManutencaoForm from "@/components/manutencao/NovaManutencaoForm";

// Tipo de dados para manutenção
interface Manutencao {
  id: string;
  data: string;
  placa: string;
  tipo: "preventiva" | "corretiva";
  local: "pátio" | "externa";
  descricao: string;
  valor: number;
  pecas: string[];
  servicos: string[];
}

const Manutencao: React.FC = () => {
  const [manutencoes, setManutencoes] = useState<Manutencao[]>([
    {
      id: "1",
      data: "2023-06-10",
      placa: "ABC1234",
      tipo: "preventiva",
      local: "pátio",
      descricao: "Troca de óleo e filtros",
      valor: 850.00,
      pecas: ["Óleo 15W40", "Filtro de óleo", "Filtro de ar"],
      servicos: ["Troca de óleo", "Troca de filtros"]
    },
    {
      id: "2",
      data: "2023-06-20",
      placa: "DEF5678",
      tipo: "corretiva",
      local: "externa",
      descricao: "Reparo no sistema de freios",
      valor: 2300.00,
      pecas: ["Pastilhas de freio", "Disco de freio", "Fluido de freio"],
      servicos: ["Substituição de pastilhas", "Troca de disco", "Sangria do sistema"]
    }
  ]);

  const addManutencao = (manutencao: Omit<Manutencao, "id">) => {
    const newManutencao = {
      ...manutencao,
      id: Date.now().toString()
    };
    setManutencoes([...manutencoes, newManutencao]);
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-6">
        <PageHeader 
          title="Módulo de Manutenção" 
          description="Gerencie todas as manutenções da frota" 
        />

        <div className="flex justify-end mb-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Manutenção
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <NovaManutencaoForm onSave={addManutencao} />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registro de Manutenções</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><Calendar className="h-4 w-4 mr-2" />Data</TableHead>
                    <TableHead><Truck className="h-4 w-4 mr-2" />Placa</TableHead>
                    <TableHead><Wrench className="h-4 w-4 mr-2" />Tipo</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead><FileText className="h-4 w-4 mr-2" />Descrição</TableHead>
                    <TableHead><DollarSign className="h-4 w-4 mr-2" />Valor (R$)</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {manutencoes.map((manutencao) => (
                    <TableRow key={manutencao.id}>
                      <TableCell>{new Date(manutencao.data).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{manutencao.placa}</TableCell>
                      <TableCell>
                        <Badge variant={manutencao.tipo === "preventiva" ? "outline" : "destructive"}>
                          {manutencao.tipo === "preventiva" ? "Preventiva" : "Corretiva"}
                        </Badge>
                      </TableCell>
                      <TableCell>{manutencao.local === "pátio" ? "Pátio" : "Externa"}</TableCell>
                      <TableCell className="max-w-xs truncate">{manutencao.descricao}</TableCell>
                      <TableCell>{manutencao.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
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

export default Manutencao;
