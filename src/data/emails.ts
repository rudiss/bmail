import { Email, Folder } from '@/types/email';

export const folders: Folder[] = [
  { id: 'inbox', name: 'Inbox', count: 2, icon: '📥' },
  { id: 'starred', name: 'Starred', count: 3, icon: '⭐' },
  { id: 'all-mail', name: 'All Mail', count: 11, icon: '📧' },
  { id: 'spam', name: 'Spam', count: 1, icon: '⚠️' },
  { id: 'trash', name: 'Trash', count: 1, icon: '🗑️' },
  { id: 'sent', name: 'Sent', count: 3, icon: '📤' },
];

export const initialEmails: Email[] = [
  {
    id: '1',
    sender: 'BMail Team',
    senderEmail: 'noreply@bmail.com',
    subject: 'Welcome to BMail',
    preview: 'Welcome to BMail! Your account is all set up and ready to go. Start exploring our features.',
    body: 'Welcome to BMail! Your account is all set up and ready to go. Start exploring our features.',
    timestamp: '9:15 AM',
    isStarred: true,
    isRead: true,
    avatar: 'BT',
    folder: 'inbox'
  },
  {
    id: '2',
    sender: 'David Kim, Lisa Wang',
    senderEmail: 'david.kim@company.com',
    subject: 'Re: Project deadline reminder',
    preview: 'Thanks Lisa! I\'ll have my section ready by Thursday afternoon.',
    body: 'Thanks Lisa! I\'ll have my section ready by Thursday afternoon.',
    timestamp: 'Mar 13',
    isStarred: false,
    isRead: false,
    avatar: 'DK',
    folder: 'inbox',
    thread: [
      {
        id: '2-1',
        sender: 'Lisa Wang',
        senderEmail: 'lisa.wang@company.com',
        content: 'Hi team, just a reminder that our project deadline is this Friday. Please submit your final reports.',
        timestamp: 'Wed, Mar 13, 2:30 PM (24 hours ago)',
        avatar: 'LW',
        recipients: 'to you, David Kim',
        isStarred: false
      },
      {
        id: '2-2',
        sender: 'David Kim',
        senderEmail: 'david.kim@company.com',
        content: 'Thanks Lisa! I\'ll have my section ready by Thursday afternoon.',
        timestamp: 'Wed, Mar 13, 4:20 PM (22 hours ago)',
        avatar: 'DK',
        recipients: 'to Lisa Wang, you',
        isStarred: false
      }
    ]
  },
  {
    id: '3',
    sender: 'Local Library',
    senderEmail: 'newsletter@locallibrary.org',
    subject: 'Monthly newsletter',
    preview: 'Check out our new arrivals and upcoming events this month at your local library.',
    body: 'Check out our new arrivals and upcoming events this month at your local library.',
    timestamp: 'Mar 13',
    isStarred: false,
    isRead: true,
    avatar: 'LL',
    folder: 'inbox'
  },
  {
    id: '8',
    sender: 'Deals4U',
    senderEmail: 'no-reply@deals4u.biz',
    subject: 'Free iPhone 15 - Act Now!',
    preview: 'You\'ve been selected to receive a FREE iPhone 15! Just pay shipping. Limited time offer!!!',
    body: 'You\'ve been selected to receive a FREE iPhone 15! Just pay shipping. Limited time offer!!!',
    timestamp: 'Mar 12',
    isStarred: false,
    isRead: false,
    avatar: 'D4',
    folder: 'spam'
  },
  {
    id: '4',
    sender: 'StreamingService',
    senderEmail: 'account@streamingservice.com',
    subject: 'Your subscription is expiring',
    preview: 'Your monthly subscription will expire in 3 days. Renew now to continue enjoying our content.',
    body: 'Your monthly subscription will expire in 3 days. Renew now to continue enjoying our content.',
    timestamp: 'Mar 12',
    isStarred: false,
    isRead: true,
    avatar: 'SS',
    folder: 'inbox'
  },
  {
    id: '5',
    sender: 'Outdoor Club',
    senderEmail: 'events@outdoorclub.org',
    subject: 'Weekend hiking trip',
    preview: 'Join us this Saturday for a scenic hike at Blue Mountain Trail. All skill levels welcome!',
    body: 'Join us this Saturday for a scenic hike at Blue Mountain Trail. All skill levels welcome!',
    timestamp: 'Mar 12',
    isStarred: true,
    isRead: false,
    avatar: 'OC',
    folder: 'inbox'
  },
  {
    id: '6',
    sender: 'Emma Thompson, you',
    senderEmail: 'emma.thompson@company.com',
    subject: 'Re: Coffee catch-up?',
    preview: 'Absolutely! I\'d love to catch up. How about Thursday afternoon around 3 PM? There\'s a nice new cafe on 5th Street called Brew & Beans.',
    body: 'Absolutely! I\'d love to catch up. How about Thursday afternoon around 3 PM? There\'s a nice new cafe on 5th Street called Brew & Beans.',
    timestamp: 'Mar 12',
    isStarred: false,
    isRead: true,
    avatar: 'ET',
    folder: 'inbox',
    thread: [
      {
        id: '6-1',
        sender: 'Emma Thompson',
        senderEmail: 'emma.thompson@company.com',
        content: 'Hey! It\'s been a while. Want to grab coffee this week and catch up?',
        timestamp: 'Tue, Mar 12, 11:45 AM (2 days ago)',
        avatar: 'ET',
        recipients: 'to you',
        isStarred: false
      },
      {
        id: '6-2',
        sender: 'You',
        senderEmail: 'you@company.com',
        content: 'Absolutely! I\'d love to catch up. How about Thursday afternoon around 3 PM? There\'s a nice new cafe on 5th Street called Brew & Beans.',
        timestamp: 'Tue, Mar 12, 2:20 PM (2 days ago)',
        avatar: 'YU',
        recipients: 'to Emma Thompson',
        isStarred: false
      }
    ]
  },
  {
    id: '7',
    sender: 'IT Department',
    senderEmail: 'security@company.com',
    subject: 'Important: Security update',
    preview: 'Please update your password before the end of the week as part of our security policy.',
    body: 'Please update your password before the end of the week as part of our security policy.',
    timestamp: 'Mar 12',
    isStarred: false,
    isRead: true,
    avatar: 'IT',
    folder: 'inbox'
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
  },

  // Sent emails
  {
    id: '10',
    sender: 'You',
    senderEmail: 'you@company.com',
    subject: 'Meeting notes from today',
    preview: 'Hi team, here are the key takeaways from today\'s meeting...',
    body: 'Hi team,\n\nHere are the key takeaways from today\'s meeting:\n\n1. Q1 goals are on track\n2. New feature rollout scheduled for next month\n3. Team building event planned for Friday\n\nLet me know if you have any questions!\n\nBest regards,\nYou',
    timestamp: 'Mar 13',
    isStarred: false,
    isRead: true,
    avatar: 'YU',
    folder: 'sent'
  },
  {
    id: '11',
    sender: 'You',
    senderEmail: 'you@company.com',
    subject: 'Re: Weekend hiking trip',
    preview: 'Count me in! I\'ll bring snacks for the group.',
    body: 'Hi Outdoor Club,\n\nCount me in for the weekend hiking trip! I\'ll bring snacks for the group and can help with carpooling if needed.\n\nLooking forward to it!\n\nCheers,\nYou',
    timestamp: 'Mar 12',
    isStarred: true,
    isRead: true,
    avatar: 'YU',
    folder: 'sent'
  },
  {
    id: '12',
    sender: 'You',
    senderEmail: 'you@company.com',
    subject: 'Thank you for the interview',
    preview: 'Thank you for taking the time to interview me yesterday...',
    body: 'Dear Hiring Manager,\n\nThank you for taking the time to interview me yesterday for the Senior Developer position. I really enjoyed our conversation about the upcoming projects and team culture.\n\nI\'m very excited about the opportunity and look forward to hearing from you soon.\n\nBest regards,\nYou',
    timestamp: 'Mar 11',
    isStarred: false,
    isRead: true,
    avatar: 'YU',
    folder: 'sent'
  }
];

