import { MainLayout } from '@/components/layout/MainLayout';

export default function PrivacyPage() {
  return (
    <MainLayout>
      <div className="container py-12 md:py-20 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Política de Privacidade</h1>

        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. Dados Coletados</h2>
            <p>
              Coletamos as seguintes informações quando você utiliza a EchoMusic:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Nome completo e endereço de e-mail (no cadastro)</li>
              <li>Dados de navegação e uso da plataforma</li>
              <li>Histórico de downloads</li>
              <li>Informações do dispositivo e navegador</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. Uso dos Dados</h2>
            <p>Utilizamos seus dados para:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Gerenciar sua conta e fornecer acesso à plataforma</li>
              <li>Processar pagamentos e gerenciar assinaturas</li>
              <li>Enviar comunicações sobre atualizações e novos conteúdos</li>
              <li>Melhorar nossos serviços e experiência do usuário</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. Compartilhamento de Dados</h2>
            <p>
              Não vendemos seus dados pessoais. Compartilhamos informações apenas com:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Hotmart (processamento de pagamentos)</li>
              <li>Supabase (infraestrutura e banco de dados)</li>
              <li>Autoridades legais, quando exigido por lei</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">4. Armazenamento e Segurança</h2>
            <p>
              Seus dados são armazenados em servidores seguros com criptografia.
              Utilizamos medidas técnicas e organizacionais para proteger suas
              informações contra acesso não autorizado, alteração ou destruição.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Cookies</h2>
            <p>
              Utilizamos cookies essenciais para manter sua sessão ativa e
              preferências (como tema claro/escuro). Não utilizamos cookies de
              rastreamento de terceiros para publicidade.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Seus Direitos (LGPD)</h2>
            <p>Conforme a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos ou desatualizados</li>
              <li>Solicitar a exclusão dos seus dados</li>
              <li>Revogar o consentimento para uso dos dados</li>
              <li>Solicitar portabilidade dos dados</li>
            </ul>
            <p className="mt-2">
              Para exercer seus direitos, entre em contato pelo e-mail: echostudiose@gmail.com
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">7. Retenção de Dados</h2>
            <p>
              Mantemos seus dados enquanto sua conta estiver ativa. Após a exclusão
              da conta, seus dados pessoais serão removidos em até 30 dias, exceto
              quando a retenção for necessária por obrigação legal.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">8. Alterações</h2>
            <p>
              Esta política pode ser atualizada periodicamente. Notificaremos sobre
              mudanças significativas por e-mail. A data da última atualização será
              sempre indicada no final desta página.
            </p>
          </section>

          <p className="text-sm mt-8 pt-4 border-t border-border">
            Última atualização: Abril de 2026
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
