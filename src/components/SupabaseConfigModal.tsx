import React, { useState, useEffect } from 'react';
import { X, Database, Check, Copy, AlertCircle, RefreshCw, Terminal, CheckCircle2, Trash2 } from 'lucide-react';
import {
  getSupabaseCredentials,
  saveSupabaseCredentials,
  clearSupabaseCredentials,
  testSupabaseConnection,
  SUPABASE_SQL_SETUP,
} from '../lib/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigChanged,
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [isEnvConfigured, setIsEnvConfigured] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'sql'>('config');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [sqlCopied, setSqlCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const creds = getSupabaseCredentials();
      setUrl(creds.url);
      setAnonKey(creds.anonKey);
      setIsEnvConfigured(creds.isFromEnv);
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) {
      setTestResult({
        ok: false,
        message: 'Por favor, preencha a URL do projeto e a chave Anon do Supabase.',
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    const result = await testSupabaseConnection(url, anonKey);
    setTestResult(result);
    setTesting(false);

    if (result.ok) {
      saveSupabaseCredentials(url, anonKey);
      onConfigChanged();
    }
  };

  const handleDisconnect = () => {
    clearSupabaseCredentials();
    setUrl('');
    setAnonKey('');
    setTestResult({
      ok: true,
      message: 'Configurações do Supabase removidas. O sistema retornou ao modo de demonstração local.',
    });
    onConfigChanged();
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-950/60 border border-emerald-700/50 text-emerald-400">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Painel de Conexão com o Banco de Dados
              </h3>
              <p className="text-xs text-neutral-400">
                Conecte seu banco de dados em nuvem para sincronizar as inscrições em tempo real
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

        {/* Tab buttons */}
        <div className="flex border-b border-neutral-800 px-6 pt-2 bg-neutral-950/40">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'config'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Credenciais do Projeto
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'sql'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            Script SQL (Criar Tabela)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'config' ? (
            <form onSubmit={handleTestAndSave} className="space-y-4">
              {isEnvConfigured && (
                <div className="rounded-lg bg-neutral-950 border border-neutral-800 p-3 text-xs text-neutral-400 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>
                    Credenciais detectadas via variáveis de ambiente (`VITE_SUPABASE_URL`). Você pode sobrescrevê-las abaixo se desejar.
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Project URL do Supabase
                </label>
                <input
                  type="text"
                  placeholder="https://sua-instancia.supabase.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:border-neutral-500 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-neutral-500">
                  Encontrado em: <strong>Project Settings → API → Project URL</strong> no painel do Supabase.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Project API Key (Anon / Public)
                </label>
                <textarea
                  rows={2}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:border-neutral-500 focus:outline-none font-mono"
                />
                <p className="mt-1 text-[11px] text-neutral-500">
                  Encontrado em: <strong>Project Settings → API → Project API keys → anon (public)</strong>.
                </p>
              </div>

              {testResult && (
                <div
                  className={`rounded-lg p-3 text-xs flex items-start gap-2.5 border ${
                    testResult.ok
                      ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                      : 'bg-red-950/40 border-red-700/60 text-red-300'
                  }`}
                >
                  {testResult.ok ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                  )}
                  <div className="leading-relaxed">{testResult.message}</div>
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Desconectar / Usar Modo Local</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={testing}
                    className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-neutral-200 transition-colors disabled:opacity-50"
                  >
                    {testing ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        <span>Testando conexão...</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Testar e Salvar Conexão</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="text-xs text-neutral-400">
                  Script com <strong>Políticas de Armazenamento (RLS e Storage Buckets)</strong> ativadas. Copie e execute no <strong>SQL Editor</strong> do painel Supabase:
                </p>
                <button
                  onClick={handleCopySql}
                  className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-700 transition-colors shrink-0"
                >
                  {sqlCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Script Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copiar Script SQL Completo</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-lg bg-neutral-950/80 border border-neutral-800 p-3 text-[11px] text-neutral-400 space-y-1">
                <div className="text-neutral-300 font-medium">O que este script configura:</div>
                <ul className="list-disc list-inside space-y-0.5 text-neutral-400">
                  <li><strong>Tabela de Inscrições:</strong> com validações (nome, email, telefone, bilhete único).</li>
                  <li><strong>Row Level Security (RLS):</strong> inserção e consulta públicas; edições e exclusões restritas a admins.</li>
                  <li><strong>Políticas de Armazenamento (Storage):</strong> bucket <code>sorteio_arquivos</code> com RLS ativado para uploads e leitura.</li>
                  <li><strong>Supabase Realtime:</strong> replicação em tempo real para sincronização instantânea.</li>
                </ul>
              </div>

              <pre className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-[11px] text-neutral-300 font-mono overflow-x-auto leading-relaxed select-all max-h-80">
                {SUPABASE_SQL_SETUP}
              </pre>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-neutral-950 px-6 py-3 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
          <span>Campos gravados: nome, email, telefone, numero_bilhete</span>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
