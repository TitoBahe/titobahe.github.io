function writeTextInTextarea(messageId: string) {
    const tiptapEditor = document.querySelector<HTMLTextAreaElement>(
        'textarea.mt-1.rounded-md.w-full.border-none.flex.items-center.justify-center.text-md.resize-none.outline-none.overflow-y-auto'
    );

    if (tiptapEditor) {
        // prepara o texto que vai ser inserido antes do conteúdo existente
        const textoInserir = `@Responder🗣️: [${messageId}]\n---------------------------------\n` + tiptapEditor.value;

        // atualiza o valor da textarea
        tiptapEditor.value = textoInserir;

        // dispara o evento 'input' para o sistema reconhecer a alteração
        const inputEvent = new InputEvent('input', { bubbles: true, cancelable: true });
        tiptapEditor.dispatchEvent(inputEvent);

        // foca na textarea
        tiptapEditor.focus();
    } else {
        console.log('tiptap não encontrada');
    }
}

function replyButton() {
    const elements = document.querySelectorAll('[id^="message-menu-btn-"]');

    if (elements.length === 0) {
        console.warn('Nenhum elemento encontrado no replyButton');
        return;
    }

    elements.forEach(el => {
        const id = el.id;
        const parts = id.split('-');
        const messageId = parts[parts.length - 1];

        // evita criar botões duplicados
        if (el.nextSibling && (el.nextSibling as HTMLElement).id === 'replyButton-fullzapp') return;

        // cria o botão
        const newBtn = document.createElement('button');
        newBtn.id = `replyButton-fullzapp-${messageId}`;
        newBtn.title = 'Responder';
        newBtn.style.width = '20px';
        newBtn.style.height = '10px';
        newBtn.style.marginLeft = '8px';
        newBtn.style.border = 'none';
        newBtn.style.background = 'transparent';
        newBtn.style.padding = '0';
        newBtn.style.cursor = 'pointer';
        newBtn.style.display = 'flex';
        newBtn.style.alignItems = 'center';
        newBtn.style.justifyContent = 'center';
        newBtn.setAttribute('data-message-id', messageId as string);

        newBtn.addEventListener('click', (e: PointerEvent,) => {
            e.stopPropagation();
            const messageId = (e.target as HTMLButtonElement).getAttribute('data-message-id');
            if (!messageId) {
                console.error('ID da mensagem não encontrado');
                return;
            }
            writeTextInTextarea(messageId);
        });

        // cria a imagem dentro do botão
        const img = document.createElement('img');
        img.src = 'https://titobahe.github.io/reply-svgrepo-com.svg';
        img.alt = 'Reply';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        img.style.display = 'block';

        // adiciona a imagem dentro do botão
        newBtn.appendChild(img);

        // adiciona o botão após o elemento
        el.insertAdjacentElement('afterend', newBtn);
    });
}

const observer_replyButton = new MutationObserver(replyButton);
observer_replyButton.observe(document.body, { childList: true, subtree: true });

document.addEventListener('DOMContentLoaded', replyButton);
