
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CadastroPlacaFormFixedProps {
  onSave: (data: { placaCavalo?: string; placaCarreta?: string; tipoFrota: "frota" | "terceiro" }) => Promise<void>;
  onCancel: () => void;
  isCarreta?: boolean;
}

const CadastroPlacaFormFixed: React.FC<CadastroPlacaFormFixedProps> = ({ 
  onSave, 
  onCancel,
  isCarreta = false
}) => {
  const [placa, setPlaca] = useState('');
  const [tipoFrota, setTipoFrota] = useState<"frota" | "terceiro">("frota");
  const [proprietario, setProprietario] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [proprietariosList, setProprietariosList] = useState<{nome: string}[]>([]);
  const [showNewProprietario, setShowNewProprietario] = useState(false);
  const [novoProprietario, setNovoProprietario] = useState('');
  const [documentoProprietario, setDocumentoProprietario] = useState('');

  // Buscar proprietários ao montar o componente
  React.useEffect(() => {
    const fetchProprietarios = async () => {
      try {
        const { data, error } = await supabase
          .from('Proprietarios')
          .select('nome');
          
        if (error) throw error;
        
        if (data) {
          setProprietariosList(data);
        }
      } catch (error) {
        console.error('Erro ao buscar proprietários:', error);
        toast.error('Não foi possível carregar a lista de proprietários');
      }
    };
    
    if (tipoFrota === 'terceiro') {
      fetchProprietarios();
    }
  }, [tipoFrota]);

  const validarPlaca = (placa: string) => {
    // Padrão de placa: AAA0A00 ou AAA0000
    const regexNovoModelo = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
    const regexModeloAntigo = /^[A-Z]{3}[0-9]{4}$/;
    
    return regexNovoModelo.test(placa) || regexModeloAntigo.test(placa);
  };

  const handleSalvar = async () => {
    if (!placa) {
      toast.error('Placa é obrigatória');
      return;
    }
    
    if (!validarPlaca(placa)) {
      toast.error('Formato de placa inválido. Use AAA0000 ou AAA0A00');
      return;
    }
    
    if (tipoFrota === 'terceiro' && !proprietario && !novoProprietario) {
      toast.error('Proprietário é obrigatório para veículos terceirizados');
      return;
    }
    
    setCarregando(true);
    
    try {
      // Se for terceirizado e tiver um novo proprietário, cadastre-o primeiro
      let proprietarioFinal = proprietario;
      
      if (tipoFrota === 'terceiro' && novoProprietario) {
        const { data: novoProprietarioData, error: errorProprietario } = await supabase
          .from('Proprietarios')
          .insert({
            nome: novoProprietario,
            documento: documentoProprietario || null,
            dados_bancarios: null
          })
          .select('nome')
          .single();
          
        if (errorProprietario) {
          throw new Error(`Erro ao cadastrar novo proprietário: ${errorProprietario.message}`);
        }
        
        proprietarioFinal = novoProprietarioData.nome;
      }
      
      // Verificar se a placa já existe
      const { data: placaExistente, error: errorBusca } = await supabase
        .from('Veiculos')
        .select(isCarreta ? 'placa_carreta' : 'placa_cavalo')
        .eq(isCarreta ? 'placa_carreta' : 'placa_cavalo', placa)
        .maybeSingle();
        
      if (errorBusca) {
        throw new Error(`Erro ao verificar se placa existe: ${errorBusca.message}`);
      }
      
      if (placaExistente) {
        toast.error(`Esta placa já está cadastrada no sistema.`);
        setCarregando(false);
        return;
      }
      
      // Preparar dados para salvar
      const placaData = { 
        [isCarreta ? 'placa_carreta' : 'placa_cavalo']: placa,
        tipo_frota: tipoFrota,
        status_veiculo: 'Ativo'
      };
      
      // Inserir na tabela de Veículos
      const { error: errorInsert } = await supabase
        .from('Veiculos')
        .insert(placaData);
        
      if (errorInsert) {
        throw new Error(`Erro ao inserir veículo: ${errorInsert.message}`);
      }
      
      // Se for terceirizado, insira também na tabela de proprietários de veículos
      if (tipoFrota === 'terceiro' && proprietarioFinal) {
        const { error: errorProp } = await supabase
          .from('VeiculoProprietarios')
          .insert({
            placa_cavalo: isCarreta ? null : placa,
            proprietario_nome: proprietarioFinal
          });
          
        if (errorProp) {
          console.error('Erro ao vincular proprietário:', errorProp);
          // Não interrompa o fluxo, apenas registre o erro
        }
      }
      
      toast.success(`${isCarreta ? 'Carreta' : 'Cavalo'} cadastrado com sucesso!`);
      
      // Passar os dados para o callback
      await onSave({
        [isCarreta ? 'placaCarreta' : 'placaCavalo']: placa,
        tipoFrota
      });
      
    } catch (error) {
      console.error('Erro ao cadastrar placa:', error);
      toast.error('Ocorreu um erro ao cadastrar a placa');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <span className="mr-2">Cadastrar Nova {isCarreta ? 'Carreta' : 'Placa do Cavalo'}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="placa">Placa</Label>
              <Input
                id="placa"
                placeholder="AAA0000 ou AAA0A00"
                value={placa}
                onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                maxLength={7}
              />
              <p className="text-sm text-gray-500">
                Formato: AAA0000 (antigo) ou AAA0A00 (Mercosul)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tipoFrota">Tipo</Label>
              <Select
                value={tipoFrota}
                onValueChange={(value) => setTipoFrota(value as "frota" | "terceiro")}
              >
                <SelectTrigger id="tipoFrota">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frota">Frota Própria</SelectItem>
                  <SelectItem value="terceiro">Terceirizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {tipoFrota === 'terceiro' && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="proprietario">Proprietário</Label>
                    <Button 
                      variant="ghost" 
                      className="h-6 px-2 text-xs"
                      type="button"
                      onClick={() => setShowNewProprietario(!showNewProprietario)}
                    >
                      {showNewProprietario ? 'Selecionar existente' : 'Cadastrar novo'}
                    </Button>
                  </div>
                  
                  {!showNewProprietario ? (
                    <Select
                      value={proprietario}
                      onValueChange={setProprietario}
                      disabled={proprietariosList.length === 0}
                    >
                      <SelectTrigger id="proprietario">
                        <SelectValue placeholder="Selecione o proprietário" />
                      </SelectTrigger>
                      <SelectContent>
                        {proprietariosList.map((p, idx) => (
                          <SelectItem key={idx} value={p.nome}>
                            {p.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="space-y-2">
                      <Input
                        id="novoProprietario"
                        placeholder="Nome do novo proprietário"
                        value={novoProprietario}
                        onChange={(e) => setNovoProprietario(e.target.value)}
                      />
                      <Input
                        id="documentoProprietario"
                        placeholder="CPF/CNPJ do proprietário"
                        value={documentoProprietario}
                        onChange={(e) => setDocumentoProprietario(e.target.value)}
                      />
                    </div>
                  )}
                </div>
                
                {proprietariosList.length === 0 && !showNewProprietario && (
                  <div className="flex items-center text-amber-500 text-sm">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Nenhum proprietário cadastrado. Clique em "Cadastrar novo".
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={carregando}>
            Cancelar
          </Button>
          <Button onClick={handleSalvar} disabled={carregando}>
            {carregando ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CadastroPlacaFormFixed;
