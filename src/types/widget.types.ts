import type { ComponentType, SVGProps } from 'react';

export interface CustomColors {
    primary: string;
    secondary: string;
    questionsBackground: string;
    textPrimary: string;
    textSecondary: string;
    textInverse: string;
    inputBackground: string;
    inputBorder: string;
    userBubble: string;
    assistantBubble: string;
    userText: string;
    assistantText: string;
    suggestedText: string;
    highlightedBackground: string;
    chatButtonBg: string;
    chatButtonHover: string;
    iconColor: string;
    iconBorderColor: string;
    buttonBorderColor: string;
    iconName: string;
    [key: string]: string;
  }
  
  export interface WidgetConfig {
    header: {
      title: string;
    };
    welcome: {
      title: string;
      description: string;
    };
    suggestedQuestions: Array<{
      id: string;
      text: string;
      query: string;
    }>;
    maxSuggestedQuestionLength: number;
    maxSuggestedQuestionQueryLength: number;
    systemPrompt?: string;
    icon: string;
  }
  
export interface ThemeConfig {
    primary: string;
    secondary: string;
    background?: string;
    mode?: 'light' | 'dark' | 'system';
    questionsBackground: string;
    text: {
      primary: string;
      secondary: string;
      inverse: string;
    };
    input: {
      background: string;
      border: string;
    };
    message: {
      user: string;
      assistant: string;
      userText: string;
      assistantText: string;
    };
    suggestedQuestions: {
      text: string;
      questionsBackground: string;
      highlightedBackground: string;
    };
    chatButton: {
      background: string;
      hoverBackground: string;
      iconColor: string;
      iconBorderColor: string;
      borderColor: string;
      iconName: string;
    };
  }
  
  export interface Theme {
    name: string;
    colors: CustomColors;
  }
  
  export interface IconConfig {
    id: string;
    name: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
  }
  
  export interface ExpandedSections {
    mainColors: boolean;
    textColors: boolean;
    messageBubbles: boolean;
    chatButton: boolean;
    iconSelection: boolean;
  }
  
  export type TabType = 'theme' | 'content' | 'prompt' | 'code';
  
  export interface WidgetInitConfig {
    apiUrl: string;
    apiKey: string;
    containerSelector?: string;
    widgetConfig: Omit<WidgetConfig, 'systemPrompt'> & {
      theme: ThemeConfig;
    };
  }

  interface PrismGlobal {
    highlightAll: () => void;
    [key: string]: unknown;
  }

  export interface WidgetChatConstants {
    MAX_SUGGESTED_QUESTION_LENGTH?: number;
    MAX_SUGGESTED_QUESTION_QUERY_LENGTH?: number;
  }

  export type WidgetRuntimeConfig = WidgetInitConfig['widgetConfig'] & {
    CHAT_CONSTANTS?: WidgetChatConstants;
  };

  export interface ChatbotWidgetController {
    updateWidgetConfig: (config: WidgetInitConfig['widgetConfig']) => void;
    setApiUrl: (apiUrl: string) => void;
    setApiKey: (apiKey: string) => void;
    getCurrentConfig?: () => WidgetRuntimeConfig;
    destroy?: () => void;
  }
  
  // Global widget interface
  declare global {
    interface Window {
      React?: typeof import('react');
      ReactDOM?: typeof import('react-dom');
      Prism?: PrismGlobal;
      initChatbotWidget?: (config: WidgetInitConfig) => void;
      ChatbotWidget?: ChatbotWidgetController;
      REACT_APP_MAX_PROMPT_LENGTH?: number;
      CHATBOT_API_KEY?: string;
      CHATBOT_API_URL?: string;
    }
  }
