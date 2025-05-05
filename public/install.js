(function() {
  // Configuración por defecto
  const defaultConfig = {
    apiUrl: 'https://api.nnia.com/v1',
    platform: 'client-website'
  };

  // Función para cargar el widget
  function loadWidget(config) {
    const script = document.createElement('script');
    script.src = 'https://widget.nnia.com/nnia-chat-widget.js';
    script.async = true;
    script.onload = function() {
      window.NNIA.initWidget({
        apiUrl: config.apiUrl,
        clientID: config.clientID,
        platform: config.platform
      });
    };
    document.head.appendChild(script);
  }

  // Obtener la configuración del cliente
  const config = {
    ...defaultConfig,
    clientID: document.currentScript.getAttribute('data-client-id'),
    platform: document.currentScript.getAttribute('data-platform') || defaultConfig.platform
  };

  // Cargar el widget
  loadWidget(config);
})(); 