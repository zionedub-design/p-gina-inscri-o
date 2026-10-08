import React from 'react';
import { UserPlus, Ticket, Trophy, Truck } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Inscrição Gratuita',
      description:
        'Preencha apenas seu nome completo, e-mail e telefone de contato. Sem taxas ou compras obrigatórias.',
      icon: UserPlus,
    },
    {
      number: '02',
      title: 'Emissão do Bilhete',
      description:
        'Seu número único da sorte é gerado na hora e gravado com segurança no banco de dados Supabase.',
      icon: Ticket,
    },
    {
      number: '03',
      title: 'Extração Auditada',
      description:
        'O resultado do sorteio é baseado na extração oficial da Loteria Federal, garantindo 100% de imparcialidade.',
      icon: Trophy,
    },
    {
      number: '04',
      title: 'Entrega na Sua Porta',
      description:
        'A BMW R 1300 GS Triple Black é entregue 0km na sua garagem com documentação e frete totalmente pagos.',
      icon: Truck,
    },
  ];

  return (
    <section id="como-funciona" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-neutral-900 bg-neutral-950/70">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Regras Claras & Transparência
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Como Funciona o Sorteio
          </h2>
          <p className="mt-3 text-base text-neutral-400 leading-relaxed">
            Um processo direto e auditável. Cada participante recebe um número exclusivo registrado em tempo real no banco de dados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono-numbers text-xs font-bold text-neutral-500">
                      {step.number}
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800 text-white">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <h3 className="font-display text-lg font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
