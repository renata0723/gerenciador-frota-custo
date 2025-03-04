
import { useState, useEffect } from 'react';

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Verificar na montagem
    checkIfMobile();

    // Adicionar o listener para quando a janela for redimensionada
    window.addEventListener('resize', checkIfMobile);

    // Limpar o listener quando o componente for desmontado
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return isMobile;
};
