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
var intersectionObserver = null;
console.log('[Fullzapp ReplyButton] 🟢 Script carregado e injetado. V2.5');
var Messageoption;
(function (Messageoption) {
    Messageoption["REPLY"] = "reply";
    Messageoption["DELETE"] = "delete";
    Messageoption["EDIT"] = "edit";
})(Messageoption || (Messageoption = {}));
var MessageType;
(function (MessageType) {
    MessageType["TEXT"] = "text";
    MessageType["TEXT_ATTACHMENT"] = "text_attachment";
    MessageType["DELETE"] = "delete";
    MessageType["DELETE_ATTACHMENT"] = "delete_attachment";
    MessageType["EDIT"] = "edit";
    MessageType["EDIT_ATTACHMENT"] = "edit_attachment";
})(MessageType || (MessageType = {}));
//texto
//-------- Mensagem à responder ----------
//[msg original....]
//------------------------
//@Responder🗣️: [${messageId}]
function getMessageContent(messageId, messageOption, tiptapEditor) {
    var msgItem = document.querySelector("[data-message-id=\"".concat(messageId, "\"]"));
    if (!msgItem)
        return null;
    var chatItem = msgItem.querySelector('.chat-message');
    if (!chatItem)
        return null;
    // Texto da mensagem (última linha não vazia costuma ser o corpo)
    var messageText = chatItem.innerText.trim();
    // Mídias
    var hasImage = !!chatItem.querySelector('img');
    var hasVideo = !!chatItem.querySelector('video');
    var hasAudio = !!chatItem.querySelector('.audio-player');
    var hasAttachment = !!chatItem.querySelector('.attachments-item');
    var messageType = MessageType.TEXT;
    if (hasImage || hasVideo || hasAudio || hasAttachment) {
        switch (messageOption) {
            case Messageoption.REPLY:
                messageType = MessageType.TEXT_ATTACHMENT;
                break;
            case Messageoption.DELETE:
                messageType = MessageType.DELETE_ATTACHMENT;
                break;
            case Messageoption.EDIT:
                messageType = MessageType.EDIT_ATTACHMENT;
                break;
        }
    }
    else {
        switch (messageOption) {
            case Messageoption.REPLY:
                messageType = MessageType.TEXT;
                break;
            case Messageoption.DELETE:
                messageType = MessageType.DELETE;
                break;
            case Messageoption.EDIT:
                messageType = MessageType.EDIT;
                break;
        }
    }
    switch (messageType) {
        case MessageType.TEXT:
            return tiptapEditor.value + "\n---------------------------------\n" + "".concat(messageText) + "\n---------------------------------\n" + "@Responder\uD83D\uDDE3\uFE0F: [".concat(messageId, "]");
        case MessageType.TEXT_ATTACHMENT:
            return tiptapEditor.value + "\n---------------------------------\n" + "Mensagem original: Arquivo de anexo..." + "\n---------------------------------\n" + "@Responder\uD83D\uDDE3\uFE0F: [".concat(messageId, "]");
        case MessageType.DELETE:
            return "@Deletar\uD83D\uDDD1\uFE0F: [".concat(messageId, "]") + "\n---------------------------------\n" + "".concat(messageText);
        case MessageType.DELETE_ATTACHMENT:
            return "@Deletar\uD83D\uDDD1\uFE0F: [".concat(messageId, "]") + "Mensagem original: Arquivo de anexo...";
        case MessageType.EDIT:
            return messageText + "\n---------------------------------\n" + "@Editar\uD83D\uDDE3\uFE0F: [".concat(messageId, "]");
        case MessageType.EDIT_ATTACHMENT:
            return messageText + "\n---------------------------------\n" + "@Editar\uD83D\uDDE3\uFE0F: [".concat(messageId, "]");
    }
}
function writeTextInTextarea(messageId, type) {
    return __awaiter(this, void 0, void 0, function () {
        var mainPanel, composerInput, tiptapEditor, textoInserir, inputEvent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[Fullzapp ".concat(type, "Button] \u270F\uFE0F Inserindo texto para ID: ").concat(messageId));
                    mainPanel = document.querySelector('#conversations-central-panel-viewer');
                    if (!mainPanel) {
                        console.warn("[Fullzapp ".concat(type, "Button] \u26A0\uFE0F Painel principal n\u00E3o encontrado."));
                        return [2 /*return*/];
                    }
                    composerInput = mainPanel.querySelector('input[id^="composer-input-"]');
                    tiptapEditor = document.querySelector('textarea.mt-1.rounded-md.w-full.border-none.flex.items-center.justify-center.text-md.resize-none.outline-none.overflow-y-auto');
                    if (!(!tiptapEditor && composerInput)) return [3 /*break*/, 2];
                    console.log("[Fullzapp ".concat(type, "Button] \uD83D\uDDB1\uFE0F Clicando no composer input para abrir editor..."));
                    composerInput.click();
                    // Espera o textarea aparecer (até 1 segundo)
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var checkInterval = setInterval(function () {
                                tiptapEditor = document.querySelector('textarea.mt-1.rounded-md.w-full.border-none.flex.items-center.justify-center.text-md.resize-none.outline-none.overflow-y-auto');
                                if (tiptapEditor) {
                                    clearInterval(checkInterval);
                                    resolve(true);
                                }
                            }, 100);
                            setTimeout(function () {
                                clearInterval(checkInterval);
                                resolve(false);
                            }, 1000);
                        })];
                case 1:
                    // Espera o textarea aparecer (até 1 segundo)
                    _a.sent();
                    _a.label = 2;
                case 2:
                    // 🧩 4️⃣ Verifica se o textarea foi encontrado após o clique
                    if (!tiptapEditor) {
                        console.warn('[Fullzapp ReplyButton] ⚠️ Nenhum campo de texto disponível (nem textarea, nem input funcional).');
                        return [2 /*return*/];
                    }
                    console.log('[Fullzapp ReplyButton] 🧠 Campo de texto final detectado, inserindo mensagem...');
                    // 🔥 Clica e foca no textarea para ativar
                    tiptapEditor.click();
                    tiptapEditor.focus();
                    textoInserir = null;
                    switch (type) {
                        case 'reply':
                            textoInserir = getMessageContent(messageId, Messageoption.REPLY, tiptapEditor);
                            break;
                        case 'delete':
                            textoInserir = getMessageContent(messageId, Messageoption.DELETE, tiptapEditor);
                            break;
                        case 'edit':
                            textoInserir = getMessageContent(messageId, Messageoption.EDIT, tiptapEditor);
                            break;
                    }
                    if (!textoInserir) {
                        console.error("[Fullzapp ReplyButton] \u274C Texto n\u00E3o encontrado para o ID: ".concat(messageId));
                        return [2 /*return*/];
                    }
                    tiptapEditor.value = textoInserir;
                    inputEvent = new InputEvent('input', { bubbles: true, cancelable: true });
                    tiptapEditor.dispatchEvent(inputEvent);
                    console.log('[Fullzapp ReplyButton] ✅ Texto inserido com sucesso.');
                    return [2 /*return*/];
            }
        });
    });
}
function createDeleteMessageButton(el, messageId) {
    if (el.nextSibling && el.nextSibling.id === "deleteMessageButton-fullzapp-".concat(messageId)) {
        console.log("[Fullzapp DeleteMessageButton] \u23ED\uFE0F Bot\u00E3o j\u00E1 existe para ".concat(messageId, ", ignorando."));
        return;
    }
    console.log("[Fullzapp DeleteMessageButton] \uD83E\uDDE9 Criando bot\u00E3o de delete message para ID: ".concat(messageId));
    var newBtn = document.createElement('button');
    newBtn.id = "deleteMessageButton-fullzapp-".concat(messageId);
    newBtn.title = 'Deletar Mensagem';
    newBtn.dataset.messageId = messageId;
    Object.assign(newBtn.style, {
        width: '20px',
        height: '10px',
        border: 'none',
        background: 'transparent',
        padding: '0',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    });
    newBtn.addEventListener('click', function (e) {
        var btn = e.currentTarget;
        var messageId = btn.dataset.messageId;
        console.log("[Fullzapp DeleteMessageButton] \uD83D\uDDB1\uFE0F Clique detectado no bot\u00E3o (".concat(messageId, ")"));
        e.stopPropagation();
        if (messageId)
            writeTextInTextarea(messageId, 'delete');
    });
    var img = document.createElement('img');
    img.src = 'https://titobahe.github.io/delete-2-svgrepo-com.svg';
    img.alt = 'Delete';
    Object.assign(img.style, {
        width: '120%',
        height: '120%',
        objectFit: 'contain',
        display: 'block',
    });
    newBtn.appendChild(img);
    // el.insertAdjacentElement('afterend', newBtn);
    console.log("[Fullzapp DeleteMessageButton] \u2705 Bot\u00E3o criado e adicionado ao DOM (".concat(messageId, ")"));
    return newBtn;
}
function createReplyButton(el, messageId) {
    if (el.nextSibling && el.nextSibling.id === "replyButton-fullzapp-".concat(messageId)) {
        console.log("[Fullzapp ReplyButton] \u23ED\uFE0F Bot\u00E3o j\u00E1 existe para ".concat(messageId, ", ignorando."));
        return;
    }
    console.log("[Fullzapp ReplyButton] \uD83E\uDDE9 Criando bot\u00E3o de reply para ID: ".concat(messageId));
    var newBtn = document.createElement('button');
    newBtn.id = "replyButton-fullzapp-".concat(messageId);
    newBtn.title = 'Responder';
    newBtn.dataset.messageId = messageId;
    Object.assign(newBtn.style, {
        width: '20px',
        height: '10px',
        border: 'none',
        background: 'transparent',
        padding: '0',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    });
    newBtn.addEventListener('click', function (e) {
        var btn = e.currentTarget;
        var messageId = btn.dataset.messageId;
        console.log("[Fullzapp ReplyButton] \uD83D\uDDB1\uFE0F Clique detectado no bot\u00E3o (".concat(messageId, ")"));
        e.stopPropagation();
        if (messageId)
            writeTextInTextarea(messageId, 'reply');
    });
    var img = document.createElement('img');
    img.src = 'https://titobahe.github.io/reply-svgrepo-com.svg';
    img.alt = 'Reply';
    Object.assign(img.style, {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block',
    });
    newBtn.appendChild(img);
    // el.insertAdjacentElement('afterend', newBtn);
    console.log("[Fullzapp ReplyButton] \u2705 Bot\u00E3o criado e adicionado ao DOM (".concat(messageId, ")"));
    return newBtn;
}
function createButtonsContainer(el, messageId) {
    if (el.nextSibling && el.nextSibling.id === "buttonsContainer-fullzapp-".concat(messageId)) {
        console.log("[Fullzapp ReplyButton] \u23ED\uFE0F Container j\u00E1 existe para ".concat(messageId, ", ignorando."));
        return;
    }
    console.log("[Fullzapp ReplyButton] \uD83E\uDDE9 Criando container para ID: ".concat(messageId));
    var newContainer = document.createElement('div');
    newContainer.id = "buttonsContainer-fullzapp-".concat(messageId);
    newContainer.style.display = 'flex';
    newContainer.style.alignItems = 'center';
    newContainer.style.justifyContent = 'center';
    newContainer.style.marginLeft = '2px';
    newContainer.style.gap = '2px';
    newContainer.appendChild(createReplyButton(el, messageId));
    newContainer.appendChild(createDeleteMessageButton(el, messageId));
    el.insertAdjacentElement('afterend', newContainer);
    console.log("[Fullzapp ReplyButton] \u2705 Container criado e adicionado ao DOM (".concat(messageId, ")"));
}
function replyButton() {
    // 🔥 Verifica se o painel já existe
    var panel = document.querySelector('#conversation-panel');
    if (!panel) {
        console.warn('[Fullzapp ReplyButton] ❌ Painel de conversa não encontrado. Tentando novamente em 500ms...');
        setTimeout(replyButton, 500); // tenta novamente
        return;
    }
    console.log('[Fullzapp ReplyButton] 🚀 Executando função replyButton()');
    var elements = panel.querySelectorAll('[id^="message-menu-btn-"]');
    console.log("[Fullzapp ReplyButton] \uD83D\uDD0D Encontrados ".concat(elements.length, " elementos no painel."));
    if (!elements.length)
        return;
    if (intersectionObserver) {
        console.log('[Fullzapp ReplyButton] 🔄 Desconectando IntersectionObserver anterior...');
        intersectionObserver.disconnect();
    }
    console.log('[Fullzapp ReplyButton] 🧠 Criando novo IntersectionObserver...');
    intersectionObserver = new IntersectionObserver(function (entries) {
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
            var entry = entries_1[_i];
            if (entry.isIntersecting) {
                var el = entry.target;
                var parts = el.id.split('-');
                var messageId = parts[parts.length - 1] || '';
                console.log("[Fullzapp ReplyButton] \uD83D\uDC40 Elemento vis\u00EDvel: ".concat(messageId));
                createButtonsContainer(el, messageId);
                intersectionObserver === null || intersectionObserver === void 0 ? void 0 : intersectionObserver.unobserve(el);
            }
        }
    }, { root: panel, threshold: 0.1 });
    elements.forEach(function (el) {
        console.log("[Fullzapp ReplyButton] \uD83D\uDC41\uFE0F Observando elemento: ".concat(el.id));
        intersectionObserver.observe(el);
    });
    console.log('[Fullzapp ReplyButton] 🟢 Observação iniciada com sucesso.');
}
// ✅ Observa o DOM inteiro até o painel existir
var observer_replyButton = new MutationObserver(replyButton);
observer_replyButton.observe(document.body, { childList: true, subtree: true });
// ✅ Executa assim que o DOM terminar de carregar
document.addEventListener('DOMContentLoaded', replyButton);
