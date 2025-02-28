
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import { Truck, ChevronLeft, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const NovoVeiculoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    placa: '',
    tipo: 'cavalo',
    modelo: '',
    ano: new Date().getFullYear(),
    chassi: '',
    renavam: '',
    capacidade: '',
    marca: '',
    cor: '',
    combustivel: 'diesel',
    frota: 'propria',
    observacoes: '',
    // Dados específicos para cavalo mecânico
    potencia: '',
    torque: '',
    entreEixos: '',
    // Dados específicos para carreta
    tipoCarroceria: '',
    comprimento: '',
    largura: '',
    altura: '',
    capacidadeCarga: '',
  });

  // Simular carregamento de dados para edição
  useEffect(() => {
    if (isEditMode) {
      // Em um cenário real, este seria um fetch para a API
      // Aqui vamos simular com dados mock
      setTimeout(() => {
        const mockVeiculo = {
          placa: 'ABC-1234',
          tipo: 'cavalo',
          modelo: 'Scania R450',
          ano: 2020,
          chassi: '9BWHE21JX24060031',
          renavam: '123456789',
          capacidade: '45000',
          marca: 'Scania',
          cor: 'Vermelho',
          combustivel: 'diesel',
          frota: 'propria',
          observacoes: 'Veículo em bom estado',
          potencia: '450',
          torque: '2300',
          entreEixos: '3800',
          tipoCarroceria: '',
          comprimento: '',
          largura: '',
          altura: '',
          capacidadeCarga: '',
        };
        
        setFormData(mockVeiculo);
      }, 500);
    }
  }, [isEditMode, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Aqui seria a chamada para a API para salvar o veículo
    toast({
      title: isEditMode ? "Veículo atualizado" : "Veículo cadastrado",
      description: `O veículo ${formData.placa} foi ${isEditMode ? 'atualizado' : 'cadastrado'} com sucesso!`,
    });
    
    // Redirecionar para a lista de veículos
    navigate('/veiculos');
  };

  return (
    <PageLayout>
      <PageHeader 
        title={isEditMode ? "Editar Veículo" : "Novo Veículo"} 
        description={isEditMode ? "Atualize os dados do veículo" : "Cadastre um novo veículo na frota"}
        icon={<Truck size={26} className="text-sistema-primary" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Veículos', href: '/veiculos' },
          { label: isEditMode ? 'Editar' : 'Novo' }
        ]}
        actions={
          <Button variant="outline" onClick={() => navigate('/veiculos')}>
            <ChevronLeft size={16} className="mr-2" />
            Voltar
          </Button>
        }
      />

      <div className="bg-white dark:bg-sistema-dark rounded-xl shadow-card border border-gray-100 dark:border-gray-800 p-6 mb-8 animate-fade-in">
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="geral" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6 w-96">
              <TabsTrigger value="geral">Dados Gerais</TabsTrigger>
              <TabsTrigger value="especifico">Dados Específicos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="geral" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="placa">Placa *</Label>
                  <Input
                    id="placa"
                    name="placa"
                    value={formData.placa}
                    onChange={handleChange}
                    placeholder="ABC-1234"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Veículo *</Label>
                  <Select 
                    value={formData.tipo} 
                    onValueChange={(value) => handleSelectChange('tipo', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cavalo">Cavalo Mecânico</SelectItem>
                      <SelectItem value="carreta">Carreta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="frota">Tipo de Frota *</Label>
                  <RadioGroup 
                    value={formData.frota} 
                    onValueChange={(value) => handleSelectChange('frota', value)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="propria" id="frota-propria" />
                      <Label htmlFor="frota-propria" className="cursor-pointer">Própria</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="terceirizada" id="frota-terceirizada" />
                      <Label htmlFor="frota-terceirizada" className="cursor-pointer">Terceirizada</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="modelo">Modelo *</Label>
                  <Input
                    id="modelo"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleChange}
                    placeholder="Ex: Scania R450"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="marca">Marca *</Label>
                  <Input
                    id="marca"
                    name="marca"
                    value={formData.marca}
                    onChange={handleChange}
                    placeholder="Ex: Scania, Volvo"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ano">Ano de Fabricação *</Label>
                  <Input
                    id="ano"
                    name="ano"
                    type="number"
                    value={formData.ano}
                    onChange={handleChange}
                    placeholder="Ex: 2023"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="chassi">Chassi *</Label>
                  <Input
                    id="chassi"
                    name="chassi"
                    value={formData.chassi}
                    onChange={handleChange}
                    placeholder="Ex: 9BWHE21JX24060031"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="renavam">Renavam *</Label>
                  <Input
                    id="renavam"
                    name="renavam"
                    value={formData.renavam}
                    onChange={handleChange}
                    placeholder="Ex: 123456789"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="combustivel">Combustível *</Label>
                  <Select 
                    value={formData.combustivel} 
                    onValueChange={(value) => handleSelectChange('combustivel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o combustível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="diesels10">Diesel S10</SelectItem>
                      <SelectItem value="gasolina">Gasolina</SelectItem>
                      <SelectItem value="etanol">Etanol</SelectItem>
                      <SelectItem value="flex">Flex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cor">Cor</Label>
                  <Input
                    id="cor"
                    name="cor"
                    value={formData.cor}
                    onChange={handleChange}
                    placeholder="Ex: Vermelho"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="capacidade">Capacidade (kg)</Label>
                  <Input
                    id="capacidade"
                    name="capacidade"
                    value={formData.capacidade}
                    onChange={handleChange}
                    placeholder="Ex: 45000"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  placeholder="Informações adicionais sobre o veículo"
                  rows={4}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="especifico" className="space-y-6">
              {formData.tipo === 'cavalo' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="potencia">Potência (cv)</Label>
                    <Input
                      id="potencia"
                      name="potencia"
                      value={formData.potencia}
                      onChange={handleChange}
                      placeholder="Ex: 450"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="torque">Torque (Nm)</Label>
                    <Input
                      id="torque"
                      name="torque"
                      value={formData.torque}
                      onChange={handleChange}
                      placeholder="Ex: 2300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="entreEixos">Entre-eixos (mm)</Label>
                    <Input
                      id="entreEixos"
                      name="entreEixos"
                      value={formData.entreEixos}
                      onChange={handleChange}
                      placeholder="Ex: 3800"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="tipoCarroceria">Tipo de Carroceria</Label>
                    <Select 
                      value={formData.tipoCarroceria} 
                      onValueChange={(value) => handleSelectChange('tipoCarroceria', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baú">Baú</SelectItem>
                        <SelectItem value="graneleira">Graneleira</SelectItem>
                        <SelectItem value="tanque">Tanque</SelectItem>
                        <SelectItem value="sider">Sider</SelectItem>
                        <SelectItem value="prancha">Prancha</SelectItem>
                        <SelectItem value="caçamba">Caçamba</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="comprimento">Comprimento (m)</Label>
                    <Input
                      id="comprimento"
                      name="comprimento"
                      value={formData.comprimento}
                      onChange={handleChange}
                      placeholder="Ex: 14.8"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="largura">Largura (m)</Label>
                    <Input
                      id="largura"
                      name="largura"
                      value={formData.largura}
                      onChange={handleChange}
                      placeholder="Ex: 2.6"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="altura">Altura (m)</Label>
                    <Input
                      id="altura"
                      name="altura"
                      value={formData.altura}
                      onChange={handleChange}
                      placeholder="Ex: 4.4"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="capacidadeCarga">Capacidade de Carga (kg)</Label>
                    <Input
                      id="capacidadeCarga"
                      name="capacidadeCarga"
                      value={formData.capacidadeCarga}
                      onChange={handleChange}
                      placeholder="Ex: 32000"
                    />
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 flex justify-end">
            <Button type="button" variant="outline" className="mr-2" onClick={() => navigate('/veiculos')}>
              Cancelar
            </Button>
            <Button type="submit">
              <Save size={16} className="mr-2" />
              {isEditMode ? "Atualizar" : "Cadastrar"} Veículo
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};

export default NovoVeiculoForm;
