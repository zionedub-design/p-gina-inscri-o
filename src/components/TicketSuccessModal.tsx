import React, { useState } from 'react';
import { X, Check, Copy, Share2, Award, Calendar, Hash, UserCheck, ShieldCheck } from 'lucide-react';
import { RegistrationEntry } from '../types';

interface TicketSuccessModalProps {
  entry: RegistrationEntry | null;
  source: 'supabase' | 'local_demo';
  onClose: () => void;
}

export const TicketSuccessModal: React.FC<TicketSuccessModalProps> = ({
  entry,
  source,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!entry) return null;

  const handleCopyTicket = () => {
    navigator.clipboard.writeText(entry.numero_bilhete);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = encodeURIComponent(
    `🏍️ Acabei de garantir meu número da sorte (${entry.numero_bilhete}) para concorrer à BMW R 1300 GS Triple Black 0km! Participe você também gratuitamente!`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;

  const formattedDate = new Date(entry.criado_em).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-900 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-neutral-800 to-neutral-900 px-6 py-6 border-b border-neutral-800 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-neutral-950 shadow-md">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="font-display text-2xl font-bold text-white tracking-tight">
            Inscrição Confirmada!
          </h3>
          <p className="mt-1 text-sm text-neutral-400">
            Você está oficialmente concorrendo à BMW R 1300 GS Triple Black.
          </p>
        </div>

        {/* Ticket Body */}
        <div className="p-6 space-y-6">
          {/* Virtual Ticket Card */}
          <div className="relative rounded-xl border border-neutral-700 bg-neutral-950 p-5 shadow-inner">
            {/* Ticket Notches */}
            <div className="absolute -left-3 top-1/2 -mt-3 h-6 w-6 rounded-full bg-neutral-900 border-r border-neutral-700" />
            <div className="absolute -right-3 top-1/2 -mt-3 h-6 w-6 rounded-full bg-neutral-900 border-l border-neutral-700" />

            <div className="flex items-center justify-between border-b border-dashed border-neutral-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Sorteio Oficial 2026
                </span>
                <h4 className="font-display text-base font-bold text-white">
                  BMW R 1300 GS TRIPLE BLACK
                </h4>
              </div>
              <span className="text-xs px-2 py-1 rounded bg-neutral-800 text-neutral-300 font-mono-numbers">
                0 KM
              </span>
            </div>

            <div className="py-5 text-center">
              <span className="text-xs font-medium uppercase tracking-widest text-neutral-400">
                Seu Número da Sorte
              </span>
              <div className="mt-1 font-mono-numbers text-3xl sm:text-4xl font-extrabold tracking-wider text-white">
                {entry.numero_bilhete}
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                Guardado e autenticado para a extração da Loteria Federal
              </p>
            </div>

            <div className="border-t border-dashed border-neutral-800 pt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-neutral-500 block">Titular:</span>
                <span className="font-medium text-neutral-200 truncate block">{entry.nome}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Data de Registro:</span>
                <span className="font-mono-numbers text-neutral-200 block">{formattedDate}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Contato:</span>
                <span className="font-mono-numbers text-neutral-200 block">{entry.telefone}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Destino do Registro:</span>
                <span className="font-medium text-emerald-400 block">
                  {source === 'supabase' ? 'Banco de Dados em Nuvem (OK)' : 'Armazenado no Sistema'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleCopyTicket}
              className="flex items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800/80 px-4 py-2.5 text-xs font-semibold text-white hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Número Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-neutral-400" />
                  <span>Copiar Bilhete</span>
                </>
              )}
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>Salvar no WhatsApp</span>
            </a>
          </div>

          <div className="rounded-lg bg-neutral-950/60 p-3 text-center border border-neutral-800 text-[11px] text-neutral-400">
            Enviamos uma confirmação para <strong className="text-neutral-300">{entry.email}</strong>. Fique atento às nossas notificações oficiais sobre a data da extração.
          </div>
        </div>

        {/* Footer */}
        <div className="bg-neutral-950 px-6 py-4 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-white px-5 py-2 text-xs font-semibold text-neutral-950 hover:bg-neutral-200 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
