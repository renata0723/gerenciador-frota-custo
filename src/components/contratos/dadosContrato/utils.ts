
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const gerarNovoIdContrato = async () => {
  try {
    // Obter a data atual formatada YYYYMMDD
    const dataAtual = format(new Date(), 'yyyyMMdd');
    
    // Consultar contratos do dia para gerar número sequencial
    const { data, error } = await supabase
      .from('Contratos')
      .select('id')
      .gte('created_at', `${format(new Date(), 'yyyy-MM-dd')}T00:00:00`)
      .order('id', { ascending: false })
      .limit(1);
      
    if (error) throw error;
    
    // Gerar número sequencial
    let sequencial = '001';
    if (data && data.length > 0) {
      // Extrair o número sequencial do último contrato do dia
      const ultimoId = String(data[0].id);
      if (ultimoId.length >= 3) {
        const ultimoSequencial = parseInt(ultimoId.substring(ultimoId.length - 3));
        sequencial = String(ultimoSequencial + 1).padStart(3, '0');
      }
    }
    
    // Definir novo ID no formato YYYYMMDDXXX
    // Exemplo: 20240101001
    const novoId = `${dataAtual}${sequencial}`;
    return novoId;
      
  } catch (error) {
    console.error('Erro ao gerar ID do contrato:', error);
    // Fallback: timestamp + 3 dígitos aleatórios
    const timestamp = Date.now();
    const aleatorio = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${timestamp}${aleatorio}`;
  }
};

export const carregarPlacas = async () => {
  try {
    const { data, error } = await supabase
      .from('Veiculos')
      .select('*')
      .eq('status_veiculo', 'ativo');
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao carregar veículos:', error);
    toast.error('Não foi possível carregar os veículos');
    return [];
  }
};

export const carregarMotoristas = async () => {
  try {
    const { data, error } = await supabase
      .from('Motorista')
      .select('id, nome');
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao carregar motoristas:', error);
    return [];
  }
};

export const carregarProprietarios = async () => {
  try {
    const { data, error } = await supabase
      .from('Proprietarios')
      .select('nome');
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao carregar proprietários:', error);
    return [];
  }
};
