import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import EmailDetail from '../EmailDetail'
import { Email } from '@/types/email'
import { EmailActions } from '@/hooks/useEmailActions'

const mockEmail: Email = {
  id: '1',
  sender: 'John Doe',
  senderEmail: 'john@example.com',
  subject: 'Test Subject',
  preview: 'Test preview',
  body: 'This is the body of the test email',
  timestamp: '10:00 AM',
  isStarred: false,
  isRead: true,
  avatar: 'JD',
  folder: 'inbox'
}

const mockSpamEmail: Email = {
  ...mockEmail,
  id: '2',
  folder: 'spam'
}

const mockTrashEmail: Email = {
  ...mockEmail,
  id: '3',
  folder: 'trash'
}

const mockEmailWithThread: Email = {
  ...mockEmail,
  id: '4',
  thread: [
    {
      id: '4-1',
      sender: 'John Doe',
      senderEmail: 'john@example.com',
      content: 'First message in thread',
      timestamp: 'Wed, Mar 12, 2:00 PM (26 hours ago)',
      avatar: 'JD',
      recipients: 'to you'
    },
    {
      id: '4-2',
      sender: 'Jane Smith',
      senderEmail: 'jane@example.com',
      content: 'Reply to the thread',
      timestamp: 'Wed, Mar 12, 4:15 PM (24 hours ago)',
      avatar: 'JS',
      recipients: 'to John Doe'
    }
  ]
}

const mockEmailActions: EmailActions = {
  emails: [mockEmail],
  toggleStar: jest.fn(),
  markAsRead: jest.fn(),
  markAsUnread: jest.fn(),
  moveToTrash: jest.fn(),
  moveToSpam: jest.fn(),
  restoreFromTrash: jest.fn()
}

const defaultProps = {
  email: mockEmail,
  onBack: jest.fn(),
  onToggleStar: jest.fn(),
  emailActions: mockEmailActions,
  activeFolder: 'inbox'
}

