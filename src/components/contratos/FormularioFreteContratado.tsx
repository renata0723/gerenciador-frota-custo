
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface FormularioFreteContratadoProps {
  onSave: (dados: FreteContratadoData) => void;
  tipoVeiculo: string;
  onTipoVeiculoChange: (tipo: string) => void;
}

export interface FreteContratadoData {
  tipoVeiculo: string;
  valorFreteContratado: number;
  valorAdiantamento: number;
  valorPedagio: number;
  saldoAPagar: number;
}

export function FormularioFreteContratado({ 
  onSave, 
  tipoVeiculo,
  onTipoVeiculoChange 
}: FormularioFreteContratadoProps) {
  const [valorFreteContratado, setValorFreteContratado] = useState<string>("");
  const [valorAdiantamento, setValorAdiantamento] = useState<string>("");
  const [valorPedagio, setValorPedagio] = useState<string>("");
  const [saldoAPagar, setSaldoAPagar] = useState<string>("");

  // Calcular saldo a pagar automaticamente
  useEffect(() => {
    const freteContratado = parseFloat(valorFreteContratado.replace(',', '.')) || 0;
    const adiantamento = parseFloat(valorAdiantamento.replace(',', '.')) || 0;
    const pedagio = parseFloat(valorPedagio.replace(',', '.')) || 0;
    
    const saldo = freteContratado - adiantamento - pedagio;
    setSaldoAPagar(saldo.toFixed(2).replace('.', ','));
  }, [valorFreteContratado, valorAdiantamento, valorPedagio]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tipoVeiculo || !valorFreteContratado) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const dadosFrete: FreteContratadoData = {
      tipoVeiculo,
      valorFreteContratado: parseFloat(valorFreteContratado.replace(',', '.')),
      valorAdiantamento: parseFloat(valorAdiantamento.replace(',', '.')) || 0,
      valorPedagio: parseFloat(valorPedagio.replace(',', '.')) || 0,
      saldoAPagar: parseFloat(saldoAPagar.replace(',', '.')) || 0
    };

    onSave(dadosFrete);
    toast.success("Dados do frete contratado salvos com sucesso!");
  };

  // Função para formatar valores monetários
  const formatarValorMonetario = (valor: string): string => {
    // Remove caracteres não numéricos
    let apenasNumeros = valor.replace(/[^\d.,]/g, "");
    
    // Substitui ponto por vírgula
    apenasNumeros = apenasNumeros.replace(".", ",");
    
    // Se houver mais de uma vírgula, mantém apenas a primeira
    const partes = apenasNumeros.split(",");
    if (partes.length > 2) {
      apenasNumeros = partes[0] + "," + partes[1];
    }
    
    return apenasNumeros;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="tipoVeiculo">Tipo de Veículo</Label>
          <Select
            value={tipoVeiculo}
            onValueChange={onTipoVeiculoChange}
          >
            <SelectTrigger id="tipoVeiculo">
              <SelectValue placeholder="Selecione o tipo de veículo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="frota">Frota Própria</SelectItem>
              <SelectItem value="terceiro">Terceirizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="valorFreteContratado">Valor do Frete Contratado (R$)</Label>
          <Input
            id="valorFreteContratado"
            value={valorFreteContratado}
            onChange={(e) => setValorFreteContratado(formatarValorMonetario(e.target.value))}
            placeholder="0,00"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="valorAdiantamento">Valor do Adiantamento (R$)</Label>
            <Input
              id="valorAdiantamento"
              value={valorAdiantamento}
              onChange={(e) => setValorAdiantamento(formatarValorMonetario(e.target.value))}
              placeholder="0,00"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="valorPedagio">Valor do Pedágio (R$)</Label>
            <Input
              id="valorPedagio"
              value={valorPedagio}
              onChange={(e) => setValorPedagio(formatarValorMonetario(e.target.value))}
              placeholder="0,00"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="saldoAPagar">Saldo a Pagar (R$)</Label>
          <Input
            id="saldoAPagar"
            value={saldoAPagar}
            readOnly
            className="bg-gray-100"
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Salvar Dados do Frete
      </Button>
    </form>
  );
}
