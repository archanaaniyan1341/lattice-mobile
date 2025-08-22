import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useDashboard } from '../../contexts/DashboardContext';
import { MaterialIcons } from '@expo/vector-icons';
import SwipeableRow from '../common/SwipeableRow';

const DashboardHeader: React.FC = () => {
  const {
    dashboards,
    currentDashboardId,
    setCurrentDashboard,
    createDashboard,
    deleteDashboard,
  } = useDashboard();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newDashboardTitle, setNewDashboardTitle] = useState('');
  const [editingDashboardId, setEditingDashboardId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const currentDashboard = dashboards.find(d => d.id === currentDashboardId);

  const handleCreateDashboard = () => {
    if (newDashboardTitle.trim()) {
      createDashboard(newDashboardTitle);
      setNewDashboardTitle('');
      setCreateModalVisible(false);
    }
  };

  const handleEditDashboard = (dashboardId: string, currentTitle: string) => {
    setEditingDashboardId(dashboardId);
    setEditingTitle(currentTitle);
    setEditModalVisible(true);
    setDropdownVisible(false);
  };

  const handleSaveEdit = () => {
    // In a real app, you would update the dashboard title here
    // For now, we'll just close the modal
    setEditModalVisible(false);
    setEditingDashboardId(null);
    setEditingTitle('');
  };

  const confirmDeleteDashboard = (dashboardId: string, dashboardTitle: string) => {
    Alert.alert(
      'Delete Dashboard',
      `Are you sure you want to delete "${dashboardTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteDashboard(dashboardId) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.titleContainer}
        onPress={() => setDropdownVisible(!dropdownVisible)}
      >
        <Text style={styles.title} numberOfLines={1}>
          {currentDashboard?.title || 'Select Dashboard'}
        </Text>
        <MaterialIcons 
          name={dropdownVisible ? 'arrow-drop-up' : 'arrow-drop-down'} 
          size={24} 
        />
      </TouchableOpacity>

      {dropdownVisible && (
        <View style={styles.dropdown}>
          {dashboards.map(dashboard => (
            <SwipeableRow
              key={dashboard.id}
              onEdit={() => handleEditDashboard(dashboard.id, dashboard.title)}
              onDelete={() => confirmDeleteDashboard(dashboard.id, dashboard.title)}
            >
              <TouchableOpacity
                style={[
                  styles.dropdownItem,
                  dashboard.id === currentDashboardId && styles.dropdownItemActive,
                ]}
                onPress={() => {
                  setCurrentDashboard(dashboard.id);
                  setDropdownVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    dashboard.id === currentDashboardId && styles.dropdownItemTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {dashboard.title}
                </Text>
              </TouchableOpacity>
            </SwipeableRow>
          ))}
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => {
              setCreateModalVisible(true);
              setDropdownVisible(false);
            }}
          >
            <MaterialIcons name="add" size={20} color="#007AFF" />
            <Text style={styles.createButtonText}>Create New Dashboard</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Create Dashboard Modal */}
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
                style={[styles.modalButton, styles.createButtonModal]}
                onPress={handleCreateDashboard}
              >
                <Text style={styles.createButtonTextModal}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Dashboard Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Dashboard</Text>
            <TextInput
              style={styles.input}
              value={editingTitle}
              onChangeText={setEditingTitle}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButtonModal]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.createButtonTextModal}>Save</Text>
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
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
    maxHeight: 300,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemActive: {
    backgroundColor: '#F0F7FF',
  },
  dropdownItemText: {
    fontSize: 16,
  },
  dropdownItemTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  createButtonText: {
    color: '#007AFF',
    marginLeft: 8,
    fontWeight: '600',
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
  createButtonModal: {
    backgroundColor: '#007AFF',
  },
  createButtonTextModal: {
    color: '#FFFFFF',
  },
});

export default DashboardHeader;