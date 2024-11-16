function inserirBotao() {
    console.log('%c[INFO]: Tentando encontrar o textarea...', 'color: blue; font-weight: bold;');

    const text_message = document.querySelector('#text-message');

    if (!text_message) {
        console.warn('%c[WARNING]: Textarea não encontrado!', 'color: orange; font-weight: bold;');
        return;
    }

    console.log('%c[INFO]: Textarea encontrado com sucesso!', 'color: green; font-weight: bold;');

    text_message.addEventListener('dblclick', () => {
        console.log('%c[INFO]: Double-click detectado!', 'color: purple; font-weight: bold;');

        // Cria o modal para edição
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.width = '80%';
        modal.style.height = '60%';
        modal.style.backgroundColor = '#fff';
        modal.style.border = '1px solid #ccc';
        modal.style.zIndex = '1000';
        modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        modal.style.padding = '20px';
        modal.style.display = 'flex';
        modal.style.flexDirection = 'column';
        modal.style.justifyContent = 'space-between';

        console.log('%c[INFO]: Modal criado!', 'color: purple; font-weight: bold;');

        // Caixa de texto maior
        const largeTextArea = document.createElement('textarea');
        largeTextArea.style.flexGrow = '1';
        largeTextArea.style.width = '100%';
        largeTextArea.style.marginBottom = '10px';
        largeTextArea.value = text_message.value; // Preenche com o texto atual
        modal.appendChild(largeTextArea);

        console.log('%c[INFO]: Caixa de texto maior adicionada ao modal!', 'color: purple; font-weight: bold;');

        // Botão de enviar
        const sendButton = document.createElement('button');
        sendButton.textContent = 'Enviar';
        sendButton.style.padding = '10px';
        sendButton.style.backgroundColor = '#4CAF50';
        sendButton.style.color = '#fff';
        sendButton.style.border = 'none';
        sendButton.style.borderRadius = '5px';
        sendButton.style.cursor = 'pointer';

        modal.appendChild(sendButton);
        document.body.appendChild(modal);

        console.log('%c[INFO]: Botão de enviar criado e modal adicionado ao DOM!', 'color: purple; font-weight: bold;');

        // Função para fechar o modal e salvar o texto
        function closeModal() {
            console.log('%c[INFO]: Fechando modal e atualizando textarea original.', 'color: purple; font-weight: bold;');
            text_message.value = largeTextArea.value; // Atualiza o texto na caixa original
            document.body.removeChild(modal); // Remove o modal
        }

        // Evento para o botão enviar
        sendButton.addEventListener('click', closeModal);

        // Evento para a tecla Enter
        largeTextArea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                console.log('%c[INFO]: Enter pressionado, salvando e fechando modal.', 'color: purple; font-weight: bold;');
                closeModal();
            }
        });
    });
}

// Observa mudanças no DOM para detectar a div alvo e garantir a presença do botão
const observer = new MutationObserver(() => {
    console.log('%c[INFO]: Mudanças no DOM detectadas, tentando inserir o botão...', 'color: orange; font-weight: bold;');
    inserirBotao();
});
observer.observe(document.body, { childList: true, subtree: true });

console.log('%c[INFO]: Iniciando observador de mudanças no DOM.', 'color: blue; font-weight: bold;');

// Ou aguarda o carregamento total do DOM como segunda opção
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c[INFO]: DOM totalmente carregado, tentando inserir o botão...', 'color: blue; font-weight: bold;');
    inserirBotao();
});
