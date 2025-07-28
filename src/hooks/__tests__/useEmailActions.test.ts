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

describe('useEmailActions (useReducer)', () => {
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
      // Verify other properties remain unchanged
      expect(updatedEmail?.isRead).toBe(false)
      expect(updatedEmail?.folder).toBe('inbox')
    })

    it('unstars a starred email', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))

      act(() => {
        result.current.toggleStar('2')
      })

      const updatedEmail = result.current.emails.find(email => email.id === '2')
      expect(updatedEmail?.isStarred).toBe(false)
      // Verify other properties remain unchanged
      expect(updatedEmail?.isRead).toBe(true)
      expect(updatedEmail?.folder).toBe('inbox')
    })

    it('does nothing for non-existent email', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))
      const initialEmails = [...result.current.emails]

      act(() => {
        result.current.toggleStar('non-existent')
      })

      expect(result.current.emails).toEqual(initialEmails)
    })

    it('also stars first thread message when starring threaded email', () => {
      const emailsWithThread: Email[] = [
        {
          id: '1',
          sender: 'Thread Sender',
          senderEmail: 'thread@example.com',
          subject: 'Thread Subject',
          preview: 'Thread preview',
          body: 'Thread body',
          timestamp: '10:00 AM',
          isStarred: false,
          isRead: true,
          avatar: 'TS',
          folder: 'inbox',
          thread: [
            {
              id: '1-1',
              sender: 'First Message',
              senderEmail: 'first@example.com',
              content: 'First message content',
              timestamp: '9:00 AM',
              avatar: 'FM',
              recipients: 'to you',
              isStarred: false
            },
            {
              id: '1-2',
              sender: 'Second Message',
              senderEmail: 'second@example.com',
              content: 'Second message content',
              timestamp: '9:30 AM',
              avatar: 'SM',
              recipients: 'to you',
              isStarred: false
            }
          ]
        }
      ]

      const { result } = renderHook(() => useEmailActions(emailsWithThread))

      // Star the threaded email
      act(() => {
        result.current.toggleStar('1')
      })

      const updatedEmail = result.current.emails.find(email => email.id === '1')

      // Main email should be starred
      expect(updatedEmail?.isStarred).toBe(true)

      // First thread message should also be starred
      expect(updatedEmail?.thread?.[0].isStarred).toBe(true)

      // Second thread message should remain unstarred
      expect(updatedEmail?.thread?.[1].isStarred).toBe(false)

      // Now unstar the email - first thread message should also be unstarred
      act(() => {
        result.current.toggleStar('1')
      })

      const unstarredEmail = result.current.emails.find(email => email.id === '1')
      expect(unstarredEmail?.isStarred).toBe(false)
      expect(unstarredEmail?.thread?.[0].isStarred).toBe(false)
      expect(unstarredEmail?.thread?.[1].isStarred).toBe(false)
    })
  })

  describe('markAsRead', () => {
    it('marks an unread email as read', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))

      act(() => {
        result.current.markAsRead('1')
      })

      const updatedEmail = result.current.emails.find(email => email.id === '1')
      expect(updatedEmail?.isRead).toBe(true)
      // Verify other properties remain unchanged
      expect(updatedEmail?.isStarred).toBe(false)
      expect(updatedEmail?.folder).toBe('inbox')
    })

    it('does nothing for already read email', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))
      const initialEmails = [...result.current.emails]

      act(() => {
        result.current.markAsRead('2') // Already read
      })

      expect(result.current.emails).toEqual(initialEmails)
    })

    it('does nothing for non-existent email', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))
      const initialEmails = [...result.current.emails]

      act(() => {
        result.current.markAsRead('non-existent')
      })

      expect(result.current.emails).toEqual(initialEmails)
    })
  })

  describe('markAsUnread', () => {
    it('marks a read email as unread', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))

      act(() => {
        result.current.markAsUnread('2')
      })

      const updatedEmail = result.current.emails.find(email => email.id === '2')
      expect(updatedEmail?.isRead).toBe(false)
      // Verify other properties remain unchanged
      expect(updatedEmail?.isStarred).toBe(true)
      expect(updatedEmail?.folder).toBe('inbox')
    })

    it('does nothing for already unread email', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))
      const initialEmails = [...result.current.emails]

      act(() => {
        result.current.markAsUnread('1') // Already unread
      })

      expect(result.current.emails).toEqual(initialEmails)
    })

    it('does nothing for non-existent email', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))
      const initialEmails = [...result.current.emails]

      act(() => {
        result.current.markAsUnread('non-existent')
      })

      expect(result.current.emails).toEqual(initialEmails)
    })
  })

  describe('moveToTrash', () => {
    it('moves an email to trash', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))

      act(() => {
        result.current.moveToTrash('1')
      })

      const updatedEmail = result.current.emails.find(email => email.id === '1')
      expect(updatedEmail?.folder).toBe('trash')
      expect(updatedEmail?.isDeleted).toBe(true)
      // Verify other properties remain unchanged
      expect(updatedEmail?.isStarred).toBe(false)
      expect(updatedEmail?.isRead).toBe(false)
    })

    it('does nothing for email already in trash', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))

      // First move to trash
      act(() => {
        result.current.moveToTrash('1')
      })

      const emailsAfterFirstMove = [...result.current.emails]

      // Try to move to trash again
      act(() => {
        result.current.moveToTrash('1')
      })

      expect(result.current.emails).toEqual(emailsAfterFirstMove)
    })

    it('does nothing for non-existent email', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))
      const initialEmails = [...result.current.emails]

      act(() => {
        result.current.moveToTrash('non-existent')
      })

      expect(result.current.emails).toEqual(initialEmails)
    })
  })

  describe('moveToSpam', () => {
    it('moves an email to spam', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))

      act(() => {
        result.current.moveToSpam('1')
      })

      const updatedEmail = result.current.emails.find(email => email.id === '1')
      expect(updatedEmail?.folder).toBe('spam')
      expect(updatedEmail?.isDeleted).toBe(false)
      // Verify other properties remain unchanged
      expect(updatedEmail?.isStarred).toBe(false)
      expect(updatedEmail?.isRead).toBe(false)
    })

    it('does nothing for email already in spam', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))
      const initialEmails = [...result.current.emails]

      act(() => {
        result.current.moveToSpam('3') // Already in spam
      })

      expect(result.current.emails).toEqual(initialEmails)
    })

    it('does nothing for non-existent email', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))
      const initialEmails = [...result.current.emails]

      act(() => {
        result.current.moveToSpam('non-existent')
      })

      expect(result.current.emails).toEqual(initialEmails)
    })
  })

  describe('restoreFromTrash', () => {
    it('restores an email from trash to inbox', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))

      // First move to trash
      act(() => {
        result.current.moveToTrash('1')
      })

      // Then restore
      act(() => {
        result.current.restoreFromTrash('1')
      })

      const updatedEmail = result.current.emails.find(email => email.id === '1')
      expect(updatedEmail?.folder).toBe('inbox')
      expect(updatedEmail?.isDeleted).toBe(false)
      // Verify other properties remain unchanged
      expect(updatedEmail?.isStarred).toBe(false)
      expect(updatedEmail?.isRead).toBe(false)
    })

    it('does nothing for email already in inbox and not deleted', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))
      const initialEmails = [...result.current.emails]

      act(() => {
        result.current.restoreFromTrash('1') // Already in inbox
      })

      expect(result.current.emails).toEqual(initialEmails)
    })

    it('does nothing for non-existent email', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))
      const initialEmails = [...result.current.emails]

      act(() => {
        result.current.restoreFromTrash('non-existent')
      })

      expect(result.current.emails).toEqual(initialEmails)
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

    it('respects early returns in reducer for unchanged states', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))

      // Try operations that should not change state
      act(() => {
        result.current.markAsRead('2') // Already read
        result.current.markAsUnread('1') // Already unread
        result.current.moveToSpam('3') // Already in spam
      })

      // Should be exactly the same as initial state
      expect(result.current.emails).toEqual(mockInitialEmails)
    })
  })

  describe('Reducer Pattern Benefits', () => {
    it('provides consistent action interface', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))

      // All actions follow the same pattern
      expect(typeof result.current.toggleStar).toBe('function')
      expect(typeof result.current.markAsRead).toBe('function')
      expect(typeof result.current.markAsUnread).toBe('function')
      expect(typeof result.current.moveToTrash).toBe('function')
      expect(typeof result.current.moveToSpam).toBe('function')
      expect(typeof result.current.restoreFromTrash).toBe('function')
    })

    it('maintains immutability', () => {
      const { result } = renderHook(() => useEmailActions(mockInitialEmails))
      const initialReference = result.current.emails

      act(() => {
        result.current.markAsRead('1')
      })

      // Should return a new array reference
      expect(result.current.emails).not.toBe(initialReference)
      // But unchanged emails should maintain their references
      expect(result.current.emails.find(e => e.id === '2')).toBe(
        initialReference.find(e => e.id === '2')
      )
    })
  })
}) 