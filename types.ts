
export type Role = 'user' | 'assistant';

export interface Attachment {
  type: 'image' | 'document';
  url: string;
  base64: string;
  mimeType: string;
  name: string;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  attachments?: Attachment[];
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
