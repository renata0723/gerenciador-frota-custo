
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  LayoutDashboard, 
  FileText, 
  Truck, 
  Users, 
  ClipboardList, 
  Receipt, 
  DollarSign, 
  Fuel, 
  Wrench, 
  BarChart3,
  FileDown,
  Settings,
  BellRing,
  Plus,
  Loader2,
  BarChart2,
  Calculator
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
}

const Sidebar = ({ isOpen = true }: SidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Determine what page is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside 
      className={cn(
        "bg-slate-900 text-white h-screen w-60 fixed left-0 top-0 pt-16 transition-all duration-300",
        {
          "w-0 -translate-x-full": isMobile && !isOpen,
          "translate-x-0": !isMobile || isOpen,
        }
      )}
    >
      <div className="px-3 py-2 overflow-y-auto h-full">
        <nav className="space-y-1 mt-4">
          <Link to="/" className="block">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start text-white hover:bg-slate-800 hover:text-white",
                isActive('/') && "bg-slate-800 text-white"
              )}
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
          </Link>
          
          <Link to="/entrada-notas" className="block">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start text-white hover:bg-slate-800 hover:text-white",
                isActive('/entrada-notas') && "bg-slate-800 text-white"
              )}
            >
              <FileText className="mr-2 h-5 w-5" />
              Entrada de Notas
            </Button>
          </Link>
          
          <Link to="/veiculos" className="block">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start text-white hover:bg-slate-800 hover:text-white",
                isActive('/veiculos') && "bg-slate-800 text-white"
              )}
            >
              <Truck className="mr-2 h-5 w-5" />
              Veículos
            </Button>
          </Link>
          
          <Link to="/motoristas" className="block">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start text-white hover:bg-slate-800 hover:text-white",
                isActive('/motoristas') && "bg-slate-800 text-white"
              )}
            >
              <Users className="mr-2 h-5 w-5" />
              Motoristas
            </Button>
          </Link>
          
          <Link to="/contratos" className="block">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start text-white hover:bg-slate-800 hover:text-white",
                isActive('/contratos') && "bg-slate-800 text-white"
              )}
            >
              <ClipboardList className="mr-2 h-5 w-5" />
              Contratos
            </Button>
          </Link>
          
          <Link to="/canhotos" className="block">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start text-white hover:bg-slate-800 hover:text-white",
                isActive('/canhotos') && "bg-slate-800 text-white"
              )}
            >
              <Receipt className="mr-2 h-5 w-5" />
              Canhotos
            </Button>
          </Link>
          
          <Link to="/saldo-pagar" className="block">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start text-white hover:bg-slate-800 hover:text-white",
                isActive('/saldo-pagar') && "bg-slate-800 text-white"
              )}
            >
              <DollarSign className="mr-2 h-5 w-5" />
              Saldo a Pagar
            </Button>
          </Link>
          
          <Link to="/abastecimentos" className="block">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start text-white hover:bg-slate-800 hover:text-white",
                isActive('/abastecimentos') && "bg-slate-800 text-white"
              )}
            >
              <Fuel className="mr-2 h-5 w-5" />
              Abastecimentos
            </Button>
          </Link>
          
          <Link to="/manutencao" className="block">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start text-white hover:bg-slate-800 hover:text-white",
                isActive('/manutencao') && "bg-slate-800 text-white"
              )}
            >
              <Wrench className="mr-2 h-5 w-5" />
              Manutenção
            </Button>
          </Link>
          
          <Link to="/despesas" className="block">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start text-white hover:bg-slate-800 hover:text-white",
                isActive('/despesas') && "bg-slate-800 text-white"
              )}
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              Despesas Gerais
            </Button>
          </Link>
          
          <Link to="/relatorios" className="block">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start text-white hover:bg-slate-800 hover:text-white",
                isActive('/relatorios') && "bg-slate-800 text-white"
              )}
            >
              <BarChart2 className="mr-2 h-5 w-5" />
              Relatórios
            </Button>
          </Link>
          
          <Link to="/contabilidade" className="block">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start text-white hover:bg-slate-800 hover:text-white",
                isActive('/contabilidade') && "bg-slate-800 text-white"
              )}
            >
              <Calculator className="mr-2 h-5 w-5" />
              Contabilidade
            </Button>
          </Link>
          
          <Link to="/utilitarios" className="block">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start text-white hover:bg-slate-800 hover:text-white",
                isActive('/utilitarios') && "bg-slate-800 text-white"
              )}
            >
              <Wrench className="mr-2 h-5 w-5" />
              Utilitários
            </Button>
          </Link>
          
          <Link to="/configuracoes" className="block">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start text-white hover:bg-slate-800 hover:text-white",
                isActive('/configuracoes') && "bg-slate-800 text-white"
              )}
            >
              <Settings className="mr-2 h-5 w-5" />
              Configurações
            </Button>
          </Link>
        </nav>
        
        <div className="absolute bottom-5 left-0 right-0 px-3">
          <div className="bg-slate-800 p-3 rounded-md text-sm">
            <h3 className="font-medium flex items-center">
              <BellRing className="h-4 w-4 mr-2" /> Versão
            </h3>
            <p className="text-slate-400 mt-1">1.0.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
