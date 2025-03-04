
import React, { Suspense } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import EntradaNotas from "./pages/EntradaNotas";
import NovaNotaForm from "./pages/NovaNotaForm";
import Veiculos from "./pages/Veiculos";
import NovoVeiculoForm from "./pages/NovoVeiculoForm";
import RelatoriosVeiculos from "./pages/RelatoriosVeiculos";
import Motoristas from "./pages/Motoristas";
import Contratos from "./pages/Contratos";
import Abastecimentos from "./pages/Abastecimentos";
import DespesasGerais from "./pages/DespesasGerais";
import NovaDespesaForm from "./pages/NovaDespesaForm";
import Manutencao from "./pages/Manutencao";
import BuscarContrato from "./pages/BuscarContrato";
import Canhotos from "./pages/Canhotos";
import SaldoPagar from "./pages/SaldoPagar";
import NovoContratoForm from "./pages/NovoContratoForm";
import TVDashboard from "./pages/TVDashboard";
import ConfiguracoesEmpresa from "./pages/ConfiguracoesEmpresa";
import NotFound from "./pages/NotFound";
import Utilitarios from "./pages/Utilitarios";
import Relatorios from "./pages/Relatorios";
import Contabilidade from "./pages/Contabilidade";
import LancamentosContabeis from "./pages/contabilidade/LancamentosContabeis";
import PlanoContas from "./pages/contabilidade/PlanoContas";
import BalancoPatrimonial from "./pages/contabilidade/BalancoPatrimonial";
import DRE from "./pages/contabilidade/DRE";
import LivroCaixa from "./pages/contabilidade/LivroCaixa";
import Login from "./pages/Login";
import Usuarios from "./pages/Usuarios";
// import AuthGuard from "./components/auth/AuthGuard"; // Comentado durante o desenvolvimento
import FolhaPagamento from "./pages/contabilidade/FolhaPagamento";
import Balancete from "./pages/contabilidade/Balancete";
import RelatoriosContabeis from "./pages/contabilidade/RelatoriosContabeis";
import FechamentoFiscal from "./pages/contabilidade/FechamentoFiscal";
import ConciliacaoBancaria from "./pages/contabilidade/ConciliacaoBancaria";

// Lazy load the ApuracaoCustoResultado components
const LazyApuracaoCustoResultado = React.lazy(() => import('./pages/contabilidade/ApuracaoCustoResultado'));
const LazyApuracaoCustoResultadoDetalhes = React.lazy(() => import('./pages/contabilidade/ApuracaoCustoResultadoDetalhes'));

import "./App.css";

