
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { bancos } from '@/utils/constants';
import { DadosBancarios } from '@/types/saldoPagar';

interface DadosBancariosParceiroProps {
  dadosBancarios: DadosBancarios | string;
}

const DadosBancariosParceiro: React.FC<DadosBancariosParceiroProps> = ({ dadosBancarios }) => {
  // Se for uma string, tentar converter para objeto
  let dados: DadosBancarios = { banco: '', agencia: '', conta: '', tipo_conta: '', pix: '' };
  
  if (typeof dadosBancarios === 'string' && dadosBancarios !== '') {
    try {
      dados = JSON.parse(dadosBancarios);
    } catch (e) {
      console.error('Erro ao parsear dados bancários:', e);
    }
  } else if (typeof dadosBancarios === 'object') {
    dados = dadosBancarios;
  }

  // Buscar nome do banco baseado no código
  const nomeBanco = dados.banco 
    ? bancos.find(b => b.codigo === dados.banco)?.nome || dados.banco
    : 'Não informado';

  return (
    <Card className="mt-4">
      <CardContent className="pt-4">
        <h3 className="text-lg font-semibold mb-3">Dados Bancários</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Banco</p>
            <p>{nomeBanco}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Agência</p>
            <p>{dados.agencia || 'Não informado'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Conta</p>
            <p>{dados.conta || 'Não informado'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Tipo de Conta</p>
            <p>{dados.tipo_conta || 'Não informado'}</p>
          </div>
          
          <div className="col-span-2">
            <p className="text-sm font-medium text-gray-500">Chave PIX</p>
            <p>{dados.pix || 'Não informado'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DadosBancariosParceiro;
