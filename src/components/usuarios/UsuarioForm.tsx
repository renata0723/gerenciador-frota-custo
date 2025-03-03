
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusUsuario, Usuario } from "@/types/usuario";
import { toast } from "sonner";

interface UsuarioFormProps {
  onSave: (usuario: Usuario) => void;
  initialData?: Usuario;
}

const UsuarioForm: React.FC<UsuarioFormProps> = ({
  onSave,
  initialData
}) => {
  const [formData, setFormData] = useState<Usuario>({
    nome: '',
    email: '',
    senha: '',
    cargo: '',
    status: 'ativo'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        senha: '' // Não mostrar senha atual por segurança
      });
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (value: StatusUsuario) => {
    setFormData(prev => ({
      ...prev,
      status: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email) {
      toast.error('Nome e e-mail são obrigatórios');
      return;
    }
    
    // Se for novo usuário (sem ID) e não tiver senha
    if (!initialData?.id && !formData.senha) {
      toast.error('Senha é obrigatória para novos usuários');
      return;
    }
    
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome*</Label>
        <Input
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">E-mail*</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="senha">{initialData?.id ? 'Nova Senha (opcional)' : 'Senha*'}</Label>
        <Input
          id="senha"
          name="senha"
          type="password"
          value={formData.senha}
          onChange={handleInputChange}
          required={!initialData?.id}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="cargo">Cargo</Label>
        <Input
          id="cargo"
          name="cargo"
          value={formData.cargo}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => handleStatusChange(value as StatusUsuario)}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
            <SelectItem value="bloqueado">Bloqueado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button type="submit" className="w-full">
        {initialData?.id ? 'Atualizar Usuário' : 'Criar Usuário'}
      </Button>
    </form>
  );
};

export default UsuarioForm;
