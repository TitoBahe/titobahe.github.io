function startHearing(mediaRecorder, chunks) {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = function (e) {
            chunks.push(e.data);
        };
        mediaRecorder.onstop = function (e) {
            var audio = document.createElement("audio");
            audio.style.width;
            audio.controls = true;
            var blob = new Blob(chunks, { type: mediaRecorder.mimeType });
            chunks = [];
            var audioURL = window.URL.createObjectURL(blob);
            audio.src = audioURL;
            var button = document.getElementById('buttonAudioV1');
            if (!button || !(button instanceof HTMLButtonElement)) {
                console.error('butotn not found in navigator.mediaDevices.getUserMedia no then');
                return;
            }
            button.innerHTML = '';
            button.appendChild(audio);
        };
    })
        .catch(function (err) {
        console.error('Error in navigator.mediaDevices.getUserMedia: ', err.message);
    });
}
function stopHearing() {
    navigator.mediaDevices.getUserMedia({ audio: false })
        .catch(function (err) {
        console.error('Error in stopHEaring: ', err);
    });
}
function sendAudio() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("getUserMedia Not supported.");
        return;
    }
    var mediaRecorder;
    var chunks = [];
    var targetDiv = document.querySelector('div[data-v-67277b2d].flex.h-10.ml-auto');
    var currentURL = window.location.href;
    var match = currentURL.match(/location\/([a-zA-Z0-9]+)/);
    var match2 = currentURL.match(/conversations\/conversations\/([a-zA-Z0-9]+)/);
    if (!match || !match2) {
        console.error("No locationId found from the url.");
        return;
    }
    var locationId = match[1];
    var conversationId = match2[1];
    console.log("Captured locationId:", locationId);
    console.log("Captured conversationId: ", conversationId);
    //caso exista, tirar a cor a partir do estatus selecionado antes.
    if (targetDiv && !targetDiv.querySelector('.setSupporterButton')) {
        var container = document.createElement('div');
        container.className = 'setSupporterButton'; // Classe identificadora
        container.style.position = 'relative';
        container.id = 'setSupporterButton1';
        // Botão com a imagem do chip
        var button_1 = document.createElement('button');
        button_1.style.padding = '10px';
        button_1.style.backgroundColor = '#ffffff';
        button_1.style.border = 'none';
        button_1.style.borderRadius = '5px';
        button_1.style.cursor = 'pointer';
        button_1.style.display = 'flex';
        button_1.style.alignItems = 'center';
        button_1.setAttribute('isActive', '0');
        button_1.style.justifyContent = 'center';
        button_1.id = 'buttonAudioV1';
        var img = document.createElement('img');
        img.id = 'ImageAudioButton';
        img.src = 'https://titobahe.github.io/play.svg';
        img.alt = 'userName';
        img.style.width = '20px';
        img.style.height = '20px';
        button_1.appendChild(img);
        button_1.addEventListener('click', function (e) {
            var img = document.getElementById('ImageAudioButton');
            if (!img || !(img instanceof HTMLImageElement)) {
                console.error('Img not found when pressed the button');
                return;
            }
            if (button_1.getAttribute('isActive') === '0') {
                button_1.style.backgroundColor = '#db2d21';
                img.src = 'https://titobahe.github.io/stop.svg';
                button_1.setAttribute('isActive', '1');
                startHearing(mediaRecorder, chunks);
                mediaRecorder.start();
            }
            else {
                button_1.style.backgroundColor = '#ffffff';
                button_1.setAttribute('isActive', '0');
                img.src = 'https://titobahe.github.io/play.svg';
                mediaRecorder.stop();
                stopHearing();
            }
        });
        container.appendChild(button_1);
        targetDiv.prepend(container);
    }
    else {
        console.log('Botão já existe ou targetDiv não encontrado.');
    }
}
var observer = new MutationObserver(sendAudio);
observer.observe(document.body, { childList: true, subtree: true });
document.addEventListener('DOMContentLoaded', sendAudio);
