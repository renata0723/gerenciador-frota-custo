
import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import { Building, SaveIcon, Upload, MapPin, Tag, Phone, Mail, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const ConfiguracoesEmpresa = () => {
  const [logoPreview, setLogoPreview] = useState<string | null>('/lovable-uploads/75203c5e-30d1-4ee0-ad01-02f3fb13db92.png');
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  // Dados da empresa pré-preenchidos
  const [dadosEmpresa, setDadosEmpresa] = useState({
    nome: 'Sslog Transportes LTDA',
    nomeFantasia: 'Sslog Transportes',
    cnpj: '44.712.877/0001-80',
    inscricaoEstadual: '90924698-99',
    telefone: '(41) 3589-2829',
    telefoneCelular: '(41) 99863-3118',
    email: 'samia@sslogtransporte.com.br',
    website: 'sslogtransporte.com.br',
    slogan: 'Soluções em Logística e Transporte',
    dataAbertura: '03/01/2022',
    porte: 'Micro Empresa',
    naturezaJuridica: 'Sociedade Empresária Limitada',
    optanteMEI: 'Não',
    optanteSimples: 'Não',
    dataOpcaoSimples: '03/01/2022',
    dataExclusaoSimples: '31/07/2024',
    capitalSocial: 'R$ 15.000,00',
    tipoEmpresa: 'Matriz',
    situacao: 'Ativa',
    dataSituacaoCadastral: '03/01/2022',
    cep: '83309-030',
    logradouro: 'Rua Vagner Luis Boscardin',
    numero: '7015',
    complemento: '',
    bairro: 'Aguas Claras',
    cidade: 'Piraquara',
    estado: 'PR'
  });
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveConfig = () => {
    setFormSubmitting(true);
    
    // Simulando um salvamento assíncrono
    setTimeout(() => {
      setFormSubmitting(false);
      toast({
        title: "Configurações salvas",
        description: "As configurações da empresa foram atualizadas com sucesso.",
        variant: "default",
      });
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setDadosEmpresa(prev => ({
      ...prev,
      [id]: value
    }));
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Configurações da Empresa" 
        description="Personalize as informações da sua empresa"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Configurações da Empresa' }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
        <div className="lg:col-span-2 space-y-8">
          {/* Informações Gerais */}
          <div className="bg-white dark:bg-sistema-dark rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center">
              <Building className="text-sistema-primary mr-2" size={20} />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Informações da Empresa</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Razão Social
                  </label>
                  <input
                    type="text"
                    id="nome"
                    value={dadosEmpresa.nome}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-sistema-primary focus:border-sistema-primary dark:bg-gray-800 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="nomeFantasia" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome Fantasia
                  </label>
                  <input
                    type="text"
                    id="nomeFantasia"
                    value={dadosEmpresa.nomeFantasia}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-sistema-primary focus:border-sistema-primary dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    CNPJ
                  </label>
                  <input
                    type="text"
                    id="cnpj"
                    value={dadosEmpresa.cnpj}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-sistema-primary focus:border-sistema-primary dark:bg-gray-800 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="inscricaoEstadual" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Inscrição Estadual
                  </label>
                  <input
                    type="text"
                    id="inscricaoEstadual"
                    value={dadosEmpresa.inscricaoEstadual}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-sistema-primary focus:border-sistema-primary dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Telefone Fixo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Phone size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="telefone"
                      value={dadosEmpresa.telefone}
                      onChange={handleInputChange}
                      className="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-sistema-primary focus:border-sistema-primary dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="telefoneCelular" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Telefone Celular / WhatsApp
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Phone size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="telefoneCelular"
                      value={dadosEmpresa.telefoneCelular}
                      onChange={handleInputChange}
                      className="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-sistema-primary focus:border-sistema-primary dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    E-mail
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={dadosEmpresa.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-sistema-primary focus:border-sistema-primary dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Website
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Globe size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="website"
                      value={dadosEmpresa.website}
                      onChange={handleInputChange}
                      className="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-sistema-primary focus:border-sistema-primary dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="slogan" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Slogan / Descrição
                </label>
                <textarea
                  id="slogan"
                  rows={3}
                  value={dadosEmpresa.slogan}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-sistema-primary focus:border-sistema-primary dark:bg-gray-800 dark:text-white"
                ></textarea>
              </div>
            </div>
          </div>
          
          {/* Informações Fiscais */}
          <div className="bg-white dark:bg-sistema-dark rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center">
              <Tag className="text-sistema-primary mr-2" size={20} />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Informações Fiscais</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="dataAbertura" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Data de Abertura
                  </label>
                  <input
                    type="text"
                    id="dataAbertura"
                    value={dadosEmpresa.dataAbertura}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-sistema-primary focus:border-sistema-primary dark:bg-gray-800 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="porte" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Porte
                  </label>
                  <input
                    type="text"
                    id="porte"
                    value={dadosEmpresa.porte}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-sistema-primary focus:border-sistema-primary dark:bg-gray-800 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="naturezaJuridica" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Natureza Jurídica
                  </label>
                  <input
                    type="text"
                    id="naturezaJuridica"
                    value={dadosEmpresa.naturezaJuridica}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-sistema-primary focus:border-sistema-primary dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label htmlFor="optanteMEI" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Optante MEI
                  </label>
                  <select
                    id="optanteMEI"
                    value={dadosEmpresa.optanteMEI}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-sistema-primary focus:border-sistema-primary dark:bg-gray-800 dark:text-white"
                  >
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="optanteSimples" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Optante Simples
                  </label>
                  <select
                    id="optanteSimples"
                    value={dadosEmpresa.optanteSimples}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-sistema-primary focus:border-sistema-primary dark:bg-gray-800 dark:text-white"
                  >
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="dataOpcaoSimples" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Data Opção Simples
                  </label>
                  <input
                    type="text"
                    id="dataOpcaoSimples"
                    value={dadosEmpresa.dataOpcaoSimples}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-sistema-primary focus:border-sistema-primary dark:bg-gray-800 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="dataExclusaoSimples" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Data Exclusão Simples
                  </label>
                  <input
                    type="text"
                    id="dataExclusaoSimples"
                    value={dadosEmpresa.dataExclusaoSimples}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-sistema-primary focus:border-sistema-primary dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="capitalSocial" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Capital Social
                  </label>
                  <input
                    type="text"
                    id="capitalSocial"
                    value={dadosEmpresa.capitalSocial}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-sistema-primary focus:border-sistema-primary dark:bg-gray-800 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="tipoEmpresa" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tipo
                  </label>
                  <select
                    id="tipoEmpresa"
                    value={dadosEmpresa.tipoEmpresa}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-sistema-primary focus:border-sistema-primary dark:bg-gray-800 dark:text-white"
                  >
                    <option value="Matriz">Matriz</option>
                    <option value="Filial">Filial</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="situacao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Situação
                  </label>
                  <select
                    id="situacao"
                    value={dadosEmpresa.situacao}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-sistema-primary focus:border-sistema-primary dark:bg-gray-800 dark:text-white"
                  >
                    <option value="Ativa">Ativa</option>
                    <option value="Inativa">Inativa</option>
                    <option value="Suspensa">Suspensa</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="dataSituacaoCadastral" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data Situação Cadastral
                </label>
                <input
                  type="text"
                  id="dataSituacaoCadastral"
                  value={dadosEmpresa.dataSituacaoCadastral}
                  onChange={handleInputChange}
                  className="w-full max-w-xs px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-sistema-primary focus:border-sistema-primary dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>
          
          {/* Endereço */}
          <div className="bg-white dark:bg-sistema-dark rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center">
              <MapPin className="text-sistema-primary mr-2" size={20} />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Endereço</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label htmlFor="cep" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  CEP
                </label>
                <input
                  type="text"
                  id="cep"
                  value={dadosEmpresa.cep}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-sistema-primary focus:border-sistema-primary dark:bg-gray-800 dark:text-white max-w-xs"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="logradouro" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Logradouro
                  </label>
                  <input
                    type="text"
                    id="logradouro"
                    value={dadosEmpresa.logradouro}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-sistema-primary focus:border-sistema-primary dark:bg-gray-800 dark:text-white"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="numero" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Número
                    </label>
                    <input
                      type="text"
                      id="numero"
                      value={dadosEmpresa.numero}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-sistema-primary focus:border-sistema-primary dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="complemento" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Complemento
                    </label>
                    <input
                      type="text"
                      id="complemento"
                      value={dadosEmpresa.complemento}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-sistema-primary focus:border-sistema-primary dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bairro
                  </label>
                  <input
                    type="text"
                    id="bairro"
                    value={dadosEmpresa.bairro}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-sistema-primary focus:border-sistema-primary dark:bg-gray-800 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    id="cidade"
                    value={dadosEmpresa.cidade}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-sistema-primary focus:border-sistema-primary dark:bg-gray-800 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="estado" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Estado
                  </label>
                  <select
                    id="estado"
                    value={dadosEmpresa.estado}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-sistema-primary focus:border-sistema-primary dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">Selecione</option>
                    <option value="AC">Acre</option>
                    <option value="AL">Alagoas</option>
                    <option value="AP">Amapá</option>
                    <option value="AM">Amazonas</option>
                    <option value="BA">Bahia</option>
                    <option value="CE">Ceará</option>
                    <option value="DF">Distrito Federal</option>
                    <option value="ES">Espírito Santo</option>
                    <option value="GO">Goiás</option>
                    <option value="MA">Maranhão</option>
                    <option value="MT">Mato Grosso</option>
                    <option value="MS">Mato Grosso do Sul</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="PA">Pará</option>
                    <option value="PB">Paraíba</option>
                    <option value="PR">Paraná</option>
                    <option value="PE">Pernambuco</option>
                    <option value="PI">Piauí</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="RN">Rio Grande do Norte</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="RO">Rondônia</option>
                    <option value="RR">Roraima</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="SP">São Paulo</option>
                    <option value="SE">Sergipe</option>
                    <option value="TO">Tocantins</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Personalização */}
          <div className="bg-white dark:bg-sistema-dark rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center">
              <Tag className="text-sistema-primary mr-2" size={20} />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Personalização</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label htmlFor="cabecalho" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Texto do Cabeçalho
                </label>
                <input
                  type="text"
                  id="cabecalho"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-sistema-primary focus:border-sistema-primary dark:bg-gray-800 dark:text-white"
                  placeholder="Texto que aparecerá no cabeçalho dos documentos"
                  defaultValue="Sslog Transportes - Soluções em Logística"
                />
              </div>
              
              <div>
                <label htmlFor="cores" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cor Principal
                </label>
                <div className="flex space-x-4">
                  <input
                    type="color"
                    id="cores"
                    className="h-10 w-20 p-1 rounded border border-gray-300 dark:border-gray-700 cursor-pointer"
                    defaultValue="#33C3F0"
                  />
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    Esta cor será usada em cabeçalhos e elementos destacados
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Logo e Prévia */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-sistema-dark rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Logo da Empresa</h3>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-center w-full">
                <label htmlFor="logo-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                  {logoPreview ? (
                    <div className="w-full h-full flex items-center justify-center p-4">
                      <img 
                        src={logoPreview} 
                        alt="Logo Preview" 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Clique para enviar</span> ou arraste e solte</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG ou JPG (Máx. 2MB)</p>
                    </div>
                  )}
                  <input id="logo-upload" type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                </label>
              </div>
              
              {logoPreview && (
                <div className="mt-4 flex justify-center">
                  <button 
                    type="button" 
                    className="text-red-600 hover:text-red-700 text-sm font-medium" 
                    onClick={() => setLogoPreview(null)}
                  >
                    Remover imagem
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Prévia do Cabeçalho */}
          <div className="bg-white dark:bg-sistema-dark rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Prévia do Cabeçalho</h3>
            </div>
            
            <div className="p-6">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center">
                  {logoPreview ? (
                    <div className="w-16 h-16 mr-4">
                      <img 
                        src={logoPreview} 
                        alt="Logo Preview" 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 mr-4 flex items-center justify-center">
                      <Building className="text-gray-400" size={24} />
                    </div>
                  )}
                  
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">Sslog Transportes LTDA</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">CNPJ: 44.712.877/0001-80</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Piraquara, PR</div>
                  </div>
                </div>
              </div>
              
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Esta é uma prévia de como o cabeçalho aparecerá nos documentos gerados pelo sistema.
              </p>
            </div>
          </div>
          
          {/* Configurações Avançadas */}
          <div className="bg-white dark:bg-sistema-dark rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Configurações Avançadas</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Backups Automáticos</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Realizar backups diários do sistema</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sistema-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-sistema-primary"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Notificações por E-mail</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Receber alertas e relatórios por e-mail</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sistema-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-sistema-primary"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Acesso Externo</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Permitir acesso ao sistema fora da rede local</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sistema-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-sistema-primary"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Botão de Salvar */}
      <div className="flex justify-end mt-8 mb-12">
        <Button 
          onClick={handleSaveConfig} 
          disabled={formSubmitting}
          className="bg-sistema-primary hover:bg-sistema-primary-dark text-white"
        >
          {formSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Salvando...
            </>
          ) : (
            <>
              <SaveIcon size={16} className="mr-2" />
              Salvar Configurações
            </>
          )}
        </Button>
      </div>
    </PageLayout>
  );
};

export default ConfiguracoesEmpresa;
