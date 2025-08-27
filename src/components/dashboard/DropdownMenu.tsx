// components/DropdownMenu.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface DropdownMenuProps {
  visible: boolean;
  onClose: () => void;
  options: Array<{
    label: string;
    icon: string;
    onPress: () => void;
    disabled?: boolean;
  }>;
  position: { x: number; y: number };
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ visible, onClose, options, position }) => {
  if (!visible) return null;

  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={[styles.menuContainer, { top: position.y, left: position.x }]}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                option.disabled && styles.disabledMenuItem
              ]}
              onPress={() => {
                if (!option.disabled) {
                  option.onPress();
                  onClose();
                }
              }}
              disabled={option.disabled}
            >
              <MaterialIcons 
                name={option.icon as any} 
                size={20} 
                color={option.disabled ? '#999' : '#333'} 
              />
              <Text style={[
                styles.menuText,
                option.disabled && styles.disabledMenuText
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 150,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  disabledMenuItem: {
    opacity: 0.5,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
  },
  disabledMenuText: {
    color: '#999',
  },
});

export default DropdownMenu;