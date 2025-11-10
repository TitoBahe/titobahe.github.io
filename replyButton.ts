let intersectionObserver: IntersectionObserver | null = null;

console.log('[Fullzapp ReplyButton] 🟢 Script carregado e injetado. V1.3');

function writeTextInTextarea(messageId: string) {
    console.log(`[Fullzapp ReplyButton] ✏️ Inserindo texto na textarea para ID: ${messageId}`);
  
    const tiptapEditor = document.querySelector<HTMLTextAreaElement>(
      'textarea.mt-1.rounded-md.w-full.border-none.flex.items-center.justify-center.text-md.resize-none.outline-none.overflow-y-auto'
    );
  
    if (tiptapEditor) {
      // 🔥 Simula um clique real no campo (ativa os listeners do app)
      tiptapEditor.click();
      console.log('[Fullzapp ReplyButton] 👆 Campo de texto clicado.');
  
      // 🔥 Garante que o foco está realmente no textarea
      tiptapEditor.focus();
      console.log('[Fullzapp ReplyButton] 🔍 Campo de texto focado.');
  
      // 🔥 Prepara e insere o texto
      const textoInserir = `@Responder🗣️: [${messageId}]\n---------------------------------\n` + tiptapEditor.value;
      tiptapEditor.value = textoInserir;
  
      // 🔥 Dispara o evento 'input' para o sistema reconhecer a alteração
      const inputEvent = new InputEvent('input', { bubbles: true, cancelable: true });
      tiptapEditor.dispatchEvent(inputEvent);
  
      console.log('[Fullzapp ReplyButton] ✅ Texto inserido e evento disparado.');
    } else {
      console.warn('[Fullzapp ReplyButton] ⚠️ Tiptap não encontrada.');
    }
  }
  

function createReplyButton(el: HTMLElement, messageId: string) {
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
    marginLeft: '4px',
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
  // 🔥 Verifica se o painel já existe
  const panel = document.querySelector('#conversation-panel');
  if (!panel) {
    console.warn('[Fullzapp ReplyButton] ❌ Painel de conversa não encontrado. Tentando novamente em 500ms...');
    setTimeout(replyButton, 500); // tenta novamente
    return;
  }

  console.log('[Fullzapp ReplyButton] 🚀 Executando função replyButton()');
  const elements = panel.querySelectorAll('[id^="message-menu-btn-"]');
  console.log(`[Fullzapp ReplyButton] 🔍 Encontrados ${elements.length} elementos no painel.`);

  if (!elements.length) return;

  if (intersectionObserver) {
    console.log('[Fullzapp ReplyButton] 🔄 Desconectando IntersectionObserver anterior...');
    intersectionObserver.disconnect();
  }

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
    { root: panel, threshold: 0.1 }
  );

  elements.forEach(el => {
    console.log(`[Fullzapp ReplyButton] 👁️ Observando elemento: ${el.id}`);
    intersectionObserver!.observe(el);
  });

  console.log('[Fullzapp ReplyButton] 🟢 Observação iniciada com sucesso.');
}

// ✅ Observa o DOM inteiro até o painel existir
const observer_replyButton = new MutationObserver(replyButton);
observer_replyButton.observe(document.body, { childList: true, subtree: true });

// ✅ Executa assim que o DOM terminar de carregar
document.addEventListener('DOMContentLoaded', replyButton);
