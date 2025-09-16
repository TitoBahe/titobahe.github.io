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
function decodeToAudioBuffer(blob) {
    return __awaiter(this, void 0, void 0, function () {
        var ab, ctx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, blob.arrayBuffer()];
                case 1:
                    ab = _a.sent();
                    ctx = new (window.AudioContext || window.webkitAudioContext)();
                    return [2 /*return*/, new Promise(function (res, rej) {
                            ctx.decodeAudioData(ab, res, rej);
                        })];
            }
        });
    });
}
function floatTo16BitPCM(f32) {
    var out = new Int16Array(f32.length);
    for (var i = 0; i < f32.length; i++) {
        var s = Math.max(-1, Math.min(1, f32[i]));
        out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return out;
}
function mixToMonoInt16(buf) {
    var numberOfChannels = buf.numberOfChannels, length = buf.length, sampleRate = buf.sampleRate;
    if (numberOfChannels === 1)
        return { samples: floatTo16BitPCM(buf.getChannelData(0)), sampleRate: sampleRate };
    var L = buf.getChannelData(0);
    var R = buf.getChannelData(1);
    var mixed = new Float32Array(length);
    for (var i = 0; i < length; i++)
        mixed[i] = (L[i] + R[i]) / 2;
    return { samples: floatTo16BitPCM(mixed), sampleRate: sampleRate };
}
function encodeMp3Mono(samples16_1, sampleRate_1) {
    return __awaiter(this, arguments, void 0, function (samples16, sampleRate, bitrateKbps) {
        var Mp3Encoder, encoder, frame, mp3Chunks, i, slice, buf, end;
        if (bitrateKbps === void 0) { bitrateKbps = 128; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve("".concat("lamejs")).then(function (s) { return require(s); })];
                case 1:
                    Mp3Encoder = (_a.sent()).Mp3Encoder;
                    encoder = new Mp3Encoder(1, sampleRate, bitrateKbps);
                    frame = 1152;
                    mp3Chunks = [];
                    for (i = 0; i < samples16.length; i += frame) {
                        slice = samples16.subarray(i, i + frame);
                        buf = encoder.encodeBuffer(slice);
                        if (buf.length)
                            mp3Chunks.push(buf);
                    }
                    end = encoder.flush();
                    if (end.length)
                        mp3Chunks.push(end);
                    return [2 /*return*/, new Blob(mp3Chunks, { type: "audio/mpeg" })];
            }
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
                        blob = new Blob(chunks, { type: "audio/mpeg" });
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
                            var button, img, recorded, audioBuffer, _a, samples, sampleRate, mp3Blob, url, a, e_1;
                            var _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
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
                                        _c.label = 1;
                                    case 1:
                                        _c.trys.push([1, 4, , 5]);
                                        recorded = new Blob(chunks, { type: ((_b = chunks[0]) === null || _b === void 0 ? void 0 : _b.type) || mediaRecorder.mimeType || "audio/webm" });
                                        return [4 /*yield*/, decodeToAudioBuffer(recorded)];
                                    case 2:
                                        audioBuffer = _c.sent();
                                        _a = mixToMonoInt16(audioBuffer), samples = _a.samples, sampleRate = _a.sampleRate;
                                        return [4 /*yield*/, encodeMp3Mono(samples, sampleRate, 128)];
                                    case 3:
                                        mp3Blob = _c.sent();
                                        url = URL.createObjectURL(mp3Blob);
                                        a = document.createElement("a");
                                        a.href = url;
                                        a.download = "audio.mp3";
                                        document.body.appendChild(a);
                                        a.click();
                                        a.remove();
                                        return [3 /*break*/, 5];
                                    case 4:
                                        e_1 = _c.sent();
                                        console.error("Falha ao gerar MP3:", e_1);
                                        return [3 /*break*/, 5];
                                    case 5: return [2 /*return*/];
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
