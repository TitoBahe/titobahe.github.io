function inserirBotaoComDropdown() {
    // const toGetParentDiv = document.getElementById('clear');
    
    // if (!toGetParentDiv) {
    //     console.error('Div pai não encontrada.');
    //     return;
    // }

    // const targetDiv = toGetParentDiv.parentElement;

    const targetDiv = document.querySelector('.flex.flex-row.gap-2.items-center.pl-2.rounded-md.flex-1.min-w-0')

    if (!targetDiv) {
        console.error('O elemento não tem um pai válido.');
        return;
    }

    // Verifica se o componente já foi inserido para evitar duplicação
    if (!targetDiv.querySelector('.meu-container')) {
        // Criação do contêiner para o botão e dropdown
        const container = document.createElement('div');
        container.className = 'meu-container'; // Classe identificadora
        container.style.position = 'relative';

        // Botão com a imagem do chip
        const button = document.createElement('button');
        button.style.padding = '10px';
        button.style.backgroundColor = '#ffffff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';

        // Altera a cor de fundo do botão ao passar o mouse
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#f0f0f0'; // Cinza claro
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#ffffff'; // Cor original
        });

        // Adiciona a imagem ao botão
        const img = document.createElement('img');
        img.src = 'https://paulorubensbarbosa.github.io/dropChips/chipAzul.png';
        img.alt = 'Chip';
        img.style.width = '20px';
        img.style.height = '20px';
        button.appendChild(img);

        // Dropdown que será exibido ao clicar no botão
        const dropdown = document.createElement('div');
        dropdown.style.display = 'none'; // Oculto por padrão
        dropdown.style.position = 'absolute';
        dropdown.style.bottom = '110%'; // Exibe o menu acima do botão
        dropdown.style.left = '0';
        dropdown.style.backgroundColor = 'white';
        dropdown.style.border = '1px solid #ccc';
        dropdown.style.borderRadius = '5px';
        dropdown.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        dropdown.style.zIndex = '1000';
        dropdown.style.padding = '10px';
        dropdown.style.maxHeight = '250px';
        dropdown.style.overflowY = 'auto';
        dropdown.style.zIndex = '1000';

        // Adiciona as opções no dropdown
        ['@chip1', '@chip2', '@chip3', '@chip4', '@chip5', '@chip6', '@chip7', '@chip8', '@chip9', '@chip10', '@chip11', '@chip12', '@chip13', '@chip14', '@chip15'].forEach(optionValue => {
            const option = document.createElement('div');
            option.textContent = optionValue;
            option.style.padding = '5px 10px';
            option.style.cursor = 'pointer';
            option.style.borderBottom = '1px solid #eee';

            // Última opção sem borda
            if (optionValue === '@chip15') {
                option.style.borderBottom = 'none';
            }

            // Evento para inserir texto na caixa de texto ao clicar na opção
            option.addEventListener('click', () => {
                const tiptapEditor = document.querySelector('textarea#text-message.w-full.text-gray-700.border-none.outline-none.text-area');

                if (tiptapEditor) {
                    const inputEvent = new InputEvent('input', {
                        bubbles: true,
                        cancelable: true,
                    });

                    // Regex para encontrar qualquer "@chipX" no início do texto
                    const chipRegex = /^@chip\d+/;

                    // Remove qualquer chip existente e adiciona o novo no início
                    tiptapEditor.value = tiptapEditor.value.replace(chipRegex, '').trim(); // Remove o chip antigo, se houver
                    tiptapEditor.value = optionValue + ' ' + tiptapEditor.value; // Adiciona o novo chip no início

                    // Dispara o evento 'input' para que o sistema reconheça a mudança
                    tiptapEditor.dispatchEvent(inputEvent);
                    tiptapEditor.focus();
                } else {
                    console.log('tiptap não encontrada');
                }

                dropdown.style.display = 'none'; // Oculta o dropdown após a seleção
            });

            dropdown.appendChild(option);
        });

        // Evento para mostrar ou esconder o dropdown
        button.addEventListener('click', () => {
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });

        // Insere os elementos no contêiner
        container.appendChild(button);
        container.appendChild(dropdown);

        // Adiciona o contêiner à div alvo
        targetDiv.appendChild(container);
    }
}

// Observa mudanças no DOM para detectar a div alvo e garantir a presença do componente
const observer2 = new MutationObserver(inserirBotaoComDropdown);
observer2.observe(document.body, { childList: true, subtree: true });

// Ou aguarda o carregamento total do DOM como segunda opção
document.addEventListener('DOMContentLoaded', inserirBotaoComDropdown);
