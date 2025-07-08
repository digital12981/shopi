# Deploy no Heroku - Instruções

## Problema Resolvido
O erro que você estava enfrentando era porque o Heroku estava detectando tanto Python quanto Node.js no projeto e escolhendo o buildpack Python incorretamente.

## Configurações Aplicadas

### 1. Buildpack Correto
- Arquivo `.buildpacks` configurado para `heroku/nodejs`
- Arquivo `app.json` criado especificando explicitamente o buildpack Node.js

### 2. Procfile Simplificado
- Comando alterado para `web: node api-server.js`
- Remove variáveis de ambiente desnecessárias do comando

### 3. Variáveis de Ambiente Necessárias
Configure estas variáveis no painel do Heroku:
- `VEHICLE_API_KEY`: Sua chave da API de veículos
- `VITE_FOR4PAYMENTS_SECRET_KEY`: Sua chave da For4Payments

## Passos para Deploy

1. **Configurar Buildpack** (via CLI do Heroku):
   ```bash
   heroku buildpacks:clear -a seu-app-name
   heroku buildpacks:set heroku/nodejs -a seu-app-name
   ```

2. **Configurar Variáveis de Ambiente**:
   ```bash
   heroku config:set VEHICLE_API_KEY=sua-chave -a seu-app-name
   heroku config:set VITE_FOR4PAYMENTS_SECRET_KEY=sua-chave -a seu-app-name
   ```

3. **Deploy**:
   ```bash
   git push heroku main
   ```

## Arquivos de Configuração

- `Procfile`: Define comando de inicialização
- `app.json`: Configuração de buildpack e variáveis
- `.buildpacks`: Força uso do buildpack Node.js
- `api-server.js`: Servidor simplificado para produção

## Verificação
Após o deploy, acesse `/health` para verificar se a API está funcionando.