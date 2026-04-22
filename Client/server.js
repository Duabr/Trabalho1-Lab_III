/**
 * Servidor estático do front-end + proxy das rotas REST para o backend.
 * Variáveis: PORT (padrão 3001), API_URL (padrão http://127.0.0.1:3000).
 *
 * Importante: não usar app.use('/users', proxy) — o Express remove o prefixo e o
 * backend recebia GET / em vez de GET /users. Usamos pathFilter no caminho completo.
 */
const path = require('path');
const http = require('http');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const API_TARGET = process.env.API_URL || 'http://127.0.0.1:3000';
const PREFERRED_PORT = Number(process.env.PORT) || 3001;
const MAX_PORT_TRIES = 15;

const app = express();

const apiProxy = createProxyMiddleware({
    target: API_TARGET,
    changeOrigin: true,
    pathFilter: (pathname) =>
        pathname.startsWith('/users') ||
        pathname.startsWith('/conversion-history'),
});

app.use(apiProxy);

app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
let port = PREFERRED_PORT;

function listenNext() {
    server.once('error', onListenError);
    server.listen(port, () => {
        console.log(`Front-end: http://localhost:${port}`);
        console.log(`Proxy para API: ${API_TARGET}`);
    });
}

function onListenError(err) {
    if (err.code !== 'EADDRINUSE') {
        console.error(err);
        process.exit(1);
    }
    const tried = port;
    port += 1;
    if (port > PREFERRED_PORT + MAX_PORT_TRIES) {
        console.error(
            'Nenhuma porta livre no intervalo. Defina PORT no ambiente ou libere uma porta.'
        );
        process.exit(1);
    }
    console.warn(`Porta ${tried} em uso; tentando ${port}…`);
    listenNext();
}

listenNext();
