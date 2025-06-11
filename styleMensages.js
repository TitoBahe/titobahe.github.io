const style = document.createElement("style");
style.innerHTML = `

    .messages-single .cnv-message-bubble {
    background-color:#5df8843b !important;
    color: #020202cc;
    }

    .messages-single .cnv-message-bubble:before {
    border-color: transparent;
    }

    .messages-single.\--own-message .message-bubble {
    background-color: #53d4df4f !important;
    color: #060606;
    }

    .messages-single.\--own-message .message-bubble:before {
    border-color: transparent;
    }

    .icon .icon-sms2{
    background-image: url('https://titobahe.github.io/msgIcon.png') !important;
    background-size: contain;
    background-repeat: no-repeat;
    }

`;
document.head.appendChild(style);