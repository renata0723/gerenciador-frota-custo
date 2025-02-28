
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, User, ChevronDown, Settings, LogOut, Menu, Tv } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  showProjectionButton?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, isSidebarOpen, showProjectionButton = false }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-sistema-dark border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 transition-all duration-300 animate-slide-down">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e botão do menu */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="mr-4 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
              aria-label="Toggle sidebar"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-sistema-primary to-sistema-accent bg-clip-text text-transparent">
                LogiFrota
              </span>
            </Link>
          </div>

          {/* Ações do header */}
          <div className="flex items-center space-x-4">
            {/* Notificações */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-full text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors duration-200"
                aria-label="Notifications"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Dropdown de notificações */}
              {notificationsOpen && (
                <div className="dropdown-content animate-fade-in w-72">
                  <div className="py-2 px-4 text-sm font-medium border-b dark:border-gray-700">
                    Notificações
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                      <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">Nova manutenção agendada</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Veículo ABC-1234 - Hoje às 14:00</p>
                    </div>
                    <div className="p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                      <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">Contrato finalizado</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Contrato #12345 - 30 minutos atrás</p>
                    </div>
                    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                      <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">Entrega atrasada</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Nota #789 - 2 horas atrás</p>
                    </div>
                  </div>
                  <div className="py-2 px-4 text-center border-t dark:border-gray-700">
                    <button className="text-sm text-sistema-primary hover:text-sistema-primary-dark transition-colors duration-200">
                      Ver todas as notificações
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Menu de usuário */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none transition-colors duration-200"
                aria-label="User menu"
              >
                <div className="w-8 h-8 rounded-full bg-sistema-primary flex items-center justify-center text-white">
                  <User size={18} />
                </div>
                <span className="hidden sm:block text-sm font-medium">Administrador</span>
                <ChevronDown size={16} className={cn("transition-transform duration-200", userMenuOpen && "rotate-180")} />
              </button>

              {/* Dropdown de usuário */}
              {userMenuOpen && (
                <div className="dropdown-content animate-fade-in">
                  <Link
                    to="/configuracoes"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <Settings size={16} className="mr-2" />
                      <span>Configurações</span>
                    </div>
                  </Link>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <LogOut size={16} className="mr-2" />
                      <span>Sair</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
