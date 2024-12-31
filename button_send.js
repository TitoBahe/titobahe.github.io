
function sendMsg(){
    const targetDiv = document.querySelector('div[data-v-67277b2d].flex.h-10.ml-auto');

    const currentURL = window.location.href;
    const match = currentURL.match(/location\/([a-zA-Z0-9]+)/);
    if (!match) {
        console.error("No locationId found from the url.");
    } 
    const locationId = match[1]; 
    console.log("Captured locationId:", locationId);

    //caso exista, tirar a cor a partir do estatus selecionado antes.
    if(targetDiv && !targetDiv.querySelector('.setSupporterButton'))
    {   

        const container = document.createElement('div');
        container.className = 'setSupporterButton'; // Classe identificadora
        container.style.position = 'relative';
        container.id = 'setSupporterButton1';

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
        button.id = 'buttonUserName1';

        button.addEventListener('click',async (e)=>{

            button.style.backgroundColor = '#668cff';

        });

        const img = document.createElement('img');
        img.src = 'https://titobahe.github.io/users.svg';
        img.alt = 'userName';
        img.style.width = '20px';
        img.style.height = '20px';
        button.appendChild(img);

        container.appendChild(button);
        targetDiv.appendChild(container);
        
    }
    else {
        console.log('Botão já existe ou targetDiv não encontrado.');
    }
}

const observer = new MutationObserver(sendMsg);

observer.observe(document.body, { childList: true, subtree: true });

document.addEventListener('DOMContentLoaded', sendMsg);
