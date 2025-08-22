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
} from 'react-native';
import { useChat } from '../../contexts/ChatContext';
import SwipeableRow from '../common/SwipeableRow';
import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';


interface ThreadListProps {
  onSelectThread: (threadId: string) => void;
  onClose: () => void;
}

const ThreadList: React.FC<ThreadListProps> = ({ onSelectThread, onClose }) => {
  const { threads, deleteThread, updateThreadTitle, createThread } = useChat();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newThreadTitle, setNewThreadTitle] = useState('');

  const handleEditThread = (threadId: string, currentTitle: string) => {
    setCurrentThreadId(threadId);
    setNewTitle(currentTitle);
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (currentThreadId && newTitle.trim()) {
      updateThreadTitle(currentThreadId, newTitle);
      setEditModalVisible(false);
      setNewTitle('');
      setCurrentThreadId(null);
    }
  };

  const handleCreateNewThread = () => {
    if (newThreadTitle.trim()) {
      createThread(newThreadTitle);
      setCreateModalVisible(false);
      setNewThreadTitle('');
    }
  };

  const confirmDeleteThread = (threadId: string, threadTitle: string) => {
    Alert.alert(
      'Delete Thread',
      `Are you sure you want to delete "${threadTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteThread(threadId) },
      ]
    );
  };

  const renderThreadItem = ({ item }: { item: any }) => (
    <SwipeableRow
      onEdit={() => handleEditThread(item.id, item.title)}
      onDelete={() => confirmDeleteThread(item.id, item.title)}
    >
      <TouchableOpacity
        style={styles.threadItem}
        onPress={() => {
          onSelectThread(item.id);
          onClose();
        }}
      >
        <View style={styles.threadContent}>
          <Text style={styles.threadTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.threadPreview} numberOfLines={1}>
            {item.messages.length > 0
              ? item.messages[item.messages.length - 1].content
              : 'No messages yet'}
          </Text>
        </View>
        <Entypo name="chevron-right" size={24} color="white" />
      </TouchableOpacity>
    </SwipeableRow>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Conversations</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
           <Ionicons name="close" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={threads}
        keyExtractor={item => item.id}
        renderItem={renderThreadItem}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity
        style={styles.newThreadButton}
        onPress={() => setCreateModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
        <Text style={styles.newThreadText}>New Conversation</Text>
      </TouchableOpacity>

      {/* Edit Thread Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Thread Title</Text>
            <TextInput
              style={styles.input}
              value={newTitle}
              onChangeText={setNewTitle}
              autoFocus
              placeholder="Thread title"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Thread Modal */}
      <Modal
        visible={createModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Conversation</Text>
            <TextInput
              style={styles.input}
              value={newThreadTitle}
              onChangeText={setNewThreadTitle}
              autoFocus
              placeholder="Thread title"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setCreateModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleCreateNewThread}
              >
                <Text style={styles.saveButtonText}>Create</Text>
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
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  listContent: {
    paddingBottom: 16,
  },
  threadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  threadContent: {
    flex: 1,
    marginRight: 8,
  },
  threadTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  threadPreview: {
    fontSize: 14,
    color: '#666666',
  },
  newThreadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  newThreadText: {
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