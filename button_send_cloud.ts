// ================== CONFIG ==================
type OutputMode = "ptt_opus" | "audio_wav";
const OUTPUT_MODE: OutputMode = "audio_wav"; // "ptt_opus" (voice note .opus) | "audio_wav" (.wav)

// ================== CDN LAMEJS (fallback MP3) ==================
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

// ================== ÁUDIO UTILS ==================
async function decodeToAudioBuffer(blob: Blob): Promise<AudioBuffer> {
  const ab = await blob.arrayBuffer();
  const Ctx: any = (window as any).AudioContext || (window as any).webkitAudioContext;
  const ctx = new Ctx();
  return new Promise((res, rej) => ctx.decodeAudioData(ab, res, rej));
}

function floatTo16BitPCM(f32: Float32Array): Int16Array {
  const out = new Int16Array(f32.length);
  for (let i = 0; i < f32.length; i++) {
    const s = Math.max(-1, Math.min(1, f32[i]));
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return out;
}

// Resample para 44.1kHz mono — bom para WAV/MP3 universais
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
  return { samples: floatTo16BitPCM(mono), sampleRate: targetRate };
}

async function encodeMp3Mono(samples16: Int16Array, sampleRate: number, bitrateKbps = 128): Promise<Blob> {
  const lame = await loadLameFromCDN();
  const encoder = new lame.Mp3Encoder(1, sampleRate, bitrateKbps); // mono
  const frame = 1152;
  const out: Uint8Array[] = [];
  for (let i = 0; i < samples16.length; i += frame) {
    const chunk = samples16.subarray(i, i + frame);
    const buf = encoder.encodeBuffer(chunk);
    if (buf.length) out.push(buf);
  }
  const end = encoder.flush();
  if (end.length) out.push(end);
  return new Blob(out, { type: "audio/mpeg" });
}

// ===== WAV encoder (mono 16-bit PCM) a partir de Float32 =====
function encodeWavFromF32(samples: Float32Array, sampleRate = 44100): Blob {
  const numChannels = 1;
  const bitsPerSample = 16;

  const pcm16 = new Int16Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    let s = Math.max(-1, Math.min(1, samples[i]));
    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }

  const blockAlign = numChannels * bitsPerSample / 8;
  const byteRate = sampleRate * blockAlign;
  const dataSize = pcm16.length * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  let offset = 0;
  function writeString(str: string) {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    offset += str.length;
  }
  function writeUint32(v: number) { view.setUint32(offset, v, true); offset += 4; }
  function writeUint16(v: number) { view.setUint16(offset, v, true); offset += 2; }

  writeString("RIFF");
  writeUint32(36 + dataSize);
  writeString("WAVE");
  writeString("fmt ");
  writeUint32(16);
  writeUint16(1);
  writeUint16(numChannels);
  writeUint32(sampleRate);
  writeUint32(byteRate);
  writeUint16(blockAlign);
  writeUint16(bitsPerSample);
  writeString("data");
  writeUint32(dataSize);

  new Int16Array(buffer, 44).set(pcm16);
  return new Blob([buffer], { type: "audio/wav" });
}

// ================== PERMISSÃO MIC ==================
async function IsMicOpen_cloud(): Promise<boolean> {
  try {
    const status = await (navigator.permissions as any)?.query?.({ name: "microphone" as PermissionName });
    if (!status) return true;
    return status.state === "granted";
  } catch {
    return true;
  }
}

// ================== PREFERÊNCIA MIME ==================
function getPreferredMime(): string | undefined {
  // Para PTT, ideal é OGG/Opus (Chrome/Firefox). Safari tende a cair em WebM/Opus.
  const candidates = [
    "audio/ogg;codecs=opus",
    "audio/webm;codecs=opus",
    "audio/mpeg"
  ];
  return candidates.find(m => MediaRecorder.isTypeSupported?.(m));
}

// ================== DOWNLOAD HELPERS ==================
function downloadFile(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // URL.revokeObjectURL(url); // opcional
}

