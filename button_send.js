
async function fetchToRetrieveDataFromDB(locationId){
    
    const options= {
        method: "POST", 
        body: JSON.stringify({
            locationId:locationId, 
        }),
        headers:{
             "Content-type": "application/json"
        }
    }

    await fetch("https://fullzapp.com/userButtonStatus", options)
    .then((response)=>{
        if(response.ok){
            //aqui ele transforma o valor do body do response em um objeto javascript de forma assincrona, por isso usamos o then novamente, já que o valor retornado pelo primeiro then sempre se torna o parametro para o proximo
            return response.json();
        }
        else{
            console.error('Error ao retirar dados do servidor pelo userButton');
        }
    })
    .then((data)=>{
        const {status} = data;
        
            if(status === true || status === "true"){
                
                document.getElementById('buttonUserName1').style.backgroundColor = '#668cff';
            }
            else{
                document.getElementById('buttonUserName1').style.backgroundColor = '#ffffff';
            }
    })
    .catch((err)=>{
        console.error('erro ao tentar enviar dados ao servidor: ', err.message);
    });

}

async function sendMsg(){
    const targetDiv = document.querySelector('div[data-v-67277b2d].flex.h-10.ml-auto');

    const currentURL = window.location.href;
    const match = currentURL.match(/location\/([a-zA-Z0-9]+)/);
    if (!match) {
        console.error("No locationId found from the url.");
    } 
    const locationId = match[1]; 
    console.log("Captured locationId:", locationId);

    //caso exista, tirar a cor a partir do estatus selecionado antes.
    if(targetDiv && !document.getElementById('setSupporterButton1'))
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

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#f0f0f0'; // Cinza claro
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#ffffff'; // Cor original
        });
        button.addEventListener('click',async (e)=>{

            const options= {
                method: "POST", 
                body: JSON.stringify({
                    locationId:locationId, 
                }),
                headers:{
                     "Content-type": "application/json"
                }
            }
            await fetch("https://fullzapp.com/userButtonChanged", options)
            .then((response) => {
                if (response.ok) {
                    // Aguarda o parsing do JSON
                    return response.json();
                } else {
                    console.error("Erro ao retirar dados do servidor pelo userButton status not 200");
                }
            })
            .then((data) => {
                // Lógica de troca de cor com base no status
                const { status } = data;
                if (status === true || status === "true") {
                    button.style.backgroundColor = "#668cff";
                } else {
                    button.style.backgroundColor = "#ffffff";
                }
            })
            .catch((err)=>{
                console.error('erro ao tentar enviar dados ao servidor: ', err.message);
            })
        });

        const img = document.createElement('img');
        img.src = 'https://titobahe.github.io/users.svg';
        img.alt = 'userName';
        img.style.width = '20px';
        img.style.height = '20px';
        button.appendChild(img);

        container.appendChild(button);
        targetDiv.appendChild(container);
        
        await fetchToRetrieveDataFromDB(button, locationId);
    }
    else {
        console.log('Botão já existe ou targetDiv não encontrado.');
    }
}

const observer = new MutationObserver(sendMsg);

observer.observe(document.body, { childList: true, subtree: true });

document.addEventListener('DOMContentLoaded', sendMsg);
