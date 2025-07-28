import React, { memo, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { folders, getEmailsForFolder } from '@/data/emails';
import { Folder, Email } from '@/types/email';

interface SidebarProps {
  activeFolder: string;
  onFolderSelect: (folderId: string) => void;
  emails: Email[];
}

// Pre-compute icon mapping to avoid recreation
const ICON_MAP: { [key: string]: string } = {
  'inbox': '/icon-inbox.webp',
  'starred': '/icon-star.webp',
  'all-mail': '/icon-all-mail.webp',
  'spam': '/icon-spam.webp',
  'trash': '/icon-trash.webp'
};

// Emoji fallbacks for folders without icon files
const EMOJI_FALLBACKS: { [key: string]: string } = {
  'sent': '📤'
};

const Sidebar: React.FC<SidebarProps> = memo(({ activeFolder, onFolderSelect, emails }) => {
  // Memoize the getIconForFolder function
  const getIconForFolder = useCallback((folderId: string) => {
    const iconSrc = ICON_MAP[folderId];

    if (iconSrc) {
      return (
        <Image
          alt={folderId}
          src={iconSrc}
          width={20}
          height={20}
          className="h-5 w-5"
          style={{ color: 'transparent' }}
          loading="lazy" // Add lazy loading for performance
        />
      );
    }

    // Use emoji fallback if available
    const emoji = EMOJI_FALLBACKS[folderId];
    if (emoji) {
      return (
        <div className="h-5 w-5 flex items-center justify-center text-sm">
          {emoji}
        </div>
      );
    }

    // Default fallback
    return <div className="h-5 w-5 bg-gray-300 rounded"></div>;
  }, []);

  // Memoize folder counts calculation (only for inbox and spam)
  const folderCounts = useMemo(() => {
    const counts: { [key: string]: number | undefined } = {};

    // Inbox: count unread emails only
    const inboxEmails = getEmailsForFolder('inbox', emails);
    const unreadInboxCount = inboxEmails.filter(email => !email.isRead).length;
    counts['inbox'] = unreadInboxCount > 0 ? unreadInboxCount : undefined;

    // Spam: count total emails
    const spamEmails = getEmailsForFolder('spam', emails);
    const spamCount = spamEmails.length;
    counts['spam'] = spamCount > 0 ? spamCount : undefined;

    return counts;
  }, [emails]);

  // Memoize the compose handler
  const handleCompose = useCallback(() => {
    // TODO: Implement compose email functionality
    console.log('Compose email clicked');
  }, []);

  // Memoize folder select handler
  const handleFolderSelect = useCallback((folderId: string) => () => {
    onFolderSelect(folderId);
  }, [onFolderSelect]);

  return (
    <div className="w-[256px] shrink-0 px-3 text-sm">
      {/* Compose Button */}
      <div className="mb-4">
        <button
          onClick={handleCompose}
          className="h-[56px] w-[138px] rounded-2xl bg-[rgb(194,231,255)] hover:bg-[rgb(174,211,235)] transition-colors flex items-center justify-center gap-3 px-6 shadow-sm"
        >
        </button>
      </div>

      {/* Navigation Items */}
      {folders.map((folder: Folder) => {
        const dynamicCount = folderCounts[folder.id];
        const isActive = activeFolder === folder.id;

        return (
          <div
            key={folder.id}
            onClick={handleFolderSelect(folder.id)}
            className={`flex cursor-pointer items-center gap-4 rounded-full py-1.5 pr-3 pl-4 ${isActive
              ? 'bg-[rgb(211,227,253)] font-semibold text-[rgb(32,33,36)]'
              : 'hover:bg-[oklch(0.928_0.006_264.531)]'
              }`}
          >
            {getIconForFolder(folder.id)}
            <span className="flex-1">{folder.name}</span>
            {dynamicCount && (
              <span className="text-xs font-normal">{dynamicCount}</span>
            )}
          </div>
        );
      })}
    </div>
  );
});

// Set display name for debugging
Sidebar.displayName = 'Sidebar';

export default Sidebar; 