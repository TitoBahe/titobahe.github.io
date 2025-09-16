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
var OUTPUT_MODE = "ptt_opus";
// ===== Utils =====
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
function resampleTo44100Mono(buf_1) {
    return __awaiter(this, arguments, void 0, function (buf, targetRate) {
        var length, OfflineCtx, offline, src, rendered, mono, samples, i, s;
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
                    samples = new Int16Array(mono.length);
                    for (i = 0; i < mono.length; i++) {
                        s = Math.max(-1, Math.min(1, mono[i]));
                        samples[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
                    }
                    return [2 /*return*/, { samples: samples, sampleRate: targetRate }];
            }
        });
    });
}
// WAV encoder simples (PCM16 mono)
function encodeWavFromInt16(pcm16, sampleRate) {
    if (sampleRate === void 0) { sampleRate = 44100; }
    var numChannels = 1, bitsPerSample = 16;
    var dataSize = pcm16.length * 2;
    var buffer = new ArrayBuffer(44 + dataSize);
    var view = new DataView(buffer);
    function wstr(o, s) { for (var i = 0; i < s.length; i++)
        view.setUint8(o + i, s.charCodeAt(i)); }
    var o = 0;
    wstr(o, "RIFF");
    o += 4;
    view.setUint32(o, 36 + dataSize, true);
    o += 4;
    wstr(o, "WAVE");
    o += 4;
    wstr(o, "fmt ");
    o += 4;
    view.setUint32(o, 16, true);
    o += 4;
    view.setUint16(o, 1, true);
    o += 2; // PCM
    view.setUint16(o, numChannels, true);
    o += 2;
    view.setUint32(o, sampleRate, true);
    o += 4;
    view.setUint32(o, sampleRate * numChannels * bitsPerSample / 8, true);
    o += 4;
    view.setUint16(o, numChannels * bitsPerSample / 8, true);
    o += 2;
    view.setUint16(o, bitsPerSample, true);
    o += 2;
    wstr(o, "data");
    o += 4;
    view.setUint32(o, dataSize, true);
    o += 4;
    // data
    var off = 44;
    for (var i = 0; i < pcm16.length; i++, off += 2)
        view.setInt16(off, pcm16[i], true);
    return new Blob([buffer], { type: "audio/wav" });
}
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
                    return [2 /*return*/, !status_1 || status_1.state === "granted"];
                case 2:
                    _a = _d.sent();
                    return [2 /*return*/, true];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getPreferredMimeForOpus() {
    var candidates = [
        "audio/ogg;codecs=opus", // ideal para PTT
        "audio/webm;codecs=opus" // fallback: não serve de PTT direto, mas dá pra converter depois
    ];
    return candidates.find(function (m) { var _a; return (_a = MediaRecorder.isTypeSupported) === null || _a === void 0 ? void 0 : _a.call(MediaRecorder, m); });
}
function download(name, blob) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
}
// ===== Core =====
function startHearing_cloud() {
    return __awaiter(this, void 0, void 0, function () {
        var stream, chunks, mime, mr;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigator.mediaDevices.getUserMedia({
                        audio: {
                            channelCount: 1,
                            sampleRate: 48000,
                            noiseSuppression: true,
                            echoCancellation: true,
                            autoGainControl: true
                        }
                    })];
                case 1:
                    stream = _a.sent();
                    chunks = [];
                    mime = getPreferredMimeForOpus();
                    mr = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
                    mr.ondataavailable = function (e) {
                        if (e.data && e.data.size > 0)
                            chunks.push(e.data);
                    };
                    mr.onstop = function () { return __awaiter(_this, void 0, void 0, function () {
                        var ctorMime, mrMime, chunkMime, decidedMime, recorded, opusBlob, buf, _a, samples, sampleRate, wavBlob, e_1;
                        var _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (chunks.length === 0) {
                                        console.error("Sem áudio gravado.");
                                        return [2 /*return*/];
                                    }
                                    ctorMime = mime || "";
                                    mrMime = (mr.mimeType || "").toLowerCase();
                                    chunkMime = (((_b = chunks[0]) === null || _b === void 0 ? void 0 : _b.type) || "").toLowerCase();
                                    decidedMime = (ctorMime && ctorMime.toLowerCase()) ||
                                        mrMime ||
                                        chunkMime ||
                                        "";
                                    recorded = new Blob(chunks, { type: chunkMime || mrMime || ctorMime || "" });
                                    // LOG pra debug
                                    console.log("mime ctor =", ctorMime, "mr =", mrMime, "chunk =", chunkMime, "decided =", decidedMime);
                                    // ------- 1) OGG/Opus -> baixa .opus -------
                                    if (decidedMime.includes("ogg")) {
                                        opusBlob = new Blob([recorded], { type: "audio/ogg; codecs=opus" });
                                        download("voice.opus", opusBlob);
                                        return [2 /*return*/];
                                    }
                                    // ------- 2) WEBM/Opus -> baixa .webm -------
                                    if (decidedMime.includes("webm")) {
                                        // mesmo que não tenha ;codecs=opus, no Chrome é Opus por padrão
                                        download("voice.webm", recorded);
                                        return [2 /*return*/];
                                    }
                                    _c.label = 1;
                                case 1:
                                    _c.trys.push([1, 4, , 5]);
                                    return [4 /*yield*/, decodeToAudioBuffer(recorded)];
                                case 2:
                                    buf = _c.sent();
                                    return [4 /*yield*/, resampleTo44100Mono(buf, 44100)];
                                case 3:
                                    _a = _c.sent(), samples = _a.samples, sampleRate = _a.sampleRate;
                                    wavBlob = encodeWavFromInt16(samples, sampleRate);
                                    download("audio_fallback.wav", wavBlob);
                                    return [3 /*break*/, 5];
                                case 4:
                                    e_1 = _c.sent();
                                    console.error("Falha no fallback WAV:", e_1);
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); };
                    return [2 /*return*/, mr];
            }
        });
    });
}
// ===== UI mínima (mantive tua estrutura) =====
function sendAudio_cloud() {
    var _this = this;
    var _a, _b;
    if (!((_a = navigator.mediaDevices) === null || _a === void 0 ? void 0 : _a.getUserMedia)) {
        console.error("getUserMedia não suportado.");
        return;
    }
    var mediaRecorder;
    var parent = (_b = document.getElementById("clear")) === null || _b === void 0 ? void 0 : _b.parentElement;
    if (!parent) {
        console.error("Div pai não encontrada (#clear).");
        return;
    }
    var containerClass = "setSupporterButtonCloud";
    if (parent.querySelector("." + containerClass))
        return;
    var container = document.createElement("div");
    container.className = containerClass;
    container.id = "setSupporterButton1Cloud";
    var button = document.createElement("button");
    Object.assign(button.style, { padding: "10px", background: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" });
    button.id = "buttonAudioV1Cloud";
    button.setAttribute("isActive", "0");
    var img = document.createElement("img");
    img.src = "https://titobahe.github.io/voice-svgrepo-com.svg";
    img.alt = "mic";
    img.style.width = img.style.height = "20px";
    button.appendChild(img);
    button.addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(button.getAttribute("isActive") === "0")) return [3 /*break*/, 3];
                    return [4 /*yield*/, IsMicOpen_cloud()];
                case 1:
                    if (!(_a.sent()))
                        console.warn("Sem permissão de mic (vamos tentar).");
                    button.style.backgroundColor = "#db2d21";
                    img.src = "https://titobahe.github.io/stop.svg";
                    button.setAttribute("isActive", "1");
                    return [4 /*yield*/, startHearing_cloud()];
                case 2:
                    mediaRecorder = _a.sent();
                    mediaRecorder === null || mediaRecorder === void 0 ? void 0 : mediaRecorder.start();
                    return [3 /*break*/, 4];
                case 3:
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
    parent.prepend(container);
}
var observer_cloud = new MutationObserver(sendAudio_cloud);
observer_cloud.observe(document.body, { childList: true, subtree: true });
document.addEventListener("DOMContentLoaded", sendAudio_cloud);
