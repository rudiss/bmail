import React from 'react';
import Image from 'next/image';
import { folders, getEmailsForFolder } from '@/data/emails';
import { Folder, Email } from '@/types/email';

interface SidebarProps {
  activeFolder: string;
  onFolderSelect: (folderId: string) => void;
  emails: Email[];
}

const Sidebar: React.FC<SidebarProps> = ({ activeFolder, onFolderSelect, emails }) => {
  const getIconForFolder = (folderId: string) => {
    const iconMap: { [key: string]: string } = {
      'inbox': '/icon-inbox.webp',
      'starred': '/icon-star.webp',
      'all-mail': '/icon-all-mail.webp',
      'spam': '/icon-spam.webp',
      'trash': '/icon-trash.webp'
    };

    const iconSrc = iconMap[folderId];
    if (!iconSrc) return <div className="h-5 w-5 bg-gray-300 rounded"></div>;

    return (
      <Image
        alt={folderId}
        src={iconSrc}
        width={20}
        height={20}
        className="h-5 w-5"
        style={{ color: 'transparent' }}
      />
    );
  };

  // Calculate dynamic counts only for inbox and spam folders
  const getFolderCount = (folderId: string) => {
    // Only show counts for inbox and spam
    if (folderId !== 'inbox' && folderId !== 'spam') {
      return undefined;
    }

    const emailsInFolder = getEmailsForFolder(folderId, emails);
    const count = emailsInFolder.length;
    return count > 0 ? count : undefined;
  };

  const handleCompose = () => {
    // TODO: Implement compose email functionality
    console.log('Compose email clicked');
  };

  return (
    <div className="w-[256px] shrink-0 px-3 text-sm">
      {/* Compose Button */}
      <div className="mb-4">
        <button
          onClick={handleCompose}
          className="mb-4 h-[56px] w-[138px] rounded-2xl bg-[rgb(194,231,255)] opacity-50"
        >

        </button>
      </div>

      {/* Navigation Items */}
      {folders.map((folder: Folder) => {
        const dynamicCount = getFolderCount(folder.id);

        return (
          <div
            key={folder.id}
            onClick={() => onFolderSelect(folder.id)}
            className={`flex cursor-pointer items-center gap-4 rounded-full py-1.5 pr-3 pl-4 ${activeFolder === folder.id
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
};

export default Sidebar; 