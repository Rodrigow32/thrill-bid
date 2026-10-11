# Thrill Bid

Desenvolva uma plataforma web responsiva de Leilão de Centavos (Penny Auction). O sistema possui 3 atores principais (Gestor/Admin, Parceiro Comercial e Usuário Comum) e lógica de contagem regressiva em tempo real.

Na vitrine principal, mantenha os leilões ativos visíveis em grid enquanto a disputa abre em um painel lateral dinâmico (além da página de detalhe).

### 1. MODELO DE NEGÓCIO E REGRAS:
- Usuários Comuns: Podem assinar planos (Gratuito com lances limitados ou Pago com pacote mensal de lances) e comprar pacotes avulsos de lances a qualquer momento.
- Parceiros (Lojistas): Cadastram itens para leilão. Os itens entram como "Rascunho do Parceiro" e dependem da aprovação e agendamento da Gestão.
- Mecânica do Leilão: O item começa em R$ 0,00 com um cronômetro regressivo (ex: 15 segundos). Cada clique de usuário consome 1 lance da sua carteira, soma um valor fixo predefinido ao item (ex: R$ 0,01) e reinicia o cronômetro para 15 segundos. O último a clicar antes do cronômetro zerar vence.
- Registro de Cliques: Toda ação de clique gera um registro imutável em uma tabela de histórico (ID, Usuário, Timestamp exato com milissegundos e Valor Atual).

### 2. ESTRUTURA DE ARQUITETURA DE TELAS:

#### A. HOME / VITRINE DO SITE (Pública)
- Seção de Filtros por Categorias Especiais: "Geral", "Só para Mulheres", "Iniciantes (Apenas quem nunca arrematou)", etc.
- Grid de Cards de Itens: Exibir imagem do item (Suporte a foto ou GIF), título, preço atual dinâmico, nome do último usuário que deu lance, e o cronômetro regressivo piscando.
- Página / Painel de Detalhe do Item: Exibe a imagem/GIF ampliada, descrição do item (fornecida pelo parceiro), botão gigante "DAR LANCE" (que muda o contador), tabela em tempo real com as últimas 10 "Mapeadas/Cliques" daquele item, e aviso de quando o leilão começará se estiver agendado.

#### B. DASHBOARD DA GESTÃO (ADMIN)
- Painel de Aprovação: Visualizar e aprovar itens enviados pelos parceiros.
- Agendamento de Leilões: Tela para definir a data/hora de início de um leilão aprovado, definir o valor do incremento por clique (ex: R$ 0,01) e selecionar a categoria restrita (ex: iniciantes).
- Relatórios Gerais: Volume total de lances comprados, receita de planos, e listagem de leilões finalizados mostrando o ganhador oficial baseado no último registro de timestamp.

#### C. DASHBOARD DO PARCEIRO (COMÉRCIO)
- Formulário de Cadastro de Itens: Upload de Imagem/GIF, Título, Descrição Comercial, Valor de Mercado e Categoria Sugerida.
- Tela de Acompanhamento: Lista dos itens enviados com status ("Pendente", "Aprovado", "Leiloado"). Exibe a receita gerada com o arremate final do item (caso finalizado).

#### D. DASHBOARD DO USUÁRIO COMUM
- Carteira de Lances: Saldo atual de lances (ex: "Você tem 45 lances"). Botões para comprar novos pacotes de lances e indicador do plano ativo (Gratuito vs Pago).
- Histórico Pessoal: Seção "Meus Arremates" (itens vencidos) e "Histórico de Participação".

### 3. COMPORTAMENTO E DESIGN VISUAL:
- Estilo minimalista e altamente focado em gatilhos de urgência (Estilo SaaS/E-commerce Premium).
- Cores: Fundo limpo, elementos de cronômetro em vermelho/laranja neon piscante quando faltarem menos de 5 segundos, e botões de CTA intuitivos.
- Estados reativos para simular os cliques no frontend (ao clicar no botão, decrementar -1 lance do usuário fictício logado, resetar o relógio local e adicionar uma linha na tabela de logs para fins de demonstração visual).
- Alterne facilmente entre as visões de Usuário, Parceiro e Admin no topo da aplicação para testar todos os fluxos.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://thrill-bid.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7cb0f351-fc8b-4a03-8b83-9381e744b2c4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
