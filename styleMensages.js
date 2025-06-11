const style = document.createElement("style");
style.innerHTML = `

    .messages-single .cnv-message-bubble {
    background-color:#5df8843b !important;
    color: #020202cc;
    }

    .messages-single .cnv-message-bubble:before {
    border-color: transparent;
    }

`;
document.head.appendChild(style);