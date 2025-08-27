import React, { useState, ReactNode } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface LongPressMenuProps {
  children: ReactNode;
  onEdit: () => void;
  onDelete: () => void;
  menuItems?: Array<{
    label: string;
    icon: string;
    color: string;
    onPress: () => void;
  }>;
}

const LongPressMenu: React.FC<LongPressMenuProps> = ({
  children,
  onEdit,
  onDelete,
  menuItems = [
    {
      label: 'Edit',
      icon: 'edit',
      color: '#FF9500',
      onPress: onEdit,
    },
    {
      label: 'Delete',
      icon: 'delete',
      color: '#FF3B30',
      onPress: onDelete,
    },
  ],
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const handleLongPress = (event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    setMenuPosition({ x: pageX, y: pageY });
    setMenuVisible(true);
  };

  const handleMenuItemPress = (onPress: () => void) => {
    setMenuVisible(false);
    onPress();
  };

  return (
    <>
      <TouchableOpacity
        onLongPress={handleLongPress}
        delayLongPress={5} // 500ms delay for long press
      >
        {children}
      </TouchableOpacity>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.menuContainer,
                {
                  top: menuPosition.y - 100,
                  left: Math.max(10, menuPosition.x - 100),
                },
              ]}
            >
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress(item.onPress)}
                >
                  <MaterialIcons name={item.icon as any} size={20} color={item.color} />
                  <Text style={[styles.menuText, { color: item.color }]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 150,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LongPressMenu;