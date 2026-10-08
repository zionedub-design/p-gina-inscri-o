import React from 'react';
import { Database, Search } from 'lucide-react';

interface TopNavProps {
  onOpenSupabaseConfig: () => void;
  onOpenSearch: () => void;
  isSupabaseActive: boolean;
  onScrollToForm: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenSupabaseConfig,
  onOpenSearch,
  isSupabaseActive,
  onScrollToForm,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <a href="#" className="font-display text-lg font-bold tracking-tight text-white hover:text-neutral-200 transition-colors">
          BMW R 1300 GS
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-400">
          <a href="#premio" className="hover:text-white transition-colors">
            O Prêmio
          </a>
          <a href="#como-funciona" className="hover:text-white transition-colors">
            Como Funciona
          </a>
          <a href="#especificacoes" className="hover:text-white transition-colors">
            Ficha Técnica
          </a>
          <a href="#duvidas" className="hover:text-white transition-colors">
            Regulamento & FAQ
          </a>
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 hover:text-white transition-colors text-left"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Consultar Bilhete</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSupabaseConfig}
            title={isSupabaseActive ? 'Banco de dados sincronizado' : 'Configurar conexão de dados'}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap ${
              isSupabaseActive
                ? 'border-emerald-600/60 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/50'
                : 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {isSupabaseActive ? 'Banco Conectado' : 'Configurar Banco'}
            </span>
            <span className="sm:hidden">{isSupabaseActive ? 'Conectado' : 'Banco'}</span>
          </button>

          <button
            onClick={onScrollToForm}
            className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-white rounded-md hover:bg-neutral-200 transition-colors whitespace-nowrap"
          >
            Participar Grátis
          </button>
        </div>
      </div>
    </header>
  );
};
