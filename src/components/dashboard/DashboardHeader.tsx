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

const DashboardHeader: React.FC = () => {
  const {
    dashboards,
    currentDashboardId,
    setCurrentDashboard,
    createDashboard,
    deleteDashboard,
    updateDashboardTitle,
  } = useDashboard();
  
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newDashboardTitle, setNewDashboardTitle] = useState('');
  const [editingDashboardId, setEditingDashboardId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [optionsVisibleForDashboard, setOptionsVisibleForDashboard] = useState<string | null>(null);

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
    setOptionsVisibleForDashboard(null); // Close options menu
  };

  const handleSaveEdit = () => {
    if (editingDashboardId && editingTitle.trim()) {
      updateDashboardTitle(editingDashboardId, editingTitle);
      setEditModalVisible(false);
      setEditingDashboardId(null);
      setEditingTitle('');
    }
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
    setOptionsVisibleForDashboard(null); // Close options menu
  };

  const toggleOptions = (dashboardId: string) => {
    setOptionsVisibleForDashboard(optionsVisibleForDashboard === dashboardId ? null : dashboardId);
  };

  const handleDashboardSelect = (dashboardId: string) => {
    setCurrentDashboard(dashboardId);
    setDropdownVisible(false);
    setOptionsVisibleForDashboard(null); // Close any open options menu
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
            <View key={dashboard.id} style={styles.dropdownItemContainer}>
              <TouchableOpacity
                style={[
                  styles.dropdownItem,
                  dashboard.id === currentDashboardId && styles.dropdownItemActive,
                ]}
                onPress={() => handleDashboardSelect(dashboard.id)}
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

              {/* Three-dot menu button */}
              <TouchableOpacity
                onPress={() => toggleOptions(dashboard.id)}
                style={styles.optionsButton}
              >
                <MaterialIcons name="more-vert" size={20} color="#666666" />
              </TouchableOpacity>

              {/* Options menu */}
              {optionsVisibleForDashboard === dashboard.id && (
                <View style={styles.optionsMenu}>
                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => handleEditDashboard(dashboard.id, dashboard.title)}
                  >
                    <MaterialIcons name="edit" size={16} color="#836cc7" />
                    <Text style={styles.optionText}>Rename</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => confirmDeleteDashboard(dashboard.id, dashboard.title)}
                  >
                    <MaterialIcons name="delete" size={16} color="#FF3B30" />
                    <Text style={[styles.optionText, styles.deleteOptionText]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
          
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => {
              setCreateModalVisible(true);
              setDropdownVisible(false);
            }}
          >
            <MaterialIcons name="add" size={20} color="#836cc7" />
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
            <Text style={styles.modalTitle}>Rename Dashboard</Text>
            <TextInput
              style={styles.input}
              value={editingTitle}
              onChangeText={setEditingTitle}
              autoFocus
              placeholder="Enter new dashboard name"
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
  dropdownItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItem: {
    flex: 1,
    padding: 16,
  },
  dropdownItemActive: {
    backgroundColor: '#F0F7FF',
  },
  dropdownItemText: {
    fontSize: 16,
  },
  dropdownItemTextActive: {
    color: '#836cc7',
    fontWeight: '600',
  },
  optionsButton: {
    padding: 16,
  },
  optionsMenu: {
    position: 'absolute',
    right: 50,
    top: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  createButtonText: {
    color: '#836cc7',
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
    backgroundColor: '#836cc7',
  },
  createButtonTextModal: {
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#836cc7',
  },
  saveButtonText: {
    color: '#FFFFFF',
  },
});

export default DashboardHeader;