// Configuração adicional para a Vercel
module.exports = {
  // Especificar o diretório onde os arquivos estáticos estão localizados
  publicRuntimeConfig: {
    staticFolder: '/static',
  },
  // Configurações para o servidor
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },
};