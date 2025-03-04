
import React from 'react';

const ContratoLoading: React.FC = () => {
  return (
    <div className="p-8 text-center">
      <div className="animate-spin h-8 w-8 border-b-2 border-blue-700 rounded-full mx-auto mb-4"></div>
      <p className="text-gray-600">Carregando dados do contrato...</p>
    </div>
  );
};

export default ContratoLoading;
