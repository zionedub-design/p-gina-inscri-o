import React from 'react';
import { Zap, Gauge, Shield, Cpu, Compass, Flame } from 'lucide-react';
import { MOTORCYCLE_IMAGES } from '../constants/images';

export const SpecsSection: React.FC = () => {
  return (
    <section id="especificacoes" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-neutral-900 bg-neutral-950">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Engenharia & Performance
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            BMW R 1300 GS Triple Black
          </h2>
          <p className="mt-3 text-base text-neutral-400 leading-relaxed">
            Redesenhada do zero. Mais potente, mais leve e com a assinatura inconfundível do acabamento Triple Black em preto profundo e detalhes em titânio escuro.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Engine Card - 7 cols */}
          <div className="lg:col-span-7 rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden flex flex-col justify-between">
            <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
              <img
                src={MOTORCYCLE_IMAGES.engine}
                alt="Motor Boxer 1300cc ShiftCam da BMW R 1300 GS Triple Black"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-xs font-mono-numbers text-neutral-400">
                  Novo Boxer 1.300cc · ShiftCam
                </span>
                <h3 className="font-display text-xl font-bold text-white">
                  145 CV @ 7.750 rpm & 149 Nm de Torque
                </h3>
              </div>
            </div>

            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-neutral-800/80 bg-neutral-950/50">
              <div>
                <span className="text-xs text-neutral-500 block">Cilindrada</span>
                <span className="font-mono-numbers text-lg font-bold text-white">1.300 cm³</span>
                <span className="text-[11px] text-neutral-400 block mt-0.5">Bicilíndrico Boxer</span>
              </div>
              <div>
                <span className="text-xs text-neutral-500 block">Potência Máxima</span>
                <span className="font-mono-numbers text-lg font-bold text-white">145 CV</span>
                <span className="text-[11px] text-neutral-400 block mt-0.5">+9 CV de ganho</span>
              </div>
              <div>
                <span className="text-xs text-neutral-500 block">Torque Máximo</span>
                <span className="font-mono-numbers text-lg font-bold text-white">149 Nm</span>
                <span className="text-[11px] text-neutral-400 block mt-0.5">a 6.500 rpm</span>
              </div>
            </div>
          </div>

          {/* Cockpit Card - 5 cols */}
          <div className="lg:col-span-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden flex flex-col justify-between">
            <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
              <img
                src={MOTORCYCLE_IMAGES.cockpit}
                alt="Painel TFT e Cockpit da BMW R 1300 GS Triple Black"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-xs font-mono-numbers text-neutral-400">
                  Cockpit Conectado · TFT 6,5"
                </span>
                <h3 className="font-display text-xl font-bold text-white">
                  Controle Dinâmico DSA & Matrix LED
                </h3>
              </div>
            </div>

            <div className="p-6 border-t border-neutral-800/80 bg-neutral-950/50">
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                Painel TFT colorido de alta resolução com conectividade BMW Motorrad Connected, modos de pilotagem (Eco, Rain, Road, Enduro), controle de cruzeiro adaptativo e chave presencial Keyless Ride.
              </p>
              <div className="flex items-center gap-2 text-xs text-neutral-300 font-mono-numbers">
                <span>Peso em ordem de marcha: 237 kg</span>
                <span>·</span>
                <span>-12 kg mais leve</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Highlights Row */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800 text-white mb-4">
              <Zap className="h-5 w-5" />
            </div>
            <h4 className="font-display text-base font-bold text-white">
              Farol Matrix LED em 'X'
            </h4>
            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
              Assinatura luminosa marcante com feixe de luz matricial ultrabrilhante e luz diurna integrada, garantindo máxima visibilidade em qualquer terreno noturno.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800 text-white mb-4">
              <Gauge className="h-5 w-5" />
            </div>
            <h4 className="font-display text-base font-bold text-white">
              Suspensão Eletrônica DSA
            </h4>
            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
              O Dynamic Suspension Adjustment combina amortecimento dinâmico dianteiro e traseiro com controle adaptativo da altura do veículo de acordo com a velocidade.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800 text-white mb-4">
              <Flame className="h-5 w-5" />
            </div>
            <h4 className="font-display text-base font-bold text-white">
              Acabamento Triple Black
            </h4>
            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
              Pintura metálica Black Storm, tampa do tanque em alumínio anodizado escuro, rodas raiadas pretas com bicos de válvula integrados e estribos esportivos pretos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
