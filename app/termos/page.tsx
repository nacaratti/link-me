import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Termos de Serviço" };

export default function Page() {
  return (
    <LegalPage title="Termos de Serviço" updated="17 de outubro de 2026">
      <section>
            <h2>1. Aceitação dos Termos</h2>
            <p>
              Ao criar uma conta ou utilizar os serviços do <strong>Linqu.es</strong>, você concorda com estes Termos de Serviço. Se não concordar com qualquer parte destes termos, não utilize a plataforma.
            </p>
          </section>

          <section>
            <h2>2. Descrição do Serviço</h2>
            <p>
              O Linqu.es é uma plataforma de bio links que permite aos usuários criar uma página personalizada em <code>linqu.es/seuusername</code> para reunir e compartilhar links de interesse. O serviço é oferecido nos planos <strong>Gratuito</strong> e <strong>Pro</strong>.
            </p>
          </section>

          <section>
            <h2>3. Cadastro e Conta</h2>
            <ul>
              <li>Você deve ter ao menos 13 anos para criar uma conta.</li>
              <li>O username escolhido é único e definitivo; transferências não são realizadas.</li>
              <li>Você é responsável pela segurança de suas credenciais de acesso.</li>
              <li>Usernames reservados pelo sistema (<code>admin</code>, <code>api</code>, <code>dashboard</code>, entre outros) não estão disponíveis para registro.</li>
              <li>Uma conta por pessoa. Contas duplicadas podem ser encerradas sem aviso prévio.</li>
            </ul>
          </section>

          <section>
            <h2>4. Uso Aceitável</h2>
            <p>É <strong>proibido</strong> utilizar o Linqu.es para:</p>
            <ul>
              <li>Publicar conteúdo ilegal, ofensivo, discriminatório ou que infrinja direitos de terceiros.</li>
              <li>Distribuir malware, phishing ou links que visem prejudicar outros usuários.</li>
              <li>Fazer scraping, mineração de dados ou acessar a plataforma por meios automatizados não autorizados.</li>
              <li>Usar a plataforma para spam ou comunicações comerciais não solicitadas.</li>
              <li>Tentar comprometer a segurança, disponibilidade ou integridade do serviço.</li>
              <li>Personificar outra pessoa ou entidade de forma enganosa.</li>
            </ul>
          </section>

          <section>
            <h2>5. Planos e Limitações</h2>
            <div>
              <p><strong>Plano Gratuito:</strong> até 5 links, 3 modelos de página e 4 paletas de cores.</p>
              <p><strong>Plano Pro:</strong> até 50 links, todos os modelos e paletas, estatísticas completas e página sem a marca linqu.es.</p>
              <p>O Linqu.es reserva-se o direito de alterar as condições dos planos mediante aviso prévio de 30 dias.</p>
            </div>
          </section>

          <section>
            <h2>6. Conteúdo do Usuário</h2>
            <p>
              Você retém a propriedade do conteúdo que publica. Ao publicar, você concede ao Linqu.es uma licença não exclusiva, gratuita e mundial para exibir e distribuir esse conteúdo exclusivamente para fins de operação do serviço. Removemos conteúdo que viole estes termos sem aviso prévio.
            </p>
          </section>

          <section>
            <h2>7. Encerramento de Conta</h2>
            <p>
              Você pode encerrar sua conta a qualquer momento pelo painel ou entrando em contato conosco. Reservamo-nos o direito de suspender ou encerrar contas que violem estes termos. Após o encerramento, seus dados podem ser excluídos permanentemente.
            </p>
          </section>

          <section>
            <h2>8. Disponibilidade do Serviço</h2>
            <p>
              O Linqu.es é fornecido &ldquo;como está&rdquo;. Não garantimos disponibilidade ininterrupta do serviço. Podemos suspender, modificar ou encerrar o serviço a qualquer momento, com ou sem aviso.
            </p>
          </section>

          <section>
            <h2>9. Limitação de Responsabilidade</h2>
            <p>
              Na máxima extensão permitida por lei, o Linqu.es não se responsabiliza por danos indiretos, incidentais ou consequentes decorrentes do uso ou impossibilidade de uso da plataforma.
            </p>
          </section>

          <section>
            <h2>10. Alterações nos Termos</h2>
            <p>
              Podemos atualizar estes termos periodicamente. Mudanças relevantes serão comunicadas por email ou aviso na plataforma. O uso continuado após a vigência das alterações implica aceitação.
            </p>
          </section>

          <section>
            <h2>11. Lei Aplicável</h2>
            <p>
              Estes termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca de São Paulo/SP para dirimir eventuais conflitos.
            </p>
          </section>
    </LegalPage>
  );
}
