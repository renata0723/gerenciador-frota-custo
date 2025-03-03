
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import ContratoFormCompleto from '@/components/contratos/ContratoFormCompleto';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileDown, PrinterIcon } from 'lucide-react';
import { toast } from 'sonner';
import { logOperation } from '@/utils/logOperations';
import { Badge } from '@/components/ui/badge';

const NovoContratoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [contratoFinalizado, setContratoFinalizado] = useState(false);
  const [contratoData, setContratoData] = useState<any>(null);
  const [dialogRecibo, setDialogRecibo] = useState(false);
  const [logoEmpresa, setLogoEmpresa] = useState<string | null>(null);
  const [dadosEmpresa, setDadosEmpresa] = useState<any>({
    nome: 'ControlFrota',
    cnpj: '',
    endereco: ''
  });

  // Carregar logo e dados da empresa (simulado)
  useEffect(() => {
    // Em um caso real, buscaríamos do banco de dados
    const empresaStorage = localStorage.getItem('dadosEmpresa');
    if (empresaStorage) {
      try {
        setDadosEmpresa(JSON.parse(empresaStorage));
      } catch (e) {
        console.error('Erro ao carregar dados da empresa:', e);
      }
    }
    
    const logoStorage = localStorage.getItem('logoEmpresa');
    if (logoStorage) {
      setLogoEmpresa(logoStorage);
    }
  }, []);

  const handleBack = () => {
    navigate('/contratos');
  };

  const handleContratoSalvo = (data: any) => {
    setContratoFinalizado(true);
    setContratoData(data);
    toast.success('Contrato salvo com sucesso!');
    setDialogRecibo(true);
    
    // Registrar operação no log
    logOperation('Contratos', 'Contrato finalizado', `ID: ${data.idContrato}, Cliente: ${data.clienteDestino}`);
  };

  const imprimirRecibo = () => {
    const conteudoRecibo = document.getElementById('recibo-contrato');
    if (!conteudoRecibo) return;
    
    const janelaImpressao = window.open('', '_blank');
    if (!janelaImpressao) {
      toast.error('Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desativado.');
      return;
    }
    
    janelaImpressao.document.write(`
      <html>
        <head>
          <title>Recibo de Contrato - Controladoria</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .cabecalho { border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
            .logo { max-height: 80px; max-width: 200px; }
            .empresa-info { text-align: right; }
            .empresa-nome { font-size: 24px; font-weight: bold; }
            .empresa-cnpj, .empresa-endereco { font-size: 14px; color: #666; }
            .titulo { text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0; }
            .info-contrato { margin-bottom: 30px; }
            .info-item { margin-bottom: 10px; }
            .label { font-weight: bold; }
            .assinaturas { margin-top: 50px; display: flex; justify-content: space-between; }
            .assinatura { border-top: 1px solid #000; padding-top: 5px; width: 200px; text-align: center; }
            .data-hora { text-align: right; margin-top: 50px; font-size: 12px; }
            .numero-contrato { font-size: 16px; font-weight: bold; margin-bottom: 20px; }
            .info-section { margin-top: 20px; }
            .info-section-title { font-weight: bold; font-size: 16px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="cabecalho">
            <div>
              ${logoEmpresa ? `<img src="${logoEmpresa}" class="logo" alt="Logo da Empresa" />` : '<div class="empresa-nome">Controladoria</div>'}
            </div>
            <div class="empresa-info">
              <div class="empresa-nome">${dadosEmpresa.nome || 'Controladoria'}</div>
              ${dadosEmpresa.cnpj ? `<div class="empresa-cnpj">CNPJ: ${dadosEmpresa.cnpj}</div>` : ''}
              ${dadosEmpresa.endereco ? `<div class="empresa-endereco">${dadosEmpresa.endereco}</div>` : ''}
            </div>
          </div>
          
          <div class="titulo">RECIBO DE CONTRATO - CONTROLADORIA</div>
          
          <div class="numero-contrato">Contrato Nº: ${contratoData?.idContrato || id || 'N/A'}</div>
          
          <div class="info-section">
            <div class="info-section-title">Informações Gerais</div>
            <div class="info-contrato">
              <div class="info-item">
                <span class="label">Data de Saída:</span> ${contratoData?.dataSaida || 'N/A'}
              </div>
              <div class="info-item">
                <span class="label">Origem:</span> ${contratoData?.cidadeOrigem || 'N/A'} - ${contratoData?.estadoOrigem || 'N/A'}
              </div>
              <div class="info-item">
                <span class="label">Destino:</span> ${contratoData?.cidadeDestino || 'N/A'} - ${contratoData?.estadoDestino || 'N/A'}
              </div>
              <div class="info-item">
                <span class="label">Cliente:</span> ${contratoData?.clienteDestino || 'N/A'}
              </div>
            </div>
          </div>
          
          <div class="info-section">
            <div class="info-section-title">Veículo e Motorista</div>
            <div class="info-contrato">
              <div class="info-item">
                <span class="label">Placa Cavalo:</span> ${contratoData?.placaCavalo || 'N/A'}
              </div>
              <div class="info-item">
                <span class="label">Placa Carreta:</span> ${contratoData?.placaCarreta || 'N/A'}
              </div>
              <div class="info-item">
                <span class="label">Motorista:</span> ${contratoData?.motorista || 'N/A'}
              </div>
              <div class="info-item">
                <span class="label">Tipo:</span> ${contratoData?.tipo === 'frota' ? 'Própria' : 'Terceirizada'}
              </div>
              ${contratoData?.tipo === 'terceiro' ? `
              <div class="info-item">
                <span class="label">Proprietário:</span> ${contratoData?.proprietario || 'N/A'}
              </div>` : ''}
            </div>
          </div>
          
          <div class="info-section">
            <div class="info-section-title">Informações Financeiras</div>
            <div class="info-contrato">
              <div class="info-item">
                <span class="label">Valor do Frete:</span> R$ ${contratoData?.valorFrete ? parseFloat(contratoData.valorFrete).toFixed(2).replace('.', ',') : '0,00'}
              </div>
              ${contratoData?.tipo === 'terceiro' ? `
              <div class="info-item">
                <span class="label">Valor do Adiantamento:</span> R$ ${contratoData?.valorAdiantamento ? parseFloat(contratoData.valorAdiantamento).toFixed(2).replace('.', ',') : '0,00'}
              </div>
              <div class="info-item">
                <span class="label">Valor do Pedágio:</span> R$ ${contratoData?.valorPedagio ? parseFloat(contratoData.valorPedagio).toFixed(2).replace('.', ',') : '0,00'}
              </div>
              <div class="info-item">
                <span class="label">Saldo a Pagar:</span> R$ ${contratoData?.saldoPagar ? parseFloat(contratoData.saldoPagar).toFixed(2).replace('.', ',') : '0,00'}
              </div>` : ''}
            </div>
          </div>
          
          <div class="info-section">
            <div class="info-section-title">Documentação</div>
            <div class="info-contrato">
              ${contratoData?.numeroManifesto ? `
              <div class="info-item">
                <span class="label">Número do Manifesto:</span> ${contratoData.numeroManifesto}
              </div>` : ''}
              ${contratoData?.numeroCTe ? `
              <div class="info-item">
                <span class="label">Número do CTe:</span> ${contratoData.numeroCTe}
              </div>` : ''}
              ${contratoData?.notasFiscais && contratoData.notasFiscais.length > 0 ? `
              <div class="info-item">
                <span class="label">Notas Fiscais:</span> ${contratoData.notasFiscais.map((nf: any) => nf.numero).join(', ')}
              </div>` : ''}
            </div>
          </div>
          
          <div class="info-section">
            <div class="info-section-title">Observações</div>
            <div class="info-item">
              ${contratoData?.observacoes || 'Nenhuma observação registrada.'}
            </div>
          </div>
          
          <div class="assinaturas">
            <div class="assinatura">Operação</div>
            <div class="assinatura">Controladoria</div>
          </div>
          
          <div class="data-hora">
            Documento gerado em: ${new Date().toLocaleString('pt-BR')}
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <button onclick="window.print();" style="padding: 10px 20px; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Imprimir
            </button>
          </div>
        </body>
      </html>
    `);
    
    janelaImpressao.document.close();
    janelaImpressao.focus();
    // Após renderizar o conteúdo, chama o método de impressão
    setTimeout(() => {
      janelaImpressao.print();
    }, 250);
  };

  return (
    <PageLayout>
      <PageHeader 
        title={isEditing ? "Editar Contrato" : "Novo Contrato"} 
        description={isEditing 
          ? `Editando detalhes do contrato #${id}` 
          : "Registre um novo contrato de transporte"
        }
        backButton={true}
        backLink="/contratos"
      >
        {isEditing && (
          <div className="flex space-x-2">
            <Badge variant="secondary">ID: {id}</Badge>
          </div>
        )}
      </PageHeader>
      
      <div className="mt-6">
        <ContratoFormCompleto 
          contratoId={id} 
          onContratoSalvo={handleContratoSalvo}
        />
      </div>

      <Dialog open={dialogRecibo} onOpenChange={setDialogRecibo}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileDown className="mr-2 h-5 w-5" />
              Recibo de Contrato - Controladoria
            </DialogTitle>
          </DialogHeader>
          <div id="recibo-contrato" className="p-4 border rounded-md bg-white">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <div>
                {logoEmpresa ? (
                  <img src={logoEmpresa} alt="Logo" className="h-16 w-auto" />
                ) : (
                  <div className="text-xl font-bold">Controladoria</div>
                )}
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">{dadosEmpresa.nome}</div>
                {dadosEmpresa.cnpj && <div className="text-sm text-gray-600">CNPJ: {dadosEmpresa.cnpj}</div>}
                {dadosEmpresa.endereco && <div className="text-sm text-gray-600">{dadosEmpresa.endereco}</div>}
              </div>
            </div>
            
            <h2 className="text-center text-lg font-bold my-4">RECIBO DE CONTRATO - CONTROLADORIA</h2>
            
            <div className="text-lg font-bold mb-4">Contrato Nº: {contratoData?.idContrato || id || 'N/A'}</div>
            
            <div className="border-b pb-2 mb-3">
              <h3 className="text-md font-semibold mb-2">Informações Gerais</h3>
              <div className="space-y-1">
                <div>
                  <span className="font-semibold">Data de Saída:</span> {contratoData?.dataSaida || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold">Origem:</span> {contratoData?.cidadeOrigem || 'N/A'} - {contratoData?.estadoOrigem || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold">Destino:</span> {contratoData?.cidadeDestino || 'N/A'} - {contratoData?.estadoDestino || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold">Cliente:</span> {contratoData?.clienteDestino || 'N/A'}
                </div>
              </div>
            </div>
            
            <div className="border-b pb-2 mb-3">
              <h3 className="text-md font-semibold mb-2">Veículo e Motorista</h3>
              <div className="space-y-1">
                <div>
                  <span className="font-semibold">Placa Cavalo:</span> {contratoData?.placaCavalo || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold">Placa Carreta:</span> {contratoData?.placaCarreta || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold">Motorista:</span> {contratoData?.motorista || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold">Tipo:</span> {contratoData?.tipo === 'frota' ? 'Própria' : 'Terceirizada'}
                </div>
                {contratoData?.tipo === 'terceiro' && (
                  <div>
                    <span className="font-semibold">Proprietário:</span> {contratoData?.proprietario || 'N/A'}
                  </div>
                )}
              </div>
            </div>
            
            <div className="border-b pb-2 mb-3">
              <h3 className="text-md font-semibold mb-2">Informações Financeiras</h3>
              <div className="space-y-1">
                <div>
                  <span className="font-semibold">Valor do Frete:</span> R$ {contratoData?.valorFreteContratado 
                    ? parseFloat(contratoData.valorFreteContratado).toFixed(2).replace('.', ',') 
                    : '0,00'}
                </div>
                {contratoData?.tipo === 'terceiro' && (
                  <>
                    <div>
                      <span className="font-semibold">Valor do Adiantamento:</span> R$ {contratoData?.valorAdiantamento 
                        ? parseFloat(contratoData.valorAdiantamento).toFixed(2).replace('.', ',') 
                        : '0,00'}
                    </div>
                    <div>
                      <span className="font-semibold">Valor do Pedágio:</span> R$ {contratoData?.valorPedagio 
                        ? parseFloat(contratoData.valorPedagio).toFixed(2).replace('.', ',') 
                        : '0,00'}
                    </div>
                    <div>
                      <span className="font-semibold">Saldo a Pagar:</span> R$ {contratoData?.saldoPagar 
                        ? parseFloat(contratoData.saldoPagar).toFixed(2).replace('.', ',') 
                        : '0,00'}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-md font-semibold mb-2">Observações</h3>
              <div>
                {contratoData?.observacoes || 'Nenhuma observação registrada.'}
              </div>
            </div>
            
            <div className="flex justify-between mt-12">
              <div className="border-t pt-1 w-40 text-center">Operação</div>
              <div className="border-t pt-1 w-40 text-center">Controladoria</div>
            </div>
            
            <div className="text-right text-sm mt-12">
              Documento gerado em: {new Date().toLocaleString('pt-BR')}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={() => setDialogRecibo(false)} variant="outline">
              Fechar
            </Button>
            <Button onClick={imprimirRecibo} className="flex items-center gap-2">
              <PrinterIcon size={18} />
              Imprimir Recibo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default NovoContratoForm;
