import React, { useState } from 'react';
import { X, Users, Download, Shield, Database, RefreshCw } from 'lucide-react';
import { RegistrationEntry } from '../types';

interface ParticipantsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: RegistrationEntry[];
  onRefresh: () => void;
  isRefreshing: boolean;
  isSupabaseActive: boolean;
}

export const ParticipantsListModal: React.FC<ParticipantsListModalProps> = ({
  isOpen,
  onClose,
  entries,
  onRefresh,
  isRefreshing,
  isSupabaseActive,
}) => {
  const [showUnmasked, setShowUnmasked] = useState(false);

  if (!isOpen) return null;

  const maskName = (name: string) => {
    if (showUnmasked) return name;
    const parts = name.split(' ');
    if (parts.length <= 1) return name;
    return `${parts[0]} ${parts[parts.length - 1][0]}***`;
  };

  const maskEmail = (email: string) => {
    if (showUnmasked) return email;
    const [local, domain] = email.split('@');
    if (!domain) return email;
    const maskedLocal = local.length > 2 ? `${local.slice(0, 2)}***` : '***';
    return `${maskedLocal}@${domain}`;
  };

  const maskPhone = (phone: string) => {
    if (showUnmasked) return phone;
    const digits = phone.replace(/\D/g, '');
    if (digits.length >= 10) {
      return `(${digits.slice(0, 2)}) *****-${digits.slice(-2)}`;
    }
    return '(**) *****-****';
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'Nome', 'Email', 'Telefone', 'Numero_Bilhete', 'Data_Inscricao', 'Origem'];
    const rows = entries.map((e) => [
      e.id,
      `"${e.nome.replace(/"/g, '""')}"`,
      `"${e.email.replace(/"/g, '""')}"`,
      `"${e.telefone.replace(/"/g, '""')}"`,
      e.numero_bilhete,
      e.criado_em,
      e.origem || 'supabase',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sorteio_bmw_gs1300_inscritos_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800 text-white">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">
                Painel de Inscrições e Auditoria
              </h3>
              <p className="text-xs text-neutral-400">
                {entries.length} bilhete(s) registrado(s) no sistema
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-1.5 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Atualizar lista"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-neutral-800 bg-neutral-950/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-neutral-400">
              <Database className="h-3.5 w-3.5" />
              Fonte:{' '}
              <strong className={isSupabaseActive ? 'text-emerald-400' : 'text-neutral-300'}>
                {isSupabaseActive ? 'Banco de Dados em Nuvem' : 'Armazenamento Seguro'}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer text-neutral-400 hover:text-neutral-200">
              <input
                type="checkbox"
                checked={showUnmasked}
                onChange={(e) => setShowUnmasked(e.target.checked)}
                className="rounded border-neutral-700 bg-neutral-950 accent-neutral-300"
              />
              <span>Modo Administrador (desmascarar)</span>
            </label>

            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-700 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* Table list */}
        <div className="max-h-96 overflow-y-auto">
          {entries.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500">
              Nenhuma inscrição encontrada até o momento.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950/80 sticky top-0 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 border-b border-neutral-800">
                <tr>
                  <th className="py-2.5 px-4">Bilhete</th>
                  <th className="py-2.5 px-4">Participante</th>
                  <th className="py-2.5 px-4">E-mail</th>
                  <th className="py-2.5 px-4">Telefone</th>
                  <th className="py-2.5 px-4 text-right">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-mono-numbers">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-white tracking-wider">
                      {entry.numero_bilhete}
                    </td>
                    <td className="py-2.5 px-4 font-sans text-neutral-200 font-medium">
                      {maskName(entry.nome)}
                    </td>
                    <td className="py-2.5 px-4 font-sans text-neutral-400">
                      {maskEmail(entry.email)}
                    </td>
                    <td className="py-2.5 px-4 text-neutral-400">
                      {maskPhone(entry.telefone)}
                    </td>
                    <td className="py-2.5 px-4 text-right text-neutral-500 text-[11px]">
                      {new Date(entry.criado_em).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="bg-neutral-950 px-6 py-3 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
          <span className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            Dados transmitidos com segurança e conformidade LGPD
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-white px-4 py-1.5 text-xs font-semibold text-neutral-950 hover:bg-neutral-200 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
