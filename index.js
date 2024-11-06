document.addEventListener('DOMContentLoaded', function() {
    function createAlertBar({ title, description, type = 'info', message }) {
        const alert = document.createElement('div');
        alert.className = `mb-4 shadow-lg bg-blue-500 bg-opacity-50 p-4 rounded-lg alert-${type}`;
        
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'flex items-center justify-between';
        alert.appendChild(contentWrapper);
        
        const textWrapper = document.createElement('div');
        textWrapper.className = 'flex items-center space-x-4';
        contentWrapper.appendChild(textWrapper);
        
        const iconWrapper = document.createElement('div');
        iconWrapper.className = 'bg-blue-500 text-white p-2 rounded-full';
        const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgIcon.setAttribute("class", "h-5 w-5");
        svgIcon.setAttribute("viewBox", "0 0 20 20");
        svgIcon.setAttribute("fill", "currentColor");
        
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("fill-rule", "evenodd");
        path.setAttribute("d", "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z");
        path.setAttribute("clip-rule", "evenodd");
        
        svgIcon.appendChild(path);
        iconWrapper.appendChild(svgIcon);
        textWrapper.appendChild(iconWrapper);
        
        const textContainer = document.createElement('div');
        const alertTitle = document.createElement('div');
        alertTitle.className = 'font-bold text-white';
        alertTitle.textContent = title;
        
        const alertDescription = document.createElement('div');
        alertDescription.className = 'text-white';
        alertDescription.textContent = description;
        
        textContainer.appendChild(alertTitle);
        textContainer.appendChild(alertDescription);
        textWrapper.appendChild(textContainer);
        
        const centeredText = document.createElement('div');
        centeredText.className = 'text-white font-medium';
        centeredText.textContent = `${message}`;
        contentWrapper.appendChild(centeredText);
        
        const closeButton = document.createElement('button');
        closeButton.className = 'text-white hover:text-gray-300';
        closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6.707 4.293a1 1 0 00-1.414 1.414L8.586 10l-3.293 3.293a 1 1 0 101.414 1.414L10 11.414l3.293 3.293a 1 1 0 001.414-1.414L11.414 10l3.293-3.293a1 1 0 00-1.414-1.414L10 8.586 6.707 4.293z" clip-rule="evenodd"/></svg>`;
        
        closeButton.addEventListener('click', () => {
            alert.style.display = 'none';
        });
        
        contentWrapper.appendChild(closeButton);
        document.body.appendChild(alert);
        return alert;
    }

    function mostrarPopupNotificacao() {
        const scriptTag = document.querySelector('.vue-notification-group');
        const dashBoardBanner = document.getElementById('location-dashboard_container--banner');
        
        if (dashBoardBanner) {
            if (!scriptTag) return;
            const mensagem = scriptTag.getAttribute('mensagem') || 'Você tem uma nova notificação!';
            dashBoardBanner.appendChild(createAlertBar({ title: 'alert', description: 'alert', message: mensagem }));
        }
    }

    // Monitorar mudanças na seção do meio
    const targetNode = document.querySelector('#location-dashboard_container--banner'); // Seção dinâmica do meio
    const config = { childList: true, subtree: true };

    const observer = new MutationObserver((mutationsList, observer) => {
        mostrarPopupNotificacao(); // Chama a função quando ocorre uma mudança na seção
        observer.disconnect(); // Desconecta após o primeiro acionamento, remova esta linha se quiser monitorar continuamente
    });

    // Inicia o observador
    if (targetNode) {
        observer.observe(targetNode, config);
    } else {
        console.log("Elemento #location-dashboard_container--banner não encontrado.");
    }
});
