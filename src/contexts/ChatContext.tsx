import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Thread, Message } from '../types';
import { mockThreads } from '../data/mockChatData';

interface ChatContextType {
  threads: Thread[];
  currentThreadId: string | null;
  setCurrentThread: (threadId: string) => void;
  addMessage: (content: string) => void;
  createThread: (title: string) => void;
  deleteThread: (threadId: string) => void;
  updateThreadTitle: (threadId: string, newTitle: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [threads, setThreads] = useState<Thread[]>(mockThreads);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(mockThreads[0]?.id || null);

  const setCurrentThread = (threadId: string) => {
    setCurrentThreadId(threadId);
  };

  const addMessage = (content: string) => {
    if (!currentThreadId) return;

    setThreads(prev => prev.map(thread => {
      if (thread.id === currentThreadId) {
        const newMessage: Message = {
          id: Date.now().toString(),
          content,
          role: 'user',
          timestamp: new Date(),
        };

        // Simulate AI response after a delay
        setTimeout(() => {
          setThreads(prevThreads => prevThreads.map(t => {
            if (t.id === currentThreadId) {
              const aiResponse: Message = {
                id: Date.now().toString(),
                content: `This is a simulated response to: "${content}". In a real app, this would come from an AI API.`,
                role: 'assistant',
                timestamp: new Date(),
              };
              return { ...t, messages: [...t.messages, aiResponse] };
            }
            return t;
          }));
        }, 1000);

        return { ...thread, messages: [...thread.messages, newMessage] };
      }
      return thread;
    }));
  };

  const createThread = (title: string) => {
    const newThread: Thread = {
      id: Date.now().toString(),
      title,
      messages: [],
      createdAt: new Date(),
    };
    setThreads(prev => [newThread, ...prev]);
    setCurrentThreadId(newThread.id);
  };

  const deleteThread = (threadId: string) => {
    setThreads(prev => prev.filter(thread => thread.id !== threadId));
    if (currentThreadId === threadId) {
      setCurrentThreadId(threads.length > 1 ? threads[0].id : null);
    }
  };

  const updateThreadTitle = (threadId: string, newTitle: string) => {
    setThreads(prev => prev.map(thread => 
      thread.id === threadId ? { ...thread, title: newTitle } : thread
    ));
  };

  return (
    <ChatContext.Provider value={{
      threads,
      currentThreadId,
      setCurrentThread,
      addMessage,
      createThread,
      deleteThread,
      updateThreadTitle,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};