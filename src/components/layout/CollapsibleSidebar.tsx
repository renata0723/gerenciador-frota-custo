import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, FileText, DollarSign, TrendingUp, Package, Activity, Truck, User, Settings, BarChart2, Calendar, Database, Warehouse } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  active?: boolean;
  children?: SidebarItem[];
}

interface CollapsibleSidebarProps {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}

const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({ children, defaultCollapsed = false }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showMenu, setShowMenu] = useState(true);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      setShowMenu(false);
    }
  }, [location.pathname, isMobile]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    if (isMobile) {
      setShowMenu(!showMenu);
    }
  };

  const sidebarItems: SidebarItem[] = [
    { label: 'Dashboard', icon: <BarChart2 size={20} />, href: '/' },
    { label: 'Contratos', icon: <FileText size={20} />, href: '/contratos' },
    { label: 'Entrada de Notas', icon: <Package size={20} />, href: '/notas/entrada' },
    { label: 'Veículos', icon: <Truck size={20} />, href: '/veiculos' },
    { label: 'Motoristas', icon: <User size={20} />, href: '/motoristas' },
    { label: 'Manutenção', icon: <Activity size={20} />, href: '/manutencao' },
    { label: 'Abastecimentos', icon: <TrendingUp size={20} />, href: '/abastecimentos' },
    { label: 'Despesas Gerais', icon: <DollarSign size={20} />, href: '/despesas' },
    { label: 'Canhotos', icon: <Calendar size={20} />, href: '/canhotos' },
    { label: 'Saldo a Pagar', icon: <DollarSign size={20} />, href: '/saldo-pagar' },
    { label: 'Contabilidade', icon: <Database size={20} />, href: '/contabilidade' },
    { label: 'Relatórios', icon: <BarChart2 size={20} />, href: '/relatorios' },
    { label: 'Estoque', icon: <Warehouse size={20} />, href: '/estoque' },
    { label: 'Configurações', icon: <Settings size={20} />, href: '/configuracoes' },
    { label: 'Usuários', icon: <User size={20} />, href: '/usuarios' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {isMobile && showMenu && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}

      <aside 
        className={cn(
          "bg-white border-r border-border transition-all duration-300 z-50",
          collapsed ? "w-[70px]" : "w-[250px]",
          isMobile && "fixed h-full",
          isMobile && !showMenu && "transform -translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setCollapsed(!collapsed)}
              className="h-8 w-8"
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </Button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {sidebarItems.map((item, index) => (
                <li key={index}>
                  {collapsed ? (
                    <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <Button
                            variant={location.pathname === item.href ? "default" : "ghost"}
                            className="w-full justify-center h-10"
                            onClick={() => navigate(item.href)}
                          >
                            {item.icon}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <Button
                      variant={location.pathname === item.href ? "default" : "ghost"}
                      className="w-full justify-start h-10"
                      onClick={() => navigate(item.href)}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      <main className={cn(
        "flex-1 overflow-y-auto transition-all duration-300",
        isMobile && "w-full"
      )}>
        {children}
      </main>
    </div>
  );
};

export default CollapsibleSidebar;
