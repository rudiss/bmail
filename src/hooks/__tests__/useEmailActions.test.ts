import { renderHook, act } from '@testing-library/react'
import { useEmailActions } from '../useEmailActions'
import { Email } from '@/types/email'

const mockInitialEmails: Email[] = [
  {
    id: '1',
    sender: 'John Doe',
    senderEmail: 'john@example.com',
    subject: 'Test Email 1',
    preview: 'Test preview 1',
    body: 'Test body 1',
    timestamp: '10:00 AM',
    isStarred: false,
    isRead: false,
    avatar: 'JD',
    folder: 'inbox'
  },
  {
    id: '2',
    sender: 'Jane Smith',
    senderEmail: 'jane@example.com',
    subject: 'Test Email 2',
    preview: 'Test preview 2',
    body: 'Test body 2',
    timestamp: '11:00 AM',
    isStarred: true,
    isRead: true,
    avatar: 'JS',
    folder: 'inbox'
  },
  {
    id: '3',
    sender: 'Spam Sender',
    senderEmail: 'spam@example.com',
    subject: 'Spam Email',
    preview: 'Spam preview',
    body: 'Spam body',
    timestamp: '12:00 PM',
    isStarred: false,
    isRead: false,
    avatar: 'SS',
    folder: 'spam'
  }
]

