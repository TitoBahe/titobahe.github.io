// ===== CONFIG =====
type OutputMode = "ptt_opus";
const OUTPUT_MODE: OutputMode = "ptt_opus";

// ===== Utils =====
async function decodeToAudioBuffer(blob: Blob): Promise<AudioBuffer> {
  const ab = await blob.arrayBuffer();
  const Ctx: any = (window as any).AudioContext || (window as any).webkitAudioContext;
  const ctx = new Ctx();
  return new Promise((res, rej) => ctx.decodeAudioData(ab, res, rej));
}

async function resampleTo44100Mono(buf: AudioBuffer, targetRate = 44100) {
  const length = Math.ceil(buf.duration * targetRate);
  const OfflineCtx: any = (window as any).OfflineAudioContext || (window as any).webkitOfflineAudioContext;
  const offline = new OfflineCtx(1, length, targetRate);
  const src = offline.createBufferSource();
  src.buffer = buf;
  src.connect(offline.destination);
  src.start(0);
  const rendered: AudioBuffer = await offline.startRendering();
  const mono = rendered.getChannelData(0);
  // Int16 mono
  const samples = new Int16Array(mono.length);
  for (let i = 0; i < mono.length; i++) {
    const s = Math.max(-1, Math.min(1, mono[i]));
    samples[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return { samples, sampleRate: targetRate };
}

// WAV encoder simples (PCM16 mono)
function encodeWavFromInt16(pcm16: Int16Array, sampleRate = 44100): Blob {
  const numChannels = 1, bitsPerSample = 16;
  const dataSize = pcm16.length * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  function wstr(o:number,s:string){ for(let i=0;i<s.length;i++) view.setUint8(o+i,s.charCodeAt(i)); }
  let o = 0;
  wstr(o,"RIFF"); o+=4;
  view.setUint32(o,36 + dataSize,true); o+=4;
  wstr(o,"WAVE"); o+=4;
  wstr(o,"fmt "); o+=4;
  view.setUint32(o,16,true); o+=4;
  view.setUint16(o,1,true);  o+=2; // PCM
  view.setUint16(o,numChannels,true); o+=2;
  view.setUint32(o,sampleRate,true);  o+=4;
  view.setUint32(o,sampleRate * numChannels * bitsPerSample/8,true); o+=4;
  view.setUint16(o,numChannels * bitsPerSample/8,true); o+=2;
  view.setUint16(o,bitsPerSample,true); o+=2;
  wstr(o,"data"); o+=4;
  view.setUint32(o,dataSize,true); o+=4;
  // data
  let off = 44;
  for (let i=0;i<pcm16.length;i++,off+=2) view.setInt16(off, pcm16[i], true);
  return new Blob([buffer], { type: "audio/wav" });
}

async function IsMicOpen_cloud(): Promise<boolean> {
  try {
    const status = await (navigator.permissions as any)?.query?.({ name: "microphone" as PermissionName });
    return !status || status.state === "granted";
  } catch { return true; }
}

function getPreferredMimeForOpus(): string | undefined {
  const candidates = [
    "audio/ogg;codecs=opus",   // ideal para PTT
    "audio/webm;codecs=opus"   // fallback: não serve de PTT direto, mas dá pra converter depois
  ];
  return candidates.find(m => MediaRecorder.isTypeSupported?.(m));
}

function download(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// ===== Core =====
async function startHearing_cloud(): Promise<MediaRecorder> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      channelCount: 1,
      sampleRate: 48000,
      noiseSuppression: true,
      echoCancellation: true,
      autoGainControl: true
    }
  });

  const chunks: Blob[] = [];
  const mime = getPreferredMimeForOpus();
  const mr = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);

  mr.ondataavailable = (e: BlobEvent) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  mr.onstop = async () => {
    if (chunks.length === 0) { console.error("Sem áudio gravado."); return; }
    const recordedType = mr.mimeType || chunks[0].type || "";
    const recorded = new Blob(chunks, { type: recordedType });

    if (/audio\/webm/i.test(recordedType) && /opus/i.test(recordedType)) {
      download("voice.webm", recorded);
      return;
    }
    
    // Fallback (ex.: Safari gravou WebM/Opus): baixa WAV para você transcodar no servidor para .opus
    try {
      const buf = await decodeToAudioBuffer(recorded);
      const { samples, sampleRate } = await resampleTo44100Mono(buf, 44100);
      const wavBlob = encodeWavFromInt16(samples, sampleRate);
      download("audio_fallback.wav", wavBlob);
    } catch (e) {
      console.error("Falha no fallback WAV:", e);
    }
  };

  return mr;
}

// ===== UI mínima (mantive tua estrutura) =====
function sendAudio_cloud() {
  if (!navigator.mediaDevices?.getUserMedia) {
    console.error("getUserMedia não suportado."); return;
  }

  let mediaRecorder: MediaRecorder;
  const parent = document.getElementById("clear")?.parentElement;
  if (!parent) { console.error("Div pai não encontrada (#clear)."); return; }

  const containerClass = "setSupporterButtonCloud";
  if (parent.querySelector("." + containerClass)) return;

  const container = document.createElement("div");
  container.className = containerClass;
  container.id = "setSupporterButton1Cloud";

  const button = document.createElement("button");
  Object.assign(button.style, { padding:"10px", background:"#fff", border:"none", borderRadius:"5px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" });
  button.id = "buttonAudioV1Cloud";
  button.setAttribute("isActive","0");

  const img = document.createElement("img");
  img.src = "https://titobahe.github.io/voice-svgrepo-com.svg";
  img.alt = "mic";
  img.style.width = img.style.height = "20px";
  button.appendChild(img);

  button.addEventListener("click", async () => {
    if (button.getAttribute("isActive") === "0") {
      if (!await IsMicOpen_cloud()) console.warn("Sem permissão de mic (vamos tentar).");
      button.style.backgroundColor = "#db2d21";
      img.src = "https://titobahe.github.io/stop.svg";
      button.setAttribute("isActive","1");
      mediaRecorder = await startHearing_cloud();
      mediaRecorder?.start();
    } else {
      button.style.backgroundColor = "#ffffff";
      button.setAttribute("isActive","0");
      img.src = "https://titobahe.github.io/voice-svgrepo-com.svg";
      mediaRecorder?.stop();
    }
  });

  container.appendChild(button);
  parent.prepend(container);
}

const observer_cloud = new MutationObserver(sendAudio_cloud);
observer_cloud.observe(document.body, { childList: true, subtree: true });
document.addEventListener("DOMContentLoaded", sendAudio_cloud);
