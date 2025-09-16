function IsMicOpen_cloud(): Promise<boolean>{
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

 async function loadLameFromCDN() {
    if ((window as any).lamejs) return (window as any).lamejs;
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/lamejs@1.2.0/lame.min.js";
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Falha ao carregar lamejs do CDN"));
      document.head.appendChild(s);
    });
    return (window as any).lamejs;
  }

 async function resampleTo44100Mono(buf: AudioBuffer, targetRate = 44100) {
    // OfflineAudioContext com 1 canal resampleia e faz downmix para mono automaticamente
    const length = Math.ceil(buf.duration * targetRate);
    const offline = new OfflineAudioContext(1, length, targetRate);
    const src = offline.createBufferSource();
    src.buffer = buf;
    src.connect(offline.destination);
    src.start(0);
    const rendered = await offline.startRendering(); // AudioBuffer mono @ 44.1k
    const mono = rendered.getChannelData(0); // Float32 [-1..1]
    return { samples: floatTo16BitPCM(mono), sampleRate: targetRate };
  }
  
  // (você já tem estas, mantendo aqui só para referência)
  function floatTo16BitPCM(f32: Float32Array): Int16Array {
    const out = new Int16Array(f32.length);
    for (let i = 0; i < f32.length; i++) {
      const s = Math.max(-1, Math.min(1, f32[i]));
      out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return out;
  }
  
  async function decodeToAudioBuffer(blob: Blob): Promise<AudioBuffer> {
    const ab = await blob.arrayBuffer();
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    return new Promise((res, rej) => ctx.decodeAudioData(ab, res, rej));
  }
  
  async function encodeMp3Mono(
    samples16: Int16Array,
    sampleRate: number,
    bitrateKbps = 128
  ): Promise<Blob> {
    const { Mp3Encoder } = await loadLameFromCDN();
    const encoder = new Mp3Encoder(1, sampleRate, bitrateKbps);
    const frame = 1152;
    const mp3Chunks: Uint8Array[] = [];
    for (let i = 0; i < samples16.length; i += frame) {
      const slice = samples16.subarray(i, i + frame);
      const buf = encoder.encodeBuffer(slice);
      if (buf.length) mp3Chunks.push(buf);
    }
    const end = encoder.flush();
    if (end.length) mp3Chunks.push(end);
    return new Blob(mp3Chunks, { type: "audio/mpeg" });
  }
  
 
 function startHearing_cloud(locationId:string, conversationId:string, contactId:string): Promise<MediaRecorder>{
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
                 const blob = new Blob(chunks, { type: `audio/mpeg` });
 
                 const audioURL = window.URL.createObjectURL(blob);
                 audio.src = audioURL;
 
                 const button = document.getElementById('buttonAudioV1Cloud');
 
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
                 imgSendButton.id = 'ImageSendButtonCloud';
                 imgSendButton.src = 'https://titobahe.github.io/send.svg';
                 imgSendButton.alt = 'SendButton';
                 imgSendButton.style.width = '15px';
                 imgSendButton.style.height = '15px';
                 imgSendButton.style.marginLeft = '5px';
                 sendButton.appendChild(imgSendButton);
                 divSendButton.appendChild(sendButton);
 
                 sendButton.addEventListener('click', async (e)=>{
                     e.stopPropagation();
                     const button = document.getElementById('buttonAudioV1Cloud');
 
                     if(!button){
                         console.error('Button not found in deleteButton click event');
                         return;
                     }
                     button.setAttribute('isActive', '0');
                     button.innerHTML = '';
                     const img = document.createElement('img');
                     img.id = 'ImageAudioButtonCloud';
                     img.src = 'https://titobahe.github.io/voice-svgrepo-com.svg';
                     img.alt = 'userName';
                     img.style.width = '20px';
                     img.style.height = '20px';
                     button.appendChild(img);

                     const recorded = new Blob(chunks, {
                        type: chunks[0]?.type || mediaRecorder.mimeType || "audio/webm",
                      });
                    
                      try {
                        // 1) decodifica para PCM
                        const audioBuffer = await decodeToAudioBuffer(recorded);
                    
                        // 2) RESAMPLE + MONO em 44.1kHz (chave para compatibilidade no mobile)
                        const { samples, sampleRate } = await resampleTo44100Mono(audioBuffer, 44100);
                    
                        // 3) MP3 CBR 128 kbps
                        const mp3Blob = await encodeMp3Mono(samples, sampleRate, 128);
                    
                        // 4) baixar / enviar
                        const url = URL.createObjectURL(mp3Blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "audio.mp3";
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        // URL.revokeObjectURL(url) // revogue depois se não precisar mais
                      } catch (e) {
                        console.error("Falha ao gerar MP3:", e);
                      }

                    //  const formData = new FormData();
                    //  formData.append('audio', blob, 'audio.wav');
                    //  formData.append('locationId', locationId);
                    //  formData.append('conversationId', conversationId);
                    //  formData.append('contactId', contactId);
 
                    //  fetch('https://fullzapp.cloud/audioFromButton', {
                    //      method: 'POST',
                    //      body: formData
                    //  })
                    //  .then(response => {
                    //      if (response.ok) {
                    //          console.log('Áudio enviado com sucesso!');
                    //      } else {
                    //          console.error('Falha ao enviar o áudio.');
                    //      }
                    //  })
                    //  .catch(err => {
                    //      console.error('Erro ao enviar o áudio:', err);
                    //  });
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
                 imgDeleteButton.id = 'ImageDeleteButtonCloud';
                 imgDeleteButton.src = 'https://titobahe.github.io/delete.svg';
                 imgDeleteButton.alt = 'DeleteButton';
                 imgDeleteButton.style.width = '15px';
                 imgDeleteButton.style.height = '15px';
                 imgDeleteButton.style.marginLeft = '5px';
                 deleteButton.appendChild(imgDeleteButton);
                 divDeleteButton.appendChild(deleteButton);
 
                 deleteButton.addEventListener('click', (e)=>{
                     e.stopPropagation();
                     const button = document.getElementById('buttonAudioV1Cloud');
                     if(!button){
                         console.error('Button not found in deleteButton click event');
                         return;
                     }
                     button.setAttribute('isActive', '0');
                     button.innerHTML = '';
                     const img = document.createElement('img');
                     img.id = 'ImageAudioButtonCloud';
                     img.src = 'https://titobahe.github.io/voice-svgrepo-com.svg';
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
 
 function sendAudio_cloud(){
 
     if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
         console.error("getUserMedia Not supported.");
         return;
     }
 
     let mediaRecorder : MediaRecorder;    
     
     const toGetParentDiv:HTMLElement | null = document.getElementById('clear') || null;
     if(toGetParentDiv === null){
         console.error('Div pai não encontrado.');
         return;
     }
     const targetDiv:HTMLElement | null = toGetParentDiv?.parentElement;
     if(!targetDiv){
        console.error('targetDiv não encontrado.');
        return;
     }
     //send-message-button-group-sms-modal
 
     const currentURL:string = window.location.href;
 
     const match: RegExpMatchArray | null = currentURL.match(/location\/([a-zA-Z0-9]+)/);
     const match2: RegExpMatchArray | null = currentURL.match(/conversations\/conversations\/([a-zA-Z0-9]+)/);
     const match3: RegExpMatchArray | null = currentURL.match(/contacts\/detail\/([a-zA-Z0-9]+)/);
 
 
     if (!match) {
        console.error('locationId nao encontrado');
        return;
     }
 
     const locationId:string = match[1]; 
     const conversationId:string = match2? match2[1] : 'not found';
     const contactId: string = match3? match3[1] : 'not found';

     console.log("Captured locationId:", locationId);
     console.log("Captured conversationId: ", conversationId);
     console.log('Captured contactId" ', contactId);
     
     //caso exista, tirar a cor a partir do estatus selecionado antes.
     if(!targetDiv?.querySelector('.setSupporterButtonCloud'))
     {   
 
         const container:HTMLDivElement = document.createElement('div');
         container.className = 'setSupporterButtonCloud'; // Classe identificadora
         container.style.position = 'relative';
         container.id = 'setSupporterButton1Cloud';
 
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
         button.id = 'buttonAudioV1Cloud';
 
         const img = document.createElement('img');
         img.id = 'ImageAudioButtonCloud';
         img.src = 'https://titobahe.github.io/voice-svgrepo-com.svg';
         img.alt = 'userName';
         img.style.width = '20px';
         img.style.height = '20px';
         button.appendChild(img);
 
         button.addEventListener('click', async (e)=>{
 
             const img = document.getElementById('ImageAudioButtonCloud');
             if(!img || !(img instanceof HTMLImageElement)){
 
                 console.error('Img not found when pressed the button');
                 return;
             }
 
             if(button.getAttribute('isActive') === '0'){
                //  const isOpenFlag:boolean = await IsMicOpen_cloud();
                //  if(!isOpenFlag){
                //      return;
                //  }
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                 button.style.backgroundColor = '#db2d21';
                 img.src = 'https://titobahe.github.io/stop.svg';
                 button.setAttribute('isActive', '1');

                 mediaRecorder = await startHearing_cloud(locationId, conversationId, contactId);
                 if(mediaRecorder){
                     mediaRecorder.start();
                 }

             }
             else{
                 button.style.backgroundColor = '#ffffff';
                 button.setAttribute('isActive', '0');
                 img.src = 'https://titobahe.github.io/voice-svgrepo-com.svg';
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
 
 const observer_cloud = new MutationObserver(sendAudio_cloud);
 
 observer_cloud.observe(document.body, { childList: true, subtree: true });
 
 document.addEventListener('DOMContentLoaded', sendAudio_cloud);
 