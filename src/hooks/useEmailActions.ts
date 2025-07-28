import { useReducer, useCallback } from 'react';
import { Email } from '@/types/email';

// Define all possible email actions with proper types
interface EmailAction {
  type: 'TOGGLE_STAR' | 'TOGGLE_THREAD_MESSAGE_STAR' | 'MARK_READ' | 'MARK_UNREAD' | 'MOVE_TO_TRASH' | 'MOVE_TO_SPAM' | 'RESTORE_FROM_TRASH';
  payload: {
    emailId: string;
    messageId?: string; // For thread message actions
    folder?: string;
  };
}

// Email reducer function to handle all state updates
const emailReducer = (state: Email[], action: EmailAction): Email[] => {
  const { type, payload } = action;
  const { emailId, messageId } = payload;

  switch (type) {
    case 'TOGGLE_STAR':
      return state.map(email => {
        if (email.id === emailId) {
          const newStarredState = !email.isStarred;

          // If email has a thread, also toggle the first thread message's star
          if (email.thread && email.thread.length > 0) {
            return {
              ...email,
              isStarred: newStarredState,
              thread: email.thread.map((message, index) =>
                index === 0 // First message in thread
                  ? { ...message, isStarred: newStarredState }
                  : message
              )
            };
          }

          // No thread, just toggle main email star
          return { ...email, isStarred: newStarredState };
        }
        return email;
      });

    case 'TOGGLE_THREAD_MESSAGE_STAR': {
      if (!messageId) return state; // Early return if no messageId provided

      return state.map(email => {
        if (email.id === emailId && email.thread) {
          return {
            ...email,
            thread: email.thread.map(message =>
              message.id === messageId
                ? { ...message, isStarred: !message.isStarred }
                : message
            )
          };
        }
        return email;
      });
    }

    case 'MARK_READ': {
      // Early return if email doesn't exist or is already read
      const email = state.find(e => e.id === emailId);
      if (!email || email.isRead) return state;

      return state.map(email =>
        email.id === emailId
          ? { ...email, isRead: true }
          : email
      );
    }

    case 'MARK_UNREAD': {
      // Early return if email doesn't exist or is already unread
      const email = state.find(e => e.id === emailId);
      if (!email || !email.isRead) return state;

      return state.map(email =>
        email.id === emailId
          ? { ...email, isRead: false }
          : email
      );
    }

    case 'MOVE_TO_TRASH': {
      // Early return if email doesn't exist or is already in trash
      const email = state.find(e => e.id === emailId);
      if (!email || email.folder === 'trash') return state;

      return state.map(email =>
        email.id === emailId
          ? { ...email, folder: 'trash', isDeleted: true }
          : email
      );
    }

    case 'MOVE_TO_SPAM': {
      // Early return if email doesn't exist or is already in spam
      const email = state.find(e => e.id === emailId);
      if (!email || email.folder === 'spam') return state;

      return state.map(email =>
        email.id === emailId
          ? { ...email, folder: 'spam', isDeleted: false }
          : email
      );
    }

    case 'RESTORE_FROM_TRASH': {
      // Early return if email doesn't exist or is already in inbox
      const email = state.find(e => e.id === emailId);
      if (!email || (email.folder === 'inbox' && !email.isDeleted)) return state;

      return state.map(email =>
        email.id === emailId
          ? { ...email, folder: 'inbox', isDeleted: false }
          : email
      );
    }

    default:
      return state;
  }
};

export interface EmailActions {
  emails: Email[];
  toggleStar: (emailId: string) => void;
  toggleThreadMessageStar: (emailId: string, messageId: string) => void; // New method for thread messages
  markAsRead: (emailId: string) => void;
  markAsUnread: (emailId: string) => void;
  moveToTrash: (emailId: string) => void;
  moveToSpam: (emailId: string) => void;
  restoreFromTrash: (emailId: string) => void;
}

export const useEmailActions = (initialEmails: Email[]): EmailActions => {
  const [emails, dispatch] = useReducer(emailReducer, initialEmails);

  // Action creators - these dispatch actions to the reducer
  const toggleStar = useCallback((emailId: string) => {
    dispatch({
      type: 'TOGGLE_STAR',
      payload: { emailId }
    });
  }, []);

  const toggleThreadMessageStar = useCallback((emailId: string, messageId: string) => {
    dispatch({
      type: 'TOGGLE_THREAD_MESSAGE_STAR',
      payload: { emailId, messageId }
    });
  }, []);

  const markAsRead = useCallback((emailId: string) => {
    dispatch({
      type: 'MARK_READ',
      payload: { emailId }
    });
  }, []);

  const markAsUnread = useCallback((emailId: string) => {
    dispatch({
      type: 'MARK_UNREAD',
      payload: { emailId }
    });
  }, []);

  const moveToTrash = useCallback((emailId: string) => {
    dispatch({
      type: 'MOVE_TO_TRASH',
      payload: { emailId }
    });
  }, []);

  const moveToSpam = useCallback((emailId: string) => {
    dispatch({
      type: 'MOVE_TO_SPAM',
      payload: { emailId }
    });
  }, []);

  const restoreFromTrash = useCallback((emailId: string) => {
    dispatch({
      type: 'RESTORE_FROM_TRASH',
      payload: { emailId }
    });
  }, []);

  return {
    emails,
    toggleStar,
    toggleThreadMessageStar,
    markAsRead,
    markAsUnread,
    moveToTrash,
    moveToSpam,
    restoreFromTrash,
  };
}; 