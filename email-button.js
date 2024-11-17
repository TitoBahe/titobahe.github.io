console.log("Script carregado com sucesso!");

function inserirBotao() {
    const targetDiv = document.querySelector('div[data-v-ccaf9bb2].flex.h-10.ml-auto');

    // Verifica se o botão já existe para evitar duplicação
    if (targetDiv && !targetDiv.querySelector('.meu-botao')) {
        const button = document.createElement('button');
        button.textContent = 'Meu Botão';
        button.className = 'meu-botao'; // Adiciona uma classe para identificar o botão
        button.style.marginLeft = '10px';
        targetDiv.appendChild(button);
    }
}

// Observa mudanças no DOM para detectar a div alvo e garantir a presença do botão
const observer = new MutationObserver(inserirBotao);
observer.observe(document.body, { childList: true, subtree: true });

// Ou aguarda o carregamento total do DOM como segunda opção
document.addEventListener('DOMContentLoaded', inserirBotao);