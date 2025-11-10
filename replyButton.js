var intersectionObserver = null;
function writeTextInTextarea(messageId) {
    var tiptapEditor = document.querySelector('textarea.mt-1.rounded-md.w-full.border-none.flex.items-center.justify-center.text-md.resize-none.outline-none.overflow-y-auto');
    if (tiptapEditor) {
        var textoInserir = "@Responder\uD83D\uDDE3\uFE0F: [".concat(messageId, "]\n---------------------------------\n") + tiptapEditor.value;
        tiptapEditor.value = textoInserir;
        var inputEvent = new InputEvent('input', { bubbles: true, cancelable: true });
        tiptapEditor.dispatchEvent(inputEvent);
        tiptapEditor.focus();
    }
    else {
        console.log('tiptap não encontrada');
    }
}
function createReplyButton(el, messageId) {
    // evita criar duplicado
    if (el.nextSibling && el.nextSibling.id === "replyButton-fullzapp-".concat(messageId))
        return;
    var newBtn = document.createElement('button');
    newBtn.id = "replyButton-fullzapp-".concat(messageId);
    newBtn.title = 'Responder';
    newBtn.dataset.messageId = messageId;
    Object.assign(newBtn.style, {
        width: '20px',
        height: '10px',
        marginLeft: '8px',
        border: 'none',
        background: 'transparent',
        padding: '0',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    });
    newBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var btn = e.currentTarget;
        var messageId = btn.dataset.messageId;
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
}
function replyButton() {
    // Encontra apenas dentro do painel de conversa
    var panel = document.querySelector('#conversation-panel');
    if (!panel) {
        console.warn('Painel de conversa não encontrado');
        return;
    }
    var elements = panel.querySelectorAll('[id^="message-menu-btn-"]');
    if (!elements.length)
        return;
    // Desconecta observador anterior (se existir)
    if (intersectionObserver)
        intersectionObserver.disconnect();
    // Cria um único observer global
    intersectionObserver = new IntersectionObserver(function (entries) {
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
            var entry = entries_1[_i];
            if (entry.isIntersecting) {
                var el = entry.target;
                var parts = el.id.split('-');
                var messageId = parts[parts.length - 1] || '';
                createReplyButton(el, messageId);
                intersectionObserver === null || intersectionObserver === void 0 ? void 0 : intersectionObserver.unobserve(el);
            }
        }
    }, { root: document.querySelector('#conversation-panel'), threshold: 0.1 } // 👈 observa apenas dentro do painel
    );
    elements.forEach(function (el) { return intersectionObserver.observe(el); });
}
// Atualiza apenas quando novas mensagens entram no painel
var mutationObserver = new MutationObserver(function () {
    replyButton();
});
var conversationPanel = document.querySelector('#conversation-panel');
if (conversationPanel) {
    mutationObserver.observe(conversationPanel, { childList: true, subtree: true });
}
document.addEventListener('DOMContentLoaded', replyButton);
