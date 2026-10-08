import React from 'react';
import { Database, Search, Users, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenSupabaseConfig: () => void;
  onOpenSearch: () => void;
  onOpenParticipants: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSupabaseConfig,
  onOpenSearch,
  onOpenParticipants,
}) => {
  return (
    <footer className="border-t border-neutral-900 bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8 text-xs text-neutral-400">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-neutral-900">
          <div>
            <span className="font-display text-lg font-bold text-white tracking-tight">
              BMW R 1300 GS TRIPLE BLACK
            </span>
            <p className="mt-1 text-xs text-neutral-400 max-w-md">
              Sorteio comemorativo exclusivo. Promoção comercial com base no resultado da Loteria Federal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Consultar Bilhete</span>
            </button>

            <span className="text-neutral-700" aria-hidden="true">·</span>

            <button
              onClick={onOpenParticipants}
              className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
            >
              <Users className="h-3.5 w-3.5" />
              <span>Painel de Inscritos</span>
            </button>

            <span className="text-neutral-700" aria-hidden="true">·</span>

            <button
              onClick={onOpenSupabaseConfig}
              className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
            >
              <Database className="h-3.5 w-3.5" />
              <span>Configuração do Banco</span>
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] text-neutral-400">
          <p>
            © {new Date().getFullYear()} Sorteio Oficial BMW GS 1300. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-neutral-400" />
            <span>Armazenamento Seguro em Nuvem · Termos em conformidade com a LGPD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
