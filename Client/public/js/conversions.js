(function () {
    const { fetchJson } = window.Api;

    /**
     * Espelha `listSupportedBases()` do backend (`src/enums/NumberBase.js`).
     * Sem endpoint /meta no servidor, evita divergência de radices na UI.
     */
    const SUPPORTED_BASE_OPTIONS = [
        { radix: 2, label: 'Base 2 (binária)' },
        { radix: 10, label: 'Base 10 (decimal)' },
        { radix: 16, label: 'Base 16 (hexadecimal)' },
        { radix: 36, label: 'Base 36 (alfanumérica)' },
        { radix: 60, label: 'Base 60 (sexagesimal)' },
        { radix: 64, label: 'Base 64 (codificação)' },
    ];

    const supportedRadices = SUPPORTED_BASE_OPTIONS.map((o) => o.radix);

    /** @type {Map<number, string>} */
    let userNamesById = new Map();

    function preencherSelectsBases() {
        const o = document.getElementById('baseOrigem');
        const d = document.getElementById('baseDestino');
        if (!o || !d) return;
        o.innerHTML = '';
        d.innerHTML = '';
        for (const { radix, label } of SUPPORTED_BASE_OPTIONS) {
            const text = `${radix} — ${label}`;
            o.appendChild(new Option(text, String(radix)));
            d.appendChild(new Option(text, String(radix)));
        }
        o.value = '10';
        d.value = '2';
    }

    function popularSelectUsuarios(users) {
        userNamesById = new Map(
            (users || []).map((u) => [u.id, u.name])
        );

        const sel = document.getElementById('userIdSelect');
        const filtro = document.getElementById('filtroHistoricoUser');
        if (!sel) return;

        const current = sel.value;
        const filtroVal = filtro ? filtro.value : '';

        sel.innerHTML = '';
        sel.appendChild(new Option('Selecione…', ''));
        for (const u of users || []) {
            sel.appendChild(
                new Option(`${u.id} — ${u.name}`, String(u.id))
            );
        }

        if (current && [...sel.options].some((opt) => opt.value === current)) {
            sel.value = current;
        }

        if (filtro) {
            filtro.innerHTML = '';
            filtro.appendChild(new Option('Todos', ''));
            for (const u of users || []) {
                filtro.appendChild(
                    new Option(`${u.id} — ${u.name}`, String(u.id))
                );
            }
            if (
                filtroVal &&
                [...filtro.options].some((opt) => opt.value === filtroVal)
            ) {
                filtro.value = filtroVal;
            }
        }
    }

    function nomeUsuario(uid) {
        if (uid == null) return '—';
        const n = userNamesById.get(Number(uid));
        return n != null ? n : `#${uid}`;
    }

    async function carregarHistorico() {
        const errEl = document.getElementById('historicoErro');
        const tbody = document.getElementById('historicoBody');
        const empty = document.getElementById('historicoEmpty');
        const filtro = document.getElementById('filtroHistoricoUser');
        if (!tbody || !empty) return;

        errEl.textContent = '';
        errEl.classList.add('hidden');

        let path = '/conversion-history';
        if (filtro && filtro.value) {
            path = `/conversion-history/user/${encodeURIComponent(filtro.value)}`;
        }

        try {
            const list = await fetchJson(path);
            const sorted = list.slice().sort((a, b) => (b.id || 0) - (a.id || 0));
            tbody.innerHTML = '';
            if (!sorted.length) {
                empty.classList.remove('hidden');
                return;
            }
            empty.classList.add('hidden');

            for (const row of sorted) {
                const uid = row.userId;
                const bases =
                    row.fromBaseLabel && row.toBaseLabel
                        ? `${row.fromBaseLabel} → ${row.toBaseLabel}`
                        : `${row.fromBase} → ${row.toBase}`;
                const tr = document.createElement('tr');
                tr.innerHTML = `
          <td class="num mono">${escapeHtml(String(row.id))}</td>
          <td>${escapeHtml(nomeUsuario(uid))}</td>
          <td class="mono">${escapeHtml(String(row.inputValue ?? ''))}</td>
          <td class="mono small">${escapeHtml(bases)}</td>
          <td class="mono num">${escapeHtml(String(row.resultValue ?? ''))}</td>
          <td class="row-actions">
            <button type="button" class="danger" data-del-hist="${row.id}">Excluir</button>
          </td>`;
                tbody.appendChild(tr);
            }

            tbody.querySelectorAll('[data-del-hist]').forEach((btn) => {
                btn.addEventListener('click', () =>
                    excluirHistorico(
                        parseInt(btn.getAttribute('data-del-hist'), 10)
                    )
                );
            });
        } catch (e) {
            errEl.textContent = e.message || 'Erro ao carregar histórico.';
            errEl.classList.remove('hidden');
            tbody.innerHTML = '';
            empty.classList.add('hidden');
        }
    }

    function escapeHtml(s) {
        const d = document.createElement('div');
        d.textContent = s;
        return d.innerHTML;
    }

    async function excluirHistorico(id) {
        if (!confirm('Excluir este registro do histórico?')) return;
        try {
            await fetchJson(`/conversion-history/${id}`, { method: 'DELETE' });
            await carregarHistorico();
        } catch (e) {
            const errEl = document.getElementById('historicoErro');
            errEl.textContent = e.message;
            errEl.classList.remove('hidden');
        }
    }

    async function enviarConversao(ev) {
        ev.preventDefault();
        const userId = document.getElementById('userIdSelect').value;
        const inputValue = document.getElementById('numberInput').value.trim();
        const fromBase = parseInt(document.getElementById('baseOrigem').value, 10);
        const toBase = parseInt(document.getElementById('baseDestino').value, 10);
        const btn = document.getElementById('btnConverter');
        const resBox = document.getElementById('resultadoContainer');
        const resTexto = document.getElementById('resultadoTexto');

        const banner = document.getElementById('globalBanner');
        if (banner) {
            banner.className = 'hidden';
            banner.textContent = '';
        }

        if (!userId) {
            alert('Selecione um usuário.');
            return;
        }
        if (!supportedRadices.includes(fromBase) || !supportedRadices.includes(toBase)) {
            alert('Bases inválidas.');
            return;
        }

        btn.disabled = true;
        resBox.classList.add('hidden');

        try {
            const data = await fetchJson('/conversion-history', {
                method: 'POST',
                body: JSON.stringify({
                    userId: parseInt(userId, 10),
                    inputValue,
                    fromBase,
                    toBase,
                }),
            });
            resBox.classList.remove('hidden');
            resTexto.textContent = data.resultValue ?? '';
            await carregarHistorico();
        } catch (e) {
            if (banner) {
                banner.textContent = e.message;
                banner.className = 'banner-error';
            }
        } finally {
            btn.disabled = false;
        }
    }

    function init() {
        preencherSelectsBases();

        window.addEventListener('users:updated', (ev) => {
            popularSelectUsuarios(ev.detail || []);
        });

        carregarHistorico();

        document
            .getElementById('formConversao')
            .addEventListener('submit', enviarConversao);

        const filtro = document.getElementById('filtroHistoricoUser');
        if (filtro) {
            filtro.addEventListener('change', () => carregarHistorico());
        }
    }

    window.ConversionsUI = {
        init,
        carregarHistorico,
        popularSelectUsuarios,
    };
})();
