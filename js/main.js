document.getElementById('btnConverter').addEventListener('click', function() {
    const inputField = document.getElementById('numberInput');
    const msgErro = document.getElementById('msgErro');
    const numero = inputField.value.trim();
    
    const baseOrigem = parseInt(document.getElementById('baseOrigem').value);
    const baseDestino = parseInt(document.getElementById('baseDestino').value);
    
    // Resetando estados (esconde erro e resultado antes de validar)
    msgErro.classList.add('hidden');
    document.getElementById('resultadoContainer').classList.add('hidden');

    // Dentro do evento de clique do botão, substitua o fetch por:
    converterNumero({ numero, baseOrigem, baseDestino })
        .then(data => {
            const container = document.getElementById('resultadoContainer');
            const texto = document.getElementById('resultadoTexto');
            container.classList.remove('hidden');
            texto.innerText = data.resultado;
            document.getElementById('statusBanco').innerText = "Status: " + data.status;
        })
    .catch(error => {
        msgErro.innerText = error.message;
        msgErro.classList.remove('hidden');
    });
});