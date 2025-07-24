import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import EmailItem from '../EmailItem'
import { Email } from '@/types/email'

const mockEmail: Email = {
  id: '1',
  sender: 'John Doe',
  senderEmail: 'john@example.com',
  subject: 'Test Subject',
  preview: 'This is a test email preview that might be very long and should be truncated',
  body: 'This is the body of the test email',
  timestamp: '10:00 AM',
  isStarred: false,
  isRead: true,
  avatar: 'JD',
  folder: 'inbox'
}

const mockEmailWithThread: Email = {
  ...mockEmail,
  id: '2',
  sender: 'Jane Smith',
  thread: [
    {
      id: '2-1',
      sender: 'Jane Smith',
      senderEmail: 'jane@example.com',
      content: 'First message',
      timestamp: 'Yesterday',
      avatar: 'JS',
      recipients: 'to you'
    },
    {
      id: '2-2',
      sender: 'John Doe',
      senderEmail: 'john@example.com',
      content: 'Reply message',
      timestamp: 'Today',
      avatar: 'JD',
      recipients: 'to Jane Smith'
    }
  ]
}

const defaultProps = {
  email: mockEmail,
  selectedEmailId: null,
  onEmailSelect: jest.fn(),
  onToggleStar: jest.fn(),
  activeFolder: 'inbox'
}

describe('EmailItem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders email content correctly', () => {
      render(<EmailItem {...defaultProps} />)

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Test Subject')).toBeInTheDocument()
      expect(screen.getByText('This is a test email preview that might be very long and should be truncated')).toBeInTheDocument()
      expect(screen.getByText('10:00 AM')).toBeInTheDocument()
    })

    it('renders thread count when email has threads', () => {
      render(<EmailItem {...defaultProps} email={mockEmailWithThread} />)

      expect(screen.getByText('(2)')).toBeInTheDocument()
    })

    it('does not render thread count when email has no threads', () => {
      render(<EmailItem {...defaultProps} />)

      expect(screen.queryByText(/\(\d+\)/)).not.toBeInTheDocument()
    })

    it('shows star button for non-trash folders', () => {
      render(<EmailItem {...defaultProps} />)

      expect(screen.getByAltText('Star')).toBeInTheDocument()
    })

    it('hides star button for trash folder', () => {
      render(<EmailItem {...defaultProps} activeFolder="trash" />)

      expect(screen.queryByAltText('Star')).not.toBeInTheDocument()
    })
  })

  describe('Email States', () => {
    it('applies unread styling for unread emails', () => {
      const unreadEmail = { ...mockEmail, isRead: false }
      render(<EmailItem {...defaultProps} email={unreadEmail} />)

      const senderElement = screen.getByText('John Doe')
      expect(senderElement).toHaveClass('font-semibold', 'text-black')

      const subjectElement = screen.getByText('Test Subject')
      expect(subjectElement).toHaveClass('font-bold', 'text-black')
    })

    it('applies read styling for read emails', () => {
      render(<EmailItem {...defaultProps} />)

      const senderElement = screen.getByText('John Doe')
      expect(senderElement).toHaveClass('text-gray-900')
      expect(senderElement).not.toHaveClass('font-semibold')

      const subjectElement = screen.getByText('Test Subject')
      expect(subjectElement).toHaveClass('text-gray-700')
      expect(subjectElement).not.toHaveClass('font-bold')
    })

    it('shows filled star for starred emails', () => {
      const starredEmail = { ...mockEmail, isStarred: true }
      render(<EmailItem {...defaultProps} email={starredEmail} />)

      const starImage = screen.getByAltText('Star')
      expect(starImage).toHaveAttribute('src', '/icon-star-filled-yellow.webp')
    })

    it('shows empty star for unstarred emails', () => {
      render(<EmailItem {...defaultProps} />)

      const starImage = screen.getByAltText('Star')
      expect(starImage).toHaveAttribute('src', '/icon-star.webp')
    })

    it('applies selected styling when email is selected', () => {
      const { container } = render(<EmailItem {...defaultProps} selectedEmailId="1" />)

      const emailDiv = container.firstChild
      expect(emailDiv).toHaveClass('bg-blue-50')
    })
  })

  describe('Interactions', () => {
    it('calls onEmailSelect when email is clicked', () => {
      const mockOnEmailSelect = jest.fn()
      render(<EmailItem {...defaultProps} onEmailSelect={mockOnEmailSelect} />)

      const emailDiv = screen.getByText('John Doe').closest('div')
      fireEvent.click(emailDiv!)

      expect(mockOnEmailSelect).toHaveBeenCalledWith('1')
    })

    it('calls onToggleStar when star is clicked', () => {
      const mockOnToggleStar = jest.fn()
      render(<EmailItem {...defaultProps} onToggleStar={mockOnToggleStar} />)

      const starButton = screen.getByAltText('Star').closest('button')
      fireEvent.click(starButton!)

      expect(mockOnToggleStar).toHaveBeenCalledWith('1', expect.any(Object))
    })

    it('prevents email selection when star is clicked', () => {
      const mockOnEmailSelect = jest.fn()
      const mockOnToggleStar = jest.fn((emailId, event) => {
        // Mock the stopPropagation behavior like in the real handleToggleStar
        if (event) {
          event.stopPropagation()
        }
      })

      render(
        <EmailItem
          {...defaultProps}
          onEmailSelect={mockOnEmailSelect}
          onToggleStar={mockOnToggleStar}
        />
      )

      const starButton = screen.getByAltText('Star').closest('button')
      fireEvent.click(starButton!)

      // onToggleStar should be called
      expect(mockOnToggleStar).toHaveBeenCalled()
      // onEmailSelect should not be called when clicking star (due to stopPropagation)
      expect(mockOnEmailSelect).not.toHaveBeenCalled()
    })
  })

  describe('Folder-specific behavior', () => {
    it('adjusts content margin for trash folder', () => {
      const { container } = render(<EmailItem {...defaultProps} activeFolder="trash" />)

      const contentDiv = container.querySelector('.ml-0')
      expect(contentDiv).toBeInTheDocument()
    })

    it('maintains normal margin for non-trash folders', () => {
      const { container } = render(<EmailItem {...defaultProps} activeFolder="inbox" />)

      const contentDiv = container.querySelector('.ml-0')
      expect(contentDiv).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper hover states', () => {
      const { container } = render(<EmailItem {...defaultProps} />)

      const emailDiv = container.firstChild
      expect(emailDiv).toHaveClass('hover:shadow-sm', 'cursor-pointer')
    })

    it('has proper transition effects', () => {
      const { container } = render(<EmailItem {...defaultProps} />)

      const emailDiv = container.firstChild
      expect(emailDiv).toHaveClass('transition-all')
    })
  })
}) 