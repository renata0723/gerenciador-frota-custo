
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormularioCTeDados } from "./FormularioCTeDados";
import { FormularioFreteContratado } from "./FormularioFreteContratado";
import { FormularioRejeicaoContrato } from "./FormularioRejeicaoContrato";

interface ContratoFormTabsProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

export const ContratoFormTabs: React.FC<ContratoFormTabsProps> = ({
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<any>({
    dadosContrato: {},
    freteContratado: {},
    documentos: {},
    observacoes: {},
  });
  const [activeTab, setActiveTab] = useState("dados");
  const [showRejeicaoForm, setShowRejeicaoForm] = useState(false);

  const handleDadosContratoSubmit = (data: any) => {
    setFormData((prev: any) => ({
      ...prev,
      dadosContrato: data,
    }));
    setActiveTab("frete");
  };

  const handleFreteContratadoSubmit = (data: any) => {
    setFormData((prev: any) => ({
      ...prev,
      freteContratado: data,
    }));
    setActiveTab("documentos");
  };

  const handleDocumentosSubmit = (data: any) => {
    setFormData((prev: any) => ({
      ...prev,
      documentos: data,
    }));
    setActiveTab("observacoes");
  };

  const handleObservacoesSubmit = (data: any) => {
    const finalData = {
      ...formData,
      observacoes: data,
    };
    onSave(finalData);
  };

  const handleRejeicao = (motivo: string) => {
    // Lógica para rejeição do contrato
    console.log("Contrato rejeitado:", motivo);
    setShowRejeicaoForm(false);
    onCancel();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Adicionar Novo Contrato</h1>
        <p className="text-gray-500">
          Preencha os dados do contrato. Clique em salvar quando finalizar.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dados">Dados do Contrato</TabsTrigger>
          <TabsTrigger value="frete">Frete Contratado</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="observacoes">Observações</TabsTrigger>
        </TabsList>

        <TabsContent value="dados" className="space-y-4 mt-4">
          <Card className="p-6">
            <form onSubmit={(e) => {
              e.preventDefault();
              const formElements = e.target as HTMLFormElement;
              const formData = new FormData(formElements);
              const data = Object.fromEntries(formData.entries());
              handleDadosContratoSubmit(data);
            }}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" htmlFor="tipo">
                      Tipo
                    </label>
                    <select
                      id="tipo"
                      name="tipo"
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="frota">Frota</option>
                      <option value="terceiro">Terceiro</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" htmlFor="dataSaida">
                      Data Saída
                    </label>
                    <input
                      id="dataSaida"
                      name="dataSaida"
                      type="date"
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" htmlFor="cidadeOrigem">
                      Cidade Origem
                    </label>
                    <input
                      id="cidadeOrigem"
                      name="cidadeOrigem"
                      placeholder="Cidade"
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" htmlFor="estadoOrigem">
                      Estado Origem
                    </label>
                    <input
                      id="estadoOrigem"
                      name="estadoOrigem"
                      placeholder="UF"
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" htmlFor="cidadeDestino">
                      Cidade Destino
                    </label>
                    <input
                      id="cidadeDestino"
                      name="cidadeDestino"
                      placeholder="Cidade"
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" htmlFor="estadoDestino">
                      Estado Destino
                    </label>
                    <input
                      id="estadoDestino"
                      name="estadoDestino"
                      placeholder="UF"
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium" htmlFor="cliente">
                    Cliente
                  </label>
                  <input
                    id="cliente"
                    name="cliente"
                    placeholder="Nome do cliente"
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" htmlFor="placaCavalo">
                      Placa do Cavalo
                    </label>
                    <input
                      id="placaCavalo"
                      name="placaCavalo"
                      placeholder="ABC1234"
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" htmlFor="placaCarreta">
                      Placa da Carreta
                    </label>
                    <input
                      id="placaCarreta"
                      name="placaCarreta"
                      placeholder="XYZ5678"
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" htmlFor="motorista">
                      Motorista
                    </label>
                    <input
                      id="motorista"
                      name="motorista"
                      placeholder="Nome do motorista"
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" htmlFor="proprietario">
                      Proprietário
                    </label>
                    <input
                      id="proprietario"
                      name="proprietario"
                      placeholder="Nome do proprietário"
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" type="button" onClick={onCancel}>
                    Cancelar
                  </Button>
                  <Button type="submit">Continuar</Button>
                </div>
              </div>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="frete" className="space-y-4 mt-4">
          <FormularioFreteContratado 
            onSubmit={handleFreteContratadoSubmit} 
            onBack={() => setActiveTab("dados")} 
          />
        </TabsContent>

        <TabsContent value="documentos" className="space-y-4 mt-4">
          <FormularioCTeDados 
            onSubmit={handleDocumentosSubmit} 
            onBack={() => setActiveTab("frete")} 
          />
        </TabsContent>

        <TabsContent value="observacoes" className="space-y-4 mt-4">
          <Card className="p-6">
            <form onSubmit={(e) => {
              e.preventDefault();
              const formElements = e.target as HTMLFormElement;
              const formData = new FormData(formElements);
              const data = Object.fromEntries(formData.entries());
              handleObservacoesSubmit(data);
            }}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium" htmlFor="responsavel">
                    Responsável pela entrega à controladoria
                  </label>
                  <input
                    id="responsavel"
                    name="responsavel"
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium" htmlFor="dataEntrega">
                    Data de entrega
                  </label>
                  <input
                    id="dataEntrega"
                    name="dataEntrega"
                    type="date"
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium" htmlFor="observacoes">
                    Observações
                  </label>
                  <textarea
                    id="observacoes"
                    name="observacoes"
                    rows={4}
                    className="w-full px-3 py-2 border rounded-md"
                  ></textarea>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" type="button" onClick={() => setActiveTab("documentos")}>
                    Voltar
                  </Button>
                  <Button type="submit">Salvar Contrato</Button>
                </div>
              </div>
            </form>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center mt-4">
        <Button 
          variant="destructive" 
          onClick={() => setShowRejeicaoForm(true)}
        >
          Rejeitar Contrato
        </Button>
      </div>

      {showRejeicaoForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Rejeitar Contrato</h2>
            <FormularioRejeicaoContrato 
              onSubmit={handleRejeicao} 
              onCancel={() => setShowRejeicaoForm(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};