// ================== GRAVAÇÃO ==================
async function startHearing_cloud(locationId: string, conversationId: string, contactId: string): Promise<MediaRecorder> {
  return new Promise(async (resolve, reject) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 48000, // sugestão; o browser pode ajustar
          noiseSuppression: true,
          echoCancellation: true,
          autoGainControl: true
        }
      });

      const chunks: Blob[] = [];
      const mime = getPreferredMime();
      const mediaRecorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);

      mediaRecorder.ondataavailable = (e: BlobEvent) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        try {
          const recordedType = mediaRecorder.mimeType || chunks[0]?.type || "audio/ogg;codecs=opus";
          const recorded = new Blob(chunks, { type: recordedType });

          if (OUTPUT_MODE === "ptt_opus") {
            // Se o browser já deu OGG/Opus, ótimo — baixa .opus
            if (/audio\/ogg/i.test(recordedType) && /opus/i.test(recordedType)) {
              downloadFile("voice.opus", new Blob([recorded], { type: "audio/ogg; codecs=opus" }));
              return;
            }
            // Se não gerou OGG/Opus (ex.: Safari), não temos encoder Opus no client.
            // Fallback: baixar WAV (pra você transcodar no server para .opus se quiser PTT)
            const buf = await decodeToAudioBuffer(recorded);
            const { samples: s16, sampleRate } = await resampleTo44100Mono(buf, 44100);
            const f32 = new Float32Array(s16.length);
            for (let i = 0; i < s16.length; i++) f32[i] = s16[i] / 0x8000;
            const wavBlob = encodeWavFromF32(f32, sampleRate);
            downloadFile("audio_fallback.wav", wavBlob);
            return;
          }

          if (OUTPUT_MODE === "audio_wav") {
            // Gerar WAV universal (áudio comum)
            const buf = await decodeToAudioBuffer(recorded);
            const { samples: s16, sampleRate } = await resampleTo44100Mono(buf, 44100);
            const f32 = new Float32Array(s16.length);
            for (let i = 0; i < s16.length; i++) f32[i] = s16[i] / 0x8000;
            const wavBlob = encodeWavFromF32(f32, sampleRate);
            downloadFile("audio.wav", wavBlob);
            return;
          }

          // MP3 fallback (se você preferir baixar mp3 em algum cenário)
          // const buf = await decodeToAudioBuffer(recorded);
          // const { samples, sampleRate } = await resampleTo44100Mono(buf, 44100);
          // const mp3Blob = await encodeMp3Mono(samples, sampleRate, 128);
          // downloadFile("audio.mp3", mp3Blob);
        } catch (e) {
          console.error("Falha ao processar áudio:", e);
        }
      };

      resolve(mediaRecorder);
    } catch (err) {
      console.error("Erro ao acessar microfone:", err);
      reject(err);
    }
  });
}

// ================== UI (botão/injeção) ==================
function sendAudio_cloud() {
  if (!navigator.mediaDevices?.getUserMedia) {
    console.error("getUserMedia não suportado.");
    return;
  }

  let mediaRecorder: MediaRecorder;

  const toGetParentDiv: HTMLElement | null = document.getElementById("clear");
  if (!toGetParentDiv) {
    console.error("Div pai não encontrada (#clear).");
    return;
  }
  const targetDiv: HTMLElement | null = toGetParentDiv.parentElement;
  if (!targetDiv) {
    console.error("targetDiv não encontrado.");
    return;
  }

  const containerClass = "setSupporterButtonCloud";
  if (targetDiv.querySelector("." + containerClass)) {
    return; // já existe
  }

  const container = document.createElement("div");
  container.className = containerClass;
  container.style.position = "relative";
  container.id = "setSupporterButton1Cloud";

  const button = document.createElement("button");
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

  const img = document.createElement("img");
  img.id = "ImageAudioButtonCloud";
  img.src = "https://titobahe.github.io/voice-svgrepo-com.svg";
  img.alt = "mic";
  img.style.width = "20px";
  img.style.height = "20px";
  button.appendChild(img);

  button.addEventListener("click", async () => {
    if (button.getAttribute("isActive") === "0") {
      const ok = await IsMicOpen_cloud();
      if (!ok) console.warn("Microfone sem permissão (vamos tentar mesmo assim).");

      button.style.backgroundColor = "#db2d21";
      img.src = "https://titobahe.github.io/stop.svg";
      button.setAttribute("isActive", "1");

      const mr = await startHearing_cloud("loc", "conv", "contact");
      mediaRecorder = mr;
      mediaRecorder?.start();
    } else {
      button.style.backgroundColor = "#ffffff";
      button.setAttribute("isActive", "0");
      img.src = "https://titobahe.github.io/voice-svgrepo-com.svg";
      mediaRecorder?.stop();
    }
  });

  container.appendChild(button);
  targetDiv.prepend(container);
}

// Observa a página e injeta o botão
const observer_cloud = new MutationObserver(sendAudio_cloud);
observer_cloud.observe(document.body, { childList: true, subtree: true });
document.addEventListener("DOMContentLoaded", sendAudio_cloud);