const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Componente temporário para simular AuthGuard durante o desenvolvimento
const DevModeWrapper = ({ children }) => {
  // Simular usuário logado para desenvolvimento
  React.useEffect(() => {
    // Dados do usuário de teste
    const adminTestUser = {
      id: 9999,
      nome: 'Administrador',
      email: 'admin@slog.com.br',
      cargo: 'Administrador',
      status: 'ativo',
      ultimo_acesso: new Date().toISOString()
    };
    
    // Verificar se já existe informação no localStorage
    if (!localStorage.getItem('userData')) {
      localStorage.setItem('userData', JSON.stringify(adminTestUser));
      localStorage.setItem('userToken', 'token-simulado-dev');
      localStorage.setItem('userName', adminTestUser.nome);
      localStorage.setItem('userId', String(adminTestUser.id));
      localStorage.setItem('userEmail', adminTestUser.email);
      
      console.log('Modo de desenvolvimento: usuário simulado criado');
    }
  }, []);
  
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Rotas sem proteção de autenticação durante o desenvolvimento */}
        <Route path="/" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><Index /></Suspense></DevModeWrapper>} />
        
        {/* Notas Fiscais */}
        <Route path="/notas" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><EntradaNotas /></Suspense></DevModeWrapper>} />
        <Route path="/entrada-notas" element={<Navigate to="/notas" replace />} />
        <Route path="/notas/nova" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><NovaNotaForm /></Suspense></DevModeWrapper>} />
        <Route path="/entrada-notas/nova" element={<Navigate to="/notas/nova" replace />} />
        <Route path="/notas/editar/:id" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><NovaNotaForm /></Suspense></DevModeWrapper>} />
        <Route path="/entrada-notas/editar/:id" element={<Navigate to="/notas/editar/:id" replace />} />
        
        {/* Veículos */}
        <Route path="/veiculos" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><Veiculos /></Suspense></DevModeWrapper>} />
        <Route path="/veiculos/novo" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><NovoVeiculoForm /></Suspense></DevModeWrapper>} />
        <Route path="/veiculos/relatorios" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><RelatoriosVeiculos /></Suspense></DevModeWrapper>} />
        
        {/* Motoristas */}
        <Route path="/motoristas" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><Motoristas /></Suspense></DevModeWrapper>} />
        
        {/* Contratos */}
        <Route path="/contratos" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><Contratos /></Suspense></DevModeWrapper>} />
        <Route path="/contratos/novo" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><NovoContratoForm /></Suspense></DevModeWrapper>} />
        <Route path="/contratos/editar/:id" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><NovoContratoForm /></Suspense></DevModeWrapper>} />
        
        {/* Abastecimentos */}
        <Route path="/abastecimentos" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><Abastecimentos /></Suspense></DevModeWrapper>} />
        
        {/* Despesas */}
        <Route path="/despesas" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><DespesasGerais /></Suspense></DevModeWrapper>} />
        <Route path="/despesas/nova" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><NovaDespesaForm /></Suspense></DevModeWrapper>} />
        
        {/* Manutenção */}
        <Route path="/manutencao" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><Manutencao /></Suspense></DevModeWrapper>} />
        
        {/* Canhotos */}
        <Route path="/buscar-contrato" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><BuscarContrato /></Suspense></DevModeWrapper>} />
        <Route path="/canhotos" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><Canhotos /></Suspense></DevModeWrapper>} />
        
        {/* Saldo a Pagar */}
        <Route path="/saldo-pagar" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><SaldoPagar /></Suspense></DevModeWrapper>} />
        
        {/* Relatórios */}
        <Route path="/relatorios" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><Relatorios /></Suspense></DevModeWrapper>} />
        <Route path="/tv-dashboard" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><TVDashboard /></Suspense></DevModeWrapper>} />
        
        {/* Configurações */}
        <Route path="/configuracoes" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><ConfiguracoesEmpresa /></Suspense></DevModeWrapper>} />
        <Route path="/utilitarios" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><Utilitarios /></Suspense></DevModeWrapper>} />
        <Route path="/usuarios" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><Usuarios /></Suspense></DevModeWrapper>} />
        
        {/* Módulo de Contabilidade */}
        <Route path="/contabilidade" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><Contabilidade /></Suspense></DevModeWrapper>} />
        <Route path="/contabilidade/lancamentos" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><LancamentosContabeis /></Suspense></DevModeWrapper>} />
        <Route path="/contabilidade/plano-contas" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><PlanoContas /></Suspense></DevModeWrapper>} />
        <Route path="/contabilidade/balanco" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><BalancoPatrimonial /></Suspense></DevModeWrapper>} />
        <Route path="/contabilidade/dre" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><DRE /></Suspense></DevModeWrapper>} />
        <Route path="/contabilidade/livro-caixa" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><LivroCaixa /></Suspense></DevModeWrapper>} />
        <Route path="/contabilidade/folha-pagamento" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><FolhaPagamento /></Suspense></DevModeWrapper>} />
        <Route path="/folha-pagamento" element={<Navigate to="/contabilidade/folha-pagamento" replace />} />
        <Route path="/contabilidade/apuracao-custo-resultado" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><LazyApuracaoCustoResultado /></Suspense></DevModeWrapper>} />
        <Route path="/contabilidade/apuracao/:id" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><LazyApuracaoCustoResultadoDetalhes /></Suspense></DevModeWrapper>} />
        <Route path="/contabilidade/balancete" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><Balancete /></Suspense></DevModeWrapper>} />
        <Route path="/contabilidade/relatorios" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><RelatoriosContabeis /></Suspense></DevModeWrapper>} />
        <Route path="/contabilidade/fechamento-fiscal" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><FechamentoFiscal /></Suspense></DevModeWrapper>} />
        <Route path="/contabilidade/conciliacao-bancaria" element={<DevModeWrapper><Suspense fallback={<LoadingFallback />}><ConciliacaoBancaria /></Suspense></DevModeWrapper>} />
        
        {/* Página de erro */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
