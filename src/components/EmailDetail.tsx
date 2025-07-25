import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Email } from '@/types/email';
import { EmailActions } from '@/hooks/useEmailActions';

interface EmailDetailProps {
  email: Email;
  onBack: () => void;
  onToggleStar: (emailId: string, event?: React.MouseEvent) => void;
  emailActions: EmailActions;
  activeFolder?: string; // Add activeFolder prop to know current context
}

const EmailDetail: React.FC<EmailDetailProps> = ({
  email,
  onBack,
  onToggleStar,
  emailActions,
  activeFolder
}) => {
  // State to track which messages have expanded details
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());
  const [singleMessageExpanded, setSingleMessageExpanded] = useState(false);

  // Only redirect if email is deleted/trashed AND we're not currently viewing trash folder
  useEffect(() => {
    if ((email.isDeleted || email.folder === 'trash') && activeFolder !== 'trash') {
      onBack();
    }
  }, [email.isDeleted, email.folder, activeFolder, onBack]);

  const handleNotSpam = () => {
    if (email.folder === 'spam') {
      // Move email back to inbox and mark as not spam
      emailActions.restoreFromTrash(email.id);
      onBack(); // Go back to list after action
    }
  };

  const handleReportSpam = () => {
    emailActions.moveToSpam(email.id);
    onBack(); // Go back to list after reporting spam
  };

  const handleMoveToTrash = () => {
    emailActions.moveToTrash(email.id);
    onBack(); // Go back to list after moving to trash
  };

  const handleMoveToInbox = () => {
    // Move email from trash back to inbox
    emailActions.restoreFromTrash(email.id);
    onBack(); // Go back to list after restoring
  };

  const toggleMessageExpanded = (messageId: string) => {
    setExpandedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const toggleSingleMessageExpanded = () => {
    setSingleMessageExpanded(prev => !prev);
  };

  const getAvatarColor = (avatar: string) => {
    // Return different colors for different avatars
    const colorMap: { [key: string]: string } = {
      'LW': 'bg-blue-500',
      'DK': 'bg-pink-500',
      'BT': 'bg-yellow-500',
      'LL': 'bg-green-500',
      'D4': 'bg-purple-500',
      'SS': 'bg-indigo-500',
      'OC': 'bg-red-500',
      'ET': 'bg-teal-500',
      'IT': 'bg-orange-500',
      'JQ': 'bg-purple-600',
      'SP': 'bg-indigo-600'
    };
    return colorMap[avatar] || 'bg-gray-500';
  };

  return (
    <div className="mr-[56px] mb-4 flex min-w-[500px] grow flex-col rounded-2xl bg-white">
      {/* Header */}
      <div className="px-4 pt-4 pb-0">
        {email.folder === 'spam' ? (
          /* Simplified header for spam emails */
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="cursor-pointer rounded-full p-2 hover:bg-gray-100"
              title="Back"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            <button
              onClick={handleNotSpam}
              className="cursor-pointer rounded px-3 py-1.5 text-sm hover:bg-gray-100 border border-gray-300"
            >
              Not spam
            </button>
          </div>
        ) : activeFolder === 'trash' ? (
          /* Trash folder header with Move to Inbox option */
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="cursor-pointer rounded-full p-2 hover:bg-gray-100"
              title="Back"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            <button
              onClick={handleMoveToInbox}
              className="cursor-pointer rounded px-3 py-1.5 text-sm hover:bg-gray-100 border border-gray-300 flex items-center gap-2"
            >
              Move to Inbox
            </button>
          </div>
        ) : (
          /* Full toolbar for regular emails */
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={onBack}
              className="cursor-pointer rounded-full p-2 hover:bg-gray-100"
              title="Back"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            {/* Only show report spam and delete buttons if not in trash */}
            {activeFolder !== 'trash' && (
              <>
                {/* Report spam button */}
                <button
                  onClick={handleReportSpam}
                  className="cursor-pointer rounded-full p-2 hover:bg-gray-100"
                  title="Report spam"
                >
                  <Image
                    alt="Report spam"
                    src="/icon-spam.webp"
                    width={20}
                    height={20}
                    className="h-5 w-5"
                    style={{ color: 'transparent' }}
                  />
                </button>

                {/* Delete button */}
                <button
                  onClick={handleMoveToTrash}
                  className="cursor-pointer rounded-full p-2 hover:bg-gray-100"
                  title="Delete"
                >
                  <Image
                    alt="Delete"
                    src="/icon-trash.webp"
                    width={20}
                    height={20}
                    className="h-5 w-5"
                    style={{ color: 'transparent' }}
                  />
                </button>
              </>
            )}
          </div>
        )}

        {/* Subject - moved to separate container for better alignment */}
        <div>
          <h2 className="ml-[52px] text-[22px] font-normal">{email.subject}</h2>
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 overflow-y-auto">
        {email.thread && email.thread.length > 0 ? (
          /* Threaded conversation view */
          <div className="px-4 pb-5">
            {email.thread.map((message, index) => {
              const isExpanded = expandedMessages.has(message.id);
              return (
                <div key={message.id} className={`py-6 ${index < email.thread!.length - 1 ? 'border-b border-gray-200' : ''}`}>
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className={`h-10 w-10 shrink-0 rounded-full ${getAvatarColor(message.avatar)} flex items-center justify-center text-sm font-medium text-white`}>
                      {message.avatar}
                    </div>

                    <div className="w-0 flex-1 grow">
                      <div
                        className="flex items-start justify-between gap-2 cursor-pointer hover:bg-gray-50 rounded p-2 -m-2"
                        onClick={() => toggleMessageExpanded(message.id)}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="truncate text-sm font-semibold">{message.sender}</span>
                            {isExpanded && (
                              <span className="truncate text-xs text-gray-500">&lt;{message.senderEmail}&gt;</span>
                            )}
                          </div>
                          {isExpanded && (
                            <div className="truncate text-xs text-gray-600">{message.recipients}</div>
                          )}
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <div className="truncate text-xs whitespace-nowrap text-gray-500">
                            {message.timestamp}
                          </div>
                          {/* Hide star button for emails in trash */}
                          {activeFolder !== 'trash' && (
                            <button
                              className="-m-1 cursor-pointer rounded p-1 hover:bg-gray-100"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering the expand toggle
                                onToggleStar(email.id, e);
                              }}
                              title={email.isStarred ? "Remove star" : "Add star"}
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
                        </div>
                      </div>

                      {/* Message content */}
                      <div className="mt-4 text-[14px] leading-relaxed">
                        {message.content}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Single message view */
          <div className="px-4 py-5">
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className={`h-10 w-10 shrink-0 rounded-full ${getAvatarColor(email.avatar || 'D')} flex items-center justify-center text-sm font-medium text-white`}>
                {email.avatar}
              </div>

              <div className="w-0 flex-1 grow">
                <div
                  className="flex items-start justify-between gap-2 cursor-pointer hover:bg-gray-50 rounded p-2 -m-2"
                  onClick={toggleSingleMessageExpanded}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="truncate text-sm font-semibold">{email.sender}</span>
                      {singleMessageExpanded && (
                        <span className="truncate text-xs text-gray-500">&lt;{email.senderEmail}&gt;</span>
                      )}
                    </div>
                    {singleMessageExpanded && (
                      <div className="truncate text-xs text-gray-600">to you</div>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <div className="truncate text-xs whitespace-nowrap text-gray-500">
                      {email.timestamp} (40 hours ago)
                    </div>
                    {/* Hide star button for emails in trash */}
                    {activeFolder !== 'trash' && (
                      <button
                        className="-m-1 cursor-pointer rounded p-1 hover:bg-gray-100"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the expand toggle
                          onToggleStar(email.id, e);
                        }}
                        title={email.isStarred ? "Remove star" : "Add star"}
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
                  </div>
                </div>
              </div>
            </div>

            {/* Email body */}
            <div className="ml-[52px] mt-4 text-[14px] leading-relaxed">
              {email.body}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailDetail; 