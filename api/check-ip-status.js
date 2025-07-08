// API específica para verificação de status de IP
import { db } from '../server/db.js';
import { bannedIps } from '@shared/schema';
import { eq } from 'drizzle-orm';

export default async (req, res) => {
  // Configurar CORS para esta rota
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Responder a requisição de preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Verificar se é uma requisição GET
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Obter o IP do cliente
    const clientIp = req.headers['x-forwarded-for'] || 
                     req.headers['x-real-ip'] || 
                     req.connection.remoteAddress || 
                     '0.0.0.0';
                     
    // IP confiável para desenvolvimento/testes
    const trustedIp = '201.87.251.220';
    
    // Verificar se o IP está na lista de exceções
    if (clientIp === trustedIp || clientIp.includes('127.0.0.1') || clientIp.includes('::1')) {
      res.status(200).json({
        status: 'allowed',
        message: 'IP na lista de exceções',
        ip: clientIp
      });
      return;
    }
    
    // Consultar o banco de dados para verificar se o IP está banido
    const [bannedIp] = await db
      .select()
      .from(bannedIps)
      .where(eq(bannedIps.ip, clientIp));
    
    if (bannedIp && bannedIp.isBanned) {
      res.status(403).json({
        status: 'banned',
        message: 'IP banido por violação de acesso',
        reason: bannedIp.banReason || 'Acesso via desktop não autorizado',
        ip: clientIp
      });
    } else {
      // Atualizar o último acesso para este IP
      try {
        if (bannedIp) {
          await db
            .update(bannedIps)
            .set({ lastAccess: new Date() })
            .where(eq(bannedIps.ip, clientIp));
        } else {
          // Registrar novo IP se não existir
          await db
            .insert(bannedIps)
            .values({
              ip: clientIp,
              isBanned: false,
              lastAccess: new Date(),
              accessCount: 1
            });
        }
      } catch (updateError) {
        console.error('Erro ao atualizar registro de IP:', updateError);
      }
      
      res.status(200).json({
        status: 'allowed',
        message: 'IP não está banido',
        ip: clientIp
      });
    }
  } catch (error) {
    console.error('Erro ao verificar status do IP:', error);
    res.status(500).json({ 
      error: 'Erro interno ao verificar status do IP',
      message: error.message
    });
  }
};