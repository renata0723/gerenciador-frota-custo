import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsDown } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import FormularioCTeDados from "./FormularioCTeDados";
import FormularioFreteContratado from "./FormularioFreteContratado";
import FormularioRejeicaoContrato from "./FormularioRejeicaoContrato";

const ContratoFormTabs = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-end space-x-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="rejected">
              <ThumbsDown className="h-5 w-5" />
              Rejeitar Contrato
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <FormularioRejeicaoContrato />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="dados" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dados">Dados do Contrato</TabsTrigger>
              <TabsTrigger value="frete">Frete Contratado</TabsTrigger>
              <TabsTrigger value="cte">CTe/Manifesto</TabsTrigger>
              <TabsTrigger value="observacoes">Observações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dados">
              {/* Conteúdo existente para Dados do Contrato */}
              <div className="pt-4 space-y-4">
                {/* Form fields for contract data would be here */}
              </div>
            </TabsContent>
            
            <TabsContent value="frete">
              <FormularioFreteContratado />
            </TabsContent>
            
            <TabsContent value="cte">
              <FormularioCTeDados />
            </TabsContent>
            
            <TabsContent value="observacoes">
              {/* Conteúdo existente para Observações */}
              <div className="pt-4 space-y-4">
                {/* Observations form fields would be here */}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContratoFormTabs;
