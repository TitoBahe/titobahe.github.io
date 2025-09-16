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
// === UTIL: carregar lamejs (UMD) via CDN: sem require, funciona no browser puro ===
function loadLameFromCDN() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (window.lamejs)
                        return [2 /*return*/, window.lamejs];
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var s = document.createElement("script");
                            s.src = "https://cdn.jsdelivr.net/npm/lamejs@1.2.0/lame.min.js";
                            s.async = true;
                            s.onload = function () { return resolve(); };
                            s.onerror = function () { return reject(new Error("Falha ao carregar lamejs do CDN")); };
                            document.head.appendChild(s);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, window.lamejs];
            }
        });
    });
}
// === UTILs de áudio ===
function decodeToAudioBuffer(blob) {
    return __awaiter(this, void 0, void 0, function () {
        var ab, Ctx, ctx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, blob.arrayBuffer()];
                case 1:
                    ab = _a.sent();
                    Ctx = window.AudioContext || window.webkitAudioContext;
                    ctx = new Ctx();
                    return [2 /*return*/, new Promise(function (res, rej) { return ctx.decodeAudioData(ab, res, rej); })];
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
// Resample para 44.1kHz mono (compat máximo com WhatsApp mobile)
function resampleTo44100Mono(buf_1) {
    return __awaiter(this, arguments, void 0, function (buf, targetRate) {
        var length, OfflineCtx, offline, src, rendered, mono;
        if (targetRate === void 0) { targetRate = 44100; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    length = Math.ceil(buf.duration * targetRate);
                    OfflineCtx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
                    offline = new OfflineCtx(1, length, targetRate);
                    src = offline.createBufferSource();
                    src.buffer = buf;
                    src.connect(offline.destination);
                    src.start(0);
                    return [4 /*yield*/, offline.startRendering()];
                case 1:
                    rendered = _a.sent();
                    mono = rendered.getChannelData(0);
                    return [2 /*return*/, { samples: floatTo16BitPCM(mono), sampleRate: targetRate }];
            }
        });
    });
}
function encodeMp3Mono(samples16_1, sampleRate_1) {
    return __awaiter(this, arguments, void 0, function (samples16, sampleRate, bitrateKbps) {
        var lame, encoder, frame, out, i, chunk, buf, end;
        if (bitrateKbps === void 0) { bitrateKbps = 128; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadLameFromCDN()];
                case 1:
                    lame = _a.sent();
                    encoder = new lame.Mp3Encoder(1, sampleRate, bitrateKbps);
                    frame = 1152;
                    out = [];
                    for (i = 0; i < samples16.length; i += frame) {
                        chunk = samples16.subarray(i, i + frame);
                        buf = encoder.encodeBuffer(chunk);
                        if (buf.length)
                            out.push(buf);
                    }
                    end = encoder.flush();
                    if (end.length)
                        out.push(end);
                    return [2 /*return*/, new Blob(out, { type: "audio/mpeg" })];
            }
        });
    });
}
// ============ SUA LÓGICA ============
// (opcional) checar permissão do mic
function IsMicOpen_cloud() {
    return __awaiter(this, void 0, void 0, function () {
        var status_1, _a;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, ((_c = (_b = navigator.permissions) === null || _b === void 0 ? void 0 : _b.query) === null || _c === void 0 ? void 0 : _c.call(_b, { name: "microphone" }))];
                case 1:
                    status_1 = _d.sent();
                    if (!status_1)
                        return [2 /*return*/, true]; // alguns browsers não expõem
                    return [2 /*return*/, status_1.state === "granted"];
                case 2:
                    _a = _d.sent();
                    return [2 /*return*/, true];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getPreferredMime() {
    var candidates = [
        "audio/ogg;codecs=opus", // ideal p/ PTT
        "audio/webm;codecs=opus", // fallback
        "audio/mpeg" // último recurso
    ];
    return candidates.find(function (m) { var _a; return (_a = MediaRecorder.isTypeSupported) === null || _a === void 0 ? void 0 : _a.call(MediaRecorder, m); });
}
function startHearing_cloud(locationId, conversationId, contactId) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var stream, chunks_1, mime, mediaRecorder_1, err_1;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, navigator.mediaDevices.getUserMedia({
                                        audio: {
                                            channelCount: 1, // força mono
                                            sampleRate: 48000, // sugere 48k (browser pode ajustar)
                                            noiseSuppression: true,
                                            echoCancellation: true,
                                            autoGainControl: true
                                        }
                                    })];
                            case 1:
                                stream = _a.sent();
                                chunks_1 = [];
                                mime = getPreferredMime();
                                mediaRecorder_1 = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
                                mediaRecorder_1.ondataavailable = function (e) {
                                    if (e.data && e.data.size > 0)
                                        chunks_1.push(e.data);
                                };
                                mediaRecorder_1.onstop = function () { return __awaiter(_this, void 0, void 0, function () {
                                    var recordedType, blob, file, url, a;
                                    var _a;
                                    return __generator(this, function (_b) {
                                        recordedType = mediaRecorder_1.mimeType || ((_a = chunks_1[0]) === null || _a === void 0 ? void 0 : _a.type) || "audio/ogg;codecs=opus";
                                        blob = new Blob(chunks_1, { type: recordedType });
                                        // Se for OGG/Opus, já está pronto para PTT – só garanta a EXTENSÃO .opus
                                        if (/audio\/ogg/.test(recordedType) && /opus/.test(recordedType)) {
                                            file = new File([blob], "voice.opus", { type: "audio/ogg; codecs=opus" });
                                            url = URL.createObjectURL(file);
                                            a = document.createElement("a");
                                            a.href = url;
                                            a.download = "voice.opus"; // <- extensão correta
                                            document.body.appendChild(a);
                                            a.click();
                                            a.remove();
                                            // URL.revokeObjectURL(url);
                                            // Se for enviar por API: suba `file` como ÁUDIO, mimetype e ptt:true
                                            return [2 /*return*/];
                                        }
                                        return [2 /*return*/];
                                    });
                                }); };
                                resolve(mediaRecorder_1);
                                return [3 /*break*/, 3];
                            case 2:
                                err_1 = _a.sent();
                                console.error("Erro ao acessar microfone:", err_1);
                                reject(err_1);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
// Botão/injeção (mantive sua estrutura base; adapte aos seus elementos)
function sendAudio_cloud() {
    var _this = this;
    var _a;
    if (!((_a = navigator.mediaDevices) === null || _a === void 0 ? void 0 : _a.getUserMedia)) {
        console.error("getUserMedia não suportado.");
        return;
    }
    var mediaRecorder;
    var toGetParentDiv = document.getElementById("clear");
    if (!toGetParentDiv) {
        console.error("Div pai não encontrada (#clear).");
        return;
    }
    var targetDiv = toGetParentDiv.parentElement;
    if (!targetDiv) {
        console.error("targetDiv não encontrado.");
        return;
    }
    var containerClass = "setSupporterButtonCloud";
    if (targetDiv.querySelector("." + containerClass)) {
        // já existe
        return;
    }
    var container = document.createElement("div");
    container.className = containerClass;
    container.style.position = "relative";
    container.id = "setSupporterButton1Cloud";
    var button = document.createElement("button");
    button.style.padding = "10px";
    button.style.backgroundColor = "#ffffff";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.display = "flex";
    button.style.alignItems = "flex-start";
    button.style.justifyContent = "center";
    button.id = "buttonAudioV1Cloud";
    button.setAttribute("isActive", "0");
    var img = document.createElement("img");
    img.id = "ImageAudioButtonCloud";
    img.src = "https://titobahe.github.io/voice-svgrepo-com.svg";
    img.alt = "mic";
    img.style.width = "20px";
    img.style.height = "20px";
    button.appendChild(img);
    button.addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
        var ok;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(button.getAttribute("isActive") === "0")) return [3 /*break*/, 3];
                    return [4 /*yield*/, IsMicOpen_cloud()];
                case 1:
                    ok = _a.sent();
                    if (!ok) {
                        console.warn("Microfone sem permissão.");
                        // ainda assim tentamos - alguns browsers não expõem o permissions API
                    }
                    button.style.backgroundColor = "#db2d21";
                    img.src = "https://titobahe.github.io/stop.svg";
                    button.setAttribute("isActive", "1");
                    return [4 /*yield*/, startHearing_cloud("loc", "conv", "contact")];
                case 2:
                    mediaRecorder = _a.sent();
                    mediaRecorder === null || mediaRecorder === void 0 ? void 0 : mediaRecorder.start();
                    return [3 /*break*/, 4];
                case 3:
                    // parar
                    button.style.backgroundColor = "#ffffff";
                    button.setAttribute("isActive", "0");
                    img.src = "https://titobahe.github.io/voice-svgrepo-com.svg";
                    mediaRecorder === null || mediaRecorder === void 0 ? void 0 : mediaRecorder.stop();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); });
    container.appendChild(button);
    targetDiv.prepend(container);
}
// Observa a página e injeta o botão
var observer_cloud = new MutationObserver(sendAudio_cloud);
observer_cloud.observe(document.body, { childList: true, subtree: true });
document.addEventListener("DOMContentLoaded", sendAudio_cloud);
