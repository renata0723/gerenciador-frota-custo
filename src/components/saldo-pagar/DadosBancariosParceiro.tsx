
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ParceiroInfo } from '@/types/saldoPagar';
import { formatCPFCNPJ } from '@/utils/formatters';
import { CreditCard, Building, ArrowRight } from 'lucide-react';

interface DadosBancariosParceiroProps {
  parceiro: ParceiroInfo | null;
}

const DadosBancariosParceiro: React.FC<DadosBancariosParceiroProps> = ({ parceiro }) => {
  if (!parceiro) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Dados Bancários</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">Nenhum parceiro selecionado</p>
        </CardContent>
      </Card>
    );
  }
  
  // Verificar se tem dados bancários
  const temDadosBancarios = parceiro.dados_bancarios && 
    (parceiro.dados_bancarios.banco || parceiro.dados_bancarios.pix);
  
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base">Dados do Parceiro</CardTitle>
        <CreditCard className="h-5 w-5 text-blue-600" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Nome:</span>
            <span className="font-medium">{parceiro.nome}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Documento:</span>
            <span className="font-medium">{formatCPFCNPJ(parceiro.documento)}</span>
          </div>
        </div>
        
        {temDadosBancarios ? (
          <>
            <div className="h-px bg-gray-200 my-3" />
            <div className="space-y-2">
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium">Dados Bancários</span>
              </div>
              
              {parceiro.dados_bancarios?.banco && (
                <>
                  <div className="flex justify-between items-center ml-6">
                    <span className="text-sm text-gray-500">Banco:</span>
                    <span>{parceiro.dados_bancarios.banco}</span>
                  </div>
                  <div className="flex justify-between items-center ml-6">
                    <span className="text-sm text-gray-500">Agência:</span>
                    <span>{parceiro.dados_bancarios.agencia}</span>
                  </div>
                  <div className="flex justify-between items-center ml-6">
                    <span className="text-sm text-gray-500">Conta:</span>
                    <span>{parceiro.dados_bancarios.conta} ({parceiro.dados_bancarios.tipo_conta})</span>
                  </div>
                </>
              )}
              
              {parceiro.dados_bancarios?.pix && (
                <div className="flex justify-between items-center ml-6">
                  <span className="text-sm text-gray-500">Chave PIX:</span>
                  <span>{parceiro.dados_bancarios.pix}</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-yellow-600 mt-2 flex items-center">
            <ArrowRight className="h-4 w-4 mr-1" />
            Nenhum dado bancário cadastrado
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DadosBancariosParceiro;
