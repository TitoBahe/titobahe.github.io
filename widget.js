(function(){
"use strict";
// --- styles.js ---
"use strict";
const STYLES = `
/* Fullzapp Widget Styles */
.fz-widget * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }

/* Trigger Button */
.fz-trigger { display: flex; align-items: center; justify-content: center; padding: 6px 10px; background: #e5e7eb; border: none; border-radius: 6px; cursor: pointer; transition: background 0.15s; }
.fz-trigger:hover { background: #d1d5db; }
.fz-trigger img { height: 18px; }

/* Overlay */
.fz-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.1); backdrop-filter: blur(2px); z-index: 9998; opacity: 0; transition: opacity 0.15s; }
.fz-overlay.open { opacity: 1; }

/* Dialog */
.fz-dialog { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.95); z-index: 9999; background: #fff; border: 1px solid rgba(139,92,246,0.2); border-radius: 12px; padding: 16px; width: 90%; max-width: 380px; box-shadow: 0 8px 32px rgba(0,0,0,0.12); opacity: 0; transition: all 0.15s; }
.fz-dialog.open { opacity: 1; transform: translate(-50%, -50%) scale(1); }

/* Close button */
.fz-close { position: absolute; top: 8px; right: 8px; background: none; border: none; cursor: pointer; color: #9ca3af; font-size: 18px; padding: 4px 8px; border-radius: 6px; transition: all 0.15s; }
.fz-close:hover { background: #f3f4f6; color: #374151; }

/* Title */
.fz-title { font-size: 14px; font-weight: 600; color: #6d28d9; margin-bottom: 12px; }

/* Cards */
.fz-card { display: flex; align-items: center; gap: 12px; padding: 14px; border: 1px solid rgba(139,92,246,0.2); border-radius: 10px; cursor: pointer; transition: all 0.15s; margin-bottom: 10px; background: #fff; }
.fz-card:hover { box-shadow: 0 4px 12px rgba(139,92,246,0.1); border-color: rgba(139,92,246,0.4); }
.fz-card:active { transform: scale(0.98); }
.fz-card-icon { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: rgba(139,92,246,0.12); font-size: 18px; flex-shrink: 0; }
.fz-card-info h3 { font-size: 13px; font-weight: 600; color: #581c87; }
.fz-card-info p { font-size: 11px; color: #6b7280; margin-top: 2px; }

/* Back button */
.fz-back { background: none; border: none; cursor: pointer; color: #9ca3af; font-size: 12px; padding: 4px 0; transition: color 0.15s; }
.fz-back:hover { color: #374151; }

/* Language toggle */
.fz-lang-toggle { display: flex; border: 1px solid #d1d5db; background: #f1f5f9; border-radius: 8px; padding: 2px; gap: 2px; }
.fz-lang-btn { border: none; background: transparent; padding: 4px 10px; border-radius: 6px; cursor: pointer; font-size: 13px; transition: all 0.15s; }
.fz-lang-btn.active { background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.fz-lang-btn:hover:not(.active) { background: rgba(0,0,0,0.04); }

/* Badge */
.fz-badge { display: inline-block; font-size: 11px; padding: 3px 10px; border-radius: 999px; border: 1px solid rgba(59,130,246,0.3); background: rgba(59,130,246,0.1); color: #1d4ed8; margin-bottom: 10px; }
.fz-badge.success { border-color: rgba(16,185,129,0.3); background: rgba(16,185,129,0.1); color: #047857; }
.fz-badge.error { border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.1); color: #b91c1c; }

/* Description */
.fz-desc { font-size: 11px; color: #6b7280; margin-bottom: 8px; }

/* Scroll area */
.fz-scroll { max-height: 230px; overflow-y: auto; border: 1px solid rgba(139,92,246,0.2); border-radius: 8px; padding: 10px; }

/* Copy hint */
.fz-copy-hint { font-size: 9px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; color: #7c3aed; opacity: 0; transition: opacity 0.15s; }
.fz-card:hover .fz-copy-hint { opacity: 1; }

/* Header row */
.fz-header-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }

/* Audio */
.fz-audio-center { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 24px 0; }
.fz-mic-btn { width: 80px; height: 80px; border-radius: 50%; border: 2px solid rgba(139,92,246,0.3); background: rgba(139,92,246,0.12); display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 32px; transition: all 0.15s; }
.fz-mic-btn:hover { background: rgba(139,92,246,0.2); border-color: rgba(139,92,246,0.5); transform: scale(1.05); }
.fz-mic-btn:active { transform: scale(0.95); }
.fz-mic-hint { font-size: 13px; color: #6b7280; }

/* Recording state */
.fz-rec-btn { width: 80px; height: 80px; border-radius: 50%; border: 2px solid rgba(239,68,68,0.4); background: rgba(239,68,68,0.12); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s; position: relative; }
.fz-rec-btn:hover { background: rgba(239,68,68,0.2); }
.fz-rec-btn:active { transform: scale(0.95); }
.fz-rec-stop { width: 28px; height: 28px; border-radius: 4px; background: #ef4444; }
.fz-rec-ping { position: absolute; inset: 0; border-radius: 50%; background: rgba(239,68,68,0.2); animation: fz-ping 1.5s cubic-bezier(0,0,0.2,1) infinite; }
@keyframes fz-ping { 0% { transform: scale(1); opacity: 1; } 75%,100% { transform: scale(1.4); opacity: 0; } }
.fz-rec-timer { font-size: 24px; font-family: monospace; font-weight: 600; color: #ef4444; }
.fz-rec-label { font-size: 12px; color: #f87171; display: flex; align-items: center; gap: 6px; }
.fz-rec-dot { width: 8px; height: 8px; border-radius: 50%; background: #ef4444; animation: fz-pulse 1s ease-in-out infinite; }
@keyframes fz-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

/* Playback */
.fz-playback { border: 1px solid rgba(139,92,246,0.2); border-radius: 10px; padding: 14px; display: flex; align-items: center; gap: 14px; }
.fz-play-btn { width: 48px; height: 48px; border-radius: 50%; border: 1px solid rgba(139,92,246,0.3); background: rgba(139,92,246,0.12); display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; font-size: 16px; color: #7c3aed; transition: all 0.15s; }
.fz-play-btn:hover { background: rgba(139,92,246,0.2); }
.fz-play-btn:active { transform: scale(0.95); }
.fz-progress-wrap { flex: 1; }
.fz-progress-bar { height: 6px; background: rgba(139,92,246,0.1); border-radius: 999px; overflow: hidden; }
.fz-progress-fill { height: 100%; background: #8b5cf6; border-radius: 999px; transition: width 0.3s; }
.fz-progress-times { display: flex; justify-content: space-between; margin-top: 4px; font-size: 11px; color: #6b7280; font-family: monospace; }

/* Action buttons */
.fz-actions { display: flex; gap: 10px; margin-top: 14px; }
.fz-btn { flex: 1; padding: 10px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; text-align: center; border: none; }
.fz-btn:active { transform: scale(0.98); }
.fz-btn-discard { background: #fff; border: 1px solid rgba(139,92,246,0.2); color: #6b7280; }
.fz-btn-discard:hover { background: #f9fafb; color: #374151; }
.fz-btn-send { background: #7c3aed; color: #fff; }
.fz-btn-send:hover { background: #6d28d9; }
`;
function injectStyles() {
    const style = document.createElement("style");
    style.textContent = STYLES;
    document.head.appendChild(style);
}

// --- features.js ---
"use strict";
const brFeatures = {
    contact: `@Contato📬:\nNome do Contato: []\nOrganização: []\nNumero: []`,
    location: `@Localização🌎:\nTítulo: []\nlatitude: []\nlongitude: []`,
    poll: `@Enquete📊:\nNome: []\nOpções: []\nMultiplas Respostas(1): [0]`,
};
const usFeatures = {
    contact: `@Contact📬:\nContact Name: []\nOrganization: []\nNumber: []`,
    location: `@Location🌎:\nTitle: []\nlatitude: []\nlongitude: []`,
    poll: `@Poll📊:\nName: []\nOptions: []\nMultiple Answers(1): [0]`,
};
const mxFeatures = {
    contact: `@Contacto📬:\nNombre del Contacto: []\nOrganización: []\nNúmero: []`,
    location: `@Ubicación🌎:\nTítulo: []\nlatitude: []\nlongitude: []`,
    poll: `@Encuesta📊:\nNombre: []\nOpciones: []\nRespuestas Múltiples(1): [0]`,
};
const allFeatures = { us: usFeatures, br: brFeatures, mx: mxFeatures };
const featuresMeta = {
    us: {
        contact: { label: "Contact", description: "Share contact information" },
        location: { label: "Location", description: "Send a location pin" },
        poll: { label: "Poll", description: "Create a poll" },
    },
    br: {
        contact: { label: "Contato", description: "Compartilhar informações de contato" },
        location: { label: "Localização", description: "Enviar uma localização" },
        poll: { label: "Enquete", description: "Criar uma enquete" },
    },
    mx: {
        contact: { label: "Contacto", description: "Compartir información de contacto" },
        location: { label: "Ubicación", description: "Enviar una ubicación" },
        poll: { label: "Encuesta", description: "Crear una encuesta" },
    },
};
const featureKeys = [
    { key: "contact", emoji: "📬" },
    { key: "location", emoji: "🌎" },
    { key: "poll", emoji: "📊" },
];
const languages = [
    { code: "us", flag: "🇺🇸" },
    { code: "br", flag: "🇧🇷" },
    { code: "mx", flag: "🇲🇽" },
];
const uiStrings = {
    us: { title: "Message Templates", description: "Click on a template below to copy it, then paste it into the GHL text area.", badge: "Click to copy to your clipboard", copied: "Copied!" },
    br: { title: "Modelos de Mensagem", description: "Clique em um modelo abaixo para copiá-lo, depois cole na área de texto do GHL.", badge: "Clique para copiar", copied: "Copiado!" },
    mx: { title: "Plantillas de Mensaje", description: "Haz clic en una plantilla para copiarla, luego pégala en el área de texto del GHL.", badge: "Haz clic para copiar", copied: "Copiado!" },
};

// --- ghl-ids.js ---
"use strict";
function captureGHLIds() {
    const url = window.location.href;
    const locationMatch = url.match(/location\/([a-zA-Z0-9]+)/);
    const contactMatch = url.match(/contacts\/detail\/([a-zA-Z0-9]+)/);
    let contactId = contactMatch?.[1] ?? "not found";
    const locationId = locationMatch?.[1] ?? "not found";
    const conversationListTab = document.getElementById("conversations-list");
    if (conversationListTab) {
        const activeTab = conversationListTab.querySelector('[data-is-active="true"]');
        contactId = activeTab?.getAttribute("contactid") || contactId;
    }
    const missing = [];
    if (locationId === "not found")
        missing.push("locationId");
    if (contactId === "not found")
        missing.push("contactId");
    if (missing.length > 0) {
        console.error(`Missing IDs: ${missing.join(", ")} ❌`);
        return { ok: false, missing };
    }
    console.log("Captured locationId:", locationId);
    console.log("Captured contactId:", contactId);
    return { ok: true, locationId, contactId };
}

// --- audio-view.js ---
"use strict";
function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}
function renderAudioView(container, onBack, onCloseDialog) {
    let state = "idle";
    let elapsed = 0;
    let timerInterval = null;
    let mediaRecorder = null;
    let chunks = [];
    let audioBlob = null;
    let audioUrl = null;
    let audioEl = null;
    let isPlaying = false;
    let playbackTime = 0;
    function cleanup() {
        if (timerInterval)
            clearInterval(timerInterval);
        if (audioUrl)
            URL.revokeObjectURL(audioUrl);
    }
    function render() {
        container.innerHTML = "";
        // Back button
        const back = document.createElement("button");
        back.className = "fz-back";
        back.innerHTML = "&larr;";
        back.onclick = () => { cleanup(); onBack(); };
        container.appendChild(back);
        if (state === "idle") {
            const center = document.createElement("div");
            center.className = "fz-audio-center";
            const micBtn = document.createElement("button");
            micBtn.className = "fz-mic-btn";
            micBtn.textContent = "🎙️";
            micBtn.onclick = startRecording;
            const hint = document.createElement("p");
            hint.className = "fz-mic-hint";
            hint.textContent = "Tap to start recording";
            center.append(micBtn, hint);
            container.appendChild(center);
        }
        if (state === "recording") {
            const center = document.createElement("div");
            center.className = "fz-audio-center";
            const btnWrap = document.createElement("div");
            btnWrap.style.position = "relative";
            const ping = document.createElement("div");
            ping.className = "fz-rec-ping";
            const recBtn = document.createElement("button");
            recBtn.className = "fz-rec-btn";
            const stopSquare = document.createElement("div");
            stopSquare.className = "fz-rec-stop";
            recBtn.appendChild(stopSquare);
            recBtn.onclick = stopRecording;
            btnWrap.append(ping, recBtn);
            const timer = document.createElement("span");
            timer.className = "fz-rec-timer";
            timer.id = "fz-timer";
            timer.textContent = formatTime(elapsed);
            const label = document.createElement("span");
            label.className = "fz-rec-label";
            const dot = document.createElement("span");
            dot.className = "fz-rec-dot";
            label.append(dot, document.createTextNode(" Recording..."));
            center.append(btnWrap, timer, label);
            container.appendChild(center);
        }
        if (state === "recorded" && audioUrl) {
            const wrap = document.createElement("div");
            wrap.style.padding = "16px 0";
            wrap.style.display = "flex";
            wrap.style.flexDirection = "column";
            wrap.style.gap = "14px";
            // Audio element
            audioEl = document.createElement("audio");
            audioEl.src = audioUrl;
            audioEl.ontimeupdate = () => {
                if (audioEl) {
                    playbackTime = Math.floor(audioEl.currentTime);
                    updateProgress();
                }
            };
            audioEl.onended = () => {
                isPlaying = false;
                playbackTime = 0;
                updateProgress();
                updatePlayBtn();
            };
            wrap.appendChild(audioEl);
            // Playback card
            const playback = document.createElement("div");
            playback.className = "fz-playback";
            const playBtn = document.createElement("button");
            playBtn.className = "fz-play-btn";
            playBtn.id = "fz-play-btn";
            playBtn.textContent = "▶";
            playBtn.onclick = togglePlayback;
            const progressWrap = document.createElement("div");
            progressWrap.className = "fz-progress-wrap";
            const progressBar = document.createElement("div");
            progressBar.className = "fz-progress-bar";
            const progressFill = document.createElement("div");
            progressFill.className = "fz-progress-fill";
            progressFill.id = "fz-progress-fill";
            progressFill.style.width = "0%";
            progressBar.appendChild(progressFill);
            const times = document.createElement("div");
            times.className = "fz-progress-times";
            times.innerHTML = `<span id="fz-cur-time">${formatTime(0)}</span><span>${formatTime(elapsed)}</span>`;
            progressWrap.append(progressBar, times);
            playback.append(playBtn, progressWrap);
            wrap.appendChild(playback);
            // Error badge
            const errorBadge = document.createElement("span");
            errorBadge.className = "fz-badge error";
            errorBadge.id = "fz-audio-error";
            errorBadge.style.display = "none";
            wrap.appendChild(errorBadge);
            // Actions
            const actions = document.createElement("div");
            actions.className = "fz-actions";
            const discardBtn = document.createElement("button");
            discardBtn.className = "fz-btn fz-btn-discard";
            discardBtn.textContent = "Discard";
            discardBtn.onclick = () => { cleanup(); resetState(); render(); };
            const sendBtn = document.createElement("button");
            sendBtn.className = "fz-btn fz-btn-send";
            sendBtn.textContent = "Send";
            sendBtn.onclick = handleSend;
            actions.append(discardBtn, sendBtn);
            wrap.appendChild(actions);
            container.appendChild(wrap);
        }
    }
    function updateProgress() {
        const fill = document.getElementById("fz-progress-fill");
        const curTime = document.getElementById("fz-cur-time");
        if (fill)
            fill.style.width = elapsed > 0 ? `${(playbackTime / elapsed) * 100}%` : "0%";
        if (curTime)
            curTime.textContent = formatTime(playbackTime);
    }
    function updatePlayBtn() {
        const btn = document.getElementById("fz-play-btn");
        if (btn)
            btn.textContent = isPlaying ? "⏸" : "▶";
    }
    function togglePlayback() {
        if (!audioEl)
            return;
        if (isPlaying) {
            audioEl.pause();
        }
        else {
            audioEl.play();
        }
        isPlaying = !isPlaying;
        updatePlayBtn();
    }
    async function startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            mediaRecorder = recorder;
            chunks = [];
            recorder.ondataavailable = (e) => { if (e.data.size > 0)
                chunks.push(e.data); };
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: "audio/webm" });
                audioBlob = blob;
                audioUrl = URL.createObjectURL(blob);
                state = "recorded";
                stream.getTracks().forEach(t => t.stop());
                render();
            };
            recorder.start();
            state = "recording";
            elapsed = 0;
            render();
            timerInterval = setInterval(() => {
                elapsed++;
                const timer = document.getElementById("fz-timer");
                if (timer)
                    timer.textContent = formatTime(elapsed);
            }, 1000);
        }
        catch {
            alert("Microphone access denied");
        }
    }
    function stopRecording() {
        if (timerInterval)
            clearInterval(timerInterval);
        mediaRecorder?.stop();
    }
    function resetState() {
        state = "idle";
        elapsed = 0;
        audioBlob = null;
        if (audioUrl)
            URL.revokeObjectURL(audioUrl);
        audioUrl = null;
        isPlaying = false;
        playbackTime = 0;
    }
    async function handleSend() {
        const errorEl = document.getElementById("fz-audio-error");
        const ids = captureGHLIds();
        if (!ids.ok) {
            if (errorEl) {
                errorEl.textContent = `Missing: ${ids.missing.join(", ")}`;
                errorEl.style.display = "inline-block";
            }
            return;
        }
        if (!audioBlob) {
            if (errorEl) {
                errorEl.textContent = "No audio recorded";
                errorEl.style.display = "inline-block";
            }
            return;
        }
        const formData = new FormData();
        formData.append("audio", audioBlob, "audio.webm");
        formData.append("locationId", ids.locationId);
        formData.append("contactId", ids.contactId);
        try {
            const res = await fetch("https://outbound.fullzapp.com/webhook/ghl/v1/external-audio", {
                method: "POST",
                body: formData,
            });
            if (!res.ok) {
                if (errorEl) {
                    errorEl.textContent = `Send failed: ${res.status}`;
                    errorEl.style.display = "inline-block";
                }
                console.error("Send failed:", res.status);
                return;
            }
            console.log("Audio sent successfully");
            cleanup();
            resetState();
            onCloseDialog();
        }
        catch (err) {
            if (errorEl) {
                errorEl.textContent = "Network error, try again";
                errorEl.style.display = "inline-block";
            }
            console.error("Network error:", err);
        }
    }
    render();
}

