(function () {
    function setActiveSection(name) {
        const tabs = document.querySelectorAll('.tab-btn');
        const panels = document.querySelectorAll('.section-panel');

        tabs.forEach((t) => {
            const active = t.dataset.section === name;
            t.classList.toggle('active', active);
            t.setAttribute('aria-selected', active ? 'true' : 'false');
        });

        panels.forEach((p) => {
            const id = p.id.replace('panel-', '');
            p.classList.toggle('active', id === name);
        });
    }

    document.querySelectorAll('.tab-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            setActiveSection(btn.dataset.section);
            if (btn.dataset.section === 'usuarios') {
                window.UsersUI.carregarLista();
            }
            if (btn.dataset.section === 'conversoes') {
                window.ConversionsUI.carregarHistorico();
            }
        });
    });

    window.UsersUI.init(function (users) {
        window.dispatchEvent(
            new CustomEvent('users:updated', { detail: users })
        );
    });

    window.ConversionsUI.init();

    setActiveSection('conversoes');
})();
