const API_URL = 'http://localhost:3000';

async function converterNumero(dados) {
    try {
        const response = await fetch(`${API_URL}/converter`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            const erroData = await response.json();
            throw new Error(erroData.erro || 'Erro na conversão');
        }

        return await response.json();
    } catch (error) {
        console.error("Erro na API:", error);
        throw error;
    }
}