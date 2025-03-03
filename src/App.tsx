
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ConfiguracoesEmpresa from "./pages/ConfiguracoesEmpresa";
import Motoristas from "./pages/Motoristas";
import TVDashboard from "./pages/TVDashboard";
import Contratos from "./pages/Contratos";
import BuscarContrato from "./pages/BuscarContrato";
import Canhotos from "./pages/Canhotos";
import EntradaNotas from "./pages/EntradaNotas";
import NovaNotaForm from "./pages/NovaNotaForm";
import Veiculos from "./pages/Veiculos";
import NovoVeiculoForm from "./pages/NovoVeiculoForm";
import RelatoriosVeiculos from "./pages/RelatoriosVeiculos";
import SaldoPagar from "./pages/SaldoPagar";
import Abastecimentos from "./pages/Abastecimentos";
import Manutencao from "./pages/Manutencao";
import DespesasGerais from "./pages/DespesasGerais";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/motoristas" element={<Motoristas />} />
          <Route path="/entrada-notas" element={<EntradaNotas />} />
          <Route path="/entrada-notas/nova" element={<NovaNotaForm />} />
          <Route path="/entrada-notas/editar/:id" element={<NovaNotaForm />} />
          <Route path="/configuracoes" element={<ConfiguracoesEmpresa />} />
          <Route path="/tv-dashboard" element={<TVDashboard />} />
          <Route path="/contratos" element={<Contratos />} />
          <Route path="/buscar-contrato" element={<BuscarContrato />} />
          <Route path="/canhotos" element={<Canhotos />} />
          <Route path="/veiculos" element={<Veiculos />} />
          <Route path="/veiculos/novo" element={<NovoVeiculoForm />} />
          <Route path="/veiculos/editar/:id" element={<NovoVeiculoForm />} />
          <Route path="/veiculos/relatorios" element={<RelatoriosVeiculos />} />
          <Route path="/saldo-pagar" element={<SaldoPagar />} />
          <Route path="/abastecimentos" element={<Abastecimentos />} />
          <Route path="/manutencao" element={<Manutencao />} />
          <Route path="/despesas" element={<DespesasGerais />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
