
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export interface MotoristaData {
  nome: string;
  cpf: string;
  cnh: string;
  categoriaCnh: string;
  vencimentoCnh: string;
  telefone: string;
  endereco: string;
  dataNascimento: string;
  dataContratacao: string;
  status: 'active' | 'inactive';
  observacoes: string;
}

interface MotoristaFormProps {
  onSave: (data: MotoristaData) => void;
  onCancel: () => void;
  initialData?: Partial<MotoristaData>;
}

const MotoristaForm: React.FC<MotoristaFormProps> = ({
  onSave,
  onCancel,
  initialData
}) => {
  const [formData, setFormData] = useState<MotoristaData>({
    nome: initialData?.nome || '',
    cpf: initialData?.cpf || '',
    cnh: initialData?.cnh || '',
    categoriaCnh: initialData?.categoriaCnh || 'E',
    vencimentoCnh: initialData?.vencimentoCnh || '',
    telefone: initialData?.telefone || '',
    endereco: initialData?.endereco || '',
    dataNascimento: initialData?.dataNascimento || '',
    dataContratacao: initialData?.dataContratacao || '',
    status: initialData?.status || 'active',
    observacoes: initialData?.observacoes || ''
  });

  const [tipoFormulario, setTipoFormulario] = useState<'simples' | 'completo'>('simples');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: keyof MotoristaData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.nome || !formData.cpf) {
      toast.error('Nome e CPF são campos obrigatórios');
      return;
    }
    
    if (tipoFormulario === 'completo' && (!formData.cnh || !formData.vencimentoCnh)) {
      toast.error('CNH e data de vencimento são obrigatórios no cadastro completo');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="space-y-4">
      <Tabs 
        defaultValue="simples" 
        value={tipoFormulario} 
        onValueChange={(value) => setTipoFormulario(value as 'simples' | 'completo')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="simples">Cadastro Simples</TabsTrigger>
          <TabsTrigger value="completo">Cadastro Completo</TabsTrigger>
        </TabsList>
        
        <form onSubmit={handleSubmit}>
          <TabsContent value="simples" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="completo" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="cnh">CNH *</Label>
                <Input
                  id="cnh"
                  name="cnh"
                  value={formData.cnh}
                  onChange={handleChange}
                  required={tipoFormulario === 'completo'}
                />
              </div>
              
              <div>
                <Label htmlFor="categoriaCnh">Categoria CNH *</Label>
                <Select 
                  value={formData.categoriaCnh} 
                  onValueChange={(value) => handleSelectChange('categoriaCnh', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                    <SelectItem value="AB">AB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="vencimentoCnh">Vencimento CNH *</Label>
                <Input
                  id="vencimentoCnh"
                  name="vencimentoCnh"
                  type="date"
                  value={formData.vencimentoCnh}
                  onChange={handleChange}
                  required={tipoFormulario === 'completo'}
                />
              </div>
              
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                />
              </div>
              
              <div>
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  name="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <Label htmlFor="dataContratacao">Data de Contratação</Label>
                <Input
                  id="dataContratacao"
                  name="dataContratacao"
                  type="date"
                  value={formData.dataContratacao}
                  onChange={handleChange}
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="endereco">Endereço Completo</Label>
                <Input
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange('status', value as 'active' | 'inactive')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  name="observacoes"
                  rows={3}
                  value={formData.observacoes}
                  onChange={handleChange}
                />
              </div>
            </div>
          </TabsContent>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {tipoFormulario === 'simples' ? 'Salvar Cadastro Simples' : 'Salvar Cadastro Completo'}
            </Button>
          </DialogFooter>
        </form>
      </Tabs>
    </div>
  );
};

export default MotoristaForm;
