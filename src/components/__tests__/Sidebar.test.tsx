import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Sidebar from '../Sidebar'
import { Email } from '@/types/email'

// Mock the folders data
jest.mock('@/data/emails', () => ({
  folders: [
    { id: 'inbox', name: 'Inbox', count: 7, icon: '📥' },
    { id: 'starred', name: 'Starred', count: 0, icon: '⭐' },
    { id: 'all-mail', name: 'All Mail', count: 0, icon: '📧' },
    { id: 'spam', name: 'Spam', count: 0, icon: '⚠️' },
    { id: 'trash', name: 'Trash', count: 1, icon: '🗑️' },
  ],
  getEmailsForFolder: jest.fn((folderId: string, emails: Email[]) => {
    switch (folderId) {
      case 'inbox':
        return emails.filter(email => email.folder === 'inbox')
      case 'spam':
        return emails.filter(email => email.folder === 'spam')
      default:
        return []
    }
  })
}))

const mockEmails: Email[] = [
  {
    id: '1',
    sender: 'John Doe',
    senderEmail: 'john@example.com',
    subject: 'Test Email 1',
    preview: 'Test preview 1',
    body: 'Test body 1',
    timestamp: '10:00 AM',
    isStarred: false,
    isRead: true,
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
    isStarred: false,
    isRead: false,
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

const defaultProps = {
  activeFolder: 'inbox',
  onFolderSelect: jest.fn(),
  emails: mockEmails
}

describe('Sidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock console.log for compose button
    jest.spyOn(console, 'log').mockImplementation(() => { })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Rendering', () => {
    it('renders all folder navigation items', () => {
      render(<Sidebar {...defaultProps} />)

      expect(screen.getByText('Inbox')).toBeInTheDocument()
      expect(screen.getByText('Starred')).toBeInTheDocument()
      expect(screen.getByText('All Mail')).toBeInTheDocument()
      expect(screen.getByText('Spam')).toBeInTheDocument()
      expect(screen.getByText('Trash')).toBeInTheDocument()
    })

    it('renders compose button', () => {
      const { container } = render(<Sidebar {...defaultProps} />)

      // Look for compose button by its styling classes since it has no text content
      const composeButton = container.querySelector('button.rounded-2xl.bg-\\[rgb\\(194\\,231\\,255\\)\\]')
      expect(composeButton).toBeInTheDocument()
    })

    it('highlights active folder', () => {
      render(<Sidebar {...defaultProps} activeFolder="spam" />)

      const spamFolder = screen.getByText('Spam').closest('div')
      expect(spamFolder).toHaveClass('bg-[rgb(211,227,253)]', 'font-semibold')
    })

    it('applies hover effects to non-active folders', () => {
      render(<Sidebar {...defaultProps} activeFolder="inbox" />)

      const spamFolder = screen.getByText('Spam').closest('div')
      expect(spamFolder).toHaveClass('hover:bg-[oklch(0.928_0.006_264.531)]')
      expect(spamFolder).not.toHaveClass('bg-[rgb(211,227,253)]')
    })
  })

  describe('Folder Counts', () => {
    it('shows count for inbox folder', () => {
      render(<Sidebar {...defaultProps} />)

      // Should show count of 2 based on mock emails filtered for inbox
      expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('shows count for spam folder', () => {
      render(<Sidebar {...defaultProps} />)

      // Should show count of 1 based on mock emails filtered for spam
      expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('does not show counts for folders without emails', () => {
      const emailsWithoutStarred = mockEmails.map(email => ({ ...email, isStarred: false }))
      render(<Sidebar {...defaultProps} emails={emailsWithoutStarred} />)

      // Starred folder should not show count (0 emails)
      const starredFolder = screen.getByText('Starred').closest('div')
      expect(starredFolder).not.toHaveTextContent(/\d+/)
    })

    it('hides counts for non-inbox and non-spam folders', () => {
      render(<Sidebar {...defaultProps} />)

      // Check that other folders don't show counts
      const allMailFolder = screen.getByText('All Mail').closest('div')
      const trashFolder = screen.getByText('Trash').closest('div')

      expect(allMailFolder?.textContent).toBe('All Mail')
      expect(trashFolder?.textContent).toBe('Trash')
    })
  })

  describe('Folder Navigation', () => {
    it('calls onFolderSelect when folder is clicked', () => {
      const mockOnFolderSelect = jest.fn()
      render(<Sidebar {...defaultProps} onFolderSelect={mockOnFolderSelect} />)

      const spamFolder = screen.getByText('Spam')
      fireEvent.click(spamFolder)

      expect(mockOnFolderSelect).toHaveBeenCalledWith('spam')
    })

    it('calls onFolderSelect for each folder type', () => {
      const mockOnFolderSelect = jest.fn()
      render(<Sidebar {...defaultProps} onFolderSelect={mockOnFolderSelect} />)

      const folders = ['Inbox', 'Starred', 'All Mail', 'Spam', 'Trash']
      const expectedIds = ['inbox', 'starred', 'all-mail', 'spam', 'trash']

      folders.forEach((folderName, index) => {
        const folder = screen.getByText(folderName)
        fireEvent.click(folder)
        expect(mockOnFolderSelect).toHaveBeenCalledWith(expectedIds[index])
      })
    })
  })

  describe('Compose Button', () => {
    it('renders compose button with correct styling', () => {
      const { container } = render(<Sidebar {...defaultProps} />)

      const composeButton = container.querySelector('button.rounded-2xl.bg-\\[rgb\\(194\\,231\\,255\\)\\]')
      expect(composeButton).toHaveClass('rounded-2xl', 'bg-[rgb(194,231,255)]')
    })

    it('calls console.log when compose button is clicked', () => {
      const { container } = render(<Sidebar {...defaultProps} />)

      const composeButton = container.querySelector('button.rounded-2xl.bg-\\[rgb\\(194\\,231\\,255\\)\\]')
      fireEvent.click(composeButton!)

      expect(console.log).toHaveBeenCalledWith('Compose email clicked')
    })

    it('has proper styling on compose button', () => {
      const { container } = render(<Sidebar {...defaultProps} />)

      const composeButton = container.querySelector('button.rounded-2xl.bg-\\[rgb\\(194\\,231\\,255\\)\\]')
      expect(composeButton).toHaveClass('mb-4', 'h-[56px]', 'w-[138px]', 'opacity-50')
    })
  })

  describe('Icons', () => {
    it('renders folder icons', () => {
      render(<Sidebar {...defaultProps} />)

      // Check that images are rendered for each folder
      expect(screen.getByAltText('inbox')).toBeInTheDocument()
      expect(screen.getByAltText('starred')).toBeInTheDocument()
      expect(screen.getByAltText('all-mail')).toBeInTheDocument()
      expect(screen.getByAltText('spam')).toBeInTheDocument()
      expect(screen.getByAltText('trash')).toBeInTheDocument()
    })

    it('uses correct icon sources', () => {
      render(<Sidebar {...defaultProps} />)

      expect(screen.getByAltText('inbox')).toHaveAttribute('src', '/icon-inbox.webp')
      expect(screen.getByAltText('spam')).toHaveAttribute('src', '/icon-spam.webp')
      expect(screen.getByAltText('trash')).toHaveAttribute('src', '/icon-trash.webp')
    })
  })

  describe('Accessibility', () => {
    it('has proper cursor styles for clickable elements', () => {
      const { container } = render(<Sidebar {...defaultProps} />)

      const inboxFolder = screen.getByText('Inbox').closest('div')
      expect(inboxFolder).toHaveClass('cursor-pointer')

      const composeButton = container.querySelector('button.rounded-2xl.bg-\\[rgb\\(194\\,231\\,255\\)\\]')
      expect(composeButton).toBeInTheDocument()
    })

    it('has proper focus states', () => {
      render(<Sidebar {...defaultProps} />)

      const folders = screen.getAllByText(/Inbox|Starred|All Mail|Spam|Trash/)
      folders.forEach(folder => {
        const folderDiv = folder.closest('div')
        expect(folderDiv).toHaveClass('rounded-full')
      })
    })
  })
}) 