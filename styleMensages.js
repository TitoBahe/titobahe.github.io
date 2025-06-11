const style = document.createElement("style");
style.innerHTML = `

  .messages-single .cnv-message-bubble {
    background-color: #5df8843b !important;
    color: #020202cc;
  }

  .messages-single .cnv-message-bubble:before {
    border-color: transparent !important;
  }

  .messages-single.--own-message .message-bubble {
    background-color: #53d4df29 !important;
    color: #060606;
  }

  .messages-single.--own-message .message-bubble:after {
    border-color: transparent !important;
  }

  .type-icon.icon.icon-sms2.absolute-right {
    background-image: url('https://titobahe.github.io/msgIcon.png') !important;
    background-size: contain;
    background-repeat: no-repeat;
  }
    
  .type-icon.icon.icon-sms2.absolute-left {
    background-image: url('https://titobahe.github.io/msgIcon.png') !important;
    background-size: contain;
    background-repeat: no-repeat;
  }

    #sms-tab {
    color: transparent;             /* esconde o texto original */
    position: relative;
    }

    #sms-tab:after {
    content: "FullZapp";            /* novo texto */
    color: black;                   /* cor do texto novo */
    position: absolute;
    left: 0;
    top: 0;
    }

`;
document.head.appendChild(style);
