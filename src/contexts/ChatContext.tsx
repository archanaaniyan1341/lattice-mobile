import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Chat, Thread, Message } from '../types';
import { mockChats } from '../data/mockChatData';

interface ChatContextType {
  chats: Chat[];
  currentChatId: string | null;
  currentThreadId: string | null;
  setCurrentChat: (chatId: string) => void;
  setCurrentThread: (threadId: string) => void;
  addMessage: (content: string) => Promise<void>;
  createChat: (title: string) => void;
  createThread: (chatId: string, title: string) => void;
  deleteChat: (chatId: string) => void;
  deleteThread: (chatId: string, threadId: string) => void;
  updateChatTitle: (chatId: string, newTitle: string) => void;
  updateThreadTitle: (chatId: string, threadId: string, newTitle: string) => void;
  toggleChatExpansion: (chatId: string) => void;
  isGeneratingResponse: boolean;
  startNewChat: () => void;
  isNewChat: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [isNewChat, setIsNewChat] = useState(false);
  const [temporaryChatId, setTemporaryChatId] = useState<string | null>(null);

  const setCurrentChat = (chatId: string) => {
    setCurrentChatId(chatId);
    setIsNewChat(false);
    
    const chat = chats.find(c => c.id === chatId);
    if (chat && chat.threads.length > 0) {
      setCurrentThreadId(chat.threads[0].id);
    } else {
      setCurrentThreadId(null);
    }
  };

  const setCurrentThread = (threadId: string) => {
    setCurrentThreadId(threadId);
  };

  const startNewChat = () => {
    const tempId = `temp-${Date.now()}`;
    setTemporaryChatId(tempId);
    setCurrentChatId(tempId);
    setCurrentThreadId(null);
    setIsNewChat(true);
  };

