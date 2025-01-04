
function startHearing(mediaRecorder, chunks){
    navigator.mediaDevices.getUserMedia({audio: true})
    .then((stream)=>{

        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = function (e: BlobEvent) {
            chunks.push(e.data);
        };

        mediaRecorder.onstop = function (e){


            const audio = document.createElement("audio");
            audio.style.width = '60px';
            audio.style.height = '40px';
            audio.controls = true;

            const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
            chunks = [];

            const audioURL = window.URL.createObjectURL(blob);
            audio.src = audioURL;

            const button = document.getElementById('buttonAudioV1');

            if(!button || !(button instanceof HTMLButtonElement)){
                console.error('butotn not found in navigator.mediaDevices.getUserMedia no then');
                return;
            }
            button.innerHTML = '';
            button.appendChild(audio);
        }
        
    })
    .catch((err) =>{
        console.error('Error in navigator.mediaDevices.getUserMedia: ', err.message);   
    })
}

function stopHearing(){
    navigator.mediaDevices.getUserMedia({audio: false})
    .catch((err)=>{
        console.error('Error in stopHEaring: ', err);
    });
}

function sendAudio(){

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("getUserMedia Not supported.");
        return;
    }

    let mediaRecorder : MediaRecorder;
    let chunks: Blob[] = []
    
    
    const targetDiv:Element | null = document.querySelector('div[data-v-67277b2d].flex.h-10.ml-auto');

    const currentURL:string = window.location.href;

    const match: RegExpMatchArray | null = currentURL.match(/location\/([a-zA-Z0-9]+)/);
    const match2: RegExpMatchArray | null = currentURL.match(/conversations\/conversations\/([a-zA-Z0-9]+)/);


    if (!match || !match2) {
        console.error("No locationId found from the url.");
        return;
    } 

    const locationId:string | null = match[1]; 
    const conversationId:string | null  = match2[1];

    console.log("Captured locationId:", locationId);
    console.log("Captured conversationId: ", conversationId);

    //caso exista, tirar a cor a partir do estatus selecionado antes.
    if(targetDiv && !targetDiv.querySelector('.setSupporterButton'))
    {   

        const container:HTMLDivElement = document.createElement('div');
        container.className = 'setSupporterButton'; // Classe identificadora
        container.style.position = 'relative';
        container.id = 'setSupporterButton1';

        // Botão com a imagem do chip
        const button:HTMLButtonElement = document.createElement('button');

        button.style.padding = '10px';
        button.style.backgroundColor = '#ffffff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.setAttribute('isActive', '0');
        button.style.justifyContent = 'center';
        button.id = 'buttonAudioV1';

        const img = document.createElement('img');
        img.id = 'ImageAudioButton';
        img.src = 'https://titobahe.github.io/play.svg';
        img.alt = 'userName';
        img.style.width = '20px';
        img.style.height = '20px';
        button.appendChild(img);

        button.addEventListener('click', (e)=>{
            
            const img = document.getElementById('ImageAudioButton');
            if(!img || !(img instanceof HTMLImageElement)){

                console.error('Img not found when pressed the button');
                return;
            }
            if(button.getAttribute('isActive') === '0'){
                button.style.backgroundColor = '#db2d21';
                img.src = 'https://titobahe.github.io/stop.svg';
                button.setAttribute('isActive', '1');
                startHearing(mediaRecorder, chunks);
                mediaRecorder.start();
            }
            else{
                button.style.backgroundColor = '#ffffff';
                button.setAttribute('isActive', '0');
                img.src = 'https://titobahe.github.io/play.svg';
                mediaRecorder.stop();
                stopHearing();
            }
        
        });

        container.appendChild(button);
        targetDiv.prepend(container);
        
    }
    else {
        console.log('Botão já existe ou targetDiv não encontrado.');
    }
}

const observer = new MutationObserver(sendAudio);

observer.observe(document.body, { childList: true, subtree: true });

document.addEventListener('DOMContentLoaded', sendAudio);
