import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'A inscrição é realmente 100% gratuita?',
    answer:
      'Sim, a inscrição e a geração do seu número da sorte são totalmente gratuitas. Não é exigida nenhuma compra, taxa de participação ou fornecimento de cartão de crédito.',
  },
  {
    question: 'Como é garantida a transparência do sorteio?',
    answer:
      'O número vencedor será apurado com base no resultado oficial da extração da Loteria Federal da Caixa Econômica Federal. O número do bilhete contemplado corresponde aos dígitos finais do 1º prêmio da data estipulada.',
  },
  {
    question: 'Onde meus dados são armazenados?',
    answer:
      'Seus dados (nome, e-mail e telefone) são armazenados com segurança em nuvem em banco de dados protegido e criptografado, em total conformidade com as normas da LGPD (Lei Geral de Proteção de Dados).',
  },
  {
    question: 'Posso me cadastrar mais de uma vez?',
    answer:
      'Cada participante tem direito a 1 (um) bilhete oficial associado ao seu e-mail e telefone. Inscrições duplicadas mantêm o primeiro número gerado para assegurar igualdade de chances a todos.',
  },
  {
    question: 'Como recebo a moto caso seja contemplado?',
    answer:
      'A BMW R 1300 GS Triple Black 0km é entregue diretamente no endereço do ganhador em qualquer município do Brasil, com frete, emplacamento e IPVA 2026 totalmente quitados pela organização.',
  },
  {
    question: 'Como faço para consultar meu bilhete depois?',
    answer:
      'Basta clicar no botão "Consultar Bilhete" no topo ou rodapé da página e informar o seu e-mail ou telefone cadastrado. O sistema buscará seu bilhete em tempo real no banco de dados.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="duvidas" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-neutral-900 bg-neutral-950">
      <div className="mx-auto max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Perguntas Frequentes
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Dúvidas Frequentes & Regulamento
          </h2>
          <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
            Tudo o que você precisa saber sobre a inscrição, apuração e entrega do prêmio.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-neutral-800 bg-neutral-900/40 overflow-hidden transition-colors hover:border-neutral-700"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold text-white focus:outline-none cursor-pointer"
                >
                  <span className="pr-4">{item.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-neutral-400 leading-relaxed border-t border-neutral-800/60 animate-fade-in">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
