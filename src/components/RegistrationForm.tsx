import React, { useState } from 'react';
import { User, Mail, Phone, CheckCircle2, ShieldCheck, ArrowRight, Loader2, Sparkles, Database } from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitRegistration, isSupabaseConnected } from '../lib/supabase';
import { RegistrationEntry } from '../types';

interface RegistrationFormProps {
  onSuccess: (entry: RegistrationEntry, source: 'supabase' | 'local_demo') => void;
  onOpenSupabaseConfig: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSuccess,
  onOpenSupabaseConfig,
}) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ nome?: string; email?: string; telefone?: string; terms?: string }>({});

  const supabaseActive = isSupabaseConnected();

  // Smart phone masking for Brazil (XX) XXXXX-XXXX with international fallback
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    let formatted = value;
    if (value.length > 6) {
      formatted = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      formatted = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      formatted = `(${value}`;
    }

    setTelefone(formatted);
    if (errors.telefone) setErrors((prev) => ({ ...prev, telefone: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: { nome?: string; email?: string; telefone?: string; terms?: string } = {};

    const trimmedNome = nome.trim();
    if (!trimmedNome) {
      newErrors.nome = 'Por favor, informe seu nome completo.';
    } else if (trimmedNome.split(' ').filter(Boolean).length < 2) {
      newErrors.nome = 'Digite seu nome e sobrenome.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Por favor, informe seu e-mail.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Insira um e-mail válido (ex: nome@dominio.com).';
    }

    const digitsOnly = telefone.replace(/\D/g, '');
    if (!digitsOnly) {
      newErrors.telefone = 'Por favor, informe seu telefone com DDD.';
    } else if (digitsOnly.length < 10) {
      newErrors.telefone = 'Número incompleto. Digite DDD + número (mínimo 10 dígitos).';
    }

    if (!acceptedTerms) {
      newErrors.terms = 'É necessário aceitar os termos do sorteio para participar.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await submitRegistration({
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
      });

      // Fire confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ffffff', '#38bdf8', '#fbbf24', '#22c55e'],
        });
      } catch (err) {
        console.error('Confetti error:', err);
      }

      onSuccess(result.entry, result.source);
      // Reset fields
      setNome('');
      setEmail('');
      setTelefone('');
    } catch (err) {
      console.error('Falha ao processar inscrição:', err);
      alert('Ocorreu um erro ao registrar sua inscrição. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative rounded-2xl border border-neutral-800 bg-neutral-900/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      {/* Decorative subtle corner glow */}
      <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-neutral-700/20 blur-3xl" />

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Formulário Oficial de Entrada
          </span>
          <button
            type="button"
            onClick={onOpenSupabaseConfig}
            className={`flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded transition-colors ${
              supabaseActive
                ? 'text-emerald-400 hover:text-emerald-300'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Database className="h-3 w-3" />
            <span>{supabaseActive ? 'Servidor Ativo' : 'Modo Seguro'}</span>
          </button>
        </div>
        <h3 className="font-display text-2xl font-bold text-white tracking-tight">
          Garanta seu Bilhete da Sorte
        </h3>
        <p className="mt-1 text-sm text-neutral-400">
          Preencha seus dados para concorrer à BMW R 1300 GS Triple Black 0km.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome */}
        <div>
          <label htmlFor="nome" className="block text-xs font-medium text-neutral-300 mb-1.5">
            Nome Completo <span className="text-neutral-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
              <User className="h-4 w-4" />
            </div>
            <input
              id="nome"
              type="text"
              autoComplete="name"
              placeholder="Ex: Gabriel Albuquerque"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                if (errors.nome) setErrors((prev) => ({ ...prev, nome: undefined }));
              }}
              className={`w-full rounded-lg border bg-neutral-950/80 py-2.5 pl-10 pr-3.5 text-sm text-white placeholder-neutral-500 transition-colors focus:outline-none focus:ring-1 ${
                errors.nome
                  ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-neutral-800 focus:border-neutral-500 focus:ring-neutral-500/20'
              }`}
            />
          </div>
          {errors.nome && <p className="mt-1 text-xs text-red-400">{errors.nome}</p>}
        </div>

        {/* E-mail */}
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-neutral-300 mb-1.5">
            E-mail Principal <span className="text-neutral-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
              <Mail className="h-4 w-4" />
            </div>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              className={`w-full rounded-lg border bg-neutral-950/80 py-2.5 pl-10 pr-3.5 text-sm text-white placeholder-neutral-500 transition-colors focus:outline-none focus:ring-1 ${
                errors.email
                  ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-neutral-800 focus:border-neutral-500 focus:ring-neutral-500/20'
              }`}
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
        </div>

        {/* Telefone */}
        <div>
          <label htmlFor="telefone" className="block text-xs font-medium text-neutral-300 mb-1.5">
            Telefone / WhatsApp <span className="text-neutral-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
              <Phone className="h-4 w-4" />
            </div>
            <input
              id="telefone"
              type="tel"
              autoComplete="tel"
              placeholder="(11) 99999-9999"
              value={telefone}
              onChange={handlePhoneChange}
              className={`w-full rounded-lg border bg-neutral-950/80 py-2.5 pl-10 pr-3.5 text-sm text-white placeholder-neutral-500 transition-colors focus:outline-none focus:ring-1 ${
                errors.telefone
                  ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-neutral-800 focus:border-neutral-500 focus:ring-neutral-500/20'
              }`}
            />
          </div>
          {errors.telefone && <p className="mt-1 text-xs text-red-400">{errors.telefone}</p>}
        </div>

        {/* Termos e Regulamento */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => {
                setAcceptedTerms(e.target.checked);
                if (errors.terms) setErrors((prev) => ({ ...prev, terms: undefined }));
              }}
              className="mt-0.5 h-4 w-4 rounded border-neutral-700 bg-neutral-950 text-white accent-neutral-200 focus:ring-0"
            />
            <span className="text-xs leading-relaxed text-neutral-400">
              Concordo com os termos do sorteio oficial, declaro ter mais de 18 anos e autorizo o envio do bilhete por e-mail e WhatsApp.
            </span>
          </label>
          {errors.terms && <p className="mt-1 text-xs text-red-400">{errors.terms}</p>}
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-neutral-950 transition-all hover:bg-neutral-200 active:scale-[0.99] disabled:opacity-60 whitespace-nowrap cursor-pointer shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-neutral-950" />
                <span>Emitindo seu bilhete...</span>
              </>
            ) : (
              <>
                <span>Gerar Meu Número da Sorte</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>

        {/* Trust Badges */}
        <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-neutral-400" />
            Dados protegidos (LGPD)
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-neutral-400" />
            Participação 100% gratuita
          </span>
        </div>
      </form>
    </div>
  );
};
