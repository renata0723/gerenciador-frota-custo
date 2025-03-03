
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMobile } from '@/hooks/use-mobile';
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  FileText, 
  Truck, 
  User, 
  FileContract, 
  MapPin, 
  FileCheck, 
  DollarSign, 
  Droplet, 
  ClipboardList, 
  Tool, 
  BarChartBig, 
  Settings,
  Database
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const isMobile = useMobile();
  const [collapsed, setCollapsed] = useState(false);
  
  // Verificar se estamos em uma rota de tela cheia
  const isFullScreenRoute = location.pathname === '/tv-dashboard' || location.pathname === '/not-found';
  
  // Se estiver em uma rota de tela cheia, não renderizar o sidebar
  if (isFullScreenRoute) {
    return null;
  }
  
  // Em dispositivos móveis, sempre mostrar o sidebar colapsado
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

  // Função para alternar o estado do sidebar
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Lista de itens do menu
  const menuItems = [
    { href: '/', icon: <Home size={20} />, text: 'Dashboard' },
    { href: '/entrada-notas', icon: <FileText size={20} />, text: 'Entrada de Notas' },
    { href: '/veiculos', icon: <Truck size={20} />, text: 'Veículos' },
    { href: '/motoristas', icon: <User size={20} />, text: 'Motoristas' },
    { href: '/contratos', icon: <FileContract size={20} />, text: 'Contratos' },
    { href: '/buscar-contrato', icon: <MapPin size={20} />, text: 'Rastreamento' },
    { href: '/canhotos', icon: <FileCheck size={20} />, text: 'Canhotos' },
    { href: '/saldo-pagar', icon: <DollarSign size={20} />, text: 'Saldo a Pagar' },
    { href: '/abastecimentos', icon: <Droplet size={20} />, text: 'Abastecimentos' },
    { href: '/despesas', icon: <ClipboardList size={20} />, text: 'Despesas Gerais' },
    { href: '/manutencao', icon: <Tool size={20} />, text: 'Manutenção' },
    { href: '/veiculos/relatorios', icon: <BarChartBig size={20} />, text: 'Relatórios' },
    { href: '/configuracoes', icon: <Settings size={20} />, text: 'Configurações' },
    { href: '/utilitarios', icon: <Database size={20} />, text: 'Utilitários' },
  ];

  // Classe do container do sidebar
  const sidebarClass = cn(
    "bg-white dark:bg-gray-900 h-screen fixed left-0 top-0 z-30 transition-all duration-300 border-r border-gray-200 dark:border-gray-800 pt-16",
    collapsed ? "w-[60px]" : "w-[240px]"
  );

  return (
    <>
      <div className={sidebarClass}>
        <div className="flex flex-col h-full">
          <div className="flex-1 py-4 overflow-y-auto scrollbar-hide">
            <ul className="space-y-1 px-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.href;
                
                return (
                  <li key={item.href}>
                    <Link 
                      to={item.href}
                      className={cn(
                        "flex items-center p-2 rounded-md text-sm font-medium transition-colors",
                        isActive 
                          ? "bg-sistema-primary text-white" 
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                        collapsed && "justify-center"
                      )}
                    >
                      <span className={cn(
                        "flex-shrink-0",
                        isActive ? "text-white" : "text-gray-500 dark:text-gray-400"
                      )}>
                        {item.icon}
                      </span>
                      {!collapsed && (
                        <span className="ml-3 truncate">{item.text}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          
          {!isMobile && (
            <div className="p-2 border-t border-gray-200 dark:border-gray-800">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={toggleSidebar}
                className={cn(
                  "w-full justify-center",
                  !collapsed && "justify-between"
                )}
              >
                {collapsed ? (
                  <ChevronRight size={20} />
                ) : (
                  <>
                    <span>Recolher</span>
                    <ChevronLeft size={20} />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Spacing div to push content */}
      <div className={cn(
        "transition-all duration-300",
        collapsed ? "ml-[60px]" : "ml-[240px]"
      )} />
    </>
  );
};

export default Sidebar;
