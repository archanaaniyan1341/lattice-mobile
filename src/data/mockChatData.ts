import { Thread } from '../types';

export const mockThreads: Thread[] = [
  {
    id: '1',
    title: 'Product Ideas',
    createdAt: new Date('2023-05-15'),
    messages: [
      {
        id: '1-1',
        content: 'What are some innovative product ideas for our platform?',
        role: 'user',
        timestamp: new Date('2023-05-15T10:30:00'),
      },
      {
        id: '1-2',
        content: 'Based on current market trends, I would suggest exploring:\n\n1. **AI-powered analytics** for user behavior\n2. **Customizable dashboards** with drag-and-drop functionality\n3. **Integration capabilities** with popular third-party tools\n\nWould you like me to elaborate on any of these ideas?',
        role: 'assistant',
        timestamp: new Date('2023-05-15T10:32:00'),
      },
    ],
  },
  {
    id: '2',
    title: 'Technical Discussion',
    createdAt: new Date('2023-05-10'),
    messages: [
      {
        id: '2-1',
        content: 'What technologies should we use for the new mobile app?',
        role: 'user',
        timestamp: new Date('2023-05-10T14:20:00'),
      },
      {
        id: '2-2',
        content: 'For a cross-platform mobile app with high performance, I recommend:\n\n- **React Native** with TypeScript for the frontend\n- **Node.js** with Express for the backend API\n- **MongoDB** or **PostgreSQL** for the database depending on your data structure needs\n- **AWS** or **Azure** for cloud hosting and services',
        role: 'assistant',
        timestamp: new Date('2023-05-10T14:22:00'),
      },
    ],
  },
  {
    id: '3',
    title: 'Marketing Strategy',
    createdAt: new Date('2023-05-05'),
    messages: [
      {
        id: '3-1',
        content: 'Can you suggest a marketing strategy for Q3?',
        role: 'user',
        timestamp: new Date('2023-05-05T09:15:00'),
      },
      {
        id: '3-2',
        content: 'For Q3, I recommend focusing on:\n\n1. **Content Marketing** - Create valuable blog posts and case studies\n2. **Social Media Campaigns** - Targeted ads on LinkedIn and Twitter\n3. **Webinars** - Demonstrate product capabilities to potential customers\n4. **Referral Program** - Incentivize current users to refer new customers',
        role: 'assistant',
        timestamp: new Date('2023-05-05T09:17:00'),
      },
    ],
  },
];