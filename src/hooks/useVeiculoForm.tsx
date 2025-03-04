
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatarPlaca, validarPlaca } from "@/utils/veiculoUtils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logOperation } from "@/utils/logOperations";

export const useVeiculoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    placa: '',
    tipo: 'cavalo',
    modelo: '',
    ano: new Date().getFullYear(),
    chassi: '',
    renavam: '',
    capacidade: '',
    marca: '',
    cor: '',
    combustivel: 'diesel',
    frota: 'propria',
    observacoes: '',
    // Dados específicos para cavalo mecânico
    potencia: '',
    torque: '',
    entreEixos: '',
    // Dados específicos para carreta
    tipoCarroceria: '',
    comprimento: '',
    largura: '',
    altura: '',
    capacidadeCarga: '',
  });

  // Carregar dados para edição
  useEffect(() => {
    console.log('useVeiculoForm montado, modo edição:', isEditMode);
    
    if (isEditMode) {
      console.log('Carregando dados do veículo para edição, ID:', id);
      // Em um cenário real, este seria um fetch para a API
      // Aqui vamos simular com dados mock
      setTimeout(() => {
        const mockVeiculo = {
          placa: 'ABC-1234',
          tipo: 'cavalo',
          modelo: 'Scania R450',
          ano: 2020,
          chassi: '9BWHE21JX24060031',
          renavam: '123456789',
          capacidade: '45000',
          marca: 'Scania',
          cor: 'Vermelho',
          combustivel: 'diesel',
          frota: 'propria',
          observacoes: 'Veículo em bom estado',
          potencia: '450',
          torque: '2300',
          entreEixos: '3800',
          tipoCarroceria: '',
          comprimento: '',
          largura: '',
          altura: '',
          capacidadeCarga: '',
        };
        
        setFormData(mockVeiculo);
        console.log('Dados carregados:', mockVeiculo);
      }, 500);
    }
  }, [isEditMode, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar a placa
    if (!validarPlaca(formData.placa)) {
      toast.error("A placa informada é inválida. Use o formato ABC-1234 ou ABC1D23.");
      return;
    }
    
    const placaFormatada = formatarPlaca(formData.placa);
    console.log('Placa formatada:', placaFormatada);
    
    try {
      // Verificar se a placa já existe (no caso de novo cadastro)
      if (!isEditMode) {
        const campoPlaca = formData.tipo === 'cavalo' ? 'placa_cavalo' : 'placa_carreta';
        console.log('Verificando existência da placa no campo:', campoPlaca);
        
        const { data: placaExistente } = await supabase
          .from('Veiculos')
          .select('*')
          .eq(campoPlaca, placaFormatada);
        
        console.log('Resultado da verificação:', placaExistente);
        
        if (placaExistente && placaExistente.length > 0) {
          toast.error("Esta placa já está cadastrada no sistema.");
          return;
        }
      }
      
      console.log('Preparando dados para salvar no Supabase');
      
      // Preparar dados para salvar no Supabase
      const dadosVeiculo = {
        placa_cavalo: formData.tipo === 'cavalo' ? placaFormatada : null,
        placa_carreta: formData.tipo === 'carreta' ? placaFormatada : null,
        tipo_frota: formData.frota,
        status_veiculo: 'Ativo'
      };
      
      console.log('Dados para salvar:', dadosVeiculo);
      
      // Salvar no Supabase
      const { data, error } = await supabase
        .from('Veiculos')
        .upsert(dadosVeiculo)
        .select();
      
      if (error) {
        console.error('Erro ao salvar veículo:', error);
        toast.error("Ocorreu um erro ao salvar o veículo. Tente novamente.");
        return;
      }
      
      console.log('Veículo salvo com sucesso:', data);
      logOperation('Veículos', isEditMode ? 'Veículo atualizado' : 'Veículo cadastrado', `Placa: ${placaFormatada}`);
      
      toast.success(
        isEditMode ? "Veículo atualizado com sucesso!" : "Veículo cadastrado com sucesso!"
      );
      
      // Redirecionar para a lista de veículos
      navigate('/veiculos');
    } catch (error) {
      console.error('Erro ao processar veículo:', error);
      toast.error("Ocorreu um erro ao processar o veículo. Tente novamente.");
    }
  };

  const handleCancel = () => {
    navigate('/veiculos');
  };

  return {
    formData,
    isEditMode,
    handleChange,
    handleSelectChange,
    handleSubmit,
    handleCancel
  };
};
