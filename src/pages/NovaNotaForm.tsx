
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileText, Save, X, ArrowLeft, AlertCircle } from 'lucide-react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { logOperation } from '@/utils/logOperations';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Chave para armazenamento no localStorage
const STORAGE_KEY = 'controlfrota_notas_fiscais';

// Lista correta dos estados brasileiros em ordem alfabética
const estados = [
  'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 
  'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'
];

// Tipos de veículos
const tiposVeiculos = [
  'Utilitário', 'VUC', '3/4', 'Toco', 'Truck', 'Carreta', 'Bitrem', 'Vanderleia'
];

const NovaNotaForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [originalId, setOriginalId] = useState('');
  
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

  const [isNotaDuplicada, setIsNotaDuplicada] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  // Verificar se estamos em modo de edição
  useEffect(() => {
    if (location.state && location.state.noteData) {
      const note = location.state.noteData;
      setIsEditing(true);
      setOriginalId(note.id);
      
      // Preencher o formulário com os dados da nota
      setFormData({
        dataColeta: note.date.split('/').reverse().join('-') || '',  // Converter data para formato de input date
        horaColeta: '08:00', // Valor padrão pois não temos o dado
        dataEntrega: note.deliveryDate.split('/').reverse().join('-') || '',
        clienteDestinatario: note.client || '',
        cidadeDestino: note.destination.split(',')[0] || '',
        estadoDestino: note.destination.split(',')[1]?.trim() || 'SP',
        numeroNotaFiscal: note.id || '',
        senhaAgendamento: '',
        valorNotaFiscal: note.value.replace('R$ ', '').replace('.', '').replace(',', '.') || '',
        volume: '',
        pesoTotal: '',
        quantidadePaletes: '',
        valorCotacao: '',
        numeroTotalPaletes: '',
        tipoCarga: 'paletizada',
        quantidadeCarga: '',
        tipoVeiculo: ''
      });
    }
  }, [location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Verifica duplicidade ao digitar o número da nota fiscal, mas apenas se não estiver em modo de edição
    // ou se o ID for diferente do original
    if (name === 'numeroNotaFiscal' && (!isEditing || value !== originalId)) {
      // Verificar no localStorage se a nota já existe
      const storedNotes = localStorage.getItem(STORAGE_KEY);
      let notasFiscaisExistentes: string[] = [];
      
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        notasFiscaisExistentes = parsedNotes.map((note: any) => note.id);
      }
      
      const isDuplicada = notasFiscaisExistentes.includes(value);
      setIsNotaDuplicada(isDuplicada);
    }
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

  const verificarDuplicidade = () => {
    // Se estiver editando e o ID não foi alterado, não há duplicidade
    if (isEditing && formData.numeroNotaFiscal === originalId) {
      return false;
    }
    
    // Verificar no localStorage se a nota já existe
    const storedNotes = localStorage.getItem(STORAGE_KEY);
    let notasFiscaisExistentes: string[] = [];
    
    if (storedNotes) {
      const parsedNotes = JSON.parse(storedNotes);
      notasFiscaisExistentes = parsedNotes.map((note: any) => note.id);
    }
    
    return notasFiscaisExistentes.includes(formData.numeroNotaFiscal);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verifica se a nota fiscal já existe
    if (verificarDuplicidade()) {
      setIsAlertDialogOpen(true);
      return;
    }
    
    // Continua com o salvamento se não houver duplicidade
    finalizarSalvamento();
  };

  const finalizarSalvamento = () => {
    // Formatar os dados para o formato esperado pela lista
    const formattedNote = {
      id: formData.numeroNotaFiscal,
      date: formData.dataColeta.split('-').reverse().join('/'),
      client: formData.clienteDestinatario,
      destination: `${formData.cidadeDestino}, ${formData.estadoDestino}`,
      deliveryDate: formData.dataEntrega.split('-').reverse().join('/'),
      value: `R$ ${parseFloat(formData.valorNotaFiscal).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
      status: isEditing ? location.state?.noteData?.status || 'Em trânsito' : 'Em trânsito'
    };
    
    if (isEditing) {
      // Registrar operação
      logOperation('EntradaNotas', `Atualizou nota fiscal: ${formData.numeroNotaFiscal}`, true);
      
      // Redirecionar para lista com dados atualizados
      navigate('/entrada-notas', { 
        state: { updatedNote: formattedNote }
      });
    } else {
      // Registrar operação para nova nota
      logOperation('EntradaNotas', `Cadastrou nova nota fiscal: ${formData.numeroNotaFiscal}`, true);
      
      // Notificar usuário
      toast.success('Nota fiscal cadastrada com sucesso!', {
        description: `NF ${formData.numeroNotaFiscal} para ${formData.clienteDestinatario}`,
      });
      
      // Redirecionar para lista com a nova nota
      navigate('/entrada-notas', { 
        state: { newNote: formattedNote }
      });
    }
  };

  const handleCancel = () => {
    navigate('/entrada-notas');
  };

  return (
    <PageLayout>
      <PageHeader 
        title={isEditing ? "Editar Nota Fiscal" : "Nova Nota Fiscal"} 
        description={isEditing ? "Altere os dados da nota fiscal" : "Cadastre uma nova nota fiscal e dados de frete"}
        icon={<FileText className="h-8 w-8 text-sistema-primary" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Entrada de Notas', href: '/entrada-notas' },
          { label: isEditing ? 'Editar Nota' : 'Nova Nota' }
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
              <div className="relative">
                <Input
                  id="numeroNotaFiscal"
                  name="numeroNotaFiscal"
                  type="text"
                  required
                  placeholder="NF-000000"
                  value={formData.numeroNotaFiscal}
                  onChange={handleInputChange}
                  className={isNotaDuplicada ? "border-red-500 pr-10" : ""}
                  readOnly={isEditing} // Tornar somente leitura em modo de edição
                />
                {isNotaDuplicada && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {isNotaDuplicada && (
                <p className="mt-1 text-sm text-red-600">
                  Esta nota fiscal já está cadastrada no sistema.
                </p>
              )}
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
            {isEditing ? 'Salvar Alterações' : 'Salvar Nota Fiscal'}
          </Button>
        </div>
      </form>

      {/* Diálogo de alerta para nota fiscal duplicada */}
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Nota Fiscal Duplicada
            </AlertDialogTitle>
            <AlertDialogDescription>
              A nota fiscal <strong>{formData.numeroNotaFiscal}</strong> já está cadastrada no sistema. 
              Não é possível cadastrar a mesma nota fiscal duas vezes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsAlertDialogOpen(false)}>
              Entendi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
};

export default NovaNotaForm;
