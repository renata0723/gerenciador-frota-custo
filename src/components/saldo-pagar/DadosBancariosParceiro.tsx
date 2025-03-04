
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, AlertCircle } from 'lucide-react';
import { ParceiroInfo } from '@/types/saldoPagar';

interface DadosBancariosParceirosProps {
  parceiro: ParceiroInfo;
}

const DadosBancariosParceiro: React.FC<DadosBancariosParceirosProps> = ({ parceiro }) => {
  // Verificar se os dados bancários existem e estão em formato string
  const temDadosBancarios = parceiro.dadosBancarios !== undefined && 
                            parceiro.dadosBancarios !== null && 
                            parceiro.dadosBancarios !== '';
  
  // Se for string, tentar fazer parse para objeto
  let dadosBancariosObj: any = null;
  if (temDadosBancarios && typeof parceiro.dadosBancarios === 'string') {
    try {
      dadosBancariosObj = JSON.parse(parceiro.dadosBancarios);
    } catch (e) {
      console.error('Erro ao fazer parse dos dados bancários:', e);
    }
  } else if (temDadosBancarios && typeof parceiro.dadosBancarios === 'object') {
    dadosBancariosObj = parceiro.dadosBancarios;
  }

  // Se não há dados bancários ou ocorreu erro no parse
  if (!temDadosBancarios || !dadosBancariosObj) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Dados Bancários</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Este parceiro não possui dados bancários cadastrados.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Dados Bancários</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 text-blue-500 mr-2" />
            <span className="font-medium">Banco:</span>
            <span className="ml-2">{dadosBancariosObj.banco}</span>
          </div>
          
          <div className="flex items-center">
            <span className="font-medium ml-7">Agência:</span>
            <span className="ml-2">{dadosBancariosObj.agencia}</span>
          </div>
          
          <div className="flex items-center">
            <span className="font-medium ml-7">Conta:</span>
            <span className="ml-2">{dadosBancariosObj.conta} ({dadosBancariosObj.tipo_conta})</span>
          </div>
          
          {dadosBancariosObj.pix && (
            <div className="flex items-center">
              <span className="font-medium ml-7">PIX:</span>
              <span className="ml-2">{dadosBancariosObj.pix}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DadosBancariosParceiro;
