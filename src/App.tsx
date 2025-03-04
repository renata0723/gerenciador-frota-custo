import React, { Suspense } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
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
import FolhaPagamento from "./pages/FolhaPagamento";

// Lazy load the ApuracaoCustoResultado components
const LazyApuracaoCustoResultado = React.lazy(() => import('./pages/contabilidade/ApuracaoCustoResultado'));
const LazyApuracaoCustoResultadoDetalhes = React.lazy(() => import('./pages/contabilidade/ApuracaoCustoResultadoDetalhes'));

// Add this import
import Balancete from "./pages/contabilidade/Balancete";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        
        {/* Rotas protegidas */}
        <Route path="/" element={<AuthGuard><Index /></AuthGuard>} />
        <Route path="/entrada-notas" element={<AuthGuard><EntradaNotas /></AuthGuard>} />
        <Route path="/entrada-notas/nova" element={<AuthGuard><NovaNotaForm /></AuthGuard>} />
        <Route path="/entrada-notas/editar/:id" element={<AuthGuard><NovaNotaForm /></AuthGuard>} />
        <Route path="/veiculos" element={<AuthGuard><Veiculos /></AuthGuard>} />
        <Route path="/veiculos/novo" element={<AuthGuard><NovoVeiculoForm /></AuthGuard>} />
        <Route path="/veiculos/relatorios" element={<AuthGuard><RelatoriosVeiculos /></AuthGuard>} />
        <Route path="/motoristas" element={<AuthGuard><Motoristas /></AuthGuard>} />
        <Route path="/contratos" element={<AuthGuard><Contratos /></AuthGuard>} />
        <Route path="/contratos/novo" element={<AuthGuard><NovoContratoForm /></AuthGuard>} />
        <Route path="/contratos/editar/:id" element={<AuthGuard><NovoContratoForm /></AuthGuard>} />
        <Route path="/abastecimentos" element={<AuthGuard><Abastecimentos /></AuthGuard>} />
        <Route path="/despesas" element={<AuthGuard><DespesasGerais /></AuthGuard>} />
        <Route path="/despesas/nova" element={<AuthGuard><NovaDespesaForm /></AuthGuard>} />
        <Route path="/manutencao" element={<AuthGuard><Manutencao /></AuthGuard>} />
        <Route path="/buscar-contrato" element={<AuthGuard><BuscarContrato /></AuthGuard>} />
        <Route path="/canhotos" element={<AuthGuard><Canhotos /></AuthGuard>} />
        <Route path="/saldo-pagar" element={<AuthGuard><SaldoPagar /></AuthGuard>} />
        <Route path="/relatorios" element={<AuthGuard><Relatorios /></AuthGuard>} />
        <Route path="/tv-dashboard" element={<AuthGuard><TVDashboard /></AuthGuard>} />
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
        <Route path="/contabilidade/apuracao-custo-resultado" element={<AuthGuard><Suspense fallback={<div>Carregando...</div>}><LazyApuracaoCustoResultado /></Suspense></AuthGuard>} />
        <Route path="/contabilidade/apuracao/:id" element={<AuthGuard><Suspense fallback={<div>Carregando...</div>}><LazyApuracaoCustoResultadoDetalhes /></Suspense></AuthGuard>} />
        
        {/* Add this route inside the Contabilidade section */}
        <Route path="/contabilidade/balancete" element={<AuthGuard><Balancete /></AuthGuard>} />
        
        {/* Página de erro */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
