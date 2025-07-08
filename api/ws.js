// Handler específico para WebSocket na Vercel
import { createServer } from 'http';
import express from 'express';
import { WebSocketServer } from 'ws';

// Para gerenciamento de WebSockets na Vercel, usamos uma abordagem específica
export default (req, res) => {
  // Como o WebSocket não é nativamente suportado em funções serverless,
  // redirecionamos para uma opção alternativa em produção
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      message: 'Endpoint WebSocket. Conecte-se usando um cliente WebSocket.',
      environment: process.env.NODE_ENV || 'development',
      status: 'online'
    });
    return;
  }

  // Para requisições OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).end();
    return;
  }

  // Todas as outras requisições
  res.status(405).json({ error: 'Method not allowed' });
};