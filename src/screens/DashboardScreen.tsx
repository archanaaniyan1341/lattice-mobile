import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { useDashboard } from '../contexts/DashboardContext';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import WidgetGrid from '../components/dashboard/WidgetGrid';
import { MaterialIcons } from '@expo/vector-icons';
const DashboardScreen: React.FC = () => {
  const { dashboards, currentDashboardId, createDashboard, deleteDashboard } = useDashboard();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newDashboardTitle, setNewDashboardTitle] = useState('');

  const currentDashboard = dashboards.find(d => d.id === currentDashboardId);

  const handleCreateDashboard = () => {
    if (newDashboardTitle.trim()) {
      createDashboard(newDashboardTitle);
      setNewDashboardTitle('');
      setCreateModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <DashboardHeader />
      
      <View style={styles.content}>
        {currentDashboard ? (
          <WidgetGrid />
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="dashboard" size={64} color="#CCCCCC" />
            <Text style={styles.emptyStateText}>No dashboards yet</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setCreateModalVisible(true)}
            >
              <Text style={styles.createButtonText}>Create Dashboard</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setCreateModalVisible(true)}
      >
        <MaterialIcons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        visible={createModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Dashboard</Text>
            <TextInput
              style={styles.input}
              placeholder="Dashboard title"
              value={newDashboardTitle}
              onChangeText={setNewDashboardTitle}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setCreateModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createModalButton]}
                onPress={handleCreateDashboard}
              >
                <Text style={styles.createModalButtonText}>Create</Text>
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
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
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
    marginVertical: 16,
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
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
  createModalButton: {
    backgroundColor: '#007AFF',
  },
  createModalButtonText: {
    color: '#FFFFFF',
  },
});

export default DashboardScreen;