"use strict";
// ====== FEATURES DATA ======
const allFeatures = {
    us: {
        contact: `@Contact📬:\nContact Name: []\nOrganization: []\nNumber: []`,
        location: `@Location🌎:\nTitle: []\nlatitude: []\nlongitude: []`,
        poll: `@Poll📊:\nName: []\nOptions: []\nMultiple Answers(1): [0]`,
    },
    br: {
        contact: `@Contato📬:\nNome do Contato: []\nOrganização: []\nNumero: []`,
        location: `@Localização🌎:\nTítulo: []\nlatitude: []\nlongitude: []`,
        poll: `@Enquete📊:\nNome: []\nOpções: []\nMultiplas Respostas(1): [0]`,
    },
    mx: {
        contact: `@Contacto📬:\nNombre del Contacto: []\nOrganización: []\nNúmero: []`,
        location: `@Ubicación🌎:\nTítulo: []\nlatitude: []\nlongitude: []`,
        poll: `@Encuesta📊:\nNombre: []\nOpciones: []\nRespuestas Múltiples(1): [0]`,
    },
};
const featuresMeta = {
    us: {
        contact: { label: "Contact", desc: "Share contact information" },
        location: { label: "Location", desc: "Send a location pin" },
        poll: { label: "Poll", desc: "Create a poll" },
    },
    br: {
        contact: { label: "Contato", desc: "Compartilhar informações de contato" },
        location: { label: "Localização", desc: "Enviar uma localização" },
        poll: { label: "Enquete", desc: "Criar uma enquete" },
    },
    mx: {
        contact: { label: "Contacto", desc: "Compartir información de contacto" },
        location: { label: "Ubicación", desc: "Enviar una ubicación" },
        poll: { label: "Encuesta", desc: "Crear una encuesta" },
    },
};
const uiStrings = {
    us: { title: "Message Templates", desc: "Click on a template to copy it, then paste into the GHL text area.", badge: "Click to copy", copied: "Copied!" },
    br: { title: "Modelos de Mensagem", desc: "Clique em um modelo para copiá-lo, depois cole na área de texto do GHL.", badge: "Clique para copiar", copied: "Copiado!" },
    mx: { title: "Plantillas de Mensaje", desc: "Haz clic en una plantilla para copiarla, luego pégala en el área de texto del GHL.", badge: "Haz clic para copiar", copied: "Copiado!" },
};
const featureKeys = [
    { key: "contact", emoji: "📬" },
    { key: "location", emoji: "🌎" },
    { key: "poll", emoji: "📊" },
];
const langs = [
    { code: "us", flag: "🇺🇸" },
    { code: "br", flag: "🇧🇷" },
    { code: "mx", flag: "🇲🇽" },
];
// ====== GHL IDS ======
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
    return { ok: true, locationId, contactId };
}
// ====== STYLES ======
function injectWidgetStyles() {
    if (document.getElementById("fz-widget-styles"))
        return;
    const style = document.createElement("style");
    style.id = "fz-widget-styles";
    style.textContent = `
.fz-dropdown { display:none; position:absolute; bottom:110%; left:0; background:#fff; border:1px solid #e5e7eb; border-radius:10px; box-shadow:0 8px 32px rgba(0,0,0,0.15); z-index:9999; padding:14px; width:320px; max-height:420px; overflow-y:auto; }
.fz-dropdown.open { display:block; }
.fz-title { font-size:14px; font-weight:600; color:#6d28d9; margin-bottom:10px; }
.fz-back { background:none; border:none; cursor:pointer; color:#9ca3af; font-size:12px; padding:2px 0; }
.fz-back:hover { color:#374151; }
.fz-card { display:flex; align-items:center; gap:10px; padding:12px; border:1px solid rgba(139,92,246,0.2); border-radius:8px; cursor:pointer; margin-bottom:8px; background:#fff; transition:all 0.15s; }
.fz-card:hover { box-shadow:0 2px 8px rgba(139,92,246,0.1); border-color:rgba(139,92,246,0.4); }
.fz-card:active { transform:scale(0.98); }
.fz-card-icon { width:36px; height:36px; display:flex; align-items:center; justify-content:center; border-radius:50%; background:rgba(139,92,246,0.12); font-size:16px; flex-shrink:0; }
.fz-card-label { font-size:12px; font-weight:600; color:#581c87; }
.fz-card-desc { font-size:10px; color:#6b7280; margin-top:1px; }
.fz-card-hint { font-size:9px; font-weight:500; text-transform:uppercase; letter-spacing:0.05em; color:#7c3aed; opacity:0; transition:opacity 0.15s; }
.fz-card:hover .fz-card-hint { opacity:1; }
.fz-header { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
.fz-lang-toggle { display:flex; border:1px solid #d1d5db; background:#f1f5f9; border-radius:6px; padding:2px; gap:2px; }
.fz-lang-btn { border:none; background:transparent; padding:3px 8px; border-radius:4px; cursor:pointer; font-size:12px; transition:all 0.15s; }
.fz-lang-btn.active { background:#fff; box-shadow:0 1px 3px rgba(0,0,0,0.1); }
.fz-desc { font-size:10px; color:#6b7280; margin-bottom:6px; }
.fz-badge { display:inline-block; font-size:10px; padding:2px 8px; border-radius:999px; border:1px solid rgba(59,130,246,0.3); background:rgba(59,130,246,0.1); color:#1d4ed8; margin-bottom:8px; }
.fz-badge.success { border-color:rgba(16,185,129,0.3); background:rgba(16,185,129,0.1); color:#047857; }
.fz-badge.error { border-color:rgba(239,68,68,0.3); background:rgba(239,68,68,0.1); color:#b91c1c; }
.fz-scroll { max-height:180px; overflow-y:auto; }
.fz-audio-center { display:flex; flex-direction:column; align-items:center; gap:14px; padding:20px 0; }
.fz-mic-btn { width:64px; height:64px; border-radius:50%; border:2px solid rgba(139,92,246,0.3); background:rgba(139,92,246,0.12); display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:28px; transition:all 0.15s; }
.fz-mic-btn:hover { background:rgba(139,92,246,0.2); transform:scale(1.05); }
.fz-mic-btn:active { transform:scale(0.95); }
.fz-rec-wrap { position:relative; }
.fz-rec-ping { position:absolute; inset:0; border-radius:50%; background:rgba(239,68,68,0.2); animation:fzPing 1.5s cubic-bezier(0,0,0.2,1) infinite; }
@keyframes fzPing { 0%{transform:scale(1);opacity:1} 75%,100%{transform:scale(1.4);opacity:0} }
.fz-rec-btn { width:64px; height:64px; border-radius:50%; border:2px solid rgba(239,68,68,0.4); background:rgba(239,68,68,0.12); display:flex; align-items:center; justify-content:center; cursor:pointer; position:relative; transition:all 0.15s; }
.fz-rec-btn:active { transform:scale(0.95); }
.fz-rec-stop { width:24px; height:24px; border-radius:4px; background:#ef4444; }
.fz-rec-timer { font-size:20px; font-family:monospace; font-weight:600; color:#ef4444; }
.fz-rec-label { font-size:11px; color:#f87171; display:flex; align-items:center; gap:5px; }
.fz-rec-dot { width:7px; height:7px; border-radius:50%; background:#ef4444; animation:fzPulse 1s ease-in-out infinite; }
@keyframes fzPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
.fz-playback { border:1px solid rgba(139,92,246,0.2); border-radius:8px; padding:12px; display:flex; align-items:center; gap:12px; margin-bottom:10px; }
.fz-play-btn { width:40px; height:40px; border-radius:50%; border:1px solid rgba(139,92,246,0.3); background:rgba(139,92,246,0.12); display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; font-size:14px; color:#7c3aed; transition:all 0.15s; }
.fz-play-btn:active { transform:scale(0.95); }
.fz-progress-bar { height:5px; background:rgba(139,92,246,0.1); border-radius:999px; overflow:hidden; }
.fz-progress-fill { height:100%; background:#8b5cf6; border-radius:999px; transition:width 0.3s; }
.fz-progress-times { display:flex; justify-content:space-between; margin-top:3px; font-size:10px; color:#6b7280; font-family:monospace; }
.fz-actions { display:flex; gap:8px; }
.fz-btn { flex:1; padding:8px; border-radius:6px; font-size:12px; font-weight:500; cursor:pointer; text-align:center; border:none; transition:all 0.15s; }
.fz-btn:active { transform:scale(0.98); }
.fz-btn-discard { background:#fff; border:1px solid rgba(139,92,246,0.2); color:#6b7280; }
.fz-btn-discard:hover { background:#f9fafb; }
.fz-btn-send { background:#7c3aed; color:#fff; }
.fz-btn-send:hover { background:#6d28d9; }
`;
    document.head.appendChild(style);
}
// ====== FORMAT TIME ======
function fzFormatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}
// ====== MAIN WIDGET ======
function initFullzappWidget() {
    const targetDiv = document.getElementById("conv-composer-toolbar");
    if (!targetDiv)
        return;
    if (targetDiv.querySelector(".fullzappWidgetContainer"))
        return;
    console.log("✅ [Fullzapp Widget] Injetando botão...");
    const container = document.createElement("div");
    container.className = "fullzappWidgetContainer";
    container.style.position = "relative";
    // Trigger button
    const button = document.createElement("button");
    button.style.padding = "8px";
    button.style.backgroundColor = "#ffffff";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.addEventListener("mouseover", () => { button.style.backgroundColor = "#f0f0f0"; });
    button.addEventListener("mouseout", () => { button.style.backgroundColor = "#ffffff"; });
    const img = document.createElement("img");
    img.src = "https://titobahe.github.io/Z_do_Fullzapp.svg";
    img.alt = "Fullzapp";
    img.style.width = "20px";
    img.style.height = "20px";
    button.appendChild(img);
    // Dropdown
    const dropdown = document.createElement("div");
    dropdown.className = "fz-dropdown";
    // Content area inside dropdown
    const contentArea = document.createElement("div");
    dropdown.appendChild(contentArea);
    // Toggle dropdown
    button.addEventListener("click", (e) => {
        e.stopPropagation();
        if (dropdown.classList.contains("open")) {
            dropdown.classList.remove("open");
        }
        else {
            dropdown.classList.add("open");
            renderMenu();
        }
    });
    // Close on outside click
    document.addEventListener("click", () => {
        dropdown.classList.remove("open");
    });
    dropdown.addEventListener("click", (e) => { e.stopPropagation(); });
    container.appendChild(button);
    container.appendChild(dropdown);
    targetDiv.prepend(container);
    // ====== VIEWS ======
    let currentLang = "us";
    function renderMenu() {
        contentArea.innerHTML = "";
        const title = document.createElement("div");
        title.className = "fz-title";
        title.textContent = "Fullzapp Tools";
        contentArea.appendChild(title);
        const items = [
            { id: "audio", emoji: "🎙️", label: "Record Audio", desc: "Record and send a voice message" },
            { id: "features", emoji: "📬", label: "Message Templates", desc: "Copy message templates to clipboard" },
        ];
        items.forEach(item => {
            const card = document.createElement("div");
            card.className = "fz-card";
            card.innerHTML = `<div class="fz-card-icon">${item.emoji}</div><div style="flex:1"><div class="fz-card-label">${item.label}</div><div class="fz-card-desc">${item.desc}</div></div>`;
            card.addEventListener("click", () => {
                if (item.id === "features")
                    renderFeatures();
                else if (item.id === "audio")
                    renderAudio();
            });
            contentArea.appendChild(card);
        });
    }
    function renderFeatures() {
        contentArea.innerHTML = "";
        const header = document.createElement("div");
        header.className = "fz-header";
        const back = document.createElement("button");
        back.className = "fz-back";
        back.innerHTML = "&larr;";
        back.addEventListener("click", renderMenu);
        const toggle = document.createElement("div");
        toggle.className = "fz-lang-toggle";
        langs.forEach(l => {
            const btn = document.createElement("button");
            btn.className = `fz-lang-btn${l.code === currentLang ? " active" : ""}`;
            btn.textContent = l.flag;
            btn.addEventListener("click", () => { currentLang = l.code; renderFeatures(); });
            toggle.appendChild(btn);
        });
        const titleEl = document.createElement("span");
        titleEl.className = "fz-title";
        titleEl.style.marginBottom = "0";
        titleEl.textContent = uiStrings[currentLang].title;
        header.append(back, toggle, titleEl);
        contentArea.appendChild(header);
        const desc = document.createElement("div");
        desc.className = "fz-desc";
        desc.textContent = uiStrings[currentLang].desc;
        contentArea.appendChild(desc);
        const badge = document.createElement("span");
        badge.className = "fz-badge";
        badge.textContent = uiStrings[currentLang].badge;
        contentArea.appendChild(badge);
        const scroll = document.createElement("div");
        scroll.className = "fz-scroll";
        featureKeys.forEach(f => {
            const meta = featuresMeta[currentLang][f.key];
            const card = document.createElement("div");
            card.className = "fz-card";
            card.innerHTML = `<div class="fz-card-icon">${f.emoji}</div><div style="flex:1"><div class="fz-card-label">${meta.label}</div><div class="fz-card-desc">${meta.desc}</div></div><span class="fz-card-hint">copy</span>`;
            card.addEventListener("click", async () => {
                await navigator.clipboard.writeText(allFeatures[currentLang][f.key].trim());
                badge.className = "fz-badge success";
                badge.textContent = `✓ ${uiStrings[currentLang].copied}`;
                setTimeout(() => { dropdown.classList.remove("open"); }, 500);
            });
            scroll.appendChild(card);
        });
        contentArea.appendChild(scroll);
    }
    function renderAudio() {
        contentArea.innerHTML = "";
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
        draw();
        function draw() {
            contentArea.innerHTML = "";
            const back = document.createElement("button");
            back.className = "fz-back";
            back.innerHTML = "&larr;";
            back.addEventListener("click", () => {
                if (timerInterval)
                    clearInterval(timerInterval);
                if (audioUrl)
                    URL.revokeObjectURL(audioUrl);
                renderMenu();
            });
            contentArea.appendChild(back);
            if (state === "idle") {
                const center = document.createElement("div");
                center.className = "fz-audio-center";
                const micBtn = document.createElement("button");
                micBtn.className = "fz-mic-btn";
                micBtn.textContent = "🎙️";
                micBtn.addEventListener("click", startRec);
                const hint = document.createElement("div");
                hint.style.cssText = "font-size:12px;color:#6b7280";
                hint.textContent = "Tap to start recording";
                center.append(micBtn, hint);
                contentArea.appendChild(center);
            }
            if (state === "recording") {
                const center = document.createElement("div");
                center.className = "fz-audio-center";
                const wrap = document.createElement("div");
                wrap.className = "fz-rec-wrap";
                const ping = document.createElement("div");
                ping.className = "fz-rec-ping";
                const recBtn = document.createElement("button");
                recBtn.className = "fz-rec-btn";
                const sq = document.createElement("div");
                sq.className = "fz-rec-stop";
                recBtn.appendChild(sq);
                recBtn.addEventListener("click", stopRec);
                wrap.append(ping, recBtn);
                const timer = document.createElement("div");
                timer.className = "fz-rec-timer";
                timer.id = "fz-rec-timer";
                timer.textContent = fzFormatTime(elapsed);
                const label = document.createElement("div");
                label.className = "fz-rec-label";
                label.innerHTML = `<span class="fz-rec-dot"></span> Recording...`;
                center.append(wrap, timer, label);
                contentArea.appendChild(center);
            }
            if (state === "recorded" && audioUrl) {
                audioEl = document.createElement("audio");
                audioEl.src = audioUrl;
                audioEl.ontimeupdate = () => {
                    if (audioEl) {
                        playbackTime = Math.floor(audioEl.currentTime);
                        updateProgress();
                    }
                };
                audioEl.onended = () => { isPlaying = false; playbackTime = 0; updateProgress(); updatePlayBtn(); };
                contentArea.appendChild(audioEl);
                const pb = document.createElement("div");
                pb.className = "fz-playback";
                const playBtn = document.createElement("button");
                playBtn.className = "fz-play-btn";
                playBtn.id = "fz-play-btn";
                playBtn.textContent = "▶";
                playBtn.addEventListener("click", togglePlay);
                const pw = document.createElement("div");
                pw.style.flex = "1";
                pw.innerHTML = `<div class="fz-progress-bar"><div class="fz-progress-fill" id="fz-progress-fill" style="width:0%"></div></div><div class="fz-progress-times"><span id="fz-cur-time">${fzFormatTime(0)}</span><span>${fzFormatTime(elapsed)}</span></div>`;
                pb.append(playBtn, pw);
                contentArea.appendChild(pb);
                const errorEl = document.createElement("span");
                errorEl.className = "fz-badge error";
                errorEl.id = "fz-audio-error";
                errorEl.style.display = "none";
                contentArea.appendChild(errorEl);
                const actions = document.createElement("div");
                actions.className = "fz-actions";
                const discardBtn = document.createElement("button");
                discardBtn.className = "fz-btn fz-btn-discard";
                discardBtn.textContent = "Discard";
                discardBtn.addEventListener("click", () => {
                    if (audioUrl)
                        URL.revokeObjectURL(audioUrl);
                    state = "idle";
                    elapsed = 0;
                    audioBlob = null;
                    audioUrl = null;
                    isPlaying = false;
                    playbackTime = 0;
                    draw();
                });
                const sendBtn = document.createElement("button");
                sendBtn.className = "fz-btn fz-btn-send";
                sendBtn.textContent = "Send";
                sendBtn.addEventListener("click", handleSend);
                actions.append(discardBtn, sendBtn);
                contentArea.appendChild(actions);
            }
        }
        function updateProgress() {
            const fill = document.getElementById("fz-progress-fill");
            const cur = document.getElementById("fz-cur-time");
            if (fill)
                fill.style.width = elapsed > 0 ? `${(playbackTime / elapsed) * 100}%` : "0%";
            if (cur)
                cur.textContent = fzFormatTime(playbackTime);
        }
        function updatePlayBtn() {
            const btn = document.getElementById("fz-play-btn");
            if (btn)
                btn.textContent = isPlaying ? "⏸" : "▶";
        }
        function togglePlay() {
            if (!audioEl)
                return;
            if (isPlaying)
                audioEl.pause();
            else
                audioEl.play();
            isPlaying = !isPlaying;
            updatePlayBtn();
        }
        async function startRec() {
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
                    draw();
                };
                recorder.start();
                state = "recording";
                elapsed = 0;
                draw();
                timerInterval = setInterval(() => {
                    elapsed++;
                    const t = document.getElementById("fz-rec-timer");
                    if (t)
                        t.textContent = fzFormatTime(elapsed);
                }, 1000);
            }
            catch {
                alert("Microphone access denied");
            }
        }
        function stopRec() {
            if (timerInterval)
                clearInterval(timerInterval);
            mediaRecorder?.stop();
        }
        async function handleSend() {
            const errEl = document.getElementById("fz-audio-error");
            const ids = captureGHLIds();
            if (!ids.ok) {
                if (errEl) {
                    errEl.textContent = `Missing: ${ids.missing.join(", ")}`;
                    errEl.style.display = "inline-block";
                }
                return;
            }
            if (!audioBlob) {
                if (errEl) {
                    errEl.textContent = "No audio recorded";
                    errEl.style.display = "inline-block";
                }
                return;
            }
            const formData = new FormData();
            formData.append("audio", audioBlob, "audio.webm");
            formData.append("locationId", ids.locationId);
            formData.append("contactId", ids.contactId);
            try {
                const res = await fetch("https://outbound.fullzapp.com/webhook/ghl/v1/external-audio", { method: "POST", body: formData });
                if (!res.ok) {
                    if (errEl) {
                        errEl.textContent = `Send failed: ${res.status}`;
                        errEl.style.display = "inline-block";
                    }
                    return;
                }
                console.log("Audio sent successfully ✅");
                if (audioUrl)
                    URL.revokeObjectURL(audioUrl);
                dropdown.classList.remove("open");
            }
            catch (err) {
                if (errEl) {
                    errEl.textContent = "Network error";
                    errEl.style.display = "inline-block";
                }
                console.error("Network error:", err);
            }
        }
    }
}
// ====== INIT ======
injectWidgetStyles();
const fzWidgetObserver = new MutationObserver(initFullzappWidget);
fzWidgetObserver.observe(document.body, { childList: true, subtree: true });
document.addEventListener("DOMContentLoaded", initFullzappWidget);
initFullzappWidget();
