import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useChat } from '../contexts/ChatContext';
import ThreadList from '../components/chat/ThreadList';
import MessageBubble from '../components/chat/MessageBubble';
import ChatInput from '../components/chat/ChatInput';
import { MaterialIcons } from '@expo/vector-icons';
const ChatScreen: React.FC = () => {
  const { threads, currentThreadId, setCurrentThread } = useChat();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const currentThread = threads.find(thread => thread.id === currentThreadId);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSidebarVisible(!sidebarVisible)} style={styles.menuButton}>
          <MaterialIcons name="menu" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {currentThread?.title || 'Chat'}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        {sidebarVisible ? (
          <ThreadList onSelectThread={setCurrentThread} onClose={() => setSidebarVisible(false)} />
        ) : (
          <>
            <FlatList
              data={currentThread?.messages || []}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <MessageBubble message={item} />}
              contentContainerStyle={styles.messagesList}
              inverted
            />
            <ChatInput onSendMessage={(message) => {
              // This will be connected to the context
            }} />
          </>
        )}
      </View>
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
  },
  menuButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
  },
});

export default ChatScreen;