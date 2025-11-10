function writeTextInTextarea(messageId: string) {
    const tiptapEditor = document.querySelector<HTMLTextAreaElement>(
        'textarea.mt-1.rounded-md.w-full.border-none.flex.items-center.justify-center.text-md.resize-none.outline-none.overflow-y-auto'
    );

    if (tiptapEditor) {
        const textoInserir = `@Responder🗣️: [${messageId}]\n---------------------------------\n` + tiptapEditor.value;
        tiptapEditor.value = textoInserir;

        const inputEvent = new InputEvent('input', { bubbles: true, cancelable: true });
        tiptapEditor.dispatchEvent(inputEvent);
        tiptapEditor.focus();
    } else {
        console.log('tiptap não encontrada');
    }
}

function createReplyButton(el: HTMLElement, messageId: string) {
    // evita duplicar
    if (el.nextSibling && (el.nextSibling as HTMLElement).id === `replyButton-fullzapp-${messageId}`) return;

    const newBtn = document.createElement('button');
    newBtn.id = `replyButton-fullzapp-${messageId}`;
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

    newBtn.addEventListener('click', (e: PointerEvent) => {
        e.stopPropagation();
        const btn = e.currentTarget as HTMLButtonElement;
        const messageId = btn.dataset.messageId;
        if (!messageId) {
            console.error('ID da mensagem não encontrado');
            return;
        }
        writeTextInTextarea(messageId);
    });

    const img = document.createElement('img');
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
    const elements = document.querySelectorAll('[id^="message-menu-btn-"]');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target as HTMLElement;
                    const id = el.id;
                    const parts = id.split('-');
                    const messageId = parts[parts.length - 1] || '';
                    createReplyButton(el, messageId);

                    // Para de observar depois de criar o botão (não precisa mais)
                    observer.unobserve(el);
                }
            });
        },
        {
            root: null, // viewport
            threshold: 0.1, // aparece 10% do elemento = visível
        }
    );

    elements.forEach(el => observer.observe(el));
}

// observa novos elementos no DOM e aplica o mesmo comportamento
const mutationObserver = new MutationObserver(replyButton);
mutationObserver.observe(document.body, { childList: true, subtree: true });

document.addEventListener('DOMContentLoaded', replyButton);
