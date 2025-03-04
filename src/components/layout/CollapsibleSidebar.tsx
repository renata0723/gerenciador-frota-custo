
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  FileText, 
  Truck, 
  UserCheck, 
  DollarSign, 
  CreditCard, 
  BarChart2, 
  Settings, 
  Database, 
  FileCheck, 
  Calendar, 
  LayoutDashboard, 
  User, 
  FolderClosed, 
  ReceiptText,
  Fuel,
  Wrench
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Navbar from './Navbar';

interface SidebarLinkProps {
  icon: React.ReactNode;
  href: string;
  label: string;
  isCollapsed: boolean;
  isActive: boolean;
}

const SidebarLink = ({ icon, href, label, isCollapsed, isActive }: SidebarLinkProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors",
        isActive && "bg-gray-100 text-blue-700 font-medium",
        isCollapsed ? "justify-center" : ""
      )}
    >
      <div className={isCollapsed ? "mx-auto" : "mr-3"}>{icon}</div>
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );
};

interface CollapsibleSidebarProps {
  children: React.ReactNode;
}

const CollapsibleSidebar = ({ children }: CollapsibleSidebarProps) => {
  // Começar sempre expandido (não colapsado)
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  
  // Persistir o estado no localStorage
  useEffect(() => {
    const storedState = localStorage.getItem('sidebarCollapsed');
    if (storedState !== null) {
      setIsCollapsed(storedState === 'true');
    } else {
      // Se não existe no localStorage, definir como expandido por padrão
      localStorage.setItem('sidebarCollapsed', 'false');
    }
  }, []);
  
  // Quando o estado mudar, salvar no localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
  }, [isCollapsed]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarLinks = [
    { icon: <Home size={20} />, href: "/", label: "Dashboard" },
    { icon: <FileText size={20} />, href: "/notas", label: "Notas Fiscais" },
    { icon: <FileText size={20} />, href: "/contratos", label: "Contratos" },
    { icon: <FileCheck size={20} />, href: "/canhotos", label: "Canhotos" },
    { icon: <Truck size={20} />, href: "/veiculos", label: "Veículos" },
    { icon: <User size={20} />, href: "/motoristas", label: "Motoristas" },
    { icon: <Fuel size={20} />, href: "/abastecimentos", label: "Abastecimentos" },
    { icon: <Wrench size={20} />, href: "/manutencao", label: "Manutenção" },
    { icon: <DollarSign size={20} />, href: "/despesas", label: "Despesas Gerais" },
    { icon: <CreditCard size={20} />, href: "/saldo-pagar", label: "Saldo a Pagar" },
    { icon: <BarChart2 size={20} />, href: "/relatorios", label: "Relatórios" },
    { icon: <ReceiptText size={20} />, href: "/contabilidade", label: "Contabilidade" },
    { icon: <Calendar size={20} />, href: "/folha-pagamento", label: "Folha de Pagamento" },
    { icon: <UserCheck size={20} />, href: "/usuarios", label: "Usuários" },
    { icon: <Settings size={20} />, href: "/configuracoes", label: "Configurações" },
    { icon: <Database size={20} />, href: "/utilitarios", label: "Utilitários" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo/Brand */}
        <div className={cn(
          "h-16 flex items-center px-4 border-b border-gray-200",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isCollapsed && (
            <Link to="/" className="flex items-center">
              <LayoutDashboard className="h-6 w-6 text-blue-600" />
              <span className="ml-2 font-bold text-lg text-gray-900">ControlFrota</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="h-8 w-8"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4 px-3 overflow-y-auto">
          <div className="space-y-1">
            {sidebarLinks.map((link, index) => (
              <React.Fragment key={link.href}>
                <SidebarLink
                  icon={link.icon}
                  href={link.href}
                  label={link.label}
                  isCollapsed={isCollapsed}
                  isActive={location.pathname === link.href || location.pathname.startsWith(`${link.href}/`)}
                />
                {(index === 1 || index === 9 || index === 13) && (
                  <Separator className="my-3" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CollapsibleSidebar;
