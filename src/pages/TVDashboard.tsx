
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '@/components/dashboard/StatCard';

const TVDashboard = () => {
  const [carregando, setCarregando] = useState(true);
  const [dados, setDados] = useState<any>({
    totalVeiculos: 0,
    totalMotoristas: 0,
    totalContratos: 0,
    totalNotas: 0,
    totalAbastecimentos: 0,
    totalManutencoes: 0
  });
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      setCarregando(true);
      
      try {
        // Carregar total de veículos
        const { count: totalVeiculos } = await supabase
          .from('Veiculos')
          .select('*', { count: 'exact', head: true });
          
        // Carregar total de motoristas
        const { count: totalMotoristas } = await supabase
          .from('Motoristas')
          .select('*', { count: 'exact', head: true });
          
        // Carregar total de contratos
        const { count: totalContratos } = await supabase
          .from('Contratos')
          .select('*', { count: 'exact', head: true });
          
        // Carregar total de notas fiscais
        const { count: totalNotas } = await supabase
          .from('Notas')
          .select('*', { count: 'exact', head: true });
          
        // Carregar total de abastecimentos
        const { count: totalAbastecimentos } = await supabase
          .from('Abastecimentos')
          .select('*', { count: 'exact', head: true });
          
        // Carregar total de manutenções
        const { count: totalManutencoes } = await supabase
          .from('Manutencao')
          .select('*', { count: 'exact', head: true });
          
        setDados({
          totalVeiculos: totalVeiculos || 0,
          totalMotoristas: totalMotoristas || 0,
          totalContratos: totalContratos || 0,
          totalNotas: totalNotas || 0,
          totalAbastecimentos: totalAbastecimentos || 0,
          totalManutencoes: totalManutencoes || 0
        });
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setCarregando(false);
      }
    };
    
    fetchData();
    
    // Atualizar a cada 5 minutos (300000 ms)
    const interval = setInterval(fetchData, 300000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleVoltar = () => {
    navigate('/');
  };
  
  if (carregando) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-8 bg-black text-white">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">ControlFrota - Painel de Monitoramento</h1>
        <Button variant="outline" onClick={handleVoltar} className="text-white">
          Voltar ao Dashboard
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="bg-blue-950 border-blue-800 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-xl font-bold">Veículos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-white pt-4">{Number(dados.totalVeiculos)}</div>
            <div className="text-blue-300 mt-2">Total de veículos cadastrados</div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-950 border-purple-800 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-xl font-bold">Motoristas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-white pt-4">{Number(dados.totalMotoristas)}</div>
            <div className="text-purple-300 mt-2">Total de motoristas cadastrados</div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-950 border-green-800 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-xl font-bold">Contratos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-white pt-4">{Number(dados.totalContratos)}</div>
            <div className="text-green-300 mt-2">Total de contratos registrados</div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-950 border-amber-800 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-xl font-bold">Notas Fiscais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-white pt-4">{Number(dados.totalNotas)}</div>
            <div className="text-amber-300 mt-2">Total de notas fiscais registradas</div>
          </CardContent>
        </Card>
        
        <Card className="bg-cyan-950 border-cyan-800 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-xl font-bold">Abastecimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-white pt-4">{Number(dados.totalAbastecimentos)}</div>
            <div className="text-cyan-300 mt-2">Total de abastecimentos registrados</div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-950 border-red-800 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-xl font-bold">Manutenções</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-white pt-4">{Number(dados.totalManutencoes)}</div>
            <div className="text-red-300 mt-2">Total de manutenções registradas</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6">Métricas de Operação</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-gray-900 border-gray-800 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-xl font-bold">Status em Tempo Real</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Veículos em operação</span>
                  <span className="text-white font-bold">75%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
                
                <div className="flex justify-between mt-4">
                  <span className="text-gray-400">Contratos em andamento</span>
                  <span className="text-white font-bold">60%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
                
                <div className="flex justify-between mt-4">
                  <span className="text-gray-400">Notas em processamento</span>
                  <span className="text-white font-bold">45%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-800 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-xl font-bold">Indicadores Financeiros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-gray-400 mb-1">Receita (mês)</p>
                  <p className="text-2xl font-bold text-white">R$ 1.25M</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Despesas (mês)</p>
                  <p className="text-2xl font-bold text-white">R$ 765K</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Rendimento</p>
                  <p className="text-2xl font-bold text-green-500">+12.3%</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Combustível</p>
                  <p className="text-2xl font-bold text-red-500">-3.7%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-10 text-center text-gray-500">
        <p>Dados atualizados em: {new Date().toLocaleString('pt-BR')}</p>
      </div>
    </div>
  );
};

export default TVDashboard;