describe('EmailDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders email subject and content', () => {
      render(<EmailDetail {...defaultProps} />)

      expect(screen.getByText('Test Subject')).toBeInTheDocument()
      expect(screen.getByText('This is the body of the test email')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()

      // Email address should be hidden by default
      expect(screen.queryByText('<john@example.com>')).not.toBeInTheDocument()
    })

    it('shows email details when header is clicked', () => {
      render(<EmailDetail {...defaultProps} />)

      // Click on the header to expand details
      const header = screen.getByText('John Doe').closest('div[class*="cursor-pointer"]')
      fireEvent.click(header!)

      // Now email address and recipients should be visible
      expect(screen.getByText('<john@example.com>')).toBeInTheDocument()
      expect(screen.getByText('to you')).toBeInTheDocument()
    })

    it('renders thread messages when email has threads', () => {
      render(<EmailDetail {...defaultProps} email={mockEmailWithThread} />)

      expect(screen.getByText('First message in thread')).toBeInTheDocument()
      expect(screen.getByText('Reply to the thread')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })

    it('shows thread message details when header is clicked', () => {
      render(<EmailDetail {...defaultProps} email={mockEmailWithThread} />)

      // Initially email addresses should be hidden
      expect(screen.queryByText('<john@example.com>')).not.toBeInTheDocument()
      expect(screen.queryByText('to you')).not.toBeInTheDocument()

      // Click on the first message header
      const firstMessageHeader = screen.getByText('John Doe').closest('div[class*="cursor-pointer"]')
      fireEvent.click(firstMessageHeader!)

      // Now first message details should be visible
      expect(screen.getByText('<john@example.com>')).toBeInTheDocument()
      expect(screen.getByText('to you')).toBeInTheDocument()
    })

    it('renders single message view when no threads', () => {
      render(<EmailDetail {...defaultProps} />)

      // Recipients should be hidden by default
      expect(screen.queryByText('to you')).not.toBeInTheDocument()
      expect(screen.getByText('10:00 AM (40 hours ago)')).toBeInTheDocument()
    })
  })

  describe('Toolbar Actions', () => {
    it('shows regular toolbar for inbox emails', () => {
      render(<EmailDetail {...defaultProps} />)

      expect(screen.getByTitle('Back')).toBeInTheDocument()
      expect(screen.getByTitle('Report spam')).toBeInTheDocument()
      expect(screen.getByTitle('Delete')).toBeInTheDocument()
    })

    it('shows spam-specific toolbar for spam emails', () => {
      render(<EmailDetail {...defaultProps} email={mockSpamEmail} />)

      expect(screen.getByTitle('Back')).toBeInTheDocument()
      expect(screen.getByText('Not spam')).toBeInTheDocument()
      expect(screen.queryByTitle('Report spam')).not.toBeInTheDocument()
      expect(screen.queryByTitle('Delete')).not.toBeInTheDocument()
    })

    it('shows trash-specific toolbar for trash emails', () => {
      render(<EmailDetail {...defaultProps} email={mockTrashEmail} activeFolder="trash" />)

      expect(screen.getByTitle('Back')).toBeInTheDocument()
      expect(screen.getByText('Move to Inbox')).toBeInTheDocument()
      expect(screen.queryByTitle('Report spam')).not.toBeInTheDocument()
      expect(screen.queryByTitle('Delete')).not.toBeInTheDocument()
    })
  })

  describe('Button Interactions', () => {
    it('calls onBack when back button is clicked', () => {
      const mockOnBack = jest.fn()
      render(<EmailDetail {...defaultProps} onBack={mockOnBack} />)

      const backButton = screen.getByTitle('Back')
      fireEvent.click(backButton)

      expect(mockOnBack).toHaveBeenCalled()
    })

    it('calls moveToSpam and onBack when report spam is clicked', () => {
      const mockOnBack = jest.fn()
      const testEmailActions = {
        ...mockEmailActions,
        moveToSpam: jest.fn()
      }

      render(
        <EmailDetail
          {...defaultProps}
          onBack={mockOnBack}
          emailActions={testEmailActions}
        />
      )

      const spamButton = screen.getByTitle('Report spam')
      fireEvent.click(spamButton)

      expect(testEmailActions.moveToSpam).toHaveBeenCalledWith('1')
      expect(mockOnBack).toHaveBeenCalled()
    })

    it('calls moveToTrash and onBack when delete is clicked', () => {
      const mockOnBack = jest.fn()
      const testEmailActions = {
        ...mockEmailActions,
        moveToTrash: jest.fn()
      }

      render(
        <EmailDetail
          {...defaultProps}
          onBack={mockOnBack}
          emailActions={testEmailActions}
        />
      )

      const deleteButton = screen.getByTitle('Delete')
      fireEvent.click(deleteButton)

      expect(testEmailActions.moveToTrash).toHaveBeenCalledWith('1')
      expect(mockOnBack).toHaveBeenCalled()
    })

    it('calls restoreFromTrash when "Move to Inbox" is clicked', () => {
      const mockOnBack = jest.fn()
      const testEmailActions = {
        ...mockEmailActions,
        restoreFromTrash: jest.fn()
      }

      render(
        <EmailDetail
          {...defaultProps}
          email={mockTrashEmail}
          activeFolder="trash"
          onBack={mockOnBack}
          emailActions={testEmailActions}
        />
      )

      const moveToInboxButton = screen.getByText('Move to Inbox')
      fireEvent.click(moveToInboxButton)

      expect(testEmailActions.restoreFromTrash).toHaveBeenCalledWith('3')
      expect(mockOnBack).toHaveBeenCalled()
    })
  })

  describe('Star Functionality', () => {
    it('shows star button for non-trash folders', () => {
      render(<EmailDetail {...defaultProps} />)

      expect(screen.getByAltText('Star')).toBeInTheDocument()
    })

    it('hides star button for trash folder', () => {
      render(<EmailDetail {...defaultProps} activeFolder="trash" />)

      expect(screen.queryByAltText('Star')).not.toBeInTheDocument()
    })

    it('calls onToggleStar when star is clicked', () => {
      const mockOnToggleStar = jest.fn()
      render(<EmailDetail {...defaultProps} onToggleStar={mockOnToggleStar} />)

      const starButton = screen.getByAltText('Star').closest('button')
      fireEvent.click(starButton!)

      expect(mockOnToggleStar).toHaveBeenCalledWith('1', expect.any(Object))
    })

    it('shows filled star for starred emails', () => {
      const starredEmail = { ...mockEmail, isStarred: true }
      render(<EmailDetail {...defaultProps} email={starredEmail} />)

      const starImage = screen.getByAltText('Star')
      expect(starImage).toHaveAttribute('src', '/icon-star-filled-yellow.webp')
    })
  })

  describe('Toggle Functionality', () => {
    it('toggles email details visibility when header is clicked multiple times', () => {
      render(<EmailDetail {...defaultProps} />)

      const header = screen.getByText('John Doe').closest('div[class*="cursor-pointer"]')

      // Initially hidden
      expect(screen.queryByText('<john@example.com>')).not.toBeInTheDocument()

      // Click to show
      fireEvent.click(header!)
      expect(screen.getByText('<john@example.com>')).toBeInTheDocument()

      // Click to hide again
      fireEvent.click(header!)
      expect(screen.queryByText('<john@example.com>')).not.toBeInTheDocument()
    })

    it('toggles thread message details independently', () => {
      render(<EmailDetail {...defaultProps} email={mockEmailWithThread} />)

      const firstMessageHeader = screen.getByText('John Doe').closest('div[class*="cursor-pointer"]')
      const secondMessageHeader = screen.getByText('Jane Smith').closest('div[class*="cursor-pointer"]')

      // Click first message header
      fireEvent.click(firstMessageHeader!)
      expect(screen.getByText('<john@example.com>')).toBeInTheDocument()
      expect(screen.queryByText('<jane@example.com>')).not.toBeInTheDocument()

      // Click second message header
      fireEvent.click(secondMessageHeader!)
      expect(screen.getByText('<john@example.com>')).toBeInTheDocument()
      expect(screen.getByText('<jane@example.com>')).toBeInTheDocument()
    })
  })
}) 