// --- features-view.js ---
"use strict";
function renderFeaturesView(container, onBack, onCloseDialog) {
    let lang = "us";
    let copied = false;
    function render() {
        container.innerHTML = "";
        const ui = uiStrings[lang];
        const meta = featuresMeta[lang];
        const texts = allFeatures[lang];
        // Header row: back + lang toggle + title
        const header = document.createElement("div");
        header.className = "fz-header-row";
        const back = document.createElement("button");
        back.className = "fz-back";
        back.innerHTML = "&larr;";
        back.onclick = onBack;
        const toggle = document.createElement("div");
        toggle.className = "fz-lang-toggle";
        languages.forEach(l => {
            const btn = document.createElement("button");
            btn.className = `fz-lang-btn${l.code === lang ? " active" : ""}`;
            btn.textContent = l.flag;
            btn.onclick = () => { lang = l.code; render(); };
            toggle.appendChild(btn);
        });
        const title = document.createElement("h3");
        title.className = "fz-title";
        title.style.marginBottom = "0";
        title.textContent = ui.title;
        header.append(back, toggle, title);
        container.appendChild(header);
        // Description
        const desc = document.createElement("p");
        desc.className = "fz-desc";
        desc.textContent = ui.description;
        container.appendChild(desc);
        // Badge
        const badge = document.createElement("span");
        badge.className = `fz-badge${copied ? " success" : ""}`;
        badge.textContent = copied ? `✓ ${ui.copied}` : ui.badge;
        container.appendChild(badge);
        // Scroll area with cards
        const scroll = document.createElement("div");
        scroll.className = "fz-scroll";
        featureKeys.forEach(f => {
            const card = document.createElement("div");
            card.className = "fz-card";
            const icon = document.createElement("div");
            icon.className = "fz-card-icon";
            icon.textContent = f.emoji;
            const info = document.createElement("div");
            info.className = "fz-card-info";
            info.style.flex = "1";
            info.innerHTML = `<h3>${meta[f.key].label}</h3><p>${meta[f.key].description}</p>`;
            const hint = document.createElement("span");
            hint.className = "fz-copy-hint";
            hint.textContent = "copy";
            card.append(icon, info, hint);
            card.onclick = () => handleCopy(f.key, texts);
            scroll.appendChild(card);
        });
        container.appendChild(scroll);
    }
    async function handleCopy(key, texts) {
        await navigator.clipboard.writeText(texts[key].trim());
        copied = true;
        render();
        setTimeout(() => {
            copied = false;
            onCloseDialog();
        }, 600);
    }
    render();
}

