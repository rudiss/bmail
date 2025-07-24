import React from 'react';
import EmailItem from './EmailItem';
import { Email } from '@/types/email';

interface EmailListProps {
  emails: Email[];
  selectedEmailId: string | null;
  onEmailSelect: (emailId: string) => void;
  onToggleStar: (emailId: string, event?: React.MouseEvent) => void;
  activeFolder: string;
}

const EmailList: React.FC<EmailListProps> = ({
  emails,
  selectedEmailId,
  onEmailSelect,
  onToggleStar,
  activeFolder
}) => {
  const getFolderDisplayName = (folderId: string) => {
    const folderNames: { [key: string]: string } = {
      'inbox': 'Inbox',
      'starred': 'Starred',
      'all-mail': 'All Mail',
      'spam': 'Spam',
      'trash': 'Trash'
    };
    return folderNames[folderId] || 'Inbox';
  };

  if (emails.length === 0) {
    return (
      <div className="mr-[56px] mb-4 flex min-w-[500px] grow flex-col rounded-2xl bg-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-lg mb-2">No emails in {getFolderDisplayName(activeFolder)}</div>
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
              onEmailSelect={onEmailSelect}
              onToggleStar={onToggleStar}
              activeFolder={activeFolder}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmailList; 