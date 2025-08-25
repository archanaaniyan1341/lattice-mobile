import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Alert,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { useChat } from '../../contexts/ChatContext';
import SwipeableRow from '../common/SwipeableRow';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface ThreadListProps {
  onClose: () => void;
  onChatCreated: () => void; // New prop to notify parent when chat is created
}

const ThreadList: React.FC<ThreadListProps> = ({ onClose, onChatCreated }) => {
  const {
    chats,
    currentChatId,
    currentThreadId,
    setCurrentChat,
    setCurrentThread,
    createChat,
    createThread,
    deleteChat,
    deleteThread,
    updateChatTitle,
    updateThreadTitle,
    toggleChatExpansion,
  } = useChat();
  
  const [createChatModalVisible, setCreateChatModalVisible] = useState(false);
  const [createThreadModalVisible, setCreateThreadModalVisible] = useState(false);
  const [editChatModalVisible, setEditChatModalVisible] = useState(false);
  const [editThreadModalVisible, setEditThreadModalVisible] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState('');
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const handleCreateChat = () => {
    if (newChatTitle.trim()) {
      createChat(newChatTitle);
      setNewChatTitle('');
      setCreateChatModalVisible(false);
      onChatCreated(); // Notify parent that chat was created
      onClose(); // Close the sidebar
    }
  };

  const handleCreateThread = (chatId: string) => {
    if (newThreadTitle.trim()) {
      createThread(chatId, newThreadTitle);
      setNewThreadTitle('');
      setCreateThreadModalVisible(false);
      onChatCreated(); // Notify parent that thread was created
      onClose(); // Close the sidebar
    }
  };

  const handleEditChat = (chatId: string, currentTitle: string) => {
    setEditingChatId(chatId);
    setEditingTitle(currentTitle);
    setEditChatModalVisible(true);
  };

  const handleSaveChatEdit = () => {
    if (editingChatId && editingTitle.trim()) {
      updateChatTitle(editingChatId, editingTitle);
      setEditChatModalVisible(false);
      setEditingChatId(null);
      setEditingTitle('');
    }
  };

  const handleEditThread = (chatId: string, threadId: string, currentTitle: string) => {
    setEditingChatId(chatId);
    setEditingThreadId(threadId);
    setEditingTitle(currentTitle);
    setEditThreadModalVisible(true);
  };

  const handleSaveThreadEdit = () => {
    if (editingChatId && editingThreadId && editingTitle.trim()) {
      updateThreadTitle(editingChatId, editingThreadId, editingTitle);
      setEditThreadModalVisible(false);
      setEditingChatId(null);
      setEditingThreadId(null);
      setEditingTitle('');
    }
  };

  const confirmDeleteChat = (chatId: string, chatTitle: string) => {
    Alert.alert(
      'Delete Chat',
      `Are you sure you want to delete "${chatTitle}" and all its threads?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteChat(chatId) },
      ]
    );
  };

  const confirmDeleteThread = (chatId: string, threadId: string, threadTitle: string) => {
    Alert.alert(
      'Delete Thread',
      `Are you sure you want to delete "${threadTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteThread(chatId, threadId) },
      ]
    );
  };

  const handleChatSelection = (chatId: string, threadId: string) => {
    setCurrentChat(chatId);
    setCurrentThread(threadId);
    onClose(); // Close the sidebar after selection
  };

  const renderChatItem = ({ item }: { item: any }) => (
    <View style={styles.chatItem}>
      <View style={styles.chatHeader}>
        <TouchableOpacity
          style={styles.chatTitleContainer}
          onPress={() => toggleChatExpansion(item.id)}
        >
          <MaterialIcons
            name={item.isExpanded ? 'keyboard-arrow-down' : 'keyboard-arrow-right'}
            size={24}
            color="#666666"
          />
          <Text style={styles.chatTitle} numberOfLines={1}>
            {item.title}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.chatActions}>
          <TouchableOpacity
            onPress={() => {
              setEditingChatId(item.id);
              setCreateThreadModalVisible(true);
            }}
            style={styles.actionButton}
          >
            <Ionicons name="add" size={20} color="#007AFF" />
          </TouchableOpacity>
          
          <SwipeableRow
            onEdit={() => handleEditChat(item.id, item.title)}
            onDelete={() => confirmDeleteChat(item.id, item.title)}
          >
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="more-vert" size={20} color="#666666" />
            </TouchableOpacity>
          </SwipeableRow>
        </View>
      </View>

      {item.isExpanded && (
        <View style={styles.threadsContainer}>
          {item.threads.map((thread: any) => (
            <SwipeableRow
              key={thread.id}
              onEdit={() => handleEditThread(item.id, thread.id, thread.title)}
              onDelete={() => confirmDeleteThread(item.id, thread.id, thread.title)}
            >
              <TouchableOpacity
                style={[
                  styles.threadItem,
                  currentThreadId === thread.id && styles.threadItemActive,
                ]}
                onPress={() => handleChatSelection(item.id, thread.id)}
              >
                <Text
                  style={[
                    styles.threadTitle,
                    currentThreadId === thread.id && styles.threadTitleActive,
                  ]}
                  numberOfLines={1}
                >
                  {thread.title}
                </Text>
                <Text style={styles.threadPreview} numberOfLines={1}>
                  {thread.messages.length > 0
                    ? thread.messages[thread.messages.length - 1].content
                    : 'No messages yet'}
                </Text>
              </TouchableOpacity>
            </SwipeableRow>
          ))}
          
          {item.threads.length === 0 && (
            <Text style={styles.noThreadsText}>No threads yet</Text>
          )}
        </View>
      )}
    </View>
  );

  // Get screen dimensions
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const statusBarHeight = StatusBar.currentHeight || 0;

  return (
    <View style={[styles.container, { width: screenWidth * 0.85, height: screenHeight }]}>
      <View style={[styles.header, { marginTop: Platform.OS === 'android' ? statusBarHeight : 0 }]}>
        <Text style={styles.headerTitle}>Conversations</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={chats}
        keyExtractor={item => item.id}
        renderItem={renderChatItem}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />

      <TouchableOpacity
        style={styles.newChatButton}
        onPress={() => setCreateChatModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
        <Text style={styles.newChatText}>New Chat</Text>
      </TouchableOpacity>

      {/* Create Chat Modal */}
      <Modal
        visible={createChatModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCreateChatModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Chat</Text>
            <TextInput
              style={styles.input}
              value={newChatTitle}
              onChangeText={setNewChatTitle}
              autoFocus
              placeholder="Chat title"
              onSubmitEditing={handleCreateChat}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setCreateChatModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleCreateChat}
              >
                <Text style={styles.saveButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Thread Modal */}
      <Modal
        visible={createThreadModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCreateThreadModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Thread</Text>
            <TextInput
              style={styles.input}
              value={newThreadTitle}
              onChangeText={setNewThreadTitle}
              autoFocus
              placeholder="Thread title"
              onSubmitEditing={() => editingChatId && handleCreateThread(editingChatId)}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setCreateThreadModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={() => editingChatId && handleCreateThread(editingChatId)}
              >
                <Text style={styles.saveButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Chat Modal */}
      <Modal
        visible={editChatModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditChatModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Chat</Text>
            <TextInput
              style={styles.input}
              value={editingTitle}
              onChangeText={setEditingTitle}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditChatModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveChatEdit}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Thread Modal */}
      <Modal
        visible={editThreadModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditThreadModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Thread</Text>
            <TextInput
              style={styles.input}
              value={editingTitle}
              onChangeText={setEditingTitle}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditThreadModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveThreadEdit}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 1000,
    elevation: 50,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  chatItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chatTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  chatActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  threadsContainer: {
    paddingLeft: 48,
    paddingRight: 16,
  },
  threadItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  threadItemActive: {
    backgroundColor: '#F0F7FF',
  },
  threadTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  threadTitleActive: {
    color: '#007AFF',
  },
  threadPreview: {
    fontSize: 12,
    color: '#666666',
  },
  noThreadsText: {
    fontSize: 12,
    color: '#999999',
    fontStyle: 'italic',
    paddingVertical: 12,
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  newChatText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#EEEEEE',
  },
  cancelButtonText: {
    color: '#333333',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    color: '#FFFFFF',
  },
});

export default ThreadList;