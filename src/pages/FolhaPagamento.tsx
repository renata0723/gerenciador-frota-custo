
import React from 'react';
import { Navigate } from 'react-router-dom';

const FolhaPagamentoRedirect: React.FC = () => {
  return <Navigate to="/contabilidade/folha-pagamento" replace />;
};

export default FolhaPagamentoRedirect;
