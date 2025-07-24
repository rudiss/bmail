import { Email, Folder } from '@/types/email';

export const folders: Folder[] = [
  { id: 'inbox', name: 'Inbox', count: 7, icon: '📥' },
  { id: 'starred', name: 'Starred', count: 2, icon: '⭐' },
  { id: 'all-mail', name: 'All Mail', count: 8, icon: '📧' },
  { id: 'spam', name: 'Spam', count: 1, icon: '⚠️' },
  { id: 'trash', name: 'Trash', count: 1, icon: '🗑️' },
];

export const initialEmails: Email[] = [
  {
    id: '1',
    sender: 'LinkedIn Writer',
    senderEmail: 'writer@linkedin.com',
    subject: 'Your guide to making the perfect LinkedIn post',
    preview: 'Stand out and be heard with these expert tips.',
    body: 'Here are some expert tips on how to craft the perfect LinkedIn post that will help you stand out in your network and get your message heard by the right people.',
    timestamp: 'Mar 12',
    isStarred: false,
    isRead: false,
    avatar: 'LW',
    folder: 'inbox'
  },
  {
    id: '2',
    sender: 'Duolingo Korean',
    senderEmail: 'duolingo@duolingo.com',
    subject: '🔥 Stretch your streak to 7 days',
    preview: 'Your streak is on the line: finish this lesson and unlock a new achievement',
    body: 'Your Korean learning streak is heating up! Don\'t let it cool down - complete today\'s lesson to keep your 6-day streak alive and unlock new achievements.',
    timestamp: 'Mar 12',
    isStarred: true,
    isRead: false,
    avatar: 'DK',
    folder: 'inbox'
  },
  {
    id: '3',
    sender: 'Better Team',
    senderEmail: 'team@better.com',
    subject: 'Your home-buying checklist',
    preview: '6 essential steps for every home buyer',
    body: 'Buying a home can be overwhelming, but with the right checklist, you can navigate the process with confidence. Here are 6 essential steps every home buyer should follow.',
    timestamp: 'Mar 12',
    isStarred: false,
    isRead: true,
    avatar: 'BT',
    folder: 'inbox'
  },
  {
    id: '4',
    sender: 'Lulu Lemon',
    senderEmail: 'offers@lululemon.com',
    subject: 'Back in stock: your wishlist items',
    preview: 'Your favorites are waiting for you',
    body: 'Great news! Some of your wishlist items are back in stock and ready to ship. Don\'t wait too long - popular items tend to sell out quickly.',
    timestamp: 'Mar 12',
    isStarred: false,
    isRead: true,
    avatar: 'LL',
    folder: 'inbox'
  },
  {
    id: '5',
    sender: 'Design 4 Drupal',
    senderEmail: 'info@design4drupal.com',
    subject: 'Register for our biggest event yet',
    preview: 'Join the Drupal community at our annual conference',
    body: 'Join us for the biggest Drupal event of the year! Connect with fellow developers, learn about the latest updates, and participate in hands-on workshops.',
    timestamp: 'Mar 11',
    isStarred: false,
    isRead: true,
    avatar: 'D4',
    folder: 'inbox'
  },
  {
    id: '6',
    sender: 'SkyScanner',
    senderEmail: 'deals@skyscanner.com',
    subject: 'Fly for less: Tokyo flights from $924',
    preview: 'Book now and save on your next adventure',
    body: 'Amazing flight deals to Tokyo are available now! Starting from just $924, these prices won\'t last long. Book your next adventure today and save big.',
    timestamp: 'Mar 11',
    isStarred: true,
    isRead: false,
    avatar: 'SS',
    folder: 'inbox'
  },
  {
    id: '7',
    sender: 'John Qian',
    senderEmail: 'john.qian@techcorp.com',
    subject: 'Q1 Project Update - Please Review',
    preview: 'Hi team, here\'s the latest update on our Q1 project milestones...',
    body: 'Hi team, I wanted to share the latest update on our Q1 project milestones. We\'ve made significant progress and I\'d love to get your feedback.',
    timestamp: 'Mar 10',
    isStarred: false,
    isRead: true,
    avatar: 'JQ',
    folder: 'inbox',
    thread: [
      {
        id: '7-1',
        sender: 'John Qian',
        senderEmail: 'john.qian@techcorp.com',
        content: 'Hi team, I wanted to share the latest update on our Q1 project milestones. We\'ve made significant progress and I\'d love to get your feedback on the current direction.',
        timestamp: 'Wed, Mar 12, 2:00 PM (26 hours ago)',
        avatar: 'JQ',
        recipients: 'to you, Sarah, Mike'
      },
      {
        id: '7-2',
        sender: 'John Qian',
        senderEmail: 'john.qian@techcorp.com',
        content: 'Also, please let me know if you have any concerns about the timeline. We want to make sure we\'re all aligned before moving forward.',
        timestamp: 'Wed, Mar 12, 4:15 PM (24 hours ago)',
        avatar: 'JQ',
        recipients: 'to you, Sarah, Mike'
      }
    ]
  },
  {
    id: '8',
    sender: 'Office Calendar',
    senderEmail: 'calendar@company.com',
    subject: 'Meeting reminder: Team standup',
    preview: 'Daily standup meeting starts in 15 minutes',
    body: 'This is a reminder that your daily team standup meeting starts in 15 minutes. Please make sure to have your updates ready to share with the team.',
    timestamp: 'Mar 10',
    isStarred: false,
    isRead: true,
    avatar: 'OC',
    folder: 'spam'
  },
  {
    id: '9',
    sender: 'Sam Parker, you',
    senderEmail: 'sam.parker@company.com',
    subject: 'Re: Lunch tomorrow?',
    preview: 'Sure! How about that new sushi place on Main Street?',
    body: 'Sure! How about that new sushi place on Main Street? I heard they have great reviews and it\'s not too far from the office. What time works for you?',
    timestamp: 'Mar 12',
    isStarred: false,
    isRead: true,
    avatar: 'SP',
    folder: 'trash'
  }
];

