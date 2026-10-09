import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Política de privacidade da Casa do Pastel da Hora em Porto Fictício/EX.",
};

export default function PrivacidadePage() {
  return (
    <section className="pt-32 pb-24 md:pb-32">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="font-display text-4xl md:text-5xl tracking-tighter leading-none text-white mb-8">
          Política de Privacidade
        </h1>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            A Casa do Pastel da Hora, localizada em Porto Fictício/EX, valoriza
            a privacidade dos seus clientes. Esta política descreve como
            coletamos, usamos e protegemos suas informações.
          </p>

          <h2 className="text-white font-display text-xl font-semibold">
            Informações que coletamos
          </h2>
          <p>
            Coletamos informações fornecidas voluntariamente por você ao
            preencher formulários de contato, como nome, email e mensagem.
            Não coletamos informações sensíveis ou dados bancários.
          </p>

          <h2 className="text-white font-display text-xl font-semibold">
            Uso das informações
          </h2>
          <p>
            As informações coletadas são usadas exclusivamente para responder
            a suas dúvidas e contato. Não compartilhamos seus dados com
            terceiros sem seu consentimento explícito.
          </p>

          <h2 className="text-white font-display text-xl font-semibold">
            Cookies
          </h2>
          <p>
            Utilizamos cookies essenciais para o funcionamento do site.
            Não utilizamos cookies de rastreamento ou publicidade sem
            seu consentimento.
          </p>

          <h2 className="text-white font-display text-xl font-semibold">
            Contato
          </h2>
          <p>
            Para dúvidas sobre esta política, entre em contato pelo
            WhatsApp (00) 90000-0008.
          </p>

          <p className="text-sm mt-8">
            Última atualização: Julho de 2026.
          </p>
        </div>
      </div>
    </section>
  );
}
