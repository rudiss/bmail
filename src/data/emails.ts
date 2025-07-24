import { Email, Folder } from '@/types/email';

export const folders: Folder[] = [
  { id: 'inbox', name: 'Inbox', count: 7, icon: '📥' },
  { id: 'starred', name: 'Starred', count: 0, icon: '⭐' },
  { id: 'all-mail', name: 'All Mail', count: 0, icon: '📧' },
  { id: 'spam', name: 'Spam', count: 0, icon: '⚠️' },
  { id: 'trash', name: 'Trash', count: 1, icon: '🗑️' },
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
        recipients: 'to you, David Kim'
      },
      {
        id: '2-2',
        sender: 'David Kim',
        senderEmail: 'david.kim@company.com',
        content: 'Thanks Lisa! I\'ll have my section ready by Thursday afternoon.',
        timestamp: 'Wed, Mar 13, 4:20 PM (22 hours ago)',
        avatar: 'DK',
        recipients: 'to Lisa Wang, you'
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
    id: '4',
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
    id: '5',
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
    id: '6',
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
    id: '7',
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
        id: '7-1',
        sender: 'Emma Thompson',
        senderEmail: 'emma.thompson@company.com',
        content: 'Hey! It\'s been a while. Want to grab coffee this week and catch up?',
        timestamp: 'Tue, Mar 12, 11:45 AM (2 days ago)',
        avatar: 'ET',
        recipients: 'to you'
      },
      {
        id: '7-2',
        sender: 'John Qian',
        senderEmail: 'john@gmail.com',
        content: 'Absolutely! I\'d love to catch up. How about Thursday afternoon around 3 PM? There\'s a nice new cafe on 5th Street called Brew & Beans.',
        timestamp: 'Tue, Mar 12, 2:20 PM (2 days ago)',
        avatar: 'JQ',
        recipients: 'to Emma Thompson'
      }
    ]
  },
  {
    id: '8',
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
  }
];

// Utility function to filter emails based on folder - now accepts emails array parameter
export const getEmailsForFolder = (folderId: string, emails: Email[]): Email[] => {
  switch (folderId) {
    case 'inbox':
      return emails.filter(email => email.folder === 'inbox' && !email.isDeleted);
    case 'starred':
      return emails.filter(email => email.isStarred && !email.isDeleted && email.folder !== 'trash');
    case 'all-mail':
      return emails.filter(email => !email.isDeleted && email.folder !== 'trash');
    case 'spam':
      return emails.filter(email => email.folder === 'spam');
    case 'trash':
      return emails.filter(email => email.isDeleted || email.folder === 'trash');
    default:
      return emails.filter(email => email.folder === 'inbox' && !email.isDeleted);
  }
}; 