describe('useEmailActions', () => {
  describe('Initial State', () => {
    it('initializes with provided emails', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))

      expect(result.current.emails).toEqual(mockInitialEmails)
      expect(result.current.emails).toHaveLength(3)
    })

    it('initializes with empty array when no emails provided', () => {
      const { result } = renderHook(() => useEmailActions([]))

      expect(result.current.emails).toEqual([])
      expect(result.current.emails).toHaveLength(0)
    })
  })

  describe('toggleStar', () => {
    it('stars an unstarred email', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))

      act(() => {
        result.current.toggleStar('1')
      })

      const updatedEmail = result.current.emails.find(email => email.id === '1')
      expect(updatedEmail?.isStarred).toBe(true)
    })

    it('unstars a starred email', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))

      act(() => {
        result.current.toggleStar('2')
      })

      const updatedEmail = result.current.emails.find(email => email.id === '2')
      expect(updatedEmail?.isStarred).toBe(false)
    })

    it('does nothing for non-existent email', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))

      act(() => {
        result.current.toggleStar('non-existent')
      })

      expect(result.current.emails).toEqual(mockInitialEmails)
    })
  })

  describe('markAsRead', () => {
    it('marks unread email as read', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))

      act(() => {
        result.current.markAsRead('1')
      })

      const updatedEmail = result.current.emails.find(email => email.id === '1')
      expect(updatedEmail?.isRead).toBe(true)
    })

    it('does not change already read email', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))

      act(() => {
        result.current.markAsRead('2')
      })

      const updatedEmail = result.current.emails.find(email => email.id === '2')
      expect(updatedEmail?.isRead).toBe(true)
    })

    it('does nothing for non-existent email', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))

      act(() => {
        result.current.markAsRead('non-existent')
      })

      expect(result.current.emails).toEqual(mockInitialEmails)
    })
  })

  describe('markAsUnread', () => {
    it('marks read email as unread', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))

      act(() => {
        result.current.markAsUnread('2')
      })

      const updatedEmail = result.current.emails.find(email => email.id === '2')
      expect(updatedEmail?.isRead).toBe(false)
    })

    it('does not change already unread email', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))

      act(() => {
        result.current.markAsUnread('1')
      })

      const updatedEmail = result.current.emails.find(email => email.id === '1')
      expect(updatedEmail?.isRead).toBe(false)
    })
  })

  describe('moveToTrash', () => {
    it('moves email to trash folder', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))

      act(() => {
        result.current.moveToTrash('1')
      })

      const updatedEmail = result.current.emails.find(email => email.id === '1')
      expect(updatedEmail?.folder).toBe('trash')
    })

    it('sets isDeleted flag when moving to trash', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))

      act(() => {
        result.current.moveToTrash('1')
      })

      const updatedEmail = result.current.emails.find(email => email.id === '1')
      expect(updatedEmail?.isDeleted).toBe(true)
    })
  })

  describe('moveToSpam', () => {
    it('moves email to spam folder', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))

      act(() => {
        result.current.moveToSpam('1')
      })

      const updatedEmail = result.current.emails.find(email => email.id === '1')
      expect(updatedEmail?.folder).toBe('spam')
    })

    it('does not affect emails already in spam', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))

      act(() => {
        result.current.moveToSpam('3')
      })

      const updatedEmail = result.current.emails.find(email => email.id === '3')
      expect(updatedEmail?.folder).toBe('spam')
    })
  })

  describe('restoreFromTrash', () => {
    it('restores email from trash to inbox', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))

      // First move to trash
      act(() => {
        result.current.moveToTrash('1')
      })

      // Then restore
      act(() => {
        result.current.restoreFromTrash('1')
      })

      const restoredEmail = result.current.emails.find(email => email.id === '1')
      expect(restoredEmail?.folder).toBe('inbox')
      expect(restoredEmail?.isDeleted).toBe(false)
    })

    it('restores email from spam to inbox', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))

      act(() => {
        result.current.restoreFromTrash('3')
      })

      const restoredEmail = result.current.emails.find(email => email.id === '3')
      expect(restoredEmail?.folder).toBe('inbox')
    })

    it('clears isDeleted flag when restoring', () => {
      // Create email with isDeleted true
      const emailsWithDeleted = [
        {
          ...mockInitialEmails[0],
          isDeleted: true,
          folder: 'trash' as const
        }
      ]

      const { result } = renderHook(() => useEmailActions(emailsWithDeleted))

      act(() => {
        result.current.restoreFromTrash('1')
      })

      const restoredEmail = result.current.emails.find(email => email.id === '1')
      expect(restoredEmail?.isDeleted).toBe(false)
    })
  })

  describe('Multiple Operations', () => {
    it('handles multiple operations in sequence', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))

      act(() => {
        // Star email
        result.current.toggleStar('1')
        // Mark as read
        result.current.markAsRead('1')
        // Move to spam
        result.current.moveToSpam('1')
      })

      const updatedEmail = result.current.emails.find(email => email.id === '1')
      expect(updatedEmail?.isStarred).toBe(true)
      expect(updatedEmail?.isRead).toBe(true)
      expect(updatedEmail?.folder).toBe('spam')
    })

    it('maintains state consistency across operations', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))

      const initialCount = result.current.emails.length

      act(() => {
        result.current.toggleStar('1')
        result.current.markAsRead('2')
        result.current.moveToTrash('3')
      })

      // Should still have same number of emails
      expect(result.current.emails).toHaveLength(initialCount)

      // Check individual changes
      expect(result.current.emails.find(e => e.id === '1')?.isStarred).toBe(true)
      expect(result.current.emails.find(e => e.id === '2')?.isRead).toBe(true)
      expect(result.current.emails.find(e => e.id === '3')?.folder).toBe('trash')
    })
  })

  describe('Edge Cases', () => {
    it('handles operations on non-existent emails gracefully', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))

      act(() => {
        result.current.toggleStar('non-existent')
        result.current.markAsRead('non-existent')
        result.current.moveToTrash('non-existent')
        result.current.moveToSpam('non-existent')
        result.current.restoreFromTrash('non-existent')
      })

      // Original emails should remain unchanged
      expect(result.current.emails).toEqual(mockInitialEmails)
    })

    it('preserves email properties during folder changes', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))

      act(() => {
        result.current.moveToSpam('2')
      })

      const movedEmail = result.current.emails.find(email => email.id === '2')
      expect(movedEmail?.sender).toBe('Jane Smith')
      expect(movedEmail?.subject).toBe('Test Email 2')
      expect(movedEmail?.isStarred).toBe(true) // Should preserve starred state
      expect(movedEmail?.isRead).toBe(true) // Should preserve read state
    })
  })
}) 