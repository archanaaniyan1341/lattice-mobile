import React, { useState, ReactNode } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface SimpleSwipeRowProps {
  children: ReactNode;
  onEdit: () => void;
  onDelete: () => void;
}

const SimpleSwipeRow: React.FC<SimpleSwipeRowProps> = ({ children, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  const toggleActions = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowActions(!showActions);
  };

  const handleEdit = () => {
    setShowActions(false);
    onEdit();
  };

  const handleDelete = () => {
    setShowActions(false);
    onDelete();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleActions} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
      
      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={handleEdit}
          >
            <MaterialIcons name="edit" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <MaterialIcons name="delete" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 60, // Adjust based on your row height
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '100%',
  },
  editButton: {
    backgroundColor: '#FF9500',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
});

export default SimpleSwipeRow;