import React, { memo, useMemo } from 'react';
import Image from 'next/image';
import { Email } from '@/types/email';

interface EmailItemProps {
  email: Email;
  selectedEmailId: string | null;
  onEmailSelect: (emailId: string) => void;
  onToggleStar: (emailId: string, event?: React.MouseEvent) => void;
  activeFolder: string;
}

const EmailItem: React.FC<EmailItemProps> = memo(({
  email,
  selectedEmailId,
  onEmailSelect,
  onToggleStar,
  activeFolder
}) => {
  // Memoize expensive computations
  const isSelected = useMemo(() => selectedEmailId === email.id, [selectedEmailId, email.id]);
  const showStar = useMemo(() => activeFolder !== 'trash', [activeFolder]);
  const threadCount = useMemo(() => email.thread?.length || 0, [email.thread]);

  // Memoize styling classes to prevent recalculation
  const containerClasses = useMemo(() => {
    let classes = "flex items-center px-4 py-3 hover:shadow-sm cursor-pointer transition-all ";
    if (isSelected) {
      classes += "bg-blue-50";
    } else if (!email.isRead) {
      classes += "bg-white";
    } else {
      classes += "bg-gray-50";
    }
    return classes;
  }, [isSelected, email.isRead]);

  const senderClasses = useMemo(() => {
    return `text-sm ${!email.isRead ? 'font-semibold text-black' : 'text-gray-900'} whitespace-nowrap`;
  }, [email.isRead]);

  const subjectClasses = useMemo(() => {
    return `text-sm whitespace-nowrap flex-shrink-0 ${!email.isRead ? 'font-bold text-black' : 'text-gray-700'
      }`;
  }, [email.isRead]);

  const contentClasses = useMemo(() => {
    return `flex-1 min-w-0 flex items-center justify-between ${activeFolder === 'trash' ? 'ml-0' : ''}`;
  }, [activeFolder]);

  // Memoize star icon path
  const starIconSrc = useMemo(() => {
    return email.isStarred ? "/icon-star-filled-yellow.webp" : "/icon-star.webp";
  }, [email.isStarred]);

  // Memoize click handlers to prevent recreation on every render
  const handleEmailClick = useMemo(() => () => {
    onEmailSelect(email.id);
  }, [onEmailSelect, email.id]);

  const handleStarClick = useMemo(() => (e: React.MouseEvent) => {
    onToggleStar(email.id, e);
  }, [onToggleStar, email.id]);

  return (
    <div
      onClick={handleEmailClick}
      className={containerClasses}
    >
      <div className="flex items-center w-full min-w-0">
        {/* Star - hide for trash folder */}
        {showStar && (
          <button
            className="flex-shrink-0 text-gray-400 hover:text-yellow-400 transition-colors mr-4"
            onClick={handleStarClick}
          >
            <Image
              alt="Star"
              src={starIconSrc}
              width={20}
              height={20}
              className="h-5 w-5"
              style={{ color: 'transparent' }}
            />
          </button>
        )}

        {/* Email Content */}
        <div className={contentClasses}>
          <div className="flex-1 min-w-0 flex items-baseline">
            {/* Sender name with thread count */}
            <div className="w-48 mr-4 flex-shrink-0">
              <span className={senderClasses}>
                {email.sender}
                {threadCount > 0 && (
                  <span className="text-gray-500 font-normal ml-1">
                    ({threadCount})
                  </span>
                )}
              </span>
            </div>

            {/* Subject and preview container */}
            <div className="flex-1 min-w-0 flex items-baseline space-x-2">
              {/* Subject - bold when unread */}
              <span className={subjectClasses}>
                {email.subject}
              </span>

              {/* Separator */}
              <span className="text-gray-500 text-sm flex-shrink-0">-</span>

              {/* Preview text */}
              <span className="text-gray-500 text-sm truncate flex-1 min-w-0">
                {email.preview}
              </span>
            </div>
          </div>

          {/* Timestamp */}
          <div className="flex-shrink-0 ml-4">
            <span className="text-gray-500 text-sm whitespace-nowrap">
              {email.timestamp}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

// Set display name for debugging
EmailItem.displayName = 'EmailItem';

export default EmailItem; 