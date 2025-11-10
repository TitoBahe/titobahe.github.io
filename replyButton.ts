let intersectionObserver: IntersectionObserver | null = null;

console.log('[Fullzapp ReplyButton] 🟢 Script carregado e injetado.');

function writeTextInTextarea(messageId: string) {
  console.log(`[Fullzapp ReplyButton] ✏️ Inserindo texto na textarea para ID: ${messageId}`);

  const tiptapEditor = document.querySelector<HTMLTextAreaElement>(
    'textarea.mt-1.rounded-md.w-full.border-none.flex.items-center.justify-center.text-md.resize-none.outline-none.overflow-y-auto'
  );

  if (tiptapEditor) {
    const textoInserir = `@Responder🗣️: [${messageId}]\n---------------------------------\n` + tiptapEditor.value;
    tiptapEditor.value = textoInserir;

    const inputEvent = new InputEvent('input', { bubbles: true, cancelable: true });
    tiptapEditor.dispatchEvent(inputEvent);
    tiptapEditor.focus();

    console.log('[Fullzapp ReplyButton] ✅ Texto inserido com sucesso.');
  } else {
    console.warn('[Fullzapp ReplyButton] ⚠️ Tiptap não encontrada.');
  }
}

function createReplyButton(el: HTMLElement, messageId: string) {
  // evita criar duplicado
  if (el.nextSibling && (el.nextSibling as HTMLElement).id === `replyButton-fullzapp-${messageId}`) {
    console.log(`[Fullzapp ReplyButton] ⏭️ Botão já existe para ${messageId}, ignorando.`);
    return;
  }

  console.log(`[Fullzapp ReplyButton] 🧩 Criando botão de reply para ID: ${messageId}`);

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
    const btn = e.currentTarget as HTMLButtonElement;
    const messageId = btn.dataset.messageId;
    console.log(`[Fullzapp ReplyButton] 🖱️ Clique detectado no botão (${messageId})`);
    e.stopPropagation();
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
  console.log(`[Fullzapp ReplyButton] ✅ Botão criado e adicionado ao DOM (${messageId})`);
}

function replyButton() {
  console.log('[Fullzapp ReplyButton] 🚀 Executando função replyButton()');

  // Encontra apenas dentro do painel de conversa
  const panel = document.querySelector('#conversation-panel');
  if (!panel) {
    console.warn('[Fullzapp ReplyButton] ❌ Painel de conversa não encontrado.');
    return;
  }

  const elements = panel.querySelectorAll('[id^="message-menu-btn-"]');
  console.log(`[Fullzapp ReplyButton] 🔍 Encontrados ${elements.length} elementos no painel.`);

  if (!elements.length) return;

  // Desconecta observador anterior (se existir)
  if (intersectionObserver) {
    console.log('[Fullzapp ReplyButton] 🔄 Desconectando IntersectionObserver anterior...');
    intersectionObserver.disconnect();
  }

  // Cria um único observer global
  console.log('[Fullzapp ReplyButton] 🧠 Criando novo IntersectionObserver...');
  intersectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const parts = el.id.split('-');
          const messageId = parts[parts.length - 1] || '';
          console.log(`[Fullzapp ReplyButton] 👀 Elemento visível: ${messageId}`);
          createReplyButton(el, messageId);
          intersectionObserver?.unobserve(el);
        }
      }
    },
    { root: document.querySelector('#conversation-panel'), threshold: 0.1 }
  );

  elements.forEach(el => {
    console.log(`[Fullzapp ReplyButton] 👁️ Observando elemento: ${el.id}`);
    intersectionObserver!.observe(el);
  });

  console.log('[Fullzapp ReplyButton] 🟢 Observação iniciada com sucesso.');
}

// Atualiza apenas quando novas mensagens entram no painel
const mutationObserver = new MutationObserver(() => {
  console.log('[Fullzapp ReplyButton] ⚙️ MutationObserver detectou mudança no painel.');
  replyButton();
});

const conversationPanel = document.querySelector('#conversation-panel');
if (conversationPanel) {
  console.log('[Fullzapp ReplyButton] 🔄 Iniciando observação de novas mensagens...');
  mutationObserver.observe(conversationPanel, { childList: true, subtree: true });
} else {
  console.warn('[Fullzapp ReplyButton] ⚠️ Painel #conversation-panel não encontrado no carregamento inicial.');
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('[Fullzapp ReplyButton] 🌐 DOM completamente carregado, iniciando...');
  replyButton();
});
