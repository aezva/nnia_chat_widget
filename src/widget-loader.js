(function() {
    // Cargar React y ReactDOM
    const loadScript = (src) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.crossOrigin = 'anonymous';
            script.onload = () => {
                // Dar tiempo para que el script se inicialice completamente
                setTimeout(resolve, 100);
            };
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
            console.log('Iniciando carga del widget NNIA...');
            
            // Cargar React y ReactDOM
            await loadScript('https://unpkg.com/react@18/umd/react.production.min.js');
            console.log('React cargado correctamente');
            
            await loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js');
            console.log('ReactDOM cargado correctamente');
            
            // Cargar Axios
            await loadScript('https://unpkg.com/axios/dist/axios.min.js');
            console.log('Axios cargado correctamente');
            
            // Cargar CSS del widget
            await loadCSS('https://widget.iamnnia.com/nia-style.css');
            console.log('Estilos cargados correctamente');
            
            // Cargar el widget
            await loadScript('https://widget.iamnnia.com/nia-chat.js');
            console.log('Widget cargado correctamente');
            
            // Esperar un momento para asegurar que todo esté inicializado
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Inicializar el widget con configuración por defecto
            if (typeof window.NNIA !== 'undefined' && typeof window.NNIA.initWidget === 'function') {
                console.log('Inicializando widget...');
                window.NNIA.initWidget({
                    apiUrl: 'https://api.iamnnia.com/api/v1',
                    clientID: clientID,
                    platform: 'client-website'
                });
                console.log('Widget inicializado correctamente');
            } else {
                throw new Error('El objeto NNIA no está disponible o no tiene el método initWidget');
            }
        } catch (error) {
            console.error('Error al cargar el widget NNIA:', error.message || error);
            throw error;
        }
    };

    // Exponer la función de inicialización globalmente
    window.initNNIA = initNNIA;
})(); 