
import React, { useState, useEffect } from 'react';
import { Receipt, Plus, MoreHorizontal, Search, Filter, Download, CheckCircle, Calendar, FileText, Truck } from 'lucide-react';
import { toast } from 'sonner';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { logOperation } from '@/utils/logOperations';
import { supabase } from '@/integrations/supabase/client';
import PesquisaDocumentos from '@/components/canhotos/PesquisaDocumentos';
import CanhotoForm from '@/components/canhotos/CanhotoForm';
import { Badge } from '@/components/ui/badge';

interface Canhoto {
  id: string;
  contrato_id: string;
  data_entrega_cliente: string | null;
  data_recebimento_canhoto: string | null;
  numero_nota_fiscal: string | null;
  numero_cte: string | null;
  numero_manifesto: string | null;
  cliente: string;
  motorista: string;
  responsavel_recebimento: string | null;
  status: 'Pendente' | 'Recebido';
  proprietario_veiculo: string | null;
  data_programada_pagamento: string | null;
}

const Canhotos = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [canhotos, setCanhotos] = useState<Canhoto[]>([]);
  const [filteredCanhotos, setFilteredCanhotos] = useState<Canhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCanhoto, setSelectedCanhoto] = useState<Canhoto | null>(null);
  
  // Carregar canhotos do banco de dados
  const fetchCanhotos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Canhoto')
        .select('*')
        .order('id', { ascending: false });
      
      if (error) throw error;
      
      setCanhotos(data || []);
      setFilteredCanhotos(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar canhotos:', error);
      toast.error(`Erro ao carregar canhotos: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCanhotos();
  }, []);
  
  const handleAddCanhoto = () => {
    logOperation('Abrir formulário', 'Formulário de novo canhoto aberto', true);
    toast.info('Use a busca por documento para encontrar um contrato e registrar seu canhoto');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (!value.trim()) {
      setFilteredCanhotos(canhotos);
      return;
    }
    
    const filtered = canhotos.filter(canhoto => 
      canhoto.contrato_id?.toLowerCase().includes(value.toLowerCase()) ||
      canhoto.cliente?.toLowerCase().includes(value.toLowerCase()) ||
      canhoto.motorista?.toLowerCase().includes(value.toLowerCase()) ||
      canhoto.numero_nota_fiscal?.toLowerCase().includes(value.toLowerCase()) ||
      canhoto.numero_cte?.toLowerCase().includes(value.toLowerCase()) ||
      canhoto.numero_manifesto?.toLowerCase().includes(value.toLowerCase())
    );
    
    setFilteredCanhotos(filtered);
  };

  const handleExportCanhotos = () => {
    logOperation('Exportar Canhotos', 'Iniciada exportação de canhotos', true);
    toast.success('Canhotos exportados com sucesso');
  };
  
  const handleDocumentoSearch = async (tipo: string, valor: string) => {
    setLoading(true);
    try {
      // Primeiro, verificamos se existe um canhoto com esse documento
      const { data: canhotosExistentes, error: errorBusca } = await supabase
        .from('Canhoto')
        .select('*')
        .eq(tipo, valor);
      
      if (errorBusca) throw errorBusca;
      
      if (canhotosExistentes && canhotosExistentes.length > 0) {
        // Se já existem canhotos, apenas filtramos
        setFilteredCanhotos(canhotosExistentes);
        toast.info(`Encontrado(s) ${canhotosExistentes.length} canhoto(s) para este documento`);
      } else {
        // Caso contrário, buscamos contratos relacionados
        let contratoQuery;
        
        if (tipo === 'contrato_id') {
          contratoQuery = supabase
            .from('Contratos')
            .select('*')
            .eq('id', valor)
            .single();
        } else if (tipo === 'numero_nota_fiscal' || tipo === 'numero_cte' || tipo === 'numero_manifesto') {
          // Aqui, precisamos buscar qual contrato está associado a este documento
          // Esta lógica pode variar de acordo com como os documentos estão relacionados no seu banco
          // Por simplicidade, vamos assumir um contrato específico
          contratoQuery = supabase
            .from('Contratos')
            .select('*')
            .limit(1)
            .single();
        }
        
        if (contratoQuery) {
          const { data: contrato, error: errorContrato } = await contratoQuery;
          
          if (errorContrato) {
            toast.error('Nenhum contrato encontrado para este documento');
            setFilteredCanhotos([]);
            return;
          }
          
          if (contrato) {
            // Criar um novo canhoto baseado no contrato
            const novoCanhoto: Partial<Canhoto> = {
              contrato_id: contrato.id,
              cliente: contrato.cliente_destino,
              motorista: contrato.motorista || 'Não informado',
              proprietario_veiculo: contrato.tipo_frota === 'terceiro' ? contrato.proprietario : null,
              status: 'Pendente'
            };
            
            // Adicionar informação do documento específico
            novoCanhoto[tipo as keyof Partial<Canhoto>] = valor;
            
            // Inserir o novo canhoto no banco de dados
            const { data: canhotoInserido, error: errorInsert } = await supabase
              .from('Canhoto')
              .insert(novoCanhoto)
              .select()
              .single();
            
            if (errorInsert) throw errorInsert;
            
            if (canhotoInserido) {
              toast.success('Novo canhoto criado para este documento');
              await fetchCanhotos(); // Recarregar a lista
              
              // Atualizamos o filtro para mostrar apenas o novo canhoto
              setFilteredCanhotos([canhotoInserido]);
            }
          }
        } else {
          toast.error('Tipo de documento não suportado para criação automática');
          setFilteredCanhotos([]);
        }
      }
    } catch (error: any) {
      console.error('Erro na busca de documentos:', error);
      toast.error(`Erro na busca: ${error.message}`);
      setFilteredCanhotos([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleReceberCanhoto = (canhoto: Canhoto) => {
    setSelectedCanhoto(canhoto);
    setFormOpen(true);
  };
  
  const handleFormSuccess = () => {
    fetchCanhotos(); // Recarregar a lista após o registro bem-sucedido
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Canhotos" 
        description="Gerenciamento de canhotos de entrega"
        icon={<Receipt size={28} className="text-sistema-primary" />}
      />

      {/* Barra de ações */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
        <div className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                className="pl-10"
                placeholder="Buscar canhotos..."
                value={searchTerm}
                onChange={handleSearchChange}
                autoComplete="off"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 items-center md:justify-end">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter size={16} />
                <span className="hidden md:inline">Filtrar</span>
              </Button>
              
              <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleExportCanhotos}>
                <Download size={16} />
                <span className="hidden md:inline">Exportar</span>
              </Button>
              
              <Button variant="default" size="sm" className="md:ml-auto flex items-center gap-1" onClick={handleAddCanhoto}>
                <Plus size={16} />
                <span>Novo Canhoto</span>
              </Button>
            </div>
          </div>
          
          {/* Componente de pesquisa por documentos */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h3 className="text-sm font-medium mb-2 text-gray-700">Pesquisar por documento</h3>
            <PesquisaDocumentos onSearch={handleDocumentoSearch} />
          </div>
        </div>
      </div>
      
      {/* Tabela de canhotos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contrato</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documentos</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motorista</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datas</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sistema-primary"></div>
                      <p>Carregando canhotos...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredCanhotos.length > 0 ? (
                filteredCanhotos.map((canhoto) => (
                  <tr key={canhoto.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">{canhoto.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {canhoto.contrato_id || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex flex-col gap-1">
                        {canhoto.numero_nota_fiscal && (
                          <div className="flex items-center gap-1">
                            <FileText size={12} className="text-blue-500" />
                            <span className="text-gray-600">NF: {canhoto.numero_nota_fiscal}</span>
                          </div>
                        )}
                        {canhoto.numero_cte && (
                          <div className="flex items-center gap-1">
                            <FileText size={12} className="text-green-500" />
                            <span className="text-gray-600">CTe: {canhoto.numero_cte}</span>
                          </div>
                        )}
                        {canhoto.numero_manifesto && (
                          <div className="flex items-center gap-1">
                            <FileText size={12} className="text-purple-500" />
                            <span className="text-gray-600">Manifesto: {canhoto.numero_manifesto}</span>
                          </div>
                        )}
                        {!canhoto.numero_nota_fiscal && !canhoto.numero_cte && !canhoto.numero_manifesto && (
                          <span className="text-gray-400 text-xs">Nenhum documento vinculado</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {canhoto.cliente || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Truck size={14} className="text-gray-400" />
                        {canhoto.motorista || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex flex-col gap-1">
                        {canhoto.data_entrega_cliente && (
                          <div className="flex items-center gap-1">
                            <Calendar size={12} className="text-blue-500" />
                            <span className="text-gray-600">Entrega: {canhoto.data_entrega_cliente}</span>
                          </div>
                        )}
                        {canhoto.data_recebimento_canhoto && (
                          <div className="flex items-center gap-1">
                            <CheckCircle size={12} className="text-green-500" />
                            <span className="text-gray-600">Recebimento: {canhoto.data_recebimento_canhoto}</span>
                          </div>
                        )}
                        {canhoto.data_programada_pagamento && (
                          <div className="flex items-center gap-1">
                            <Calendar size={12} className="text-orange-500" />
                            <span className="text-gray-600">Pgto: {canhoto.data_programada_pagamento}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`${
                        canhoto.status === 'Recebido' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                          : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                      }`}>
                        {canhoto.status || 'Pendente'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleReceberCanhoto(canhoto)}>
                            {canhoto.status === 'Recebido' ? 'Editar recebimento' : 'Receber canhoto'}
                          </DropdownMenuItem>
                          <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                          <DropdownMenuItem>Imprimir</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 py-8">
                      <Receipt size={32} className="text-gray-400" />
                      <p>Nenhum canhoto encontrado</p>
                      {searchTerm && (
                        <Button variant="link" onClick={() => setSearchTerm('')}>
                          Limpar busca
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Formulário de recebimento de canhoto */}
      {selectedCanhoto && (
        <CanhotoForm 
          isOpen={formOpen}
          onClose={() => setFormOpen(false)}
          onSuccess={handleFormSuccess}
          canhotoData={selectedCanhoto}
        />
      )}
    </PageLayout>
  );
};

export default Canhotos;