// --- menu-view.js ---
"use strict";
function renderMenuView(container, onNavigate) {
    container.innerHTML = "";
    const title = document.createElement("h3");
    title.className = "fz-title";
    title.textContent = "Fullzapp Tools";
    container.appendChild(title);
    const items = [
        { id: "audio", emoji: "🎙️", label: "Record Audio", desc: "Record and send a voice message" },
        { id: "features", emoji: "📬", label: "Message Templates", desc: "Copy message templates to clipboard" },
    ];
    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "fz-card";
        const icon = document.createElement("div");
        icon.className = "fz-card-icon";
        icon.textContent = item.emoji;
        const info = document.createElement("div");
        info.className = "fz-card-info";
        info.innerHTML = `<h3>${item.label}</h3><p>${item.desc}</p>`;
        card.append(icon, info);
        card.onclick = () => onNavigate(item.id);
        container.appendChild(card);
    });
}

// --- dialog.js ---
"use strict";
function createDialog(triggerParent) {
    const LOGO_URL = "https://titobahe.github.io/Z_do_Fullzapp.svg";
    // Container identificador (pra checagem de duplicata)
    const container = document.createElement("div");
    container.className = "fz-trigger-wrap";
    container.style.position = "relative";
    // Trigger button
    const trigger = document.createElement("button");
    trigger.className = "fz-trigger";
    const img = document.createElement("img");
    img.src = LOGO_URL;
    trigger.appendChild(img);
    container.appendChild(trigger);
    triggerParent.prepend(container);
    // Overlay
    const overlay = document.createElement("div");
    overlay.className = "fz-overlay";
    document.body.appendChild(overlay);
    // Dialog
    const dialog = document.createElement("div");
    dialog.className = "fz-dialog fz-widget";
    const closeBtn = document.createElement("button");
    closeBtn.className = "fz-close";
    closeBtn.textContent = "✕";
    dialog.appendChild(closeBtn);
    const content = document.createElement("div");
    dialog.appendChild(content);
    document.body.appendChild(dialog);
    let currentView = "menu";
    function open() {
        overlay.classList.add("open");
        dialog.classList.add("open");
        currentView = "menu";
        renderCurrent();
    }
    function close() {
        overlay.classList.remove("open");
        dialog.classList.remove("open");
    }
    function renderCurrent() {
        if (currentView === "menu") {
            renderMenuView(content, (view) => { currentView = view; renderCurrent(); });
        }
        else if (currentView === "features") {
            renderFeaturesView(content, () => { currentView = "menu"; renderCurrent(); }, close);
        }
        else if (currentView === "audio") {
            renderAudioView(content, () => { currentView = "menu"; renderCurrent(); }, close);
        }
    }
    trigger.onclick = open;
    closeBtn.onclick = close;
    overlay.onclick = close;
}

// --- main.js ---
"use strict";
console.log("🚀🚀🚀 [Fullzapp Widget] Script carregado!");
injectStyles();
let fzWidgetInjected = false;
function initWidget() {
    if (fzWidgetInjected)
        return;
    const targetDiv = document.getElementById("conv-composer-toolbar");
    if (!targetDiv) {
        return;
    }
    // Já existe? Não duplica
    if (targetDiv.querySelector(".fz-trigger")) {
        fzWidgetInjected = true;
        return;
    }
    console.log("✅✅✅ [Fullzapp Widget] #conv-composer-toolbar encontrado! Injetando botão...");
    fzWidgetInjected = true;
    createDialog(targetDiv);
}
const fzObserver = new MutationObserver(initWidget);
fzObserver.observe(document.body, { childList: true, subtree: true });
document.addEventListener("DOMContentLoaded", initWidget);
initWidget();

})();
