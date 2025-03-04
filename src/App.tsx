
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
import Usuarios from "./pages/Usuarios";
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
  // Garantir que o usuário esteja sempre autenticado
  React.useEffect(() => {
    // Configurar os dados do usuário admin automaticamente
    const adminTestUser = {
      id: 9999,
      nome: 'Administrador',
      email: 'admin@slog.com.br',
      cargo: 'Administrador',
      status: 'ativo',
      ultimo_acesso: new Date().toISOString()
    };
    
    localStorage.setItem('userData', JSON.stringify(adminTestUser));
    localStorage.setItem('userToken', 'token-simulado-dev');
    localStorage.setItem('userName', adminTestUser.nome);
    localStorage.setItem('userId', String(adminTestUser.id));
    localStorage.setItem('userEmail', adminTestUser.email);
    console.log('Autenticação automática realizada - modo desenvolvimento');
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas principais */}
        <Route path="/" element={<Suspense fallback={<LoadingFallback />}><Index /></Suspense>} />
        
        {/* Notas Fiscais */}
        <Route path="/notas" element={<Suspense fallback={<LoadingFallback />}><EntradaNotas /></Suspense>} />
        <Route path="/entrada-notas" element={<Suspense fallback={<LoadingFallback />}><EntradaNotas /></Suspense>} />
        <Route path="/notas/nova" element={<Suspense fallback={<LoadingFallback />}><NovaNotaForm /></Suspense>} />
        <Route path="/entrada-notas/nova" element={<Suspense fallback={<LoadingFallback />}><NovaNotaForm /></Suspense>} />
        <Route path="/notas/editar/:id" element={<Suspense fallback={<LoadingFallback />}><NovaNotaForm /></Suspense>} />
        <Route path="/entrada-notas/editar/:id" element={<Suspense fallback={<LoadingFallback />}><NovaNotaForm /></Suspense>} />
        
        {/* Veículos */}
        <Route path="/veiculos" element={<Suspense fallback={<LoadingFallback />}><Veiculos /></Suspense>} />
        <Route path="/veiculos/novo" element={<Suspense fallback={<LoadingFallback />}><NovoVeiculoForm /></Suspense>} />
        <Route path="/veiculos/relatorios" element={<Suspense fallback={<LoadingFallback />}><RelatoriosVeiculos /></Suspense>} />
        
        {/* Motoristas */}
        <Route path="/motoristas" element={<Suspense fallback={<LoadingFallback />}><Motoristas /></Suspense>} />
        
        {/* Contratos */}
        <Route path="/contratos" element={<Suspense fallback={<LoadingFallback />}><Contratos /></Suspense>} />
        <Route path="/contratos/novo" element={<Suspense fallback={<LoadingFallback />}><NovoContratoForm /></Suspense>} />
        <Route path="/contratos/editar/:id" element={<Suspense fallback={<LoadingFallback />}><NovoContratoForm /></Suspense>} />
        
        {/* Abastecimentos */}
        <Route path="/abastecimentos" element={<Suspense fallback={<LoadingFallback />}><Abastecimentos /></Suspense>} />
        
        {/* Despesas */}
        <Route path="/despesas" element={<Suspense fallback={<LoadingFallback />}><DespesasGerais /></Suspense>} />
        <Route path="/despesas/nova" element={<Suspense fallback={<LoadingFallback />}><NovaDespesaForm /></Suspense>} />
        
        {/* Manutenção */}
        <Route path="/manutencao" element={<Suspense fallback={<LoadingFallback />}><Manutencao /></Suspense>} />
        
        {/* Canhotos */}
        <Route path="/buscar-contrato" element={<Suspense fallback={<LoadingFallback />}><BuscarContrato /></Suspense>} />
        <Route path="/canhotos" element={<Suspense fallback={<LoadingFallback />}><Canhotos /></Suspense>} />
        
        {/* Saldo a Pagar */}
        <Route path="/saldo-pagar" element={<Suspense fallback={<LoadingFallback />}><SaldoPagar /></Suspense>} />
        
        {/* Relatórios */}
        <Route path="/relatorios" element={<Suspense fallback={<LoadingFallback />}><Relatorios /></Suspense>} />
        <Route path="/tv-dashboard" element={<Suspense fallback={<LoadingFallback />}><TVDashboard /></Suspense>} />
        
        {/* Configurações */}
        <Route path="/configuracoes" element={<Suspense fallback={<LoadingFallback />}><ConfiguracoesEmpresa /></Suspense>} />
        <Route path="/utilitarios" element={<Suspense fallback={<LoadingFallback />}><Utilitarios /></Suspense>} />
        <Route path="/usuarios" element={<Suspense fallback={<LoadingFallback />}><Usuarios /></Suspense>} />
        
        {/* Módulo de Contabilidade */}
        <Route path="/contabilidade" element={<Suspense fallback={<LoadingFallback />}><Contabilidade /></Suspense>} />
        <Route path="/contabilidade/lancamentos" element={<Suspense fallback={<LoadingFallback />}><LancamentosContabeis /></Suspense>} />
        <Route path="/contabilidade/plano-contas" element={<Suspense fallback={<LoadingFallback />}><PlanoContas /></Suspense>} />
        <Route path="/contabilidade/balanco" element={<Suspense fallback={<LoadingFallback />}><BalancoPatrimonial /></Suspense>} />
        <Route path="/contabilidade/dre" element={<Suspense fallback={<LoadingFallback />}><DRE /></Suspense>} />
        <Route path="/contabilidade/livro-caixa" element={<Suspense fallback={<LoadingFallback />}><LivroCaixa /></Suspense>} />
        <Route path="/contabilidade/folha-pagamento" element={<Suspense fallback={<LoadingFallback />}><FolhaPagamento /></Suspense>} />
        <Route path="/folha-pagamento" element={<Suspense fallback={<LoadingFallback />}><FolhaPagamento /></Suspense>} />
        <Route path="/contabilidade/apuracao-custo-resultado" element={<Suspense fallback={<LoadingFallback />}><LazyApuracaoCustoResultado /></Suspense>} />
        <Route path="/contabilidade/apuracao/:id" element={<Suspense fallback={<LoadingFallback />}><LazyApuracaoCustoResultadoDetalhes /></Suspense>} />
        <Route path="/contabilidade/balancete" element={<Suspense fallback={<LoadingFallback />}><Balancete /></Suspense>} />
        <Route path="/contabilidade/relatorios" element={<Suspense fallback={<LoadingFallback />}><RelatoriosContabeis /></Suspense>} />
        <Route path="/contabilidade/fechamento-fiscal" element={<Suspense fallback={<LoadingFallback />}><FechamentoFiscal /></Suspense>} />
        <Route path="/contabilidade/conciliacao-bancaria" element={<Suspense fallback={<LoadingFallback />}><ConciliacaoBancaria /></Suspense>} />
        
        {/* Página de erro - sempre no final */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
