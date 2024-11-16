<textarea data-v-37554ae1="" id="text-message" type="textarea" rows="4" class="w-full text-gray-700 border-none outline-none text-area" placeholder="Type a message"></textarea>


function inserirBotao() {
    const text_message = document.querySelector('#text-message');

    if (!originalTextArea) return;

    text_message.addEventListener('dblclick', ()=>{
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
  
          // Caixa de texto maior
          const largeTextArea = document.createElement('textarea');
          largeTextArea.style.flexGrow = '1';
          largeTextArea.style.width = '100%';
          largeTextArea.style.marginBottom = '10px';
          largeTextArea.value = originalTextArea.value; // Preenche com o texto atual
          modal.appendChild(largeTextArea);
  
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
  
          // Função para fechar o modal e salvar o texto
          function closeModal() {
              originalTextArea.value = largeTextArea.value; // Atualiza o texto na caixa original
              document.body.removeChild(modal); // Remove o modal
          }
  
          // Evento para o botão enviar
          sendButton.addEventListener('click', closeModal);
  
          // Evento para a tecla Enter
          largeTextArea.addEventListener('keydown', (e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  closeModal();
            }
        });
      
    });
}

// Observa mudanças no DOM para detectar a div alvo e garantir a presença do botão
const observer = new MutationObserver(inserirBotao);
observer.observe(document.body, { childList: true, subtree: true });

// Ou aguarda o carregamento total do DOM como segunda opção
document.addEventListener('DOMContentLoaded', inserirBotao);