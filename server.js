const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// ROTA DE CONVERSÃO
app.post('/converter', (req, res) => {
    const { numero, baseOrigem, baseDestino } = req.body;

    try {
        // A lógica matemática agora fica no servidor!
        const decimal = parseInt(numero, baseOrigem);
        
        if (isNaN(decimal)) {
            return res.status(400).json({ erro: "Número inválido para a base." });
        }

        const resultado = decimal.toString(baseDestino).toUpperCase();

        // Vou manter essa mensagem de "número convertido com sucesso" só por deixar, removam se quiser :p
        res.json({ resultado: resultado || "0", status: "Número convertido com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: "Erro interno no servidor." });
    }
});

const server = app.listen(port, () => {
    console.log(`Servidor rodando com sucesso em http://localhost:${port}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error('ERRO: A porta 3000 já está sendo usada por outro programa!');
    } else {
        console.error('Ocorreu um erro inesperado:', err);
    }
    process.exit(1);
});