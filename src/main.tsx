
import { createRoot } from 'react-dom/client';
import { Suspense } from 'react';
import { Toaster } from 'sonner';
import App from './App.tsx';
import './index.css';

const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<LoadingFallback />}>
    <App />
    <Toaster position="top-right" richColors closeButton />
  </Suspense>
);
