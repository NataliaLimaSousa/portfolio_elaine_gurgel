# Revisão pendente — redesign comercial (branch `redesign/comercial`)

Este arquivo lista o que precisa da **sua confirmação** antes de publicar a nova versão no endereço principal.

## 1. Informações marcadas "[A CONFIRMAR]" (já existiam no site)

No site público elas estão **ocultas** (não foram apagadas: continuam salvas e visíveis no painel administrativo).
Depois de confirmar cada item, edite-o no painel removendo a marcação "[A CONFIRMAR]"; ele volta a aparecer sozinho.
Para exibir tudo de novo sem revisar, basta trocar `HIDE_PENDING` para `false` em `src/lib/pending.ts`.

### Trajetória profissional (4)

- [ ] **[A CONFIRMAR] – atual** — Equipe médica [A CONFIRMAR] — Gestão de projetos e assistência cirúrgica — Jornada perioperatória e assistência direta ao paciente cirúrgico
- [ ] **2018** — Universidade Estadual do Ceará (UECE) — Docente convidada — Disciplina de enfermagem [A CONFIRMAR]
- [ ] **2011** — Governo do Estado do Ceará — Colaboradora — Contribuição na marca de 1.000 [transplantes — A CONFIRMAR]
- [ ] **2007 – 2018** — Hospital São Carlos — Enfermeira do Centro Cirúrgico e Responsável [A CONFIRMAR] — Coordenação do transoperatório do transplante hepático por 10 anos; validação e implantação de processos

### Palestras e produção científica (10)

- [ ] **2023** — Implantação de procedimento de cirurgia robótica e a responsabilidade [A CONFIRMAR] (Palestra)
- [ ] **[A CONFIRMAR]** — Processamento do material de robótica e a responsabilidade [A CONFIRMAR] (Palestra)
- [ ] **[A CONFIRMAR]** — Relato de experiência: implantação do processamento de material robótico na CME de um hospital privado de Fortaleza (com N. A. L. Magalhães e S. A. Araújo) (Congresso)
- [ ] **[A CONFIRMAR]** — Implantação do serviço de processamento de [material robótico — A CONFIRMAR] na CME de um hospital privado (Pôster)
- [ ] **[A CONFIRMAR]** — Instrumentais cirúrgicos: cuidados, manuseio e funcionalidades (Palestra)
- [ ] **[A CONFIRMAR]** — Simulação realística: situações vivenciadas na prática hospitalar (Palestra)
- [ ] **[A CONFIRMAR]** — Videocirurgia: cuidados com limpeza, preparo e esterilização (Palestra)
- [ ] **[A CONFIRMAR]** — Esterilização e manejo em Central de Material e Esterilização (Palestra)
- [ ] **2010** — Esterilização, cuidados, limpeza e manuseio com os materiais [A CONFIRMAR] (Palestra)
- [ ] **2009** — Esterilização, cuidados, limpeza e manuseio com os materiais [A CONFIRMAR] (Palestra)

### Eventos organizados (5)

- [ ] **[A CONFIRMAR]** — 16ª Jornada Norte-Nordeste de Centro Cirúrgico e Central de Esterilização
- [ ] **[A CONFIRMAR]** — Coronavírus: repercussões na linha do cuidado cirúrgico
- [ ] **[A CONFIRMAR]** — Alta performance e habilidades das equipes em cirurgias [A CONFIRMAR]
- [ ] **[A CONFIRMAR]** — Implantação de indicadores de qualidade e processo na CME
- [ ] **[A CONFIRMAR]** — 13ª Jornada Norte-Nordeste de Centro Cirúrgico e Central de Esterilização

### Rodapé

- [ ] Número do Coren-CE (`Coren-CE [A CONFIRMAR]`)

> Observação: os "números de impacto" (ex.: 14 palestras, 9 eventos) foram mantidos como estavam. Se parte desses itens ficar fora da confirmação, ajuste os números no painel.

## 2. Textos novos que escrevi e que precisam da sua aprovação

Nada abaixo traz resultados, depoimentos, certificações ou indicadores inventados, mas o **escopo dos serviços** é uma descrição proposta e precisa refletir o que você realmente oferece:

- [ ] **Navegação cirúrgica (EG CUIDAR+)**: etapas pré, trans e pós-operatório, com os itens de cada etapa (`src/content/portfolio.ts`, bloco `egCuidar`). Confirme principalmente o que você faz no trans-operatório e se há algum limite (ex.: acompanhamento presencial ou remoto).
- [ ] **Gestão Estratégica em Saúde**: as 5 frentes pedidas e a descrição de cada uma (bloco `management`).
- [ ] **Nova biografia**: o parágrafo que menciona a CUIDAR+ como iniciativa que reúne navegação cirúrgica e gestão estratégica (bloco `about`). Ajuste se houver detalhes de data, formalização (CNPJ) ou outras atuações empreendedoras que queira citar.
- [ ] **Mensagens de WhatsApp** (paciente e médico/gestor) e os textos dos botões.
- [ ] **Aviso "não substitui a equipe médica"** na seção de pacientes (recomendado manter).

## 3. Privacidade e formulário (LGPD)

- [ ] Revisar a **Política de Privacidade** (`/privacidade`); recomenda-se validação por profissional jurídico.
- [ ] Definir o **prazo de guarda** das mensagens (hoje o texto diz "pelo tempo necessário para atender ao contato") e excluí-las no painel após o atendimento.
- [ ] Confirmar o e-mail do controlador de dados (hoje: o e-mail público do site).
- [ ] As mensagens ficam no banco Redis (Upstash) conectado à Vercel e são lidas em **Painel → Mensagens recebidas**. **Não há aviso por e-mail** de novas mensagens; consulte o painel periodicamente.

## 4. Decisões técnicas a confirmar

- [ ] **Domínio oficial** para SEO (canonical, sitemap, compartilhamento): hoje usa `https://elainegurgel.com.br` (valor que já existia no código). Se o domínio real for outro, defina a variável `NEXT_PUBLIC_SITE_URL` na Vercel.
- [ ] **Imagem de compartilhamento** (`/og-image.png`, 1200×630): o arquivo não existe na pasta `public`; sem ele, links compartilhados ficam sem imagem.
- [ ] As seções novas (EG CUIDAR+ e Gestão) ainda **não têm edição pelo painel**; hoje os textos mudam no código.

## 5. Como voltar à versão anterior

- A versão anterior está preservada na branch `main` e na tag `v1-antes-redesign`.
- Nada foi publicado em produção: o redesign está na branch `redesign/comercial` (a Vercel gera um endereço de teste próprio para ela).
- Para publicar o redesign: abrir um Pull Request de `redesign/comercial` para `main` e fazer o merge.
- Para desfazer depois de publicado: `git revert` do merge, ou **Promote to Production** do deploy anterior na Vercel.
