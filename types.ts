
export type MessageRole = 'user' | 'assistant' | 'system';

export interface Reference {
  title: string;
  url?: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  references?: Reference[];
  timestamp: Date;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
}
