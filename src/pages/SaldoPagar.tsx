
import React, { useState, useEffect } from 'react';
import PageHeader from "@/components/ui/PageHeader";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, FileCheck } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from '@/utils/formatters';

import { SaldoPagarItem } from '@/types/contabilidade';

const SaldoPagar = () => {
  const [saldos, setSaldos] = useState<SaldoPagarItem[]>([]);
  const [novoSaldo, setNovoSaldo] = useState<SaldoPagarItem>({
    parceiro: '',
    valor_total: 0,
    vencimento: '',
  });
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editandoSaldo, setEditandoSaldo] = useState<SaldoPagarItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Aqui você buscaria os dados do backend
    // Substitua este exemplo com sua lógica real
    const dataMock: SaldoPagarItem[] = [
      { id: 1, parceiro: 'Fornecedor A', valor_total: 1500, valor_pago: 500, saldo_restante: 1000, vencimento: '2024-05-10', status: 'pendente' },
      { id: 2, parceiro: 'Fornecedor B', valor_total: 2500, valor_pago: 2500, saldo_restante: 0, vencimento: '2024-05-15', status: 'concluido' },
      { id: 3, parceiro: 'Fornecedor C', valor_total: 800, valor_pago: 0, saldo_restante: 800, vencimento: '2024-05-20', status: 'pendente' },
    ];
    setSaldos(dataMock);
  }, []);

  const statusColor = (status?: string) => {
    if (!status) return "text-gray-500";
    switch (status) {
      case 'pendente':
        return "text-yellow-500";
      case 'concluido':
        return "text-green-500";
      case 'cancelado':
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const renderStatusBadge = (status?: string) => {
    if (!status) return "Pendente";
    
    switch (status) {
      case 'pendente':
        return "Pendente";
      case 'concluido':
        return "Pago";
      case 'cancelado':
        return "Cancelado";
      default:
        return "Pendente";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNovoSaldo(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = () => {
    // Aqui você enviaria os dados para o backend
    // Substitua este exemplo com sua lógica real
    const novoId = saldos.length > 0 ? Math.max(...saldos.map(s => s.id || 0)) + 1 : 1;
    const novoItem: SaldoPagarItem = { ...novoSaldo, id: novoId, status: 'pendente' };
    setSaldos(prev => [...prev, novoItem]);
    setNovoSaldo({ parceiro: '', valor_total: 0, vencimento: '' });
  };

  const handleEdit = (id: number) => {
    const saldo = saldos.find(s => s.id === id);
    if (saldo) {
      setEditandoId(id);
      setEditandoSaldo({ ...saldo });
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditandoSaldo(prev => prev ? ({ ...prev, [name]: value }) : null);
  };

  const handleUpdate = () => {
    if (editandoSaldo) {
      // Aqui você enviaria os dados atualizados para o backend
      // Substitua este exemplo com sua lógica real
      setSaldos(prev =>
        prev.map(s => (s.id === editandoId ? { ...editandoSaldo } : s))
      );
      setEditandoId(null);
      setEditandoSaldo(null);
    }
  };

  const handleCancelEdit = () => {
    setEditandoId(null);
    setEditandoSaldo(null);
  };

  const handleDelete = (id: number) => {
    // Aqui você enviaria a solicitação de exclusão para o backend
    // Substitua este exemplo com sua lógica real
    setSaldos(prev => prev.filter(s => s.id !== id));
  };

  return (
    <PageLayout>
      <PageHeader title="Saldo a Pagar" description="Gerencie os saldos a pagar aos seus fornecedores" />

      <Card className="p-6 mt-4">
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">Adicionar Novo Saldo</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="parceiro">Parceiro</Label>
              <Input
                type="text"
                id="parceiro"
                name="parceiro"
                value={novoSaldo.parceiro}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="valor_total">Valor Total</Label>
              <Input
                type="number"
                id="valor_total"
                name="valor_total"
                value={novoSaldo.valor_total}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="vencimento">Vencimento</Label>
              <Input
                type="date"
                id="vencimento"
                name="vencimento"
                value={novoSaldo.vencimento}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <Button className="mt-4" onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar
          </Button>
        </CardContent>
      </Card>

      <Card className="p-6 mt-4">
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">Lista de Saldos a Pagar</h3>
          {loading ? (
            <p>Carregando...</p>
          ) : saldos.length === 0 ? (
            <div className="text-center py-8">
              <FileCheck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Nenhum saldo a pagar registrado</h3>
              <p className="mt-1 text-gray-500">Adicione um novo saldo para começar.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parceiro</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Valor Pago</TableHead>
                    <TableHead>Saldo Restante</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {saldos.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.parceiro}</TableCell>
                      <TableCell>{formatCurrency(item.valor_total)}</TableCell>
                      <TableCell>{formatCurrency(item.valor_pago || 0)}</TableCell>
                      <TableCell>{formatCurrency(item.saldo_restante || 0)}</TableCell>
                      <TableCell>{item.vencimento}</TableCell>
                      <TableCell className={statusColor(item.status)}>{renderStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-right">
                        {editandoId === item.id ? (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" onClick={handleUpdate}>Salvar</Button>
                            <Button size="sm" variant="ghost" onClick={handleCancelEdit}>Cancelar</Button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(item.id || 0)}>
                              Editar
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id || 0)}>
                              Excluir
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {editandoId && editandoSaldo && (
        <Card className="p-6 mt-4">
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">Editar Saldo a Pagar</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="parceiro">Parceiro</Label>
                <Input
                  type="text"
                  id="parceiro"
                  name="parceiro"
                  value={editandoSaldo.parceiro}
                  onChange={handleEditInputChange}
                />
              </div>
              <div>
                <Label htmlFor="valor_total">Valor Total</Label>
                <Input
                  type="number"
                  id="valor_total"
                  name="valor_total"
                  value={editandoSaldo.valor_total}
                  onChange={handleEditInputChange}
                />
              </div>
              <div>
                <Label htmlFor="vencimento">Vencimento</Label>
                <Input
                  type="date"
                  id="vencimento"
                  name="vencimento"
                  value={editandoSaldo.vencimento}
                  onChange={handleEditInputChange}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button onClick={handleUpdate}>Salvar</Button>
              <Button variant="ghost" onClick={handleCancelEdit}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </PageLayout>
  );
};

export default SaldoPagar;
