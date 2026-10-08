import React, { useState } from 'react';
import { X, Search, Ticket, User, Calendar, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { RegistrationEntry } from '../types';

interface SearchTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: RegistrationEntry[];
}

export const SearchTicketModal: React.FC<SearchTicketModalProps> = ({
  isOpen,
  onClose,
  entries,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RegistrationEntry[] | null>(null);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = query.trim().toLowerCase();
    const cleanDigits = query.replace(/\D/g, '');

    if (!cleanQuery) {
      setResults(null);
      return;
    }

    const matched = entries.filter((entry) => {
      const matchEmail = entry.email.toLowerCase().includes(cleanQuery);
      const matchTicket = entry.numero_bilhete.toLowerCase().includes(cleanQuery);
      const matchPhone = cleanDigits && entry.telefone.replace(/\D/g, '').includes(cleanDigits);
      const matchName = entry.nome.toLowerCase().includes(cleanQuery);
      return matchEmail || matchTicket || matchPhone || matchName;
    });

    setResults(matched);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800 text-white">
              <Search className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">
                Consultar Meus Bilhetes
              </h3>
              <p className="text-xs text-neutral-400">
                Digite seu e-mail, telefone ou número do bilhete
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Digite seu e-mail ou telefone..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-neutral-400 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-neutral-950 hover:bg-neutral-200 transition-colors"
            >
              Buscar
            </button>
          </form>

          {/* Results list */}
          <div className="mt-5 space-y-3 max-h-80 overflow-y-auto">
            {results === null ? (
              <p className="text-center text-xs text-neutral-500 py-6">
                Informe seus dados acima para localizar seu bilhete do sorteio.
              </p>
            ) : results.length === 0 ? (
              <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6 text-center">
                <AlertCircle className="mx-auto h-8 w-8 text-neutral-500 mb-2" />
                <p className="text-xs font-semibold text-neutral-300">Nenhum bilhete encontrado</p>
                <p className="mt-1 text-[11px] text-neutral-500">
                  Verifique se digitou o mesmo e-mail ou telefone utilizado na inscrição.
                </p>
              </div>
            ) : (
              results.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-xl border border-neutral-700 bg-neutral-950 p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-emerald-400" />
                      <span className="font-mono-numbers text-sm font-bold text-white tracking-wider">
                        {entry.numero_bilhete}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                      Válido & Ativo
                    </span>
                  </div>
                  <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px] text-neutral-400">
                    <div>
                      <span className="text-neutral-500 block">Titular:</span>
                      <span className="text-neutral-200 truncate block">{entry.nome}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Cadastrado em:</span>
                      <span className="text-neutral-200 block font-mono-numbers">
                        {new Date(entry.criado_em).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-neutral-950 px-6 py-3 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-200 hover:bg-neutral-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
