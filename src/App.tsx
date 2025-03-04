
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
import AuthGuard from "./components/auth/AuthGuard";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        
        {/* Rotas protegidas */}
        <Route path="/" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><Index /></Suspense></AuthGuard>} />
        
        {/* Notas Fiscais */}
        <Route path="/notas" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><EntradaNotas /></Suspense></AuthGuard>} />
        <Route path="/entrada-notas" element={<Navigate to="/notas" replace />} />
        <Route path="/notas/nova" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><NovaNotaForm /></Suspense></AuthGuard>} />
        <Route path="/entrada-notas/nova" element={<Navigate to="/notas/nova" replace />} />
        <Route path="/notas/editar/:id" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><NovaNotaForm /></Suspense></AuthGuard>} />
        <Route path="/entrada-notas/editar/:id" element={<Navigate to="/notas/editar/:id" replace />} />
        
        {/* Veículos */}
        <Route path="/veiculos" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><Veiculos /></Suspense></AuthGuard>} />
        <Route path="/veiculos/novo" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><NovoVeiculoForm /></Suspense></AuthGuard>} />
        <Route path="/veiculos/relatorios" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><RelatoriosVeiculos /></Suspense></AuthGuard>} />
        
        {/* Motoristas */}
        <Route path="/motoristas" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><Motoristas /></Suspense></AuthGuard>} />
        
        {/* Contratos */}
        <Route path="/contratos" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><Contratos /></Suspense></AuthGuard>} />
        <Route path="/contratos/novo" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><NovoContratoForm /></Suspense></AuthGuard>} />
        <Route path="/contratos/editar/:id" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><NovoContratoForm /></Suspense></AuthGuard>} />
        
        {/* Abastecimentos */}
        <Route path="/abastecimentos" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><Abastecimentos /></Suspense></AuthGuard>} />
        
        {/* Despesas */}
        <Route path="/despesas" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><DespesasGerais /></Suspense></AuthGuard>} />
        <Route path="/despesas/nova" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><NovaDespesaForm /></Suspense></AuthGuard>} />
        
        {/* Manutenção */}
        <Route path="/manutencao" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><Manutencao /></Suspense></AuthGuard>} />
        
        {/* Canhotos */}
        <Route path="/buscar-contrato" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><BuscarContrato /></Suspense></AuthGuard>} />
        <Route path="/canhotos" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><Canhotos /></Suspense></AuthGuard>} />
        
        {/* Saldo a Pagar */}
        <Route path="/saldo-pagar" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><SaldoPagar /></Suspense></AuthGuard>} />
        
        {/* Relatórios */}
        <Route path="/relatorios" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><Relatorios /></Suspense></AuthGuard>} />
        <Route path="/tv-dashboard" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><TVDashboard /></Suspense></AuthGuard>} />
        
        {/* Configurações */}
        <Route path="/configuracoes" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><ConfiguracoesEmpresa /></Suspense></AuthGuard>} />
        <Route path="/utilitarios" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><Utilitarios /></Suspense></AuthGuard>} />
        <Route path="/usuarios" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><Usuarios /></Suspense></AuthGuard>} />
        
        {/* Módulo de Contabilidade */}
        <Route path="/contabilidade" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><Contabilidade /></Suspense></AuthGuard>} />
        <Route path="/contabilidade/lancamentos" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><LancamentosContabeis /></Suspense></AuthGuard>} />
        <Route path="/contabilidade/plano-contas" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><PlanoContas /></Suspense></AuthGuard>} />
        <Route path="/contabilidade/balanco" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><BalancoPatrimonial /></Suspense></AuthGuard>} />
        <Route path="/contabilidade/dre" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><DRE /></Suspense></AuthGuard>} />
        <Route path="/contabilidade/livro-caixa" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><LivroCaixa /></Suspense></AuthGuard>} />
        <Route path="/contabilidade/folha-pagamento" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><FolhaPagamento /></Suspense></AuthGuard>} />
        <Route path="/folha-pagamento" element={<Navigate to="/contabilidade/folha-pagamento" replace />} />
        <Route path="/contabilidade/apuracao-custo-resultado" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><LazyApuracaoCustoResultado /></Suspense></AuthGuard>} />
        <Route path="/contabilidade/apuracao/:id" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><LazyApuracaoCustoResultadoDetalhes /></Suspense></AuthGuard>} />
        <Route path="/contabilidade/balancete" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><Balancete /></Suspense></AuthGuard>} />
        <Route path="/contabilidade/relatorios" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><RelatoriosContabeis /></Suspense></AuthGuard>} />
        <Route path="/contabilidade/fechamento-fiscal" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><FechamentoFiscal /></Suspense></AuthGuard>} />
        <Route path="/contabilidade/conciliacao-bancaria" element={<AuthGuard><Suspense fallback={<LoadingFallback />}><ConciliacaoBancaria /></Suspense></AuthGuard>} />
        
        {/* Página de erro */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
