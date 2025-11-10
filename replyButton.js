var intersectionObserver = null;
console.log('[Fullzapp ReplyButton] 🟢 Script carregado e injetado. V1.4');
function writeTextInTextarea(messageId) {
    console.log("[Fullzapp ReplyButton] \u270F\uFE0F Inserindo texto para ID: ".concat(messageId));
    // 🧩 1️⃣ Tenta achar o textarea (como antes)
    var tiptapEditor = document.querySelector('textarea.mt-1.rounded-md.w-full.border-none.flex.items-center.justify-center.text-md.resize-none.outline-none.overflow-y-auto');
    // 🧩 2️⃣ Busca o container principal
    var mainPanel = document.querySelector('#conversations-central-panel-viewer');
    if (!mainPanel) {
        console.warn('[Fullzapp ReplyButton] ⚠️ Container principal não encontrado.');
    }
    // 🧩 3️⃣ Busca o input de composição SOMENTE dentro do painel
    var composerInput = mainPanel === null || mainPanel === void 0 ? void 0 : mainPanel.querySelector('input[id^="composer-input-"]');
    // 🧩 4️⃣ Define qual campo usar
    var target = tiptapEditor || composerInput;
    if (target) {
        console.log("[Fullzapp ReplyButton] \uD83E\uDDE0 Campo encontrado: ".concat(tiptapEditor ? 'textarea' : 'input dentro do painel'));
        // 🔥 Simula clique real
        target.click();
        console.log('[Fullzapp ReplyButton] 👆 Clique simulado no campo.');
        // 🔥 Garante foco
        target.focus();
        console.log('[Fullzapp ReplyButton] 🔍 Foco aplicado.');
        // 🔥 Insere o texto formatado
        var textoInserir = "@Responder\uD83D\uDDE3\uFE0F: [".concat(messageId, "]\n---------------------------------\n") + target.value;
        target.value = textoInserir;
        // 🔥 Dispara evento 'input'
        var inputEvent = new InputEvent('input', { bubbles: true, cancelable: true });
        target.dispatchEvent(inputEvent);
        console.log('[Fullzapp ReplyButton] ✅ Texto inserido e evento disparado.');
    }
    else {
        console.warn('[Fullzapp ReplyButton] ⚠️ Nenhum campo de texto encontrado (textarea ou composer input).');
    }
}
function createReplyButton(el, messageId) {
    if (el.nextSibling && el.nextSibling.id === "replyButton-fullzapp-".concat(messageId)) {
        console.log("[Fullzapp ReplyButton] \u23ED\uFE0F Bot\u00E3o j\u00E1 existe para ".concat(messageId, ", ignorando."));
        return;
    }
    console.log("[Fullzapp ReplyButton] \uD83E\uDDE9 Criando bot\u00E3o de reply para ID: ".concat(messageId));
    var newBtn = document.createElement('button');
    newBtn.id = "replyButton-fullzapp-".concat(messageId);
    newBtn.title = 'Responder';
    newBtn.dataset.messageId = messageId;
    Object.assign(newBtn.style, {
        width: '20px',
        height: '10px',
        marginLeft: '4px',
        border: 'none',
        background: 'transparent',
        padding: '0',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    });
    newBtn.addEventListener('click', function (e) {
        var btn = e.currentTarget;
        var messageId = btn.dataset.messageId;
        console.log("[Fullzapp ReplyButton] \uD83D\uDDB1\uFE0F Clique detectado no bot\u00E3o (".concat(messageId, ")"));
        e.stopPropagation();
        if (messageId)
            writeTextInTextarea(messageId);
    });
    var img = document.createElement('img');
    img.src = 'https://titobahe.github.io/reply-svgrepo-com.svg';
    img.alt = 'Reply';
    Object.assign(img.style, {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block',
    });
    newBtn.appendChild(img);
    el.insertAdjacentElement('afterend', newBtn);
    console.log("[Fullzapp ReplyButton] \u2705 Bot\u00E3o criado e adicionado ao DOM (".concat(messageId, ")"));
}
function replyButton() {
    // 🔥 Verifica se o painel já existe
    var panel = document.querySelector('#conversation-panel');
    if (!panel) {
        console.warn('[Fullzapp ReplyButton] ❌ Painel de conversa não encontrado. Tentando novamente em 500ms...');
        setTimeout(replyButton, 500); // tenta novamente
        return;
    }
    console.log('[Fullzapp ReplyButton] 🚀 Executando função replyButton()');
    var elements = panel.querySelectorAll('[id^="message-menu-btn-"]');
    console.log("[Fullzapp ReplyButton] \uD83D\uDD0D Encontrados ".concat(elements.length, " elementos no painel."));
    if (!elements.length)
        return;
    if (intersectionObserver) {
        console.log('[Fullzapp ReplyButton] 🔄 Desconectando IntersectionObserver anterior...');
        intersectionObserver.disconnect();
    }
    console.log('[Fullzapp ReplyButton] 🧠 Criando novo IntersectionObserver...');
    intersectionObserver = new IntersectionObserver(function (entries) {
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
            var entry = entries_1[_i];
            if (entry.isIntersecting) {
                var el = entry.target;
                var parts = el.id.split('-');
                var messageId = parts[parts.length - 1] || '';
                console.log("[Fullzapp ReplyButton] \uD83D\uDC40 Elemento vis\u00EDvel: ".concat(messageId));
                createReplyButton(el, messageId);
                intersectionObserver === null || intersectionObserver === void 0 ? void 0 : intersectionObserver.unobserve(el);
            }
        }
    }, { root: panel, threshold: 0.1 });
    elements.forEach(function (el) {
        console.log("[Fullzapp ReplyButton] \uD83D\uDC41\uFE0F Observando elemento: ".concat(el.id));
        intersectionObserver.observe(el);
    });
    console.log('[Fullzapp ReplyButton] 🟢 Observação iniciada com sucesso.');
}
// ✅ Observa o DOM inteiro até o painel existir
var observer_replyButton = new MutationObserver(replyButton);
observer_replyButton.observe(document.body, { childList: true, subtree: true });
// ✅ Executa assim que o DOM terminar de carregar
document.addEventListener('DOMContentLoaded', replyButton);
