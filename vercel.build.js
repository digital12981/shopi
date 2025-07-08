// Script de build para o ambiente Vercel
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Função para executar comandos shell com promessas
function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao executar: ${command}`);
        console.error(stderr);
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

async function main() {
  try {
    console.log('Iniciando build para Vercel...');
    
    // Etapa 1: Build do cliente com Vite
    console.log('Building frontend...');
    await execPromise('vite build');
    
    // Etapa 2: Build do servidor com ESBuild
    console.log('Building backend...');
    await execPromise('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist');
    
    console.log('Build concluído com sucesso!');
  } catch (error) {
    console.error('Erro durante o build:', error);
    process.exit(1);
  }
}

main();