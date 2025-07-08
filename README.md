# Shopee Delivery Partners

Uma plataforma inovadora para recrutamento de entregadores para a Shopee, otimizando o processo de onboarding digital para o mercado brasileiro.

## 🚀 Opções de Deploy (Atualizado Abril 2025)

Este projeto pode ser implantado de diferentes maneiras:

### 1. Deploy com Vite em modo Dev no Heroku (Recomendado)

Para implantar o aplicativo completo no Heroku com o Vite em modo de desenvolvimento, igual ao preview da Replit:

1. Já configuramos o Procfile principal para usar nosso servidor Vite standalone:
   ```
   web: NODE_ENV=development node heroku-vite-server-standalone.js
   ```
   
   > Nota: Esta abordagem usa o Vite em modo de desenvolvimento, igual ao preview da Replit
   > O servidor `heroku-vite-server-standalone.js` é uma versão independente que não requer transpilação de TypeScript

2. Certifique-se de que você tem o buildpack Node.js configurado:
   ```bash
   heroku buildpacks:set heroku/nodejs
   ```

3. Se estiver usando o PostgreSQL, adicione também:
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

4. Faça o deploy para o Heroku:
   ```bash
   git push heroku main
   ```

5. Se estiver encontrando qualquer erro, execute:
   ```bash
   heroku logs --tail
   ```

### 2. Frontend em serviço de hospedagem estática (Netlify/Vercel) + Backend no Heroku

Esta abordagem é uma alternativa caso o deploy unificado não funcione:

#### Frontend (Netlify ou Vercel)

1. Configure o repositório no Netlify/Vercel
2. Netlify: Arquivo `netlify.toml` já configurado com as regras corretas
3. Vercel: Arquivo `vercel.json` com configurações otimizadas
4. Configure a variável de ambiente no serviço:
   - `API_URL`: URL da sua API no Heroku (ex: https://sua-app-api.herokuapp.com)

#### Backend (Heroku)

1. Use o Procfile.api-only:
   ```bash
   cp Procfile.api-only Procfile
   ```
   
2. Faça deploy para o Heroku:
   ```bash
   git push heroku main
   ```

## 🔧 Solução de Problemas (Atualizado Abril 2025)

Se encontrar problemas com a aplicação no Heroku:

### Abordagem preferencial - Vite em modo Dev

Nossa nova solução usa o Vite em modo de desenvolvimento diretamente no Heroku, da mesma forma que funciona no preview da Replit:

1. Use o servidor Vite standalone:
   ```bash
   # Atualizar Procfile para usar o servidor Vite standalone
   echo "web: NODE_ENV=development node heroku-vite-server-standalone.js" > Procfile
   git add Procfile
   git commit -m "Use Vite development server standalone"
   git push heroku main
   ```

2. Vantagens desta abordagem:
   - Funciona igual ao preview da Replit (onde já sabemos que funciona)
   - Não depende de assets compilados
   - Não tem problemas de caminho de assets
   - Suporta hot-reloading (se configurado)

3. Esta abordagem é a mais confiável pois:
   - Evita a complexidade de servir arquivos estáticos
   - Resolve diferenças entre ambientes de desenvolvimento e produção
   - Elimina a necessidade de processo de build

4. Depois de fazer o deploy, verifique os logs para confirmar:
   ```bash
   heroku logs --tail
   ```
   
   Você deve ver: "Servidor Vite rodando na porta XXXX (modo desenvolvimento)"

### Solução alternativa: Servidor simplificado para assets estáticos

Se preferir usar uma abordagem tradicional com arquivos estáticos:

1. Configure o Procfile para usar o servidor simplificado:
   ```bash
   echo "web: node heroku-simple-server.js" > Procfile
   git add Procfile
   git commit -m "Use simplified server"
   git push heroku main
   ```

2. Este servidor é configurado para corrigir problemas comuns:
   - Detecta e corrige caminhos absolutos para relativos
   - Adiciona indicador visual durante o carregamento
   - Tenta caminhos alternativos se o original falhar
   - Evita template literals aninhados que causam erros

### Solução para tipos específicos de erro

#### Erro: SyntaxError: missing ) after argument list
Este erro acontece por causa de template literals aninhados no código. Use o `heroku-vite-server-standalone.js` ou `heroku-simple-server.js`.

#### Erro: ERR_MODULE_NOT_FOUND: shared/schema.js
Este erro ocorre porque o arquivo TypeScript não foi transpilado. Use o servidor standalone: `heroku-vite-server-standalone.js`.

#### Erro: Blocked request. This host is not allowed
Este erro ocorre porque o Vite bloqueia domínios personalizados. Nossa versão mais recente do arquivo `heroku-vite-server-standalone.js` já inclui `allowedHosts: 'all'` para resolver isso.

#### Erro: Cannot find module
Verifique se todas as dependências estão no `package.json` e que `npm install` foi executado durante o build do Heroku.

#### Página branca (sem erro no console)
O melhor é usar o `heroku-vite-server-standalone.js` que evita completamente esse problema.

### Alternativa de última instância

Se mesmo com o servidor Vite você continuar tendo problemas, considere separar o frontend e backend:
1. Frontend no Netlify/Vercel (já temos arquivos de configuração prontos)
2. Backend no Heroku (use o `api-server.js` específico para esse caso)

## 📁 Estrutura do Projeto

- `/client`: Código frontend em React/TypeScript
- `/server`: API backend com Express
- `/shared`: Esquemas e tipos compartilhados
- `/dist`: Arquivos compilados para produção 
- `/heroku-vite-server-standalone.js`: Servidor Vite standalone (MAIS RECOMENDADO)
- `/heroku-vite-server.js`: Servidor Vite que requer transpilação do schema.ts
- `/heroku-simple-server.js`: Servidor simplificado para servir assets estáticos
- `/heroku-server.js`: Servidor avançado para assets estáticos (pode ter problemas de sintaxe)
- `/heroku-rebuild-server.js`: Servidor que executa build antes de servir
- `/static-server.js`: Servidor estático alternativo para testes
- `/api-server.js`: Servidor apenas para API (usado no deploy separado)

## 🛠️ Tecnologias

- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, Express, PostgreSQL
- **Deploy**: Heroku, Netlify, Vercel (configurações para todos)
- **Autenticação**: JWT, Sessions
- **Pagamentos**: PIX integração
- **Performance**: Server-side caching, gzip compression

## 📝 Notas de desenvolvimento

Os arquivos de configuração `.buildpacks`, `app.json`, `static.json`, `nginx_app.conf` existem para facilitar o deploy e otimizar a entrega de conteúdo estático no Heroku. Não é necessário modificá-los, mas eles contêm importantes configurações de performance e segurança.