(function () {
    const API_BASE =
        typeof window !== 'undefined' && window.__API_BASE__ !== undefined
            ? window.__API_BASE__
            : '';

    /**
     * @param {string} path
     * @param {RequestInit} [options]
     * @returns {Promise<any>}
     */
    async function fetchJson(path, options = {}) {
        const url = `${API_BASE}${path}`;
        const headers = { ...options.headers };
        if (
            options.body &&
            typeof options.body === 'string' &&
            !headers['Content-Type']
        ) {
            headers['Content-Type'] = 'application/json';
        }
        const res = await fetch(url, { ...options, headers });

        if (res.status === 204) {
            return null;
        }

        const text = await res.text();
        let data = null;
        if (text) {
            try {
                data = JSON.parse(text);
            } catch {
                data = { error: text };
            }
        }

        if (!res.ok) {
            let msg =
                (data && (data.error || data.erro)) ||
                mensagemAmigavel(res.status);
            if (typeof msg === 'string' && msg.includes('<!DOCTYPE')) {
                msg =
                    'Resposta inválida (HTML em vez de JSON). Use npm start na pasta Client e deixe o backend da API rodando; o navegador deve abrir a URL do front-end (proxy), não só a API.';
            }
            const err = new Error(msg);
            err.status = res.status;
            err.body = data;
            throw err;
        }

        return data;
    }

    function mensagemAmigavel(status) {
        if (status === 400) return 'Requisição inválida.';
        if (status === 404) return 'Recurso não encontrado.';
        if (status === 409) return 'Conflito: dado já existente.';
        return `Erro HTTP ${status}.`;
    }

    window.Api = {
        API_BASE,
        fetchJson,
    };
})();
