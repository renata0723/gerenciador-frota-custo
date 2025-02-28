
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileText, Save, X, ArrowLeft } from 'lucide-react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { logOperation } from '@/utils/logOperations';
import { toast } from 'sonner';

// Lista correta dos estados brasileiros
const estados = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

// Tipos de veículos
const tiposVeiculos = [
  'Utilitário', 'VUC', '3/4', 'Toco', 'Truck', 'Carreta', 'Bitrem', 'Vanderleia'
];

const NovaNotaForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dataColeta: '',
    horaColeta: '',
    dataEntrega: '',
    clienteDestinatario: '',
    cidadeDestino: '',
    estadoDestino: 'SP', // Estado default
    numeroNotaFiscal: '',
    senhaAgendamento: '',
    valorNotaFiscal: '',
    volume: '',
    pesoTotal: '',
    quantidadePaletes: '',
    valorCotacao: '',
    numeroTotalPaletes: '',
    tipoCarga: 'paletizada', // paletizada ou batida
    quantidadeCarga: '',
    tipoVeiculo: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Aqui você pode implementar uma lógica para extrair o estado da cidade
    // Por exemplo, se o usuário digitar "São Paulo - SP", você pode extrair o "SP"
    const cityParts = inputValue.split('-');
    
    setFormData(prev => ({ 
      ...prev, 
      cidadeDestino: inputValue,
      // Se houver um formato "Cidade - UF", atualize automaticamente o estado
      estadoDestino: cityParts.length > 1 ? cityParts[1].trim() : prev.estadoDestino
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simular salvamento
    logOperation('EntradaNotas', `Cadastrou nova nota fiscal: ${formData.numeroNotaFiscal}`, false);
    
    // Notificar usuário
    toast.success('Nota fiscal cadastrada com sucesso!', {
      description: `NF ${formData.numeroNotaFiscal} para ${formData.clienteDestinatario}`,
    });
    
    // Redirecionar para lista
    navigate('/entrada-notas');
  };

  const handleCancel = () => {
    navigate('/entrada-notas');
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Nova Nota Fiscal" 
        description="Cadastre uma nova nota fiscal e dados de frete"
        icon={<FileText className="h-8 w-8 text-sistema-primary" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Entrada de Notas', href: '/entrada-notas' },
          { label: 'Nova Nota' }
        ]}
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button 
              className="bg-sistema-primary hover:bg-sistema-primary/90" 
              onClick={handleSubmit}
            >
              <Save className="mr-2 h-4 w-4" />
              Salvar
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <DashboardCard title="Dados da Coleta">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="dataColeta" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Data da Coleta*
              </label>
              <Input
                id="dataColeta"
                name="dataColeta"
                type="date"
                required
                value={formData.dataColeta}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="horaColeta" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Horário da Coleta*
              </label>
              <Input
                id="horaColeta"
                name="horaColeta"
                type="time"
                required
                value={formData.horaColeta}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="dataEntrega" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Data Prevista de Entrega*
              </label>
              <Input
                id="dataEntrega"
                name="dataEntrega"
                type="date"
                required
                value={formData.dataEntrega}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="clienteDestinatario" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Cliente Destinatário*
              </label>
              <Input
                id="clienteDestinatario"
                name="clienteDestinatario"
                type="text"
                required
                placeholder="Nome do cliente"
                value={formData.clienteDestinatario}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="cidadeDestino" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Cidade de Destino*
              </label>
              <Input
                id="cidadeDestino"
                name="cidadeDestino"
                type="text"
                required
                placeholder="Cidade de entrega"
                value={formData.cidadeDestino}
                onChange={handleCidadeChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="estadoDestino" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Estado*
              </label>
              <select
                id="estadoDestino"
                name="estadoDestino"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                value={formData.estadoDestino}
                onChange={handleInputChange}
              >
                {estados.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Dados da Nota Fiscal">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="numeroNotaFiscal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Número da Nota Fiscal*
              </label>
              <Input
                id="numeroNotaFiscal"
                name="numeroNotaFiscal"
                type="text"
                required
                placeholder="NF-000000"
                value={formData.numeroNotaFiscal}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="senhaAgendamento" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Senha/Agendamento
              </label>
              <Input
                id="senhaAgendamento"
                name="senhaAgendamento"
                type="text"
                placeholder="Informe a senha ou código de agendamento"
                value={formData.senhaAgendamento}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="valorNotaFiscal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Valor da Nota Fiscal (R$)*
              </label>
              <Input
                id="valorNotaFiscal"
                name="valorNotaFiscal"
                type="text"
                required
                placeholder="0,00"
                value={formData.valorNotaFiscal}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Dados da Carga">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="volume" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Volume (m³)
              </label>
              <Input
                id="volume"
                name="volume"
                type="text"
                placeholder="0,00"
                value={formData.volume}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="pesoTotal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Peso Total (kg)*
              </label>
              <Input
                id="pesoTotal"
                name="pesoTotal"
                type="text"
                required
                placeholder="0,00"
                value={formData.pesoTotal}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="tipoCarga" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tipo de Carga*
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="tipoCarga"
                    value="paletizada"
                    checked={formData.tipoCarga === 'paletizada'}
                    onChange={handleInputChange}
                    className="text-sistema-primary focus:ring-sistema-primary h-4 w-4"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Paletizada</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="tipoCarga"
                    value="batida"
                    checked={formData.tipoCarga === 'batida'}
                    onChange={handleInputChange}
                    className="text-sistema-primary focus:ring-sistema-primary h-4 w-4"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Batida</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="quantidadePaletes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Quantidade de Paletes por Nota
              </label>
              <Input
                id="quantidadePaletes"
                name="quantidadePaletes"
                type="number"
                min="0"
                placeholder="0"
                value={formData.quantidadePaletes}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="numeroTotalPaletes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Número Total de Paletes
              </label>
              <Input
                id="numeroTotalPaletes"
                name="numeroTotalPaletes"
                type="number"
                min="0"
                placeholder="0"
                value={formData.numeroTotalPaletes}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="quantidadeCarga" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Quantidade de Carga {formData.tipoCarga === 'paletizada' ? 'Paletizada' : 'Batida'}
              </label>
              <Input
                id="quantidadeCarga"
                name="quantidadeCarga"
                type="text"
                placeholder="Informe a quantidade"
                value={formData.quantidadeCarga}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Dados do Frete">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="valorCotacao" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Valor da Cotação (R$)*
              </label>
              <Input
                id="valorCotacao"
                name="valorCotacao"
                type="text"
                required
                placeholder="0,00"
                value={formData.valorCotacao}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="tipoVeiculo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tipo de Veículo*
              </label>
              <select
                id="tipoVeiculo"
                name="tipoVeiculo"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                value={formData.tipoVeiculo}
                onChange={handleInputChange}
              >
                <option value="">Selecione um tipo de veículo</option>
                {tiposVeiculos.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
          </div>
        </DashboardCard>

        <div className="flex justify-end space-x-4 mt-8">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Button 
            type="submit" 
            className="bg-sistema-primary hover:bg-sistema-primary/90"
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar Nota Fiscal
          </Button>
        </div>
      </form>
    </PageLayout>
  );
};

export default NovaNotaForm;
