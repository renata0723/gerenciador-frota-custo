
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

// Lazy load the ApuracaoCustoResultado components
const LazyApuracaoCustoResultado = React.lazy(() => import('./pages/contabilidade/ApuracaoCustoResultado'));
const LazyApuracaoCustoResultadoDetalhes = React.lazy(() => import('./pages/contabilidade/ApuracaoCustoResultadoDetalhes'));

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        
        {/* Rotas protegidas */}
        <Route path="/" element={<AuthGuard><Index /></AuthGuard>} />
        
        {/* Notas Fiscais */}
        <Route path="/notas" element={<AuthGuard><EntradaNotas /></AuthGuard>} />
        <Route path="/entrada-notas" element={<Navigate to="/notas" replace />} />
        <Route path="/notas/nova" element={<AuthGuard><NovaNotaForm /></AuthGuard>} />
        <Route path="/entrada-notas/nova" element={<Navigate to="/notas/nova" replace />} />
        <Route path="/notas/editar/:id" element={<AuthGuard><NovaNotaForm /></AuthGuard>} />
        <Route path="/entrada-notas/editar/:id" element={<Navigate to="/notas/editar/:id" replace />} />
        
        {/* Veículos */}
        <Route path="/veiculos" element={<AuthGuard><Veiculos /></AuthGuard>} />
        <Route path="/veiculos/novo" element={<AuthGuard><NovoVeiculoForm /></AuthGuard>} />
        <Route path="/veiculos/relatorios" element={<AuthGuard><RelatoriosVeiculos /></AuthGuard>} />
        
        {/* Motoristas */}
        <Route path="/motoristas" element={<AuthGuard><Motoristas /></AuthGuard>} />
        
        {/* Contratos */}
        <Route path="/contratos" element={<AuthGuard><Contratos /></AuthGuard>} />
        <Route path="/contratos/novo" element={<AuthGuard><NovoContratoForm /></AuthGuard>} />
        <Route path="/contratos/editar/:id" element={<AuthGuard><NovoContratoForm /></AuthGuard>} />
        
        {/* Abastecimentos */}
        <Route path="/abastecimentos" element={<AuthGuard><Abastecimentos /></AuthGuard>} />
        
        {/* Despesas */}
        <Route path="/despesas" element={<AuthGuard><DespesasGerais /></AuthGuard>} />
        <Route path="/despesas/nova" element={<AuthGuard><NovaDespesaForm /></AuthGuard>} />
        
        {/* Manutenção */}
        <Route path="/manutencao" element={<AuthGuard><Manutencao /></AuthGuard>} />
        
        {/* Canhotos */}
        <Route path="/buscar-contrato" element={<AuthGuard><BuscarContrato /></AuthGuard>} />
        <Route path="/canhotos" element={<AuthGuard><Canhotos /></AuthGuard>} />
        
        {/* Saldo a Pagar */}
        <Route path="/saldo-pagar" element={<AuthGuard><SaldoPagar /></AuthGuard>} />
        
        {/* Relatórios */}
        <Route path="/relatorios" element={<AuthGuard><Relatorios /></AuthGuard>} />
        <Route path="/tv-dashboard" element={<AuthGuard><TVDashboard /></AuthGuard>} />
        
        {/* Configurações */}
        <Route path="/configuracoes" element={<AuthGuard><ConfiguracoesEmpresa /></AuthGuard>} />
        <Route path="/utilitarios" element={<AuthGuard><Utilitarios /></AuthGuard>} />
        <Route path="/usuarios" element={<AuthGuard><Usuarios /></AuthGuard>} />
        
        {/* Módulo de Contabilidade */}
        <Route path="/contabilidade" element={<AuthGuard><Contabilidade /></AuthGuard>} />
        <Route path="/contabilidade/lancamentos" element={<AuthGuard><LancamentosContabeis /></AuthGuard>} />
        <Route path="/contabilidade/plano-contas" element={<AuthGuard><PlanoContas /></AuthGuard>} />
        <Route path="/contabilidade/balanco" element={<AuthGuard><BalancoPatrimonial /></AuthGuard>} />
        <Route path="/contabilidade/dre" element={<AuthGuard><DRE /></AuthGuard>} />
        <Route path="/contabilidade/livro-caixa" element={<AuthGuard><LivroCaixa /></AuthGuard>} />
        <Route path="/contabilidade/folha-pagamento" element={<AuthGuard><FolhaPagamento /></AuthGuard>} />
        <Route path="/folha-pagamento" element={<Navigate to="/contabilidade/folha-pagamento" replace />} />
        <Route path="/contabilidade/apuracao-custo-resultado" element={<AuthGuard><Suspense fallback={<div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div></div>}><LazyApuracaoCustoResultado /></Suspense></AuthGuard>} />
        <Route path="/contabilidade/apuracao/:id" element={<AuthGuard><Suspense fallback={<div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div></div>}><LazyApuracaoCustoResultadoDetalhes /></Suspense></AuthGuard>} />
        <Route path="/contabilidade/balancete" element={<AuthGuard><Balancete /></AuthGuard>} />
        
        {/* Página de erro */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
