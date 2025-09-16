// === UTIL: carregar lamejs (UMD) via CDN: sem require, funciona no browser puro ===
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
  
  // === UTILs de áudio ===
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
  
  // Resample para 44.1kHz mono (compat máximo com WhatsApp mobile)
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
    const encoder = new lame.Mp3Encoder(1, sampleRate, bitrateKbps); // 1 canal (mono)
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
  
  // Escolher o melhor mime sem ogg
  function getPreferredMime(): string | undefined {
    const candidates = [
      "audio/mpeg",              // se o browser der suporte nativo a mp3, ótimo
      "audio/webm;codecs=opus",
      "audio/webm",
    ];
    for (const m of candidates) {
      if (MediaRecorder.isTypeSupported?.(m)) return m;
    }
    return undefined; // deixa o browser escolher
  }
  
  // ============ SUA LÓGICA ============
  
  // (opcional) checar permissão do mic
  async function IsMicOpen_cloud(): Promise<boolean> {
    try {
      const status = await (navigator.permissions as any)?.query?.({ name: "microphone" as PermissionName });
      if (!status) return true; // alguns browsers não expõem
      return status.state === "granted";
    } catch {
      return true;
    }
  }
  
  function startHearing_cloud(locationId: string, conversationId: string, contactId: string): Promise<MediaRecorder> {
    return new Promise(async (resolve, reject) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const chunks: Blob[] = [];
        const mime = getPreferredMime();
        const mediaRecorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
  
        mediaRecorder.ondataavailable = (e: BlobEvent) => {
          if (e.data && e.data.size > 0) chunks.push(e.data);
        };
  
        mediaRecorder.onstop = async () => {
          // Junta os chunks (normalmente webm/opus ou audio/mpeg)
          const recorded = new Blob(chunks, { type: chunks[0]?.type || mediaRecorder.mimeType || "audio/webm" });
  
          // Converte para MP3 real (resample 44.1k mono)
          try {
            const audioBuffer = await decodeToAudioBuffer(recorded);
            const { samples, sampleRate } = await resampleTo44100Mono(audioBuffer, 44100);
            const mp3Blob = await encodeMp3Mono(samples, sampleRate, 128); // CBR 128 kbps
  
            // Baixar como MP3 (ou enviar)
            const url = URL.createObjectURL(mp3Blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "audio.mp3";
            document.body.appendChild(a);
            a.click();
            a.remove();
            // URL.revokeObjectURL(url); // se quiser revogar depois
          } catch (e) {
            console.error("Falha ao gerar MP3:", e);
          }
        };
  
        resolve(mediaRecorder);
      } catch (err) {
        console.error("Erro ao acessar microfone:", err);
        reject(err);
      }
    });
  }
  
  // Botão/injeção (mantive sua estrutura base; adapte aos seus elementos)
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
      // já existe
      return;
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
        // iniciar
        const ok = await IsMicOpen_cloud();
        if (!ok) {
          console.warn("Microfone sem permissão.");
          // ainda assim tentamos - alguns browsers não expõem o permissions API
        }
        button.style.backgroundColor = "#db2d21";
        img.src = "https://titobahe.github.io/stop.svg";
        button.setAttribute("isActive", "1");
  
        mediaRecorder = await startHearing_cloud("loc", "conv", "contact");
        mediaRecorder?.start();
      } else {
        // parar
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
  