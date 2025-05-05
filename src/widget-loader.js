(function() {
    // Cargar React y ReactDOM
    const loadScript = (src) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.crossOrigin = 'anonymous';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };

    // Cargar CSS
    const loadCSS = (href) => {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    };

    // Función principal de inicialización
    const initNNIA = async (clientID) => {
        try {
            // Cargar React y ReactDOM
            await loadScript('https://unpkg.com/react@18/umd/react.production.min.js');
            await loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js');
            
            // Cargar CSS del widget
            await loadCSS('https://widget.iamnnia.com/nia-chat-widget.css');
            
            // Cargar el widget
            await loadScript('https://widget.iamnnia.com/nia-chat-widget.umd.js');
            
            // Inicializar el widget con configuración por defecto
            if (window.NNIA) {
                window.NNIA.initWidget({
                    apiUrl: 'https://api.iamnnia.com/api/v1',
                    clientID: clientID,
                    platform: 'client-website'
                });
            }
        } catch (error) {
            console.error('Error al cargar el widget NNIA:', error);
        }
    };

    // Exponer la función de inicialización globalmente
    window.initNNIA = initNNIA;
})(); 