import { getEmailsForFolder, folders, initialEmails } from '../emails'
import { Email } from '@/types/email'

describe('emails data utilities', () => {
  describe('folders', () => {
    it('contains all expected folders', () => {
      const expectedFolderIds = ['inbox', 'starred', 'all-mail', 'spam', 'trash', 'sent']
      const actualFolderIds = folders.map(folder => folder.id)

      expect(actualFolderIds).toEqual(expectedFolderIds)
    })

    it('has correct folder properties', () => {
      folders.forEach(folder => {
        expect(folder).toHaveProperty('id')
        expect(folder).toHaveProperty('name')
        expect(folder).toHaveProperty('count')
        expect(folder).toHaveProperty('icon')

        expect(typeof folder.id).toBe('string')
        expect(typeof folder.name).toBe('string')
        expect(typeof folder.count).toBe('number')
        expect(typeof folder.icon).toBe('string')
      })
    })

    it('has expected folder names', () => {
      const expectedNames = ['Inbox', 'Starred', 'All Mail', 'Spam', 'Trash', 'Sent']
      const actualNames = folders.map(folder => folder.name)

      expect(actualNames).toEqual(expectedNames)
    })
  })

  describe('initialEmails', () => {
    it('contains expected number of emails', () => {
      expect(initialEmails).toHaveLength(12)
    })

    it('has proper email structure', () => {
      initialEmails.forEach(email => {
        expect(email).toHaveProperty('id')
        expect(email).toHaveProperty('sender')
        expect(email).toHaveProperty('senderEmail')
        expect(email).toHaveProperty('subject')
        expect(email).toHaveProperty('preview')
        expect(email).toHaveProperty('body')
        expect(email).toHaveProperty('timestamp')
        expect(email).toHaveProperty('isStarred')
        expect(email).toHaveProperty('isRead')
        expect(email).toHaveProperty('avatar')
        expect(email).toHaveProperty('folder')

        expect(typeof email.id).toBe('string')
        expect(typeof email.sender).toBe('string')
        expect(typeof email.senderEmail).toBe('string')
        expect(typeof email.subject).toBe('string')
        expect(typeof email.preview).toBe('string')
        expect(typeof email.body).toBe('string')
        expect(typeof email.timestamp).toBe('string')
        expect(typeof email.isStarred).toBe('boolean')
        expect(typeof email.isRead).toBe('boolean')
        expect(typeof email.avatar).toBe('string')
        expect(typeof email.folder).toBe('string')
      })
    })

    it('has emails in different folders', () => {
      const folders = [...new Set(initialEmails.map(email => email.folder))]
      expect(folders).toContain('inbox')
      expect(folders).toContain('spam')
      expect(folders).toContain('trash')
    })

    it('has emails with thread data', () => {
      const emailsWithThreads = initialEmails.filter(email => email.thread && email.thread.length > 0)
      expect(emailsWithThreads.length).toBeGreaterThan(0)

      emailsWithThreads.forEach(email => {
        email.thread!.forEach(message => {
          expect(message).toHaveProperty('id')
          expect(message).toHaveProperty('sender')
          expect(message).toHaveProperty('senderEmail')
          expect(message).toHaveProperty('content')
          expect(message).toHaveProperty('timestamp')
          expect(message).toHaveProperty('avatar')
          expect(message).toHaveProperty('recipients')
        })
      })
    })
  })

  describe('getEmailsForFolder', () => {
    const testEmails: Email[] = [
      {
        id: '1',
        sender: 'Test User 1',
        senderEmail: 'test1@example.com',
        subject: 'Inbox Email',
        preview: 'Preview 1',
        body: 'Body 1',
        timestamp: '10:00 AM',
        isStarred: true,
        isRead: false,
        avatar: 'T1',
        folder: 'inbox'
      },
      {
        id: '2',
        sender: 'Test User 2',
        senderEmail: 'test2@example.com',
        subject: 'Starred Email',
        preview: 'Preview 2',
        body: 'Body 2',
        timestamp: '11:00 AM',
        isStarred: true,
        isRead: true,
        avatar: 'T2',
        folder: 'inbox'
      },
      {
        id: '3',
        sender: 'Spam User',
        senderEmail: 'spam@example.com',
        subject: 'Spam Email',
        preview: 'Spam preview',
        body: 'Spam body',
        timestamp: '12:00 PM',
        isStarred: false,
        isRead: false,
        avatar: 'SU',
        folder: 'spam'
      },
      {
        id: '4',
        sender: 'Deleted User',
        senderEmail: 'deleted@example.com',
        subject: 'Deleted Email',
        preview: 'Deleted preview',
        body: 'Deleted body',
        timestamp: '1:00 PM',
        isStarred: false,
        isRead: true,
        avatar: 'DU',
        folder: 'trash'
      },
      {
        id: '5',
        sender: 'Marked Deleted',
        senderEmail: 'marked@example.com',
        subject: 'Marked Deleted Email',
        preview: 'Marked deleted preview',
        body: 'Marked deleted body',
        timestamp: '2:00 PM',
        isStarred: true,
        isRead: false,
        avatar: 'MD',
        folder: 'inbox',
        isDeleted: true
      }
    ]

    describe('inbox folder', () => {
      it('returns only inbox emails that are not deleted', () => {
        const result = getEmailsForFolder('inbox', testEmails)

        expect(result).toHaveLength(2)
        expect(result.every(email => email.folder === 'inbox')).toBe(true)
        expect(result.every(email => !email.isDeleted)).toBe(true)
      })

      it('excludes deleted emails from inbox', () => {
        const result = getEmailsForFolder('inbox', testEmails)

        expect(result.find(email => email.id === '5')).toBeUndefined()
      })
    })

    describe('starred folder', () => {
      it('returns only starred emails that are not deleted or in trash', () => {
        const result = getEmailsForFolder('starred', testEmails)

        expect(result).toHaveLength(2)
        expect(result.every(email => email.isStarred)).toBe(true)
        expect(result.every(email => !email.isDeleted)).toBe(true)
        expect(result.every(email => email.folder !== 'trash')).toBe(true)
      })

      it('excludes starred emails that are deleted', () => {
        const result = getEmailsForFolder('starred', testEmails)

        expect(result.find(email => email.id === '5')).toBeUndefined()
      })
    })

    describe('all-mail folder', () => {
      it('returns all emails except deleted and trash', () => {
        const result = getEmailsForFolder('all-mail', testEmails)

        expect(result).toHaveLength(3)
        expect(result.every(email => !email.isDeleted)).toBe(true)
        expect(result.every(email => email.folder !== 'trash')).toBe(true)
      })

      it('includes emails from inbox and spam but not trash', () => {
        const result = getEmailsForFolder('all-mail', testEmails)

        const folders = result.map(email => email.folder)
        expect(folders).toContain('inbox')
        expect(folders).toContain('spam')
        expect(folders).not.toContain('trash')
      })
    })

    describe('spam folder', () => {
      it('returns only spam emails', () => {
        const result = getEmailsForFolder('spam', testEmails)

        expect(result).toHaveLength(1)
        expect(result.every(email => email.folder === 'spam')).toBe(true)
      })

      it('includes spam emails regardless of deleted status', () => {
        const spamEmails = [
          ...testEmails,
          {
            ...testEmails[2],
            id: '6',
            isDeleted: true
          }
        ]

        const result = getEmailsForFolder('spam', spamEmails)
        expect(result).toHaveLength(2)
      })
    })

    describe('trash folder', () => {
      it('returns deleted emails and emails in trash folder', () => {
        const result = getEmailsForFolder('trash', testEmails)

        expect(result).toHaveLength(2)
        expect(result.some(email => email.isDeleted)).toBe(true)
        expect(result.some(email => email.folder === 'trash')).toBe(true)
      })

      it('includes both explicitly deleted and trash folder emails', () => {
        const result = getEmailsForFolder('trash', testEmails)

        // Should include the email marked as deleted (id: '5') and trash folder email (id: '4')
        expect(result.find(email => email.id === '4')).toBeDefined()
        expect(result.find(email => email.id === '5')).toBeDefined()
      })
    })

    describe('sent folder', () => {
      it('returns only sent emails that are not deleted', () => {
        const sentEmails = [
          ...testEmails,
          {
            id: '6',
            sender: 'You',
            senderEmail: 'you@company.com',
            subject: 'Sent Email',
            preview: 'This is a sent email',
            body: 'This is a sent email body',
            timestamp: '2:30 PM',
            isStarred: false,
            isRead: true,
            avatar: 'YU',
            folder: 'sent' as const
          }
        ]

        const result = getEmailsForFolder('sent', sentEmails)

        expect(result).toHaveLength(1)
        expect(result.every(email => email.folder === 'sent')).toBe(true)
        expect(result.every(email => !email.isDeleted)).toBe(true)
      })

      it('excludes deleted sent emails', () => {
        const sentEmails = [
          ...testEmails,
          {
            id: '6',
            sender: 'You',
            senderEmail: 'you@company.com',
            subject: 'Sent Email',
            preview: 'This is a sent email',
            body: 'This is a sent email body',
            timestamp: '2:30 PM',
            isStarred: false,
            isRead: true,
            avatar: 'YU',
            folder: 'sent' as const,
            isDeleted: true
          }
        ]

        const result = getEmailsForFolder('sent', sentEmails)

        expect(result).toHaveLength(0)
      })
    })

    describe('unknown folder', () => {
      it('defaults to inbox behavior for unknown folder', () => {
        const result = getEmailsForFolder('unknown-folder', testEmails)
        const inboxResult = getEmailsForFolder('inbox', testEmails)

        expect(result).toEqual(inboxResult)
      })
    })

    describe('empty emails array', () => {
      it('returns empty array for any folder when no emails provided', () => {
        const folders = ['inbox', 'starred', 'all-mail', 'spam', 'trash']

        folders.forEach(folder => {
          const result = getEmailsForFolder(folder, [])
          expect(result).toEqual([])
        })
      })
    })
  })

  describe('data integrity', () => {
    it('all initial emails have unique IDs', () => {
      const ids = initialEmails.map(email => email.id)
      const uniqueIds = [...new Set(ids)]

      expect(ids).toHaveLength(uniqueIds.length)
    })

    it('all initial emails have valid email addresses', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      initialEmails.forEach(email => {
        expect(email.senderEmail).toMatch(emailRegex)
      })
    })

    it('thread messages have unique IDs within each email', () => {
      initialEmails.forEach(email => {
        if (email.thread) {
          const threadIds = email.thread.map(message => message.id)
          const uniqueThreadIds = [...new Set(threadIds)]

          expect(threadIds).toHaveLength(uniqueThreadIds.length)
        }
      })
    })
  })
}) 