// Cache for getEmailsForFolder results to avoid redundant filtering
const folderCache = new Map<string, Email[]>();
let lastEmailsHash = '';

// Helper function to create a simple hash of emails array
function createEmailsHash(emails: Email[]): string {
  return emails.map(e => {
    let hash = `${e.id}-${e.folder}-${e.isDeleted}-${e.isStarred}-${e.isRead}`;

    // Include thread message star states in hash
    if (e.thread) {
      const threadHash = e.thread.map(msg => `${msg.id}-${msg.isStarred ?? false}`).join(',');
      hash += `-thread:${threadHash}`;
    }

    return hash;
  }).join('|');
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
      result = emails.filter(email => {
        // Check if main email is starred
        const mainEmailStarred = email.isStarred;

        // Check if any thread message is starred
        const threadMessageStarred = email.thread?.some(message => message.isStarred) ?? false;

        // Show email if either main email or any thread message is starred
        return (mainEmailStarred || threadMessageStarred) && !email.isDeleted && email.folder !== 'trash';
      });
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
    case 'sent':
      result = emails.filter(email => email.folder === 'sent' && !email.isDeleted);
      break;
    default:
      result = emails.filter(email => email.folder === 'inbox' && !email.isDeleted);
  }

  // Cache the result
  folderCache.set(cacheKey, result);

  return result;
}; 