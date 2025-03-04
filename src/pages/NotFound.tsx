
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: Tentativa de acesso a rota inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-blue-600">404</h1>
        <p className="text-xl text-gray-700 mb-4">Ops! Página não encontrada</p>
        <p className="text-gray-500 mb-6">
          A página que você está procurando não existe ou foi movida.
        </p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline font-medium">
          Voltar para o Dashboard
        </a>
      </div>
    </div>
  );
};

export default NotFound;
