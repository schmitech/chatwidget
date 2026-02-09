// Widget source configuration
interface WidgetUrls {
  jsUrl: string;
  cssUrl: string;
}

interface WidgetConfig {
  debug: boolean;
  promptEnabled: boolean;
  defaultApiEndpoint: string;
  github: {
    owner: string;
    repo: string;
  };
  npm: {
    version: string;
    jsUrl: (version: string) => string;
    cssUrl: (version: string) => string;
  };
}

export const WIDGET_CONFIG: WidgetConfig = {
  // Debug logging - automatically disabled in production, can be overridden
  debug: import.meta.env.VITE_WIDGET_DEBUG === 'false' 
    ? false 
    : (import.meta.env.VITE_WIDGET_DEBUG === 'true' || import.meta.env.DEV),
  
  // Prompt tab enabled/disabled
  promptEnabled: import.meta.env.VITE_PROMPT_ENABLED !== 'false',
  
  // Default API endpoint
  defaultApiEndpoint: import.meta.env.VITE_DEFAULT_API_ENDPOINT || 'http://localhost:3000',
  
  // GitHub configuration
  github: {
    owner: import.meta.env.VITE_GITHUB_OWNER || 'schmitech',
    repo: import.meta.env.VITE_GITHUB_REPO || 'orbit'
  },
  
  // NPM configuration
  npm: {
    version: import.meta.env.VITE_NPM_WIDGET_VERSION || '0.7.1',
    jsUrl: (version: string) => `https://unpkg.com/@schmitech/chatbot-widget@${version}/dist/chatbot-widget.umd.js`,
    cssUrl: (version: string) => `https://unpkg.com/@schmitech/chatbot-widget@${version}/dist/chatbot-widget.css`
  }
};

// Helper function to get current widget URLs
export const getWidgetUrls = (): WidgetUrls => {
  const config = WIDGET_CONFIG;
  return {
    jsUrl: config.npm.jsUrl(config.npm.version),
    cssUrl: config.npm.cssUrl(config.npm.version)
  };
};

// Helper function to check if debug logging is enabled
export const isDebugEnabled = (): boolean => {
  return WIDGET_CONFIG.debug;
};
