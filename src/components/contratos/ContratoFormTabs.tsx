
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import FormularioCTeDados from "./FormularioCTeDados";
import FormularioFreteContratado from "./FormularioFreteContratado";
import { toast } from "sonner";

// Definição dos tipos para CTe e Frete Contratado
interface CTeDados {
  numeroCTe: string;
  valorCarga: number;
  valorFrete: number;
}

interface FreteContratadoData {
  valorFreteContratado: number;
  valorAdiantamento: number;
  dataAdiantamento: Date | undefined;
  valorPedagio: number;
  saldoAPagar: number;
  aguardandoCanhoto: boolean;
}

interface ContratoFormTabsProps {
  onSave: (dadosCompletos: any) => void;
  initialData?: any;
}

export function ContratoFormTabs({ onSave, initialData }: ContratoFormTabsProps) {
  const [activeTab, setActiveTab] = useState("documentos");
  const [dadosDocumentos, setDadosDocumentos] = useState<any>(initialData?.documentos || {});
  const [dadosFreteContrato, setDadosFreteContrato] = useState<FreteContratadoData>(initialData?.freteContrato || {
    valorFreteContratado: 0,
    valorAdiantamento: 0,
    dataAdiantamento: undefined,
    valorPedagio: 0,
    saldoAPagar: 0,
    aguardandoCanhoto: true
  });
  const [observacoes, setObservacoes] = useState(initialData?.observacoes || "");
  const [tipoVeiculo, setTipoVeiculo] = useState(initialData?.tipoVeiculo || "terceiro");

  // Dados dos CTes com valores vinculados
  const [cteDataList, setCteDataList] = useState<CTeDados[]>(initialData?.cteDataList || []);
  
  // Handling CTe data
  const handleAddCTe = (cteData: CTeDados) => {
    const exists = cteDataList.some(cte => cte.numeroCTe === cteData.numeroCTe);
    
    if (exists) {
      // Atualizar CTe existente
      setCteDataList(prevList => 
        prevList.map(cte => 
          cte.numeroCTe === cteData.numeroCTe ? cteData : cte
        )
      );
      toast.success("Dados do CTe atualizados com sucesso!");
    } else {
      // Adicionar novo CTe
      setCteDataList(prevList => [...prevList, cteData]);
      setDadosDocumentos({
        ...dadosDocumentos,
        numeroCTe: [...(dadosDocumentos.numeroCTe || []), cteData.numeroCTe]
      });
      toast.success("CTe adicionado com sucesso!");
    }
  };

  // Remover CTe
  const handleRemoveCTe = (numeroCTe: string) => {
    setCteDataList(prevList => prevList.filter(cte => cte.numeroCTe !== numeroCTe));
    setDadosDocumentos({
      ...dadosDocumentos,
      numeroCTe: (dadosDocumentos.numeroCTe || []).filter((num: string) => num !== numeroCTe)
    });
    toast.success("CTe removido com sucesso!");
  };

  // Salvar dados do frete contratado
  const handleSaveFreteContratado = (dados: FreteContratadoData) => {
    setDadosFreteContrato(dados);
    
    // Se houver saldo a pagar, programar para o módulo de saldo a pagar
    if (dados.saldoAPagar > 0) {
      // Aqui seria a lógica para registrar no módulo de saldo a pagar
      console.log("Saldo a pagar pendente registrado:", dados.saldoAPagar);
      console.log("Data de adiantamento:", dados.dataAdiantamento);
      
      if (dados.aguardandoCanhoto) {
        console.log("Status: Aguardando Canhoto");
      }
    }
  };

  // Salvar todo o contrato
  const handleSaveAll = () => {
    const dadosCompletos = {
      ...initialData,
      documentos: dadosDocumentos,
      freteContrato: dadosFreteContrato,
      observacoes,
      tipoVeiculo,
      cteDataList,
      status: "pendente"
    };
    
    onSave(dadosCompletos);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="documentos">Documentos</TabsTrigger>
        <TabsTrigger value="freteContrato">Frete Contratado</TabsTrigger>
        <TabsTrigger value="observacoes">Observações</TabsTrigger>
      </TabsList>

      <TabsContent value="documentos" className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">CTes e Valores Vinculados</h3>
        
        {/* Listagem dos CTes cadastrados */}
        {cteDataList.length > 0 && (
          <div className="mb-6 space-y-4">
            <h4 className="font-medium">CTes Cadastrados</h4>
            <div className="divide-y">
              {cteDataList.map((cte) => (
                <div key={cte.numeroCTe} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{cte.numeroCTe}</p>
                    <p className="text-sm text-gray-500">
                      Valor da Carga: R$ {cte.valorCarga.toFixed(2).replace('.', ',')} | 
                      Valor do Frete: R$ {cte.valorFrete.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemoveCTe(cte.numeroCTe)}
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Formulário para adicionar novo CTe */}
        <FormularioCTeDados onSave={handleAddCTe} />
      </TabsContent>

      <TabsContent value="freteContrato" className="space-y-4">
        <FormularioFreteContratado 
          onSave={handleSaveFreteContratado} 
          tipoVeiculo={tipoVeiculo}
          onTipoVeiculoChange={setTipoVeiculo}
          valorTotalCTes={cteDataList.reduce((sum, cte) => sum + cte.valorFrete, 0)}
          initialData={dadosFreteContrato}
        />
      </TabsContent>

      <TabsContent value="observacoes" className="space-y-4">
        <div className="grid gap-2">
          <label htmlFor="observacoes" className="text-sm font-medium">
            Observações
          </label>
          <textarea
            id="observacoes"
            rows={4}
            className="w-full p-2 border rounded-md"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Adicione observações relevantes sobre o contrato..."
          />
        </div>
      </TabsContent>

      <div className="mt-6 flex justify-end space-x-4">
        <Button variant="outline" onClick={() => setActiveTab("documentos")}>
          Cancelar
        </Button>
        <Button onClick={handleSaveAll}>
          Salvar Contrato
        </Button>
      </div>
    </Tabs>
  );
}