  // CREATE THREAD FUNCTION
  const createThread = (chatId: string, title: string) => {
    const newThread: Thread = {
      id: Date.now().toString(),
      title,
      messages: [],
      createdAt: new Date(),
    };
    
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return { 
          ...chat, 
          threads: [newThread, ...chat.threads],
          isExpanded: true
        };
      }
      return chat;
    }));
    
    setCurrentChatId(chatId);
    setCurrentThreadId(newThread.id);
  };

  // DELETE CHAT FUNCTION
  const deleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(chats.length > 1 ? chats[0].id : null);
      setCurrentThreadId(null);
    }
  };

  // DELETE THREAD FUNCTION
  const deleteThread = (chatId: string, threadId: string) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        const filteredThreads = chat.threads.filter(thread => thread.id !== threadId);
        return { ...chat, threads: filteredThreads };
      }
      return chat;
    }));
    
    if (currentThreadId === threadId) {
      const chat = chats.find(c => c.id === chatId);
      if (chat && chat.threads.length > 1) {
        setCurrentThreadId(chat.threads[0].id);
      } else {
        setCurrentThreadId(null);
      }
    }
  };

  // UPDATE CHAT TITLE FUNCTION
  const updateChatTitle = (chatId: string, newTitle: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, title: newTitle } : chat
    ));
  };

  // UPDATE THREAD TITLE FUNCTION
  const updateThreadTitle = (chatId: string, threadId: string, newTitle: string) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          threads: chat.threads.map(thread => 
            thread.id === threadId ? { ...thread, title: newTitle } : thread
          )
        };
      }
      return chat;
    }));
  };

  // TOGGLE CHAT EXPANSION FUNCTION
  const toggleChatExpansion = (chatId: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, isExpanded: !chat.isExpanded } : chat
    ));
  };

  const createChat = (title: string) => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title,
      threads: [],
      createdAt: new Date(),
      isExpanded: true,
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setCurrentThreadId(null);
    setIsNewChat(false);
  };

  const addMessage = async (content: string): Promise<void> => {
    if (isNewChat && temporaryChatId) {
      const newChat: Chat = {
        id: Date.now().toString(),
        title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
        threads: [
          {
            id: Date.now().toString(),
            title: 'Conversation',
            messages: [],
            createdAt: new Date(),
          }
        ],
        createdAt: new Date(),
      };
      
      setChats(prev => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
      setCurrentThreadId(newChat.threads[0].id);
      setIsNewChat(false);
      setTemporaryChatId(null);
      
      setChats(prev => prev.map(chat => {
        if (chat.id === newChat.id) {
          return {
            ...chat,
            threads: chat.threads.map(thread => {
              if (thread.id === newChat.threads[0].id) {
                const newMessage: Message = {
                  id: Date.now().toString(),
                  content,
                  role: 'user',
                  timestamp: new Date(),
                };

                const updatedMessages = [...thread.messages, newMessage];
                
                setTimeout(async () => {
                  setIsGeneratingResponse(true);
                  
                  const aiResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    content: '',
                    role: 'assistant',
                    timestamp: new Date(),
                  };
                  
                  setChats(prevChats => prevChats.map(c => {
                    if (c.id === newChat.id) {
                      return {
                        ...c,
                        threads: c.threads.map(t => {
                          if (t.id === newChat.threads[0].id) {
                            return { ...t, messages: [...updatedMessages, aiResponse] };
                          }
                          return t;
                        })
                      };
                    }
                    return c;
                  }));
                  
                  const fullResponse = `This is a simulated response to: "${content}". In a real app, this would come from an AI API. Here are some thoughts:\n\n1. Consider implementing this feature\n2. Think about user experience\n3. Test thoroughly before deployment`;
                  
                  let currentText = '';
                  const words = fullResponse.split(' ');
                  let wordIndex = 0;
                  
                  const streamInterval = setInterval(() => {
                    if (wordIndex < words.length) {
                      currentText += (wordIndex === 0 ? '' : ' ') + words[wordIndex];
                      wordIndex++;
                      
                      setChats(prevChats => prevChats.map(c => {
                        if (c.id === newChat.id) {
                          return {
                            ...c,
                            threads: c.threads.map(t => {
                              if (t.id === newChat.threads[0].id) {
                                const updatedAiMessage = {
                                  ...aiResponse,
                                  content: currentText
                                };
                                const otherMessages = t.messages.filter(m => m.id !== aiResponse.id);
                                return { ...t, messages: [...otherMessages, updatedAiMessage] };
                              }
                              return t;
                            })
                          };
                        }
                        return c;
                      }));
                    } else {
                      clearInterval(streamInterval);
                      setIsGeneratingResponse(false);
                    }
                  }, 80);
                  
                }, 500);
                
                return { ...thread, messages: updatedMessages };
              }
              return thread;
            })
          };
        }
        return chat;
      }));
      
      return;
    }
    
    if (!currentChatId || !currentThreadId) return;

    return new Promise((resolve) => {
      setChats(prev => prev.map(chat => {
        if (chat.id === currentChatId) {
          return {
            ...chat,
            threads: chat.threads.map(thread => {
              if (thread.id === currentThreadId) {
                const newMessage: Message = {
                  id: Date.now().toString(),
                  content,
                  role: 'user',
                  timestamp: new Date(),
                };

                const updatedMessages = [...thread.messages, newMessage];
                
                setTimeout(async () => {
                  setIsGeneratingResponse(true);
                  
                  const aiResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    content: '',
                    role: 'assistant',
                    timestamp: new Date(),
                  };
                  
                  setChats(prevChats => prevChats.map(c => {
                    if (c.id === currentChatId) {
                      return {
                        ...c,
                        threads: c.threads.map(t => {
                          if (t.id === currentThreadId) {
                            return { ...t, messages: [...updatedMessages, aiResponse] };
                          }
                          return t;
                        })
                      };
                    }
                    return c;
                  }));
                  
                  const fullResponse = `This is a simulated response to: "${content}". In a real app, this would come from an AI API. Here are some thoughts:\n\n1. Consider implementing this feature\n2. Think about user experience\n3. Test thoroughly before deployment`;
                  
                  let currentText = '';
                  const words = fullResponse.split(' ');
                  let wordIndex = 0;
                  
                  const streamInterval = setInterval(() => {
                    if (wordIndex < words.length) {
                      currentText += (wordIndex === 0 ? '' : ' ') + words[wordIndex];
                      wordIndex++;
                      
                      setChats(prevChats => prevChats.map(c => {
                        if (c.id === currentChatId) {
                          return {
                            ...c,
                            threads: c.threads.map(t => {
                              if (t.id === currentThreadId) {
                                const updatedAiMessage = {
                                  ...aiResponse,
                                  content: currentText
                                };
                                const otherMessages = t.messages.filter(m => m.id !== aiResponse.id);
                                return { ...t, messages: [...otherMessages, updatedAiMessage] };
                              }
                              return t;
                            })
                          };
                        }
                        return c;
                      }));
                    } else {
                      clearInterval(streamInterval);
                      setIsGeneratingResponse(false);
                      resolve();
                    }
                  }, 80);
                  
                }, 500);
                
                return { ...thread, messages: updatedMessages };
              }
              return thread;
            })
          };
        }
        return chat;
      }));
    });
  };

  return (
    <ChatContext.Provider value={{
      chats,
      currentChatId,
      currentThreadId,
      setCurrentChat,
      setCurrentThread,
      addMessage,
      createChat,
      createThread,
      deleteChat,
      deleteThread,
      updateChatTitle,
      updateThreadTitle,
      toggleChatExpansion,
      isGeneratingResponse,
      startNewChat,
      isNewChat,
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