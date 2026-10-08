/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { TopNav } from './components/TopNav';
import { RegistrationForm } from './components/RegistrationForm';
import { TicketSuccessModal } from './components/TicketSuccessModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { SearchTicketModal } from './components/SearchTicketModal';
import { ParticipantsListModal } from './components/ParticipantsListModal';
import { SpecsSection } from './components/SpecsSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { MOTORCYCLE_IMAGES } from './constants/images';
import {
  isSupabaseConnected,
  fetchAllEntries,
} from './lib/supabase';
import { RegistrationEntry } from './types';
import {
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Database,
  ArrowDown,
  Users,
} from 'lucide-react';

export default function App() {
  const [supabaseActive, setSupabaseActive] = useState(false);
  const [entries, setEntries] = useState<RegistrationEntry[]>([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(false);

  // Modals
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [successEntry, setSuccessEntry] = useState<RegistrationEntry | null>(null);
  const [successSource, setSuccessSource] = useState<'supabase' | 'local_demo'>('local_demo');

  // Form reference for smooth scrolling
  const formRef = useRef<HTMLDivElement>(null);

  // Countdown timer to the drawing date
  const [timeLeft, setTimeLeft] = useState({
    days: 42,
    hours: 14,
    minutes: 38,
    seconds: 20,
  });

  const loadData = async () => {
    setIsLoadingEntries(true);
    setSupabaseActive(isSupabaseConnected());
    try {
      const data = await fetchAllEntries();
      setEntries(data);
    } catch (err) {
      console.error('Erro ao carregar inscrições:', err);
    } finally {
      setIsLoadingEntries(false);
    }
  };

  useEffect(() => {
    loadData();

    // Update countdown every second
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleScrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleRegistrationSuccess = (
    entry: RegistrationEntry,
    source: 'supabase' | 'local_demo'
  ) => {
    setSuccessEntry(entry);
    setSuccessSource(source);
    setEntries((prev) => [entry, ...prev.filter((e) => e.id !== entry.id)]);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-neutral-800 selection:text-white">
      {/* Top Bar Navigation */}
      <TopNav
        onOpenSupabaseConfig={() => setIsSupabaseModalOpen(true)}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        isSupabaseActive={supabaseActive}
        onScrollToForm={handleScrollToForm}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* HERO SECTION */}
        <section id="premio" className="relative pt-6 pb-20 sm:pt-10 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Subtle Ambient Background */}
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-neutral-800/20 via-neutral-900/10 to-transparent blur-3xl" />

          <div className="mx-auto max-w-7xl">
            {/* Editorial Kicker & Unboxed Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 mb-6">
              <span className="font-semibold text-neutral-300">Sorteio Oficial 2026</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span>Extração pela Loteria Federal</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span>Inscrição Gratuita</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Database className="h-3 w-3" />
                {supabaseActive ? 'Servidor Sincronizado' : 'Conexão Segura'}
              </span>
            </div>

            {/* Grid: Left Column Copy & Hero Image, Right Column Registration Form */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column (7 cols) */}
              <div className="lg:col-span-7 space-y-8">
                <div>
                  <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] text-balance">
                    Concorra à Nova <br className="hidden sm:inline" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-500">
                      BMW R 1300 GS
                    </span>{' '}
                    Triple Black 0km
                  </h1>
                  <p className="mt-5 text-base sm:text-lg text-neutral-400 max-w-2xl leading-relaxed">
                    A lenda do motoaventura agora com 145 CV, motor Boxer 1300cc ShiftCam e acabamento exclusivo Triple Black. Preencha seus dados ao lado para receber seu número oficial da sorte.
                  </p>
                </div>

                {/* Hero Showcase Photography */}
                <div className="relative rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden shadow-2xl group">
                  <div className="aspect-[16/9] w-full overflow-hidden bg-neutral-950">
                    <img
                      src={MOTORCYCLE_IMAGES.hero}
                      alt="BMW R 1300 GS Triple Black edição especial"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-102"
                    />
                  </div>
                  {/* Contrast Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent pointer-events-none" />

                  {/* Badges on Bottom of Image */}
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-mono-numbers uppercase tracking-wider text-neutral-400 block">
                        Versão Marquee
                      </span>
                      <span className="font-display text-lg font-bold text-white block">
                        Pacote Triple Black Completo
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-mono-numbers text-neutral-400 block">
                        Avaliação de Mercado
                      </span>
                      <span className="font-mono-numbers text-base font-bold text-emerald-400 block">
                        R$ 138.900,00
                      </span>
                    </div>
                  </div>
                </div>

                {/* Countdown & Live Statistics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Countdown Box */}
                  <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                      <Calendar className="h-4 w-4 text-neutral-400" />
                      <span>Data da Apuração</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center font-mono-numbers">
                      <div className="rounded-lg bg-neutral-950 p-2 border border-neutral-800/80">
                        <span className="text-xl sm:text-2xl font-bold text-white block">
                          {String(timeLeft.days).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] text-neutral-500 uppercase">Dias</span>
                      </div>
                      <div className="rounded-lg bg-neutral-950 p-2 border border-neutral-800/80">
                        <span className="text-xl sm:text-2xl font-bold text-white block">
                          {String(timeLeft.hours).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] text-neutral-500 uppercase">Horas</span>
                      </div>
                      <div className="rounded-lg bg-neutral-950 p-2 border border-neutral-800/80">
                        <span className="text-xl sm:text-2xl font-bold text-white block">
                          {String(timeLeft.minutes).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] text-neutral-500 uppercase">Min</span>
                      </div>
                      <div className="rounded-lg bg-neutral-950 p-2 border border-neutral-800/80">
                        <span className="text-xl sm:text-2xl font-bold text-white block">
                          {String(timeLeft.seconds).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] text-neutral-500 uppercase">Seg</span>
                      </div>
                    </div>
                  </div>

                  {/* Live Entries Count Box */}
                  <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                        <span className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-neutral-400" />
                          <span>Bilhetes Emitidos</span>
                        </span>
                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                      <div className="font-mono-numbers text-3xl font-extrabold text-white">
                        {entries.length.toLocaleString('pt-BR')}
                      </div>
                      <p className="mt-1 text-xs text-neutral-400">
                        Participantes concorrendo em tempo real.
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs">
                      <button
                        onClick={() => setIsParticipantsModalOpen(true)}
                        className="text-neutral-300 hover:text-white underline underline-offset-4 transition-colors text-left"
                      >
                        Ver lista de inscrições
                      </button>
                      <button
                        onClick={() => setIsSearchModalOpen(true)}
                        className="text-neutral-400 hover:text-neutral-200 transition-colors"
                      >
                        Já me cadastrei
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (5 cols): Friction-free Registration Form */}
              <div ref={formRef} className="lg:col-span-5 lg:sticky lg:top-24">
                <RegistrationForm
                  onSuccess={handleRegistrationSuccess}
                  onOpenSupabaseConfig={() => setIsSupabaseModalOpen(true)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* SPECS SECTION */}
        <SpecsSection />

        {/* HOW IT WORKS SECTION */}
        <HowItWorksSection />

        {/* QUICK CONVERSION BANNER */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-neutral-900 bg-neutral-950">
          <div className="mx-auto max-w-5xl rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-900/80 to-neutral-950 p-8 sm:p-12 text-center shadow-xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Oportunidade Limitada
            </span>
            <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-white text-balance">
              Não Deixe Sua Chance Passar. Inscrição 100% Gratuita.
            </h3>
            <p className="mt-3 text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
              O sorteio será realizado pela Loteria Federal. Cada participante recebe um bilhete digital único registrado no banco de dados.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleScrollToForm}
                className="rounded-lg bg-white px-6 py-3 text-xs font-semibold text-neutral-950 hover:bg-neutral-200 transition-colors"
              >
                Garantir Meu Bilhete Agora
              </button>
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="rounded-lg border border-neutral-700 bg-neutral-900 px-6 py-3 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                Consultar Bilhete Cadastrado
              </button>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <FaqSection />
      </main>

      {/* FOOTER */}
      <Footer
        onOpenSupabaseConfig={() => setIsSupabaseModalOpen(true)}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenParticipants={() => setIsParticipantsModalOpen(true)}
      />

      {/* MODALS */}
      {/* 1. Ticket Success Modal */}
      <TicketSuccessModal
        entry={successEntry}
        source={successSource}
        onClose={() => setSuccessEntry(null)}
      />

      {/* 2. Supabase Configuration & SQL Modal */}
      <SupabaseConfigModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConfigChanged={loadData}
      />

      {/* 3. Search My Ticket Modal */}
      <SearchTicketModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        entries={entries}
      />

      {/* 4. Participants Audit / Transparency Modal */}
      <ParticipantsListModal
        isOpen={isParticipantsModalOpen}
        onClose={() => setIsParticipantsModalOpen(false)}
        entries={entries}
        onRefresh={loadData}
        isRefreshing={isLoadingEntries}
        isSupabaseActive={supabaseActive}
      />
    </div>
  );
}
