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
    sender: 'Test Sender',
    senderEmail: 'test@example.com',
    subject: 'Test Subject',
    preview: 'Test preview',
    body: 'Test body',
    timestamp: '10:00 AM',
    isStarred: false,
    isRead: true,
    avatar: 'TS',
    folder: 'inbox'
  },
  {
    id: '2',
    sender: 'Another Sender',
    senderEmail: 'another@example.com',
    subject: 'Another Subject',
    preview: 'Another preview',
    body: 'Another body',
    timestamp: '11:00 AM',
    isStarred: false,
    isRead: false,
    avatar: 'AS',
    folder: 'inbox'
  },
  {
    id: '3',
    sender: 'Spam Sender',
    senderEmail: 'spam@example.com',
    subject: 'Spam Subject',
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
    it('shows count for inbox when emails present', () => {
      render(<Sidebar {...defaultProps} />)

      const inboxFolder = screen.getByText('Inbox').closest('div')
      expect(inboxFolder).toHaveTextContent('2') // 2 inbox emails
    })

    it('shows count for spam when emails present', () => {
      render(<Sidebar {...defaultProps} />)

      const spamFolder = screen.getByText('Spam').closest('div')
      expect(spamFolder).toHaveTextContent('1') // 1 spam email
    })

    it('does not show counts for other folders', () => {
      render(<Sidebar {...defaultProps} />)

      // Starred, All Mail, and Trash should not show counts
      const starredFolder = screen.getByText('Starred').closest('div')
      const allMailFolder = screen.getByText('All Mail').closest('div')
      const trashFolder = screen.getByText('Trash').closest('div')

      expect(starredFolder?.textContent).toBe('Starred')
      expect(allMailFolder?.textContent).toBe('All Mail')
      expect(trashFolder?.textContent).toBe('Trash')
    })

    it('does not show count when folder is empty', () => {
      const emptyProps = {
        ...defaultProps,
        emails: []
      }
      render(<Sidebar {...emptyProps} />)

      const inboxFolder = screen.getByText('Inbox').closest('div')
      const spamFolder = screen.getByText('Spam').closest('div')

      expect(inboxFolder?.textContent).toBe('Inbox')
      expect(spamFolder?.textContent).toBe('Spam')
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
      expect(composeButton).toHaveClass('h-[56px]', 'w-[138px]', 'rounded-2xl', 'bg-[rgb(194,231,255)]')
      expect(composeButton).toHaveClass('hover:bg-[rgb(174,211,235)]', 'transition-colors', 'flex', 'items-center', 'justify-center')
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