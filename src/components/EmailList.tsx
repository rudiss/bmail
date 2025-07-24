import React, { memo, useMemo, useCallback } from 'react';
import EmailItem from './EmailItem';
import { Email } from '@/types/email';

interface EmailListProps {
  emails: Email[];
  selectedEmailId: string | null;
  onEmailSelect: (emailId: string) => void;
  onToggleStar: (emailId: string, event?: React.MouseEvent) => void;
  activeFolder: string;
}

// Memoize folder display names to avoid recalculation
const FOLDER_NAMES: { [key: string]: string } = {
  'inbox': 'Inbox',
  'starred': 'Starred',
  'all-mail': 'All Mail',
  'spam': 'Spam',
  'trash': 'Trash'
};

const EmailList: React.FC<EmailListProps> = memo(({
  emails,
  selectedEmailId,
  onEmailSelect,
  onToggleStar,
  activeFolder
}) => {
  // Memoize folder display name
  const folderDisplayName = useMemo(() => {
    return FOLDER_NAMES[activeFolder] || 'Inbox';
  }, [activeFolder]);

  // Memoize empty state check
  const isEmpty = useMemo(() => emails.length === 0, [emails.length]);

  // Memoize event handlers to prevent child re-renders
  const memoizedOnEmailSelect = useCallback((emailId: string) => {
    onEmailSelect(emailId);
  }, [onEmailSelect]);

  const memoizedOnToggleStar = useCallback((emailId: string, event?: React.MouseEvent) => {
    onToggleStar(emailId, event);
  }, [onToggleStar]);

  // Early return for empty state
  if (isEmpty) {
    return (
      <div className="mr-[56px] mb-4 flex min-w-[500px] grow flex-col rounded-2xl bg-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-lg mb-2">No emails in {folderDisplayName}</div>
            <div className="text-sm">This folder is empty.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mr-[56px] mb-4 flex min-w-[500px] grow flex-col rounded-2xl bg-white">
      {/* Add top padding/spacing */}
      <div className="pt-6">
        <div className="divide-y divide-gray-200">
          {emails.map((email) => (
            <EmailItem
              key={email.id}
              email={email}
              selectedEmailId={selectedEmailId}
              onEmailSelect={memoizedOnEmailSelect}
              onToggleStar={memoizedOnToggleStar}
              activeFolder={activeFolder}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

// Set display name for debugging
EmailList.displayName = 'EmailList';

export default EmailList; 