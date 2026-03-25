import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link to="/entrar" className="text-[#0B76A0] text-sm hover:underline">← Voltar</Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#D9D9D9] p-8 md:p-12 space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-[#111111] mb-1">Termos de Serviço</h1>
            <p className="text-sm text-[#BFBFBF]">Última atualização: 24 de março de 2026</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#333333]">1. Aceitação dos Termos</h2>
            <p className="text-sm text-[#555555] leading-relaxed">
              Ao criar uma conta ou utilizar os serviços do <strong>Linqu.es</strong>, você concorda com estes Termos de Serviço. Se não concordar com qualquer parte destes termos, não utilize a plataforma.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#333333]">2. Descrição do Serviço</h2>
            <p className="text-sm text-[#555555] leading-relaxed">
              O Linqu.es é uma plataforma de bio links que permite aos usuários criar uma página personalizada em <code className="bg-[#f5f5f5] px-1.5 py-0.5 rounded text-xs">linqu.es/seuusername</code> para reunir e compartilhar links de interesse. O serviço é oferecido nos planos <strong>Gratuito</strong> e <strong>Pro</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#333333]">3. Cadastro e Conta</h2>
            <ul className="text-sm text-[#555555] leading-relaxed space-y-2 list-disc list-inside">
              <li>Você deve ter ao menos 13 anos para criar uma conta.</li>
              <li>O username escolhido é único e definitivo; transferências não são realizadas.</li>
              <li>Você é responsável pela segurança de suas credenciais de acesso.</li>
              <li>Usernames reservados pelo sistema (<code className="bg-[#f5f5f5] px-1 rounded text-xs">admin</code>, <code className="bg-[#f5f5f5] px-1 rounded text-xs">api</code>, <code className="bg-[#f5f5f5] px-1 rounded text-xs">dashboard</code>, entre outros) não estão disponíveis para registro.</li>
              <li>Uma conta por pessoa. Contas duplicadas podem ser encerradas sem aviso prévio.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#333333]">4. Uso Aceitável</h2>
            <p className="text-sm text-[#555555] leading-relaxed">É <strong>proibido</strong> utilizar o Linqu.es para:</p>
            <ul className="text-sm text-[#555555] leading-relaxed space-y-2 list-disc list-inside">
              <li>Publicar conteúdo ilegal, ofensivo, discriminatório ou que infrinja direitos de terceiros.</li>
              <li>Distribuir malware, phishing ou links que visem prejudicar outros usuários.</li>
              <li>Fazer scraping, mineração de dados ou acessar a plataforma por meios automatizados não autorizados.</li>
              <li>Usar a plataforma para spam ou comunicações comerciais não solicitadas.</li>
              <li>Tentar comprometer a segurança, disponibilidade ou integridade do serviço.</li>
              <li>Personificar outra pessoa ou entidade de forma enganosa.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#333333]">5. Planos e Limitações</h2>
            <div className="text-sm text-[#555555] leading-relaxed space-y-2">
              <p><strong>Plano Gratuito:</strong> até 5 links ativos, acesso ao tema padrão.</p>
              <p><strong>Plano Pro:</strong> links ilimitados, acesso a todos os temas (incluindo temas animados e WebGL), e funcionalidades avançadas de personalização.</p>
              <p>O Linqu.es reserva-se o direito de alterar as condições dos planos mediante aviso prévio de 30 dias.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#333333]">6. Conteúdo do Usuário</h2>
            <p className="text-sm text-[#555555] leading-relaxed">
              Você retém a propriedade do conteúdo que publica. Ao publicar, você concede ao Linqu.es uma licença não exclusiva, gratuita e mundial para exibir e distribuir esse conteúdo exclusivamente para fins de operação do serviço. Removemos conteúdo que viole estes termos sem aviso prévio.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#333333]">7. Encerramento de Conta</h2>
            <p className="text-sm text-[#555555] leading-relaxed">
              Você pode encerrar sua conta a qualquer momento pelo painel ou entrando em contato conosco. Reservamo-nos o direito de suspender ou encerrar contas que violem estes termos. Após o encerramento, seus dados podem ser excluídos permanentemente.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#333333]">8. Disponibilidade do Serviço</h2>
            <p className="text-sm text-[#555555] leading-relaxed">
              O Linqu.es é fornecido "como está". Não garantimos disponibilidade ininterrupta do serviço. Podemos suspender, modificar ou encerrar o serviço a qualquer momento, com ou sem aviso.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#333333]">9. Limitação de Responsabilidade</h2>
            <p className="text-sm text-[#555555] leading-relaxed">
              Na máxima extensão permitida por lei, o Linqu.es não se responsabiliza por danos indiretos, incidentais ou consequentes decorrentes do uso ou impossibilidade de uso da plataforma.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#333333]">10. Alterações nos Termos</h2>
            <p className="text-sm text-[#555555] leading-relaxed">
              Podemos atualizar estes termos periodicamente. Mudanças relevantes serão comunicadas por email ou aviso na plataforma. O uso continuado após a vigência das alterações implica aceitação.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-[#333333]">11. Lei Aplicável</h2>
            <p className="text-sm text-[#555555] leading-relaxed">
              Estes termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca de São Paulo/SP para dirimir eventuais conflitos.
            </p>
          </section>

          <div className="pt-4 border-t border-[#D9D9D9]">
            <p className="text-xs text-[#BFBFBF]">
              Dúvidas? Entre em contato:{' '}
              <a href="mailto:contato@linqu.es" className="text-[#0B76A0] hover:underline">contato@linqu.es</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
