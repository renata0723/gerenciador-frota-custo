
import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import { Building, SaveIcon, Upload, MapPin, Tag, Phone, Mail, Globe } from 'lucide-react';

const ConfiguracoesEmpresa = () => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
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
          <div className="bg-white dark:bg-sistema-dark rounded-xl border border-gray-100 dark:border-gray-800 shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center">
              <Building className="text-sistema-primary mr-2" size={20} />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Informações da Empresa</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome da Empresa
                  </label>
                  <input
                    type="text"
                    id="nome"
                    className="input-field w-full"
                    placeholder="Nome da sua empresa"
                  />
                </div>
                
                <div>
                  <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    CNPJ
                  </label>
                  <input
                    type="text"
                    id="cnpj"
                    className="input-field w-full"
                    placeholder="00.000.000/0001-00"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Telefone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Phone size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="telefone"
                      className="input-field pl-10 w-full"
                      placeholder="(00) 0000-0000"
                    />
                  </div>
                </div>
                
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
                      className="input-field pl-10 w-full"
                      placeholder="contato@empresa.com.br"
                    />
                  </div>
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
                    className="input-field pl-10 w-full"
                    placeholder="www.suaempresa.com.br"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="slogan" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Slogan / Descrição
                </label>
                <textarea
                  id="slogan"
                  rows={3}
                  className="input-field w-full"
                  placeholder="Descreva brevemente sua empresa..."
                ></textarea>
              </div>
            </div>
          </div>
          
          {/* Endereço */}
          <div className="bg-white dark:bg-sistema-dark rounded-xl border border-gray-100 dark:border-gray-800 shadow-card overflow-hidden">
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
                  className="input-field w-full max-w-xs"
                  placeholder="00000-000"
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
                    className="input-field w-full"
                    placeholder="Rua, Avenida, etc."
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
                      className="input-field w-full"
                      placeholder="Nº"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="complemento" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Complemento
                    </label>
                    <input
                      type="text"
                      id="complemento"
                      className="input-field w-full"
                      placeholder="Sala, Andar, etc."
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
                    className="input-field w-full"
                    placeholder="Bairro"
                  />
                </div>
                
                <div>
                  <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    id="cidade"
                    className="input-field w-full"
                    placeholder="Cidade"
                  />
                </div>
                
                <div>
                  <label htmlFor="estado" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Estado
                  </label>
                  <select
                    id="estado"
                    className="input-field w-full"
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
          <div className="bg-white dark:bg-sistema-dark rounded-xl border border-gray-100 dark:border-gray-800 shadow-card overflow-hidden">
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
                  className="input-field w-full"
                  placeholder="Texto que aparecerá no cabeçalho dos documentos"
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
          <div className="bg-white dark:bg-sistema-dark rounded-xl border border-gray-100 dark:border-gray-800 shadow-card overflow-hidden">
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
          <div className="bg-white dark:bg-sistema-dark rounded-xl border border-gray-100 dark:border-gray-800 shadow-card overflow-hidden">
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
                    <div className="text-lg font-bold text-gray-900 dark:text-white">LogiFrota Transportes</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">CNPJ: 00.000.000/0001-00</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">São Paulo, SP</div>
                  </div>
                </div>
              </div>
              
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Esta é uma prévia de como o cabeçalho aparecerá nos documentos gerados pelo sistema.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Botão de Salvar */}
      <div className="flex justify-end mt-8">
        <button className="btn-primary flex items-center">
          <SaveIcon size={16} className="mr-2" />
          Salvar Configurações
        </button>
      </div>
    </PageLayout>
  );
};

export default ConfiguracoesEmpresa;