// Cache for getEmailsForFolder results to avoid redundant filtering
const folderCache = new Map<string, Email[]>();
let lastEmailsHash = '';

// Helper function to create a simple hash of emails array
function createEmailsHash(emails: Email[]): string {
  return emails.map(e => `${e.id}-${e.folder}-${e.isDeleted}-${e.isStarred}`).join('|');
}

export const getEmailsForFolder = (folderId: string, emails: Email[]): Email[] => {
  const emailsHash = createEmailsHash(emails);
  const cacheKey = `${folderId}-${emailsHash}`;

  // Check if we have a cached result and emails haven't changed
  if (folderCache.has(cacheKey) && lastEmailsHash === emailsHash) {
    return folderCache.get(cacheKey)!;
  }

  // Clear cache if emails changed
  if (lastEmailsHash !== emailsHash) {
    folderCache.clear();
    lastEmailsHash = emailsHash;
  }

  let result: Email[];

  switch (folderId) {
    case 'inbox':
      result = emails.filter(email => email.folder === 'inbox' && !email.isDeleted);
      break;
    case 'starred':
      result = emails.filter(email => email.isStarred && !email.isDeleted && email.folder !== 'trash');
      break;
    case 'all-mail':
      result = emails.filter(email => !email.isDeleted && email.folder !== 'trash');
      break;
    case 'spam':
      result = emails.filter(email => email.folder === 'spam');
      break;
    case 'trash':
      result = emails.filter(email => email.folder === 'trash' || email.isDeleted);
      break;
    default:
      result = emails.filter(email => email.folder === 'inbox' && !email.isDeleted);
  }

  // Cache the result
  folderCache.set(cacheKey, result);

  return result;
}; 