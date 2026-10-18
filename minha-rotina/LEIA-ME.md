# Minha Rotina — guia de configuração

App web de checklist diário, evolução e agenda da semana. Abre igual no celular e no computador, com login, e os dados ficam sincronizados pelo Supabase.

**O que vai ser usado (tudo no plano gratuito):**
- **Supabase:** guarda os dados e cuida do login.
- **GitHub:** guarda o código.
- **Vercel:** publica o site e gera o link.

Tempo total: uns 20 minutos.

---

## 1. Criar o projeto no Supabase

1. Entre em supabase.com e faça login (pode ser com a conta do GitHub).
2. Clique em **New project**.
3. Dê um nome, por exemplo `minha-rotina`, crie uma senha para o banco (guarde, mas o app não usa) e escolha a região **South America (São Paulo)**.
4. Clique em **Create new project** e espere 1 ou 2 minutos.

## 2. Criar as tabelas

1. No menu lateral, abra **SQL Editor**.
2. Clique em **New query**.
3. Abra o arquivo `supabase/schema.sql` deste projeto, copie tudo e cole no editor.
4. Clique em **Run**. A mensagem esperada é "Success. No rows returned".

Isso cria as duas tabelas (`dias` e `rotina`) com a regra de segurança que faz cada pessoa ver apenas os próprios dados.

## 3. Copiar o endereço e a chave do projeto

1. No topo do projeto, clique em **Connect**. Outra forma é ir em **Project Settings > API Keys**.
2. Copie e guarde estes dois valores:
   - **Project URL:** algo como `https://abcdefgh.supabase.co`.
   - **Publishable key:** começa com `sb_publishable_`. Se o projeto mostrar só a chave antiga, use a **anon key**, que também funciona.

Essas duas informações podem ficar no site sem problema, porque quem protege os dados são as regras do passo 2. Nunca use a **secret key** nem a **service_role** no app.

## 4. Subir o código no GitHub

1. Em github.com, clique em **New repository**, dê o nome `minha-rotina` e crie.
2. Na página do repositório, clique em **uploading an existing file**.
3. Arraste todos os arquivos e pastas deste projeto (`index.html`, `package.json`, `vercel.json`, `src`, `public`, `supabase` e os demais).
4. Clique em **Commit changes**.

Se você usa o Antigravity, também pode abrir esta pasta nele e pedir para subir no GitHub.

## 5. Publicar no Vercel

1. Em vercel.com, clique em **Add New... > Project** e importe o repositório `minha-rotina`.
2. O Vercel reconhece o projeto como **Vite** sozinho. Não mude nada no build.
3. Abra **Environment Variables** e cadastre:

   | Name | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | o Project URL do passo 3 |
   | `VITE_SUPABASE_KEY` | a publishable key (ou anon key) do passo 3 |

4. Clique em **Deploy**. Ao terminar, copie o link do site, por exemplo `https://minha-rotina.vercel.app`.

O arquivo `vercel.json` já traz a configuração SPA: atualizar a página ou abrir um link direto, como `/evolucao`, continua funcionando.

Se você esquecer as variáveis, o app abre uma tela avisando "Falta configurar o Supabase". Para corrigir, cadastre as variáveis em **Settings > Environment Variables** e faça um **Redeploy**.

## 6. Avisar ao Supabase qual é o link do site

1. No Supabase, vá em **Authentication > URL Configuration**.
2. Em **Site URL**, cole o link do Vercel.
3. Em **Redirect URLs**, adicione o mesmo link.
4. Salve.

Sem isso, o link do e-mail de confirmação da conta leva para o endereço errado.

## 7. Criar a conta do seu amigo

1. Abra o link do Vercel e toque em **Primeiro acesso? Criar conta**.
2. Digite o e-mail e uma senha com pelo menos 6 caracteres.
3. Abra o e-mail de confirmação enviado pelo Supabase e clique no link.
4. Volte ao app e entre com o mesmo e-mail e senha.

## 8. Fechar o app para outras pessoas (recomendado)

Depois que a conta dele existir:

1. No Supabase, vá em **Authentication > Sign In / Providers**.
2. Desative **Allow new users to sign up**.

Assim ninguém mais consegue criar conta no link. Mesmo sem esse passo, ninguém veria os dados dele, mas assim fica mais organizado.

## 9. Instalar no celular

- **Android (Chrome):** abra o link, toque nos três pontinhos e escolha **Instalar app** ou **Adicionar à tela inicial**.
- **iPhone (Safari):** abra o link, toque em **Compartilhar** e escolha **Adicionar à Tela de Início**.

O app ganha ícone e abre em tela cheia. No computador, basta abrir o mesmo link e entrar com o mesmo e-mail e senha.

## 10. Trazer o histórico da versão antiga (se ele já usou o arquivo .html)

1. No arquivo antigo, vá em **Evolução > Baixar cópia de segurança**.
2. No app novo, vá em **Evolução > Restaurar de uma cópia** e escolha esse arquivo.

---

## Como a sincronização funciona

- Cada marcação é enviada para o Supabase em cerca de 1 segundo. O indicador no topo mostra **Salvando…** e depois **Sincronizado**.
- Com os dois aparelhos abertos ao mesmo tempo, o outro atualiza na hora. Se o outro estiver fechado, ele atualiza ao abrir o app ou ao voltar para ele.
- **Sem internet:** o app continua funcionando, o indicador mostra **Sem internet · X para enviar**, e tudo é enviado assim que a conexão volta.
- Se o mesmo dia for alterado em dois aparelhos, vale a alteração mais recente.

## Bom saber

- **Plano gratuito do Supabase:** o projeto é pausado depois de cerca de uma semana sem nenhum acesso. Com uso diário, isso não acontece. Se pausar, basta entrar no painel do Supabase e clicar em **Restore project**.
- **Mudanças no app:** altere os arquivos no GitHub, ou pelo Antigravity, e o Vercel publica a nova versão sozinho.
- **Rodar no computador (opcional):** copie `.env.example` para `.env`, preencha os dois valores e rode `npm install` e depois `npm run dev`.

## Estrutura do projeto

```
index.html              página única do app (SPA)
src/main.js             lógica: checklist, evolução, semana, editor, login e sincronização
src/style.css           visual (tema claro e escuro automático)
src/agenda.json         agenda planejada da semana (aba Semana)
public/                 ícones, manifest (instalar no celular) e sw.js (funcionar offline)
supabase/schema.sql     tabelas e regras de segurança
vercel.json             configuração SPA para o Vercel
.env.example            modelo das variáveis do Supabase
```

A rotina padrão do checklist fica em `src/main.js`, na função `rotinaPadrao`. As alterações feitas pela aba **Rotina** do app ficam salvas na conta e substituem o padrão.
