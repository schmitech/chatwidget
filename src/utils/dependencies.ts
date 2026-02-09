import { getWidgetUrls, isDebugEnabled } from './widget-config';

interface LoadDependencyResult {
  success: boolean;
  url?: string;
  error?: string;
}

// Track loaded scripts and stylesheets to prevent duplicates
const loadedScripts = new Set<string>();
const loadedStylesheets = new Set<string>();

const debugLog = (...args: unknown[]) => {
  if (isDebugEnabled()) {
    console.log(
      '%c🔧 Widget Loader:', 
      'background: #2563eb; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;',
      ...args
    );
  }
};

const debugError = (...args: unknown[]) => {
  console.error(
    '%c❌ Widget Loader Error:', 
    'background: #dc2626; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;',
    ...args
  );
};

// Enhanced script loader to avoid duplicate loads
async function loadScript(src: string): Promise<LoadDependencyResult> {
  // Prevent duplicate loading
  if (loadedScripts.has(src)) {
    debugLog(`Script already loaded: ${src}`);
    return { success: true, url: src };
  }
  return loadSingleScript(src);
}

async function loadSingleScript(src: string): Promise<LoadDependencyResult> {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.crossOrigin = 'anonymous';

    script.onload = () => {
      debugLog(`✅ Script loaded successfully: ${src}`);
      loadedScripts.add(src);
      resolve({ success: true, url: src });
    };

    script.onerror = () => {
      debugError(`❌ Failed to load script: ${src}`);
      resolve({ 
        success: false, 
        error: `Failed to load script: ${src}` 
      });
    };

    document.head.appendChild(script);
  });
}

// Enhanced CSS loader to avoid duplicate loads
async function loadStylesheet(href: string): Promise<LoadDependencyResult> {
  // Prevent duplicate loading
  if (loadedStylesheets.has(href)) {
    debugLog(`Stylesheet already loaded: ${href}`);
    return { success: true, url: href };
  }
  return loadSingleStylesheet(href);
}

async function loadSingleStylesheet(href: string): Promise<LoadDependencyResult> {
  return new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;

    link.onload = () => {
      debugLog(`✅ Stylesheet loaded successfully: ${href}`);
      loadedStylesheets.add(href);
      resolve({ success: true, url: href });
    };

    link.onerror = () => {
      debugError(`❌ Failed to load stylesheet: ${href}`);
      resolve({ 
        success: false, 
        error: `Failed to load stylesheet: ${href}` 
      });
    };

    document.head.appendChild(link);
  });
}

const REACT_UMD_URL = 'https://unpkg.com/react@19/umd/react.production.min.js';
const REACT_DOM_UMD_URL = 'https://unpkg.com/react-dom@19/umd/react-dom.production.min.js';

// Check if React is available (like demo.html does)
function checkReactAvailability(): boolean {
  const hasReact = typeof window.React !== 'undefined';
  const hasReactDOM = typeof window.ReactDOM !== 'undefined';
  
  debugLog(`React availability check:`, {
    React: hasReact,
    ReactDOM: hasReactDOM
  });
  
  return hasReact && hasReactDOM;
}

async function ensureReactGlobals(): Promise<void> {
  if (checkReactAvailability()) {
    return;
  }

  debugLog('⚛️ Loading React 19 UMD globals for widget...');
  const reactResult = await loadScript(REACT_UMD_URL);
  if (!reactResult.success) {
    throw new Error(reactResult.error || 'Failed to load React 19 UMD bundle');
  }

  const domResult = await loadScript(REACT_DOM_UMD_URL);
  if (!domResult.success) {
    throw new Error(domResult.error || 'Failed to load ReactDOM 19 UMD bundle');
  }

  debugLog('✅ React 19 globals loaded');
}

// Main dependency loader function (matches demo.html approach)
export async function loadWidgetDependencies(): Promise<{ success: boolean; errors: string[] }> {
  const urls = getWidgetUrls();
  const errors: string[] = [];
  
  debugLog('🚀 Starting widget dependency loading...');
  debugLog('📊 Widget Configuration:', {
    jsUrl: urls.jsUrl,
    cssUrl: urls.cssUrl,
    debugEnabled: isDebugEnabled()
  });

  try {
    await ensureReactGlobals();
  } catch (reactError) {
    const message = reactError instanceof Error ? reactError.message : String(reactError);
    debugError(message);
    errors.push(message);
    return { success: false, errors };
  }

  debugLog('✅ React and ReactDOM are available');

  try {
    // Step 2: Load CSS first (like demo.html does)
    debugLog(`🎨 Loading CSS from: ${urls.cssUrl}`);
    const cssResult = await loadStylesheet(urls.cssUrl);
    if (!cssResult.success) {
      errors.push(cssResult.error || 'Failed to load CSS');
    }

    // Step 3: Load JavaScript (like demo.html does)
    debugLog(`📦 Loading JavaScript from: ${urls.jsUrl}`);
    const jsResult = await loadScript(urls.jsUrl);
    if (!jsResult.success) {
      errors.push(jsResult.error || 'Failed to load JavaScript');
    }

    // Step 4: Verify widget is available (like demo.html checks)
    const hasWidget = typeof window.initChatbotWidget === 'function';
    const hasChatbotWidget = typeof window.ChatbotWidget === 'object';
    
    debugLog('🔍 Widget availability check:', {
      initChatbotWidget: hasWidget,
      ChatbotWidget: hasChatbotWidget
    });

    if (!hasWidget) {
      const widgetError = 'initChatbotWidget function not found after loading';
      debugError(widgetError);
      errors.push(widgetError);
    }

    const success = errors.length === 0;
    
    if (success) {
      debugLog('🎉 All dependencies loaded successfully!');
      debugLog('📋 Ready to initialize widget with initChatbotWidget()');
    } else {
      debugError('❌ Failed to load some dependencies:', errors);
      debugLog('💡 Troubleshooting tips:');
      debugLog('  1. Check browser Network tab for 404 errors');
      debugLog('  2. Verify the @schmitech/chatbot-widget package is installed and accessible (unpkg.com reachable)');
      debugLog('  3. Try hard refresh: Ctrl+Shift+R / Cmd+Shift+R');
    }

    return { success, errors };

  } catch (error) {
    const errorMsg = `Unexpected error loading dependencies: ${error}`;
    debugError(errorMsg);
    errors.push(errorMsg);
    return { success: false, errors };
  }
}

// Export for debugging
export const getDependencyStatus = () => ({
  loadedScripts: Array.from(loadedScripts),
  loadedStylesheets: Array.from(loadedStylesheets),
  config: getWidgetUrls()
});

// Load Prism.js for syntax highlighting in code tab
export async function loadPrism(): Promise<void> {
  // Check if Prism is already loaded
  if (typeof window.Prism !== 'undefined') {
    debugLog('✅ Prism.js already loaded');
    return;
  }

  debugLog('📦 Loading Prism.js for syntax highlighting...');

  try {
    // Load Prism CSS
    await loadSingleStylesheet('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css');
    
    // Load Prism JS
    await loadSingleScript('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js');
    
    // Load additional language support
    await loadSingleScript('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js');
    await loadSingleScript('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-typescript.min.js');
    await loadSingleScript('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-jsx.min.js');
    
    debugLog('✅ Prism.js loaded successfully');
  } catch (error) {
    debugError('❌ Failed to load Prism.js:', error);
    throw error;
  }
}
