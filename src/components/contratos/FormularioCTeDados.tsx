
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface FormularioCTeDadosProps {
  onSave: (dados: CTeDados) => void;
  numeroCtePrevio?: string;
}

export interface CTeDados {
  numeroCTe: string;
  valorCarga: number;
  valorFrete: number;
}

export function FormularioCTeDados({ onSave, numeroCtePrevio }: FormularioCTeDadosProps) {
  const [numeroCTe, setNumeroCTe] = useState(numeroCtePrevio || "");
  const [valorCarga, setValorCarga] = useState<string>("");
  const [valorFrete, setValorFrete] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!numeroCTe || !valorCarga || !valorFrete) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const dadosCTe: CTeDados = {
      numeroCTe,
      valorCarga: parseFloat(valorCarga),
      valorFrete: parseFloat(valorFrete)
    };

    onSave(dadosCTe);
    
    // Resetar campos
    if (!numeroCtePrevio) {
      setNumeroCTe("");
    }
    setValorCarga("");
    setValorFrete("");
  };

  // Função para formatar valores monetários
  const formatarValor = (valor: string): string => {
    // Remove caracteres não numéricos
    let apenasNumeros = valor.replace(/[^\d.,]/g, "");
    
    // Converte para número e formata
    try {
      const num = parseFloat(apenasNumeros.replace(",", "."));
      return isNaN(num) ? "" : num.toString();
    } catch {
      return apenasNumeros;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-md">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="numeroCTe">Número do CTe</Label>
          <Input
            id="numeroCTe"
            value={numeroCTe}
            onChange={(e) => setNumeroCTe(e.target.value)}
            placeholder="CT-00000"
            required
            readOnly={!!numeroCtePrevio}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="valorCarga">Valor da Carga (R$)</Label>
            <Input
              id="valorCarga"
              value={valorCarga}
              onChange={(e) => setValorCarga(formatarValor(e.target.value))}
              placeholder="0,00"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="valorFrete">Valor do Frete (R$)</Label>
            <Input
              id="valorFrete"
              value={valorFrete}
              onChange={(e) => setValorFrete(formatarValor(e.target.value))}
              placeholder="0,00"
              required
            />
          </div>
        </div>
      </div>
      <Button type="submit" className="w-full">
        Salvar Dados do CTe
      </Button>
    </form>
  );
}
