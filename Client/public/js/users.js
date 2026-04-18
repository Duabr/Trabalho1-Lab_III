(function () {
    const { fetchJson } = window.Api;

    let onChange = function () {};

    function setBanner(message, type) {
        const el = document.getElementById('globalBanner');
        if (!el) return;
        if (!message) {
            el.className = 'hidden';
            el.textContent = '';
            return;
        }
        el.textContent = message;
        el.className =
            type === 'error' ? 'banner-error' : 'banner-info';
    }

    function setListaErro(msg) {
        const e = document.getElementById('listaUsuariosErro');
        if (!e) return;
        if (msg) {
            e.textContent = msg;
            e.classList.remove('hidden');
        } else {
            e.textContent = '';
            e.classList.add('hidden');
        }
    }

    async function carregarLista() {
        setListaErro('');
        try {
            const users = await fetchJson('/users');
            renderLista(users);
            onChange(users);
        } catch (err) {
            setListaErro(err.message || 'Não foi possível carregar usuários.');
            onChange([]);
        }
    }

    function renderLista(users) {
        const tbody = document.getElementById('listaUsuariosBody');
        const empty = document.getElementById('listaUsuariosEmpty');
        if (!tbody || !empty) return;

        tbody.innerHTML = '';
        if (!users.length) {
            empty.classList.remove('hidden');
            return;
        }
        empty.classList.add('hidden');

        for (const u of users) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
        <td class="num mono">${escapeHtml(String(u.id))}</td>
        <td>${escapeHtml(u.name)}</td>
        <td>${escapeHtml(u.email)}</td>
        <td class="row-actions">
          <button type="button" class="ghost" data-action="edit" data-id="${u.id}">Editar</button>
          <button type="button" class="danger" data-action="del" data-id="${u.id}">Excluir</button>
        </td>`;
            tbody.appendChild(tr);
        }

        tbody.querySelectorAll('button[data-action="edit"]').forEach((btn) => {
            btn.addEventListener('click', () =>
                editar(parseInt(btn.dataset.id, 10))
            );
        });
        tbody.querySelectorAll('button[data-action="del"]').forEach((btn) => {
            btn.addEventListener('click', () =>
                excluir(parseInt(btn.dataset.id, 10))
            );
        });
    }

    function escapeHtml(s) {
        const d = document.createElement('div');
        d.textContent = s;
        return d.innerHTML;
    }

    async function editar(id) {
        try {
            const u = await fetchJson(`/users/${id}`);
            document.getElementById('editUserId').value = String(u.id);
            document.getElementById('userName').value = u.name;
            document.getElementById('userEmail').value = u.email;
            document.getElementById('formUsuarioTitulo').textContent =
                'Editar usuário';
            document.getElementById('btnCancelarEdicao').classList.remove('hidden');
        } catch (err) {
            setBanner(err.message, 'error');
        }
    }

    function resetForm() {
        document.getElementById('editUserId').value = '';
        document.getElementById('userName').value = '';
        document.getElementById('userEmail').value = '';
        document.getElementById('formUsuarioTitulo').textContent = 'Novo usuário';
        document.getElementById('btnCancelarEdicao').classList.add('hidden');
    }

    async function excluir(id) {
        if (!confirm('Excluir este usuário?')) return;
        try {
            await fetchJson(`/users/${id}`, { method: 'DELETE' });
            setBanner('Usuário excluído.', 'info');
            resetForm();
            await carregarLista();
        } catch (err) {
            setBanner(err.message, 'error');
        }
    }

    async function submitForm(ev) {
        ev.preventDefault();
        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        const editId = document.getElementById('editUserId').value;
        const btn = document.getElementById('btnSalvarUsuario');
        btn.disabled = true;
        setBanner('', null);

        try {
            if (editId) {
                await fetchJson(`/users/${editId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({ name, email }),
                });
                setBanner('Usuário atualizado.', 'info');
            } else {
                await fetchJson('/users', {
                    method: 'POST',
                    body: JSON.stringify({ name, email }),
                });
                setBanner('Usuário criado.', 'info');
            }
            resetForm();
            await carregarLista();
        } catch (err) {
            setBanner(err.message, 'error');
        } finally {
            btn.disabled = false;
        }
    }

    function init(callback) {
        onChange = typeof callback === 'function' ? callback : function () {};
        document.getElementById('formUsuario').addEventListener('submit', submitForm);
        document.getElementById('btnCancelarEdicao').addEventListener('click', () => {
            resetForm();
        });
        carregarLista();
    }

    window.UsersUI = {
        init,
        carregarLista,
    };
})();
