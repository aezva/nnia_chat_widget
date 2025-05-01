interface Config {
    apiUrl: string;
    widgetId: string;
    theme: {
        primaryColor: string;
        secondaryColor: string;
        backgroundColor: string;
        textColor: string;
    };
    features: {
        fileUpload: boolean;
        voiceMessages: boolean;
        typingIndicator: boolean;
    };
}

const config: Config = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
    widgetId: process.env.NEXT_PUBLIC_WIDGET_ID || 'default-widget',
    theme: {
        primaryColor: '#4F46E5',
        secondaryColor: '#818CF8',
        backgroundColor: '#FFFFFF',
        textColor: '#1F2937',
    },
    features: {
        fileUpload: true,
        voiceMessages: true,
        typingIndicator: true,
    },
};

export default config; 