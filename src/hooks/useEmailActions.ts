import { useState, useCallback } from 'react';
import { Email } from '@/types/email';

export interface EmailActions {
  emails: Email[];
  toggleStar: (emailId: string) => void;
  markAsRead: (emailId: string) => void;
  markAsUnread: (emailId: string) => void;
  moveToTrash: (emailId: string) => void;
  moveToSpam: (emailId: string) => void;
  restoreFromTrash: (emailId: string) => void;
}

export const useEmailActions = (initialEmails: Email[]): EmailActions => {
  const [emails, setEmails] = useState<Email[]>(initialEmails);

  const toggleStar = useCallback((emailId: string) => {
    setEmails(prevEmails => {
      // Early return if email doesn't exist
      const emailExists = prevEmails.some(email => email.id === emailId);
      if (!emailExists) return prevEmails;

      return prevEmails.map(email =>
        email.id === emailId
          ? { ...email, isStarred: !email.isStarred }
          : email
      );
    });
  }, []);

  const markAsRead = useCallback((emailId: string) => {
    setEmails(prevEmails => {
      // Early return if email doesn't exist or is already read
      const email = prevEmails.find(e => e.id === emailId);

      if (!email) {
        return prevEmails;
      }

      if (email.isRead) {
        return prevEmails;
      }

      const updatedEmails = prevEmails.map(email =>
        email.id === emailId
          ? { ...email, isRead: true }
          : email
      );
      return updatedEmails;
    });
  }, []);

  const markAsUnread = useCallback((emailId: string) => {
    setEmails(prevEmails => {
      // Early return if email doesn't exist or is already unread
      const email = prevEmails.find(e => e.id === emailId);
      if (!email || !email.isRead) return prevEmails;

      return prevEmails.map(email =>
        email.id === emailId
          ? { ...email, isRead: false }
          : email
      );
    });
  }, []);

  const moveToTrash = useCallback((emailId: string) => {
    setEmails(prevEmails => {
      // Early return if email doesn't exist or is already in trash
      const email = prevEmails.find(e => e.id === emailId);
      if (!email || email.folder === 'trash') return prevEmails;

      return prevEmails.map(email =>
        email.id === emailId
          ? { ...email, folder: 'trash', isDeleted: true }
          : email
      );
    });
  }, []);

  const moveToSpam = useCallback((emailId: string) => {
    setEmails(prevEmails => {
      // Early return if email doesn't exist or is already in spam
      const email = prevEmails.find(e => e.id === emailId);
      if (!email || email.folder === 'spam') return prevEmails;

      return prevEmails.map(email =>
        email.id === emailId
          ? { ...email, folder: 'spam', isDeleted: false }
          : email
      );
    });
  }, []);

  const restoreFromTrash = useCallback((emailId: string) => {
    setEmails(prevEmails => {
      // Early return if email doesn't exist or is already in inbox
      const email = prevEmails.find(e => e.id === emailId);
      if (!email || (email.folder === 'inbox' && !email.isDeleted)) return prevEmails;

      return prevEmails.map(email =>
        email.id === emailId
          ? { ...email, folder: 'inbox', isDeleted: false }
          : email
      );
    });
  }, []);

  return {
    emails,
    toggleStar,
    markAsRead,
    markAsUnread,
    moveToTrash,
    moveToSpam,
    restoreFromTrash,
  };
}; 