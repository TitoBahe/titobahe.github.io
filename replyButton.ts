let intersectionObserver: IntersectionObserver | null = null;

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
  // evita criar duplicado
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
    if (messageId) writeTextInTextarea(messageId);
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
  // Encontra apenas dentro do painel de conversa
  const panel = document.querySelector('#conversation-panel');
  if (!panel) {
    console.warn('Painel de conversa não encontrado');
    return;
  }

  const elements = panel.querySelectorAll('[id^="message-menu-btn-"]');
  if (!elements.length) return;

  // Desconecta observador anterior (se existir)
  if (intersectionObserver) intersectionObserver.disconnect();

  // Cria um único observer global
  intersectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const parts = el.id.split('-');
          const messageId = parts[parts.length - 1] || '';
          createReplyButton(el, messageId);
          intersectionObserver?.unobserve(el);
        }
      }
    },
    { root: document.querySelector('#conversation-panel'), threshold: 0.1 } // 👈 observa apenas dentro do painel
  );

  elements.forEach(el => intersectionObserver!.observe(el));
}

// Atualiza apenas quando novas mensagens entram no painel
const mutationObserver = new MutationObserver(() => {
  replyButton();
});

const conversationPanel = document.querySelector('#conversation-panel');
if (conversationPanel) {
  mutationObserver.observe(conversationPanel, { childList: true, subtree: true });
}

document.addEventListener('DOMContentLoaded', replyButton);
