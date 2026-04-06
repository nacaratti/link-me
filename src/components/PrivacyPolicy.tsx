import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-muted py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link to="/entrar" className="text-primary text-sm hover:underline">← Voltar</Link>
        </div>

        <div className="bg-card rounded-2xl shadow-sm border border-border p-8 md:p-12 space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Política de Privacidade</h1>
            <p className="text-sm text-muted-foreground">Última atualização: 24 de março de 2026</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">1. Introdução</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Esta Política de Privacidade descreve como o <strong>Linqu.es</strong> coleta, usa e protege suas informações pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">2. Dados Coletados</h2>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-4">
              <div>
                <p className="font-medium text-foreground mb-1">Dados fornecidos por você:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Endereço de email</li>
                  <li>Username e nome de exibição</li>
                  <li>Biografia (bio)</li>
                  <li>Foto de perfil (avatar)</li>
                  <li>Links cadastrados (título, URL, ícone)</li>
                  <li>Preferências visuais (tema, cores, fonte)</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Dados coletados automaticamente:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Contagem de cliques por link (sem identificação do visitante)</li>
                  <li>Data e hora de criação da conta</li>
                  <li>Dados de sessão armazenados localmente no seu navegador (via <em>localStorage</em>)</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Dados recebidos de terceiros (login com Google):</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Nome completo e email da conta Google</li>
                  <li>URL da foto de perfil do Google</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">3. Finalidade do Tratamento</h2>
            <ul className="text-sm text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
              <li>Criação e gerenciamento da sua conta e página pública.</li>
              <li>Autenticação e controle de acesso.</li>
              <li>Exibição da sua página pública em <code className="bg-muted px-1 rounded text-xs">linqu.es/seuusername</code>.</li>
              <li>Contagem de cliques para estatísticas da sua própria página.</li>
              <li>Envio de comunicações essenciais (confirmação de email, recuperação de senha).</li>
              <li>Melhoria do serviço e prevenção de abusos.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">4. Compartilhamento de Dados</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Não vendemos nem compartilhamos seus dados pessoais com terceiros para fins comerciais. Os dados são compartilhados apenas com os seguintes prestadores de serviço essenciais:
            </p>
            <ul className="text-sm text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
              <li><strong>Supabase</strong> — banco de dados, autenticação e armazenamento de arquivos (servidores na AWS, região us-east-1).</li>
              <li><strong>Vercel</strong> — hospedagem e entrega do site.</li>
              <li><strong>Google</strong> — apenas quando você opta por fazer login via Google OAuth.</li>
              <li><strong>DiceBear</strong> — geração de avatar padrão quando nenhuma foto é definida (envia apenas o username como seed; nenhum dado pessoal identificável).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">5. Dados Públicos</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              As seguintes informações são <strong>públicas</strong> e visíveis para qualquer visitante da sua página:
            </p>
            <ul className="text-sm text-muted-foreground leading-relaxed space-y-1 list-disc list-inside">
              <li>Username, nome de exibição, bio e foto de perfil.</li>
              <li>Links ativos (título e URL de destino).</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Seu endereço de email e dados de configuração <strong>nunca são públicos</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">6. Cookies e Armazenamento Local</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Utilizamos <em>localStorage</em> do navegador para armazenar o token de sessão do Supabase, necessário para manter você autenticado. Não utilizamos cookies de rastreamento, pixels de terceiros ou ferramentas de analytics comportamental.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">7. Retenção de Dados</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Seus dados são mantidos enquanto sua conta estiver ativa. Após o encerramento da conta, os dados são excluídos em até <strong>30 dias</strong>, exceto quando a retenção for exigida por lei ou para resolução de disputas.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">8. Seus Direitos (LGPD)</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Em conformidade com a LGPD, você tem direito a:</p>
            <ul className="text-sm text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
              <li><strong>Acesso:</strong> solicitar uma cópia dos seus dados pessoais.</li>
              <li><strong>Correção:</strong> atualizar dados incorretos ou desatualizados pelo próprio painel.</li>
              <li><strong>Exclusão:</strong> solicitar a exclusão da sua conta e dados.</li>
              <li><strong>Portabilidade:</strong> receber seus dados em formato estruturado.</li>
              <li><strong>Revogação do consentimento:</strong> encerrar o uso do serviço a qualquer momento.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Para exercer esses direitos, entre em contato por{' '}
              <a href="mailto:privacidade@linqu.es" className="text-primary hover:underline">privacidade@linqu.es</a>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">9. Segurança</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo criptografia em trânsito (HTTPS/TLS), Row Level Security (RLS) no banco de dados e autenticação segura via Supabase Auth. Nenhum sistema é 100% seguro; em caso de incidente, notificaremos os usuários afetados conforme exigido pela LGPD.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">10. Menores de Idade</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O Linqu.es não é destinado a crianças menores de 13 anos. Não coletamos intencionalmente dados de menores. Se identificarmos uma conta de menor, ela será encerrada.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">11. Alterações nesta Política</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Podemos atualizar esta política periodicamente. A data de "última atualização" no topo indica quando ocorreu a revisão mais recente. Mudanças relevantes serão comunicadas por email.
            </p>
          </section>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Controlador de dados: Linqu.es · Contato:{' '}
              <a href="mailto:privacidade@linqu.es" className="text-primary hover:underline">privacidade@linqu.es</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
