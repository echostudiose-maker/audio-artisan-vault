import { MainLayout } from '@/components/layout/MainLayout';

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="container py-12 md:py-20 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Termos de Uso</h1>

        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. Aceite dos Termos</h2>
            <p>
              Ao acessar e utilizar a plataforma EchoMusic, você concorda com estes Termos de Uso.
              Caso não concorde com algum dos termos, por favor, não utilize nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. Descricao do Servico</h2>
            <p>
              A EchoMusic é uma plataforma de distribuição de músicas e efeitos sonoros
              livres de direitos autorais para uso em projetos audiovisuais. Oferecemos
              acesso mediante pagamento único conforme descrito na página de preços.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. Conta do Usuario</h2>
            <p>
              Você é responsável por manter a confidencialidade de sua conta e senha.
              Cada conta é pessoal e intransferível. Não é permitido compartilhar
              credenciais de acesso com terceiros.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">4. Licença de Uso</h2>
            <p>
              Ao adquirir o plano Premium, você recebe uma licença não exclusiva para
              utilizar os arquivos de áudio em seus projetos, conforme detalhado na
              nossa página de Licenciamento. Consulte a página de Licenciamento para
              informações completas sobre o que é permitido e o que não é.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Pagamento e Reembolso</h2>
            <p>
              O pagamento é processado através da plataforma Hotmart. Oferecemos garantia
              de 7 dias conforme previsto no Código de Defesa do Consumidor. Para solicitar
              reembolso, entre em contato conosco dentro do prazo de 7 dias após a compra.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Período de Acesso</h2>
            <p>
              O plano Premium garante acesso por 1 (um) ano a partir da data da compra,
              incluindo todas as atualizações realizadas durante esse período.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">7. Conduta do Usuario</h2>
            <p>
              É proibido redistribuir, revender ou sublicenciar os arquivos de áudio
              baixados. O uso dos arquivos deve respeitar a licença adquirida.
              Tentativas de burlar o sistema de proteção são passíveis de cancelamento
              da conta sem direito a reembolso.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">8. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo da plataforma, incluindo mas não limitado a músicas,
              efeitos sonoros, design e código, é de propriedade da EchoMusic ou de
              seus licenciadores. A compra do plano Premium concede apenas direito de
              uso, não de propriedade.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">9. Modificações</h2>
            <p>
              Reservamo-nos o direito de modificar estes termos a qualquer momento.
              Alterações significativas serão comunicadas por e-mail. O uso continuado
              da plataforma após alterações constitui aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">10. Contato</h2>
            <p>
              Para dúvidas sobre estes termos, entre em contato pelo e-mail:
              echostudiose@gmail.com
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
