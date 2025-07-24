'use client';

import React, { useState, useCallback, useMemo, startTransition } from 'react';
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

  // Memoize expensive email filtering computation
  const filteredEmails = useMemo(() => {
    return getEmailsForFolder(activeFolder, emailActions.emails);
  }, [activeFolder, emailActions.emails]);

  // Memoize selected email lookup
  const selectedEmail = useMemo(() => {
    return selectedEmailId
      ? emailActions.emails.find((email: Email) => email.id === selectedEmailId) || null
      : null;
  }, [selectedEmailId, emailActions.emails]);

  // Memoize event handlers to prevent child component re-renders
  const handleEmailSelect = useCallback((emailId: string) => {
    // Use startTransition for non-urgent updates
    startTransition(() => {
      setSelectedEmailId(emailId);
    });
    // Mark email as read when opened (this is urgent)
    emailActions.markAsRead(emailId);
  }, [emailActions]);

  const handleBackToList = useCallback(() => {
    startTransition(() => {
      setSelectedEmailId(null);
    });
  }, []);

  const handleFolderSelect = useCallback((folderId: string) => {
    // Use startTransition for folder switching
    startTransition(() => {
      setActiveFolder(folderId);
      setSelectedEmailId(null); // Clear selection when switching folders
    });
  }, []);

  const handleToggleStar = useCallback((emailId: string, event?: React.MouseEvent) => {
    // Prevent email selection when clicking star
    if (event) {
      event.stopPropagation();
    }
    emailActions.toggleStar(emailId);
  }, [emailActions]);

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
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8A0XqFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFUooooooooooooooop//Z"
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
