
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  Calculator,
  ChevronLeft,
  ChevronRight,
  BarChart2
} from 'lucide-react';

interface CollapsibleSidebarProps {
  children?: React.ReactNode;
}

const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({ children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  
  // Ao iniciar, definir como colapsado em telas não-móveis se não houver preferência salva
  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebar-collapsed');
    if (savedCollapsed !== null) {
      setCollapsed(savedCollapsed === 'true');
    } else if (!isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);
  
  // Salvar preferência
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(collapsed));
  }, [collapsed]);
  
  // Determine what page is active
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    { path: '/', icon: <LayoutDashboard className="h-5 w-5" />, text: 'Painel' },
    { path: '/entrada-notas', icon: <FileText className="h-5 w-5" />, text: 'Entrada de Notas' },
    { path: '/veiculos', icon: <Truck className="h-5 w-5" />, text: 'Veículos' },
    { path: '/motoristas', icon: <Users className="h-5 w-5" />, text: 'Motoristas' },
    { path: '/contratos', icon: <ClipboardList className="h-5 w-5" />, text: 'Contratos' },
    { path: '/canhotos', icon: <Receipt className="h-5 w-5" />, text: 'Canhotos' },
    { path: '/saldo-pagar', icon: <DollarSign className="h-5 w-5" />, text: 'Saldo a Pagar' },
    { path: '/abastecimentos', icon: <Fuel className="h-5 w-5" />, text: 'Abastecimentos' },
    { path: '/manutencao', icon: <Wrench className="h-5 w-5" />, text: 'Manutenção' },
    { path: '/despesas', icon: <BarChart3 className="h-5 w-5" />, text: 'Despesas Gerais' },
    { path: '/relatorios', icon: <BarChart2 className="h-5 w-5" />, text: 'Relatórios' },
    { path: '/contabilidade', icon: <Calculator className="h-5 w-5" />, text: 'Contabilidade' },
    { path: '/configuracoes', icon: <Settings className="h-5 w-5" />, text: 'Configurações' },
    { path: '/usuarios', icon: <Users className="h-5 w-5" />, text: 'Usuários' },
  ];

  return (
    <div className="flex h-screen">
      <aside 
        className={cn(
          "bg-slate-900 text-white fixed left-0 top-0 z-20 h-screen pt-16 transition-all duration-300 flex flex-col",
          {
            "w-16": collapsed && !isMobile,
            "w-60": !collapsed && !isMobile,
            "w-60": !collapsed && isMobile,
            "-translate-x-full": collapsed && isMobile,
          }
        )}
      >
        <div className="px-2 py-2 overflow-y-auto h-full flex flex-col">
          <nav className="space-y-1 mt-4 flex-1">
            {menuItems.map((item) => (
              <TooltipProvider key={item.path} delayDuration={500}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to={item.path} className="block">
                      <Button 
                        variant="ghost" 
                        className={cn(
                          "w-full justify-start text-white hover:bg-slate-800 hover:text-white",
                          isActive(item.path) && "bg-slate-800 text-white",
                          collapsed && !isMobile ? "px-3" : "px-3"
                        )}
                      >
                        {item.icon}
                        {(!collapsed || isMobile) && <span className="ml-2">{item.text}</span>}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {collapsed && !isMobile && (
                    <TooltipContent side="right">
                      {item.text}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}
          </nav>
          
          <div className={cn("px-3 py-2", collapsed && !isMobile && "hidden")}>
            <div className="bg-slate-800 p-3 rounded-md text-sm">
              <h3 className="font-medium flex items-center">
                <BellRing className="h-4 w-4 mr-2" /> Versão
              </h3>
              <p className="text-slate-400 mt-1">1.0.0</p>
            </div>
          </div>
        </div>
      </aside>
      
      <div 
        className={cn(
          "fixed top-1/2 -translate-y-1/2 z-30 transition-all duration-300",
          {
            "left-16": collapsed && !isMobile,
            "left-60": !collapsed && !isMobile,
            "left-0": isMobile,
          }
        )}
      >
        <Button
          variant="secondary"
          size="sm"
          className="h-8 w-8 p-0 rounded-full shadow-md bg-white text-slate-800 border border-slate-200"
          onClick={toggleSidebar}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <main 
        className={cn(
          "flex-1 transition-all duration-300 pt-16",
          {
            "ml-16": collapsed && !isMobile,
            "ml-60": !collapsed && !isMobile,
            "ml-0": isMobile,
          }
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default CollapsibleSidebar;
