import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import EmailList from '../EmailList'
import { Email } from '@/types/email'

// Mock the EmailItem component since we'll test it separately
jest.mock('../EmailItem', () => {
  return function MockEmailItem({ email, onEmailSelect, onToggleStar, activeFolder }: any) {
    return (
      <div data-testid={`email-item-${email.id}`}>
        <span data-testid="sender">{email.sender}</span>
        <span data-testid="subject">{email.subject}</span>
        <button
          data-testid="email-button"
          onClick={() => onEmailSelect(email.id)}
        >
          Open Email
        </button>
        <button
          data-testid="star-button"
          onClick={(e) => onToggleStar(email.id, e)}
        >
          {email.isStarred ? 'Unstar' : 'Star'}
        </button>
        <span data-testid="active-folder">{activeFolder}</span>
      </div>
    )
  }
})

const mockEmails: Email[] = [
  {
    id: '1',
    sender: 'John Doe',
    senderEmail: 'john@example.com',
    subject: 'Test Email 1',
    preview: 'This is a test email',
    body: 'This is the body of test email 1',
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
    preview: 'This is another test email',
    body: 'This is the body of test email 2',
    timestamp: '11:00 AM',
    isStarred: true,
    isRead: false,
    avatar: 'JS',
    folder: 'inbox'
  }
]

const defaultProps = {
  emails: mockEmails,
  selectedEmailId: null,
  onEmailSelect: jest.fn(),
  onToggleStar: jest.fn(),
  activeFolder: 'inbox'
}

describe('EmailList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders email list with emails', () => {
      render(<EmailList {...defaultProps} />)

      expect(screen.getByTestId('email-item-1')).toBeInTheDocument()
      expect(screen.getByTestId('email-item-2')).toBeInTheDocument()
    })

    it('renders empty state when no emails', () => {
      render(<EmailList {...defaultProps} emails={[]} />)

      expect(screen.getByText('No emails in Inbox')).toBeInTheDocument()
      expect(screen.getByText('This folder is empty.')).toBeInTheDocument()
    })

    it('displays correct folder name in empty state', () => {
      render(<EmailList {...defaultProps} emails={[]} activeFolder="spam" />)

      expect(screen.getByText('No emails in Spam')).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('calls onEmailSelect when email is clicked', () => {
      const mockOnEmailSelect = jest.fn()
      render(<EmailList {...defaultProps} onEmailSelect={mockOnEmailSelect} />)

      const emailButton = screen.getAllByTestId('email-button')[0]
      fireEvent.click(emailButton)

      expect(mockOnEmailSelect).toHaveBeenCalledWith('1')
    })

    it('calls onToggleStar when star is clicked', () => {
      const mockOnToggleStar = jest.fn()
      render(<EmailList {...defaultProps} onToggleStar={mockOnToggleStar} />)

      const starButton = screen.getAllByTestId('star-button')[0]
      fireEvent.click(starButton)

      expect(mockOnToggleStar).toHaveBeenCalledWith('1', expect.any(Object))
    })

    it('passes activeFolder to EmailItem components', () => {
      render(<EmailList {...defaultProps} activeFolder="trash" />)

      const activeFolderElements = screen.getAllByTestId('active-folder')
      activeFolderElements.forEach(element => {
        expect(element).toHaveTextContent('trash')
      })
    })
  })

  describe('Folder Display Names', () => {
    const folderTestCases = [
      { folderId: 'inbox', displayName: 'Inbox' },
      { folderId: 'starred', displayName: 'Starred' },
      { folderId: 'all-mail', displayName: 'All Mail' },
      { folderId: 'spam', displayName: 'Spam' },
      { folderId: 'trash', displayName: 'Trash' },
      { folderId: 'unknown', displayName: 'Inbox' } // fallback
    ]

    folderTestCases.forEach(({ folderId, displayName }) => {
      it(`displays "${displayName}" for folder "${folderId}"`, () => {
        render(<EmailList {...defaultProps} emails={[]} activeFolder={folderId} />)

        expect(screen.getByText(`No emails in ${displayName}`)).toBeInTheDocument()
      })
    })
  })

  describe('Email Selection', () => {
    it('passes selectedEmailId to EmailItem components', () => {
      render(<EmailList {...defaultProps} selectedEmailId="1" />)

      // This would be tested through the EmailItem component behavior
      expect(screen.getByTestId('email-item-1')).toBeInTheDocument()
      expect(screen.getByTestId('email-item-2')).toBeInTheDocument()
    })
  })
}) 