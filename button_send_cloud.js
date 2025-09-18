var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function IsMicOpen_cloud() {
    return new Promise(function (resolve, reject) {
        navigator.permissions.query({ name: 'microphone' }).then(function (permissionStatus) {
            console.log(permissionStatus.state); // granted, denied, prompt
            if (permissionStatus.state !== 'granted') {
                reject(false);
            }
            resolve(true);
        })
            .catch(function (err) {
            console.error('Error in IsMicOpen: ', err);
            reject(false);
        });
    });
}
function blobToBase64(blob) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // Retorna só a parte base64 (sem o prefixo data:)
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var reader = new FileReader();
                    reader.onloadend = function () {
                        var result = reader.result; // "data:<mime>;base64,AAAA..."
                        var comma = result.indexOf(",");
                        resolve(comma >= 0 ? result.slice(comma + 1) : result);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                })];
        });
    });
}
function startHearing_cloud(locationId, conversationId, contactId) {
    return new Promise(function (resolve, reject) {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (stream) {
            var chunks = [];
            var mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = function (e) {
                chunks.push(e.data);
            };
            mediaRecorder.onstop = function (e) {
                return __awaiter(this, void 0, void 0, function () {
                    var audio, blob, audioURL, button, divSendButton, sendButton, imgSendButton, divDeleteButton, deleteButton, imgDeleteButton;
                    var _this = this;
                    return __generator(this, function (_a) {
                        audio = document.createElement("audio");
                        audio.style.width = '175px';
                        audio.style.height = '40px';
                        audio.style.paddingBottom = '10px';
                        audio.controls = true;
                        console.log('Mimetype AQUI: ', mediaRecorder.mimeType);
                        blob = new Blob(chunks, { type: mediaRecorder.mimeType });
                        audioURL = window.URL.createObjectURL(blob);
                        audio.src = audioURL;
                        button = document.getElementById('buttonAudioV1Cloud');
                        if (!button || !(button instanceof HTMLButtonElement)) {
                            console.error('butotn not found in navigator.mediaDevices.getUserMedia no then');
                            return [2 /*return*/];
                        }
                        divSendButton = document.createElement('div');
                        sendButton = document.createElement('button');
                        sendButton.style.borderRadius = '5px';
                        sendButton.style.width = '25px';
                        sendButton.style.height = '35px';
                        // sendButton.style.padding = '5px 10px';
                        sendButton.style.backgroundColor = '#42f54e';
                        sendButton.style.display = 'flex';
                        sendButton.style.alignContent = 'center';
                        sendButton.style.alignItems = 'center';
                        imgSendButton = document.createElement('img');
                        imgSendButton.id = 'ImageSendButtonCloud';
                        imgSendButton.src = 'https://titobahe.github.io/send.svg';
                        imgSendButton.alt = 'SendButton';
                        imgSendButton.style.width = '15px';
                        imgSendButton.style.height = '15px';
                        imgSendButton.style.marginLeft = '5px';
                        sendButton.appendChild(imgSendButton);
                        divSendButton.appendChild(sendButton);
                        sendButton.addEventListener('click', function (e) { return __awaiter(_this, void 0, void 0, function () {
                            var button, img, base64, formData;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        e.stopPropagation();
                                        button = document.getElementById('buttonAudioV1Cloud');
                                        if (!button) {
                                            console.error('Button not found in deleteButton click event');
                                            return [2 /*return*/];
                                        }
                                        button.setAttribute('isActive', '0');
                                        button.innerHTML = '';
                                        img = document.createElement('img');
                                        img.id = 'ImageAudioButtonCloud';
                                        img.src = 'https://titobahe.github.io/voice-svgrepo-com.svg';
                                        img.alt = 'userName';
                                        img.style.width = '20px';
                                        img.style.height = '20px';
                                        button.appendChild(img);
                                        return [4 /*yield*/, blobToBase64(blob)];
                                    case 1:
                                        base64 = _a.sent();
                                        formData = new FormData();
                                        formData.append('audio', blob, 'audio.wav');
                                        //    formData.append('base64Audio', base64);
                                        formData.append('locationId', locationId);
                                        formData.append('conversationId', conversationId);
                                        formData.append('contactId', contactId);
                                        console.log('FormData: ', formData);
                                        console.log('blobl size: ', blob.size);
                                        fetch('https://fullzapp.com/audioFromButton', {
                                            method: 'POST',
                                            body: formData
                                        })
                                            .then(function (response) {
                                            if (response.ok) {
                                                console.log('Áudio enviado com sucesso!');
                                            }
                                            else {
                                                console.error('Falha ao enviar o áudio.');
                                            }
                                        })
                                            .catch(function (err) {
                                            console.error('Erro ao enviar o áudio:', err);
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        divDeleteButton = document.createElement('div');
                        deleteButton = document.createElement('button');
                        deleteButton.style.borderRadius = '5px';
                        deleteButton.style.width = '25px';
                        deleteButton.style.height = '35px';
                        // deleteButton.style.padding = '5px 10px';
                        deleteButton.style.backgroundColor = '#db2d21';
                        deleteButton.style.display = 'flex';
                        deleteButton.style.alignContent = 'center';
                        deleteButton.style.alignItems = 'center';
                        imgDeleteButton = document.createElement('img');
                        imgDeleteButton.id = 'ImageDeleteButtonCloud';
                        imgDeleteButton.src = 'https://titobahe.github.io/delete.svg';
                        imgDeleteButton.alt = 'DeleteButton';
                        imgDeleteButton.style.width = '15px';
                        imgDeleteButton.style.height = '15px';
                        imgDeleteButton.style.marginLeft = '5px';
                        deleteButton.appendChild(imgDeleteButton);
                        divDeleteButton.appendChild(deleteButton);
                        deleteButton.addEventListener('click', function (e) {
                            e.stopPropagation();
                            var button = document.getElementById('buttonAudioV1Cloud');
                            if (!button) {
                                console.error('Button not found in deleteButton click event');
                                return;
                            }
                            button.setAttribute('isActive', '0');
                            button.innerHTML = '';
                            var img = document.createElement('img');
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
                        return [2 /*return*/];
                    });
                });
            };
            resolve(mediaRecorder);
        })
            .catch(function (err) {
            console.error('Error in navigator.mediaDevices.getUserMedia: ', err.message);
            reject(null);
        });
    });
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
function sendAudio_cloud() {
    var _this = this;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("getUserMedia Not supported.");
        return;
    }
    var mediaRecorder;
    var toGetParentDiv = document.getElementById('clear') || null;
    if (toGetParentDiv === null) {
        console.error('Div pai não encontrado.');
        return;
    }
    var targetDiv = toGetParentDiv === null || toGetParentDiv === void 0 ? void 0 : toGetParentDiv.parentElement;
    if (!targetDiv) {
        console.error('targetDiv não encontrado.');
        return;
    }
    //send-message-button-group-sms-modal
    var currentURL = window.location.href;
    var match = currentURL.match(/location\/([a-zA-Z0-9]+)/);
    var match2 = currentURL.match(/conversations\/conversations\/([a-zA-Z0-9]+)/);
    var match3 = currentURL.match(/contacts\/detail\/([a-zA-Z0-9]+)/);
    if (!match) {
        console.error('locationId nao encontrado');
        return;
    }
    var locationId = match[1];
    var conversationId = match2 ? match2[1] : 'not found';
    var contactId = match3 ? match3[1] : 'not found';
    console.log("Captured locationId:", locationId);
    console.log("Captured conversationId: ", conversationId);
    console.log('Captured contactId" ', contactId);
    //caso exista, tirar a cor a partir do estatus selecionado antes.
    if (!(targetDiv === null || targetDiv === void 0 ? void 0 : targetDiv.querySelector('.setSupporterButtonCloud'))) {
        var container = document.createElement('div');
        container.className = 'setSupporterButtonCloud'; // Classe identificadora
        container.style.position = 'relative';
        container.id = 'setSupporterButton1Cloud';
        // Botão com a imagem do chip
        var button_1 = document.createElement('button');
        button_1.style.padding = '10px';
        button_1.style.backgroundColor = '#ffffff';
        button_1.style.border = 'none';
        button_1.style.borderRadius = '5px';
        button_1.style.cursor = 'pointer';
        button_1.style.display = 'flex';
        button_1.style.alignItems = 'flex-start';
        button_1.setAttribute('isActive', '0');
        button_1.style.justifyContent = 'center';
        button_1.id = 'buttonAudioV1Cloud';
        var img = document.createElement('img');
        img.id = 'ImageAudioButtonCloud';
        img.src = 'https://titobahe.github.io/voice-svgrepo-com.svg';
        img.alt = 'userName';
        img.style.width = '20px';
        img.style.height = '20px';
        button_1.appendChild(img);
        button_1.addEventListener('click', function (e) { return __awaiter(_this, void 0, void 0, function () {
            var img, stream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        img = document.getElementById('ImageAudioButtonCloud');
                        if (!img || !(img instanceof HTMLImageElement)) {
                            console.error('Img not found when pressed the button');
                            return [2 /*return*/];
                        }
                        if (!(button_1.getAttribute('isActive') === '0')) return [3 /*break*/, 3];
                        return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ audio: true })];
                    case 1:
                        stream = _a.sent();
                        button_1.style.backgroundColor = '#db2d21';
                        img.src = 'https://titobahe.github.io/stop.svg';
                        button_1.setAttribute('isActive', '1');
                        return [4 /*yield*/, startHearing_cloud(locationId, conversationId, contactId)];
                    case 2:
                        mediaRecorder = _a.sent();
                        if (mediaRecorder) {
                            mediaRecorder.start();
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        button_1.style.backgroundColor = '#ffffff';
                        button_1.setAttribute('isActive', '0');
                        img.src = 'https://titobahe.github.io/voice-svgrepo-com.svg';
                        mediaRecorder.stop();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        container.appendChild(button_1);
        targetDiv.prepend(container);
    }
    else {
        console.log('Botão já existe ou targetDiv não encontrado.');
    }
}
var observer_cloud = new MutationObserver(sendAudio_cloud);
observer_cloud.observe(document.body, { childList: true, subtree: true });
document.addEventListener('DOMContentLoaded', sendAudio_cloud);
