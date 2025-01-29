function IsMicOpen(): Promise<boolean>{
   return new Promise((resolve, reject)=>{
        navigator.permissions.query(
            { name: 'microphone' as PermissionName}
        ).then((permissionStatus)=>{
        
            console.log(permissionStatus.state); // granted, denied, prompt
        
            if(permissionStatus.state !=='granted'){
                reject(false);
            }
            resolve(true);
        })
        .catch((err)=>{
            console.error('Error in IsMicOpen: ', err);
            reject(false);
        });
   });
}

function startHearing(locationId:string, conversationId:string): Promise<MediaRecorder>{
    return new Promise((resolve, reject) => {
         navigator.mediaDevices.getUserMedia({audio: true})
        .then((stream)=>{
            let chunks: Blob[] = [];
            const mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = function (e: BlobEvent) {
                chunks.push(e.data);
            };

            mediaRecorder.onstop = async function (e){

                const audio = document.createElement("audio");
                audio.style.width = '175px';
                audio.style.height = '40px';
                audio.style.paddingBottom = '10px';
                audio.controls = true;

                console.log('Mimetype AQUI: ', mediaRecorder.mimeType);
                const blob = new Blob(chunks, { type: mediaRecorder.mimeType });

                const audioURL = window.URL.createObjectURL(blob);
                audio.src = audioURL;

                const button = document.getElementById('buttonAudioV1');

                if(!button || !(button instanceof HTMLButtonElement)){
                    console.error('butotn not found in navigator.mediaDevices.getUserMedia no then');
                    return;
                }

                const divSendButton = document.createElement('div');
                const sendButton = document.createElement('button');
                sendButton.style.borderRadius = '5px';
                sendButton.style.width = '25px';
                sendButton.style.height = '35px';
                // sendButton.style.padding = '5px 10px';
                sendButton.style.backgroundColor = '#42f54e';
                sendButton.style.display = 'flex';
                sendButton.style.alignContent = 'center';
                sendButton.style.alignItems = 'center';
                let imgSendButton = document.createElement('img');
                imgSendButton.id = 'ImageSendButton';
                imgSendButton.src = 'https://titobahe.github.io/send.svg';
                imgSendButton.alt = 'SendButton';
                imgSendButton.style.width = '15px';
                imgSendButton.style.height = '15px';
                imgSendButton.style.marginLeft = '5px';
                sendButton.appendChild(imgSendButton);
                divSendButton.appendChild(sendButton);

                sendButton.addEventListener('click', (e)=>{
                    e.stopPropagation();
                    const button = document.getElementById('buttonAudioV1');

                    if(!button){
                        console.error('Button not found in deleteButton click event');
                        return;
                    }
                    button.setAttribute('isActive', '0');
                    button.innerHTML = '';
                    const img = document.createElement('img');
                    img.id = 'ImageAudioButton';
                    img.src = 'https://titobahe.github.io/microphone.svg';
                    img.alt = 'userName';
                    img.style.width = '20px';
                    img.style.height = '20px';
                    button.appendChild(img);

                    const formData = new FormData();
                    formData.append('audio', blob, 'audio.wav');
                    formData.append('locationId', locationId);
                    formData.append('conversationId', conversationId);

                    fetch('https://fullzapp.com/audioFromButton', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => {
                        if (response.ok) {
                            console.log('Áudio enviado com sucesso!');
                        } else {
                            console.error('Falha ao enviar o áudio.');
                        }
                    })
                    .catch(err => {
                        console.error('Erro ao enviar o áudio:', err);
                    });
                });

                const divDeleteButton = document.createElement('div');
                const deleteButton = document.createElement('button');
                deleteButton.style.borderRadius = '5px';
                deleteButton.style.width = '25px';
                deleteButton.style.height = '35px';
                // deleteButton.style.padding = '5px 10px';
                deleteButton.style.backgroundColor = '#db2d21';
                deleteButton.style.display = 'flex';
                deleteButton.style.alignContent = 'center';
                deleteButton.style.alignItems = 'center';
                const imgDeleteButton = document.createElement('img');
                imgDeleteButton.id = 'ImageDeleteButton';
                imgDeleteButton.src = 'https://titobahe.github.io/delete.svg';
                imgDeleteButton.alt = 'DeleteButton';
                imgDeleteButton.style.width = '15px';
                imgDeleteButton.style.height = '15px';
                imgDeleteButton.style.marginLeft = '5px';
                deleteButton.appendChild(imgDeleteButton);
                divDeleteButton.appendChild(deleteButton);

                deleteButton.addEventListener('click', (e)=>{
                    e.stopPropagation();
                    const button = document.getElementById('buttonAudioV1');
                    if(!button){
                        console.error('Button not found in deleteButton click event');
                        return;
                    }
                    button.setAttribute('isActive', '0');
                    button.innerHTML = '';
                    const img = document.createElement('img');
                    img.id = 'ImageAudioButton';
                    img.src = 'https://titobahe.github.io/microphone.svg';
                    img.alt = 'userName';
                    img.style.width = '20px';
                    img.style.height = '20px';
                    button.appendChild(img);
                });

                button.innerHTML = '';
                button.appendChild(divSendButton);
                button.appendChild(audio);
                button.appendChild(divDeleteButton);

            }
            resolve(mediaRecorder);
            
        })
        .catch((err) =>{
            console.error('Error in navigator.mediaDevices.getUserMedia: ', err.message);   
            reject(null);
        })
    }) 
}

// function stopHearing(): Promise<string | Error>{
//     return new Promise((resolve, reject)=>{
//         navigator.mediaDevices.getUserMedia({audio: false})
//         .then(()=>{
//             resolve('');
//         })
//         .catch((err)=>{
//             console.error('Error in stopHEaring: ', err);
//             reject(err)
//         });
        
//     })
    
// }

function sendAudio(){

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("getUserMedia Not supported.");
        return;
    }

    let mediaRecorder : MediaRecorder;    
    
    const targetDiv:HTMLElement | null = document.getElementById('send-message-button-group-sms-modal')?.parentElement || null;

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
        button.style.alignItems = 'flex-start';
        button.setAttribute('isActive', '0');
        button.style.justifyContent = 'center';
        button.id = 'buttonAudioV1';

        const img = document.createElement('img');
        img.id = 'ImageAudioButton';
        img.src = 'https://titobahe.github.io/microphone.svg';
        img.alt = 'userName';
        img.style.width = '20px';
        img.style.height = '20px';
        button.appendChild(img);

        button.addEventListener('click', async (e)=>{

            const img = document.getElementById('ImageAudioButton');
            if(!img || !(img instanceof HTMLImageElement)){

                console.error('Img not found when pressed the button');
                return;
            }

            if(button.getAttribute('isActive') === '0'){
                const isOpenFlag:boolean = await IsMicOpen();
                if(!isOpenFlag){
                    return;
                }
                button.style.backgroundColor = '#db2d21';
                img.src = 'https://titobahe.github.io/stop.svg';
                button.setAttribute('isActive', '1');
                mediaRecorder = await startHearing(locationId, conversationId);
                if(mediaRecorder){
                    mediaRecorder.start();
                }
            }
            else{
                button.style.backgroundColor = '#ffffff';
                button.setAttribute('isActive', '0');
                img.src = 'https://titobahe.github.io/play.svg';
                mediaRecorder.stop();
                // await stopHearing();
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
