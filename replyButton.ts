let intersectionObserver: IntersectionObserver | null = null;

console.log('[Fullzapp ReplyButton] 🟢 Script carregado e injetado. V2.3');

async function writeTextInTextarea(messageId: string, type: 'reply' | 'delete' | 'edit') {
  console.log(`[Fullzapp ${type}Button] ✏️ Inserindo texto para ID: ${messageId}`);

  // 🧩 1️⃣ Localiza o painel principal
  const mainPanel = document.querySelector('#conversations-central-panel-viewer');
  if (!mainPanel) {
    console.warn(`[Fullzapp ${type}Button] ⚠️ Painel principal não encontrado.`);
    return;
  }

  // 🧩 2️⃣ Busca o input inicial (antes de abrir o textarea)
  const composerInput = mainPanel.querySelector<HTMLInputElement>('input[id^="composer-input-"]');

  // 🧩 3️⃣ Busca o textarea (caso já esteja aberto)
  let tiptapEditor = document.querySelector<HTMLTextAreaElement>(
    'textarea.mt-1.rounded-md.w-full.border-none.flex.items-center.justify-center.text-md.resize-none.outline-none.overflow-y-auto'
  );

  // 🔥 Se o textarea ainda não existir, clica no input para forçar abrir
  if (!tiptapEditor && composerInput) {
    console.log(`[Fullzapp ${type}Button] 🖱️ Clicando no composer input para abrir editor...`);
    composerInput.click();

    // Espera o textarea aparecer (até 1 segundo)
    await new Promise(resolve => {
      const checkInterval = setInterval(() => {
        tiptapEditor = document.querySelector<HTMLTextAreaElement>(
          'textarea.mt-1.rounded-md.w-full.border-none.flex.items-center.justify-center.text-md.resize-none.outline-none.overflow-y-auto'
        );
        if (tiptapEditor) {
          clearInterval(checkInterval);
          resolve(true);
        }
      }, 100);

      setTimeout(() => {
        clearInterval(checkInterval);
        resolve(false);
      }, 1000);
    });
  }

  // 🧩 4️⃣ Verifica se o textarea foi encontrado após o clique
  if (!tiptapEditor) {
    console.warn('[Fullzapp ReplyButton] ⚠️ Nenhum campo de texto disponível (nem textarea, nem input funcional).');
    return;
  }

  console.log('[Fullzapp ReplyButton] 🧠 Campo de texto final detectado, inserindo mensagem...');

  // 🔥 Clica e foca no textarea para ativar
  tiptapEditor.click();
  tiptapEditor.focus();

  // 🔥 Prepara o texto
  let textoInserir = '';
  switch (type) {
    case 'reply':
      textoInserir = `@Responder🗣️: [${messageId}]\n---------------------------------\n` + tiptapEditor.value;
      break;
    case 'delete':
      textoInserir = `@Deletar🗑️: [${messageId}]` + tiptapEditor.value;
      break;
    case 'edit':
      break;
  }
  
  tiptapEditor.value = textoInserir;

  // 🔥 Dispara o evento input
  const inputEvent = new InputEvent('input', { bubbles: true, cancelable: true });
  tiptapEditor.dispatchEvent(inputEvent);

  console.log('[Fullzapp ReplyButton] ✅ Texto inserido com sucesso.');
}

function createDeleteMessageButton(el: HTMLElement, messageId: string) {

  if (el.nextSibling && (el.nextSibling as HTMLElement).id === `deleteMessageButton-fullzapp-${messageId}`) {
    console.log(`[Fullzapp DeleteMessageButton] ⏭️ Botão já existe para ${messageId}, ignorando.`);
    return;
  }

  console.log(`[Fullzapp DeleteMessageButton] 🧩 Criando botão de delete message para ID: ${messageId}`);

  const newBtn = document.createElement('button');
  newBtn.id = `deleteMessageButton-fullzapp-${messageId}`;
  newBtn.title = 'Deletar Mensagem';
  newBtn.dataset.messageId = messageId;

  Object.assign(newBtn.style, {
    width: '20px',
    height: '10px',
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
    console.log(`[Fullzapp DeleteMessageButton] 🖱️ Clique detectado no botão (${messageId})`);
    e.stopPropagation();
    if (messageId) writeTextInTextarea(messageId, 'delete');
  });

  const img = document.createElement('img');
  img.src = 'https://titobahe.github.io/delete-2-svgrepo-com.svg';
  img.alt = 'Delete';
  Object.assign(img.style, {
    width: '120%',
    height: '120%',
    objectFit: 'contain',
    display: 'block',
  });

  newBtn.appendChild(img);
  // el.insertAdjacentElement('afterend', newBtn);
  console.log(`[Fullzapp DeleteMessageButton] ✅ Botão criado e adicionado ao DOM (${messageId})`);
  return newBtn;
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
    if (messageId) writeTextInTextarea(messageId, 'reply');
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
  // el.insertAdjacentElement('afterend', newBtn);
  console.log(`[Fullzapp ReplyButton] ✅ Botão criado e adicionado ao DOM (${messageId})`);
  return newBtn;
}

function createButtonsContainer(el: HTMLElement, messageId: string) {

  if (el.nextSibling && (el.nextSibling as HTMLElement).id === `buttonsContainer-fullzapp-${messageId}`) {
    console.log(`[Fullzapp ReplyButton] ⏭️ Container já existe para ${messageId}, ignorando.`);
    return;
  }

  console.log(`[Fullzapp ReplyButton] 🧩 Criando container para ID: ${messageId}`);

  const newContainer = document.createElement('div');
  newContainer.id = `buttonsContainer-fullzapp-${messageId}`;
  newContainer.style.display = 'flex';
  newContainer.style.alignItems = 'center';
  newContainer.style.justifyContent = 'center';
  newContainer.style.marginLeft = '2px';
  newContainer.style.gap = '2px';

  newContainer.appendChild(createReplyButton(el, messageId) as HTMLButtonElement);
  newContainer.appendChild(createDeleteMessageButton(el, messageId) as HTMLButtonElement);
  el.insertAdjacentElement('afterend', newContainer);
  console.log(`[Fullzapp ReplyButton] ✅ Container criado e adicionado ao DOM (${messageId})`);
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
          createButtonsContainer(el, messageId);
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
