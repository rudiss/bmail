export interface EmailMessage {
  id: string;
  sender: string;
  senderEmail: string;
  content: string;
  timestamp: string;
  avatar: string;
  recipients?: string;
}

export interface Email {
  id: string;
  sender: string;
  senderEmail?: string;
  subject: string;
  preview: string;
  body: string;
  timestamp: string;
  isStarred: boolean;
  isRead: boolean;
  avatar?: string;
  folder: 'inbox' | 'spam' | 'trash' | 'sent';
  isDeleted?: boolean;
  thread?: EmailMessage[]; // For threaded conversations
}

export interface Folder {
  id: string;
  name: string;
  count?: number;
  icon: string;
} 