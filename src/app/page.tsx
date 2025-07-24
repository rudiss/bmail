'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import EmailList from '@/components/EmailList';
import EmailDetail from '@/components/EmailDetail';
import { initialEmails, getEmailsForFolder } from '@/data/emails';
import { useEmailActions } from '@/hooks/useEmailActions';
import { Email } from '@/types/email';

export default function Home() {
  const [activeFolder, setActiveFolder] = useState('inbox'); // Set to 'inbox' by default
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

  // Use the email actions hook
  const emailActions = useEmailActions(initialEmails);

  // Filter emails based on active folder
  const filteredEmails = getEmailsForFolder(activeFolder, emailActions.emails);

  const selectedEmail = selectedEmailId
    ? emailActions.emails.find((email: Email) => email.id === selectedEmailId)
    : null;

  const handleEmailSelect = (emailId: string) => {
    setSelectedEmailId(emailId);
    // Mark email as read when opened
    emailActions.markAsRead(emailId);
  };

  const handleBackToList = () => {
    setSelectedEmailId(null);
  };

  const handleFolderSelect = (folderId: string) => {
    setActiveFolder(folderId);
    setSelectedEmailId(null); // Clear selection when switching folders
  };

  const handleToggleStar = (emailId: string, event?: React.MouseEvent) => {
    // Prevent email selection when clicking star
    if (event) {
      event.stopPropagation();
    }
    emailActions.toggleStar(emailId);
  };

  return (
    <div className="flex min-h-screen grow flex-col bg-[rgb(248,250,253)]">
      {/* Header */}
      <div className="h-16 px-4 py-2">
        <div className="relative h-[32px] w-[138px] overflow-hidden rounded">
          <Image
            alt="BMail"
            src="/bmail-logo.webp"
            width={109}
            height={40}
            style={{
              color: 'transparent',
              objectFit: 'cover',
              objectPosition: 'center',
              width: '109px',
              height: '40px'
            }}
            priority
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex grow">
        <Sidebar
          activeFolder={activeFolder}
          onFolderSelect={handleFolderSelect}
          emails={emailActions.emails}
        />

        {/* Email Content Container */}
        {selectedEmail ? (
          <EmailDetail
            email={selectedEmail}
            onBack={handleBackToList}
            onToggleStar={handleToggleStar}
            emailActions={emailActions}
            activeFolder={activeFolder}
          />
        ) : (
          <EmailList
            emails={filteredEmails}
            selectedEmailId={selectedEmailId}
            onEmailSelect={handleEmailSelect}
            onToggleStar={handleToggleStar}
            activeFolder={activeFolder}
          />
        )}
      </div>
    </div>
  );
}
