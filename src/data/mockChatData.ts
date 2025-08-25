import { Chat, Thread, Message } from '../types';

// Sample messages
const sampleMessages: Message[] = [
  {
    id: '1',
    content: 'What are some innovative product ideas for our platform?',
    role: 'user',
    timestamp: new Date('2023-05-15T10:30:00'),
  },
  {
    id: '2',
    content: 'Based on current market trends, I would suggest exploring:\n\n1. **AI-powered analytics** for user behavior\n2. **Customizable dashboards** with drag-and-drop functionality\n3. **Integration capabilities** with popular third-party tools\n\nWould you like me to elaborate on any of these ideas?',
    role: 'assistant',
    timestamp: new Date('2023-05-15T10:32:00'),
  },
];

// Sample threads
const sampleThreads: Thread[] = [
  {
    id: 'thread-1',
    title: 'Product Ideas Discussion',
    messages: sampleMessages,
    createdAt: new Date('2023-05-15'),
  },
  {
    id: 'thread-2',
    title: 'Technical Implementation',
    messages: [
      {
        id: '3',
        content: 'How should we implement the AI features?',
        role: 'user',
        timestamp: new Date('2023-05-16T14:20:00'),
      },
      {
        id: '4',
        content: 'For AI implementation, I recommend:\n\n- Using TensorFlow.js for browser-based ML\n- Implementing a RESTful API for server-side processing\n- Considering cloud-based AI services for scalability',
        role: 'assistant',
        timestamp: new Date('2023-05-16T14:22:00'),
      },
    ],
    createdAt: new Date('2023-05-16'),
  },
];

const sampleThreads2: Thread[] = [
  {
    id: 'thread-3',
    title: 'Marketing Strategy Q3',
    messages: [
      {
        id: '5',
        content: 'What should our Q3 marketing focus be?',
        role: 'user',
        timestamp: new Date('2023-05-20T09:15:00'),
      },
      {
        id: '6',
        content: 'For Q3, focus on:\n\n1. **Content marketing** with case studies\n2. **Social media campaigns** targeting developers\n3. **Webinar series** showcasing product features',
        role: 'assistant',
        timestamp: new Date('2023-05-20T09:17:00'),
      },
    ],
    createdAt: new Date('2023-05-20'),
  },
];

// Mock chats with threads
export const mockChats: Chat[] = [
  {
    id: 'chat-1',
    title: 'Product Development',
    threads: sampleThreads,
    createdAt: new Date('2023-05-15'),
    isExpanded: true,
  },
  // {
  //   id: 'chat-2',
  //   title: 'Marketing Planning',
  //   threads: sampleThreads2,
  //   createdAt: new Date('2023-05-20'),
  //   isExpanded: false,
  // },
  // {
  //   id: 'chat-3',
  //   title: 'Customer Support',
  //   threads: [],
  //   createdAt: new Date('2023-05-25'),
  //   isExpanded: false,
  // },
];