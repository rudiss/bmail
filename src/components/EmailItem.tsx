import React from 'react';
import Image from 'next/image';
import { Email } from '@/types/email';

interface EmailItemProps {
  email: Email;
  selectedEmailId: string | null;
  onEmailSelect: (emailId: string) => void;
  onToggleStar: (emailId: string, event?: React.MouseEvent) => void;
  activeFolder: string;
}

const EmailItem: React.FC<EmailItemProps> = ({
  email,
  selectedEmailId,
  onEmailSelect,
  onToggleStar,
  activeFolder
}) => {
  return (
    <div
      key={email.id}
      onClick={() => onEmailSelect(email.id)}
      className={`flex items-center px-4 py-3 hover:shadow-sm cursor-pointer transition-all ${selectedEmailId === email.id ? 'bg-blue-50' :
          !email.isRead ? 'bg-white' : 'bg-gray-50'
        }`}
    >
      <div className="flex items-center w-full min-w-0">
        {/* Star - hide for trash folder */}
        {activeFolder !== 'trash' && (
          <button
            className="flex-shrink-0 text-gray-400 hover:text-yellow-400 transition-colors mr-4"
            onClick={(e) => onToggleStar(email.id, e)}
          >
            <Image
              alt="Star"
              src={email.isStarred ? "/icon-star-filled-yellow.webp" : "/icon-star.webp"}
              width={20}
              height={20}
              className="h-5 w-5"
              style={{ color: 'transparent' }}
            />
          </button>
        )}

        {/* Email Content */}
        <div className={`flex-1 min-w-0 flex items-center justify-between ${activeFolder === 'trash' ? 'ml-0' : ''}`}>
          <div className="flex-1 min-w-0 flex items-baseline">
            {/* Sender name with thread count */}
            <div className="w-48 mr-4 flex-shrink-0">
              <span className={`text-sm ${!email.isRead ? 'font-semibold text-black' : 'text-gray-900'} whitespace-nowrap`}>
                {email.sender}
                {email.thread && email.thread.length > 0 && (
                  <span className="text-gray-500 font-normal ml-1">
                    ({email.thread.length})
                  </span>
                )}
              </span>
            </div>

            {/* Subject and preview container */}
            <div className="flex-1 min-w-0 flex items-baseline space-x-2">
              {/* Subject - bold when unread */}
              <span className={`text-sm whitespace-nowrap flex-shrink-0 ${!email.isRead ? 'font-bold text-black' : 'text-gray-700'
                }`}>
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
};

export default EmailItem; 