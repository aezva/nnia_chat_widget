(function() {
    const WIDGET_VERSION = '1.0.0';
    const CDN_BASE_URL = 'https://widget.iamnnia.com';
    const API_BASE_URL = 'https://api.iamnnia.com/api/v1';

    // Configuración por defecto
    const defaultConfig = {
        apiUrl: API_BASE_URL,
        platform: 'client-website',
        theme: 'light',
        position: 'bottom-right'
    };

    // Cargar script de forma segura
    const loadScript = (src, attributes = {}) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.crossOrigin = 'anonymous';
            
            // Agregar atributos adicionales
            Object.entries(attributes).forEach(([key, value]) => {
                script.setAttribute(key, value);
            });

            script.onload = () => setTimeout(resolve, 100);
            script.onerror = (error) => reject(new Error(`Error al cargar script ${src}: ${error.message}`));
            document.head.appendChild(script);
        });
    };

    // Cargar CSS de forma segura
    const loadCSS = (href) => {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.crossOrigin = 'anonymous';
            link.onload = resolve;
            link.onerror = (error) => reject(new Error(`Error al cargar CSS ${href}: ${error.message}`));
            document.head.appendChild(link);
        });
    };

    // Verificar si el widget ya está cargado
    const isWidgetLoaded = () => {
        return document.getElementById('nia-widget-container') !== null;
    };

    // Función principal de inicialización
    const initNNIA = async (config = {}) => {
        try {
            if (isWidgetLoaded()) {
                console.warn('El widget NNIA ya está cargado');
                return;
            }

            console.log(`Iniciando carga del widget NNIA v${WIDGET_VERSION}...`);
            
            // Combinar configuración por defecto con la proporcionada
            const finalConfig = { ...defaultConfig, ...config };
            
            // Cargar dependencias
            await Promise.all([
                loadScript('https://unpkg.com/react@18/umd/react.production.min.js', { 'data-version': '18' }),
                loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', { 'data-version': '18' }),
                loadScript('https://unpkg.com/axios/dist/axios.min.js', { 'data-version': '1.6.2' })
            ]);
            
            // Cargar recursos del widget
            await Promise.all([
                loadCSS(`${CDN_BASE_URL}/nia-style.css`),
                loadScript(`${CDN_BASE_URL}/nia-chat.js`)
            ]);
            
            // Esperar a que todo esté inicializado
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Inicializar el widget
            if (typeof window.NNIA?.initWidget === 'function') {
                window.NNIA.initWidget(finalConfig);
                console.log('Widget NNIA inicializado correctamente');
            } else {
                throw new Error('El objeto NNIA no está disponible o no tiene el método initWidget');
            }
        } catch (error) {
            console.error('Error al cargar el widget NNIA:', error.message);
            // Implementar sistema de reintentos o fallback aquí si es necesario
            throw error;
        }
    };

    // Exponer la función de inicialización globalmente
    window.initNNIA = initNNIA;
})(); 