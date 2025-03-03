
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

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/entrada-notas" element={<EntradaNotas />} />
        <Route path="/entrada-notas/nova" element={<NovaNotaForm />} />
        <Route path="/entrada-notas/editar/:id" element={<NovaNotaForm />} />
        <Route path="/veiculos" element={<Veiculos />} />
        <Route path="/veiculos/novo" element={<NovoVeiculoForm />} />
        <Route path="/veiculos/relatorios" element={<RelatoriosVeiculos />} />
        <Route path="/motoristas" element={<Motoristas />} />
        <Route path="/contratos" element={<Contratos />} />
        <Route path="/contratos/novo" element={<NovoContratoForm />} />
        <Route path="/contratos/editar/:id" element={<NovoContratoForm />} />
        <Route path="/abastecimentos" element={<Abastecimentos />} />
        <Route path="/despesas" element={<DespesasGerais />} />
        <Route path="/manutencao" element={<Manutencao />} />
        <Route path="/buscar-contrato" element={<BuscarContrato />} />
        <Route path="/canhotos" element={<Canhotos />} />
        <Route path="/saldo-pagar" element={<SaldoPagar />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/tv-dashboard" element={<TVDashboard />} />
        <Route path="/configuracoes" element={<ConfiguracoesEmpresa />} />
        <Route path="/utilitarios" element={<Utilitarios />} />
        <Route path="/contabilidade" element={<Contabilidade />} />
        <Route path="/contabilidade/lancamentos" element={<LancamentosContabeis />} />
        <Route path="/contabilidade/plano-contas" element={<PlanoContas />} />
        <Route path="/contabilidade/balanco" element={<BalancoPatrimonial />} />
        <Route path="/contabilidade/dre" element={<DRE />} />
        <Route path="/contabilidade/livro-caixa" element={<LivroCaixa />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
