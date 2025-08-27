import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
  StatusBar,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { useChat } from '../contexts/ChatContext';
import ThreadList from '../components/chat/ThreadList';
import MessageBubble from '../components/chat/MessageBubble';
import ChatInput from '../components/chat/ChatInput';
import { Ionicons } from '@expo/vector-icons';

const ChatScreen: React.FC = () => {
  const { 
    chats, 
    currentChatId, 
    currentThreadId, 
    addMessage, 
    setCurrentChat, 
    setCurrentThread,
    isNewChat,
    startNewChat, // Add this function
  } = useChat();
  
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarAnimation] = useState(new Animated.Value(-Dimensions.get('window').width));
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const textInputRef = useRef<any>(null);

  const currentChat = chats.find(chat => chat.id === currentChatId);
  const currentThread = currentChat?.threads.find(thread => thread.id === currentThreadId);

  // Automatically create new chat if no chat is selected
  useEffect(() => {
    if (!currentChatId && !isNewChat) {
      startNewChat();
    }
  }, [currentChatId, isNewChat, startNewChat]);

  const toggleSidebar = () => {
    if (sidebarVisible) {
      // Hide sidebar
      Animated.timing(sidebarAnimation, {
        toValue: -Dimensions.get('window').width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setSidebarVisible(false));
    } else {
      // Show sidebar
      setSidebarVisible(true);
      Animated.timing(sidebarAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const closeSidebar = () => {
    Animated.timing(sidebarAnimation, {
      toValue: -Dimensions.get('window').width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSidebarVisible(false));
  };

  const handleChatSelected = (chatId: string) => {
    setCurrentChat(chatId);
    const chat = chats.find(c => c.id === chatId);
    if (chat && chat.threads.length > 0) {
      setCurrentThread(chat.threads[0].id);
    } else {
      setCurrentThread('');
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    setIsGeneratingResponse(true);
    await addMessage(content);
    
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
      setIsGeneratingResponse(false);
    }, 100);
  };

  // Scroll to bottom when thread changes
  useEffect(() => {
    if (flatListRef.current && currentThread?.messages.length) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [currentThreadId, currentThread?.messages.length]);

  // Auto-focus on input when a new empty thread is selected
  useEffect(() => {
    if ((currentThread && currentThread.messages.length === 0) || isNewChat) {
      setTimeout(() => {
        if (textInputRef.current) {
          textInputRef.current.focus();
        }
      }, 300);
    }
  }, [currentThreadId, isNewChat, currentThread]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#836cc7" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {isNewChat ? 'New Chat' : currentChat?.title || 'Chat'}
          </Text>
          {currentThread && (
            <Text style={styles.threadSubtitle} numberOfLines={1}>
              {currentThread.title}
            </Text>
          )}
        </View>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        {/* Always show the message list area */}
        <View style={styles.messagesContainer}>
          {isNewChat ? (
            // Empty state for new chat
            <View style={styles.emptyState}>
              <Ionicons name="chatbubble-outline" size={64} color="#CCCCCC" />
              <Text style={styles.emptyStateText}>Start a new conversation</Text>
            </View>
          ) : currentChat ? (
            currentThread ? (
              <FlatList
                ref={flatListRef}
                data={currentThread.messages}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <MessageBubble message={item} />}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() => {
                  if (flatListRef.current && currentThread.messages.length > 0) {
                    flatListRef.current.scrollToEnd({ animated: true });
                  }
                }}
                onLayout={() => {
                  if (flatListRef.current && currentThread.messages.length > 0) {
                    flatListRef.current.scrollToEnd({ animated: true });
                  }
                }}
              />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="chatbubbles" size={64} color="#CCCCCC" />
                <Text style={styles.emptyStateText}>This chat has no threads yet</Text>
              </View>
            )
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubbles" size={64} color="#CCCCCC" />
              <Text style={styles.emptyStateText}>Starting a new chat...</Text>
            </View>
          )}
        </View>

        {/* Typing indicator - positioned above input */}
        {isGeneratingResponse && (
          <View style={styles.typingIndicator}>
            <View style={styles.typingDot} />
            <View style={styles.typingDot} />
            <View style={styles.typingDot} />
          </View>
        )}

        {/* Input always at bottom */}
        <ChatInput onSendMessage={handleSendMessage} ref={textInputRef} />
      </View>

      {/* Sidebar Overlay */}
      {sidebarVisible && (
        <TouchableWithoutFeedback onPress={closeSidebar}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* Animated Sidebar */}
      {sidebarVisible && (
        <Animated.View 
          style={[
            styles.sidebarContainer,
            { transform: [{ translateX: sidebarAnimation }] }
          ]}
        >
          <ThreadList onClose={closeSidebar} onChatSelected={handleChatSelected} />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    zIndex: 10,
    elevation: 10,
  },
  menuButton: {
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
  threadSubtitle: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginTop: 2,
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#999999',
    marginTop: 16,
    textAlign: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 99,
  },
  sidebarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '85%',
    zIndex: 100,
    elevation: 100,
  },
  typingIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCCCCC',
    marginHorizontal: 3,
  },
});

export default ChatScreen;