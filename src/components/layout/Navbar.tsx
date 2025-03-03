
import React, { useState } from "react";
import { Bell, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  // Obter informações do usuário logado
  const usuarioString = sessionStorage.getItem('usuarioLogado');
  const usuario = usuarioString ? JSON.parse(usuarioString) : null;
  
  const getInitials = (name: string) => {
    if (!name) return "U";
    const words = name.split(" ");
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };
  
  const handleLogout = () => {
    // Remover dados da sessão
    sessionStorage.removeItem('usuarioLogado');
    sessionStorage.removeItem('adminGeral');
    
    // Redirecionar para a página de login
    toast.success('Logout realizado com sucesso');
    navigate('/login');
  };
  
  const handleConfiguracao = () => {
    navigate('/configuracoes');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-4">
          <div className="font-semibold text-lg">Controladoria</div>
          <div className="text-xs text-gray-500 hidden md:block">v1.0.0</div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Ícone de notificações */}
          <button className="relative rounded-full p-1 hover:bg-gray-100">
            <Bell className="h-6 w-6 text-gray-500" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
          </button>
          
          {/* Menu do usuário */}
          <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full p-1 hover:bg-gray-100">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-500 text-white">
                    {usuario?.nome ? getInitials(usuario.nome) : "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">
                  {usuario?.nome ? usuario.nome.split(' ')[0] : "Administrador"}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleConfiguracao} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
