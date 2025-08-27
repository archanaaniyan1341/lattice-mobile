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
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface ThreadListProps {
  onClose: () => void;
  onChatSelected: (chatId: string) => void;
}

const ThreadList: React.FC<ThreadListProps> = ({ onClose, onChatSelected }) => {
  const {
    chats,
    currentChatId,
    deleteChat,
    updateChatTitle,
    startNewChat, // Use the new function
    createChat,
   // onChatCreated, // New prop to notify parent
  } = useChat();
  


  const handleNewChat = () => {
    startNewChat(); // Use the new function
    onClose(); // Close the sidebar
  };
  
  const [createChatModalVisible, setCreateChatModalVisible] = useState(false);
  const [editChatModalVisible, setEditChatModalVisible] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState('');
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [optionsVisibleForChat, setOptionsVisibleForChat] = useState<string | null>(null);

    const handleCreateChat = () => {
    if (newChatTitle.trim()) {
      createChat(newChatTitle);
      setNewChatTitle('');
      setCreateChatModalVisible(false);
      //onChatCreated(); // Notify parent that chat was created
      onClose(); // Close the sidebar
    }
  };

  const handleEditChat = (chatId: string, currentTitle: string) => {
    setEditingChatId(chatId);
    setEditingTitle(currentTitle);
    setEditChatModalVisible(true);
    setOptionsVisibleForChat(null); // Close options menu
  };

  const handleSaveChatEdit = () => {
    if (editingChatId && editingTitle.trim()) {
      updateChatTitle(editingChatId, editingTitle);
      setEditChatModalVisible(false);
      setEditingChatId(null);
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
    setOptionsVisibleForChat(null); // Close options menu
  };

  const toggleOptions = (chatId: string) => {
    setOptionsVisibleForChat(optionsVisibleForChat === chatId ? null : chatId);
  };

  const handleChatSelection = (chatId: string) => {
    onChatSelected(chatId);
    onClose(); // Close the sidebar after selection
  };

  
  const renderChatItem = ({ item }: { item: any }) => (
    <View style={styles.chatItem}>
      <TouchableOpacity
        style={styles.chatTitleContainer}
        onPress={() => handleChatSelection(item.id)}
      >
        <MaterialIcons name="chat" size={20} color="#007AFF" />
        <Text style={styles.chatTitle} numberOfLines={1}>
          {item.title}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => toggleOptions(item.id)}
        style={styles.optionsButton}
      >
        <MaterialIcons name="more-vert" size={20} color="#666666" />
      </TouchableOpacity>

      {/* Options dropdown */}
      {optionsVisibleForChat === item.id && (
        <View style={styles.optionsMenu}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleEditChat(item.id, item.title)}
          >
            <MaterialIcons name="edit" size={16} color="#007AFF" />
            <Text style={styles.optionText}>Rename</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => confirmDeleteChat(item.id, item.title)}
          >
            <MaterialIcons name="delete" size={16} color="#FF3B30" />
            <Text style={[styles.optionText, styles.deleteOptionText]}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

   const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const statusBarHeight = StatusBar.currentHeight || 0;
  return (
    <View style={[styles.container, { width: screenWidth * 0.85, height: screenHeight }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Conversations</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.newChatButton}
        onPress={handleNewChat} // Use the new handler
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
        <Text style={styles.newChatText}>New Chat</Text>
      </TouchableOpacity>

      <FlatList
        data={chats}
        keyExtractor={item => item.id}
        renderItem={renderChatItem}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />
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

      {/* Edit Chat Modal */}
      <Modal
        visible={editChatModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditChatModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rename Chat</Text>
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
    position: 'relative',
  },
  chatTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flex: 1,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },
  optionsButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 8,
  },
  optionsMenu: {
    position: 'absolute',
    right: 16,
    top: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1001,
    minWidth: 120,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  optionText: {
    marginLeft: 8,
    fontSize: 14,
  },
  deleteOptionText: {
    color: '#FF3B30',
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