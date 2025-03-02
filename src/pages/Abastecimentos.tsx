
import React, { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Truck, Calendar, DollarSign, User, Plus } from "lucide-react";
import NovoAbastecimentoForm from "@/components/abastecimentos/NovoAbastecimentoForm";
import TipoCombustivelForm from "@/components/abastecimentos/TipoCombustivelForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Tipo de dados para abastecimento
interface Abastecimento {
  id: string;
  data: string;
  placa: string;
  motorista: string;
  tipoCombustivel: string;
  quantidade: number;
  valor: number;
  posto: string;
  responsavel: string;
  quilometragem: number;
}

// Tipo de dados para tipo de combustível
interface TipoCombustivel {
  id: string;
  nome: string;
  descricao: string;
}

const Abastecimentos: React.FC = () => {
  const [abastecimentos, setAbastecimentos] = useState<Abastecimento[]>([
    {
      id: "1",
      data: "2023-06-15",
      placa: "ABC1234",
      motorista: "João Silva",
      tipoCombustivel: "Diesel S10",
      quantidade: 200,
      valor: 1200.00,
      posto: "Auto Posto Central",
      responsavel: "Carlos Oliveira",
      quilometragem: 45000
    },
    {
      id: "2",
      data: "2023-06-18",
      placa: "DEF5678",
      motorista: "Pedro Santos",
      tipoCombustivel: "Arla 32",
      quantidade: 20,
      valor: 160.00,
      posto: "Posto Rodovia",
      responsavel: "Maria Souza",
      quilometragem: 32000
    }
  ]);

  const [tiposCombustivel, setTiposCombustivel] = useState<TipoCombustivel[]>([
    { id: "1", nome: "Diesel S10", descricao: "Diesel com baixo teor de enxofre" },
    { id: "2", nome: "Arla 32", descricao: "Agente Redutor Líquido Automotivo" },
    { id: "3", nome: "Diesel Comum", descricao: "Diesel convencional" }
  ]);

  const addAbastecimento = (abastecimento: Omit<Abastecimento, "id">) => {
    const newAbastecimento = {
      ...abastecimento,
      id: Date.now().toString()
    };
    setAbastecimentos([...abastecimentos, newAbastecimento]);
  };

  const addTipoCombustivel = (tipo: Omit<TipoCombustivel, "id">) => {
    const newTipo = {
      ...tipo,
      id: Date.now().toString()
    };
    setTiposCombustivel([...tiposCombustivel, newTipo]);
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-6">
        <PageHeader 
          title="Módulo de Abastecimentos" 
          description="Gerencie todos os abastecimentos da frota" 
        />

        <div className="flex justify-end gap-4 mb-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Tipo de Combustível
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <TipoCombustivelForm onSave={addTipoCombustivel} />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Abastecimento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <NovoAbastecimentoForm onSave={addAbastecimento} tiposCombustivel={tiposCombustivel} />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="abastecimentos" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="abastecimentos">Abastecimentos</TabsTrigger>
            <TabsTrigger value="tipos-combustivel">Tipos de Combustível</TabsTrigger>
          </TabsList>
          
          <TabsContent value="abastecimentos">
            <Card>
              <CardHeader>
                <CardTitle>Registro de Abastecimentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead><Calendar className="h-4 w-4 mr-2" />Data</TableHead>
                        <TableHead><Truck className="h-4 w-4 mr-2" />Placa</TableHead>
                        <TableHead><User className="h-4 w-4 mr-2" />Motorista</TableHead>
                        <TableHead>Combustível</TableHead>
                        <TableHead>Quilometragem</TableHead>
                        <TableHead><DollarSign className="h-4 w-4 mr-2" />Valor (R$)</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {abastecimentos.map((abastecimento) => (
                        <TableRow key={abastecimento.id}>
                          <TableCell>{new Date(abastecimento.data).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>{abastecimento.placa}</TableCell>
                          <TableCell>{abastecimento.motorista}</TableCell>
                          <TableCell>{abastecimento.tipoCombustivel}</TableCell>
                          <TableCell>{abastecimento.quilometragem.toLocaleString('pt-BR')}</TableCell>
                          <TableCell>{abastecimento.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
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
          </TabsContent>
          
          <TabsContent value="tipos-combustivel">
            <Card>
              <CardHeader>
                <CardTitle>Tipos de Combustível</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tiposCombustivel.map((tipo) => (
                        <TableRow key={tipo.id}>
                          <TableCell>{tipo.nome}</TableCell>
                          <TableCell>{tipo.descricao}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">Editar</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Abastecimentos;
