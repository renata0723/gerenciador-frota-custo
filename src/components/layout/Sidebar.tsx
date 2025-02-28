
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Truck, 
  Users, 
  Clipboard, 
  Receipt, 
  CreditCard, 
  Fuel, 
  Wrench, 
  DollarSign, 
  BarChart,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
}

interface SidebarItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, isActive }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-4 py-3 rounded-md transition-all duration-200 group",
        isActive 
          ? "bg-sistema-primary text-white" 
          : "text-gray-300 hover:bg-sistema-accent"
      )}
    >
      <div className="mr-3">
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
      {isActive && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse-light"></div>
      )}
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { to: "/", label: "Dashboard", icon: <Home size={18} /> },
    { to: "/entrada-notas", label: "Entrada de Notas", icon: <FileText size={18} /> },
    { to: "/notas", label: "Notas", icon: <FileText size={18} /> },
    { to: "/veiculos", label: "Veículos", icon: <Truck size={18} /> },
    { to: "/motoristas", label: "Motoristas", icon: <Users size={18} /> },
    { to: "/contratos", label: "Contratos", icon: <Clipboard size={18} /> },
    { to: "/canhotos", label: "Canhotos", icon: <Receipt size={18} /> },
    { to: "/saldo-pagar", label: "Saldo a Pagar", icon: <CreditCard size={18} /> },
    { to: "/abastecimentos", label: "Abastecimentos", icon: <Fuel size={18} /> },
    { to: "/manutencao", label: "Manutenção", icon: <Wrench size={18} /> },
    { to: "/despesas", label: "Despesas", icon: <DollarSign size={18} /> },
    { to: "/relatorios", label: "Relatórios", icon: <BarChart size={18} /> },
    { to: "/configuracoes", label: "Configurações", icon: <Settings size={18} /> }
  ];

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-20 w-64 bg-sistema-dark flex flex-col transition-all duration-300 ease-in-out transform",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-sistema-primary to-sistema-accent bg-clip-text text-transparent">
            LogiFrota
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <SidebarItem
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
              isActive={
                item.to === "/" 
                  ? currentPath === "/" 
                  : currentPath.startsWith(item.to)
              }
            />
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center px-3 py-2 rounded-md bg-gray-800/50">
          <div className="w-8 h-8 rounded-full bg-sistema-primary flex items-center justify-center text-white mr-3">
            <Users size={16} />
          </div>
          <div>
            <div className="text-xs text-gray-400">Versão</div>
            <div className="text-sm font-medium text-white">1.0.0</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
