import { MainLayout } from '@/components/layout/MainLayout';
import { Check, X } from 'lucide-react';

const allowed = [
  'Usar em vídeos para YouTube, TikTok, Instagram, e outras redes sociais',
  'Usar em projetos comerciais (publicidade, apresentações corporativas)',
  'Usar em podcasts e conteúdo de áudio',
  'Usar em jogos e aplicativos',
  'Usar em trabalhos acadêmicos e educacionais',
  'Editar, cortar e mixar os arquivos de áudio',
  'Usar em múltiplos projetos simultaneamente',
  'Monetizar conteúdo que utilize nossos áudios',
];

const notAllowed = [
  'Redistribuir ou revender os arquivos de áudio isoladamente',
  'Disponibilizar os arquivos para download por terceiros',
  'Compartilhar sua conta ou credenciais de acesso',
  'Registrar os áudios como sua propriedade intelectual',
  'Utilizar em projetos que promovam discurso de ódio ou conteúdo ilegal',
  'Sublicenciar os arquivos para outras pessoas ou empresas',
  'Incluir os áudios em bibliotecas de som ou packs para revenda',
];

export default function LicensePage() {
  return (
    <MainLayout>
      <div className="container py-12 md:py-20 max-w-3xl">
        <h1 className="text-3xl font-bold mb-4">Licenciamento</h1>
        <p className="text-muted-foreground mb-10">
          Entenda como você pode utilizar as músicas e efeitos sonoros da EchoMusic
          nos seus projetos.
        </p>

        <div className="grid gap-8 md:grid-cols-2 mb-12">
          {/* Permitido */}
          <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-6">
            <h2 className="text-lg font-semibold text-green-400 mb-4">Permitido</h2>
            <ul className="space-y-3">
              {allowed.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <Check className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Não permitido */}
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
            <h2 className="text-lg font-semibold text-red-400 mb-4">Não Permitido</h2>
            <ul className="space-y-3">
              {notAllowed.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <X className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">Tipo de Licença</h2>
            <p>
              A licença concedida é do tipo <strong className="text-foreground">Royalty-Free</strong>,
              o que significa que após a compra, você pode utilizar os arquivos de áudio em
              quantos projetos quiser sem pagar taxas adicionais por uso.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">Abrangência</h2>
            <p>
              A licença é válida mundialmente e pelo período de acesso ativo à plataforma.
              Os projetos criados durante o período de acesso podem continuar sendo
              utilizados e monetizados mesmo após o vencimento do plano.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">Content ID e Claims</h2>
            <p>
              Nossos áudios não estão registrados em sistemas de Content ID. Isso significa
              que você não receberá claims ou strikes ao usar nosso conteúdo em plataformas
              como YouTube. Caso receba alguma notificação indevida, entre em contato
              conosco para resolvermos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">Dúvidas</h2>
            <p>
              Se você tem dúvidas sobre a licença ou deseja um uso específico não coberto
              aqui, entre em contato pelo e-mail: echostudiose@gmail.com
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
