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
  
  .messages-single.--outbound a {
    color: #1d8cc3 !important;
    text-decoration: underline !important;
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

`;
document.head.appendChild(style);
