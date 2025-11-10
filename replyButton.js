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
    // evita duplicar
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
        if (!messageId) {
            console.error('ID da mensagem não encontrado');
            return;
        }
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
    var elements = document.querySelectorAll('[id^="message-menu-btn-"]');
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var el = entry.target;
                var id = el.id;
                var parts = id.split('-');
                var messageId = parts[parts.length - 1] || '';
                createReplyButton(el, messageId);
                // Para de observar depois de criar o botão (não precisa mais)
                observer.unobserve(el);
            }
        });
    }, {
        root: null, // viewport
        threshold: 0.1, // aparece 10% do elemento = visível
    });
    elements.forEach(function (el) { return observer.observe(el); });
}
// observa novos elementos no DOM e aplica o mesmo comportamento
var mutationObserver = new MutationObserver(replyButton);
mutationObserver.observe(document.body, { childList: true, subtree: true });
document.addEventListener('DOMContentLoaded', replyButton);
